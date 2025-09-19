/**
 * @file app/dashboard/generator/page.js
 * @description An advanced UI for generating, viewing, and manually editing timetable options.
 * It includes AI-powered suggestions and an Export to PDF feature.
 * @version 4.2.0
 */

'use client';

import React, { useState, useContext, useRef, useEffect } from 'react';
// Correctly import context and components using the established path alias
import { DataContext } from '@/app/context/DataContext';
import { Button } from '@/app/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/app/components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/Select';
import { Label } from '@/app/components/ui/Label';
import { generateTimetables } from '@/lib/timetable-solver';
import { Wand2, Loader2, AlertTriangle, CheckCircle, FileText, CalendarX, Inbox, Sparkles, FileDown, Edit, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// ======================================================================
// Sub-Components
// ======================================================================

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const PERIODS = ['09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16'];

const TimetableGrid = React.forwardRef(({ schedule, isEditing = false, onCellClick = () => {} }, ref) => (
  <div ref={ref} className="overflow-x-auto rounded-lg border bg-white dark:bg-gray-900 p-2">
    <table className="min-w-full border-collapse">
      <thead className="bg-gray-50 dark:bg-gray-800">
        <tr>
          <th className="border border-border px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time</th>
          {DAYS.map(day => <th key={day} className="border border-border px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{day}</th>)}
        </tr>
      </thead>
      <tbody>
        {PERIODS.map(period => (
          <tr key={period}>
            <td className="border border-border px-4 py-3 font-medium text-sm text-gray-700 dark:text-gray-300">{period}</td>
            {DAYS.map(day => {
              const key = `${day}-${period}`;
              const entry = schedule[key];
              return (
                <td
                  key={key}
                  className={`border border-border p-1 text-center text-xs relative ${entry?.isClash ? 'bg-red-100 dark:bg-red-900/50' : 'bg-white dark:bg-gray-900'} ${isEditing ? 'hover:bg-blue-100 dark:hover:bg-blue-900/50 cursor-pointer' : ''}`}
                  onClick={() => isEditing && onCellClick(key, entry)}
                >
                  {isEditing && <div className="absolute top-1 right-1"><Edit className="h-3 w-3 text-blue-500 opacity-50"/></div>}
                  {entry ? (
                    <div className="p-1 rounded">
                      <p className="font-bold text-gray-800 dark:text-gray-100">{entry.subject}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-[10px]">{entry.teacher}</p>
                      <p className="text-primary dark:text-blue-400 font-semibold">{entry.room} / {entry.batch}</p>
                    </div>
                  ) : <span className="text-gray-400">-</span>}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
));
TimetableGrid.displayName = "TimetableGrid";

const ResultMetricCard = ({ title, value, icon: Icon, isError, isSuccess }) => (
    <Card className={isError ? 'border-destructive' : isSuccess ? 'border-green-500' : ''}>
        <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">{title}</CardTitle><Icon className={`h-4 w-4 ${isError ? 'text-destructive' : isSuccess ? 'text-green-500' : 'text-muted-foreground'}`} /></CardHeader>
        <CardContent><div className="text-2xl font-bold">{value}</div></CardContent>
    </Card>
);

const AiSuggestions = ({ option }) => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const getSuggestions = () => { setLoading(true); setSuggestions([]); setTimeout(() => { const newSuggestions = []; if (option.clashes > 0) newSuggestions.push("Swap a clashing lecture with an empty slot to resolve the conflict."); if (option.unscheduled.length > 0) newSuggestions.push(`For '${option.unscheduled[0].subject}', consider assigning faculty with a lighter load.`); if (newSuggestions.length === 0) newSuggestions.push("This timetable is well-optimized. Review faculty workload for further improvements."); setSuggestions(newSuggestions); setLoading(false); }, 1200); };
    return ( <Card> <CardHeader> <CardTitle className="text-md flex items-center"><Sparkles className="h-5 w-5 mr-2 text-primary"/>AI Suggestions</CardTitle> <CardDescription>Get AI-powered recommendations to improve this timetable.</CardDescription> </CardHeader> <CardContent> <Button onClick={getSuggestions} disabled={loading}> {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />} {loading ? "Generating..." : "Generate Suggestions"} </Button> {suggestions.length > 0 && ( <ul className="mt-4 list-disc list-inside text-sm space-y-2 text-muted-foreground"> {suggestions.map((s, i) => <li key={i}><span className="text-foreground">{s}</span></li>)} </ul> )} </CardContent> </Card> );
};

const EditCellModal = ({ isOpen, onOpenChange, cellData, onSave, departmentData, globalData }) => {
    const [subject, setSubject] = useState(''); const [teacher, setTeacher] = useState(''); const [room, setRoom] = useState(''); const [batch, setBatch] = useState('');
    useEffect(() => { if (cellData?.entry) { setSubject(cellData.entry.subject); setTeacher(cellData.entry.teacher); setRoom(cellData.entry.room); setBatch(cellData.entry.batch); } else { setSubject(''); setTeacher(''); setRoom(''); setBatch(''); } }, [cellData]);
    const handleSave = () => { onSave(cellData.key, { subject, teacher, room, batch }); onOpenChange(false); };
    const handleClear = () => { onSave(cellData.key, null); onOpenChange(false); };
    return ( <Dialog open={isOpen} onOpenChange={onOpenChange}> <DialogContent> <DialogHeader> <DialogTitle>Edit Slot: {cellData?.key}</DialogTitle> <DialogDescription>Manually assign a lecture to this time slot.</DialogDescription> </DialogHeader> <div className="grid gap-4 py-4"> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="subject" className="text-right">Subject</Label> <Select onValueChange={setSubject} value={subject}> <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Subject" /></SelectTrigger> <SelectContent>{departmentData.subjects.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent> </Select> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="teacher" className="text-right">Teacher</Label> <Select onValueChange={setTeacher} value={teacher}> <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Teacher" /></SelectTrigger> <SelectContent>{departmentData.faculty.map(f => <SelectItem key={f.id} value={f.name}>{f.name}</SelectItem>)}</SelectContent> </Select> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="room" className="text-right">Room</Label> <Select onValueChange={setRoom} value={room}> <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Room" /></SelectTrigger> <SelectContent>{globalData.classrooms.map(r => <SelectItem key={r.id} value={r.id}>{r.id} ({r.type})</SelectItem>)}</SelectContent> </Select> </div> <div className="grid grid-cols-4 items-center gap-4"> <Label htmlFor="batch" className="text-right">Batch</Label> <Select onValueChange={setBatch} value={batch}> <SelectTrigger className="col-span-3"><SelectValue placeholder="Select Batch" /></SelectTrigger> <SelectContent>{departmentData.batches.map(b => <SelectItem key={b.id} value={b.id}>{b.id}</SelectItem>)}</SelectContent> </Select> </div> </div> <DialogFooter> <Button variant="outline" onClick={handleClear}>Clear Slot</Button> <Button onClick={handleSave}>Save Changes</Button> </DialogFooter> </DialogContent> </Dialog> );
};

// ======================================================================
// Main Generator Page Component
// ======================================================================
export default function GeneratorPage() {
  const { activeDepartmentData, globalData, constraints } = useContext(DataContext);
  const [isLoading, setIsLoading] = useState(false);
  const [timetableOptions, setTimetableOptions] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [editingOptionId, setEditingOptionId] = useState(null);
  const [editableSchedule, setEditableSchedule] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCellData, setEditingCellData] = useState(null);
  const timetableRefs = useRef({});

  const handleExportToPdf = (option) => { const gridToExport = timetableRefs.current[option.id]; if (!gridToExport) return; toast.loading('Exporting to PDF...'); html2canvas(gridToExport, { scale: 2, backgroundColor: null, useCORS: true }).then(canvas => { const imgData = canvas.toDataURL('image/png'); const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] }); pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height); pdf.save(`Timetable-${activeDepartmentData.name}-Option-${option.id + 1}.pdf`); toast.dismiss(); toast.success('Exported successfully!'); }); };
  
  const handleGenerate = () => {
    setIsLoading(true);
    setTimetableOptions([]);
    setHasGenerated(true);
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: `Generating timetables for ${activeDepartmentData.name}...`,
        success: 'Generated options successfully!',
        error: 'Could not generate timetables.',
      }
    ).then(() => {
      // ✅ Pass constraints to the solver
      const options = generateTimetables(activeDepartmentData, globalData, constraints);
      setTimetableOptions(options);
      setIsLoading(false);
    });
  };
  
  const handleEditClick = (option) => { setEditingOptionId(option.id); setEditableSchedule({ ...option.schedule }); };
  const handleCancelEdit = () => { setEditingOptionId(null); setEditableSchedule(null); };
  const handleSaveChanges = () => { setTimetableOptions(options => options.map(opt => opt.id === editingOptionId ? { ...opt, schedule: editableSchedule } : opt )); setEditingOptionId(null); setEditableSchedule(null); toast.success("Manual changes saved!"); };
  const handleCellClick = (key, entry) => { setEditingCellData({ key, entry }); setIsModalOpen(true); };
  const handleSaveCell = (key, newEntry) => { setEditableSchedule(currentSchedule => { const updatedSchedule = { ...currentSchedule }; if (newEntry && newEntry.subject) { updatedSchedule[key] = newEntry; } else { delete updatedSchedule[key]; } return updatedSchedule; }); };
  
  return (
    <div className="space-y-6">
      <Card> <CardHeader> <CardTitle>Timetable Generator</CardTitle> <CardDescription> Generate optimized timetable options for the <span className="font-semibold text-primary">{activeDepartmentData.name}</span> department. </CardDescription> </CardHeader> <CardContent> <Button onClick={handleGenerate} disabled={isLoading} size="lg"> {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Wand2 className="mr-2 h-5 w-5" />} {isLoading ? 'Generating...' : 'Generate Timetable Options'} </Button> </CardContent> </Card>
      
      <EditCellModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} cellData={editingCellData} onSave={handleSaveCell} departmentData={activeDepartmentData} globalData={globalData} />

      {hasGenerated && !isLoading && (
        timetableOptions.length > 0 ? (
          <Tabs defaultValue="option-0" className="w-full animate-in fade-in-50 duration-500">
            <TabsList className={`grid w-full grid-cols-${timetableOptions.length || 1}`}>
              {timetableOptions.map(opt => <TabsTrigger key={opt.id} value={`option-${opt.id}`}>Option {opt.id + 1}</TabsTrigger>)}
            </TabsList>
            {timetableOptions.map(opt => (
              <TabsContent key={opt.id} value={`option-${opt.id}`} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> <ResultMetricCard title="Clashes" value={opt.clashes} icon={AlertTriangle} isError={opt.clashes > 0} isSuccess={opt.clashes === 0} /> <ResultMetricCard title="Unscheduled Lectures" value={opt.unscheduled.length} icon={CalendarX} isError={opt.unscheduled.length > 0} /> <ResultMetricCard title="Status" value={opt.status} icon={FileText} /> </div>
                {opt.unscheduled.length > 0 && ( <Card> <CardHeader><CardTitle className="text-sm">Unscheduled Lecture Details</CardTitle></CardHeader> <CardContent> <ul className="list-disc list-inside text-xs space-y-1 text-muted-foreground"> {opt.unscheduled.map((u, i) => <li key={i}><span className="font-semibold text-foreground">{u.subject} ({u.batch}):</span> {u.reason}</li>)} </ul> </CardContent> </Card> )}
                <TimetableGrid ref={el => timetableRefs.current[opt.id] = el} schedule={editingOptionId === opt.id ? editableSchedule : opt.schedule} isEditing={editingOptionId === opt.id} onCellClick={handleCellClick} />
                {editingOptionId !== opt.id && <AiSuggestions option={opt} />}
                <div className="flex flex-wrap justify-end gap-2 pt-2">
                  {editingOptionId === opt.id ? ( <> <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button> <Button onClick={handleSaveChanges}><Save className="mr-2 h-4 w-4" />Save Changes</Button> </>
                  ) : ( <> <Button variant="secondary" onClick={() => handleEditClick(opt)}><Edit className="mr-2 h-4 w-4" />Edit Timetable</Button> <Button variant="outline" onClick={() => handleExportToPdf(opt)}><FileDown className="mr-2 h-4 w-4" />Export to PDF</Button> <Button>Approve & Publish</Button> </> )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : ( <Card className="text-center p-8 animate-in fade-in-50 duration-500"> <CardContent> <Inbox className="mx-auto h-12 w-12 text-gray-400"/> <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No Valid Options Generated</h3> <p className="mt-1 text-sm text-gray-500">The solver could not find any valid timetables. Please check your data and constraints.</p> </CardContent> </Card> )
      )}
    </div>
  );
}

