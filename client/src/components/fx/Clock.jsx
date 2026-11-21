import { useEffect, useState } from "react";
import "../../css/Clock.css";

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

const pad = (n) => String(n).padStart(2, "0");

// שעון חי + תאריך לועזי ועברי + כמה מהיום עבר
function Clock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hebrewDate = getHebrewDate(now);
  const dayPercent = Math.round(((now.getHours() * 60 + now.getMinutes()) / 1440) * 100);

  return (
    <div className="clock">
      <p className="clock-time">
        {pad(now.getHours())}
        <span className="clock-colon">:</span>
        {pad(now.getMinutes())}
        <small>{pad(now.getSeconds())}</small>
      </p>
      <p className="clock-date">
        {now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short" })}
      </p>
      {hebrewDate && (
        <p className="clock-hebrew" dir="rtl">
          {hebrewDate}
        </p>
      )}
      <div className="clock-day">
        <span style={{ width: dayPercent + "%" }} />
      </div>
      <p className="clock-caption">{dayPercent}% of today has passed</p>
    </div>
  );
}

export default Clock;
