'use client';
import { createContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const DataContext = createContext();

// ======================================================================
// ✅ NEW, EXPANDED INITIAL DATA WITH ALL YOUR REQUESTED DEPARTMENTS
// ======================================================================
const initialData = {
  // Global data is shared across all departments
  global: {
    classrooms: [
      { id: 'R101', capacity: 100, type: 'Lecture Hall' },
      { id: 'R102', capacity: 100, type: 'Lecture Hall' },
      { id: 'L205', capacity: 40, type: 'Computer Lab' },
      { id: 'L206', capacity: 40, type: 'Computer Lab' },
      { id: 'S301', capacity: 30, type: 'Seminar Room' },
      { id: 'E-Lab', capacity: 40, type: 'Electronics Lab' },
      { id: 'M-Lab', capacity: 50, type: 'Mechanical Lab' },
    ],
  },
  // Department-specific data is nested under a unique key (e.g., 'CSE')
  departments: {
    'CSE': {
      name: 'Computer Science & Engineering',
      faculty: [
        { id: 'F01', name: 'Dr. Alan Turing', expertise: ['CS101', 'CS305'], maxLoad: 10 },
        { id: 'F02', name: 'Prof. Ada Lovelace', expertise: ['CS101', 'CS202'], maxLoad: 8 },
      ],
      subjects: [
        { id: 'CS101', name: 'Intro to Programming', semester: 1, hours: 4 },
        { id: 'CS202', name: 'Data Structures', semester: 3, hours: 4 },
        { id: 'CS305', name: 'Artificial Intelligence', semester: 5, hours: 3 },
      ],
      batches: [
        { id: 'CSE25', program: 'UG', semester: 1, strength: 60, subjects: ['CS101'] },
        { id: 'CSE23', program: 'UG', semester: 5, strength: 55, subjects: ['CS305'] },
      ],
    },
    'IT': {
      name: 'Information Technology',
      faculty: [], subjects: [], batches: [],
    },
    'ECE': {
      name: 'Electronics & Communication',
      faculty: [
        { id: 'F03', name: 'Dr. Grace Hopper', expertise: ['EC201'], maxLoad: 9 },
        { id: 'F04', name: 'Prof. Claude Shannon', expertise: ['EC201', 'EC401'], maxLoad: 12 },
      ],
      subjects: [
        { id: 'EC201', name: 'Digital Circuits', semester: 3, hours: 4, requiresRoomType: 'Electronics Lab' },
        { id: 'EC401', name: 'Signal Processing', semester: 5, hours: 4 },
      ],
      batches: [
        { id: 'ECE24', program: 'UG', semester: 3, strength: 50, subjects: ['EC201'] },
      ],
    },
    'EE': {
        name: 'Electrical Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'ME': {
        name: 'Mechanical Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'CE': {
        name: 'Civil Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'CHEM': {
        name: 'Chemical Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'AERO': {
        name: 'Aerospace Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'BIO': {
        name: 'Biomedical Engineering',
        faculty: [], subjects: [], batches: [],
    },
    'AIDS': {
        name: 'Artificial Intelligence & Data Science',
        faculty: [], subjects: [], batches: [],
    },
    'ROBO': {
        name: 'Robotics & Automation',
        faculty: [], subjects: [], batches: [],
    },
  },
  constraints: {
    maxClassesPerDay: 5,
  },
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [activeDepartment, setActiveDepartment] = useState('CSE'); 

  const updateConstraints = useCallback((newValues) => {
    setData((prev) => ({
      ...prev,
      constraints: { ...prev.constraints, ...newValues },
    }));
    toast.success('Constraints updated successfully!');
  }, []);

  const addItemToActiveDepartment = useCallback((itemType, newItem) => {
    setData((prev) => {
        const updatedDepts = { ...prev.departments };
        updatedDepts[activeDepartment][itemType].push(newItem);
        return { ...prev, departments: updatedDepts };
    });
    const formattedType = itemType.charAt(0).toUpperCase() + itemType.slice(1, -1);
    toast.success(`${formattedType} added to ${activeDepartment} department!`);
  }, [activeDepartment]);

  const addFaculty = useCallback((newFaculty) => addItemToActiveDepartment('faculty', newFaculty), [addItemToActiveDepartment]);
  const addSubject = useCallback((newSubject) => addItemToActiveDepartment('subjects', newSubject), [addItemToActiveDepartment]);
  const addBatch = useCallback((newBatch) => addItemToActiveDepartment('batches', newBatch), [addItemToActiveDepartment]);

  const addClassroom = useCallback((newClassroom) => {
    setData((prev) => ({
      ...prev,
      global: { ...prev.global, classrooms: [...prev.global.classrooms, newClassroom] },
    }));
    toast.success('Classroom added successfully!');
  }, []);

  const value = useMemo(() => {
    const departmentList = Object.keys(data.departments).map(key => ({
        id: key,
        name: data.departments[key].name,
    }));
    
    const activeDepartmentData = data.departments[activeDepartment];
    
    return {
      globalData: data.global,
      departmentList,
      activeDepartmentId: activeDepartment,
      activeDepartmentData,
      constraints: data.constraints,
      setActiveDepartment,
      updateConstraints,
      addClassroom,
      addFaculty,
      addSubject,
      addBatch,
    };
  }, [data, activeDepartment]); // Simplified dependencies for clarity

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};