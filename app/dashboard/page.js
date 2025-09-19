// File: app/dashboard/page.js (Complete, Updated & Optimized Version)

'use client';

// --- React and Context Imports ---
import React, { useContext, useMemo } from 'react';
import { AuthContext } from '@/app/context/AuthContext';
import { DataContext } from '@/app/context/DataContext';

// --- UI Component Imports ---
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/app/components/ui/Card';

// --- Icon Imports ---
import {
  Users,
  Book,
  Building,
  School,
  Loader2,
  AlertTriangle,
  Activity,
  BarChart as BarChartIcon,
} from 'lucide-react';

// --- Charting Library Imports ---
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// ======================================================================
// Reusable Sub-Components (for a cleaner main component)
// For larger projects, these could be moved to their own files.
// ======================================================================

/**
 * A card for displaying a Key Performance Indicator (KPI).
 * @param {{ icon: React.ElementType, title: string, value: string | number, color: string }} props
 */
const KpiCard = ({ icon: Icon, title, value, color }) => (
  <Card>
    <CardContent className="flex items-center p-4">
      <Icon className={`w-8 h-8 mr-4 shrink-0 ${color}`} aria-hidden="true" />
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </CardContent>
  </Card>
);

/**
 * A card for displaying a simple statistic.
 * @param {{ icon: React.ElementType, title: string, value: string | number }} props
 */
const StatCard = ({ icon: Icon, title, value }) => (
  <Card>
    <CardContent className="flex items-center p-4">
      <div className="p-3 mr-4 rounded-full bg-primary/10">
        <Icon className="w-6 h-6 text-primary shrink-0" aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-semibold text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </CardContent>
  </Card>
);

/**
 * A generic wrapper card for charts.
 * @param {{ title: string, description: string, children: React.ReactNode }} props
 */
const DashboardChartCard = ({ title, description, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="h-64">{children}</CardContent>
  </Card>
);

/**
 * A placeholder shown when a chart has no data.
 * @param {{ icon: React.ElementType, title: string, message: string }} props
 */
const EmptyState = ({ icon: Icon, title, message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
    <Icon className="w-12 h-12 mb-2 text-gray-400" aria-hidden="true" />
    <p className="font-medium">{title}</p>
    <p className="text-sm">{message}</p>
  </div>
);


// ======================================================================
// Main Dashboard Page Component
// ======================================================================
export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const { activeDepartmentData, globalData, analytics } = useContext(DataContext);

  // --- Centralized Dynamic Calculation Logic ---
  // This memoized calculation is the "brain" of the dashboard.
  // It efficiently re-calculates all display data only when the department changes.
  const dashboardData = useMemo(() => {
    if (!activeDepartmentData || !globalData || !analytics) {
      return { isLoading: true };
    }

    const facultyList = activeDepartmentData.faculty || [];
    const workloadCounts = { Underloaded: 0, Optimal: 0, Overloaded: 0 };
    let optimalCount = 0;

    if (facultyList.length > 0) {
      facultyList.forEach(f => {
        const loadRatio = f.currentLoad / f.maxLoad;
        if (loadRatio > 1.0) workloadCounts.Overloaded++;
        else if (loadRatio >= 0.8) {
          workloadCounts.Optimal++;
          optimalCount++;
        } else workloadCounts.Underloaded++;
      });
    }

    const totalFaculty = facultyList.length;
    const optimalPercentage = totalFaculty > 0 ? Math.round((optimalCount / totalFaculty) * 100) : 0;

    return {
      isLoading: false,
      departmentName: activeDepartmentData.name,
      kpis: [
        { name: 'Timetable Status', value: analytics.timetableStatus ?? 'N/A', icon: Activity, color: 'text-blue-600' },
        { name: 'Unresolved Conflicts', value: analytics.unresolvedConflicts ?? 0, icon: AlertTriangle, color: 'text-red-500' },
        { name: 'Classroom Utilization', value: `${analytics.classroomUtilization?.overall ?? 0}%`, icon: Building, color: 'text-green-600' },
        { name: 'Faculty Workload', value: `${optimalPercentage}% Optimal`, icon: Users, color: 'text-purple-600' },
      ],
      stats: [
        { name: 'Total Faculty', value: facultyList.length, icon: Users },
        { name: 'Total Subjects', value: activeDepartmentData.subjects?.length ?? 0, icon: Book },
        { name: 'Student Batches', value: activeDepartmentData.batches?.length ?? 0, icon: School },
        { name: 'Total Rooms', value: globalData.classrooms?.length ?? 0, icon: Building },
      ],
      utilizationData: [
        { name: 'Theory Usage', value: analytics.classroomUtilization?.theory ?? 0 },
        { name: 'Lab Usage', value: analytics.classroomUtilization?.labs ?? 0 },
      ],
      workloadData: [
        { range: 'Underloaded', count: workloadCounts.Underloaded },
        { range: 'Optimal', count: workloadCounts.Optimal },
        { range: 'Overloaded', count: workloadCounts.Overloaded },
      ],
      hasFacultyData: facultyList.length > 0,
    };
  }, [activeDepartmentData, globalData, analytics]);

  // --- Loading State ---
  if (dashboardData.isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="sr-only">Loading dashboard data...</span>
      </div>
    );
  }

  // --- Render JSX ---
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Welcome, {user?.name ?? 'Scheduler User'}!
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Here is a summary for the{' '}
          <span className="font-semibold text-primary">{dashboardData.departmentName}</span> department.
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.kpis.map((kpi) => (
          <KpiCard key={kpi.name} icon={kpi.icon} title={kpi.name} value={kpi.value} color={kpi.color} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {dashboardData.stats.map((stat) => (
          <StatCard key={stat.name} icon={stat.icon} title={stat.name} value={stat.value} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardChartCard title="Classroom Utilization" description="Average usage across Theory and Lab rooms">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dashboardData.utilizationData} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="90%" paddingAngle={5} label>
                {dashboardData.utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={['#3B82F6', '#10B981'][index % 2]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]}/>
            </PieChart>
          </ResponsiveContainer>
        </DashboardChartCard>

        <DashboardChartCard title="Faculty Workload Distribution" description="Balance across all faculty members">
          {dashboardData.hasFacultyData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboardData.workloadData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="range" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              icon={BarChartIcon}
              title="No Faculty Data"
              message="Add faculty in Data Management to see workload."
            />
          )}
        </DashboardChartCard>
      </section>
    </div>
  );
}