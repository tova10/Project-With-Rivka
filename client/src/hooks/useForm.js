import { useState } from "react";

// Hook גנרי לכל טופס
// initialValues = הערכים ההתחלתיים של השדות
function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  // מעדכן כל שדה לפי ה-name שלו
  // בתיבת סימון (checkbox) הערך הוא checked (true/false), בשאר השדות value
  function handleChange(e) {
    const { name, type, value, checked } = e.target;
    setValues({ ...values, [name]: type === "checkbox" ? checked : value });
  }

  // מחזיר את הטופס למצב ההתחלתי
  function reset() {
    setValues(initialValues);
  }

  return { values, handleChange, reset };
}

export default useForm;
