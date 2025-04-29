import "../styles/index.css";
import Lists from "../components/AllLists";
import HamburgerMenu from "../components/Hamburger";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useList } from "../components/useList";


export default function Home() {
  const [isOpen, setOpen] = useState(false);

  const { lists } = useList();
  const navigate = useNavigate();
  return (
    <>
      {/* {edit ? (
        <>
          <SlideModal
            className={"slide-modal slide-modal-visible edit-modal"}
            isOpen={edit}
            onClose={() => setEdit(false)}
          >
            <div className="edit-container">
              <div className="close">
                <h2 className="edit-text">Update Name</h2>
                <img
                  className="close"
                  onClick={() => setEdit(false)}
                  src="/src/assets/close-blue.svg"
                  alt=""
                />
              </div>
              <input className="edit-list-name" type="text" name="" id="" />
              <div className="scroll-container">
                <h2 className="edit-text">Update Description</h2>
                <textarea className="edit-list-description" name="" id="" />
                <h2 className="edit-text">Add an Icon:</h2>
                {
                  // @ts-expect-error ignore below
                  <emoji-picker
                    class="light"
                    emoji-version="15.0"
                    search-placeholder="Search for emoji"
                    style={{
                      width: "100%",
                      height: "250px",
                      margin: " 10px 0  20px 0",
                    }}
                    show-preview="false"
                    //@ts-expect-error ignore  below
                  ></emoji-picker>
                }
                <button className="border-primary-btn create-list-btn">
                  save changes
                </button>
              </div>
            </div>
          </SlideModal>
        </>
      ) : (
        ""
      )} */}
      <div className="title-hamburger-container">
        <HamburgerMenu
          toggled={isOpen}
          toggle={setOpen}
          direction="left"
          color={isOpen ? "#fff" : "#05769e"}
          distance="lg"
        />
        <h1 className="item-title">Organize. Shop. Done.</h1>
      </div>
      {isOpen && (
        <nav className={isOpen ? "show-nav" : "show-nav"}>
          {
            <>
              <ul className="navbar-section">
                <li className="navbar-item">
                  <a onClick={() => navigate("/")}>Home</a>
                </li>

                <li className="navbar-item">
                  <a className="nav-link" onClick={() => navigate("/search")}>
                    Search
                  </a>
                </li>

                <li className="navbar-item">
                  <a
                    className="nav-link"
                    onClick={() => navigate("/create-list")}
                  >
                    Create List
                  </a>
                </li>
              </ul>
            </>
          }
        </nav>
      )}
      <h2 className="home-sub-heading">
        {lists.length > 0 ? `Recently Saved` : `No lists? Let's make some!`}
      </h2>

      <Lists></Lists>
      <button
        onClick={() => navigate("/create-list")}
        className="border-primary-btn add-product"
      >
        + Create a list
      </button>
    </>
    // todo: shorten the title name if it is too long
    // todo: create list management modal(add,delete,rename)
    // todo: optional(download list) TBD
  );
}
