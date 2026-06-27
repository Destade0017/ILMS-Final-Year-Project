'use client'

import { useState } from 'react'
import {
  BookOpen,
  Users,
  FileText,
  Plus,
  Edit,
  Trash2,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LecturerDashboardContent() {
  const [activeTab, setActiveTab] = useState('overview')

  const courses = [
    {
      id: '1',
      title: 'Web Development 101',
      students: 45,
      status: 'Active',
      startDate: '2024-01-15',
      assignments: 8,
    },
    {
      id: '2',
      title: 'Advanced JavaScript',
      students: 32,
      status: 'Active',
      startDate: '2024-02-01',
      assignments: 6,
    },
  ]

  const materials = [
    {
      id: '1',
      name: 'Week 1 - Lecture Slides',
      course: 'Web Development 101',
      type: 'PDF',
      size: '4.2 MB',
      date: 'Jan 15, 2024',
    },
    {
      id: '2',
      name: 'HTML & CSS Fundamentals',
      course: 'Web Development 101',
      type: 'Video',
      size: '156 MB',
      date: 'Jan 16, 2024',
    },
  ]

  const assignments = [
    {
      id: '1',
      title: 'Build a Personal Portfolio',
      course: 'Web Development 101',
      dueDate: 'Feb 15, 2024',
      submissions: 38,
      total: 45,
    },
    {
      id: '2',
      title: 'JavaScript Async Patterns',
      course: 'Advanced JavaScript',
      dueDate: 'Feb 20, 2024',
      submissions: 24,
      total: 32,
    },
  ]

  const stats = [
    { label: 'Total Students', value: '77', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Active Courses', value: '2', color: 'bg-green-500/10 text-green-400' },
    { label: 'Pending Submissions', value: '15', color: 'bg-yellow-500/10 text-yellow-400' },
    { label: 'Course Materials', value: '24', color: 'bg-purple-500/10 text-purple-400' },
  ]

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Course Management</h1>
            <p className="text-muted-foreground">Manage your courses, materials, and students</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Course
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-border p-6 ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-75 mb-2">{stat.label}</p>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview', icon: BookOpen },
          { id: 'materials', label: 'Materials', icon: FileText },
          { id: 'assignments', label: 'Assignments', icon: Plus },
          { id: 'students', label: 'Students', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div>
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-bold text-foreground mb-4">My Courses</h2>
              <div className="space-y-3">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-2">{course.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {course.students} students • {course.assignments} assignments
                        </p>
                        <div className="flex gap-2">
                          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-500/10 text-green-400">
                            {course.status}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            Started {course.startDate}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Sidebar */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground">New submission</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    John submitted &quot;Portfolio&quot; project
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">2 hours ago</p>
                </div>
                <div className="rounded-lg border border-border bg-card p-4">
                  <p className="text-sm font-medium text-foreground">Course update</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    You uploaded new materials
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">5 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Course Materials</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Upload Material
              </Button>
            </div>
            <div className="space-y-2">
              {materials.map((material) => (
                <div
                  key={material.id}
                  className="rounded-lg border border-border bg-card p-4 flex items-center justify-between hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {material.course} • {material.size}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span className="text-sm">{material.date}</span>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Assignments</h2>
              <Button className="bg-primary hover:bg-primary/90" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Assignment
              </Button>
            </div>
            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground mb-2">{assignment.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {assignment.course} • Due {assignment.dueDate}
                      </p>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-accent"
                          style={{
                            width: `${(assignment.submissions / assignment.total) * 100}%`,
                          }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {assignment.submissions} of {assignment.total} submitted
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div>
            <h2 className="text-xl font-bold text-foreground mb-6">Class Roster</h2>
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-card border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    {
                      name: 'Alice Johnson',
                      email: 'alice@example.com',
                      course: 'Web Dev 101',
                      status: 'Active',
                    },
                    {
                      name: 'Bob Smith',
                      email: 'bob@example.com',
                      course: 'Web Dev 101',
                      status: 'Active',
                    },
                    {
                      name: 'Carol Davis',
                      email: 'carol@example.com',
                      course: 'Advanced JS',
                      status: 'Inactive',
                    },
                  ].map((student, idx) => (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground">{student.name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {student.course}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                            student.status === 'Active'
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          }`}
                        >
                          {student.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
