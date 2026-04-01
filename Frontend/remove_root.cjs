const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if(file !== 'node_modules') {
        walk(filePath, fileList);
      }
    } else if (file.endsWith('.vue')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const vueFiles = walk('/Users/fernandomedina/Desktop/Shiflty /Frontend/src');
let emptyCount = 0;

for (const file of vueFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content.replace(/:root\s*\{[^}]+\}/g, '');
  
  // Clean up double blank lines
  newContent = newContent.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Clean up empty style scoped, including ones with just comments
  const regexEmptyStyle = /<style\s+scoped>\s*(?:\/\*[^*]*\*\/\s*)*<\/style>/g;
  if(regexEmptyStyle.test(newContent)){
     newContent = newContent.replace(regexEmptyStyle, '');
     emptyCount++;
  }
  
  if (content !== newContent) {
    fs.writeFileSync(file, newContent);
    console.log(`Updated ${path.basename(file)}`);
  }
}
console.log(`Deleted ${emptyCount} empty <style scoped> blocks.`);
