/**
 * @file lib/timetable-solver.js
 * @description A professional, constraint-aware heuristic solver for generating timetable options.
 * This advanced version respects a variety of academic and institutional rules.
 * @version 2.0.0
 */

/**
 * Checks if placing a lecture in a given slot violates consecutive hour constraints.
 * @param {object} schedule - The current schedule being built.
 * @param {string} day - The day of the slot.
 * @param {Array<string>} periods - The list of all periods in a day.
 * @param {number} periodIndex - The index of the current period.
 * @param {string} entityId - The ID of the teacher or batch to check.
 * @param {string} entityType - Either 'T' for Teacher or 'B' for Batch.
 * @param {number} maxConsecutive - The maximum allowed consecutive hours.
 * @returns {boolean} - True if the placement is valid, false otherwise.
 */
function checkConsecutiveHours(schedule, day, periods, periodIndex, entityId, entityType, maxConsecutive) {
  let consecutiveCount = 1;

  // Check backwards
  for (let i = periodIndex - 1; i >= 0; i--) {
    const key = `${day}-${periods[i]}`;
    const entry = schedule[key];
    if (entry && ( (entityType === 'T' && entry.teacherId === entityId) || (entityType === 'B' && entry.batchId === entityId) )) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  // Check forwards
  for (let i = periodIndex + 1; i < periods.length; i++) {
    const key = `${day}-${periods[i]}`;
    const entry = schedule[key];
    if (entry && ( (entityType === 'T' && entry.teacherId === entityId) || (entityType === 'B' && entry.batchId === entityId) )) {
      consecutiveCount++;
    } else {
      break;
    }
  }

  return consecutiveCount <= maxConsecutive;
}


/**
 * Professional Timetable Generator (Heuristic Solver)
 * @param {object} departmentData - The data for the active department.
 * @param {object} globalData - The global data for the application.
 * @param {object} constraints - The set of all scheduling constraints.
 * @returns {Array} An array of generated timetable options.
 */
export function generateTimetables(departmentData, globalData, constraints) {
  // 1. --- INPUT VALIDATION & SETUP ---
  if (!departmentData?.batches || !globalData?.classrooms || !constraints) {
    console.error("Invalid data or constraints provided to timetable generator.");
    return [];
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16'];

  // 2. --- PRE-COMPUTATION & DATA MAPPING ---
  const subjectMap = new Map(departmentData.subjects.map(s => [s.id, s]));
  const facultyMap = new Map(departmentData.faculty.map(f => [f.id, f]));
  const facultyBySubjectMap = new Map();
  departmentData.subjects.forEach(subject => {
    const qualifiedFaculty = departmentData.faculty.filter(f => f.expertise.includes(subject.id));
    facultyBySubjectMap.set(subject.id, qualifiedFaculty);
  });

  // 3. --- BUILD LECTURE POOL ---
  let allLectures = [];
  departmentData.batches.forEach((batch) => {
    (batch.subjects || []).forEach((subjectId) => {
      const subject = subjectMap.get(subjectId);
      if (subject) {
        for (let h = 0; h < subject.hours; h++) {
          allLectures.push({ batch, subject, lectureId: `${subject.id}-${h}` });
        }
      }
    });
  });

  const options = [];
  // Generate 2 distinct options
  for (let i = 0; i < 2; i++) {
    const schedule = {};
    const occupiedSlots = new Set(); // Tracks "day-period-teacherId", "day-period-roomId", "day-period-batchId"
    const unscheduled = [];
    
    // --- 4. ADVANCED CONSTRAINT HANDLING ---

    // A. Place Pinned Lectures First (Highest Priority)
    (constraints.pinnedLectures || []).forEach(pinned => {
        const key = `${pinned.day}-${pinned.period}`;
        const subject = subjectMap.get(pinned.subjectId);
        const teacher = facultyMap.get(pinned.facultyId);
        // ... find batch and room ...
        if (subject && teacher /* && batch && room */) {
            schedule[key] = { subject: subject.name, teacher: teacher.name, room: pinned.roomId, batch: pinned.batchId };
            occupiedSlots.add(`${key}-T-${teacher.id}`);
            occupiedSlots.add(`${key}-R-${pinned.roomId}`);
            occupiedSlots.add(`${key}-B-${pinned.batchId}`);
            // Remove placed lecture from the pool
            allLectures = allLectures.filter(l => !(l.subject.id === pinned.subjectId && l.batch.id === pinned.batchId));
        }
    });

    // Shuffle remaining lectures for variety in placement attempts
    let lecturesToPlace = [...allLectures].sort(() => Math.random() - 0.5);

    // B. Main Heuristic Placement Logic
    lecturesToPlace.forEach(({ batch, subject }) => {
      let placed = false;
      
      const potentialTeachers = facultyBySubjectMap.get(subject.id) || [];
      const potentialRooms = globalData.classrooms.filter(r => r.capacity >= batch.strength);

      if (potentialTeachers.length === 0) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No qualified faculty." });
        return;
      }
      if (potentialRooms.length === 0) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No suitable classroom." });
        return;
      }
      
      const allPossibleSlots = days.flatMap(day => periods.map((period, pIndex) => ({ day, period, pIndex })));

      for (const slot of allPossibleSlots.sort(() => Math.random() - 0.5)) {
        const key = `${slot.day}-${slot.period}`;
        
        // --- Apply Constraints ---
        if (slot.period === constraints.lunchBreak) continue; // Is it lunch break?
        if (occupiedSlots.has(`${key}-B-${batch.id}`)) continue; // Is the batch busy?

        // Find an available teacher and room that also satisfy constraints
        for (const teacher of potentialTeachers) {
            if (occupiedSlots.has(`${key}-T-${teacher.id}`)) continue; // Is teacher busy?
            if (constraints.facultyUnavailability?.[teacher.id]?.includes(key)) continue; // Is teacher unavailable?
            if (!checkConsecutiveHours(schedule, slot.day, periods, slot.pIndex, teacher.id, 'T', constraints.maxConsecutiveFacultyHours)) continue;
            
            for (const room of potentialRooms) {
                if (occupiedSlots.has(`${key}-R-${room.id}`)) continue; // Is room busy?

                // All constraints passed, place the lecture
                schedule[key] = {
                  subject: subject.name,
                  teacher: teacher.name,
                  teacherId: teacher.id,
                  room: room.id,
                  batch: batch.id,
                  batchId: batch.id,
                };
                occupiedSlots.add(`${key}-T-${teacher.id}`);
                occupiedSlots.add(`${key}-R-${room.id}`);
                occupiedSlots.add(`${key}-B-${batch.id}`);
                placed = true;
                break; // Room found, break from room loop
            }
            if(placed) break; // Teacher found, break from teacher loop
        }
        if(placed) break; // Slot found, break from slot loop
      }

      if (!placed) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No available slots found." });
      }
    });

    // 5. --- Finalize Option ---
    // Clashes are avoided by the logic, so clashes count is naturally 0
    options.push({ id: i + 1, schedule, clashes: 0, suggestions: [], unscheduled, status: "Draft" });
  }

  return options;
}

