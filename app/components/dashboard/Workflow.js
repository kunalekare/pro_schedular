'use client';

import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

/**
 * Workflow Component
 * Manages the review and approval process for a generated timetable.
 * It displays the current status, a log of comments, and provides
 * role-based actions (Submit, Approve, Reject).
 */
export default function Workflow({ timetable }) {
    // Hooks are correctly placed at the top level of the component.
    const { user } = useContext(AuthContext);
    const [status, setStatus] = useState(timetable?.status || 'Not Generated');
    const [comments, setComments] = useState(timetable?.comments || []);
    const [newComment, setNewComment] = useState('');
    
    // ✅ This useEffect hook keeps the component's state in sync when the user
    // clicks on a different timetable option (Option A, Option B, etc.)
    useEffect(() => {
        setStatus(timetable?.status || 'Not Generated');
        setComments(timetable?.comments || []);
    }, [timetable]);

    // This "guard clause" handles the UI state before a timetable is generated.
    if (!timetable) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Review & Approval</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-text-secondary dark:text-gray-400">Generate a timetable to see the workflow actions.</p>
                </CardContent>
            </Card>
        );
    }

    const handleAddComment = () => {
        if (newComment.trim() === '') {
            toast.error('Cannot submit an empty comment.');
            return;
        }
        setComments(prev => [...prev, { role: user.role, text: newComment }]);
        setNewComment('');
        toast.success('Comment added!');
    }

    const handleAction = (newStatus) => {
        if (newComment.trim() === '') {
            // Require a comment for major workflow actions
            toast.error('Please add a comment explaining this action.');
            return;
        }
        setStatus(newStatus);
        setComments(prev => [...prev, { role: user.role, text: newComment }]);
        setNewComment('');
        toast.success(`Timetable status updated to "${newStatus}"`);
    };

    // Professional styling for the status badges
    const statusClasses = {
        'Not Generated': "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
        Draft: "bg-warning-light text-warning-text",
        "Pending Approval": "bg-primary-light text-primary-text",
        Approved: "bg-success-light text-success-text",
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Review & Approval</CardTitle>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`}>{status}</span>
            </CardHeader>
            <CardContent>
                <div className="mb-4 h-32 overflow-y-auto bg-gray-50 dark:bg-gray-900/50 p-3 rounded-md border dark:border-gray-700">
                    {comments.length > 0 ? comments.map((c, i) => (
                        <p key={i} className="text-sm mb-2"><strong className="font-medium text-text-primary dark:text-gray-300">{c.role}:</strong> <span className="text-text-secondary dark:text-gray-400">{c.text}</span></p>
                    )) : <p className="text-sm text-center text-gray-500 pt-12">No comments yet.</p>}
                </div>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Add a comment to request changes or approve..." 
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                    {/* ✅ Added a dedicated button to add comments */}
                    <Button variant="outline" onClick={handleAddComment} aria-label="Add Comment">
                        <Send className="w-5 h-5" />
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="justify-between">
                {/* Role-Based Action Buttons for the workflow */}
                <div className="flex gap-4">
                    {user.role === 'Scheduler' && status === 'Draft' &&
                        <Button onClick={() => handleAction('Pending Approval')}>Submit for Approval</Button>
                    }
                    {user.role === 'Admin' && status === 'Pending Approval' &&
                        <>
                            <Button onClick={() => handleAction('Approved')} className="bg-success hover:bg-green-700">Approve</Button>
                            <Button onClick={() => handleAction('Draft')} variant="danger">Request Changes</Button>
                        </>
                    }
                </div>
                 {user.role === 'Faculty' && (
                    <p className="text-sm text-text-secondary dark:text-gray-400">You can view the timetable and add comments.</p>
                )}
            </CardFooter>
        </Card>
    );
}