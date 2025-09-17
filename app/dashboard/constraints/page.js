'use client';

import { useContext, useState, useEffect } from 'react';
import { DataContext } from '@/app/context/DataContext';
import { Card, CardHeader, CardContent, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { Label } from '@/app/components/ui/Label';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ConstraintsPage() {
    const { constraints, updateConstraints } = useContext(DataContext);
    
    // Initialize form state with constraints, providing fallbacks for any potentially missing keys.
    const [formState, setFormState] = useState({
        maxClassesPerDay: constraints?.maxClassesPerDay ?? 0,
        maxClassesPerWeek: constraints?.maxClassesPerWeek ?? 0,
        minBreakBetweenClasses: constraints?.minBreakBetweenClasses ?? 0,
    });

    useEffect(() => {
        // This keeps the form in sync if the global context ever changes from another source.
        setFormState({
            maxClassesPerDay: constraints?.maxClassesPerDay ?? 0,
            maxClassesPerWeek: constraints?.maxClassesPerWeek ?? 0,
            minBreakBetweenClasses: constraints?.minBreakBetweenClasses ?? 0,
        });
    }, [constraints]);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // When updating, ensure the value is stored as a number.
        setFormState(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateConstraints(formState);
        // The toast notification is now handled inside the updateConstraints function.
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Constraint Management</h1>
                <p className="mt-2 text-text-secondary dark:text-gray-400">Define the core academic and institutional rules for scheduling.</p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">Global Scheduling Rules</h2>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Label htmlFor="maxClassesPerDay">Max Classes Per Day (for any single batch)</Label>
                            <Input
                                id="maxClassesPerDay"
                                name="maxClassesPerDay"
                                type="number"
                                // ✅ THE FIX: Use `|| ''` to prevent the value from ever being undefined on render.
                                value={formState.maxClassesPerDay || ''}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <Label htmlFor="maxClassesPerWeek">Max Classes Per Week (for any single faculty)</Label>
                            <Input
                                id="maxClassesPerWeek"
                                name="maxClassesPerWeek"
                                type="number"
                                // ✅ THE FIX: Applied here as well.
                                value={formState.maxClassesPerWeek || ''}
                                onChange={handleChange}
                            />
                        </div>
                         <div>
                            <Label htmlFor="minBreakBetweenClasses">Minimum Break Between Classes (in periods)</Label>
                            <Input
                                id="minBreakBetweenClasses"
                                name="minBreakBetweenClasses"
                                type="number"
                                // ✅ THE FIX: And here too, for safety.
                                value={formState.minBreakBetweenClasses || ''}
                                onChange={handleChange}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="justify-start">
                        <Button type="submit">
                            <Save className="w-5 h-5 mr-2" />
                            Save Constraints
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}