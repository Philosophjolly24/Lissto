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
  const { lists, deleteList } = useList();

  // swipe button action logic
  const trailingActions = (listName: string) => (
    <TrailingActions>
      <SwipeAction onClick={() => console.info("Edit clicked")} Tag="div">
        <div className="swipe-button edit-button">
          <FiEdit2 size={20} />
        </div>
      </SwipeAction>
      <SwipeAction
        destructive={true}
        onClick={() => {
          deleteList(listName);
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
      <ul className="list-container">
        {lists.map((list: List, _index, lists) => {
          return (
            <SwipeableList fullSwipe={false} type={Type.IOS} key={list.id}>
              <SwipeableListItem
                trailingActions={trailingActions(list.listName)}
                onSwipeStart={() => {}}
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
                      {lists.length > 0
                        ? list.listName
                        : "No lists? let make some!"}
                    </h2>
                    <p className="description">
                      {list.description.trim() == ""
                        ? ""
                        : list.description.length >= 35
                        ? list.description.slice(0, 1).toUpperCase() +
                          list.description.slice(1, 35) +
                          "..."
                        : list.description.slice(0, 1).toUpperCase() +
                          list.description.slice(1, 35)}
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
    </>
  );
}
