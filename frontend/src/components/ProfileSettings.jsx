import React, { useState, useEffect } from 'react';
import { ArrowLeft, User, Mail, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';

const ProfileSettings = ({ token, userRole, goBack }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // Fetch current user details from local storage for initial load
        const storedName = localStorage.getItem('name');
        const storedEmail = localStorage.getItem('email'); 
        
        if (storedName) setName(storedName);
        if (storedEmail) setEmail(storedEmail);
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name, email, password: password || undefined })
            });

            const data = await res.json();

            if (res.ok) {
                setSuccess('Profile updated successfully!');
                if (data.data.name) localStorage.setItem('name', data.data.name);
                if (data.data.email) localStorage.setItem('email', data.data.email);
                setPassword(''); 
            } else {
                setError(data.message || 'Failed to update profile');
            }
        } catch (err) {
            setError('Server error, please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', padding: '40px 20px' }}>
            <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto', padding: '40px' }}>
                <button 
                    onClick={goBack} 
                    className="btn btn-secondary" 
                    style={{ marginBottom: '24px' }}
                >
                    <ArrowLeft size={16} /> Back to Dashboard
                </button>

                <div style={{ marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <User size={28} style={{ color: 'var(--primary)' }} /> Profile Settings
                    </h2>
                    <p>Update your account details and security settings.</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        <AlertCircle size={18} /> {error}
                    </div>
                )}
                {success && (
                    <div className="alert alert-success">
                        <CheckCircle size={18} /> {success}
                    </div>
                )}

                <form onSubmit={handleUpdate}>
                    <div className="form-group">
                        <label><User size={14} style={{ display: 'inline', marginRight: '5px' }}/> Full Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label><Mail size={14} style={{ display: 'inline', marginRight: '5px' }}/> Email Address</label>
                        <input
                            type="email"
                            className="form-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '20px', borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '5px' }}>Security</h3>
                        <p style={{ fontSize: '0.875rem', marginBottom: '15px', color: 'var(--text-muted)' }}>Leave blank if you don't want to change your password.</p>
                        
                        <div className="form-group">
                            <label><Lock size={14} style={{ display: 'inline', marginRight: '5px' }}/> New Password</label>
                            <input
                                type="password"
                                className="form-input"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '30px' }}>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            <Save size={16} />
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;
