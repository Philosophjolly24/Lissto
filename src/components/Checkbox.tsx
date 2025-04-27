import React from "react";

interface CheckBoxProp {
  children: React.ReactNode;
}

export default function CheckBox({ children }: CheckBoxProp) {
  return (
    <label className="custom-checkbox">
      <input type="checkbox" />
      <span className="checkmark"></span>
      <h3 className="checkbox-label">{children}</h3>
    </label>
  );
}
