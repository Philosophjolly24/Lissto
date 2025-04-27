interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SlideModal({
  isOpen,
  onClose,
  children,
}: SlideModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="slide-modal slide-modal-visible">{children}</div>
    </>
  );
}
