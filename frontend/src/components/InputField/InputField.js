import React from "react";

const InputField = ({ type, id, value, label, onChange }) => {
  return (
    <div className="mb-4 form-group a">
      <input
        type={type}
        className="form-control b"
        id={id}
        value={value}
        placeholder=" "
        onChange={onChange}
      />
      <label htmlFor={id} className="form-label c">
        {label}
      </label>
    </div>
  );
};

export default InputField;

