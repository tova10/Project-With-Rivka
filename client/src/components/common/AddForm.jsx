import useForm from "../../hooks/useForm";

// fields     = השדות בטופס: [{ name: "title", placeholder: "Title" }, ...]
// onAdd      = מה לעשות עם הערכים כשלוחצים Add
// buttonText = הטקסט על הכפתור
function AddForm({ fields, onAdd, buttonText = "Add" }) {
  // בונים ערך ריק לכל שדה, למשל: { title: "" }
  const initialValues = {};
  fields.forEach((field) => {
    initialValues[field.name] = "";
  });

  const { values, handleChange, reset } = useForm(initialValues);

  function handleSubmit(e) {
    e.preventDefault();

    // אם יש שדה ריק, לא מוסיפים
    const hasEmptyField = fields.some((field) => !values[field.name].trim());
    if (hasEmptyField) return;

    onAdd(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <input
          key={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={values[field.name]}
          onChange={handleChange}
        />
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default AddForm;