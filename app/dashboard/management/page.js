'use client';

import { Card, CardContent } from '../../components/ui/Card';
import ManagementTabs from '../../components/dashboard/ManagementTabs';

/**
 * Management Page
 * - Provides an interface for managing institutional data
 * - Organizes sections into tabbed views for classrooms, subjects, staff, etc.
 */
export default function ManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        <h1 className="text-3xl font-bold text-gray-800">Data Management</h1>
        <p className="mt-2 text-gray-600">
          Add, view, and edit core institutional data such as classrooms, subjects, staff, and schedules.
        </p>
      </header>

      {/* Management Tabs Section */}
      <Card>
        <CardContent>
          <ManagementTabs />
        </CardContent>
      </Card>
    </div>
  );
}
