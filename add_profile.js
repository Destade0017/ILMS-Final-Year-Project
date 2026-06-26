const fs = require('fs');
const path = require('path');

const addProfileButton = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Add Settings to lucide-react imports if not there
  if (!content.includes('Settings')) {
      content = content.replace(/LayoutDashboard([^}]*)} from 'lucide-react';/, 'LayoutDashboard, Settings$1} from \'lucide-react\';');
  }

  // Replace logout button with Profile + Logout
  content = content.replace(
      /<button onClick=\{logout\} className="btn btn-secondary">/g,
      '<button onClick={goToProfile} className="btn btn-secondary" style={{ marginRight: \'10px\' }}>\n            <Settings size={16} /> Profile\n          </button>\n          <button onClick={logout} className="btn btn-secondary">'
  );

  // But we only want it in the header, not everywhere if there are multiple logouts
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${filePath}`);
};

const frontendSrcDir = path.join(__dirname, 'frontend', 'src', 'components');

const filesToRefactor = [
  'Dashboard.jsx',
  'AdminDashboard.jsx'
];

filesToRefactor.forEach(file => {
  const fullPath = path.join(frontendSrcDir, file);
  if (fs.existsSync(fullPath)) {
    addProfileButton(fullPath);
  }
});
