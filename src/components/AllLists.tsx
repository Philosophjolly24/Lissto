// imports
import { Link } from "react-router-dom";
import { useList } from "./useList";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";
import ContextMenu from "./ContextMenu";
import DialogueBox from "./DialogueBox";
// ===========================================================//

// interfaces
interface Item {
  item: string;
  quantity: number;
  price: number;
  checked?: boolean;
}

interface List {
  listName: string;
  id: string;
  items: Item[];
  description: string;
  emoji: string;
}

interface ContextMenuState {
  position: { x: number; y: number };
  toggled: boolean;
}
// ===========================================================//

// main component
export default function Lists() {
  // importing list context
  const {
    lists,
    setEdit,
    deleteListItem,
    edit,
    setDeleteListItem,
    editList,
    deleteList,
  } = useList();

  // states
  const [title, setTitle] = useState<string>("w");
  const [description, setDescription] = useState<string>("d");
  const [currentListName, setCurrentListName] = useState<string>("d");
  const [contextMenuObject, setContextMenuObject] = useState<ContextMenuState>({
    position: { x: 0, y: 0 },
    toggled: false,
  });
  const contextMenuRef = useRef<HTMLMenuElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("currentList");
    setCurrentListName(!stored ? "" : stored);
    const currentList = lists.find((list) => list.listName === currentListName);
    if (currentList) {
      setTitle(currentList.listName);
      setDescription(currentList.description);
    }
  }, [edit, currentListName, lists]);

  // Methods and handler functions
  /**
   *Getting title and description of the selected list, and stores it in a state
   *
   */
  function getCurrentListInfo() {
    const stored = localStorage.getItem("currentList");
    setCurrentListName(!stored ? "" : stored);
    const currentList = lists.find(
      (list) => list.listName === currentListName.trim()
    );
    if (currentList) {
      setTitle(currentList.listName);
      setDescription(currentList.description);
    }
    console.log(title);
    console.log(description);
  }

  /**
   * Context menu handler function
   * @param {React.MouseEvent<HTMLHeadingElement, MouseEvent>} e
   */
  function handleOnContextMenu(
    e: React.MouseEvent<HTMLHeadingElement, MouseEvent>
  ) {
    e.preventDefault();
    setContextMenuObject({
      position: { x: e.pageX, y: e.pageY },
      toggled: true,
    });
    setTimeout(() => {
      const menu = contextMenuRef.current;
      if (!menu) return;
      const { width, height } = menu.getBoundingClientRect();
      const maxX = window.innerWidth - width * 1.8;
      const maxY = window.innerHeight - height;
      const x = Math.min(e.pageX - width / 2, maxX);
      const y = Math.min(e.pageY - height / 2, maxY);
      setContextMenuObject({
        position: { x, y },
        toggled: true,
      });
    }, 0);
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        contextMenuRef.current &&
        !contextMenuRef.current.contains(e.target as Node)
      ) {
        setContextMenuObject({ position: { x: 0, y: 0 }, toggled: false });
      }
    }
    document.addEventListener("click", handler);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);

  // Main component
  return (
    <>
      {deleteListItem ? (
        <DialogueBox
          dialogueMessage="This can’t be undone. Delete the list?"
          onDelete={() => deleteList(currentListName)}
        ></DialogueBox>
      ) : (
        ""
      )}
      <ContextMenu
        contextMenuRef={contextMenuRef}
        isToggled={contextMenuObject.toggled}
        positionX={contextMenuObject.position.x}
        positionY={contextMenuObject.position.y}
        buttons={[
          {
            text: "Update List",
            onClick: () => {
              setEdit(true);
              setContextMenuObject({
                position: { x: 0, y: 0 },
                toggled: false,
              });
            },
            isSpacer: false,
          },
          {
            text: "",
            onClick: () => {},
            isSpacer: true,
          },
          {
            text: "Remove List",
            onClick: () => {
              setContextMenuObject({
                position: { x: 0, y: 0 },
                toggled: false,
              });
              setDeleteListItem(true);
            },
            isSpacer: false,
          },
        ]}
      ></ContextMenu>
      {edit ? (
        <>
          <Modal
            className={"slide-modal edit-modal"}
            isOpen={edit}
            onClose={() => setEdit(false)}
          >
            <div className="edit-container">
              <div className="close">
                <h2 className="edit-text">Update Name</h2>
                <img
                  className="close"
                  onClick={() => {
                    setEdit(false);
                  }}
                  src="close-blue.svg"
                  alt=""
                />
              </div>
              <input
                className="edit-list-name"
                type="text"
                name=""
                id=""
                defaultValue={title}
                onChange={(e) => {
                  e.preventDefault();
                  setTitle(e.target.value);
                }}
              />
              <div className="scroll-container">
                <h2 className="edit-text">Update Description</h2>
                <textarea
                  className="edit-list-description"
                  name=""
                  id=""
                  defaultValue={description}
                  onChange={(e) => {
                    e.preventDefault();
                    setDescription(e.target.value);
                  }}
                />
                <button
                  className="border-primary-btn create-list-btn"
                  onClick={() => {
                    editList(
                      { listName: title, description: description },
                      currentListName
                    );
                    setEdit(false);
                  }}
                >
                  save changes
                </button>
              </div>
            </div>
          </Modal>
        </>
      ) : (
        ""
      )}
      <ul className="list-container">
        {lists.map((list: List, i: number) => {
          return (
            // <li>
            <Link
              key={i}
              className="list-item"
              to="/list"
              onClick={() => {
                localStorage.setItem("currentList", list.listName);
              }}
            >
              <div className="emoji">{list.emoji}</div>
              <div className="list-name-description-section">
                <h2
                  className="list-name"
                  onContextMenu={(e) => {
                    e.stopPropagation();
                    localStorage.setItem("currentList", list.listName);
                    setCurrentListName(list.listName);
                    getCurrentListInfo();
                    handleOnContextMenu(e);
                  }}
                >
                  {list.listName.slice(0, 1).toUpperCase() +
                    list.listName.slice(1)}
                </h2>
                <p className="description">
                  {list.description.trim() == ""
                    ? ""
                    : list.description.length >= 35
                    ? list.description.slice(0, 1).toUpperCase() +
                      list.description.slice(1, 35) +
                      "..."
                    : list.description.slice(0, 1).toUpperCase() +
                      list.description.slice(1)}
                </p>
              </div>
              <img className="cheveron" src="cheveron-right.svg" />
            </Link>
            // </li>
          );
        })}
      </ul>
      <div className="empty-space"></div>
    </>
  );
}
