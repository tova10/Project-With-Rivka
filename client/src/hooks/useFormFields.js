import { useState } from "react";

// Hook לטופס: שומר את ערכי השדות לפי ה-name שלהם
// initialValues = הערכים ההתחלתיים, למשל { username: "", password: "" }
function useFormFields(initialValues) {
  const [values, setValues] = useState(initialValues);

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  // החזרת הטופס לערכים ההתחלתיים
  function reset() {
    setValues(initialValues);
  }

  return { values, handleChange, reset };
}

export default useFormFields;
