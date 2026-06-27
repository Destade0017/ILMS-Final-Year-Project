import React, { useState, useEffect } from 'react';
import { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';

const Dashboard = ({ token, user, logout, goToProfile }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Lecturer course creation form state
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Selected course details modal/drawer state
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Tab control inside Selected Course Modal
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'assignments'

  // Assignments & Submissions states
  const [assignments, setAssignments] = useState([]);
  const [assignmentsLoading, setAssignmentsLoading] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [studentSubmission, setStudentSubmission] = useState(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);

  // Assignment form states
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignMaxPoints, setAssignMaxPoints] = useState(100);
  const [assignFormLoading, setAssignFormLoading] = useState(false);
  const [showCreateAssignForm, setShowCreateAssignForm] = useState(false);

  // Submission form states
  const [submissionContent, setSubmissionContent] = useState('');
  const [submitFormLoading, setSubmitFormLoading] = useState(false);

  // Grading form states
  const [gradeScore, setGradeScore] = useState('');
  const [gradeFeedback, setGradeFeedback] = useState('');
  const [gradeFormLoading, setGradeFormLoading] = useState(false);
  const [gradingSubmissionId, setGradingSubmissionId] = useState(null);

  // Quiz states
  const [quizzes, setQuizzes] = useState([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState([]);
  const [quizAttemptsLoading, setQuizAttemptsLoading] = useState(false);
  const [myQuizAttempt, setMyQuizAttempt] = useState(null);
  const [myQuizAttemptLoading, setMyQuizAttemptLoading] = useState(false);
  
  // Quiz creation form state
  const [showCreateQuizForm, setShowCreateQuizForm] = useState(false);
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDesc, setQuizDesc] = useState('');
  const [quizTimeLimit, setQuizTimeLimit] = useState(0);
  const [quizQuestions, setQuizQuestions] = useState([
    { questionText: '', options: ['', ''], correctAnswerIndex: 0 }
  ]);
  const [quizFormLoading, setQuizFormLoading] = useState(false);

  // Quiz taking state
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitting, setQuizSubmitting] = useState(false);

  // Materials state
  const [materials, setMaterials] = useState([]);
  const [materialsLoading, setMaterialsLoading] = useState(false);
  const [materialFormLoading, setMaterialFormLoading] = useState(false);
  const [showCreateMaterialForm, setShowCreateMaterialForm] = useState(false);

  const [matTitle, setMatTitle] = useState('');
  const [matDesc, setMatDesc] = useState('');
  const [matContentType, setMatContentType] = useState('text');
  const [matFileUrl, setMatFileUrl] = useState('');
  const [matBodyText, setMatBodyText] = useState('');
  const [matDifficulty, setMatDifficulty] = useState('medium');
  const [matFilter, setMatFilter] = useState('all');

  // Load courses on component mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch courses');
      }
      setCourses(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!newTitle || !newCode || !newDesc) {
      setError('Please fill in all course details');
      return;
    }

    setFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: newTitle,
          code: newCode,
          description: newDesc
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to create course');
      }

      setSuccessMsg(`Course ${data.data.code} created successfully!`);
      setNewTitle('');
      setNewCode('');
      setNewDesc('');
      setShowCreateForm(false);
      
      // Refresh course list
      fetchCourses();
    } catch (err) {
      setError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Enrollment failed');
      }

      setSuccessMsg(data.message || 'Enrolled successfully!');
      
      // Refresh course list to update enrollment count/button states
      fetchCourses();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewDetails = async (courseId) => {
    setDetailsLoading(true);
    setActiveTab('details');
    setSelectedAssignment(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/courses/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch course details');
      }
      setSelectedCourse(data.data);
      
      // Load assignments for this course in the background
      fetchCourseAssignments(courseId);
      // Load quizzes for this course in the background
      fetchCourseQuizzes(courseId);
      // Load materials for this course in the background
      fetchCourseMaterials(courseId, matFilter);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
    }
  };

  // ASSIGNMENTS & SUBMISSIONS HELPERS
  const fetchCourseAssignments = async (courseId) => {
    setAssignmentsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch assignments');
      }
      setAssignments(data.data);
    } catch (err) {
      console.error('Error fetching assignments:', err.message);
    } finally {
      setAssignmentsLoading(false);
    }
  };

  const handleCreateAssignment = async (e, courseId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!assignTitle || !assignDesc || !assignDueDate || !assignMaxPoints) {
      setError('Please fill in all assignment fields');
      return;
    }

    setAssignFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          title: assignTitle,
          description: assignDesc,
          dueDate: assignDueDate,
          maxPoints: Number(assignMaxPoints)
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create assignment');
      }

      setSuccessMsg('Assignment created successfully!');
      setAssignTitle('');
      setAssignDesc('');
      setAssignDueDate('');
      setAssignMaxPoints(100);
      setShowCreateAssignForm(false);
      
      // Refresh assignments
      fetchCourseAssignments(courseId);
    } catch (err) {
      setError(err.message);
    } finally {
      setAssignFormLoading(false);
    }
  };

  const handleSelectAssignment = async (assignment) => {
    setSelectedAssignment(assignment);
    setGradingSubmissionId(null);
    setGradeScore('');
    setGradeFeedback('');
    setError('');
    setSuccessMsg('');

    if (isStudent) {
      setSubmissionLoading(true);
      setStudentSubmission(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments/${assignment._id}/my-submission`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setStudentSubmission(data.data);
        }
      } catch (err) {
        console.error('Error fetching student submission:', err);
      } finally {
        setSubmissionLoading(false);
      }
    } else {
      setSubmissionsLoading(true);
      setSubmissions([]);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments/${assignment._id}/submissions`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setSubmissions(data.data);
        }
      } catch (err) {
        console.error('Error fetching submissions list:', err);
      } finally {
        setSubmissionsLoading(false);
      }
    }
  };

  const handleSubmitAssignment = async (e, assignmentId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!submissionContent) {
      setError('Please enter your submission text or repository link');
      return;
    }

    setSubmitFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments/${assignmentId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: submissionContent
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit coursework');
      }

      setSuccessMsg('Assignment response submitted successfully!');
      setSubmissionContent('');
      
      // Reload submission status
      const updatedAssign = { ...selectedAssignment };
      handleSelectAssignment(updatedAssign);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitFormLoading(false);
    }
  };

  const handleGradeSubmission = async (e, submissionId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (gradeScore === '') {
      setError('Please provide a grade score');
      return;
    }

    setGradeFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/assignments/submissions/${submissionId}/grade`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          score: Number(gradeScore),
          feedback: gradeFeedback
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to grade submission');
      }

      setSuccessMsg('Graded and performance records updated successfully!');
      setGradeScore('');
      setGradeFeedback('');
      setGradingSubmissionId(null);
      
      // Reload submissions list
      const updatedAssign = { ...selectedAssignment };
      handleSelectAssignment(updatedAssign);
    } catch (err) {
      setError(err.message);
    } finally {
      setGradeFormLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // MATERIALS HELPERS
  const fetchCourseMaterials = async (courseId, difficulty = 'all') => {
    setMaterialsLoading(true);
    try {
      const url = new URL(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials/course/${courseId}`);
      if (difficulty !== 'all') {
        url.searchParams.append('difficulty', difficulty);
      }
      const res = await fetch(url.toString(), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch materials');
      setMaterials(data.data);
    } catch (err) {
      console.error('Error fetching materials:', err.message);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleCreateMaterial = async (e, courseId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!matTitle || !matDesc || !matContentType) {
      setError('Please fill in material title, description, and type');
      return;
    }

    setMaterialFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          title: matTitle,
          description: matDesc,
          contentType: matContentType,
          fileUrl: (matContentType === 'pdf' || matContentType === 'video') ? matFileUrl : undefined,
          bodyText: matContentType === 'text' ? matBodyText : undefined,
          difficultyLevel: matDifficulty
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create material');

      setSuccessMsg('Material created successfully!');
      setMatTitle('');
      setMatDesc('');
      setMatContentType('text');
      setMatFileUrl('');
      setMatBodyText('');
      setMatDifficulty('medium');
      setShowCreateMaterialForm(false);
      
      fetchCourseMaterials(courseId, matFilter);
    } catch (err) {
      setError(err.message);
    } finally {
      setMaterialFormLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId, courseId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete material');

      setSuccessMsg('Material deleted successfully');
      fetchCourseMaterials(courseId, matFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  // QUIZ HELPERS
  const fetchCourseQuizzes = async (courseId) => {
    setQuizzesLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quizzes/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch quizzes');
      }
      setQuizzes(data.data);
    } catch (err) {
      console.error('Error fetching quizzes:', err.message);
    } finally {
      setQuizzesLoading(false);
    }
  };

  const handleSelectQuiz = async (quiz) => {
    setSelectedQuiz(quiz);
    setQuizAnswers({});
    setError('');
    setSuccessMsg('');

    if (isStudent) {
      setMyQuizAttemptLoading(true);
      setMyQuizAttempt(null);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quizzes/${quiz._id}/my-attempt`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setMyQuizAttempt(data.data);
        }
      } catch (err) {
        console.error('Error fetching student quiz attempt:', err);
      } finally {
        setMyQuizAttemptLoading(false);
      }
    } else {
      setQuizAttemptsLoading(true);
      setQuizAttempts([]);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quizzes/${quiz._id}/attempts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setQuizAttempts(data.data);
        }
      } catch (err) {
        console.error('Error fetching quiz attempts list:', err);
      } finally {
        setQuizAttemptsLoading(false);
      }
    }
  };

  const handleCreateQuiz = async (e, courseId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!quizTitle || quizQuestions.length === 0) {
      setError('Please fill in quiz title and add at least one question');
      return;
    }

    for (const q of quizQuestions) {
      if (!q.questionText || q.options.some(o => !o.trim())) {
        setError('Please make sure all questions and options are filled out');
        return;
      }
    }

    setQuizFormLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quizzes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          courseId,
          title: quizTitle,
          description: quizDesc,
          timeLimit: Number(quizTimeLimit),
          questions: quizQuestions
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to create quiz');
      }

      setSuccessMsg('Quiz created successfully!');
      setQuizTitle('');
      setQuizDesc('');
      setQuizTimeLimit(0);
      setQuizQuestions([{ questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
      setShowCreateQuizForm(false);
      
      fetchCourseQuizzes(courseId);
    } catch (err) {
      setError(err.message);
    } finally {
      setQuizFormLoading(false);
    }
  };

  const handleSubmitQuiz = async (e, quizId) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const answersArray = [];
    for (let i = 0; i < selectedQuiz.questions.length; i++) {
      if (quizAnswers[i] === undefined) {
        setError('Please answer all questions before submitting');
        return;
      }
      answersArray.push(Number(quizAnswers[i]));
    }

    setQuizSubmitting(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/quizzes/${quizId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          answers: answersArray
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit quiz');
      }

      setSuccessMsg('Quiz submitted and auto-graded successfully!');
      
      const updatedQuiz = { ...selectedQuiz };
      handleSelectQuiz(updatedQuiz);
    } catch (err) {
      setError(err.message);
    } finally {
      setQuizSubmitting(false);
    }
  };

  const handleAddQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { questionText: '', options: ['', ''], correctAnswerIndex: 0 }
    ]);
  };

  const handleRemoveQuestion = (idx) => {
    if (quizQuestions.length === 1) return;
    setQuizQuestions(quizQuestions.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx, text) => {
    const updated = [...quizQuestions];
    updated[idx].questionText = text;
    setQuizQuestions(updated);
  };

  const handleOptionChange = (qIdx, oIdx, val) => {
    const updated = [...quizQuestions];
    updated[qIdx].options[oIdx] = val;
    setQuizQuestions(updated);
  };

  const handleAddOption = (qIdx) => {
    const updated = [...quizQuestions];
    updated[qIdx].options.push('');
    setQuizQuestions(updated);
  };

  const handleRemoveOption = (qIdx, oIdx) => {
    const updated = [...quizQuestions];
    if (updated[qIdx].options.length <= 2) return;
    updated[qIdx].options.splice(oIdx, 1);
    if (updated[qIdx].correctAnswerIndex >= updated[qIdx].options.length) {
      updated[qIdx].correctAnswerIndex = updated[qIdx].options.length - 1;
    }
    setQuizQuestions(updated);
  };

  const handleCorrectAnswerIndexChange = (qIdx, val) => {
    const updated = [...quizQuestions];
    updated[qIdx].correctAnswerIndex = Number(val);
    setQuizQuestions(updated);
  };

  // Helper variables to segment courses for Students
  const isStudent = user.role === 'student';
  const isLecturer = user.role === 'lecturer' || user.role === 'admin';

  const enrolledCourses = isStudent
    ? courses.filter(c => c.students.includes(user.id))
    : [];
  
  const availableCourses = isStudent
    ? courses.filter(c => !c.students.includes(user.id))
    : [];

  const lecturerCourses = isLecturer
    ? courses.filter(c => c.lecturer._id === user.id || c.lecturer === user.id)
    : [];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }} className="fade-in">
      {/* HEADER SECTION */}
      <header className="card mobile-stack" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Learnova Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Welcome, {user.name}</span>
            <span className={`badge badge-${user.role}`}>{user.role}</span>
          </div>
        </div>
        <button className="btn btn-secondary" onClick={logout}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {/* ALERT MESSAGES */}
      {error && (
        <div className="alert alert-error fade-in">
          <span><AlertCircle size={18} /></span>
          <span>{error}</span>
        </div>
      )}
      
      {successMsg && (
        <div className="alert alert-success fade-in">
          <span><CheckCircle size={18} /></span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* DASHBOARD GRID CONTENT */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
          Loading your courses...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          
          {/* LECTURER VIEW: CREATE COURSE & LIST LECTURED COURSES */}
          {isLecturer && (
            <section className="card" style={{ padding: '30px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.3rem' }}>My Instructing Courses ({lecturerCourses.length})</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateForm(!showCreateForm)}
                >
                  {showCreateForm ? 'Cancel' : '＋ Create Course'}
                </button>
              </div>

              {/* COURSE CREATION FORM */}
              {showCreateForm && (
                <form onSubmit={handleCreateCourse} className="card" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(0,0,0,0.02)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>New Course Details</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
                    <div className="form-group">
                      <label htmlFor="courseCode">Course Code</label>
                      <input
                        type="text"
                        id="courseCode"
                        className="form-input"
                        placeholder="e.g. CSC401"
                        value={newCode}
                        onChange={(e) => setNewCode(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="courseTitle">Course Title</label>
                      <input
                        type="text"
                        id="courseTitle"
                        className="form-input"
                        placeholder="e.g. Advanced Web Technologies"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="courseDesc">Description</label>
                    <textarea
                      id="courseDesc"
                      className="form-input"
                      style={{ minHeight: '100px', resize: 'vertical' }}
                      placeholder="Provide a detailed course syllabus and objectives..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Creating...' : 'Submit Course'}
                  </button>
                </form>
              )}

              {/* COURSE LIST */}
              {lecturerCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  You have not created any courses yet. Click "Create Course" to get started.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {lecturerCourses.map((course) => (
                    <div key={course._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', background: 'rgba(14, 165, 233, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            {course.code}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {course.students.length} Enrolled
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {course.description}
                        </p>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={{ marginTop: '15px', width: '100%' }}
                        onClick={() => handleViewDetails(course._id)}
                      >
                      View Course Details
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* STUDENT VIEW: ENROLLED COURSES */}
          {isStudent && (
            <section className="card" style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>My Enrolled Courses ({enrolledCourses.length})</h2>
              {enrolledCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  You are not enrolled in any courses yet. Scroll down to see available courses.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {enrolledCourses.map((course) => (
                    <div key={course._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '200px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', background: 'rgba(14, 165, 233, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            {course.code}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>
                            Enrolled
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {course.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Lecturer: {course.lecturer?.name || 'Assigned'}
                        </span>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                          onClick={() => handleViewDetails(course._id)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* STUDENT VIEW: AVAILABLE COURSES FOR ENROLLMENT */}
          {isStudent && (
            <section className="card" style={{ padding: '30px' }}>
              <h2 style={{ fontSize: '1.3rem', marginBottom: '20px' }}>Available Courses ({availableCourses.length})</h2>
              {availableCourses.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No other courses available at this time.
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                  {availableCourses.map((course) => (
                    <div key={course._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '220px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)', background: 'rgba(0,0,0,0.05)', padding: '2px 8px', borderRadius: '4px' }}>
                            {course.code}
                          </span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            {course.students.length} Enrolled
                          </span>
                        </div>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {course.title}
                        </h3>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {course.description}
                        </p>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '15px', marginTop: '15px' }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '150px' }}>
                          By: {course.lecturer?.name || 'Lecturer'}
                        </span>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          onClick={() => handleEnroll(course._id)}
                        >
                          Enroll
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

        </div>
      )}

      {/* SELECTED COURSE DETAILS PANEL / MODAL */}
      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content fade-in">
            
            {/* MODAL HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent)', background: 'rgba(14, 165, 233, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                  {selectedCourse.code}
                </span>
                <h2 style={{ fontSize: '1.4rem', marginTop: '8px' }}>{selectedCourse.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedCourse(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer', outline: 'none' }}
              >
                ✕
              </button>
            </div>

            {/* TAB SYSTEM NAVIGATION */}
            <div className="tabs-container" style={{ borderBottom: '1px solid var(--border-color)' }}>
              <button 
                onClick={() => { setActiveTab('details'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                style={{ background: 'none', border: 'none', color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'details' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', borderBottom: activeTab === 'details' ? '2px solid var(--primary)' : 'none', paddingBottom: '10px', transition: 'all 0.2s' }}
              >
                📖 Course Info & Members
              </button>
              <button 
                onClick={() => { setActiveTab('assignments'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                style={{ background: 'none', border: 'none', color: activeTab === 'assignments' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'assignments' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', borderBottom: activeTab === 'assignments' ? '2px solid var(--primary)' : 'none', paddingBottom: '10px', transition: 'all 0.2s' }}
              >
                <FileText size={16} /> Assignments
              </button>
              <button 
                onClick={() => { setActiveTab('quizzes'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                style={{ background: 'none', border: 'none', color: activeTab === 'quizzes' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'quizzes' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', borderBottom: activeTab === 'quizzes' ? '2px solid var(--primary)' : 'none', paddingBottom: '10px', transition: 'all 0.2s' }}
              >
                <ClipboardList size={16} /> Quizzes
              </button>
              <button 
                onClick={() => { setActiveTab('materials'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                style={{ background: 'none', border: 'none', color: activeTab === 'materials' ? 'var(--primary)' : 'var(--text-muted)', fontWeight: activeTab === 'materials' ? '700' : '500', cursor: 'pointer', fontSize: '0.95rem', borderBottom: activeTab === 'materials' ? '2px solid var(--primary)' : 'none', paddingBottom: '10px', transition: 'all 0.2s' }}
              >
                <BookOpen size={16} /> Materials
              </button>
            </div>

            {/* TAB CONTENT 1: COURSE MEMBERS DETAILS */}
            {activeTab === 'details' && (
              <div className="fade-in">
                <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '8px' }}>
                  Description
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: '1.5' }}>
                  {selectedCourse.description}
                </p>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontSize: '0.95rem' }}>
                    <span style={{ fontWeight: '600' }}>Lecturer:</span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {selectedCourse.lecturer?.name} ({selectedCourse.lecturer?.email})
                    </span>
                  </div>

                  <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '12px' }}>
                    Enrolled Students ({selectedCourse.students.length})
                  </h4>
                  
                  {selectedCourse.students.length === 0 ? (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                      No students have enrolled in this course yet.
                    </p>
                  ) : (
                    <ul style={{ listStyle: 'none', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px' }}>
                      {selectedCourse.students.map((student) => (
                        <li 
                          key={student._id} 
                          style={{ padding: '10px 0', borderBottom: '1px solid rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}
                        >
                          <span style={{ fontWeight: '500' }}>{student.name}</span>
                          <span style={{ color: 'var(--text-secondary)' }}>{student.email}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: ASSIGNMENTS & SUBMISSIONS */}
            {activeTab === 'assignments' && (
              <div className="fade-in">
                {selectedAssignment ? (
                  // DRILL-DOWN SUBVIEW: SINGLE ASSIGNMENT DETAIL
                  <div className="fade-in">
                    <button 
                      onClick={() => setSelectedAssignment(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '15px', padding: 0 }}
                    >
                      ← Back to Assignments List
                    </button>

                    <div className="card" style={{ padding: '20px', background: 'rgba(79, 70, 229, 0.02)', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedAssignment.title}</h3>
                        <span className="badge badge-lecturer" style={{ fontSize: '0.75rem' }}>
                          Max Points: {selectedAssignment.maxPoints}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                        ⏰ Due Date: {formatDate(selectedAssignment.dueDate)}
                      </p>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                        {selectedAssignment.description}
                      </p>
                    </div>

                    {/* STUDENT VIEW inside Single Assignment: Submit Coursework or View Grade */}
                    {isStudent && (
                      <div>
                        {submissionLoading ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading your submission details...</p>
                        ) : studentSubmission ? (
                          // CASE 1: Student has already submitted coursework
                          <div className="card" style={{ padding: '20px', borderLeft: `4px solid ${studentSubmission.status === 'graded' ? 'var(--success)' : 'var(--warning)'}` }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                              <h4 style={{ fontSize: '1rem' }}>Your Submission Status</h4>
                              <span className={`badge ${studentSubmission.status === 'graded' ? 'badge-student' : 'badge-admin'}`}>
                                {studentSubmission.status === 'graded' ? 'Graded' : 'Pending Review'}
                              </span>
                            </div>
                            
                            <div style={{ marginBottom: '12px', fontSize: '0.95rem' }}>
                              <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Submission Response:</strong>
                              <span style={{ color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.03)', padding: '6px 12px', borderRadius: '4px', display: 'block', fontFamily: 'monospace', wordBreak: 'break-all' }}>
                                {studentSubmission.content}
                              </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                              Submitted on: {formatDate(studentSubmission.submittedAt)}
                            </p>

                            {studentSubmission.status === 'graded' && (
                              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '12px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                  <strong>Grade Score:</strong>
                                  <span style={{ color: 'var(--success)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                    {studentSubmission.score} / {selectedAssignment.maxPoints} ({((studentSubmission.score / selectedAssignment.maxPoints) * 100).toFixed(0)}%)
                                  </span>
                                </div>
                                {studentSubmission.feedback && (
                                  <div>
                                    <strong style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>Lecturer Feedback:</strong>
                                    <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', background: 'rgba(16, 185, 129, 0.03)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem' }}>
                                      "{studentSubmission.feedback}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          // CASE 2: Student has not submitted yet
                          <form onSubmit={(e) => handleSubmitAssignment(e, selectedAssignment._id)} className="card" style={{ padding: '20px' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Submit Your Coursework</h4>
                            <div className="form-group">
                              <label htmlFor="submitContent">Submission Response (Text Answer or URL Link)</label>
                              <textarea
                                id="submitContent"
                                className="form-input"
                                rows="3"
                                placeholder="Paste your git repository link or write your text response here..."
                                value={submissionContent}
                                onChange={(e) => setSubmissionContent(e.target.value)}
                                required
                                disabled={submitFormLoading}
                              ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submitFormLoading}>
                              {submitFormLoading ? 'Submitting...' : 'Submit Assignment'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* LECTURER VIEW inside Single Assignment: Submissions List & Grading */}
                    {isLecturer && (
                      <div>
                        <h4 style={{ fontSize: '1rem', marginBottom: '12px' }}>Student Submissions ({submissions.length})</h4>
                        {submissionsLoading ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading submissions list...</p>
                        ) : submissions.length === 0 ? (
                          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No student submissions yet.</p>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {submissions.map((sub) => (
                              <div key={sub._id} className="card" style={{ padding: '15px', background: 'rgba(0,0,0,0.01)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <div>
                                    <strong style={{ fontSize: '0.95rem' }}>{sub.studentId?.name}</strong>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({sub.studentId?.email})</span>
                                  </div>
                                  <span className={`badge ${sub.status === 'graded' ? 'badge-student' : 'badge-admin'}`} style={{ fontSize: '0.7rem' }}>
                                    {sub.status}
                                  </span>
                                </div>

                                <div style={{ background: 'rgba(0,0,0,0.03)', padding: '8px 12px', borderRadius: '4px', marginBottom: '10px', fontSize: '0.9rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>
                                  {sub.content}
                                </div>

                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                  Submitted: {formatDate(sub.submittedAt)}
                                </p>

                                {sub.status === 'graded' ? (
                                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px', fontSize: '0.9rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                      <span><strong>Grade Score:</strong> {sub.score} / {selectedAssignment.maxPoints}</span>
                                    </div>
                                    {sub.feedback && <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Feedback: "{sub.feedback}"</p>}
                                  </div>
                                ) : (
                                  // Grading Form toggle
                                  <div>
                                    {gradingSubmissionId === sub._id ? (
                                      <form onSubmit={(e) => handleGradeSubmission(e, sub._id)} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '10px' }}>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '15px' }}>
                                          <div className="form-group">
                                            <label htmlFor="gradeScore">Score</label>
                                            <input
                                              type="number"
                                              id="gradeScore"
                                              className="form-input"
                                              min="0"
                                              max={selectedAssignment.maxPoints}
                                              value={gradeScore}
                                              onChange={(e) => setGradeScore(e.target.value)}
                                              required
                                              disabled={gradeFormLoading}
                                            />
                                          </div>
                                          <div className="form-group">
                                            <label htmlFor="gradeFeedback">Feedback</label>
                                            <input
                                              type="text"
                                              id="gradeFeedback"
                                              className="form-input"
                                              placeholder="Leave notes or remarks..."
                                              value={gradeFeedback}
                                              onChange={(e) => setGradeFeedback(e.target.value)}
                                              disabled={gradeFormLoading}
                                            />
                                          </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                          <button type="submit" className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} disabled={gradeFormLoading}>
                                            {gradeFormLoading ? 'Saving...' : 'Save Grade'}
                                          </button>
                                          <button type="button" className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setGradingSubmissionId(null)}>
                                            Cancel
                                          </button>
                                        </div>
                                      </form>
                                    ) : (
                                      <button 
                                        className="btn btn-primary" 
                                        style={{ padding: '6px 12px', fontSize: '0.8rem', marginTop: '5px' }}
                                        onClick={() => { setGradingSubmissionId(sub._id); setGradeScore(''); setGradeFeedback(''); }}
                                      >
                                        Article Grade Submission
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // OVERVIEW VIEW: LIST OF COURSE ASSIGNMENTS
                  <div className="fade-in">
                    {isLecturer && (
                      <div style={{ marginBottom: '20px' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setShowCreateAssignForm(!showCreateAssignForm)}
                        >
                          {showCreateAssignForm ? 'Cancel Form' : '＋ Create Assignment'}
                        </button>

                        {/* CREATE ASSIGNMENT FORM */}
                        {showCreateAssignForm && (
                          <form onSubmit={(e) => handleCreateAssignment(e, selectedCourse._id)} className="card" style={{ padding: '20px', marginTop: '15px', background: 'rgba(0,0,0,0.01)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '12px' }}>New Assignment Details</h4>
                            <div className="form-group">
                              <label htmlFor="assignTitle">Assignment Title</label>
                              <input
                                type="text"
                                id="assignTitle"
                                className="form-input"
                                placeholder="e.g. Homework 1: REST API design"
                                value={assignTitle}
                                onChange={(e) => setAssignTitle(e.target.value)}
                                required
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="assignDesc">Instructions & Description</label>
                              <textarea
                                id="assignDesc"
                                className="form-input"
                                rows="3"
                                placeholder="Describe assignment tasks, files required, and upload requirements..."
                                value={assignDesc}
                                onChange={(e) => setAssignDesc(e.target.value)}
                                required
                              ></textarea>
                            </div>
                            <div className="form-row">
                              <div className="form-group">
                                <label htmlFor="assignDueDate">Due Date</label>
                                <input
                                  type="datetime-local"
                                  id="assignDueDate"
                                  className="form-input"
                                  value={assignDueDate}
                                  onChange={(e) => setAssignDueDate(e.target.value)}
                                  required
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="assignMaxPoints">Maximum Points</label>
                                <input
                                  type="number"
                                  id="assignMaxPoints"
                                  className="form-input"
                                  min="1"
                                  value={assignMaxPoints}
                                  onChange={(e) => setAssignMaxPoints(e.target.value)}
                                  required
                                />
                              </div>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={assignFormLoading}>
                              {assignFormLoading ? 'Creating...' : 'Submit Assignment'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* ASSIGNMENTS LIST */}
                    {assignmentsLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading course assignments...</p>
                    ) : assignments.length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '20px 0' }}>
                        No assignments created for this course yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {assignments.map((assign) => (
                          <div key={assign._id} className="card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{assign.title}</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Due: {formatDate(assign.dueDate)} | Max Points: {assign.maxPoints}
                              </p>
                            </div>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleSelectAssignment(assign)}
                            >
                              View & Manage
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 3: INTERACTIVE QUIZZES */}
            {activeTab === 'quizzes' && (
              <div className="fade-in">
                {selectedQuiz ? (
                  // DRILL-DOWN SUBVIEW: SINGLE QUIZ ATTEMPT OR RESULTS
                  <div className="fade-in">
                    <button 
                      onClick={() => setSelectedQuiz(null)}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', marginBottom: '15px', padding: 0 }}
                    >
                      ← Back to Quizzes List
                    </button>

                    <div className="card" style={{ padding: '20px', background: 'rgba(14, 165, 233, 0.02)', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>{selectedQuiz.title}</h3>
                        <span className="badge badge-student" style={{ fontSize: '0.75rem' }}>
                          Questions: {selectedQuiz.questions?.length} | Time: {selectedQuiz.timeLimit > 0 ? `${selectedQuiz.timeLimit} mins` : 'No Limit'}
                        </span>
                      </div>
                      {selectedQuiz.description && (
                        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                          {selectedQuiz.description}
                        </p>
                      )}
                    </div>

                    {/* STUDENT VIEW: TAKE QUIZ OR VIEW ATTEMPT RESULT */}
                    {isStudent && (
                      <div>
                        {myQuizAttemptLoading ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading quiz details...</p>
                        ) : myQuizAttempt && myQuizAttempt.attempt ? (
                          // CASE 1: Student has already taken the quiz (Show results and review)
                          <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--success)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                              <h4 style={{ fontSize: '1.1rem' }}>Quiz Results</h4>
                              <span className="badge badge-student" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderColor: 'rgba(16, 185, 129, 0.2)', fontSize: '0.85rem' }}>
                                Score: {myQuizAttempt.attempt.score} / {myQuizAttempt.attempt.maxScore} ({((myQuizAttempt.attempt.score / myQuizAttempt.attempt.maxScore) * 100).toFixed(0)}%)
                              </span>
                            </div>

                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                              Submitted: {formatDate(myQuizAttempt.attempt.submittedAt)}
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                              {myQuizAttempt.questions?.map((q, qIdx) => {
                                const studentSelection = myQuizAttempt.attempt.answers[qIdx];
                                const isCorrect = studentSelection === q.correctAnswerIndex;

                                return (
                                  <div key={q._id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                                    <h5 style={{ fontSize: '0.95rem', marginBottom: '10px', display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                      <span>{qIdx + 1}.</span>
                                      <span>{q.questionText}</span>
                                      <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                      </span>
                                    </h5>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '20px' }}>
                                      {q.options.map((opt, oIdx) => {
                                        let borderStyle = '1px solid var(--border-color)';
                                        let bgStyle = 'transparent';
                                        let checkIcon = '';

                                        if (oIdx === q.correctAnswerIndex) {
                                          borderStyle = '1px solid var(--success)';
                                          bgStyle = 'rgba(16, 185, 129, 0.05)';
                                          checkIcon = ' (Correct Key)';
                                        }

                                        if (oIdx === studentSelection) {
                                          if (isCorrect) {
                                            borderStyle = '2px solid var(--success)';
                                            bgStyle = 'rgba(16, 185, 129, 0.1)';
                                          } else {
                                            borderStyle = '2px solid var(--error)';
                                            bgStyle = 'rgba(239, 68, 68, 0.08)';
                                          }
                                        }

                                        return (
                                          <div 
                                            key={oIdx} 
                                            style={{ padding: '8px 12px', borderRadius: '6px', border: borderStyle, background: bgStyle, fontSize: '0.9rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                                          >
                                            <span>
                                              {String.fromCharCode(65 + oIdx)}. {opt}
                                            </span>
                                            {oIdx === studentSelection && (
                                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: isCorrect ? 'var(--success)' : 'var(--error)' }}>
                                                Your Choice{checkIcon}
                                              </span>
                                            )}
                                            {oIdx === q.correctAnswerIndex && oIdx !== studentSelection && (
                                              <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--success)' }}>
                                                Correct Answer
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : (
                          // CASE 2: Student is taking the quiz
                          <form onSubmit={(e) => handleSubmitQuiz(e, selectedQuiz._id)} className="card" style={{ padding: '24px' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>Answer Sheet</h4>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '30px' }}>
                              {selectedQuiz.questions?.map((q, qIdx) => (
                                <div key={q._id} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                  <h5 style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                                    {qIdx + 1}. {q.questionText}
                                  </h5>
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '10px' }}>
                                    {q.options.map((opt, oIdx) => (
                                      <label 
                                        key={oIdx} 
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', background: quizAnswers[qIdx] === oIdx ? 'rgba(79, 70, 229, 0.04)' : 'transparent', borderColor: quizAnswers[qIdx] === oIdx ? 'var(--primary)' : 'var(--border-color)' }}
                                      >
                                        <input
                                          type="radio"
                                          name={`question-${qIdx}`}
                                          checked={quizAnswers[qIdx] === oIdx}
                                          onChange={() => setQuizAnswers({ ...quizAnswers, [qIdx]: oIdx })}
                                          disabled={quizSubmitting}
                                        />
                                        <span style={{ fontSize: '0.9rem' }}>{opt}</span>
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={quizSubmitting}>
                              {quizSubmitting ? 'Submitting Answers...' : 'Submit Answers'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* LECTURER VIEW: LIST ATTEMPTS */}
                    {isLecturer && (
                      <div className="card" style={{ padding: '20px' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '15px' }}>Student Performance Attempts ({quizAttempts.length})</h4>
                        {quizAttemptsLoading ? (
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Loading attempts...</p>
                        ) : quizAttempts.length === 0 ? (
                          <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.9rem' }}>No students have attempted this quiz yet.</p>
                        ) : (
                          <div style={{ overflowX: 'auto' }}>
                            <div className="table-responsive">
<table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                              <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                  <th style={{ padding: '10px' }}>Student</th>
                                  <th style={{ padding: '10px' }}>Email</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>Score</th>
                                  <th style={{ padding: '10px', textAlign: 'center' }}>Percentage</th>
                                  <th style={{ padding: '10px', textAlign: 'right' }}>Submitted At</th>
                                </tr>
                              </thead>
                              <tbody>
                                {quizAttempts.map((att) => (
                                  <tr key={att._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                                    <td style={{ padding: '12px 10px', fontWeight: '500' }}>{att.studentId?.name}</td>
                                    <td style={{ padding: '12px 10px', color: 'var(--text-secondary)' }}>{att.studentId?.email}</td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center', fontWeight: 'bold' }}>{att.score} / {att.maxScore}</td>
                                    <td style={{ padding: '12px 10px', textAlign: 'center', color: att.score / att.maxScore >= 0.5 ? 'var(--success)' : 'var(--error)', fontWeight: 'bold' }}>
                                      {((att.score / att.maxScore) * 100).toFixed(0)}%
                                    </td>
                                    <td style={{ padding: '12px 10px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.8rem' }}>{formatDate(att.submittedAt)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  // OVERVIEW VIEW: LIST OF COURSE QUIZZES
                  <div className="fade-in">
                    {isLecturer && (
                      <div style={{ marginBottom: '20px' }}>
                        <button 
                          className="btn btn-primary" 
                          onClick={() => setShowCreateQuizForm(!showCreateQuizForm)}
                        >
                          {showCreateQuizForm ? 'Cancel Form' : '＋ Create Quiz'}
                        </button>

                        {/* CREATE QUIZ FORM */}
                        {showCreateQuizForm && (
                          <form onSubmit={(e) => handleCreateQuiz(e, selectedCourse._id)} className="card" style={{ padding: '20px', marginTop: '15px', background: 'rgba(0,0,0,0.01)' }}>
                            <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>New Quiz Details</h4>
                            
                            <div className="form-group">
                              <label htmlFor="quizTitle">Quiz Title</label>
                              <input
                                type="text"
                                id="quizTitle"
                                className="form-input"
                                placeholder="e.g. Quiz 1: Mongoose & Models"
                                value={quizTitle}
                                onChange={(e) => setQuizTitle(e.target.value)}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label htmlFor="quizDesc">Description & Instructions</label>
                              <textarea
                                id="quizDesc"
                                className="form-input"
                                rows="2"
                                placeholder="Provide brief instructions for the quiz..."
                                value={quizDesc}
                                onChange={(e) => setQuizDesc(e.target.value)}
                              ></textarea>
                            </div>

                            <div className="form-group" style={{ maxWidth: '200px' }}>
                              <label htmlFor="quizTimeLimit">Time Limit (Minutes)</label>
                              <input
                                type="number"
                                id="quizTimeLimit"
                                className="form-input"
                                min="0"
                                placeholder="0 = No limit"
                                value={quizTimeLimit}
                                onChange={(e) => setQuizTimeLimit(e.target.value)}
                              />
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>0 means no countdown timer.</span>
                            </div>

                            <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                              <h5 style={{ fontSize: '1rem', marginBottom: '15px', color: 'var(--text-primary)' }}>Questions ({quizQuestions.length})</h5>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                {quizQuestions.map((q, qIdx) => (
                                  <div key={qIdx} className="card" style={{ padding: '16px', background: 'rgba(0,0,0,0.01)', borderLeft: '3px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                      <strong style={{ fontSize: '0.9rem' }}>Question {qIdx + 1}</strong>
                                      {quizQuestions.length > 1 && (
                                        <button 
                                          type="button" 
                                          style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold' }} 
                                          onClick={() => handleRemoveQuestion(qIdx)}
                                        >
                                          ✕ Remove Question
                                        </button>
                                      )}
                                    </div>

                                    <div className="form-group">
                                      <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Enter the question text..."
                                        value={q.questionText}
                                        onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                                        required
                                      />
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', marginLeft: '10px' }}>
                                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Options (Choices)</label>
                                      {q.options.map((opt, oIdx) => (
                                        <div key={oIdx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                          <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)' }}>{String.fromCharCode(65 + oIdx)}.</span>
                                          <input
                                            type="text"
                                            className="form-input"
                                            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                                            placeholder={`Option ${oIdx + 1}`}
                                            value={opt}
                                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                                            required
                                          />
                                          {q.options.length > 2 && (
                                            <button 
                                              type="button" 
                                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1rem' }} 
                                              onClick={() => handleRemoveOption(qIdx, oIdx)}
                                            >
                                              ✕
                                            </button>
                                          )}
                                        </div>
                                      ))}
                                      <button 
                                        type="button" 
                                        style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '600', width: 'fit-content', padding: 0 }}
                                        onClick={() => handleAddOption(qIdx)}
                                      >
                                        ＋ Add Choice Option
                                      </button>
                                    </div>

                                    <div className="form-group" style={{ maxWidth: '250px' }}>
                                      <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>Correct Answer Key</label>
                                      <select
                                        className="form-select"
                                        style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                                        value={q.correctAnswerIndex}
                                        onChange={(e) => handleCorrectAnswerIndexChange(qIdx, e.target.value)}
                                      >
                                        {q.options.map((_, oIdx) => (
                                          <option key={oIdx} value={oIdx}>
                                            Option {String.fromCharCode(65 + oIdx)}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              <button 
                                type="button" 
                                className="btn btn-secondary" 
                                style={{ marginTop: '15px', display: 'block', width: '100%', fontSize: '0.85rem' }}
                                onClick={handleAddQuestion}
                              >
                                ＋ Add Another Question
                              </button>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={quizFormLoading}>
                              {quizFormLoading ? 'Creating Quiz...' : 'Create & Save Quiz'}
                            </button>
                          </form>
                        )}
                      </div>
                    )}

                    {/* QUIZZES LIST */}
                    {quizzesLoading ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Loading course quizzes...</p>
                    ) : quizzes.length === 0 ? (
                      <p style={{ fontStyle: 'italic', color: 'var(--text-muted)', fontSize: '0.95rem', padding: '20px 0' }}>
                        No quizzes created for this course yet.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {quizzes.map((quiz) => (
                          <div key={quiz._id} className="card" style={{ padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <h4 style={{ fontSize: '1rem', marginBottom: '4px' }}>{quiz.title}</h4>
                              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                Questions: {quiz.questions?.length} | Time: {quiz.timeLimit > 0 ? `${quiz.timeLimit} mins` : 'No Limit'}
                              </p>
                            </div>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                              onClick={() => handleSelectQuiz(quiz)}
                            >
                              {isStudent ? 'View & Attempt' : 'View Performance'}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'materials' && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Course Materials</h3>
                    <select 
                      value={matFilter} 
                      onChange={(e) => {
                        setMatFilter(e.target.value);
                        fetchCourseMaterials(selectedCourse._id, e.target.value);
                      }}
                      className="form-input"
                      style={{ padding: '4px 10px', fontSize: '0.9rem', width: 'auto' }}
                    >
                      <option value="all">All Difficulties</option>
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                  {isLecturer && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowCreateMaterialForm(!showCreateMaterialForm)}
                    >
                      {showCreateMaterialForm ? 'Cancel' : '＋ Add Material'}
                    </button>
                  )}
                </div>

                {isLecturer && showCreateMaterialForm && (
                  <form onSubmit={(e) => handleCreateMaterial(e, selectedCourse._id)} className="card" style={{ padding: '24px', marginBottom: '30px', background: 'rgba(0,0,0,0.02)' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Upload New Material</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Title</label>
                        <input type="text" className="form-input" required value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="e.g. Intro to Arrays" />
                      </div>
                      <div className="form-group">
                        <label>Difficulty</label>
                        <select className="form-input" value={matDifficulty} onChange={e => setMatDifficulty(e.target.value)}>
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>Content Type</label>
                        <select className="form-input" value={matContentType} onChange={e => setMatContentType(e.target.value)}>
                          <option value="text">Text / Article</option>
                          <option value="pdf">PDF Link</option>
                          <option value="video">Video Link</option>
                        </select>
                      </div>
                      {(matContentType === 'pdf' || matContentType === 'video') && (
                        <div className="form-group">
                          <label>File URL</label>
                          <input type="url" className="form-input" required value={matFileUrl} onChange={e => setMatFileUrl(e.target.value)} placeholder="https://..." />
                        </div>
                      )}
                    </div>

                    {matContentType === 'text' && (
                      <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label>Body Text</label>
                        <textarea className="form-input" rows="6" required value={matBodyText} onChange={e => setMatBodyText(e.target.value)} placeholder="Write your content here..."></textarea>
                      </div>
                    )}

                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label>Description</label>
                      <input type="text" className="form-input" required value={matDesc} onChange={e => setMatDesc(e.target.value)} placeholder="Brief summary of this material..." />
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={materialFormLoading}>
                      {materialFormLoading ? 'Uploading...' : 'Publish Material'}
                    </button>
                  </form>
                )}

                {materialsLoading ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-secondary)' }}>Loading materials...</div>
                ) : materials.length === 0 ? (
                  <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No materials found. {isLecturer && 'Add some to get started!'}
                  </div>
                ) : (
                  <div className="grid-cards">
                    {materials.map(mat => (
                      <div key={mat._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span className={`badge ${mat.difficultyLevel === 'easy' ? 'badge-student' : mat.difficultyLevel === 'hard' ? 'badge-admin' : 'badge-lecturer'}`}>
                            {mat.difficultyLevel.toUpperCase()}
                          </span>
                          <span style={{ fontSize: '1.2rem' }}>
                            {mat.contentType === 'pdf' ? 'PDF' : mat.contentType === 'video' ? 'Video' : 'Article'}
                          </span>
                        </div>
                        <h4 style={{ fontSize: '1.1rem', margin: '5px 0' }}>{mat.title}</h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px', flexGrow: 1 }}>{mat.description}</p>
                        
                        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                          {mat.contentType === 'text' ? (
                            <button 
                              className="btn btn-primary" style={{ flexGrow: 1, padding: '6px' }}
                              onClick={() => alert(mat.bodyText)} // Quick placeholder for reading text
                            >Read Article</button>
                          ) : (
                            <a 
                              href={mat.fileUrl} target="_blank" rel="noopener noreferrer" 
                              className="btn btn-primary" style={{ flexGrow: 1, padding: '6px', textAlign: 'center', textDecoration: 'none' }}
                            >Open {mat.contentType.toUpperCase()}</a>
                          )}
                          
                          {isLecturer && (
                            <button 
                              className="btn btn-secondary" style={{ padding: '6px 12px', color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={() => handleDeleteMaterial(mat._id, selectedCourse._id)}
                            >Delete</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

