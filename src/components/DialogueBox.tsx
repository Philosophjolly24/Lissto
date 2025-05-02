import Modal from "./Modal";
import { useList } from "./useList";
interface dialogueBoxProps {
  dialogueMessage: string;
  onDelete: () => void;
}

export default function DialogueBox({
  dialogueMessage,
  onDelete,
}: dialogueBoxProps) {
  const { deleteListItem, setDeleteListItem } = useList();
  // const stored = localStorage.getItem("currentList");
  // const currentList = stored ? stored : "";
  return (
    <Modal className="dialogue-box" isOpen={deleteListItem}>
      <div>
        <p className="dialogue-message">{dialogueMessage}</p>
        <div className="button-container">
          <button
            className="dialogue-button"
            onClick={() => {
              {
                onDelete();
              }
              //  { deleteList(currentList);}
              setDeleteListItem(false);
            }}
          >
            Remove
          </button>
          <button
            className="dialogue-button"
            onClick={() => setDeleteListItem(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
