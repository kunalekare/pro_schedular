'use client';

import React, { useState, useContext } from 'react';
import { DataContext } from '@/app/context/DataContext';
import { AuthContext } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/Select';
import { PlusCircle, Trash2 } from 'lucide-react';

// ======================================================================
// Reusable Table Component
// ======================================================================
const DataTable = ({ columns, data, onDelete, isAuthorized }) => (
  <div className="overflow-x-auto mt-6 border border-border rounded-lg">
    <table className="min-w-full divide-y divide-border dark:divide-gray-700">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          {columns.map((col) => (
            <th key={col.key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {col.header}
            </th>
          ))}
          {isAuthorized && <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-border dark:divide-gray-700">
        {data && data.length > 0 ? data.map((item) => (
          <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            {columns.map((col) => (
              <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                {Array.isArray(item[col.key]) ? item[col.key].join(', ') : String(item[col.key])}
              </td>
            ))}
            {isAuthorized && (
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button variant="destructive" size="icon" onClick={() => onDelete(item.id, item.name || item.id)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete {item.id}</span>
                </Button>
              </td>
            )}
          </tr>
        )) : (
          <tr>
            <td colSpan={columns.length + (isAuthorized ? 1 : 0)} className="text-center p-4 text-gray-500">
              No data available for this selection.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

// ======================================================================
// Individual Tab Components (with Forms & Tables)
// ======================================================================

const ClassroomsTab = ({ isAuthorized }) => {
  const { globalData, addClassroom, deleteClassroom } = useContext(DataContext);
  const [id, setId] = useState('');
  const [capacity, setCapacity] = useState('60');
  const [type, setType] = useState('Lecture Hall');

  const handleSubmit = (e) => {
    e.preventDefault();
    addClassroom({ id, capacity: parseInt(capacity), type });
    setId(''); setCapacity('60');
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete classroom ${name}?`)) deleteClassroom(id);
  };

  const columns = [{ key: 'id', header: 'Room ID' }, { key: 'capacity', header: 'Capacity' }, { key: 'type', header: 'Type' }];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div><Label htmlFor="c-id">Room ID</Label><Input id="c-id" value={id} onChange={(e) => setId(e.target.value)} placeholder="e.g., R101" required /></div>
        <div><Label htmlFor="c-cap">Capacity</Label><Input id="c-cap" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} required /></div>
        <div><Label>Type</Label>
          <Select onValueChange={setType} value={type}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
              <SelectItem value="Computer Lab">Computer Lab</SelectItem>
              <SelectItem value="Electronics Lab">Electronics Lab</SelectItem>
              <SelectItem value="Mechanical Lab">Mechanical Lab</SelectItem>
              <SelectItem value="Seminar Room">Seminar Room</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full justify-center"><PlusCircle className="w-5 h-5 mr-2" />Add</Button>
      </div>
      <DataTable columns={columns} data={globalData.classrooms} onDelete={handleDelete} isAuthorized={isAuthorized} />
    </form>
  );
};

const FacultyTab = ({ isAuthorized }) => {
  const { activeDepartmentData, addFaculty, deleteFaculty } = useContext(DataContext);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [expertise, setExpertise] = useState('');
  const [maxLoad, setMaxLoad] = useState('10');

  const handleSubmit = (e) => {
    e.preventDefault();
    addFaculty({ id, name, expertise: expertise.split(',').map(s => s.trim()), maxLoad: parseInt(maxLoad), currentLoad: 0 });
    setId(''); setName(''); setExpertise(''); setMaxLoad('10');
  };
  
  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete faculty member ${name}?`)) deleteFaculty(id);
  };
  
  const columns = [{ key: 'id', header: 'ID' }, { key: 'name', header: 'Name' }, { key: 'expertise', header: 'Expertise (Courses)' }, { key: 'maxLoad', header: 'Max Weekly Load' }];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div><Label htmlFor="f-id">Faculty ID</Label><Input id="f-id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="e.g., F05"/></div>
            <div className="md:col-span-2"><Label htmlFor="f-name">Name</Label><Input id="f-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Dr. Grace Hopper"/></div>
            <div><Label htmlFor="f-exp">Expertise (comma-sep.)</Label><Input id="f-exp" value={expertise} onChange={(e) => setExpertise(e.target.value)} required placeholder="e.g., CS101, CS202"/></div>
            <div><Label htmlFor="f-load">Max Load</Label><Input id="f-load" type="number" value={maxLoad} onChange={(e) => setMaxLoad(e.target.value)} required /></div>
            <Button type="submit" className="w-full justify-center md:col-start-5"><PlusCircle className="w-5 h-5 mr-2" />Add</Button>
        </div>
        <DataTable columns={columns} data={activeDepartmentData.faculty} onDelete={handleDelete} isAuthorized={isAuthorized} />
    </form>
  );
};

const SubjectsTab = ({ isAuthorized }) => {
    const { activeDepartmentData, addSubject, deleteSubject } = useContext(DataContext);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [semester, setSemester] = useState('1');
    const [hours, setHours] = useState('3');

    const handleSubmit = (e) => {
        e.preventDefault();
        addSubject({ id, name, semester: parseInt(semester), hours: parseInt(hours) });
        setId(''); setName(''); setSemester('1'); setHours('3');
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete subject ${name}?`)) deleteSubject(id);
    };

    const columns = [{ key: 'id', header: 'Code' }, { key: 'name', header: 'Name' }, { key: 'semester', header: 'Semester' }, { key: 'hours', header: 'Weekly Hours' }];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div><Label htmlFor="s-id">Subject Code</Label><Input id="s-id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="e.g., CS305"/></div>
                <div className="md:col-span-2"><Label htmlFor="s-name">Subject Name</Label><Input id="s-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="e.g., Artificial Intelligence"/></div>
                <div><Label htmlFor="s-sem">Semester</Label><Input id="s-sem" type="number" value={semester} onChange={(e) => setSemester(e.target.value)} required /></div>
                <div><Label htmlFor="s-hrs">Weekly Hours</Label><Input id="s-hrs" type="number" value={hours} onChange={(e) => setHours(e.target.value)} required /></div>
                <Button type="submit" className="w-full justify-center md:col-start-5"><PlusCircle className="w-5 h-5 mr-2" />Add</Button>
            </div>
            <DataTable columns={columns} data={activeDepartmentData.subjects} onDelete={handleDelete} isAuthorized={isAuthorized} />
        </form>
    );
};

const BatchesTab = ({ isAuthorized }) => {
    const { activeDepartmentData, addBatch, deleteBatch } = useContext(DataContext);
    const [id, setId] = useState('');
    const [program, setProgram] = useState('UG');
    const [semester, setSemester] = useState('1');
    const [strength, setStrength] = useState('60');
    const [subjects, setSubjects] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        addBatch({ id, program, semester: parseInt(semester), strength: parseInt(strength), subjects: subjects.split(',').map(s => s.trim()) });
        setId(''); setProgram('UG'); setSemester('1'); setStrength('60'); setSubjects('');
    };

    const handleDelete = (id, name) => {
        if (window.confirm(`Are you sure you want to delete batch ${name}?`)) deleteBatch(id);
    };

    const columns = [{ key: 'id', header: 'Batch ID' }, { key: 'program', header: 'Program' }, { key: 'semester', header: 'Semester' }, { key: 'strength', header: 'Strength' }, { key: 'subjects', header: 'Subjects' }];
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div><Label htmlFor="b-id">Batch ID</Label><Input id="b-id" value={id} onChange={(e) => setId(e.target.value)} required placeholder="e.g., CSE25"/></div>
                <div><Label>Program</Label>
                    <Select onValueChange={setProgram} value={program}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent><SelectItem value="UG">UG</SelectItem><SelectItem value="PG">PG</SelectItem></SelectContent>
                    </Select>
                </div>
                <div><Label htmlFor="b-sem">Semester</Label><Input id="b-sem" type="number" value={semester} onChange={(e) => setSemester(e.target.value)} required /></div>
                <div><Label htmlFor="b-str">Strength</Label><Input id="b-str" type="number" value={strength} onChange={(e) => setStrength(e.target.value)} required /></div>
                <div className="w-full md:col-span-2"><Label htmlFor="b-subj">Subjects (comma-sep.)</Label><Input id="b-subj" value={subjects} onChange={(e) => setSubjects(e.target.value)} required placeholder="e.g., CS101, MA101"/></div>
                <Button type="submit" className="w-full justify-center md:col-start-5"><PlusCircle className="w-5 h-5 mr-2" />Add</Button>
            </div>
            <DataTable columns={columns} data={activeDepartmentData.batches} onDelete={handleDelete} isAuthorized={isAuthorized} />
        </form>
    );
};

// ======================================================================
// Main Management Component
// ======================================================================
const TABS = ['Classrooms', 'Faculty', 'Subjects', 'Batches'];

export default function ManagementTabs() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { user } = useContext(AuthContext);
  const { activeDepartmentData } = useContext(DataContext);
  const isAuthorized = user?.role === 'Admin' || user?.role === 'Scheduler';

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Classrooms': return <ClassroomsTab isAuthorized={isAuthorized} />;
      case 'Faculty': return <FacultyTab isAuthorized={isAuthorized} />;
      case 'Subjects': return <SubjectsTab isAuthorized={isAuthorized} />;
      case 'Batches': return <BatchesTab isAuthorized={isAuthorized} />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <fieldset disabled={!isAuthorized} className="disabled:opacity-60 disabled:cursor-not-allowed">
        <div className="p-4 border border-border bg-card rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Manage {activeTab}
            {activeTab !== 'Classrooms' && ( <span className="text-base font-normal text-gray-500 dark:text-gray-400"> for {activeDepartmentData.name}</span>)}
          </h3>
          {!isAuthorized && <p className="text-xs text-yellow-600 mt-1">Viewing as Faculty. Data modification is disabled.</p>}
          <div className="mt-4">{renderTabContent()}</div>
        </div>
      </fieldset>
    </div>
  );
}

