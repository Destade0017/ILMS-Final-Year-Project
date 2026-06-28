/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Individual Toast notification.
 * Props:
 *   id        – unique id
 *   type      – 'success' | 'error' | 'warning' | 'info'
 *   message   – text to display
 *   onRemove  – callback(id) to dismiss
 *   duration  – ms before auto-dismiss (default 4500)
 */
const ICONS = {
  success: <CheckCircle size={18} />,
  error:   <XCircle    size={18} />,
  warning: <AlertTriangle size={18} />,
  info:    <Info       size={18} />,
};

const COLORS = {
  success: { bg: '#f0fdf4', border: '#86efac', color: '#166534', progress: '#16a34a' },
  error:   { bg: '#fef2f2', border: '#fca5a5', color: '#991b1b', progress: '#dc2626' },
  warning: { bg: '#fff7ed', border: '#fdba74', color: '#9a3412', progress: '#ea580c' },
  info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1e40af', progress: '#2563eb' },
};

const Toast = ({ id, type = 'info', message, onRemove, duration = 4500 }) => {
  const timerRef = useRef(null);
  const c = COLORS[type] || COLORS.info;

  useEffect(() => {
    timerRef.current = setTimeout(() => onRemove(id), duration);
    return () => clearTimeout(timerRef.current);
  }, [id, duration, onRemove]);

  return (
    <div
      className="toast-item"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
      }}
      role="alert"
    >
      {/* Progress bar */}
      <div
        className="toast-progress"
        style={{
          background: c.progress,
          animationDuration: `${duration}ms`,
        }}
      />

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '14px 16px' }}>
        <span style={{ flexShrink: 0, marginTop: '1px' }}>{ICONS[type]}</span>
        <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.5 }}>
          {message}
        </span>
        <button
          onClick={() => onRemove(id)}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: c.color, opacity: 0.6, padding: 0, flexShrink: 0,
            display: 'flex', alignItems: 'center',
          }}
          aria-label="Dismiss"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast container — renders a stack of toasts in the bottom-right corner.
 * Props:
 *   toasts    – array of { id, type, message }
 *   onRemove  – callback(id)
 */
export const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
};

/**
 * useToast — hook that manages the toasts array and exposes helper methods.
 *
 * Usage:
 *   const { toasts, removeToast, toast } = useToast();
 *   toast.success('Enrolled!');
 *   toast.error('Something went wrong');
 *   toast.warning('Check your inputs');
 *   toast.info('3 students enrolled today');
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, duration) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setToasts(prev => [...prev, { id, type, message, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useMemo(() => ({
    success: (msg, dur) => addToast('success', msg, dur),
    error:   (msg, dur) => addToast('error',   msg, dur),
    warning: (msg, dur) => addToast('warning', msg, dur),
    info:    (msg, dur) => addToast('info',    msg, dur),
  }), [addToast]);

  return { toasts, removeToast, toast };
};

export default Toast;
