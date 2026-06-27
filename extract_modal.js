const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'frontend/src/components/Dashboard.jsx');
const modalPath = path.join(__dirname, 'frontend/src/components/CourseDetailsModal.jsx');

let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

const startMarker = '{/* SELECTED COURSE DETAILS PANEL / MODAL */}';
const startIndex = dashboardContent.indexOf(startMarker);

// Find the end of the block
let endIndex = -1;
let bracketCount = 0;
let inside = false;

for (let i = startIndex; i < dashboardContent.length; i++) {
    if (dashboardContent[i] === '{') {
        bracketCount++;
        inside = true;
    } else if (dashboardContent[i] === '}') {
        bracketCount--;
        if (inside && bracketCount === 0) {
            endIndex = i + 1;
            break;
        }
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    let modalContent = dashboardContent.substring(startIndex, endIndex);
    
    // Remove it from dashboard
    dashboardContent = dashboardContent.substring(0, startIndex) + 
                       '\n      {/* MODAL EXTRACTED TO CourseDetailsModal.jsx */}\n      {selectedCourse && <CourseDetailsModal {...modalProps} />}\n' + 
                       dashboardContent.substring(endIndex);

    // Extract all props used in the modal that are defined in Dashboard
    const modalPropsObjStr = `
  const modalProps = {
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
  };
    `;

    // Insert modalProps before return in Dashboard
    dashboardContent = dashboardContent.replace('  return (', modalPropsObjStr + '\n  return (');
    
    // Add import to Dashboard
    if (!dashboardContent.includes('CourseDetailsModal')) {
        dashboardContent = dashboardContent.replace('import React', 'import React\nimport CourseDetailsModal from "./CourseDetailsModal";');
    }

    fs.writeFileSync(dashboardPath, dashboardContent);

    // Create CourseDetailsModal.jsx
    const modalFileContent = `import React from 'react';
import { FileText, ClipboardList, BookOpen } from 'lucide-react';

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

    return (
        ${modalContent}
    );
};

export default CourseDetailsModal;
`;
    fs.writeFileSync(modalPath, modalFileContent);
    console.log('Extraction complete!');
} else {
    console.log('Could not find modal bounds.');
}
