/**
 * @file app/dashboard/constraints/page.js
 * @description An advanced UI for managing global, faculty, student, and resource constraints
 * to generate highly optimized timetables.
 * @version 2.2.1
 */

'use client';

import React, { useState, useContext, useEffect } from 'react';
import { DataContext } from '@/app/context/DataContext';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/Card';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { Checkbox } from '@/app/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/app/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/Tooltip';
import { Save, Pin, Trash2, Link } from 'lucide-react';
import toast from 'react-hot-toast';

// Constants for UI rendering
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = ['09-10', '10-11', '11-12', '12-13', '13-14', '15-16'];

export default function ConstraintsPage() {
  const { constraints, updateConstraints, activeDepartmentData, globalData } = useContext(DataContext);
  
  const [localConstraints, setLocalConstraints] = useState(constraints);
  const [pinForm, setPinForm] = useState({ subjectId: '', facultyId: '', batchId: '', roomId: '', day: '', period: '' });
  const [relationForm, setRelationForm] = useState({ subjectA: '', subjectB: '', type: 'Cannot Overlap' });

  useEffect(() => {
    setLocalConstraints(constraints);
  }, [constraints]);

  const handleConstraintChange = (key, value) => {
    setLocalConstraints(prev => ({ ...prev, [key]: value }));
  };
  
  const handleAvailabilityChange = (facultyId, day, period, isUnavailable) => {
    const key = `${day}-${period}`;
    const currentUnavailability = localConstraints.facultyUnavailability || {};
    const facultySlots = currentUnavailability[facultyId] || [];
    
    const newSlots = isUnavailable 
      ? [...new Set([...facultySlots, key])] 
      : facultySlots.filter(slot => slot !== key);
    
    setLocalConstraints(prev => ({
      ...prev,
      facultyUnavailability: { ...currentUnavailability, [facultyId]: newSlots }
    }));
  };

  const handleAddPin = (e) => {
    e.preventDefault();
    if (Object.values(pinForm).some(v => v === '')) {
        toast.error("Please fill all fields to pin a lecture.");
        return;
    }
    const newPin = { ...pinForm, id: Date.now().toString() };
    const updatedPins = [...(localConstraints.pinnedLectures || []), newPin];
    setLocalConstraints(prev => ({ ...prev, pinnedLectures: updatedPins }));
    setPinForm({ subjectId: '', facultyId: '', batchId: '', roomId: '', day: '', period: '' });
    toast.success('Pinned lecture added to the list.');
  };
  
  const handleDeletePin = (pinId) => {
    const updatedPins = localConstraints.pinnedLectures.filter(pin => pin.id !== pinId);
    setLocalConstraints(prev => ({ ...prev, pinnedLectures: updatedPins }));
    toast.success('Pinned lecture removed from the list.');
  };

  const handleAddRelation = (e) => {
    e.preventDefault();
    if (!relationForm.subjectA || !relationForm.subjectB || relationForm.subjectA === relationForm.subjectB) {
        toast.error("Please select two different subjects for the relation.");
        return;
    }
    const newRelation = { ...relationForm, id: Date.now().toString() };
    const updatedRelations = [...(localConstraints.subjectRelations || []), newRelation];
    setLocalConstraints(prev => ({...prev, subjectRelations: updatedRelations}));
    setRelationForm({ subjectA: '', subjectB: '', type: 'Cannot Overlap' });
    toast.success('Subject relationship added.');
  };

  const handleDeleteRelation = (relationId) => {
      const updatedRelations = localConstraints.subjectRelations.filter(rel => rel.id !== relationId);
      setLocalConstraints(prev => ({...prev, subjectRelations: updatedRelations}));
      toast.success('Subject relationship removed.');
  };

  const handleSaveAll = () => {
    updateConstraints(localConstraints);
  };

  const subjectOptions = React.useMemo(() => activeDepartmentData.subjects.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.id})</SelectItem>), [activeDepartmentData.subjects]);
  const facultyOptions = React.useMemo(() => activeDepartmentData.faculty.map(f => <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>), [activeDepartmentData.faculty]);
  const batchOptions = React.useMemo(() => activeDepartmentData.batches.map(b => <SelectItem key={b.id} value={b.id}>{b.id}</SelectItem>), [activeDepartmentData.batches]);
  const roomOptions = React.useMemo(() => globalData.classrooms.map(r => <SelectItem key={r.id} value={r.id}>{r.id} (Cap: {r.capacity})</SelectItem>), [globalData.classrooms]);
  const dayOptions = React.useMemo(() => DAYS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>), []);
  const periodOptions = React.useMemo(() => PERIODS.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>), []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Constraint Management</h1>
        <p className="text-muted-foreground mt-2">Define the rules for scheduling to get the most optimized results.</p>
      </div>

      <Card>
        <CardHeader>
            <CardTitle>Global Scheduling Rules</CardTitle>
            <CardDescription>These rules apply university-wide to all departments and faculties.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2"><Label>Max Classes Per Day (Batch)</Label><Input type="number" value={localConstraints.maxClassesPerDay} onChange={(e) => handleConstraintChange('maxClassesPerDay', parseInt(e.target.value))} /></div>
          <div className="space-y-2"><Label>Max Classes Per Week (Faculty)</Label><Input type="number" value={localConstraints.maxClassesPerWeek} onChange={(e) => handleConstraintChange('maxClassesPerWeek', parseInt(e.target.value))} /></div>
          <div className="space-y-2"><Label>Max Consecutive Hours (Faculty)</Label><Input type="number" value={localConstraints.maxConsecutiveFacultyHours} onChange={(e) => handleConstraintChange('maxConsecutiveFacultyHours', parseInt(e.target.value))} /></div>
          <div className="space-y-2"><Label>Max Consecutive Hours (Batch)</Label><Input type="number" value={localConstraints.maxConsecutiveBatchHours} onChange={(e) => handleConstraintChange('maxConsecutiveBatchHours', parseInt(e.target.value))} /></div>
          <div className="space-y-2"><Label>Mandatory Lunch Break</Label>
            <Select onValueChange={(v) => handleConstraintChange('lunchBreak', v)} value={localConstraints.lunchBreak}>
              <SelectTrigger><SelectValue/></SelectTrigger>
              <SelectContent>{periodOptions}</SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Faculty Availability</CardTitle>
            <CardDescription>Select the time slots when faculty members are <span className="font-semibold text-destructive">unavailable</span> to teach. This applies to the <span className="font-semibold text-primary">{activeDepartmentData.name}</span> department.</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px] min-w-[200px]">Faculty</TableHead>
                        {DAYS.map(day => <TableHead key={day} className="text-center min-w-[200px]">{day}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {activeDepartmentData?.faculty?.map(faculty => (
                        <TableRow key={faculty.id}>
                            <TableCell className="font-medium">{faculty.name}</TableCell>
                            {DAYS.map(day => (
                                <TableCell key={day}>
                                    <div className="flex justify-center flex-wrap gap-x-4 gap-y-2">
                                        {PERIODS.map(period => {
                                            const isChecked = localConstraints.facultyUnavailability?.[faculty.id]?.includes(`${day}-${period}`);
                                            return (
                                                <TooltipProvider key={period} delayDuration={100}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                          <div className="flex items-center space-x-2">
                                                            <Checkbox 
                                                                id={`${faculty.id}-${day}-${period}`}
                                                                checked={isChecked}
                                                                onCheckedChange={(checked) => handleAvailabilityChange(faculty.id, day, period, checked)}
                                                            />
                                                          </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent><p>{period}</p></TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            );
                                        })}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
            <CardTitle>Pinned Lectures (Fixed Slots)</CardTitle>
            <CardDescription>Define special classes that must occur at a fixed time. This is the highest priority constraint.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPin} className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end p-4 border rounded-lg bg-muted/50 dark:bg-gray-800/30">
              <div className="col-span-2 xl:col-span-2 space-y-2"><Label>Subject</Label><Select onValueChange={(v) => setPinForm({...pinForm, subjectId: v})} value={pinForm.subjectId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{subjectOptions}</SelectContent></Select></div>
              <div className="col-span-2 xl:col-span-1 space-y-2"><Label>Faculty</Label><Select onValueChange={(v) => setPinForm({...pinForm, facultyId: v})} value={pinForm.facultyId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{facultyOptions}</SelectContent></Select></div>
              <div className="col-span-1 space-y-2"><Label>Batch</Label><Select onValueChange={(v) => setPinForm({...pinForm, batchId: v})} value={pinForm.batchId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{batchOptions}</SelectContent></Select></div>
              <div className="col-span-1 space-y-2"><Label>Room</Label><Select onValueChange={(v) => setPinForm({...pinForm, roomId: v})} value={pinForm.roomId}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{roomOptions}</SelectContent></Select></div>
              <div className="col-span-1 space-y-2"><Label>Day</Label><Select onValueChange={(v) => setPinForm({...pinForm, day: v})} value={pinForm.day}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{dayOptions}</SelectContent></Select></div>
              <div className="col-span-1 space-y-2"><Label>Period</Label><Select onValueChange={(v) => setPinForm({...pinForm, period: v})} value={pinForm.period}><SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger><SelectContent>{periodOptions}</SelectContent></Select></div>
              <Button type="submit" className="w-full col-span-2 xl:col-span-1"><Pin className="mr-2 h-4 w-4"/>Pin Lecture</Button>
          </form>

          <div className="mt-4">
              <h4 className="font-semibold mb-2">Current Pinned Lectures</h4>
              <Table>
                  <TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Faculty</TableHead><TableHead>Slot</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                  <TableBody>
                      {localConstraints.pinnedLectures?.length > 0 ? localConstraints.pinnedLectures.map(pin => (
                          <TableRow key={pin.id}>
                              <TableCell>{activeDepartmentData.subjects.find(s=>s.id === pin.subjectId)?.name}</TableCell>
                              <TableCell>{activeDepartmentData.faculty.find(f=>f.id === pin.facultyId)?.name}</TableCell>
                              <TableCell>{pin.day}, {pin.period} in {pin.roomId}</TableCell>
                              <TableCell className="text-right"><Button variant="destructive" size="icon" onClick={() => handleDeletePin(pin.id)}><Trash2 className="h-4 w-4"/></Button></TableCell>
                          </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No lectures have been pinned yet.</TableCell></TableRow>
                      )}
                  </TableBody>
              </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
          <CardHeader>
              <CardTitle>Subject Relationships</CardTitle>
              <CardDescription>Define rules for subjects, such as electives that cannot be scheduled at the same time.</CardDescription>
          </CardHeader>
          <CardContent>
              <form onSubmit={handleAddRelation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end p-4 border rounded-lg bg-muted/50 dark:bg-gray-800/30">
                  <div className="md:col-span-2"><Label>Subject A</Label><Select onValueChange={(v) => setRelationForm({...relationForm, subjectA: v})} value={relationForm.subjectA}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent>{subjectOptions}</SelectContent></Select></div>
                  <div className="md:col-span-2"><Label>Subject B</Label><Select onValueChange={(v) => setRelationForm({...relationForm, subjectB: v})} value={relationForm.subjectB}><SelectTrigger><SelectValue placeholder="Select..."/></SelectTrigger><SelectContent>{subjectOptions}</SelectContent></Select></div>
                  <div className="md:col-span-3"><Label>Rule</Label><Select onValueChange={(v) => setRelationForm({...relationForm, type: v})} value={relationForm.type}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Cannot Overlap">Cannot Overlap (for electives)</SelectItem></SelectContent></Select></div>
                  <Button type="submit" className="w-full"><Link className="mr-2 h-4 w-4"/>Add Rule</Button>
              </form>
               <div className="mt-4">
                  <h4 className="font-semibold mb-2">Current Subject Rules</h4>
                  <Table>
                      <TableHeader><TableRow><TableHead>Subject A</TableHead><TableHead>Rule</TableHead><TableHead>Subject B</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                      <TableBody>
                          {localConstraints.subjectRelations?.length > 0 ? localConstraints.subjectRelations.map(rel => (
                              <TableRow key={rel.id}>
                                  <TableCell>{activeDepartmentData.subjects.find(s=>s.id === rel.subjectA)?.name}</TableCell>
                                  <TableCell className="font-mono text-muted-foreground">{rel.type}</TableCell>
                                  <TableCell>{activeDepartmentData.subjects.find(s=>s.id === rel.subjectB)?.name}</TableCell>
                                  <TableCell className="text-right"><Button variant="destructive" size="icon" onClick={() => handleDeleteRelation(rel.id)}><Trash2 className="h-4 w-4"/></Button></TableCell>
                              </TableRow>
                          )) : (
                            <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">No subject relationships defined.</TableCell></TableRow>
                          )}
                      </TableBody>
                  </Table>
              </div>
          </CardContent>
      </Card>

      {/* ✅ CORRECTED: The pt-4 class has been removed to fix the scrolling issue. */}
      <div className="flex justify-end">
        <Button onClick={handleSaveAll} size="lg">
            <Save className="mr-2 h-5 w-5"/>
            Save All Constraints
        </Button>
      </div>
    </div>
  );
}

