import "../../css/SortSelect.css";


function SortSelect({ options, value, onChange }) {
  return (
    <div className="sort-select">
      <label>Sort by: </label>
      <select aria-label="Sort by" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SortSelect;
