// components/CustomSelect.tsx
import React, { useEffect, useRef } from "react";
import Choices from "choices.js";
import "choices.js/public/assets/styles/choices.min.css";
interface CustomSelectProp {
  children: React.ReactNode;
}
export default function CustomSelect({ children }: CustomSelectProp) {
  const selectRef = useRef<HTMLSelectElement | null>(null);
  const choicesInstance = useRef<Choices | null>(null);

  useEffect(() => {
    if (selectRef.current) {
      choicesInstance.current = new Choices(selectRef.current, {
        searchEnabled: false,
        itemSelectText: "",
      });
    }

    return () => {
      if (choicesInstance.current) {
        choicesInstance.current.destroy();
      }
    };
  }, []);

  return (
    <select className="stores" ref={selectRef}>
      {children}
    </select>
  );
}
