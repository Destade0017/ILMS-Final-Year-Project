import { useState, useEffect } from 'react';
import { AlertCircle, ArrowRight, Loader, Trophy, FileText } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const levelColors = {
  Beginner: { bg: '#e8f5e9', color: '#2e7d32', label: 'Beginner' },
  Intermediate: { bg: '#fff8e1', color: '#f57f17', label: 'Intermediate' },
  Advanced: { bg: '#fce4ec', color: '#c62828', label: 'Advanced' },
};

const DiagnosticTest = ({ token, courseId, onComplete, onSkip }) => {
  const [test, setTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // after submission

  const fetchTest = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/api/diagnostic/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        // No test created yet — allow skipping gracefully
        setError(data.message || 'No diagnostic test found for this course.');
        return;
      }
      setTest(data.data);
    } catch {
      setError('Failed to load the diagnostic test.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTest();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const handleSelect = (questionIndex, optionIndex) => {
    setAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate all questions answered
    if (!test || Object.keys(answers).length < test.questions.length) {
      setError('Please answer all questions before submitting.');
      return;
    }

    const answersArray = test.questions.map((_, i) => answers[i]);
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/api/diagnostic/course/${courseId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: answersArray }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Submission failed');
      setResult(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ─── LOADING STATE ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <Loader size={32} style={{ animation: 'spin 1s linear infinite', color: 'var(--primary)' }} />
        <p style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>Loading diagnostic test...</p>
      </div>
    );
  }

  // ─── RESULT STATE (after submitting) ─────────────────────────────────────────
  if (result) {
    const levelStyle = levelColors[result.level] || levelColors.Beginner;
    return (
      <div className="fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px', color: 'var(--success)', display: 'flex', justifyContent: 'center' }}>
          <Trophy size={64} />
        </div>
        <h2 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>Diagnostic Complete!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          You scored <strong>{result.score}%</strong> ({result.correct}/{result.total} correct)
        </p>

        <div style={{
          background: levelStyle.bg,
          border: `2px solid ${levelStyle.color}`,
          borderRadius: 'var(--radius)',
          padding: '24px',
          marginBottom: '30px',
        }}>
          <p style={{ margin: '0 0 8px 0', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your Learning Level</p>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: levelStyle.color }}>{levelStyle.label}</div>
          <p style={{ margin: '12px 0 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {result.level === 'Beginner' && 'We\'ve unlocked foundational materials to build your knowledge step by step.'}
            {result.level === 'Intermediate' && 'You have a solid foundation. We\'ve unlocked standard-level materials to help you grow.'}
            {result.level === 'Advanced' && 'Excellent! You\'ve unlocked advanced materials and challenging content.'}
          </p>
        </div>

        <button className="btn btn-primary" style={{ gap: '8px' }} onClick={() => onComplete(result.level)}>
          Continue to Course <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // ─── NO TEST AVAILABLE ────────────────────────────────────────────────────────
  if (error || !test) {
    return (
      <div className="fade-in" style={{ maxWidth: '500px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '16px', color: 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>
          <FileText size={48} />
        </div>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Diagnostic Test Yet</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>
          {error || 'The lecturer has not created a diagnostic test for this course.'}
          <br />You can still access the course and will be started as a Beginner.
        </p>
        <button className="btn btn-primary" onClick={onSkip}>
          Continue to Course <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  // ─── TEST TAKING STATE ────────────────────────────────────────────────────────
  const allAnswered = test.questions.length > 0 && Object.keys(answers).length === test.questions.length;

  return (
    <div className="fade-in" style={{ maxWidth: '700px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{test.title}</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '500px', margin: '0 auto' }}>
          {test.description}
        </p>
        <div style={{ marginTop: '12px', display: 'inline-block', background: 'var(--primary-light)', color: 'var(--primary)', padding: '6px 14px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600' }}>
          {test.questions.length} Questions · Answers are auto-graded
        </div>
      </div>

      {error && (
        <div className="alert alert-error fade-in" style={{ marginBottom: '20px' }}>
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {test.questions.map((q, qi) => (
          <div key={q._id || qi} className="card" style={{ padding: '24px', marginBottom: '16px' }}>
            <p style={{ fontWeight: '600', marginBottom: '16px', fontSize: '1rem' }}>
              <span style={{ color: 'var(--primary)', marginRight: '8px' }}>Q{qi + 1}.</span>
              {q.questionText}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                return (
                  <label
                    key={oi}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius)',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-light)' : 'var(--surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontWeight: isSelected ? '600' : '400',
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${qi}`}
                      value={oi}
                      checked={isSelected}
                      onChange={() => handleSelect(qi, oi)}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isSelected && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fff' }} />}
                    </div>
                    {opt}
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* Progress indicator */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            {Object.keys(answers).length} of {test.questions.length} answered
          </span>
          <div style={{ height: '6px', flex: 1, margin: '0 16px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(Object.keys(answers).length / test.questions.length) * 100}%`, background: 'var(--primary)', transition: 'width 0.3s ease' }} />
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!allAnswered || submitting}
          style={{ width: '100%', padding: '14px', fontSize: '1rem', opacity: allAnswered ? 1 : 0.6 }}
        >
          {submitting ? 'Submitting...' : 'Submit & Get My Level'}
        </button>
      </form>
    </div>
  );
};

export default DiagnosticTest;
