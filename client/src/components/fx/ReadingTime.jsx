import "../../css/ReadingTime.css";

// זמן קריאה משוער: כ-200 מילים לדקה
function ReadingTime({ text = "" }) {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));

  return (
    <span className="reading-time">
      {minutes} min read · {words} words
    </span>
  );
}

export default ReadingTime;
