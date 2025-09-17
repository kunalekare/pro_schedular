'use client';

import { useState, useContext } from 'react';
import { DataContext } from '@/app/context/DataContext';
import { AuthContext } from '@/app/context/AuthContext';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Select } from '@/app/components/ui/Select';
import toast from 'react-hot-toast';
import { PlusCircle } from 'lucide-react';

// The available tabs in the management view
const TABS = ['Classrooms', 'Faculty', 'Subjects', 'Batches'];

/**
 * ManagementTabs Component
 * A complex UI for viewing and adding data for classrooms (global) or
 * faculty, subjects, and batches (scoped to the active department).
 * Includes Role-Based Access Control to disable forms for certain user roles.
 */
export default function ManagementTabs() {
    const [activeTab, setActiveTab] = useState(TABS[0]);
    
    // Get user role to conditionally disable forms
    const { user } = useContext(AuthContext);
    
    // Get the new department-aware data and functions from the context
    const { 
        globalData, 
        activeDepartmentData, 
        activeDepartmentId,
        addClassroom, 
        addFaculty,
        addSubject,
        addBatch
    } = useContext(DataContext);
    
    // Determine if the current user is authorized to edit data
    const isAuthorized = user?.role === 'Admin' || user?.role === 'Scheduler';

    /**
     * Handles form submission, parsing data, and calling the correct context function.
     */
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (!isAuthorized) {
            toast.error("You don't have permission to perform this action.");
            return;
        }

        const formData = new FormData(e.target);
        const values = Object.fromEntries(formData.entries());
        
        try {
            switch(activeTab) {
                case 'Classrooms': 
                    addClassroom({ ...values, capacity: parseInt(values.capacity) }); 
                    break;
                case 'Faculty': 
                    addFaculty({ ...values, expertise: values.expertise.split(',').map(s=>s.trim()), maxLoad: parseInt(values.maxLoad)}); 
                    break;
                case 'Subjects':
                    addSubject({ ...values, semester: parseInt(values.semester), hours: parseInt(values.hours) });
                    break;
                case 'Batches':
                    addBatch({ ...values, semester: parseInt(values.semester), strength: parseInt(values.strength), subjects: values.subjects.split(',').map(s=>s.trim())});
                    break;
            }
            e.target.reset();
        } catch(error) {
            console.error("Form submission error:", error);
            toast.error("Failed to add item. Please check the data.");
        }
    };
    
    // Determine which data to show in the table based on the active tab
    const tableData = activeTab === 'Classrooms' ? globalData.classrooms : activeDepartmentData[activeTab.toLowerCase()];
    const tableHeaders = Object.keys(tableData[0] || {});

    return (
        <div>
            {/* Tab Navigation */}
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {TABS.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="pt-6">
                {/* Form Section with Role-Based Disabling */}
                <fieldset disabled={!isAuthorized} className="disabled:opacity-70">
                    <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg mb-6">
                        <h3 className="text-lg font-semibold text-blue-800">
                            Add New {activeTab.slice(0,-1)} {activeTab !== 'Classrooms' && `to ${activeDepartmentData.name}`}
                        </h3>
                        {!isAuthorized && <p className="text-sm text-yellow-800 mt-1">Viewing as Faculty. Data modification is disabled.</p>}
                        
                        <form onSubmit={handleFormSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                            {/* Dynamically rendered forms */}
                            {activeTab === 'Classrooms' && <>
                                <div><Label>Room ID</Label><Input name="id" placeholder="e.g., R101" required /></div>
                                <div><Label>Capacity</Label><Input name="capacity" type="number" placeholder="e.g., 60" required /></div>
                                <div><Label>Type</Label><Select name="type"><option>Lecture Hall</option><option>Computer Lab</option></Select></div>
                            </>}
                            {activeTab === 'Faculty' && <>
                                <div><Label>Faculty ID</Label><Input name="id" placeholder="e.g., F04" required /></div>
                                <div><Label>Name</Label><Input name="name" placeholder="Dr. Jane Doe" required /></div>
                                <div><Label>Expertise (comma-sep.)</Label><Input name="expertise" placeholder="CS101, MA210" required /></div>
                                <div><Label>Max Load</Label><Input name="maxLoad" type="number" placeholder="e.g., 10" required /></div>
                            </>}
                            {activeTab === 'Subjects' && <>
                                 <div><Label>Subject Code</Label><Input name="id" placeholder="e.g., CS102" required /></div>
                                 <div><Label>Subject Name</Label><Input name="name" placeholder="Algorithms" required /></div>
                                 <div><Label>Semester</Label><Input name="semester" type="number" placeholder="e.g., 2" required /></div>
                                 <div><Label>Weekly Hours</Label><Input name="hours" type="number" placeholder="e.g., 3" required /></div>
                            </>}
                             {activeTab === 'Batches' && <>
                                <div><Label>Batch ID</Label><Input name="id" placeholder="e.g., B_CSE26" required /></div>
                                <div><Label>Program</Label><Select name="program"><option>UG</option><option>PG</option></Select></div>
                                <div><Label>Strength</Label><Input name="strength" type="number" placeholder="e.g., 60" required /></div>
                                <div><Label>Subjects (comma-sep.)</Label><Input name="subjects" placeholder="CS102" required /></div>
                            </>}
                            <div className="lg:col-start-4">
                                <Button type="submit" className="w-full justify-center">
                                    <PlusCircle className="w-5 h-5 mr-2" />
                                    Add {activeTab.slice(0, -1)}
                                </Button>
                            </div>
                        </form>
                    </div>
                </fieldset>

                {/* Table Section */}
                <div className="mt-8">
                    <h3 className="text-lg font-semibold">Existing {activeTab} {activeTab !== 'Classrooms' && `in ${activeDepartmentData.name}`}</h3>
                    <div className="overflow-x-auto mt-2 border border-border rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {tableHeaders.map(key => <th key={key} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{key}</th>)}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {tableData.length > 0 ? tableData.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        {Object.values(item).map((val, vIdx) => <td key={vIdx} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{Array.isArray(val) ? val.join(', ') : val}</td>)}
                                    </tr>
                                )) : (
                                    <tr><td colSpan={tableHeaders.length} className="text-center p-4 text-gray-500">No data available for this department.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}