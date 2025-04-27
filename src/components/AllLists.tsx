import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState } from "react";

import {
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
  Type,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

interface List {
  listName: string;
  id: string;
  description?: string;
  items: Item[];
}
interface Item {
  item: string;
  quantity: number;
  price: number;
}
export default function Lists() {
  const [currentList, setCurrentList] = useState<string | null>(null);

  const [allLists, setAllLists] = useState(() => {
    const listData = localStorage.getItem("myLists");
    return listData ? JSON.parse(listData) : [];
  });

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction onClick={() => console.info("Edit clicked")} Tag="div">
        <div className="swipe-button edit-button">
          <FiEdit2 size={20} />
        </div>
        {/* <img className="swipe-icon" src="/src/assets/rename.svg" alt="" /> */}
      </SwipeAction>
      <SwipeAction destructive={true} onClick={handleListDelete}>
        <div className="swipe-button delete-button">
          <FiTrash2 className=" icon-swipe" size={20} />
        </div>
      </SwipeAction>
    </TrailingActions>
  );

  function handleListDelete() {
    if (!currentList) return;

    const updatedLists = allLists.filter(
      (list: List) => list.listName !== currentList
    );
    setAllLists(updatedLists);
    localStorage.setItem("myLists", JSON.stringify(updatedLists));
  }


  // ! todo: make sure the all lists state is global use useContext on Monday


  return (
    <>
      <ul className="list-container">
        {allLists.map(
          (list: {
            listName: string;
            id: number;
            items: [];
            description: string;
            emoji: string;
          }) => {
            return (
              <SwipeableList fullSwipe={false} type={Type.IOS} key={list.id}>
                <SwipeableListItem
                  trailingActions={trailingActions()}
                  onSwipeStart={() => {
                    setCurrentList(list.listName);
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
                      <h2 className="list-name">{list.listName}</h2>
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
          }
        )}
      </ul>
    </>
  );
}
