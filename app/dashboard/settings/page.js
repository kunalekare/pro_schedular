'use client';

import { Card, CardContent, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Download, Link } from 'lucide-react';

/**
 * Settings & Integrations Page
 * - Provides export functionality for timetables
 * - Displays API keys and integration endpoints (read-only for security)
 */
export default function SettingsPage() {
  const handleExport = (format) => {
    // Placeholder for real export logic (PDF/Excel generator integration)
    alert(`Exporting as ${format}... (This is a prototype feature)`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Settings & Integrations</h1>
        <p className="mt-2 text-gray-600">
          Manage export options, API keys, and external integrations for your timetable system.
        </p>
      </header>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Download className="w-5 h-5 text-primary" /> Export Timetable
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => handleExport('PDF')}>Export as PDF</Button>
            <Button onClick={() => handleExport('Excel')}>Export as Excel</Button>
          </div>
        </CardContent>
      </Card>

      {/* API & Integrations Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-800">
            <Link className="w-5 h-5 text-primary" /> API & Integrations
          </h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="apiKey">LMS API Key</Label>
            <Input id="apiKey" value="********-****-****-********" readOnly />
          </div>
          <div>
            <Label htmlFor="webhookUrl">College Website Webhook URL</Label>
            <Input id="webhookUrl" value="https://api.college.edu/timetable/update" readOnly />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
