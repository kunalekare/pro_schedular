/**
 * @file app/dashboard/management/page.js
 * @description The main page for managing all institutional data, including classrooms,
 * faculty, subjects, and batches, organized into a professional tabbed interface.
 * @version 2.1.0
 */

'use client';

// Correctly import components using the established path alias
import { Card, CardContent } from '@/app/components/ui/Card';
import ManagementTabs from '@/app/components/dashboard/ManagementTabs';

export default function ManagementPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <header>
        {/* ✅ CORRECTED: Replaced hardcoded text colors with theme-aware variables */}
        <h1 className="text-3xl font-bold text-foreground">Data Management</h1>
        <p className="mt-2 text-muted-foreground">
          Add, view, and edit core institutional data such as classrooms, subjects, staff, and schedules.
        </p>
      </header>

      {/* Management Tabs Section */}
      {/* The Card component is already theme-aware from its own code */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <ManagementTabs />
        </CardContent>
      </Card>
    </div>
  );
}

