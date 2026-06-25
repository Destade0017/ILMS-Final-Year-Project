const fs = require('fs');
const path = require('path');

const refactorFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace glass-panel with card
  content = content.replace(/glass-panel/g, 'card');

  // Replace emojis with Lucide components (assuming we import them)
  content = content.replace(/🚪 Logout/g, '<LogOut size={16} /> Logout');
  content = content.replace(/⚠️/g, '<AlertCircle size={18} />');
  content = content.replace(/✅/g, '<CheckCircle size={18} />');
  content = content.replace(/👨‍🏫 /g, '');
  content = content.replace(/🎓 Enrolled/g, 'Enrolled');
  content = content.replace(/👥 /g, '');
  content = content.replace(/📝 Coursework \(Assignments\)/g, '<FileText size={16} /> Assignments');
  content = content.replace(/📋 Quizzes & Tests/g, '<ClipboardList size={16} /> Quizzes');
  content = content.replace(/📚 Materials/g, '<BookOpen size={16} /> Materials');
  content = content.replace(/🟢 /g, '');
  content = content.replace(/🟡 /g, '');
  content = content.replace(/🔴 /g, '');
  content = content.replace(/📄/g, 'PDF');
  content = content.replace(/🎥/g, 'Video');
  content = content.replace(/📝/g, 'Article');

  // Terminology updates
  content = content.replace(/'Join Course'/g, "'Enroll'");
  content = content.replace(/>Join Course</g, '>Enroll<');
  content = content.replace(/>Add Course</g, '>Create Course<');
  content = content.replace(/>See More</g, '>View Details<');
  content = content.replace(/>View Course Details</g, '>View Details<');
  content = content.replace(/>Submit Work</g, '>Submit Assignment<');
  content = content.replace(/>Check Score</g, '>View Results<');

  // Admin specific terminology and emojis
  content = content.replace(/👑 /g, '');
  content = content.replace(/👥 /g, '');
  content = content.replace(/📚 /g, '');
  content = content.replace(/📊 /g, '');
  content = content.replace(/👨‍🎓 /g, '');
  content = content.replace(/📅 /g, '');
  content = content.replace(/📝 /g, '');

  // Add imports to the top if not present
  if (!content.includes('lucide-react')) {
    if (content.includes("import React, { useState, useEffect } from 'react';")) {
        content = content.replace(
            "import React, { useState, useEffect } from 'react';",
            "import React, { useState, useEffect } from 'react';\nimport { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';"
        );
    } else if (content.includes("import React, { useState } from 'react';")) {
        content = content.replace(
            "import React, { useState } from 'react';",
            "import React, { useState } from 'react';\nimport { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';"
        );
    } else if (content.includes("import React from 'react';")) {
        content = content.replace(
            "import React from 'react';",
            "import React from 'react';\nimport { LogOut, AlertCircle, CheckCircle, FileText, ClipboardList, BookOpen, Users, LayoutDashboard, Settings } from 'lucide-react';"
        );
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Refactored ${filePath}`);
};

const frontendSrcDir = path.join(__dirname, 'frontend', 'src', 'components');

const filesToRefactor = [
  'Dashboard.jsx',
  'AdminDashboard.jsx',
  'AdminAnalytics.jsx',
  'AdminUserManagement.jsx',
  'AdminCourseManagement.jsx'
];

filesToRefactor.forEach(file => {
  const fullPath = path.join(frontendSrcDir, file);
  if (fs.existsSync(fullPath)) {
    refactorFile(fullPath);
  } else {
    console.warn(`File not found: ${fullPath}`);
  }
});
