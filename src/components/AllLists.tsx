// imports
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";
import { useList } from "./useList";
import Modal from "./Modal";
import { useEffect, useState } from "react";
import DialogueBox from "./DialogueBox";

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

// All lists component
export default function Lists() {
  // importing list context
  const { lists, deleteListItem, setDeleteListItem, setEdit, edit, editList } =
    useList();
  // states
  const [title, setTitle] = useState<string>("w");
  const [description, setDescription] = useState<string>("d");
  const [currentListName, setCurrentListName] = useState<string>("d");

  useEffect(() => {
    const stored = localStorage.getItem("currentList");
    setCurrentListName(!stored ? "" : stored);
    const currentList = lists.find((list) => list.listName === currentListName);
    if (currentList) {
      setTitle(currentList.listName);
      setDescription(currentList.description);
    }
  }, [edit, currentListName, lists]);

  function getCurrentListInfo() {
    const stored = localStorage.getItem("currentList");
    setCurrentListName(!stored ? "" : stored);
    const currentList = lists.find((list) => list.listName === currentListName);
    if (currentList) {
      setTitle(currentList.listName);
      setDescription(currentList.description);
    }
  }
  // swipe button action logic
  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction onClick={() => setEdit(true)} Tag="div">
        <div className="swipe-button edit-button">
          <FiEdit2 size={20} />
        </div>
      </SwipeAction>
      <SwipeAction
        destructive={false}
        onClick={() => {
          // show delete modal
          setDeleteListItem(true);
        }}
      >
        <div className="swipe-button delete-button">
          <FiTrash2 className=" icon-swipe" size={20} />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  // Main component
  return (
    <>
      {deleteListItem ? <DialogueBox></DialogueBox> : ""}
      {edit ? (
        <>
          <Modal
            className={"slide-modal slide-modal-visible edit-modal"}
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
                  src="/src/assets/close-blue.svg"
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
        {lists.map((list: List) => {
          return (
            <SwipeableList fullSwipe={false} type={Type.IOS} key={list.id}>
              <SwipeableListItem
                trailingActions={trailingActions()}
                onSwipeStart={() => {
                  localStorage.setItem("currentList", list.listName);
                  getCurrentListInfo();
                }}
                maxSwipe={0.4}
              >
                <Link
                  className="list-item"
                  to="/list"
                  onClick={() => {
                    localStorage.setItem("currentList", list.listName);
                  }}
                >
                  <div className="emoji">{list.emoji}</div>
                  <div className="list-name-description-section">
                    <h2 className="list-name">
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

                  <img
                    className="cheveron"
                    src="/src/assets/cheveron-right.svg"
                  />
                </Link>
              </SwipeableListItem>
            </SwipeableList>
          );
        })}
      </ul>
      <div className="empty-space"></div>
    </>
  );
}
