import { Card } from '../ui/Card';
import { Lightbulb } from 'lucide-react';

export default function SuggestionsPanel({ timetable }) {
    const hasSuggestions = Array.isArray(timetable?.suggestions) && timetable.suggestions.length > 0;

    return (
        <Card>
            <h2 className="text-xl font-bold mb-3 flex items-center">
                <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                {hasSuggestions ? "AI Suggestions" : "Suggestions"}
            </h2>

            {!hasSuggestions ? (
                <p className="text-sm text-gray-600">
                    ✅ No conflicts found. Your timetable looks great!
                </p>
            ) : (
                <>
                    <p className="text-sm text-gray-600 mb-4">
                        The system detected potential conflicts and recommends the following improvements:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                        {timetable.suggestions.map((s, i) => (
                            <li key={i} className="leading-relaxed">{s}</li>
                        ))}
                    </ul>
                </>
            )}
        </Card>
    );
}
