// סקריפט חד-פעמי: מחליף את קישורי התמונות השבורים ב-db.json בקישורים שעובדים
// הרצה (מהתיקייה של db.json, כשה-json-server כבוי):  node fix-photos.cjs

const fs = require("fs");

if (!fs.existsSync("db.json")) {
  console.error("❌ לא נמצא db.json. יש להריץ מהתיקייה שבה הוא נמצא.");
  process.exit(1);
}

const db = JSON.parse(fs.readFileSync("db.json", "utf8"));

// גיבוי לפני שינוי
fs.writeFileSync("db.backup-photos.json", JSON.stringify(db, null, 2));

// קישור ישן, למשל: https://via.placeholder.com/600/92c952
// (גודל + צבע)
const OLD = /https?:\/\/via\.placeholder\.com\/(\d+)\/([0-9a-fA-F]{3,6})/;

// הופך קישור ישן לחדש באותו גודל ובאותו צבע. קישור אחר - נשאר כמו שהוא
function fixUrl(url) {
  const match = OLD.exec(url || "");
  if (!match) return url;
  const [, size, color] = match;
  return `https://placehold.co/${size}x${size}/${color}/ffffff.png`;
}

let changed = 0;

db.photos = db.photos.map((photo) => {
  const url = fixUrl(photo.url);
  const thumbnailUrl = fixUrl(photo.thumbnailUrl);
  if (url !== photo.url || thumbnailUrl !== photo.thumbnailUrl) changed++;
  return { ...photo, url, thumbnailUrl };
});

fs.writeFileSync("db.json", JSON.stringify(db, null, 2));
console.log(`✅ עודכנו ${changed} תמונות מתוך ${db.photos.length}. גיבוי: db.backup-photos.json`);