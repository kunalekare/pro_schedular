'use client';
import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { CheckCircle, Clock, FileEdit, XCircle } from 'lucide-react';

export default function Workflow({ timetable }) {
    if (!timetable) return null;

    const { user } = useContext(AuthContext);

    // Local state (in real app, sync with DB)
    const [status, setStatus] = useState(timetable.status || 'Draft');
    const [comments, setComments] = useState([
        { user: 'Scheduler', text: 'Initial draft generated.' },
    ]);
    const [newComment, setNewComment] = useState('');

    const handleAction = (newStatus, comment) => {
        setStatus(newStatus);
        setComments((prev) => [
            ...prev,
            { user: user.role, text: comment || newComment || `Status updated to ${newStatus}.` },
        ]);
        setNewComment('');
    };

    const statusConfig = {
        Draft: {
            classes: 'bg-gray-100 text-gray-800',
            icon: <FileEdit className="w-4 h-4 mr-1" />,
        },
        'Pending Approval': {
            classes: 'bg-yellow-100 text-yellow-800',
            icon: <Clock className="w-4 h-4 mr-1" />,
        },
        Approved: {
            classes: 'bg-green-100 text-green-800',
            icon: <CheckCircle className="w-4 h-4 mr-1" />,
        },
    };

    return (
        <Card>
            {/* Header with Status */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Review & Approval</h2>
                <span
                    className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.classes}`}
                >
                    {statusConfig[status]?.icon}
                    {status}
                </span>
            </div>

            {/* Comments Section */}
            <div className="mb-4 h-32 overflow-y-auto bg-gray-50 p-3 rounded-md border text-sm">
                {comments.map((c, i) => (
                    <p key={i} className="mb-2">
                        <strong className="font-medium">{c.user}:</strong> {c.text}
                    </p>
                ))}
            </div>

            {/* Add Comment Input */}
            {(user.role === 'Scheduler' || user.role === 'Admin') && (
                <div className="mb-4 flex gap-2">
                    <Input
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1"
                    />
                </div>
            )}

            {/* Role-Based Actions */}
            {user.role === 'Scheduler' && status === 'Draft' && (
                <Button
                    onClick={() =>
                        handleAction('Pending Approval', 'Submitted for review.')
                    }
                >
                    Submit for Approval
                </Button>
            )}

            {user.role === 'Admin' && status === 'Pending Approval' && (
                <div className="flex gap-4">
                    <Button
                        onClick={() =>
                            handleAction('Approved', 'Timetable approved and published.')
                        }
                        className="bg-green-600 hover:bg-green-700 flex items-center"
                    >
                        <CheckCircle className="w-4 h-4 mr-1" /> Approve
                    </Button>
                    <Button
                        onClick={() =>
                            handleAction('Draft', 'Changes requested.')
                        }
                        className="bg-red-500 hover:bg-red-600 flex items-center"
                    >
                        <XCircle className="w-4 h-4 mr-1" /> Request Changes
                    </Button>
                </div>
            )}

            {user.role === 'Faculty' &&
                (status === 'Pending Approval' || status === 'Approved') && (
                    <p className="text-sm text-gray-600">
                        You can view the timetable. Contact <strong>Admin</strong> for
                        changes.
                    </p>
                )}
        </Card>
    );
}
