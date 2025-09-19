/**
 * @file app/context/DataContext.js
 * @description Provides global and department-specific data to the application.
 * Includes all functions for adding and deleting data, and managing constraints.
 * @version 2.3.0
 */

'use client';

import { createContext, useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';

export const DataContext = createContext();

const initialData = {
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
  departments: {
    CSE: {
      name: 'Computer Science & Engineering',
      faculty: [
        { id: 'F01', name: 'Dr. Alan Turing', expertise: ['CS101', 'CS305'], maxLoad: 10, currentLoad: 8 },
        { id: 'F02', name: 'Prof. Ada Lovelace', expertise: ['CS101', 'CS202'], maxLoad: 8, currentLoad: 9 },
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
      analytics: {
        timetableStatus: 'Ready (3 Options)', unresolvedConflicts: 2, classroomUtilization: { theory: 80, labs: 90, overall: 85 },
      },
    },
    ECE: {
      name: 'Electronics & Communication',
      faculty: [
        { id: 'F03', name: 'Dr. Grace Hopper', expertise: ['EC201'], maxLoad: 9, currentLoad: 6 },
        { id: 'F04', name: 'Prof. Claude Shannon', expertise: ['EC201', 'EC401'], maxLoad: 12, currentLoad: 10 },
      ],
      subjects: [
        { id: 'EC201', name: 'Digital Circuits', semester: 3, hours: 4, requiresRoomType: 'Electronics Lab' },
        { id: 'EC401', name: 'Signal Processing', semester: 5, hours: 4 },
      ],
      batches: [{ id: 'ECE24', program: 'UG', semester: 3, strength: 50, subjects: ['EC201'] }],
      analytics: {
        timetableStatus: 'Generated (1 Option)', unresolvedConflicts: 4, classroomUtilization: { theory: 70, labs: 85, overall: 78 },
      },
    },
    ME: {
      name: 'Mechanical Engineering',
      faculty: [
        { id: 'F05', name: 'Dr. James Watt', expertise: ['ME101'], maxLoad: 10, currentLoad: 7 },
        { id: 'F06', name: 'Prof. Nikola Tesla', expertise: ['ME202', 'EE201'], maxLoad: 11, currentLoad: 11 },
      ],
      subjects: [
        { id: 'ME101', name: 'Thermodynamics', semester: 2, hours: 4 },
        { id: 'ME202', name: 'Fluid Mechanics', semester: 4, hours: 4 },
      ],
      batches: [
        { id: 'ME24', program: 'UG', semester: 2, strength: 70, subjects: ['ME101'] },
      ],
      analytics: {
        timetableStatus: 'Conflicts Detected', unresolvedConflicts: 8, classroomUtilization: { theory: 75, labs: 95, overall: 85 },
      },
    },
    // ... other departments can be added here with the same structure
  },
  constraints: {
    maxClassesPerDay: 5,
    maxClassesPerWeek: 20,
    maxConsecutiveFacultyHours: 2,
    maxConsecutiveBatchHours: 3,
    lunchBreak: '12-13',
    pinnedLectures: [],
    facultyUnavailability: {},
    subjectRelations: [],
  },
};

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(initialData);
  const [activeDepartment, setActiveDepartment] = useState('CSE');

  // Generic function to add an item (either global or department-specific)
  const addItem = useCallback((itemType, newItem) => {
    // Basic validation to prevent adding items with duplicate IDs
    const allItems = itemType === 'classrooms' 
        ? data.global.classrooms 
        : data.departments[activeDepartment][itemType];

    if (allItems && allItems.some(item => item.id === newItem.id)) {
        toast.error(`An item with ID '${newItem.id}' already exists.`);
        return;
    }

    setData((prev) => {
      if (itemType === 'classrooms') {
        return { ...prev, global: { ...prev.global, classrooms: [...prev.global.classrooms, newItem] }};
      }
      
      const updatedDepts = { ...prev.departments };
      if(!updatedDepts[activeDepartment][itemType]) {
        updatedDepts[activeDepartment][itemType] = [];
      }
      updatedDepts[activeDepartment][itemType].push(newItem);
      return { ...prev, departments: updatedDepts };
    });
    
    const formattedType = itemType.charAt(0).toUpperCase() + itemType.slice(1, -1);
    toast.success(`${formattedType} '${newItem.id}' added successfully!`);
  }, [activeDepartment, data.global.classrooms, data.departments]);

  // Generic function to delete an item
  const deleteItem = useCallback((itemType, itemId) => {
    setData((prev) => {
      if (itemType === 'classrooms') {
        return { ...prev, global: { ...prev.global, classrooms: prev.global.classrooms.filter(item => item.id !== itemId) }};
      }
      
      const updatedDepts = { ...prev.departments };
      updatedDepts[activeDepartment][itemType] = updatedDepts[activeDepartment][itemType].filter(item => item.id !== itemId);
      return { ...prev, departments: updatedDepts };
    });

    const formattedType = itemType.charAt(0).toUpperCase() + itemType.slice(1, -1);
    toast.success(`${formattedType} '${itemId}' deleted successfully!`);
  }, [activeDepartment]);

  // Specific functions that use the generic handlers for better code reuse
  const addClassroom = useCallback((newItem) => addItem('classrooms', newItem), [addItem]);
  const deleteClassroom = useCallback((id) => deleteItem('classrooms', id), [deleteItem]);
  const addFaculty = useCallback((newItem) => addItem('faculty', newItem), [addItem]);
  const deleteFaculty = useCallback((id) => deleteItem('faculty', id), [deleteItem]);
  const addSubject = useCallback((newItem) => addItem('subjects', newItem), [addItem]);
  const deleteSubject = useCallback((id) => deleteItem('subjects', id), [deleteItem]);
  const addBatch = useCallback((newItem) => addItem('batches', newItem), [addItem]);
  const deleteBatch = useCallback((id) => deleteItem('batches', id), [deleteItem]);
  
  const updateConstraints = useCallback((newValues) => {
    setData((prev) => ({ ...prev, constraints: { ...prev.constraints, ...newValues } }));
    toast.success('Constraints saved successfully!');
  }, []);

  // useMemo ensures that the context value object is only recreated when its dependencies change,
  // preventing unnecessary re-renders of consuming components.
  const value = useMemo(() => ({
    globalData: data.global,
    departmentList: Object.keys(data.departments).map(key => ({ id: key, name: data.departments[key].name })),
    activeDepartmentId: activeDepartment,
    activeDepartmentData: data.departments[activeDepartment],
    constraints: data.constraints,
    analytics: data.departments[activeDepartment].analytics,
    setActiveDepartment,
    updateConstraints,
    addClassroom, deleteClassroom,
    addFaculty, deleteFaculty,
    addSubject, deleteSubject,
    addBatch, deleteBatch,
  }), [data, activeDepartment]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

