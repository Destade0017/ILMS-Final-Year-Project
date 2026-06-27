'use client'

import { useState } from 'react'
import {
  Users,
  BookOpen,
  TrendingUp,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminDashboardContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')

  const stats = [
    { label: 'Total Users', value: '1,234', trend: '+12%', color: 'bg-blue-500/10 text-blue-400' },
    { label: 'Active Courses', value: '48', trend: '+3%', color: 'bg-green-500/10 text-green-400' },
    { label: 'Total Enrollments', value: '3,456', trend: '+24%', color: 'bg-purple-500/10 text-purple-400' },
    { label: 'Platform Health', value: '99.8%', trend: '+0.2%', color: 'bg-cyan-500/10 text-cyan-400' },
  ]

  const [users, setUsers] = useState([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Student',
      status: 'Active',
      joinDate: 'Jan 15, 2024',
      courses: 3,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      role: 'Instructor',
      status: 'Active',
      joinDate: 'Dec 01, 2023',
      courses: 2,
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      role: 'Instructor',
      status: 'Active',
      joinDate: 'Nov 20, 2023',
      courses: 3,
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@example.com',
      role: 'Student',
      status: 'Inactive',
      joinDate: 'Oct 10, 2023',
      courses: 0,
    },
    {
      id: '5',
      name: 'James Wilson',
      email: 'james@example.com',
      role: 'Student',
      status: 'Active',
      joinDate: 'Feb 01, 2024',
      courses: 2,
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and user management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-xl border border-border p-6 ${stat.color}`}
          >
            <p className="text-sm font-medium opacity-75 mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-xs font-semibold">{stat.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* User Management Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <Button className="bg-primary hover:bg-primary/90">
            Add User
          </Button>
        </div>

        {/* Filter & Search */}
        <div className="mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="pl-10 pr-10 py-2 rounded-lg border border-border bg-background text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="Student">Students</option>
              <option value="Instructor">Instructors</option>
              <option value="Admin">Admins</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {/* Users Table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-card border-b border-border">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Courses
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.role === 'Student'
                            ? 'bg-blue-500/10 text-blue-400'
                            : user.role === 'Instructor'
                              ? 'bg-purple-500/10 text-purple-400'
                              : 'bg-orange-500/10 text-orange-400'
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-red-500/10 text-red-400'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {user.courses}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80"
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <Button variant="outline" className="border-border" disabled>
              Previous
            </Button>
            <Button variant="outline" className="border-border bg-primary/10 text-primary">
              1
            </Button>
            <Button variant="outline" className="border-border">
              2
            </Button>
            <Button variant="outline" className="border-border">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Recent Activities</h3>
          <div className="space-y-3">
            {[
              'New course "Mobile Development" created',
              'User "Alice Johnson" joined the platform',
              'Course completion by 12 students',
              'System backup completed successfully',
            ].map((activity, idx) => (
              <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-0">
                <div className="h-2 w-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">{activity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">System Status</h3>
          <div className="space-y-4">
            {[
              { label: 'Database', status: 'Healthy', color: 'text-green-400' },
              { label: 'Server', status: 'Healthy', color: 'text-green-400' },
              { label: 'API', status: 'Healthy', color: 'text-green-400' },
              { label: 'Storage', status: 'Healthy', color: 'text-green-400' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className={`text-sm font-semibold ${item.color}`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
