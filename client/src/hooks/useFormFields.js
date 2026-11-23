import { useState } from "react";


function useFormFields(initialValues) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function reset() {
    setValues(initialValues);
  }

  return { values, handleChange, reset };
}

export default useFormFields;
