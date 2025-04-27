import { useState } from "react";
import CheckBox from "../components/Checkbox";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburger";

interface List {
  listName: string;
  id: string;
  description?: string;
  items: Items[];
}
interface Items {
  item: string;
  quantity: number;
  price: number;
}

export default function List() {
  const listData = localStorage.getItem("myLists");
  const allLists = listData !== null ? JSON.parse(listData) : [];
  const currentList = localStorage.getItem("currentList");
  // const ProductData = localStorage.getItem("productData");
  // const ProductList = ProductData !== null ? JSON.parse(ProductData) : [];

  const selectedList = allLists.find(
    (list: List) => list.listName === currentList
  );

  const [items, setItems] = useState<Items[]>(
    () => selectedList?.items.map((item: Items) => item) || []
  );

  const handleQuantityChange = (index: number, value: number) => {
    const listData = localStorage.getItem("myLists");
    const allLists: List[] = listData ? JSON.parse(listData) : [];

    const currentList = localStorage.getItem("currentList");

    const updatedItems = [...items];
    const currentItem = updatedItems[index];

    const rawProductData = localStorage.getItem("productData");
    const ProductList: { Item: string; Price: number }[] = rawProductData
      ? JSON.parse(rawProductData)
      : [];

    //* selected product is not producing results(fixed)
    const selectedProduct = ProductList.find(
      (product: { Item: string; Price: number }) =>
        product.Item == currentItem.item
    );

    if (!selectedProduct) {
      console.error("Original product not found");
      return;
    }

    const unitItemPrice = +selectedProduct.Price.toString().replace(",", ".");

    updatedItems[index] = {
      item: currentItem.item,
      quantity: value,
      price: parseFloat((unitItemPrice * value).toFixed(2)),
    };

    setItems(updatedItems);

    const updatedLists = allLists.map((list: List) => {
      if (list.listName === currentList) {
        return { ...list, items: updatedItems };
      }
      return list;
    });

    localStorage.setItem("myLists", JSON.stringify(updatedLists));
  };
  const navigate = useNavigate();
  function handleAddToList() {
    navigate(`/search`);
  }
  const [isOpen, setOpen] = useState(false);

  return (
    <div className="list-item-product-container">
      <ul className="list-product-container">
        <div className="title-hamburger-container">
          <HamburgerMenu
            toggled={isOpen}
            toggle={setOpen}
            direction="left"
            color={isOpen ? "#fff" : "#05769e"}
            distance="lg"
          />
          <h1 className="item-title">{selectedList.listName.toUpperCase()}</h1>
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
                    onClick={() => navigate("/search")}
                  >
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

        {items?.map((item: Items, index: number) => {
          return (
            <li key={index} className="list-item-checkbox">
              <CheckBox>
                <p className="list-product">{item.item}</p>
              </CheckBox>
              <div className="price-quantity-container">
                <input
                  className="item-product-quantity"
                  type="text"
                  inputMode="numeric" // tells mobile devices to show a number pad
                  pattern="[1-9][0-9]*"
                  value={
                    items[index].quantity === 0 ? "" : items[index].quantity
                  }
                  onChange={(e) => {
                    handleQuantityChange(index, +e.target.value);
                  }}
                />
                <p className="item-product-price">
                  R{items[index].price.toFixed(2)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
      <button
        onClick={handleAddToList}
        className="border-primary-btn add-product"
      >
        Forgot Something?
      </button>
    </div>

    // todo: save check state
    // todo: add total
    // todo: check out price and disable quantity input on check
    //todo: group items if there are multiple on the list, maybe this should be implemented on the search page when the user adds it to the list, idk
  );
}
