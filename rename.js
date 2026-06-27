const fs = require('fs');
const path = require('path');

const walkDir = (dir, callback) => {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.git' && f !== 'dist' && f !== 'build') {
        walkDir(dirPath, callback);
      }
    } else {
      // only touch js, jsx, html, md files
      if (/\.(js|jsx|html|md|json)$/.test(f)) {
        callback(dirPath);
      }
    }
  });
};

const rootPath = path.join(__dirname);

walkDir(rootPath, (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Replace "Learnova" first
  content = content.replace(/Learnova/g, 'Learnova');
  // Replace "Learnova"
  content = content.replace(/Learnova/g, 'Learnova');
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});
