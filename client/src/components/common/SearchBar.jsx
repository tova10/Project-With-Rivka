import "../../css/SearchBar.css";

function SearchBar({ fields, field, text, onChange }) {
  
  return (
    <div className="search-bar">
      <label>Search by: </label>

      <select
        aria-label="Search by"
        value={field}
        onChange={(e) => onChange(e.target.value, "")}
      >
        {fields.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {field === "completed" ? (
        <select
          aria-label="Status"
          value={text}
          onChange={(e) => onChange(field, e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Done</option>
          <option value="false">Not done</option>
        </select>
      ) : (
        <input
          placeholder="Search..."
          aria-label="Search"
          value={text}
          onChange={(e) => onChange(field, e.target.value)}
        />
      )}
    </div>
  );
}

export default SearchBar;
