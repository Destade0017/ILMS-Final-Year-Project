import { BookOpen, Clock, CheckCircle2, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function StudentDashboardContent() {
  const stats = [
    { label: 'Courses Enrolled', value: '4', icon: BookOpen },
    { label: 'Active Learning', value: '6h 32m', icon: Clock },
    { label: 'Completed Courses', value: '2', icon: CheckCircle2 },
    { label: 'Learning Streak', value: '12 days', icon: TrendingUp },
  ]

  const courses = [
    {
      id: '1',
      title: 'Introduction to Web Development',
      instructor: 'Sarah Johnson',
      progress: 65,
      difficulty: 'Beginner',
      students: 234,
      image: 'from-blue-600 to-blue-400',
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      instructor: 'Mike Chen',
      progress: 40,
      difficulty: 'Advanced',
      students: 156,
      image: 'from-purple-600 to-purple-400',
    },
    {
      id: '3',
      title: 'Database Design & SQL',
      instructor: 'Emily Davis',
      progress: 85,
      difficulty: 'Intermediate',
      students: 189,
      image: 'from-cyan-600 to-cyan-400',
    },
    {
      id: '4',
      title: 'Mobile App Development',
      instructor: 'James Wilson',
      progress: 20,
      difficulty: 'Intermediate',
      students: 142,
      image: 'from-pink-600 to-pink-400',
    },
  ]

  const activities = [
    {
      id: '1',
      type: 'assignment',
      title: 'Build a responsive portfolio website',
      course: 'Web Development',
      time: 'Due in 2 days',
      status: 'due',
    },
    {
      id: '2',
      type: 'quiz',
      title: 'React Hooks Quiz',
      course: 'Advanced React',
      time: 'Today at 2:00 PM',
      status: 'upcoming',
    },
    {
      id: '3',
      type: 'announcement',
      title: 'New course materials uploaded',
      course: 'Database Design',
      time: '3 hours ago',
      status: 'completed',
    },
  ]

  const getDifficultyColor = (difficulty: string) => {
    const colors: { [key: string]: string } = {
      Beginner: 'bg-green-500/10 text-green-400',
      Intermediate: 'bg-yellow-500/10 text-yellow-400',
      Advanced: 'bg-red-500/10 text-red-400',
    }
    return colors[difficulty]
  }

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      due: 'bg-red-500/10 text-red-400 border-red-500/20',
      upcoming: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      completed: 'bg-green-500/10 text-green-400 border-green-500/20',
    }
    return colors[status]
  }

  return (
    <>
      {/* Welcome Hero */}
      <div className="mb-8">
        <div className="rounded-2xl border border-border bg-gradient-to-r from-primary/10 to-accent/10 p-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mb-6">
            You&apos;re making great progress. Continue learning to achieve your goals.
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Continue Learning
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <div className="rounded-lg bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Courses Section */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">My Courses</h2>
            <Button variant="outline" className="border-border">
              View All
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="group rounded-xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                {/* Course Image */}
                <div className={`h-32 bg-gradient-to-br ${course.image} opacity-80 group-hover:opacity-100 transition-opacity`} />

                {/* Course Info */}
                <div className="p-4">
                  <h3 className="font-bold text-foreground mb-1 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {course.instructor}
                  </p>

                  {/* Difficulty Badge */}
                  <div className="mb-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-muted-foreground">Progress</span>
                      <span className="text-xs font-semibold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {course.students} students enrolled
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Up Next Widget */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Up Next</h2>
          </div>

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className={`rounded-xl border p-4 ${getStatusColor(activity.status)} transition-all hover:shadow-lg`}
              >
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs opacity-75">{activity.course}</p>
                    <p className="text-xs opacity-60 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mt-8 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
              Quick Actions
            </p>
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-accent/10"
            >
              Download Notes
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-accent/10"
            >
              Ask Instructor
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-border text-foreground hover:bg-accent/10"
            >
              View Grades
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
