import Modal from "./Modal";
import { useList } from "./useList";

export default function DialogueBox() {
  const { deleteListItem, setDeleteListItem, deleteList } = useList();
  const stored = localStorage.getItem("currentList");
  const currentList = stored ? stored : "";
  return (
    <Modal className="dialogue-box" isOpen={deleteListItem}>
      <div>
        <p className="dialogue-message">
          This can’t be undone. Delete the list?
        </p>
        <div className="button-container">
          <button
            className="dialogue-button"
            onClick={() => {
              deleteList(currentList);
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
