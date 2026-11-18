import "../../css/SearchBar.css";

// fields   = על אילו שדות אפשר לחפש: [{ value: "id", label: "ID" }, ...]
// search   = החיפוש הנוכחי: { field: "title", text: "" }
// onChange = מה לעשות כשהחיפוש משתנה
function SearchBar({ fields, search, onChange }) {
  // החלפת השדה: מאפסים את הטקסט
  function handleFieldChange(e) {
    onChange({ field: e.target.value, text: "" });
  }

  function handleTextChange(e) {
    onChange({ ...search, text: e.target.value });
  }

  return (
    <div className="search-bar">
      <label>Search by: </label>

      <select value={search.field} onChange={handleFieldChange}>
        {fields.map((field) => (
          <option key={field.value} value={field.value}>
            {field.label}
          </option>
        ))}
      </select>

      {search.field === "completed" ? (
        <select value={search.text} onChange={handleTextChange}>
          <option value="">All</option>
          <option value="true">Done</option>
          <option value="false">Not done</option>
        </select>
      ) : (
        <input
          placeholder="Search..."
          value={search.text}
          onChange={handleTextChange}
        />
      )}
    </div>
  );
}

export default SearchBar;