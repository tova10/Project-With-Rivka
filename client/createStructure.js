import fs from "fs";
import path from "path";

const SRC_DIR = path.resolve("src");
const CSS_DIR = path.join(SRC_DIR, "css");

// מחזיר את כל הקבצים בתיקייה ובתתי-התיקיות שלה
function getAllFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

// נתיב יחסי תקין לייבוא (תמיד עם / ומתחיל ב- ./ או ../)
function toImportPath(fromDir, targetFile) {
  let relative = path.relative(fromDir, targetFile).split(path.sep).join("/");
  if (!relative.startsWith(".")) {
    relative = "./" + relative;
  }
  return relative;
}

fs.mkdirSync(CSS_DIR, { recursive: true });

const allFiles = getAllFiles(SRC_DIR);

// ---------- שלב 1: מציאת קובצי ה-CSS להעברה ----------
const cssFiles = allFiles.filter(
  (file) => file.endsWith(".css") && path.dirname(file) !== CSS_DIR
);

// בדיקה שאין שני קבצים עם אותו שם
const names = cssFiles.map((file) => path.basename(file));
const duplicates = names.filter((name, i) => names.indexOf(name) !== i);
if (duplicates.length > 0) {
  console.log("Stopped: duplicate CSS file names:", duplicates);
  process.exit(1);
}

// ---------- שלב 2: עדכון שורות ה-import ----------
const codeFiles = allFiles.filter(
  (file) => file.endsWith(".jsx") || file.endsWith(".js")
);

const importRegex = /import\s+["'](\.{1,2}\/[^"']+\.css)["'];?/g;

for (const file of codeFiles) {
  const fileDir = path.dirname(file);
  const content = fs.readFileSync(file, "utf8");

  const updated = content.replace(importRegex, (match, oldImportPath) => {
    const cssName = path.basename(oldImportPath);
    const newImportPath = toImportPath(fileDir, path.join(CSS_DIR, cssName));
    return `import "${newImportPath}";`;
  });

  if (updated !== content) {
    fs.writeFileSync(file, updated);
    console.log(`updated imports: ${path.relative(SRC_DIR, file)}`);
  }
}

// ---------- שלב 3: העברת הקבצים ----------
for (const file of cssFiles) {
  const target = path.join(CSS_DIR, path.basename(file));
  fs.renameSync(file, target);
  console.log(`moved: ${path.relative(SRC_DIR, file)}  ->  css/${path.basename(file)}`);
}

console.log("Done!");