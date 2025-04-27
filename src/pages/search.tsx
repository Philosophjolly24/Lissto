// imports
import { useState, useEffect, useRef } from "react";
import CustomSelect from "../components/dropbox";
import SlideModal from "../components/SlideModal";
import { addItem } from "../scripts/script";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburger";

interface List {
  listName?: string;
  id: string;
  items: Item[];
}
interface Item {
  item: string;
  quantity: number;
  price: number;
}

export default function Search() {
  // state declarations
  const [count, setCount] = useState(1);
  const [price, setPrice] = useState(0);
  const [items, setItems] = useState<{ Item: string; Price: string }[]>([]);
  const [query, setQuery] = useState("");
  const [itemCount, setItemCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<null | {
    Item: string;
    Price: string;
  }>(null);

  // interfaces and constants
  interface Item {
    item: string;
    quantity: number;
    price: number;
  }
  const inputRef = useRef<HTMLInputElement>(null);
  const storedName = localStorage.getItem("currentList") || " ";
  const totalPrice = (price * count).toFixed(2);

  // Getting productData from localStorage
  useEffect(() => {
    const productData = localStorage.getItem("productData");
    const products = productData ? JSON.parse(productData) : [];
    const storedName = localStorage.getItem("currentList") || " ";
    const validProducts = products.filter((item: Item) => item.item !== "");
    setItems(validProducts);
    console.log(storedName);
  }, []);

  useEffect(() => {
    //getting count of items in list
    const storedName = localStorage.getItem("currentList") || " ";
    const storedList = localStorage.getItem("myLists");
    const myLists: List[] = storedList !== null ? JSON.parse(storedList) : [];

    const selected = myLists.find((list: List) => list.listName == storedName);
    setItemCount(selected ? selected.items.length : 0);
  }, []);

  function getItemCount() {
    const storedName = localStorage.getItem("currentList") || " ";
    const storedList = localStorage.getItem("myLists");
    const myLists: List[] = storedList !== null ? JSON.parse(storedList) : [];

    const selected = myLists.find((list: List) => list.listName == storedName);
    setItemCount(selected ? selected.items.length : 0);
  }

  // checking quantity in list

  // creating item filter for searching
  const filteredItems = items.filter((item) =>
    item.Item.toLowerCase().includes(query.toLowerCase())
  );

  // handler Functions
  const handleProductClick = (product: { Item: string; Price: string }) => {
    setSelectedProduct(product);
    setPrice(+product.Price.replace(",", "."));
  };

  const onAddToList = () => {
    if (!selectedProduct) return;

    addItem(storedName, {
      item: selectedProduct.Item,
      quantity: count,
      price: +(price * count).toFixed(2),
    });

    setSelectedProduct(null);
    setCount(1);
    setQuery("");
  };
  const navigate = useNavigate();
  const [isOpen, setOpen] = useState(false);

  // main component
  return (
    <>
      {/* view cart button */}
      {/*Note: react can't run if statements in jsx, so use conditional loops*/}
      {itemCount > 0 && (
        <button
          className="view-items"
          onClick={() => {
            // handle showing cart modal or navigating to cart page
            navigate(`/list`);
          }}
        >
          See What’s On It ({itemCount})
        </button>
      )}
      <div className="title-hamburger-container">
        <HamburgerMenu
          toggled={isOpen}
          toggle={setOpen}
          direction="left"
          color={isOpen ? "#fff" : "#05769e"}
          distance="lg"
        />
        <h1 className="item-title">Search The List</h1>
      </div>
      {isOpen && (
        <nav className={isOpen ? "show-nav" : "show-nav"}>
          {
            <>
              <ul className="navbar-section">
                <li className="navbar-item" onClick={() => navigate("/")}>
                  Home
                </li>
                <li className="navbar-item" onClick={() => navigate("/search")}>
                  Search
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
      <p className="store-select">
        Store
        <CustomSelect>
          <option value="Giant Hyper">Giant Hyper</option>
          {/* <option value="Pick and Pay">Pick and Pay</option> */}
        </CustomSelect>
      </p>
      <input
        ref={inputRef}
        value={query.trim()}
        onChange={(e) => setQuery(e.target.value)}
        className="search-field"
        type="text"
        placeholder="Start typing..."
        id="search-field"
      />
      <ul className="product-list">
        {filteredItems.map((product, index) => (
          <li
            key={index}
            className="product"
            onClick={() => {
              handleProductClick(product);
            }}
          >
            <h2 className="title">{product.Item}</h2>
            <div className="container">
              <h2 className="price">R{product.Price}</h2>
              <img
                className="cheveron"
                src="/src/assets/cheveron-right.svg"
                alt=""
              />
            </div>
          </li>
        ))}
      </ul>
      <SlideModal
        isOpen={!!selectedProduct}
        onClose={() => {
          setSelectedProduct(null);
          setCount(1);
        }}
      >
        <div className="title-section">
          <h3 className="modal-item">{selectedProduct?.Item}</h3>
          <img
            className="close"
            src="/src/assets/close.svg"
            alt=""
            onClick={() => {
              setSelectedProduct(null);
              setCount(1);
            }}
          />
        </div>

        <h3 className="modal-price">R{totalPrice}</h3>

        <div className="item-quantity">
          <img
            className="icon"
            src="/src/assets/minus.svg"
            alt=""
            onClick={() => {
              setCount(count - 1);
            }}
          />
          <input
            type="text"
            className="quantity-input"
            inputMode="numeric" // tells mobile devices to show a number pad
            pattern="[1-9][0-9]*"
            value={count === 0 ? "" : count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
          <img
            className="icon"
            src="/src/assets/plus.svg"
            alt=""
            onClick={() => {
              setCount(count + 1);
            }}
          />
        </div>

        <button
          onClick={() => {
            onAddToList();
            getItemCount();
          }}
        >
          Add {count} items @ R{totalPrice}
        </button>
      </SlideModal>
    </>
    // todo: add more items to the giant excel list
  );
}
