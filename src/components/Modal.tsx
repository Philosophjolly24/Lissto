interface ModalProps {
  isOpen: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className: string;
}
/**
 * Slide Component
 *
 * @param {ModalProps} {
 *   isOpen,
 *   onClose,
 *   children,
 *   className,
 * }
 */
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
