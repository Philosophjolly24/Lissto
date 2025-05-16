interface ContextMenuProps {
  contextMenuRef: React.RefObject<HTMLMenuElement | null>;
  isToggled: boolean;
  positionX: number;
  positionY: number;
  className?: string;
  buttons: {
    text: string;
    onClick: () => void;
    isSpacer: boolean;
  }[];
}

export default function ContextMenu({
  contextMenuRef,
  isToggled,
  positionX,
  positionY,
  buttons,
  className,
}: ContextMenuProps) {
  return (
    <menu
      ref={contextMenuRef}
      className={`context-menu ${isToggled ? "active" : "hidden"} ${className}`}
      style={{
        top: `${positionY}px`,
        left: `${positionX}px`,
        position: "absolute",
        zIndex: 1000,
      }}
    >
      {buttons.map((button, index) =>
        button.isSpacer ? (
          <hr key={index} />
        ) : (
          <div className="context-button" key={index} onClick={button.onClick}>
            {button.text}
          </div>
        )
      )}
    </menu>
  );
}
