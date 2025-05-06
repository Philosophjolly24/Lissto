// Imports
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburger";
import { useList } from "../components/useList";
import "emoji-picker-element";
import { v4 as uuidv4 } from "uuid";

// ================================================= //

export default function Create() {
  // states & hooks
  const [listName, setListName] = useState("");
  const [text, setText] = useState("🛒");
  const [listDescription, setListDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lists, addList } = useList();

  // Handler functions

  /**
   * handles the create button click event
   *
   * @param {string} listName
   * @param {string} description
   */
  function handleClick(listName: string, description: string) {
    localStorage.setItem("currentList", listName);
    const trimmedName = listName.trim();
    console.log(trimmedName);
    if (trimmedName === "") {
      console.error();
      setError("Fields may not be empty");
      return;
    }

    for (const list of lists) {
      if (list.listName === trimmedName) {
        setError("A list with that name already exists");
        return;
      }
    }

    const newList = {
      listName: trimmedName,
      id: uuidv4(),
      description: description,
      items: [],
      emoji: text,
    };

    addList(newList);
    navigate(`/search`);
  }

  // Emoji picker logic
  useEffect(() => {
    const emojiPicker = document.querySelector("emoji-picker");

    const handleEmojiSelect = (event: CustomEvent) => {
      const emoji = event.detail.unicode;
      setText(emoji);
    };

    emojiPicker?.addEventListener(
      "emoji-click",
      handleEmojiSelect as EventListener
    );

    return () => {
      emojiPicker?.removeEventListener(
        "emoji-click",
        handleEmojiSelect as EventListener
      );
    };
  }, []);

  // Functional component
  return (
    <div className="overlay">
      <div className="title-hamburger-container">
        <HamburgerMenu
          toggled={isOpen}
          toggle={setOpen}
          direction="left"
          color={isOpen ? "#fff" : "#05769e"}
          distance="lg"
        />
        <h1 className="item-title">Got a New List?</h1>
      </div>

      {isOpen && (
        <nav className={isOpen ? "show-nav" : "show-nav"}>
          {
            <>
              <ul className="navbar-section">
                <li className="navbar-item" onClick={() => navigate("/")}>
                  Home
                </li>
                <li
                  className="navbar-item"
                  onClick={() => navigate("/create-list")}
                >
                  Create List
                </li>
              </ul>
            </>
          }
        </nav>
      )}

      <div className="modal-window">
        <div className="create-list-container">
          <h3>Give it a name</h3>
          <input
            className="input-field"
            type="text"
            name="list-name"
            id="list-name"
            value={listName}
            onChange={(e) => {
              e.preventDefault();
              setListName(e.target.value);
            }}
            required
          />
          {error && <p className="error">{error}</p>}
          <h3>Add a short description</h3>
          <textarea
            name="description"
            id="description"
            className="description-field"
            onChange={(e) => {
              e.preventDefault();
              setListDescription(e.target.value);
            }}
          ></textarea>
          <h3>Choose an Icon</h3>
          {
            // @ts-expect-error ignore below
            <emoji-picker
              class="light"
              emoji-version="15.0"
              search-placeholder="Search for emoji"
              style={{ width: "100%", height: "300px", margin: " 20px auto" }}
              show-preview="false"
              //@ts-expect-error ignore  below
            ></emoji-picker>
          }
          <p className="emoji-default">Your list icon is: {text}</p>
          <button
            className="border-primary-btn create-list-btn"
            onClick={() => handleClick(listName, listDescription)}
          >
            Let’s Make It
          </button>
        </div>
      </div>
    </div>
  );
}
