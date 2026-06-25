const fs = require('fs');
const path = require('path');

const refactorFile = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace grids
  content = content.replace(
    /style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'repeat\(auto-fill,\s*minmax\(300px,\s*1fr\)\)',\s*gap:\s*'20px'\s*\}\}/g,
    'className="grid-cards"'
  );

  // Replace modal overlay
  content = content.replace(
    /style=\{\{\s*position:\s*'fixed',\s*top:\s*0,\s*left:\s*0,\s*right:\s*0,\s*bottom:\s*0,\s*background:\s*'rgba\(15,\s*23,\s*42,\s*0\.45\)',\s*backdropFilter:\s*'blur\(8px\)',\s*WebkitBackdropFilter:\s*'blur\(8px\)',\s*display:\s*'flex',\s*alignItems:\s*'center',\s*justifyContent:\s*'center',\s*zIndex:\s*100,\s*padding:\s*'20px'\s*\}\}/g,
    'className="modal-overlay"'
  );

  // Replace modal content
  content = content.replace(
    /className="card fade-in"\s*style=\{\{\s*width:\s*'100%',\s*maxWidth:\s*'750px',\s*padding:\s*'30px',\s*maxHeight:\s*'90vh',\s*overflowY:\s*'auto',\s*background:\s*'var\(--bg-secondary\)',\s*display:\s*'flex',\s*flexDirection:\s*'column'\s*\}\}/g,
    'className="modal-content fade-in"'
  );

  // Replace standard 1fr 1fr forms
  content = content.replace(
    /style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'20px',\s*marginBottom:\s*'15px'\s*\}\}/g,
    'className="form-row"'
  );

  // Replace specific grid in Materials form
  content = content.replace(
    /style=\{\{\s*display:\s*'grid',\s*gridTemplateColumns:\s*'1fr 1fr',\s*gap:\s*'20px'\s*\}\}/g,
    'className="form-row"'
  );

  // Make tabs scrollable
  // Finding `<div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px', marginBottom: '20px' }}>`
  content = content.replace(
    /<div style=\{\{\s*display:\s*'flex',\s*gap:\s*'20px',\s*borderBottom:\s*'1px solid var\(--border-color\)',\s*paddingBottom:\s*'10px',\s*marginBottom:\s*'20px'\s*\}\}>/g,
    '<div className="tabs-container" style={{ borderBottom: \'1px solid var(--border-color)\' }}>'
  );

  // Make tables responsive
  // We need to wrap `<table>` with `<div className="table-responsive">`
  // Simple regex replacement: replace `<table ` with `<div className="table-responsive"><table `
  // and `</table>` with `</table></div>`
  if (!content.includes('className="table-responsive"')) {
    content = content.replace(/<table/g, '<div className="table-responsive">\n<table');
    content = content.replace(/<\/table>/g, '</table>\n</div>');
  }

  // Dashboard Header stack on mobile
  content = content.replace(
    /<header className="card" style=\{\{\s*display:\s*'flex',\s*justifyContent:\s*'space-between',\s*alignItems:\s*'center',\s*padding:\s*'20px 30px',\s*marginBottom:\s*'30px'\s*\}\}>/g,
    '<header className="card mobile-stack" style={{ display: \'flex\', justifyContent: \'space-between\', alignItems: \'center\', padding: \'20px\', marginBottom: \'30px\' }}>'
  );

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
  }
});
