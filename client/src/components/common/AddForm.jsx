import useFormFields from "../../hooks/useFormFields";

function AddForm({ fields, onAdd, buttonText = "Add" }) {

  const emptyValues = {};
  
  fields.forEach((field) => {
    emptyValues[field.name] = "";
  });

  const { values, handleChange, reset } = useFormFields(emptyValues);

  function handleSubmit(e) {
    e.preventDefault();
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
          aria-label={field.placeholder}
          value={values[field.name]}
          onChange={handleChange}
          required
        />
      ))}
      <button type="submit">{buttonText}</button>
    </form>
  );
}

export default AddForm;
