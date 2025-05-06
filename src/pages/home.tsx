// Imports
import "../styles/index.css";
import Lists from "../components/AllLists";
import HamburgerMenu from "../components/Hamburger";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useList } from "../components/useList";
// ================================================= //

export default function Home() {
  // States and hooks
  const [isOpen, setOpen] = useState(false);
  const { lists } = useList();
  const navigate = useNavigate();

  return (
    <>
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

      <div className="home-container">
        {isOpen && (
          <nav className={isOpen ? "show-nav" : "show-nav"}>
            {
              <>
                <ul className="navbar-section">
                  <li className="navbar-item">
                    <a onClick={() => navigate("/")}>Home</a>
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
          className="fixed-button"
        >
          + Create a list
        </button>
      </div>
    </>
  );
}
