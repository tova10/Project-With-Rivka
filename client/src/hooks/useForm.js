import { useState } from "react";

// Hook גנרי לכל טופס
// initialValues = הערכים ההתחלתיים של השדות
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  // מעדכן כל שדה לפי ה-name שלו
  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  // מחזיר את הטופס למצב ההתחלתי
  function reset() {
    setValues(initialValues);
  }

  return { values, handleChange, reset };
}

export default useForm;