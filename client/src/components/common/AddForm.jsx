import useForm from "../../hooks/useForm";

// fields     = השדות בטופס:
//              שדה טקסט:    { name: "title", placeholder: "Title" }
//              תיבת סימון:  { name: "anonymous", type: "checkbox", label: "Post anonymously" }
// onAdd      = מה לעשות עם הערכים כשלוחצים Add
// buttonText = הטקסט על הכפתור
function AddForm({ fields, onAdd, buttonText = "Add" }) {
  // בונים ערך התחלתי לכל שדה: תיבת סימון = false, טקסט = ""
  const initialValues = {};
  fields.forEach((field) => {
    initialValues[field.name] = field.type === "checkbox" ? false : "";
  });

  const { values, handleChange, reset } = useForm(initialValues);

  function handleSubmit(e) {
    e.preventDefault();

    // אם יש שדה טקסט ריק, לא מוסיפים (תיבת סימון לא חייבת להיות מסומנת)
    const hasEmptyField = fields.some(
      (field) => field.type !== "checkbox" && !values[field.name].trim()
    );
    if (hasEmptyField) return;

    onAdd(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) =>
        field.type === "checkbox" ? (
          <label key={field.name}>
            <input
              type="checkbox"
              name={field.name}
              checked={values[field.name]}
              onChange={handleChange}
            />
            {field.label}
          </label>
        ) : (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.placeholder}
            aria-label={field.placeholder}
            value={values[field.name]}
            onChange={handleChange}
          />
        )
      )}
      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default AddForm;
