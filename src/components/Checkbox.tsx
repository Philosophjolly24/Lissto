interface CheckBoxProp {
  children: React.ReactNode;
  onClick: (e: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  checked: boolean;
}

export default function CheckBox({ children, onClick, checked }: CheckBoxProp) {
  return (
    <label className="custom-checkbox" onClick={onClick}>
      <input type="checkbox" checked={checked} readOnly />
      <span className="checkmark"></span>
      <h3
        className="checkbox-label"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {children}
      </h3>
    </label>
  );
}
