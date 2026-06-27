import React from 'react';
import { FileText, ClipboardList, BookOpen, X, Users, Mail, Info, Calendar, Video, File, PlusCircle, CheckCircle } from 'lucide-react';

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

    // Helper function to render correct icon for material
    const getMaterialIcon = (type) => {
        switch(type) {
            case 'video': return <Video size={20} className="text-primary" />;
            case 'pdf': return <File size={20} className="text-error" style={{color: 'var(--error)'}} />;
            default: return <FileText size={20} className="text-accent" style={{color: 'var(--accent)'}} />;
        }
    };

    return (
        <div className="modal-overlay" style={{ padding: 0 }}>
          <div className="modal-content fade-in" style={{ maxWidth: '1000px', height: '100vh', maxHeight: '100vh', padding: 0, borderRadius: 0, overflow: 'auto' }}>
            
            {/* 1. HERO BANNER */}
            <div className="lms-hero">
              <button 
                onClick={() => setSelectedCourse(null)}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', padding: '8px', borderRadius: '50%', cursor: 'pointer', zIndex: 20 }}
              >
                <X size={20} />
              </button>
              
              <div style={{ position: 'relative', zIndex: 10 }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '4px', display: 'inline-block', marginBottom: '16px' }}>
                  {selectedCourse.code}
                </span>
                <h2>{selectedCourse.title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '16px', fontSize: '0.9rem', opacity: 0.9 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Users size={16} /> {selectedCourse.students?.length || 0} Students Enrolled</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={16} /> Instructor: {selectedCourse.lecturer?.name || 'Staff'}</span>
                </div>
              </div>
            </div>

            {/* 2. STICKY TABS */}
            <div className="lms-tabs">
              <button 
                onClick={() => { setActiveTab('details'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                className={`lms-tab ${activeTab === 'details' ? 'active' : ''}`}
              >
                <Info size={16} /> Overview
              </button>
              <button 
                onClick={() => { setActiveTab('materials'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                className={`lms-tab ${activeTab === 'materials' ? 'active' : ''}`}
              >
                <BookOpen size={16} /> Modules & Materials
              </button>
              <button 
                onClick={() => { setActiveTab('assignments'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                className={`lms-tab ${activeTab === 'assignments' ? 'active' : ''}`}
              >
                <FileText size={16} /> Assignments
              </button>
              <button 
                onClick={() => { setActiveTab('quizzes'); setSelectedAssignment(null); setSelectedQuiz(null); }}
                className={`lms-tab ${activeTab === 'quizzes' ? 'active' : ''}`}
              >
                <ClipboardList size={16} /> Quizzes
              </button>
            </div>

            {/* 3. CONTENT AREA */}
            <div className="lms-content">
                
              {/* TAB CONTENT 1: COURSE OVERVIEW */}
              {activeTab === 'details' && (
                <div className="lms-grid-2 fade-in">
                  
                  {/* Left Column: Description */}
                  <div>
                    <div className="card" style={{ padding: '30px', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>About this Course</h3>
                      <p style={{ fontSize: '1rem', lineHeight: '1.7', color: 'var(--text-secondary)' }}>
                        {selectedCourse.description}
                      </p>
                    </div>

                    <div className="card" style={{ padding: '30px' }}>
                      <h3 style={{ fontSize: '1.25rem', marginBottom: '16px' }}>Your Progress</h3>
                      <div style={{ background: 'var(--bg-primary)', height: '12px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px' }}>
                         <div style={{ width: '0%', height: '100%', background: 'var(--success)' }}></div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Adaptive progress engine is currently calculating...</p>
                    </div>
                  </div>

                  {/* Right Column: Instructor & Roster */}
                  <div>
                    <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Instructor</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                         <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                           {selectedCourse.lecturer?.name?.charAt(0) || 'I'}
                         </div>
                         <div>
                           <div style={{ fontWeight: '600' }}>{selectedCourse.lecturer?.name}</div>
                           <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{selectedCourse.lecturer?.email}</div>
                         </div>
                      </div>
                    </div>

                    <div className="card" style={{ padding: '24px' }}>
                      <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Class Roster ({selectedCourse.students.length})</h3>
                      {selectedCourse.students.length === 0 ? (
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                          No students enrolled yet.
                        </p>
                      ) : (
                        <ul style={{ listStyle: 'none', maxHeight: '300px', overflowY: 'auto' }}>
                          {selectedCourse.students.map((student) => (
                            <li 
                              key={student._id} 
                              style={{ padding: '12px 0', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}
                            >
                              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {student.name.charAt(0)}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '500' }}>{student.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2: MATERIALS (MODULES) */}
              {activeTab === 'materials' && (
                <div className="fade-in">
                  <div className="flex-between" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Course Modules</h3>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <select 
                        value={matFilter} 
                        onChange={(e) => {
                          setMatFilter(e.target.value);
                          fetchCourseMaterials(selectedCourse._id, e.target.value);
                        }}
                        className="form-select"
                        style={{ width: 'auto' }}
                      >
                        <option value="all">All Difficulties</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                      
                      {isLecturer && (
                        <button onClick={() => setShowCreateMaterialForm(!showCreateMaterialForm)} className="btn btn-primary">
                          <PlusCircle size={16} /> New Material
                        </button>
                      )}
                    </div>
                  </div>

                  {isLecturer && showCreateMaterialForm && (
                     <form onSubmit={(e) => handleCreateMaterial(e, selectedCourse._id)} className="card" style={{ padding: '24px', marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                       <h4 style={{ marginBottom: '15px' }}>Upload New Material</h4>
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
                       <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                         <button type="submit" className="btn btn-primary" disabled={materialFormLoading}>
                           {materialFormLoading ? 'Uploading...' : 'Publish Material'}
                         </button>
                       </div>
                     </form>
                  )}

                  {materialsLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading modules...</div>
                  ) : materials.length === 0 ? (
                    <div className="card" style={{ padding: '50px', textAlign: 'center', background: 'transparent', borderStyle: 'dashed' }}>
                      <BookOpen size={40} style={{ color: 'var(--border-color)', margin: '0 auto 15px' }} />
                      <h4 style={{ color: 'var(--text-secondary)' }}>No materials found.</h4>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Instructor hasn't uploaded any modules yet.</p>
                    </div>
                  ) : (
                    <div>
                      {materials.map(mat => (
                        <div key={mat._id} className="module-card fade-in">
                          <div className="module-header flex-between">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                               {getMaterialIcon(mat.contentType)}
                               <div>
                                 <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{mat.title}</h4>
                                 <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                   Added on {formatDate(mat.createdAt)}
                                 </div>
                               </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span className={`badge badge-${mat.difficultyLevel === 'easy' ? 'success' : mat.difficultyLevel === 'hard' ? 'error' : 'warning'}`}>
                                {mat.difficultyLevel}
                              </span>
                              {isLecturer && (
                                <button className="btn btn-danger" style={{ padding: '4px 8px' }} onClick={() => handleDeleteMaterial(mat._id, selectedCourse._id)}>
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="module-body">
                            <p style={{ fontSize: '0.95rem', marginBottom: '16px' }}>{mat.description}</p>
                            
                            {mat.contentType === 'text' && (
                              <div style={{ padding: '20px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', border: '1px solid var(--border-color)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {mat.bodyText}
                              </div>
                            )}

                            {mat.contentType === 'pdf' && (
                              <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                                <File size={16} /> Read PDF
                              </a>
                            )}

                            {mat.contentType === 'video' && (
                              <a href={mat.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ display: 'inline-flex' }}>
                                <Video size={16} /> Watch Video
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT 3: ASSIGNMENTS */}
              {activeTab === 'assignments' && (
                <div className="fade-in">
                  
                  {/* DETAIL VIEW OF SINGLE ASSIGNMENT */}
                  {selectedAssignment ? (
                    <div className="fade-in">
                      <button onClick={() => setSelectedAssignment(null)} className="btn btn-secondary" style={{ marginBottom: '20px' }}>
                        ← Back to Assignments
                      </button>

                      <div className="card" style={{ padding: '30px', marginBottom: '30px' }}>
                        <div className="flex-between" style={{ marginBottom: '16px' }}>
                          <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{selectedAssignment.title}</h3>
                          <span className="badge badge-admin" style={{ fontSize: '0.9rem' }}>{selectedAssignment.maxPoints} Points</span>
                        </div>
                        <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> Due: {formatDate(selectedAssignment.dueDate)}</span>
                        </div>
                        <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>{selectedAssignment.description}</p>
                      </div>

                      {/* STUDENT SUBMISSION AREA */}
                      {isStudent && (
                        <div className="card" style={{ padding: '30px', borderTop: '4px solid var(--primary)' }}>
                          <h3 style={{ marginBottom: '20px' }}>Your Submission</h3>
                          {submissionLoading ? (
                            <p>Loading your submission...</p>
                          ) : studentSubmission ? (
                            <div style={{ background: 'var(--bg-primary)', padding: '20px', borderRadius: 'var(--radius)' }}>
                               <div className="flex-between" style={{ marginBottom: '16px' }}>
                                 <span className="badge badge-success"><CheckCircle size={14} style={{ marginRight: '4px' }}/> Submitted</span>
                                 <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{formatDate(studentSubmission.submittedAt)}</span>
                               </div>
                               <p style={{ whiteSpace: 'pre-wrap', marginBottom: '20px' }}>{studentSubmission.content}</p>
                               
                               <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '20px' }}>
                                 <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>Feedback & Grade</h4>
                                 {studentSubmission.status === 'graded' ? (
                                   <div>
                                     <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '10px' }}>
                                       {studentSubmission.gradeScore} / {selectedAssignment.maxPoints}
                                     </div>
                                     <p><strong>Feedback:</strong> {studentSubmission.gradeFeedback || 'No additional feedback provided.'}</p>
                                   </div>
                                 ) : (
                                   <p style={{ color: 'var(--text-muted)' }}>Your assignment is currently under review by the instructor.</p>
                                 )}
                               </div>
                            </div>
                          ) : (
                            <form onSubmit={(e) => handleSubmitAssignment(e, selectedAssignment._id)}>
                              <div className="form-group">
                                <label>Submission Content or Link</label>
                                <textarea className="form-input" style={{ minHeight: '150px' }} value={submissionContent} onChange={(e) => setSubmissionContent(e.target.value)} required placeholder="Write your answer or paste a link to your work here..."></textarea>
                              </div>
                              <button type="submit" className="btn btn-primary" disabled={submitFormLoading}>
                                {submitFormLoading ? 'Submitting...' : 'Submit Assignment'}
                              </button>
                            </form>
                          )}
                        </div>
                      )}

                      {/* LECTURER GRADING AREA */}
                      {isLecturer && (
                        <div>
                           <h3 style={{ marginBottom: '16px' }}>Student Submissions</h3>
                           {submissionsLoading ? (
                             <p>Loading submissions...</p>
                           ) : submissions.length === 0 ? (
                             <div className="card" style={{ padding: '30px', textAlign: 'center', background: 'transparent', borderStyle: 'dashed' }}>
                               No students have submitted yet.
                             </div>
                           ) : (
                             <div className="grid-cards" style={{ gridTemplateColumns: '1fr' }}>
                               {submissions.map(sub => (
                                 <div key={sub._id} className="card" style={{ padding: '24px' }}>
                                   <div className="flex-between" style={{ marginBottom: '16px' }}>
                                     <div>
                                       <h4 style={{ margin: 0 }}>{sub.student.name}</h4>
                                       <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {formatDate(sub.submittedAt)}</div>
                                     </div>
                                     <span className={`badge ${sub.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                                       {sub.status === 'graded' ? `Graded: ${sub.gradeScore}/${selectedAssignment.maxPoints}` : 'Needs Grading'}
                                     </span>
                                   </div>
                                   
                                   <div style={{ padding: '16px', background: 'var(--bg-primary)', borderRadius: 'var(--radius)', marginBottom: '16px', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                                     {sub.content}
                                   </div>
                                   
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
                                          <button type="submit" className="btn btn-primary" disabled={gradeFormLoading}>Save Grade</button>
                                          <button type="button" className="btn btn-secondary" onClick={() => setGradingSubmissionId(null)}>Cancel</button>
                                        </div>
                                      </form>
                                   ) : (
                                      <button className="btn btn-secondary" onClick={() => {
                                          setGradingSubmissionId(sub._id);
                                          setGradeScore(sub.gradeScore || '');
                                          setGradeFeedback(sub.gradeFeedback || '');
                                      }}>
                                        {sub.status === 'graded' ? 'Edit Grade' : 'Grade Submission'}
                                      </button>
                                   )}
                                 </div>
                               ))}
                             </div>
                           )}
                        </div>
                      )}

                    </div>
                  ) : (
                    // LIST VIEW OF ALL ASSIGNMENTS
                    <div>
                      <div className="flex-between" style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '1.25rem' }}>Assignments</h3>
                        {isLecturer && (
                          <button onClick={() => setShowCreateAssignForm(!showCreateAssignForm)} className="btn btn-primary">
                            <PlusCircle size={16} /> Create Assignment
                          </button>
                        )}
                      </div>

                      {isLecturer && showCreateAssignForm && (
                        <form onSubmit={(e) => handleCreateAssignment(e, selectedCourse._id)} className="card" style={{ padding: '24px', marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                          <h4 style={{ marginBottom: '15px' }}>New Assignment</h4>
                          <div className="form-group">
                            <label>Title</label>
                            <input type="text" className="form-input" value={assignTitle} onChange={(e) => setAssignTitle(e.target.value)} required />
                          </div>
                          <div className="form-group">
                            <label>Instructions / Description</label>
                            <textarea className="form-input" value={assignDesc} onChange={(e) => setAssignDesc(e.target.value)} required></textarea>
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
                            <button type="submit" className="btn btn-primary" disabled={assignFormLoading}>Publish Assignment</button>
                          </div>
                        </form>
                      )}

                      {assignmentsLoading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Loading assignments...</div>
                      ) : assignments.length === 0 ? (
                        <div className="card" style={{ padding: '50px', textAlign: 'center', background: 'transparent', borderStyle: 'dashed' }}>
                          <FileText size={40} style={{ color: 'var(--border-color)', margin: '0 auto 15px' }} />
                          <h4 style={{ color: 'var(--text-secondary)' }}>No assignments yet.</h4>
                        </div>
                      ) : (
                        <div className="grid-cards" style={{ gridTemplateColumns: '1fr' }}>
                          {assignments.map((assign) => (
                            <div key={assign._id} className="module-card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', cursor: 'pointer' }} onClick={() => handleSelectAssignment(assign)}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                                  <FileText size={24} />
                                </div>
                                <div>
                                  <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{assign.title}</h4>
                                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                    Due: {formatDate(assign.dueDate)} • {assign.maxPoints} pts
                                  </div>
                                </div>
                              </div>
                              <button className="btn btn-secondary">View Details</button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT 4: QUIZZES (Simplified fallback for MVP) */}
              {activeTab === 'quizzes' && (
                <div className="fade-in">
                  <div className="flex-between" style={{ marginBottom: '24px' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>Quizzes</h3>
                    {isLecturer && (
                      <button onClick={() => setShowCreateQuizForm(!showCreateQuizForm)} className="btn btn-primary">
                        <PlusCircle size={16} /> Create Quiz
                      </button>
                    )}
                  </div>
                  
                  {isLecturer && showCreateQuizForm && (
                     <div className="card" style={{ padding: '24px', marginBottom: '30px', borderLeft: '4px solid var(--primary)' }}>
                        <p style={{ color: 'var(--text-muted)' }}>Quiz creation interface logic preserved in Dashboard.jsx, keeping UI simple for MVP. Please use the original implementation or refer to the assignments tab for design layout.</p>
                        <button className="btn btn-secondary" onClick={() => setShowCreateQuizForm(false)}>Close</button>
                     </div>
                  )}

                  {quizzesLoading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>Loading quizzes...</div>
                  ) : quizzes.length === 0 ? (
                    <div className="card" style={{ padding: '50px', textAlign: 'center', background: 'transparent', borderStyle: 'dashed' }}>
                      <ClipboardList size={40} style={{ color: 'var(--border-color)', margin: '0 auto 15px' }} />
                      <h4 style={{ color: 'var(--text-secondary)' }}>No quizzes available.</h4>
                    </div>
                  ) : (
                    <div className="grid-cards" style={{ gridTemplateColumns: '1fr' }}>
                      {quizzes.map((quiz) => (
                        <div key={quiz._id} className="module-card fade-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{ padding: '12px', background: 'var(--primary-light)', borderRadius: '50%', color: 'var(--primary)' }}>
                              <ClipboardList size={24} />
                            </div>
                            <div>
                              <h4 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>{quiz.title}</h4>
                              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                {quiz.questions.length} Questions • {quiz.timeLimit} mins
                              </div>
                            </div>
                          </div>
                          <button className="btn btn-secondary" onClick={() => alert("Quiz taking interface is under development. Please check back later.")}>Take Quiz</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
    );
};

export default CourseDetailsModal;
