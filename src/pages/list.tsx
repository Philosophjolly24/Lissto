// Imports
import { useEffect, useRef, useState } from "react";
import CheckBox from "../components/Checkbox";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburger";
import { useList } from "../components/useList";
import ContextMenu from "../components/ContextMenu";
import DialogueBox from "../components/DialogueBox";
// =============================================================//

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
// =============================================================//

// Main component
export default function List() {
  // hooks and states
  const currentList = localStorage.getItem("currentList");

  const { lists, deleteListItem, setDeleteListItem, setLists, getListTotal } =
    useList();
  const [isOpen, setOpen] = useState(false);
  const [storedItem, setStoredItem] = useState<Item | null>(null);
  const selectedList = lists.find(
    (list: List) => list.listName === currentList
  );
  const [items, setItems] = useState<Item[]>(
    () =>
      selectedList?.items.map((item: Item) => ({
        ...item,
        checked: item.checked ?? false,
      })) || []
  );
  const [contextMenuObject, setContextMenuObject] = useState<ContextMenuState>({
    position: { x: 0, y: 0 },
    toggled: false,
  });
  const contextMenuRef = useRef<HTMLMenuElement | null>(null);

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
  const navigate = useNavigate();

  // =============================================================//

  // handler functions

  // handles the context menu
  function handleOnContextMenu(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    e.preventDefault();
    const contextMenuAttr = contextMenuRef?.current
      ? contextMenuRef.current.getBoundingClientRect()
      : null;
    console.log(contextMenuAttr);

    const isLeft = e.pageX < window?.innerWidth / 2.5;

    if (!contextMenuAttr) return;

    let x;
    const y = e.pageY;

    if (isLeft) {
      x = e.pageX;
    } else {
      x = e.pageX - contextMenuAttr.width;
    }

    setContextMenuObject({ position: { x, y }, toggled: true });
  }

  // handles the items quantity change
  const handleQuantityChange = (index: number, value: number) => {
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

    const updatedLists = lists.map((list: List) => {
      if (list.listName === currentList) {
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
  };

  function handleAddToList() {
    navigate(`/search`);
  }

  // handle items checked states
  function handleItemCheck(index: number) {
    const updatedItems = items.map((item: Item, i: number) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    console.log(updatedItems);
    setItems(updatedItems);

    const updatedLists = lists.map((list: List) => {
      if (list.listName == selectedList?.listName) {
        return { ...list, items: updatedItems };
      }
      return list;
    });

    setLists(updatedLists);
  }

  function handleItemDelete() {
    if (!storedItem) return;
    const updatedItems = items.filter(
      (item: Item) => item.item.trim() !== storedItem.item.trim()
    );
    console.log(`deleted item is was:${storedItem.item}`);
    console.log(updatedItems);
    setItems(updatedItems);

    const updatedLists = lists.map((list: List) => {
      if (list.listName == selectedList?.listName) {
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
  }

  return (
    <>
      {deleteListItem ? (
        <DialogueBox
          dialogueMessage="This can’t be undone. Delete item from list?"
          onDelete={() => handleItemDelete()}
        ></DialogueBox>
      ) : (
        ""
      )}
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
            <h1 className="item-title">
              {selectedList?.listName.toUpperCase()}
            </h1>
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

          <ContextMenu
            contextMenuRef={contextMenuRef}
            isToggled={contextMenuObject.toggled}
            positionX={contextMenuObject.position.x}
            positionY={contextMenuObject.position.y}
            buttons={[
              {
                text: "Create Item",
                onClick: () => {
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
                text: "Remove Item",
                onClick: () => {
                  setDeleteListItem(true);
                  setContextMenuObject({
                    position: { x: 0, y: 0 },
                    toggled: false,
                  });
                },
                isSpacer: false,
              },
            ]}
          ></ContextMenu>

          {items?.map((item: Item, index: number) => {
            return (
              <li
                key={index}
                className={`list-item-checkbox ${
                  item.checked ? "checked" : false
                }`}
                onClick={() => {
                  // e.preventDefault();
                }}
                onContextMenu={(e) => {
                  setStoredItem(item);
                  handleOnContextMenu(e);
                }}
              >
                <CheckBox
                  onClick={(e) => {
                    handleItemCheck(index);

                    e.stopPropagation();
                  }}
                  checked={item.checked ? item.checked : false}
                >
                  <p className="list-product">{item.item}</p>
                </CheckBox>
                <div
                  className={`${
                    !item.checked
                      ? `price-quantity-container`
                      : `price-quantity-container checked`
                  }`}
                >
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
        <div className="total-section">
          <h2 className="total-title">List Total: </h2>
          <h2>
            R{getListTotal(currentList !== null ? currentList : "")?.toFixed(2)}{" "}
          </h2>
        </div>

        <div className="empty-space"></div>
        <button onClick={handleAddToList} className="fixed-button">
          Forgot Something?
        </button>
      </div>
    </>

    // // todo: add total
    // // todo: group items if there are multiple on the list, maybe this should be implemented on the search page when the user adds it to the list, idk
    // // todo: save check state
    // // todo: check out price and disable quantity input on check
    // // todo:allow list item deletion
    // todo: create download list image( decided to make the app a pwa)
  );
}
