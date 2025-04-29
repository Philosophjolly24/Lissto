interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className: string;
}

export default function Modal({
  isOpen,
  onClose,
  children,
  className,
}: ModalProps) {
  if (!isOpen) return null;
  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className={className}>{children}</div>
    </>
  );
}
