const fs = require('fs');
const path = require('path');

const fixUrls = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace 'http://localhost:5001/api... with `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api...
  // Regex to match single or double quoted absolute URLs
  content = content.replace(/['"]http:\/\/localhost:5001(\/api[^'"]*)['"]/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}$1`");

  // Regex to match backticked absolute URLs
  content = content.replace(/`http:\/\/localhost:5001(\/api[^`]+)`/g, "`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}$1`");

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Fixed URLs in ${filePath}`);
};

const frontendSrcDir = path.join(__dirname, 'frontend', 'src', 'components');

const filesToRefactor = [
  'Dashboard.jsx',
  'AdminDashboard.jsx',
  'AdminAnalytics.jsx',
  'AdminUserManagement.jsx',
  'AdminCourseManagement.jsx',
  'Login.jsx',
  'Register.jsx',
  'ForgotPassword.jsx',
  'ResetPassword.jsx'
];

filesToRefactor.forEach(file => {
  const fullPath = path.join(frontendSrcDir, file);
  if (fs.existsSync(fullPath)) {
    fixUrls(fullPath);
  } else {
    console.warn(`File not found: ${fullPath}`);
  }
});
