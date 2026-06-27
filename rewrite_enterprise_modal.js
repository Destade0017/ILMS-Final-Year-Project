const fs = require('fs');
const path = require('path');

const oldDashboard = fs.readFileSync(path.join(__dirname, 'old_dashboard.jsx'), 'utf8');
const modalStartIndex = oldDashboard.indexOf("{/* TAB CONTENT 4: QUIZZES */}");
const modalEndIndex = oldDashboard.indexOf("{/* END MODAL OVERLAY */}");

let quizLogic = "";
if (modalStartIndex !== -1 && modalEndIndex !== -1) {
    quizLogic = oldDashboard.substring(modalStartIndex, modalEndIndex);
    quizLogic = quizLogic.replace(/style={{ borderBottom: '1px solid var\(--border-color\)', paddingBottom: '20px', marginBottom: '20px' }}/g, 'className="enterprise-card" style={{ padding: "24px", marginBottom: "20px" }}');
    quizLogic = quizLogic.replace(/style={{ border: '1px solid var\(--border-color\)', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}/g, 'className="enterprise-card" style={{ padding: "20px", marginBottom: "15px" }}');
}

const newModalContent = `import React, { useState, useEffect } from 'react';
import { 
    FileText, ClipboardList, BookOpen, X, Users, Mail, Info, Calendar, 
    Video, File, PlusCircle, CheckCircle, Bell, ChevronDown, ChevronUp, 
    PlayCircle, CheckCircle2, Circle, Clock, TrendingUp, Award, Bookmark, Share2, 
    Download, ExternalLink
} from 'lucide-react';

const CourseDetailsModal = (props) => {
    const {
        user, token, isLecturer, isStudent,
        selectedCourse, setSelectedCourse,
        activeTab, setActiveTab,
        selectedAssignment, setSelectedAssignment,
        assignments, assignmentsLoading,
        showCreateAssignForm, setShowCreateAssignForm,
        assignTitle, setAssignTitle, assignDesc, setAssignDesc,
        assignDueDate, setAssignDueDate, assignMaxPoints, setAssignMaxPoints,
        handleCreateAssignment, assignFormLoading, handleSelectAssignment,
        submissionLoading, studentSubmission, submissionContent, setSubmissionContent,
        handleSubmitAssignment, submitFormLoading, submissionsLoading, submissions,
        gradingSubmissionId, setGradingSubmissionId, gradeScore, setGradeScore,
        gradeFeedback, setGradeFeedback, handleGradeSubmission, gradeFormLoading,
        selectedQuiz, setSelectedQuiz, quizzesLoading, quizzes,
        showCreateQuizForm, setShowCreateQuizForm, quizTitle, setQuizTitle,
        quizDesc, setQuizDesc, quizTimeLimit, setQuizTimeLimit, quizQuestions,
        handleAddQuestion, handleRemoveQuestion, handleQuestionTextChange,
        handleOptionChange, handleAddOption, handleRemoveOption, handleCorrectAnswerIndexChange,
        quizFormLoading, handleCreateQuiz, handleSelectQuiz, myQuizAttemptLoading,
        myQuizAttempt, quizSubmitting, quizAnswers, setQuizAnswers, handleSubmitQuiz,
        quizAttemptsLoading, quizAttempts, matFilter, setMatFilter, fetchCourseMaterials,
        materialsLoading, materials, showCreateMaterialForm, setShowCreateMaterialForm,
        matTitle, setMatTitle, matDesc, setMatDesc, matContentType, setMatContentType,
        matFileUrl, setMatFileUrl, matBodyText, setMatBodyText, matDifficulty, setMatDifficulty,
        materialFormLoading, handleCreateMaterial, handleDeleteMaterial, formatDate
    } = props;

    const [expandedModule, setExpandedModule] = useState(null);
    const [isLoadingMock, setIsLoadingMock] = useState(true);

    // Simulate initial loading state for skeleton effect
    useEffect(() => {
        const timer = setTimeout(() => setIsLoadingMock(false), 800);
        return () => clearTimeout(timer);
    }, []);

    // Derived Mock Data for MVP Enterprise feel
    const heroImage = \`url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2000&auto=format&fit=crop')\`;
    const progressPercent = isStudent ? 45 : 100;
    
    const mockAnnouncements = [
        { id: 1, title: 'Welcome to the Course!', author: selectedCourse.lecturer?.name || 'Instructor', date: new Date(Date.now() - 86400000 * 2), content: 'I am thrilled to welcome you all to this semester. Please review the syllabus in the Modules tab.', priority: 'high' },
        { id: 2, title: 'Assignment 1 Deadline Extended', author: selectedCourse.lecturer?.name || 'Instructor', date: new Date(Date.now() - 86400000 * 5), content: 'Due to technical difficulties with the campus network, I have extended the first assignment deadline by 48 hours.', priority: 'normal' }
    ];

    const getMaterialIcon = (type) => {
        switch(type) {
            case 'video': return <PlayCircle size={20} className="text-enterprise-blue" style={{color: 'var(--enterprise-blue)'}} />;
            case 'pdf': return <File size={20} className="text-error" style={{color: '#dc2626'}} />;
            case 'link': return <ExternalLink size={20} style={{color: '#64748b'}} />;
            default: return <FileText size={20} style={{color: '#64748b'}} />;
        }
    };

    const CircularProgress = ({ percentage }) => {
        const radius = 36;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;
        return (
            <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg className="progress-ring" width="90" height="90">
                    <circle className="progress-ring-circle-bg" cx="45" cy="45" r={radius} />
                    <circle className="progress-ring-circle" cx="45" cy="45" r={radius} style={{ strokeDasharray: circumference, strokeDashoffset: offset }} />
                </svg>
                <div style={{ position: 'absolute', fontSize: '1.25rem', fontWeight: '700', color: 'var(--enterprise-gray-900)' }}>{percentage}%</div>
            </div>
        );
    };

    return (
        <div className="modal-overlay lms-modal-backdrop enterprise-font" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content lms-modal-window fade-in" style={{ position: 'relative' }}>
            
            {/* CLOSE BUTTON */}
            <button 
              onClick={() => setSelectedCourse(null)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', zIndex: 100, transition: 'background 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.8)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
            >
              <X size={20} />
            </button>

            {/* SCROLLABLE CONTENT */}
            <div className="lms-scrollable">
              
              {/* 1. HERO SECTION */}
              <div className="enterprise-hero" style={{ backgroundImage: heroImage }}>
                <div className="enterprise-hero-content">
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                    <span className="enterprise-badge enterprise-badge-outline" style={{ background: 'var(--enterprise-blue)' }}>{selectedCourse.code}</span>
                    <span className="enterprise-badge enterprise-badge-outline">Active</span>
                    <span className="enterprise-badge enterprise-badge-outline">Computer Science</span>
                  </div>
                  
                  {isLoadingMock ? (
                      <div className="skeleton" style={{ height: '48px', width: '60%', marginBottom: '12px' }}></div>
                  ) : (
                      <h1 className="enterprise-hero-title">{selectedCourse.title}</h1>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px', fontSize: '0.95rem', fontWeight: '500', opacity: 0.9 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Users size={18} /> {selectedCourse.students?.length || 0} Enrolled</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> By {selectedCourse.lecturer?.name || 'Staff'}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={18} /> Last Updated: {formatDate(selectedCourse.updatedAt || new Date())}</span>
                  </div>
                  
                  <div style={{ marginTop: '30px', display: 'flex', gap: '12px' }}>
                     {isStudent && (
                         <button className="btn" style={{ background: 'white', color: 'var(--enterprise-gray-900)', fontWeight: '600', padding: '10px 24px', fontSize: '1rem' }}>
                           Continue Learning
                         </button>
                     )}
                     <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 16px' }}>
                       <Bookmark size={18} /> Save
                     </button>
                     <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 16px' }}>
                       <Share2 size={18} /> Share
                     </button>
                  </div>
                </div>
              </div>

              {/* 2. NAVIGATION TABS */}
              <div className="enterprise-tabs">
                <button onClick={() => { setActiveTab('details'); setSelectedAssignment(null); setSelectedQuiz(null); }} className={\`enterprise-tab \${activeTab === 'details' ? 'active' : ''}\`}>
                  Overview
                </button>
                <button onClick={() => { setActiveTab('materials'); setSelectedAssignment(null); setSelectedQuiz(null); }} className={\`enterprise-tab \${activeTab === 'materials' ? 'active' : ''}\`}>
                  Modules
                </button>
                <button onClick={() => { setActiveTab('assignments'); setSelectedAssignment(null); setSelectedQuiz(null); }} className={\`enterprise-tab \${activeTab === 'assignments' ? 'active' : ''}\`}>
                  Assignments
                </button>
                <button onClick={() => { setActiveTab('quizzes'); setSelectedAssignment(null); setSelectedQuiz(null); }} className={\`enterprise-tab \${activeTab === 'quizzes' ? 'active' : ''}\`}>
                  Quizzes
                </button>
                <button onClick={() => { setActiveTab('announcements'); setSelectedAssignment(null); setSelectedQuiz(null); }} className={\`enterprise-tab \${activeTab === 'announcements' ? 'active' : ''}\`}>
                  Announcements
                </button>
              </div>

              {/* 3. MAIN CONTENT AREA */}
              <div className="enterprise-content">
                  
                {/* TAB: OVERVIEW */}
                {activeTab === 'details' && (
                  <div className="enterprise-grid-main fade-in">
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      <div className="enterprise-card">
                        <div className="enterprise-card-header">
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--enterprise-gray-900)' }}>About this Course</h3>
                        </div>
                        <div className="enterprise-card-body">
                          {isLoadingMock ? (
                             <div>
                               <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '10px' }}></div>
                               <div className="skeleton" style={{ height: '16px', width: '100%', marginBottom: '10px' }}></div>
                               <div className="skeleton" style={{ height: '16px', width: '80%' }}></div>
                             </div>
                          ) : (
                             <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--enterprise-gray-700)', margin: 0 }}>
                               {selectedCourse.description}
                             </p>
                          )}
                          
                          <div style={{ marginTop: '30px' }}>
                            <h4 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--enterprise-gray-900)' }}>Learning Objectives</h4>
                            <ul style={{ paddingLeft: '20px', color: 'var(--enterprise-gray-700)', lineHeight: '1.7' }}>
                                <li>Master the core concepts of the subject matter.</li>
                                <li>Apply theoretical knowledge to practical, real-world projects.</li>
                                <li>Develop critical thinking and analytical problem-solving skills.</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {isStudent && (
                        <div className="enterprise-card">
                          <div className="enterprise-card-header flex-between">
                              <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--enterprise-gray-900)' }}>Your Analytics</h3>
                              <span className="enterprise-badge" style={{ background: 'var(--enterprise-blue-light)', color: 'var(--enterprise-blue)' }}>This Week</span>
                          </div>
                          <div className="enterprise-card-body" style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                            <CircularProgress percentage={progressPercent} />
                            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--enterprise-gray-500)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Lessons Completed</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--enterprise-gray-900)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        12 / 24 <CheckCircle2 size={20} color="var(--success)" />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--enterprise-gray-500)', fontWeight: '600', textTransform: 'uppercase', marginBottom: '4px' }}>Time Spent</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--enterprise-gray-900)' }}>14h 30m</div>
                                </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                      <div className="enterprise-card">
                        <div className="enterprise-card-body" style={{ textAlign: 'center', padding: '40px 24px' }}>
                           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--enterprise-blue-light)', color: 'var(--enterprise-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '2rem', margin: '0 auto 20px' }}>
                             {selectedCourse.lecturer?.name?.charAt(0) || 'I'}
                           </div>
                           <h3 style={{ fontSize: '1.25rem', marginBottom: '4px', color: 'var(--enterprise-gray-900)' }}>{selectedCourse.lecturer?.name}</h3>
                           <div style={{ fontSize: '0.9rem', color: 'var(--enterprise-blue)', fontWeight: '500', marginBottom: '16px' }}>Lead Instructor</div>
                           <p style={{ fontSize: '0.9rem', color: 'var(--enterprise-gray-500)', marginBottom: '24px', lineHeight: '1.6' }}>
                             Passionate educator and researcher dedicated to student success and academic excellence.
                           </p>
                           <button className="btn" style={{ width: '100%', background: 'white', border: '1px solid var(--border-color)', color: 'var(--enterprise-gray-900)', fontWeight: '500' }}>
                             <Mail size={16} /> Contact Instructor
                           </button>
                        </div>
                      </div>

                      <div className="enterprise-card">
                        <div className="enterprise-card-header">
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--enterprise-gray-900)' }}>Class Roster ({selectedCourse.students.length})</h3>
                        </div>
                        <div className="enterprise-card-body" style={{ padding: 0 }}>
                          {selectedCourse.students.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--enterprise-gray-500)' }}>No students enrolled.</div>
                          ) : (
                            <ul style={{ listStyle: 'none', maxHeight: '300px', overflowY: 'auto', margin: 0, padding: '0' }}>
                              {selectedCourse.students.map((student) => (
                                <li key={student._id} className="lesson-row" style={{ padding: '12px 24px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--enterprise-gray-100)', color: 'var(--enterprise-gray-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: '600' }}>
                                      {student.name.charAt(0)}
                                    </div>
                                    <div>
                                      <div style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--enterprise-gray-900)' }}>{student.name}</div>
                                      <div style={{ fontSize: '0.8rem', color: 'var(--enterprise-gray-500)' }}>Student</div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: MODULES (ACCORDION STYLE) */}
                {activeTab === 'materials' && (
                  <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <div className="flex-between" style={{ marginBottom: '30px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>Course Syllabus</h2>
                        <p style={{ color: 'var(--enterprise-gray-500)', margin: 0 }}>Review the learning materials structured by modules.</p>
                      </div>
                      
                      {isLecturer && (
                        <button onClick={() => setShowCreateMaterialForm(!showCreateMaterialForm)} className="btn btn-primary" style={{ background: 'var(--enterprise-blue)' }}>
                          <PlusCircle size={16} /> Add Material
                        </button>
                      )}
                    </div>

                    {isLecturer && showCreateMaterialForm && (
                       <form onSubmit={(e) => handleCreateMaterial(e, selectedCourse._id)} className="enterprise-card" style={{ padding: '30px', marginBottom: '30px', borderTop: '4px solid var(--enterprise-blue)' }}>
                         <h3 style={{ marginBottom: '20px', marginTop: 0 }}>Upload New Material</h3>
                         {/* Form fields remain exactly the same functionally, updated with enterprise classes where needed */}
                         <div className="form-group">
                           <label>Title</label>
                           <input type="text" className="form-input" value={matTitle} onChange={(e)=>setMatTitle(e.target.value)} required />
                         </div>
                         <div className="form-group">
                           <label>Description</label>
                           <textarea className="form-input" value={matDesc} onChange={(e)=>setMatDesc(e.target.value)} required style={{ minHeight: '60px' }}></textarea>
                         </div>
                         <div className="form-row">
                           <div className="form-group">
                             <label>Type</label>
                             <select className="form-select" value={matContentType} onChange={(e)=>setMatContentType(e.target.value)}>
                               <option value="text">Text / Article</option>
                               <option value="pdf">PDF Document</option>
                               <option value="video">Video Link</option>
                             </select>
                           </div>
                           <div className="form-group">
                             <label>Difficulty level (Adaptive)</label>
                             <select className="form-select" value={matDifficulty} onChange={(e)=>setMatDifficulty(e.target.value)}>
                               <option value="easy">Easy</option>
                               <option value="medium">Medium</option>
                               <option value="hard">Hard</option>
                             </select>
                           </div>
                         </div>
                         {(matContentType === 'pdf' || matContentType === 'video') && (
                           <div className="form-group">
                             <label>File URL / Video Link</label>
                             <input type="url" className="form-input" value={matFileUrl} onChange={(e)=>setMatFileUrl(e.target.value)} required placeholder="https://..." />
                           </div>
                         )}
                         {matContentType === 'text' && (
                           <div className="form-group">
                             <label>Article Content</label>
                             <textarea className="form-input" value={matBodyText} onChange={(e)=>setMatBodyText(e.target.value)} required></textarea>
                           </div>
                         )}
                         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                           <button type="button" className="btn btn-secondary" onClick={() => setShowCreateMaterialForm(false)}>Cancel</button>
                           <button type="submit" className="btn btn-primary" style={{background: 'var(--enterprise-blue)'}} disabled={materialFormLoading}>
                             {materialFormLoading ? 'Uploading...' : 'Publish Material'}
                           </button>
                         </div>
                       </form>
                    )}

                    {materialsLoading ? (
                      <div style={{ padding: '20px 0' }}>
                         <div className="skeleton" style={{ height: '70px', width: '100%', marginBottom: '16px', borderRadius: '8px' }}></div>
                         <div className="skeleton" style={{ height: '70px', width: '100%', marginBottom: '16px', borderRadius: '8px' }}></div>
                      </div>
                    ) : materials.length === 0 ? (
                      <div className="enterprise-card" style={{ padding: '60px 20px', textAlign: 'center', background: 'white' }}>
                        <BookOpen size={48} style={{ color: 'var(--enterprise-gray-200)', margin: '0 auto 20px' }} />
                        <h3 style={{ color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>No modules available yet</h3>
                        <p style={{ fontSize: '1rem', color: 'var(--enterprise-gray-500)', margin: 0 }}>The instructor is still preparing the syllabus.</p>
                      </div>
                    ) : (
                      <div className="accordion">
                        {/* We group materials by difficulty as a mock module structure */}
                        {['easy', 'medium', 'hard'].map((difficulty) => {
                           const moduleMaterials = materials.filter(m => m.difficultyLevel === difficulty);
                           if (moduleMaterials.length === 0) return null;
                           
                           const isExpanded = expandedModule === difficulty;
                           
                           return (
                             <div key={difficulty} className="accordion-item">
                               <div className="accordion-header" onClick={() => setExpandedModule(isExpanded ? null : difficulty)}>
                                 <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'var(--enterprise-blue-light)', color: 'var(--enterprise-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                      <BookOpen size={20} />
                                    </div>
                                    <div>
                                      <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--enterprise-gray-900)' }}>Module: {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Concepts</h3>
                                      <div style={{ fontSize: '0.85rem', color: 'var(--enterprise-gray-500)', marginTop: '4px' }}>{moduleMaterials.length} Items</div>
                                    </div>
                                 </div>
                                 {isExpanded ? <ChevronUp color="var(--enterprise-gray-500)" /> : <ChevronDown color="var(--enterprise-gray-500)" />}
                               </div>
                               
                               {isExpanded && (
                                 <div className="accordion-body fade-in">
                                    {moduleMaterials.map(mat => (
                                       <div key={mat._id} className="lesson-row">
                                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                                             {getMaterialIcon(mat.contentType)}
                                             <div>
                                                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--enterprise-gray-900)', fontWeight: '500' }}>{mat.title}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--enterprise-gray-500)' }}>{mat.description}</p>
                                                
                                                {/* Content Display */}
                                                <div style={{ marginTop: '12px' }}>
                                                    {mat.contentType === 'text' && (
                                                      <div style={{ padding: '16px', background: 'white', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                                        {mat.bodyText}
                                                      </div>
                                                    )}
                                                    {mat.contentType === 'pdf' && (
                                                      <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem', padding: '6px 12px' }}>
                                                        <Download size={14} /> Download PDF
                                                      </a>
                                                    )}
                                                    {mat.contentType === 'video' && (
                                                      <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="btn" style={{ background: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem', padding: '6px 12px' }}>
                                                        <ExternalLink size={14} /> Watch Externally
                                                      </a>
                                                    )}
                                                </div>
                                             </div>
                                          </div>
                                          
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                              {isStudent && <Circle size={24} color="var(--enterprise-gray-200)" style={{ cursor: 'pointer' }} />}
                                              {isLecturer && (
                                                <button onClick={() => handleDeleteMaterial(mat._id, selectedCourse._id)} className="btn" style={{ color: '#dc2626', background: '#fee2e2', padding: '6px 12px', fontSize: '0.8rem' }}>Delete</button>
                                              )}
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                               )}
                             </div>
                           )
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: ASSIGNMENTS (Updated to Enterprise UI) */}
                {activeTab === 'assignments' && (
                  <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Detail view logic ... preserving original state handling but upgrading UI */}
                    {selectedAssignment ? (
                      <div className="fade-in">
                        <button onClick={() => setSelectedAssignment(null)} className="btn" style={{ background: 'white', border: '1px solid var(--border-color)', marginBottom: '24px' }}>
                          ← Back to Assignments
                        </button>

                        <div className="enterprise-card" style={{ marginBottom: '30px' }}>
                          <div className="enterprise-card-header flex-between" style={{ background: 'var(--enterprise-gray-50)' }}>
                            <h2 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--enterprise-gray-900)' }}>{selectedAssignment.title}</h2>
                            <span className="enterprise-badge" style={{ background: 'var(--enterprise-blue-light)', color: 'var(--enterprise-blue)' }}>{selectedAssignment.maxPoints} Points Max</span>
                          </div>
                          <div className="enterprise-card-body">
                            <div style={{ display: 'flex', gap: '24px', fontSize: '0.9rem', color: 'var(--enterprise-gray-700)', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid var(--enterprise-gray-100)' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={18} /> <strong>Due Date:</strong> {formatDate(selectedAssignment.dueDate)}</span>
                            </div>
                            <h4 style={{ fontSize: '1rem', marginBottom: '12px', color: 'var(--enterprise-gray-900)' }}>Instructions</h4>
                            <p style={{ fontSize: '1rem', lineHeight: '1.7', margin: 0, color: 'var(--enterprise-gray-700)' }}>{selectedAssignment.description}</p>
                          </div>
                        </div>

                        {/* STUDENT SUBMISSION */}
                        {isStudent && (
                          <div className="enterprise-card" style={{ borderTop: '4px solid var(--enterprise-blue)' }}>
                            <div className="enterprise-card-header">
                               <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Your Work</h3>
                            </div>
                            <div className="enterprise-card-body">
                              {submissionLoading ? (
                                <div className="skeleton" style={{ height: '150px', width: '100%' }}></div>
                              ) : studentSubmission ? (
                                <div>
                                   <div className="flex-between" style={{ marginBottom: '20px', padding: '16px', background: 'var(--enterprise-gray-50)', borderRadius: '8px' }}>
                                     <span className="enterprise-badge" style={{ background: 'var(--success-bg)', color: 'var(--success-text)', display: 'flex', gap: '6px' }}><CheckCircle2 size={14}/> Submitted</span>
                                     <span style={{ fontSize: '0.85rem', color: 'var(--enterprise-gray-500)' }}>on {formatDate(studentSubmission.submittedAt)}</span>
                                   </div>
                                   <div style={{ padding: '20px', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'white', marginBottom: '24px', whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
                                       {studentSubmission.content}
                                   </div>
                                   
                                   {studentSubmission.status === 'graded' && (
                                     <div style={{ padding: '24px', background: 'var(--enterprise-blue-light)', borderRadius: '8px', border: '1px solid rgba(37,99,235,0.2)' }}>
                                       <h4 style={{ fontSize: '1rem', marginBottom: '16px', marginTop: 0, color: 'var(--enterprise-gray-900)' }}>Instructor Feedback</h4>
                                       <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
                                           <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--enterprise-blue)', lineHeight: 1 }}>
                                             {studentSubmission.gradeScore} <span style={{ fontSize: '1rem', color: 'var(--enterprise-gray-500)' }}>/ {selectedAssignment.maxPoints}</span>
                                           </div>
                                           <Award size={40} color="var(--enterprise-blue)" opacity={0.2} />
                                       </div>
                                       <p style={{ margin: 0, color: 'var(--enterprise-gray-700)', fontSize: '0.95rem' }}>{studentSubmission.gradeFeedback || 'Great work!'}</p>
                                     </div>
                                   )}
                                </div>
                              ) : (
                                <form onSubmit={(e) => handleSubmitAssignment(e, selectedAssignment._id)}>
                                  <div className="form-group">
                                    <textarea className="form-input" style={{ minHeight: '200px', fontSize: '1rem', padding: '16px' }} value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)} required placeholder="Write your response or paste a link to your document here..."></textarea>
                                  </div>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                      <button type="submit" className="btn btn-primary" style={{ background: 'var(--enterprise-blue)', padding: '12px 24px' }} disabled={submitFormLoading}>
                                        {submitFormLoading ? 'Submitting...' : 'Submit Assignment'}
                                      </button>
                                  </div>
                                </form>
                              )}
                            </div>
                          </div>
                        )}

                        {/* LECTURER GRADING AREA... keeping functionality intact, just updating classes */}
                        {isLecturer && (
                            <div className="enterprise-card" style={{ marginTop: '30px' }}>
                               <div className="enterprise-card-header"><h3 style={{ margin: 0 }}>Student Submissions</h3></div>
                               <div className="enterprise-card-body">
                                 {/* Rest of lecturer grading logic remains identical to previous fix but wrapped in enterprise-card-body */}
                                 {submissionsLoading ? <p>Loading submissions...</p> : submissions.length === 0 ? <p style={{ color: 'var(--enterprise-gray-500)', textAlign: 'center' }}>No submissions yet.</p> : (
                                     <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                         {submissions.map(sub => (
                                             <div key={sub._id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '20px' }}>
                                                <div className="flex-between" style={{ marginBottom: '16px' }}>
                                                    <div>
                                                    <h4 style={{ margin: '0 0 4px 0' }}>{sub.student.name}</h4>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {formatDate(sub.submittedAt)}</div>
                                                    </div>
                                                    <span className={\`enterprise-badge \${sub.status === 'graded' ? 'enterprise-badge-outline' : ''}\`} style={{ background: sub.status === 'graded' ? 'var(--success-bg)' : '#fef3c7', color: sub.status === 'graded' ? 'var(--success-text)' : '#d97706' }}>
                                                    {sub.status === 'graded' ? \`Graded: \${sub.gradeScore}/\${selectedAssignment.maxPoints}\` : 'Needs Grading'}
                                                    </span>
                                                </div>
                                                <div style={{ padding: '16px', background: 'var(--enterprise-gray-50)', borderRadius: '6px', marginBottom: '16px', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>{sub.content}</div>
                                                
                                                {gradingSubmissionId === sub._id ? (
                                                    <form onSubmit={(e) => handleGradeSubmission(e, sub._id)} style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                                                        <div className="form-row">
                                                        <div className="form-group" style={{ flex: '0 0 100px' }}>
                                                            <label>Score</label>
                                                            <input type="number" className="form-input" min="0" max={selectedAssignment.maxPoints} value={gradeScore} onChange={(e) => setGradeScore(e.target.value)} required />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Feedback (Optional)</label>
                                                            <input type="text" className="form-input" value={gradeFeedback} onChange={(e) => setGradeFeedback(e.target.value)} placeholder="Great job..." />
                                                        </div>
                                                        </div>
                                                        <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button type="submit" className="btn btn-primary" style={{background: 'var(--enterprise-blue)'}} disabled={gradeFormLoading}>Save Grade</button>
                                                        <button type="button" className="btn btn-secondary" onClick={() => setGradingSubmissionId(null)}>Cancel</button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <button className="btn btn-secondary" onClick={() => { setGradingSubmissionId(sub._id); setGradeScore(sub.gradeScore || ''); setGradeFeedback(sub.gradeFeedback || ''); }}>
                                                    {sub.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                                                    </button>
                                                )}
                                             </div>
                                         ))}
                                     </div>
                                 )}
                               </div>
                            </div>
                        )}
                      </div>
                    ) : (
                      // LIST VIEW OF ALL ASSIGNMENTS
                      <div>
                        <div className="flex-between" style={{ marginBottom: '30px' }}>
                          <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>Assignments</h2>
                            <p style={{ color: 'var(--enterprise-gray-500)', margin: 0 }}>Complete assignments to earn your grade.</p>
                          </div>
                          {isLecturer && (
                            <button onClick={() => setShowCreateAssignForm(!showCreateAssignForm)} className="btn btn-primary" style={{ background: 'var(--enterprise-blue)' }}>
                              <PlusCircle size={16} /> New Assignment
                            </button>
                          )}
                        </div>

                        {/* Assignment creation form ... functionality same */}
                        {isLecturer && showCreateAssignForm && (
                            <form onSubmit={(e) => handleCreateAssignment(e, selectedCourse._id)} className="enterprise-card" style={{ padding: '30px', marginBottom: '30px', borderTop: '4px solid var(--enterprise-blue)' }}>
                                <h3 style={{ marginBottom: '20px', marginTop: 0 }}>Create Assignment</h3>
                                <div className="form-group">
                                <label>Title</label>
                                <input type="text" className="form-input" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                <label>Instructions / Description</label>
                                <textarea className="form-input" style={{minHeight:'100px'}} value={assignDesc} onChange={(e) => setAssignDesc(e.target.value)} required></textarea>
                                </div>
                                <div className="form-row">
                                <div className="form-group">
                                    <label>Due Date & Time</label>
                                    <input type="datetime-local" className="form-input" value={assignDueDate} onChange={(e) => setAssignDueDate(e.target.value)} required />
                                </div>
                                <div className="form-group">
                                    <label>Maximum Points</label>
                                    <input type="number" className="form-input" min="1" value={assignMaxPoints} onChange={(e) => setAssignMaxPoints(e.target.value)} required />
                                </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateAssignForm(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{background: 'var(--enterprise-blue)'}} disabled={assignFormLoading}>Publish Assignment</button>
                                </div>
                            </form>
                        )}

                        {assignmentsLoading ? (
                          <div style={{ padding: '20px 0' }}>
                            <div className="skeleton" style={{ height: '80px', width: '100%', marginBottom: '16px', borderRadius: '8px' }}></div>
                          </div>
                        ) : assignments.length === 0 ? (
                           <div className="enterprise-card" style={{ padding: '60px 20px', textAlign: 'center', background: 'white' }}>
                             <FileText size={48} style={{ color: 'var(--enterprise-gray-200)', margin: '0 auto 20px' }} />
                             <h3 style={{ color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>No active assignments</h3>
                             <p style={{ fontSize: '1rem', color: 'var(--enterprise-gray-500)', margin: 0 }}>You're all caught up for now.</p>
                           </div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {assignments.map((assign) => (
                              <div key={assign._id} className="enterprise-card lesson-row" style={{ cursor: 'pointer', padding: '20px 24px' }} onClick={() => handleSelectAssignment(assign)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                  <div style={{ padding: '16px', background: 'var(--enterprise-gray-50)', borderRadius: '12px', color: 'var(--enterprise-gray-500)' }}>
                                    <FileText size={24} />
                                  </div>
                                  <div>
                                    <h4 style={{ margin: '0 0 6px 0', fontSize: '1.1rem', color: 'var(--enterprise-gray-900)' }}>{assign.title}</h4>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--enterprise-gray-500)', display: 'flex', gap: '16px' }}>
                                      <span>Due: {formatDate(assign.dueDate)}</span>
                                      <span>{assign.maxPoints} pts</span>
                                    </div>
                                  </div>
                                </div>
                                <ChevronDown style={{ transform: 'rotate(-90deg)', color: 'var(--enterprise-gray-400)' }} />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB: QUIZZES (Kept functional logic but wrapped in enterprise UI) */}
                {activeTab === 'quizzes' && (
                    <div className="fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div className="flex-between" style={{ marginBottom: '30px' }}>
                          <div>
                            <h2 style={{ fontSize: '1.5rem', color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>Quizzes & Exams</h2>
                            <p style={{ color: 'var(--enterprise-gray-500)', margin: 0 }}>Test your knowledge on course materials.</p>
                          </div>
                          {isLecturer && (
                            <button onClick={() => setShowCreateQuizForm(!showCreateQuizForm)} className="btn btn-primary" style={{ background: 'var(--enterprise-blue)' }}>
                              <PlusCircle size={16} /> Create Quiz
                            </button>
                          )}
                        </div>
                        {/* Injecting original quizLogic block which we string replaced */}
                        ${quizLogic}
                    </div>
                )}

                {/* NEW TAB: ANNOUNCEMENTS (Mock Data) */}
                {activeTab === 'announcements' && (
                  <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
                     <div className="flex-between" style={{ marginBottom: '40px' }}>
                        <div>
                          <h2 style={{ fontSize: '1.5rem', color: 'var(--enterprise-gray-900)', margin: '0 0 8px 0' }}>Course Announcements</h2>
                          <p style={{ color: 'var(--enterprise-gray-500)', margin: 0 }}>Important updates from your instructor.</p>
                        </div>
                        {isLecturer && (
                           <button className="btn btn-primary" style={{ background: 'var(--enterprise-blue)' }}>
                              <Bell size={16} /> New Announcement
                           </button>
                        )}
                     </div>

                     <div className="timeline">
                        {mockAnnouncements.map(ann => (
                           <div key={ann.id} className="timeline-item">
                              <div className="timeline-dot"></div>
                              <div className="enterprise-card" style={{ marginLeft: '10px' }}>
                                 <div className="enterprise-card-header flex-between" style={{ padding: '16px 24px', background: 'white' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--enterprise-blue-light)', color: 'var(--enterprise-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                            {ann.author.charAt(0)}
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--enterprise-gray-900)' }}>{ann.author}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--enterprise-gray-500)' }}>{formatDate(ann.date.toISOString())}</div>
                                        </div>
                                    </div>
                                    {ann.priority === 'high' && (
                                        <span className="enterprise-badge" style={{ background: '#fee2e2', color: '#dc2626' }}>Important</span>
                                    )}
                                 </div>
                                 <div className="enterprise-card-body" style={{ padding: '20px 24px' }}>
                                    <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', color: 'var(--enterprise-gray-900)' }}>{ann.title}</h4>
                                    <p style={{ margin: 0, color: 'var(--enterprise-gray-700)', lineHeight: '1.6' }}>{ann.content}</p>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
    );
};

export default CourseDetailsModal;
`;

fs.writeFileSync(path.join(__dirname, 'frontend/src/components/CourseDetailsModal.jsx'), newModalContent, 'utf8');
console.log('Successfully wrote Enterprise CourseDetailsModal.jsx');
