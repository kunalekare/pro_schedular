/**
 * Professional Prototype Timetable Generator (Heuristic Solver)
 * * This is an advanced mock solver for demonstration purposes. It reads institutional
 * data for a specific department and generates several timetable options.
 * * @param {object} departmentData - The data for the active department.
 * @param {Array} departmentData.faculty - List of faculty with their expertise.
 * @param {Array} departmentData.subjects - List of subjects with required hours.
 * @param {Array} departmentData.batches - List of student batches and their assigned subjects.
 * @param {object} globalData - The global data for the application.
 * @param {Array} globalData.classrooms - List of all available classrooms.
 * @returns {Array} An array of generated timetable options, each with a schedule,
 * list of clashes, and list of unscheduled lectures.
 */
export function generateTimetables(departmentData, globalData) {
  // 1. --- INPUT VALIDATION ---
  // A professional function should always validate its inputs first.
  if (!departmentData?.batches || !globalData?.classrooms) {
    console.error("Invalid data provided to timetable generator. Missing batches or classrooms.");
    return [];
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const periods = ['09-10', '10-11', '11-12', '13-14', '14-15', '15-16'];

  // 2. --- PRE-COMPUTATION & OPTIMIZATION ---
  // Create Maps for fast lookups (O(1) access time vs. O(n) for array.find()).
  const subjectMap = new Map(departmentData.subjects.map(s => [s.id, s]));
  
  const facultyBySubjectMap = new Map();
  departmentData.subjects.forEach(subject => {
    const qualifiedFaculty = departmentData.faculty.filter(f => f.expertise.includes(subject.id));
    facultyBySubjectMap.set(subject.id, qualifiedFaculty);
  });

  // 3. --- BUILD LECTURE POOL ---
  // Create a flat list of all individual lecture hours that need to be scheduled.
  const allLectures = [];
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
  for (let i = 0; i < 2; i++) { // Generate 2 distinct options
    const schedule = {};
    const occupiedSlots = new Set(); // Tracks conflicts: "day-period-teacherId", etc.
    const unscheduled = [];
    
    // Shuffle the lectures for the second option to create variety.
    const lecturesToPlace = i === 0 ? [...allLectures] : [...allLectures].sort(() => Math.random() - 0.5);

    // 4. --- HEURISTIC PLACEMENT LOGIC ---
    lecturesToPlace.forEach(({ batch, subject }) => {
      let placed = false;
      
      const potentialTeachers = facultyBySubjectMap.get(subject.id) || [];
      const potentialRooms = globalData.classrooms.filter(r => 
        (!subject.requiresRoomType || r.type === subject.requiresRoomType) && r.capacity >= batch.strength
      );

      if (potentialTeachers.length === 0) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No qualified faculty available." });
        return; // Skip this lecture
      }
      if (potentialRooms.length === 0) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No suitable classroom found." });
        return; // Skip this lecture
      }
      
      // Iterate through shuffled slots for better distribution than pure random attempts.
      const allPossibleSlots = days.flatMap(day => periods.map(period => ({ day, period })));
      allPossibleSlots.sort(() => Math.random() - 0.5);

      for (const slot of allPossibleSlots) {
        const key = `${slot.day}-${slot.period}`;
        
        // Try to find an available teacher and room for this slot
        const teacher = potentialTeachers.find(t => !occupiedSlots.has(`${key}-T-${t.id}`));
        const room = potentialRooms.find(r => !occupiedSlots.has(`${key}-R-${r.id}`));
        const isBatchBusy = occupiedSlots.has(`${key}-B-${batch.id}`);
        
        if (teacher && room && !isBatchBusy) {
          schedule[key] = {
            subject: subject.name,
            teacher: teacher.name,
            room: room.id,
            batch: batch.id,
          };
          occupiedSlots.add(`${key}-T-${teacher.id}`);
          occupiedSlots.add(`${key}-R-${room.id}`);
          occupiedSlots.add(`${key}-B-${batch.id}`);
          placed = true;
          break; // Lecture placed, move to the next one
        }
      }

      if (!placed) {
        unscheduled.push({ subject: subject.name, batch: batch.id, reason: "No available time slots found." });
      }
    });

    // 5. --- SIMULATE CLASHES & SUGGESTIONS FOR DEMO ---
    // For the second option, intentionally create a clash to demonstrate the UI feature.
    let clashes = 0;
    let suggestions = [];
    if (i > 0 && Object.keys(schedule).length > 5) {
      const scheduleKeys = Object.keys(schedule);
      const moveFromKey = scheduleKeys[0];
      const moveToKey = scheduleKeys[1];
      
      const originalEntry = schedule[moveToKey];
      const conflictingEntry = schedule[moveFromKey];

      // Create a clash by overwriting an existing slot
      schedule[moveToKey] = { ...conflictingEntry, isClash: true, original: originalEntry };
      delete schedule[moveFromKey];
      clashes = 1;
      suggestions.push(`Resolve conflict for "${conflictingEntry.subject}" and "${originalEntry.subject}" in slot ${moveToKey}. Try moving one to an empty slot.`);
    }

    options.push({ id: i, schedule, clashes, suggestions, unscheduled, status: "Draft" });
  }

  return options;
}