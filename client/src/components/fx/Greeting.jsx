import { useEffect, useState } from "react";
import "../../css/Greeting.css";

// ברכה לפי השעה ביום
function getGreeting(hour) {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
}

// מספר -> אותיות (29 -> כ״ט, 5787 -> תשפ״ז)
function toHebrewNumber(number) {
  const ones = ["", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט"];
  const tens = ["", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ"];
  const hundreds = ["", "ק", "ר", "ש"];
  let n = number % 1000;
  let letters = "";
  while (n >= 400) {
    letters += "ת";
    n -= 400;
  }
  if (n >= 100) {
    letters += hundreds[Math.floor(n / 100)];
    n = n % 100;
  }
  if (n === 15) letters += "טו";
  else if (n === 16) letters += "טז";
  else letters += tens[Math.floor(n / 10)] + ones[n % 10];

  if (letters.length === 1) return letters + "׳";
  return letters.slice(0, -1) + "״" + letters.slice(-1);
}

// התאריך העברי באותיות (אם הדפדפן לא תומך – מחזיר ריק)
function getHebrewDate(date) {
  try {
    const parts = new Intl.DateTimeFormat("he-u-ca-hebrew", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).formatToParts(date);
    const get = (type) => parts.find((part) => part.type === type)?.value;
    const day = Number(get("day"));
    const year = Number(get("year"));
    if (!day || !year) return "";
    return toHebrewNumber(day) + " " + get("month") + " " + toHebrewNumber(year);
  } catch {
    return "";
  }
}

// name = השם המלא של המשתמש
function Greeting({ name }) {
  const [now, setNow] = useState(() => new Date());

  // עדכון כל חצי דקה – כדי שהשעה והברכה יתחלפו
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const weekday = now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const hebrewDate = getHebrewDate(now);

  return (
    <div className="greeting">
      <p className="greeting-meta">
        <span>{weekday}</span>
        {hebrewDate && (
          <span className="greeting-hebrew" dir="rtl">
            {hebrewDate}
          </span>
        )}
        <span className="greeting-time">{time}</span>
      </p>
      <h1>
        {getGreeting(now.getHours())}, {name}
      </h1>
    </div>
  );
}

export default Greeting;
