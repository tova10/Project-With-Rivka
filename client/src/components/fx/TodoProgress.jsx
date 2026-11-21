import "../../css/TodoProgress.css";

function getMessage(percent, total) {
  if (total === 0) return "No tasks yet. Add your first one.";
  if (percent === 100) return "Everything is done. Amazing!";
  if (percent >= 75) return "Almost there.";
  if (percent >= 50) return "Past halfway.";
  if (percent > 0) return "Good start. Keep going.";
  return "Let's get started.";
}

// todos = כל המשימות של המשתמש (לפני חיפוש וסינון)
function TodoProgress({ todos }) {
  const total = todos.length;
  const done = todos.filter((todo) => todo.completed).length;
  const open = total - done;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  const isComplete = total > 0 && open === 0;

  return (
    <section
      className={isComplete ? "todo-progress complete" : "todo-progress"}
      style={{ "--pct": percent }}
    >
      <p className="tp-percent">
        <span className="tp-number" aria-hidden="true" />
        <span className="sr-only">{percent}% done</span>
      </p>

      <div className="tp-body">
        <p className="tp-message">{getMessage(percent, total)}</p>
        <div className="tp-bar">
          <span />
        </div>
        <p className="tp-counts">
          <span>
            <b>{done}</b>done
          </span>
          <span>
            <b>{open}</b>open
          </span>
          <span>
            <b>{total}</b>total
          </span>
        </p>
      </div>

      {isComplete && (
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 16 }, (_, i) => (
            <i key={i} style={{ "--i": i }} />
          ))}
        </div>
      )}
    </section>
  );
}

export default TodoProgress;
