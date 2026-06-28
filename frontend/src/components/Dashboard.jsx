import { useState, useEffect } from 'react';
import { LogOut, FileText, ClipboardList, BookOpen, Settings, ArrowLeft, Info, Award, Clock, User, Trophy, GraduationCap } from 'lucide-react';
import DiagnosticTest from './DiagnosticTest.jsx';
import { ToastContainer, useToast } from './Toast.jsx';
import { SkeletonDashboard, SkeletonList, SkeletonMaterialGrid } from './Skeleton.jsx';

const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

const Dashboard = ({ token, user, logout, goToProfile }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toasts, removeToast, toast } = useToast();
  
  // Lecturer course creation form state
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  // Selected course details modal/drawer state
  const [selectedCourse, setSelectedCourse] = useState(null);


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
  const [matDifficulty, setMatDifficulty] = useState('Beginner');
  const [matFilter, setMatFilter] = useState('adaptive');
  const [adaptiveStats, setAdaptiveStats] = useState(null);

  // Diagnostic Test state
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [diagnosticCourseId, setDiagnosticCourseId] = useState(null);
  const [diagnosticCourseName, setDiagnosticCourseName] = useState('');
  const [myLevel, setMyLevel] = useState(null); // student's level for selected course

  // Diagnostic Test lecturer state
  const [existingDiagTest, setExistingDiagTest] = useState(null);
  const [diagTestLoading, setDiagTestLoading] = useState(false);
  const [showDiagCreateForm, setShowDiagCreateForm] = useState(false);
  const [diagTitle, setDiagTitle] = useState('');
  const [diagDesc, setDiagDesc] = useState('');
  const [diagQuestions, setDiagQuestions] = useState([
    { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }
  ]);
  const [diagFormLoading, setDiagFormLoading] = useState(false);
  const [diagClassResults, setDiagClassResults] = useState(null);
  const [diagClassLoading, setDiagClassLoading] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
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
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Load courses on component mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreateCourse = async (e) => {
    e.preventDefault();

    if (!newTitle || !newCode || !newDesc) {
      toast.error('Please fill in all course details');
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

      toast.success(`Course ${data.data.code} created successfully!`);
      setNewTitle('');
      setNewCode('');
      setNewDesc('');
      setShowCreateForm(false);
      
      // Refresh course list
      fetchCourses();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEnroll = async (courseId, courseName) => {
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

      toast.success(data.message || 'Enrolled successfully!');
      fetchCourses();

      // Open the diagnostic test immediately after enrollment
      setDiagnosticCourseId(courseId);
      setDiagnosticCourseName(courseName);
      setShowDiagnostic(true);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleViewDetails = async (courseId) => {

    setActiveTab('details');
    setSelectedAssignment(null);
    setMyLevel(null);
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
      
      // Load assignments, quizzes, materials in background
      fetchCourseAssignments(courseId);
      fetchCourseQuizzes(courseId);
      fetchCourseMaterials(courseId, matFilter);

      // For students: fetch their current diagnostic level for this course
      if (isStudent) {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/diagnostic/course/${courseId}/my-result`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
          .then(r => r.json())
          .then(d => { if (d.success) setMyLevel(d.data.level); })
          .catch(() => {});
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      // setDetailsLoading(false);
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

    if (!assignTitle || !assignDesc || !assignDueDate || !assignMaxPoints) {
      toast.error('Please fill in all assignment fields');
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

      toast.success('Assignment created successfully!');
      setAssignTitle('');
      setAssignDesc('');
      setAssignDueDate('');
      setAssignMaxPoints(100);
      setShowCreateAssignForm(false);
      
      // Refresh assignments
      fetchCourseAssignments(courseId);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAssignFormLoading(false);
    }
  };

  const handleSelectAssignment = async (assignment) => {
    setSelectedAssignment(assignment);
    setGradingSubmissionId(null);
    setGradeScore('');
    setGradeFeedback('');

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

    if (!submissionContent) {
      toast.error('Please enter your submission text or repository link');
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

      toast.success('Assignment response submitted successfully!');
      setSubmissionContent('');
      
      // Reload submission status
      const updatedAssign = { ...selectedAssignment };
      handleSelectAssignment(updatedAssign);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitFormLoading(false);
    }
  };

  const handleGradeSubmission = async (e, submissionId) => {
    e.preventDefault();

    if (gradeScore === '') {
      toast.error('Please provide a grade score');
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

      toast.success('Graded and performance records updated successfully!');
      setGradeScore('');
      setGradeFeedback('');
      setGradingSubmissionId(null);
      
      // Reload submissions list
      const updatedAssign = { ...selectedAssignment };
      handleSelectAssignment(updatedAssign);
    } catch (err) {
      toast.error(err.message);
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
  const fetchCourseMaterials = async (courseId, difficulty = 'adaptive') => {
    setMaterialsLoading(true);
    setAdaptiveStats(null);
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
      if (data.adaptiveStats) {
        setAdaptiveStats(data.adaptiveStats);
      }
    } catch (err) {
      console.error('Error fetching materials:', err.message);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleCreateMaterial = async (e, courseId) => {
    e.preventDefault();

    if (!matTitle || !matDesc || !matContentType) {
      toast.error('Please fill in material title, description, and type');
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

      toast.success('Material created successfully!');
      setMatTitle('');
      setMatDesc('');
      setMatContentType('text');
      setMatFileUrl('');
      setMatBodyText('');
      setMatDifficulty('Beginner');
      setShowCreateMaterialForm(false);
      
      fetchCourseMaterials(courseId, matFilter);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMaterialFormLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId, courseId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/materials/${materialId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete material');

      toast.success('Material deleted successfully');
      fetchCourseMaterials(courseId, matFilter);
    } catch (err) {
      toast.error(err.message);
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

    if (!quizTitle || quizQuestions.length === 0) {
      toast.error('Please fill in quiz title and add at least one question');
      return;
    }

    for (const q of quizQuestions) {
      if (!q.questionText || q.options.some(o => !o.trim())) {
        toast.error('Please make sure all questions and options are filled out');
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

      toast.success('Quiz created successfully!');
      setQuizTitle('');
      setQuizDesc('');
      setQuizTimeLimit(0);
      setQuizQuestions([{ questionText: '', options: ['', ''], correctAnswerIndex: 0 }]);
      setShowCreateQuizForm(false);
      
      fetchCourseQuizzes(courseId);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setQuizFormLoading(false);
    }
  };

  const handleSubmitQuiz = async (e, quizId) => {
    e.preventDefault();

    const answersArray = [];
    for (let i = 0; i < selectedQuiz.questions.length; i++) {
      if (quizAnswers[i] === undefined) {
        toast.error('Please answer all questions before submitting');
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

      toast.success('Quiz submitted and auto-graded successfully!');

      // ADAPTIVE ENGINE: Handle level update notification
      if (data.data?.levelUpdate) {
        const { previousLevel, newLevel, rollingAverage } = data.data.levelUpdate;
        
        const direction = previousLevel &&
          (['Beginner', 'Intermediate', 'Advanced'].indexOf(newLevel) >
           ['Beginner', 'Intermediate', 'Advanced'].indexOf(previousLevel))
          ? 'levelled up' : previousLevel ? 'updated' : 'set';

        toast.success(
          `Quiz graded! Your learning level has been ${direction} to ${newLevel} ` +
          `(quiz average: ${rollingAverage}%). Your materials have been refreshed!`
        );
        // Update the level badge in the materials tab immediately
        setMyLevel(newLevel);
        // Refresh materials to match new level
        if (selectedCourse) fetchCourseMaterials(selectedCourse._id, matFilter);
      }

      const updatedQuiz = { ...selectedQuiz };
      handleSelectQuiz(updatedQuiz);
    } catch (err) {
      toast.error(err.message);
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

  // DIAGNOSTIC TEST HELPERS (Lecturer)
  const fetchDiagnosticTest = async (courseId) => {
    setDiagTestLoading(true);
    setExistingDiagTest(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/diagnostic/course/${courseId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setExistingDiagTest(data.data);
        // Pre-fill form with existing test data
        setDiagTitle(data.data.title);
        setDiagDesc(data.data.description || '');
        setDiagQuestions(data.data.questions.map(q => ({
          questionText: q.questionText,
          options: [...q.options],
          correctAnswerIndex: q.correctAnswerIndex
        })));
      }
    } catch (err) {
      console.error('Error fetching diagnostic test:', err);
    } finally {
      setDiagTestLoading(false);
    }
  };

  const fetchDiagClassResults = async (courseId) => {
    setDiagClassLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/diagnostic/course/${courseId}/results`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setDiagClassResults(data);
    } catch (err) {
      console.error('Error fetching class diagnostic results:', err);
    } finally {
      setDiagClassLoading(false);
    }
  };

  const handleCreateDiagTest = async (e, courseId) => {
    e.preventDefault();

    if (!diagTitle || diagQuestions.length === 0) {
      toast.error('Please add a title and at least one question');
      return;
    }
    for (const q of diagQuestions) {
      if (!q.questionText.trim() || q.options.some(o => !o.trim())) {
        toast.error('Please fill in all question texts and options');
        return;
      }
    }

    setDiagFormLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/diagnostic`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ courseId, title: diagTitle, description: diagDesc, questions: diagQuestions })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save diagnostic test');

      toast.success('Diagnostic test saved successfully! Students will now be prompted to take it upon enrollment.');
      setShowDiagCreateForm(false);
      setExistingDiagTest(data.data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDiagFormLoading(false);
    }
  };

  const handleDiagQuestionChange = (idx, text) => {
    const updated = [...diagQuestions];
    updated[idx].questionText = text;
    setDiagQuestions(updated);
  };

  const handleDiagOptionChange = (qIdx, oIdx, val) => {
    const updated = [...diagQuestions];
    updated[qIdx].options[oIdx] = val;
    setDiagQuestions(updated);
  };

  const handleDiagCorrectChange = (qIdx, val) => {
    const updated = [...diagQuestions];
    updated[qIdx].correctAnswerIndex = Number(val);
    setDiagQuestions(updated);
  };

  const handleAddDiagQuestion = () => {
    setDiagQuestions([...diagQuestions, { questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
  };

  const handleRemoveDiagQuestion = (idx) => {
    if (diagQuestions.length === 1) return;
    setDiagQuestions(diagQuestions.filter((_, i) => i !== idx));
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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>

      {/* ── TOP BAR ───────────────────────────────────────────── */}
      <header className="app-topbar">
        <div className="app-topbar-logo">
          <div className="app-topbar-monogram">L</div>
          <span className="app-topbar-name">Learnova</span>
        </div>
        <div className="app-topbar-divider" />
        <span className="app-topbar-breadcrumb">
          {user.role === 'lecturer' ? 'Lecturer Dashboard' : 'Student Dashboard'}
        </span>
        <div className="app-topbar-actions">
          <div className="app-topbar-user">
            <div className="app-topbar-avatar">{getInitials(user.name)}</div>
            <div className="app-topbar-user-info">
              <span className="app-topbar-user-name">{user.name}</span>
              <span className="app-topbar-user-role">{user.role}</span>
            </div>
          </div>
          <div className="app-topbar-divider" />
          <button className="btn btn-ghost btn-sm" onClick={goToProfile} title="Profile Settings">
            <Settings size={16} />
          </button>
          <button className="btn btn-secondary btn-sm" onClick={logout}>
            <LogOut size={15} /> Logout
          </button>
        </div>
      </header>

      {!selectedCourse ? (
        <div className="page-wrapper fade-in">
          {/* GREETING */}
          <div className="greeting-block">
            <div className="greeting-text">{getGreeting()}, {user.name.split(' ')[0]}</div>
            <div className="greeting-sub">
              {user.role === 'lecturer'
                ? `You have ${lecturerCourses.length} course${lecturerCourses.length !== 1 ? 's' : ''} you're instructing.`
                : `You are enrolled in ${enrolledCourses.length} course${enrolledCourses.length !== 1 ? 's' : ''}.`
              }
            </div>
          </div>

      {/* DASHBOARD GRID CONTENT */}
      {loading ? (
        <div style={{ padding: '30px 0' }}>
          <SkeletonDashboard />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '30px' }}>
          
          {/* LECTURER VIEW: CREATE COURSE & LIST LECTURED COURSES */}
          {isLecturer && (
            <section className="card" style={{ padding: '28px' }}>
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
                <div className="empty-state">
                  <div className="empty-state-icon"><BookOpen size={22} /></div>
                  <h3>No courses yet</h3>
                  <p>Click &quot;Create Course&quot; above to get started.</p>
                </div>
              ) : (
                <div className="grid-cards-auto">
                  {lecturerCourses.map((course) => (
                    <div key={course._id} className="course-card">
                      <div className="course-card-accent lecturer" />
                      <div className="course-card-body">
                        <span className="course-card-code">{course.code}</span>
                        <div className="course-card-title">{course.title}</div>
                        <p className="course-card-desc">{course.description}</p>
                      </div>
                      <div className="course-card-footer">
                        <span className="course-card-meta">
                          <User size={13} /> {course.students.length} enrolled
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
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

          {/* STUDENT VIEW: ENROLLED COURSES */}
          {isStudent && (
            <section className="card" style={{ padding: '28px' }}>
              <div className="section-header">
                <h2>My Enrolled Courses <span className="section-meta">({enrolledCourses.length})</span></h2>
              </div>
              {enrolledCourses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><GraduationCap size={22} /></div>
                  <h3>Not enrolled yet</h3>
                  <p>Browse available courses below and enrol to get started.</p>
                </div>
              ) : (
                <div className="grid-cards-auto">
                  {enrolledCourses.map((course) => (
                    <div key={course._id} className="course-card">
                      <div className="course-card-accent enrolled" />
                      <div className="course-card-body">
                        <span className="course-card-code">{course.code}</span>
                        <div className="course-card-title">{course.title}</div>
                        <p className="course-card-desc">{course.description}</p>
                      </div>
                      <div className="course-card-footer">
                        <span className="course-card-meta">
                          <User size={13} /> {course.lecturer?.name || 'Assigned'}
                        </span>
                        <button
                          className="btn btn-secondary btn-sm"
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
            <section className="card" style={{ padding: '28px' }}>
              <div className="section-header">
                <h2>Available Courses <span className="section-meta">({availableCourses.length})</span></h2>
              </div>
              {availableCourses.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><BookOpen size={22} /></div>
                  <h3>No courses available</h3>
                  <p>Check back later for new courses.</p>
                </div>
              ) : (
                <div className="grid-cards-auto">
                  {availableCourses.map((course) => (
                    <div key={course._id} className="course-card">
                      <div className="course-card-accent available" />
                      <div className="course-card-body">
                        <span className="course-card-code">{course.code}</span>
                        <div className="course-card-title">{course.title}</div>
                        <p className="course-card-desc">{course.description}</p>
                      </div>
                      <div className="course-card-footer">
                        <span className="course-card-meta">
                          <User size={13} /> {course.lecturer?.name || 'Lecturer'}
                        </span>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleEnroll(course._id, course.title)}
                        >
                          Enrol
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

        {/* DIAGNOSTIC TEST OVERLAY - Shown after enrollment */}
        {showDiagnostic && diagnosticCourseId && (
          <div className="modal-overlay">
            <div className="modal-content fade-in" style={{ maxWidth: '780px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Placement Diagnostic</h2>
                  <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{diagnosticCourseName}</p>
                </div>
                <button
                  onClick={() => { setShowDiagnostic(false); setDiagnosticCourseId(null); }}
                  style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}
                >✕</button>
              </div>
              <DiagnosticTest
                token={token}
                courseId={diagnosticCourseId}
                courseName={diagnosticCourseName}
                onComplete={(level) => {
                  setMyLevel(level);
                  setShowDiagnostic(false);
                  setDiagnosticCourseId(null);
                  toast.success(`Diagnostic complete! You are classified as ${level}. Your materials have been personalised.`);
                }}
                onSkip={() => {
                  setShowDiagnostic(false);
                  setDiagnosticCourseId(null);
                }}
              />
            </div>
          </div>
        )}

      </div>
    ) : (
        <div className="course-hub-layout fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TOP BAR / BACK TO DASHBOARD */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              onClick={() => { setSelectedCourse(null); setSelectedAssignment(null); setSelectedQuiz(null); }} 
              className="btn btn-secondary" 
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontWeight: '600' }}
            >
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <span className="badge badge-student" style={{ fontSize: '0.85rem', padding: '6px 12px', background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 'bold', border: '1px solid rgba(37, 99, 235, 0.2)' }}>
              Course Hub
            </span>
          </div>

          {/* HERO HEADER BLOCK */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
            color: '#ffffff',
            padding: '32px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative',
            overflow: 'hidden',
            border: 'none'
          }}>
            <div style={{ position: 'relative', zIndex: 2 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.05em', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '4px', textTransform: 'uppercase' }}>
                  {selectedCourse.code}
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', background: 'var(--success-bg)', color: 'var(--success-text)', padding: '4px 10px', borderRadius: '4px' }}>
                  Enrolled
                </span>
              </div>
              <h1 style={{ fontSize: '2.2rem', margin: '0 0 10px 0', fontWeight: '800', letterSpacing: '-0.02em', color: '#ffffff' }}>{selectedCourse.title}</h1>
              <p style={{ opacity: 0.9, fontSize: '1rem', maxWidth: '750px', marginBottom: '20px', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)' }}>
                {selectedCourse.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', alignItems: 'center', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px' }}>
                  <User size={16} />
                  <span>Lecturer: <strong>{selectedCourse.lecturer?.name || 'Unassigned'}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '6px 14px', borderRadius: '20px' }}>
                  <Clock size={16} />
                  <span>Last Updated: {new Date(selectedCourse.updatedAt || selectedCourse.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            {/* Subtle background decoration */}
            <div style={{ position: 'absolute', right: '-20px', bottom: '-40px', opacity: 0.08, pointerEvents: 'none' }}>
              <Award size={180} />
            </div>
          </div>

          {/* THREE-COLUMN DYNAMIC GRID */}
          <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '24px' }} className="mobile-stack">
            
            {/* COLUMN 1: LEFT SIDEBAR NAVIGATION */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="card" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button 
                  onClick={() => { setActiveTab('details'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                  className={`btn ${activeTab === 'details' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', fontWeight: activeTab === 'details' ? '700' : '500' }}
                >
                  <Info size={16} /> Information
                </button>
                <button 
                  onClick={() => { setActiveTab('materials'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                  className={`btn ${activeTab === 'materials' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', fontWeight: activeTab === 'materials' ? '700' : '500' }}
                >
                  <BookOpen size={16} /> Materials
                </button>
                <button 
                  onClick={() => { setActiveTab('quizzes'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                  className={`btn ${activeTab === 'quizzes' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', fontWeight: activeTab === 'quizzes' ? '700' : '500' }}
                >
                  <ClipboardList size={16} /> Quizzes
                </button>
                <button 
                  onClick={() => { setActiveTab('assignments'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                  className={`btn ${activeTab === 'assignments' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', fontWeight: activeTab === 'assignments' ? '700' : '500' }}
                >
                  <FileText size={16} /> Assignments
                </button>
                {isLecturer && (
                  <button 
                    onClick={() => {
                      setActiveTab('diagnostic');
                      setSelectedAssignment(null);
                      setSelectedQuiz(null);
                      fetchDiagnosticTest(selectedCourse._id);
                      fetchDiagClassResults(selectedCourse._id);
                    }}
                    className={`btn ${activeTab === 'diagnostic' ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ justifyContent: 'flex-start', display: 'flex', alignItems: 'center', gap: '10px', width: '100%', textAlign: 'left', fontWeight: activeTab === 'diagnostic' ? '700' : '500' }}
                  >
                    <Award size={16} /> Diagnostic Test
                  </button>
                )}
              </div>
            </div>

            {/* COLUMN 2: MIDDLE WORKSPACE CARD */}
            <div className="card" style={{ padding: '30px', minHeight: '450px' }}>
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
                          <SkeletonList count={2} />
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
                          <SkeletonList count={3} showAvatar />
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
                      <SkeletonList count={4} />
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
                          <SkeletonList count={2} />
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
                          <SkeletonList count={3} showAvatar />
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
                      <SkeletonList count={4} />
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
                      <option value="adaptive">Adaptive (Recommended)</option>
                      <option value="all">All Levels</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
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

                {/* Level Badge for Students */}
                {isStudent && myLevel && (
                  <div style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: myLevel === 'Advanced' ? '#fce4ec' : myLevel === 'Intermediate' ? '#fff8e1' : '#e8f5e9', borderRadius: '20px' }}>
                    <strong>Current Level:</strong> {myLevel || 'Unknown'}
                    <button
                      onClick={() => { setDiagnosticCourseId(selectedCourse._id); setDiagnosticCourseName(selectedCourse.title); setShowDiagnostic(true); }}
                      style={{ background: 'none', border: 'none', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                    >Retake test</button>
                  </div>
                )}
                {isStudent && !myLevel && (
                  <div style={{ marginBottom: '20px', padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 'var(--radius)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Take the diagnostic test to unlock personalised materials.</span>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 14px', fontSize: '0.85rem' }}
                      onClick={() => { setDiagnosticCourseId(selectedCourse._id); setDiagnosticCourseName(selectedCourse.title); setShowDiagnostic(true); }}
                    >Take Test</button>
                  </div>
                )}

                {adaptiveStats && (
                  <div className="fade-in" style={{ padding: '16px', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 'var(--radius)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>Adaptive Learning Engine Active</h4>
                      {adaptiveStats.assessmentCount > 0 ? (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Based on your current course average of <strong style={{color: 'var(--primary)'}}>{adaptiveStats.averageScore}%</strong>, we have unlocked <strong>{adaptiveStats.recommendedLevel}</strong> materials for you.</p>
                      ) : (
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Take a quiz or complete an assignment to unlock personalized content! Starting you off with <strong>{adaptiveStats.recommendedLevel}</strong> materials.</p>
                      )}
                    </div>
                  </div>
                )}

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
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="All">All Levels (Everyone sees this)</option>
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
                  <SkeletonMaterialGrid count={4} />
                ) : materials.length === 0 ? (
                  <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No materials found. {isLecturer && 'Add some to get started!'}
                  </div>
                ) : (
                  <div className="grid-cards">
                    {materials.map(mat => (
                      <div key={mat._id} className="card" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            background: mat.difficultyLevel === 'Advanced' ? '#fce4ec' : mat.difficultyLevel === 'Intermediate' ? '#fff8e1' : mat.difficultyLevel === 'All' ? '#e3f2fd' : '#e8f5e9',
                            color: mat.difficultyLevel === 'Advanced' ? '#c62828' : mat.difficultyLevel === 'Intermediate' ? '#f57f17' : mat.difficultyLevel === 'All' ? '#1565c0' : '#2e7d32',
                          }}>
                            {mat.difficultyLevel === 'Beginner' ? 'Beginner' : mat.difficultyLevel === 'Intermediate' ? 'Intermediate' : mat.difficultyLevel === 'Advanced' ? 'Advanced' : 'All Levels'}
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

            {/* TAB CONTENT: DIAGNOSTIC (Lecturer only) */}
            {activeTab === 'diagnostic' && isLecturer && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Diagnostic Test Manager</h3>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      if (!showDiagCreateForm && !existingDiagTest) {
                        setDiagTitle('Course Diagnostic Test');
                        setDiagDesc('Complete this short test so we can personalise your learning materials.');
                        setDiagQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswerIndex: 0 }]);
                      }
                      setShowDiagCreateForm(!showDiagCreateForm);
                    }}
                  >
                    {showDiagCreateForm ? 'Cancel' : existingDiagTest ? '✏️ Edit Test' : '＋ Create Test'}
                  </button>
                </div>

                {/* Class Results Summary */}
                {diagClassLoading ? (
                  <p style={{ color: 'var(--text-secondary)' }}>Loading class results...</p>
                ) : diagClassResults && diagClassResults.summary ? (
                  <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem' }}>Class Level Breakdown</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                      {[
                        { label: 'Beginner', key: 'Beginner', color: '#2e7d32', bg: '#e8f5e9' },
                        { label: 'Intermediate', key: 'Intermediate', color: '#f57f17', bg: '#fff8e1' },
                        { label: 'Advanced', key: 'Advanced', color: '#c62828', bg: '#fce4ec' },
                      ].map(({ label, key, color, bg }) => (
                        <div key={key} style={{ background: bg, borderRadius: 'var(--radius)', padding: '16px', textAlign: 'center' }}>
                          <div style={{ fontSize: '1.8rem', fontWeight: '800', color }}>{diagClassResults.summary[key] || 0}</div>
                          <div style={{ fontSize: '0.85rem', color, fontWeight: '600' }}>{label}</div>
                        </div>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {diagClassResults.summary.total} of {selectedCourse.students.length} enrolled students have completed the diagnostic.
                    </p>

                    {/* Per-student results */}
                    {diagClassResults.data && diagClassResults.data.length > 0 && (
                      <div style={{ marginTop: '16px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                        <h5 style={{ margin: '0 0 12px 0', fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>Student Results</h5>
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                          {diagClassResults.data.map(r => (
                            <div key={r._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '0.9rem' }}>
                              <span style={{ fontWeight: '500' }}>{r.studentId?.name || 'Student'}</span>
                              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{r.score}%</span>
                                <span style={{
                                  padding: '2px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: '700',
                                  background: r.level === 'Advanced' ? '#fce4ec' : r.level === 'Intermediate' ? '#fff8e1' : '#e8f5e9',
                                  color: r.level === 'Advanced' ? '#c62828' : r.level === 'Intermediate' ? '#f57f17' : '#2e7d32'
                                }}>{r.level}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="card" style={{ padding: '20px', marginBottom: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    <p style={{ margin: 0 }}>No students have taken the diagnostic test yet.</p>
                  </div>
                )}

                {/* Current Test Preview (when not editing) */}
                {!showDiagCreateForm && existingDiagTest && (
                  <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Current Test: {existingDiagTest.title}</h4>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{existingDiagTest.questions.length} questions</span>
                    </div>
                    {existingDiagTest.questions.map((q, qi) => (
                      <div key={qi} style={{ marginBottom: '12px', padding: '12px', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius)' }}>
                        <p style={{ margin: '0 0 8px 0', fontWeight: '600', fontSize: '0.9rem' }}>Q{qi + 1}. {q.questionText}</p>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ fontSize: '0.85rem', color: oi === q.correctAnswerIndex ? '#2e7d32' : 'var(--text-secondary)', fontWeight: oi === q.correctAnswerIndex ? '700' : '400', marginLeft: '12px' }}>
                            {oi === q.correctAnswerIndex ? 'Correct' : ''} {opt}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {!showDiagCreateForm && !existingDiagTest && !diagTestLoading && (
                  <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    
                    <p>No diagnostic test created yet. Click <strong>"Create Test"</strong> above to add one.</p>
                    <p style={{ fontSize: '0.85rem' }}>Students will be prompted to take it automatically when they enroll.</p>
                  </div>
                )}

                {/* Create / Edit Form */}
                {showDiagCreateForm && (
                  <form onSubmit={(e) => handleCreateDiagTest(e, selectedCourse._id)} className="card" style={{ padding: '24px' }}>
                    <h4 style={{ fontSize: '1.1rem', marginBottom: '20px' }}>{existingDiagTest ? 'Edit' : 'Create'} Diagnostic Test</h4>

                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label>Test Title</label>
                      <input
                        type="text" className="form-input" required
                        value={diagTitle} onChange={e => setDiagTitle(e.target.value)}
                        placeholder="e.g. CSC 407 Placement Test"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label>Instructions (shown to students)</label>
                      <textarea
                        className="form-input" rows={2}
                        value={diagDesc} onChange={e => setDiagDesc(e.target.value)}
                        placeholder="e.g. Answer all questions. This helps us personalise your learning materials."
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem' }}>Questions ({diagQuestions.length})</h4>
                      <button type="button" className="btn btn-secondary" onClick={handleAddDiagQuestion} style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                        ＋ Add Question
                      </button>
                    </div>

                    {diagQuestions.map((q, qi) => (
                      <div key={qi} className="card" style={{ padding: '20px', marginBottom: '16px', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontWeight: '700', color: 'var(--primary)' }}>Question {qi + 1}</span>
                          {diagQuestions.length > 1 && (
                            <button type="button" onClick={() => handleRemoveDiagQuestion(qi)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>Remove</button>
                          )}
                        </div>

                        <div className="form-group" style={{ marginBottom: '14px' }}>
                          <label>Question Text</label>
                          <input
                            type="text" className="form-input" required
                            value={q.questionText} onChange={e => handleDiagQuestionChange(qi, e.target.value)}
                            placeholder="e.g. What does CPU stand for?"
                          />
                        </div>

                        <label style={{ fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Answer Options</label>
                        {q.options.map((opt, oi) => (
                          <div key={oi} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <input
                              type="radio" name={`correct-${qi}`}
                              checked={q.correctAnswerIndex === oi}
                              onChange={() => handleDiagCorrectChange(qi, oi)}
                              title="Mark as correct answer"
                              style={{ accentColor: 'var(--primary)', width: '18px', height: '18px', flexShrink: 0 }}
                            />
                            <input
                              type="text" className="form-input" required
                              value={opt} onChange={e => handleDiagOptionChange(qi, oi, e.target.value)}
                              placeholder={`Option ${oi + 1}`}
                              style={{ flex: 1 }}
                            />
                            {q.options.length > 2 && (
                              <button type="button" onClick={() => {
                                const updated = [...diagQuestions];
                                updated[qi].options.splice(oi, 1);
                                if (updated[qi].correctAnswerIndex >= updated[qi].options.length) updated[qi].correctAnswerIndex = 0;
                                setDiagQuestions([...updated]);
                              }} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
                            )}
                          </div>
                        ))}
                        <button type="button" onClick={() => {
                          const updated = [...diagQuestions];
                          updated[qi].options.push('');
                          setDiagQuestions([...updated]);
                        }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.85rem', marginTop: '4px' }}>
                          ＋ Add Option
                        </button>
                        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Click the radio button next to the correct answer.
                        </p>
                      </div>
                    ))}

                    <button type="submit" className="btn btn-primary" disabled={diagFormLoading} style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                      {diagFormLoading ? 'Saving...' : existingDiagTest ? 'Update Test' : 'Save & Publish Test'}
                    </button>
                  </form>
                )}
              </div>
            )}

            </div>

            {/* COLUMN 3: RIGHT SIDEBAR ADAPTIVE PANELS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* ADAPTIVE INSIGHT PANEL */}
              <div className="card" style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Award size={16} /> Adaptive Insight
                </h4>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Learning Level:</span>
                  <div style={{ 
                    background: myLevel === 'Advanced' ? 'rgba(22, 163, 74, 0.1)' : myLevel === 'Intermediate' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(37, 99, 235, 0.1)', 
                    color: myLevel === 'Advanced' ? '#16a34a' : myLevel === 'Intermediate' ? '#ea580c' : '#2563eb', 
                    border: myLevel === 'Advanced' ? '1px solid rgba(22, 163, 74, 0.2)' : myLevel === 'Intermediate' ? '1px solid rgba(249, 115, 22, 0.2)' : '1px solid rgba(37, 99, 235, 0.2)',
                    display: 'inline-block', 
                    padding: '4px 12px', 
                    borderRadius: '20px', 
                    fontWeight: '700', 
                    fontSize: '0.85rem',
                    marginTop: '6px',
                    textAlign: 'center',
                    textTransform: 'uppercase'
                  }}>
                    {myLevel || 'Assessing...'}
                  </div>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                  {myLevel === 'Beginner' && 'Focusing on foundations. Review beginner readings and starter quizzes to strengthen your coding basics.'}
                  {myLevel === 'Intermediate' && 'Expanding skills. Dive into intermediate assignments and explore topics deeper.'}
                  {myLevel === 'Advanced' && 'Excellent! Tackling advanced challenges. Try mock projects and quiz challenges.'}
                  {!myLevel && 'Complete the course Diagnostic Test to calibrate your study path recommendations.'}
                </p>
              </div>

              {/* Progress Metrics */}
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={16} /> Progress Metrics
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Quizzes Available</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{quizzes.length}</strong>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                      <span>Assignments Active</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{assignments.length}</strong>
                    </div>
                  </div>

                  {adaptiveStats && (
                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', marginTop: '4px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Adaptive Base Level</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--primary)', textTransform: 'uppercase' }}>{adaptiveStats.level}</div>
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TOAST NOTIFICATIONS */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default Dashboard;

