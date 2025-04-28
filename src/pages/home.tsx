import "../styles/index.css";
import Lists from "../components/AllLists";
import HamburgerMenu from "../components/Hamburger";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
  const [isOpen, setOpen] = useState(false);

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
      <h2 className="home-sub-heading">Recently Saved</h2>

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
