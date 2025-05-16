// Imports
import { useEffect, useRef, useState } from "react";
import CheckBox from "../components/Checkbox";
import { useNavigate } from "react-router-dom";
import HamburgerMenu from "../components/Hamburger";
import { useList } from "../components/useList";
import ContextMenu from "../components/ContextMenu";
import DialogueBox from "../components/DialogueBox";
import Modal from "../components/Modal";
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

export default function List() {
  // Hooks and states
  const currentList = localStorage.getItem("currentList");
  const {
    lists,
    deleteListItem,
    setDeleteListItem,
    setLists,
    getListTotal,
    itemCreate,
    items,
    setItems,
  } = useList();
  const [isOpen, setOpen] = useState(false);
  const [storedItem, setStoredItem] = useState<Item | null>(null);
  const [createItem, setCreateItem] = useState<boolean>(false);
  const [itemName, setItemName] = useState<string | null>(null);
  const [itemPrice, setItemPrice] = useState<string | null>(null);
  const selectedList = lists.find(
    (list: List) => list.listName === currentList
  );

  const [contextMenuObject, setContextMenuObject] = useState<ContextMenuState>({
    position: { x: 0, y: 0 },
    toggled: false,
  });
  const contextMenuRef = useRef<HTMLMenuElement | null>(null);

  // context menu logic
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

    return () => {
      document.removeEventListener("click", handler);
    };
  }, []);
  const navigate = useNavigate();

  // =============================================================//

  // handler functions

  /**
   *Handles the right click event on list element
   *
   * @param {React.MouseEvent<HTMLLIElement, MouseEvent>} e
   */
  function handleOnContextMenu(e: React.MouseEvent<HTMLLIElement, MouseEvent>) {
    e.preventDefault();
    const contextMenuAttr = contextMenuRef?.current
      ? contextMenuRef.current.getBoundingClientRect()
      : null;

    const isLeft = e.pageX < window?.innerWidth / 2.5;

    if (!contextMenuAttr) return;

    let x;
    const y = e.pageY - 40;

    if (isLeft) {
      x = e.pageX - 100;
    } else {
      x = e.pageX - 200;
    }

    setContextMenuObject({ position: { x, y }, toggled: true });
  }

  // handles the items quantity change

  /**
   *Handles the lists items quantity change
   *
   * @param {number} index
   * @param {number} value
   */
  const handleQuantityChange = (index: number, value: number) => {
    const currentListName = localStorage.getItem("currentList");
    if (!currentListName) return;

    const updatedLists = lists.map((list: List) => {
      if (list.listName !== currentListName) return list;

      const updatedItems = [...list.items];
      const currentItem = updatedItems[index];
      if (!currentItem) return list;

      // Get original price from product data (if available)
      const rawProductData = localStorage.getItem("productData");
      const productData: { Item: string; Price: number }[] = rawProductData
        ? JSON.parse(rawProductData)
        : [];

      const matchedProduct = productData.find(
        (product) => product.Item === currentItem.item
      );

      // Use original unit price if product exists, else use item's current unit price
      const unitPrice = matchedProduct
        ? +matchedProduct.Price.toString().replace(",", ".")
        : currentItem.price / currentItem.quantity;

      updatedItems[index] = {
        ...currentItem,
        quantity: value,
        price: parseFloat((unitPrice * value).toFixed(2)),
      };

      return {
        ...list,
        items: updatedItems,
      };
    });
    setLists(updatedLists);

    const currentList = updatedLists.find(
      (l) => l.listName === currentListName
    );
    if (currentList) setItems(currentList.items);
  };

  function handleAddToList() {
    navigate(`/search`);
  }

  /**
   *Handles the items checked state
   *
   * @param {number} index
   */
  function handleItemCheck(index: number) {
    const updatedItems = items.map((item: Item, i: number) => {
      if (i === index) {
        return { ...item, checked: !item.checked };
      }
      return item;
    });
    setItems(updatedItems);

    const updatedLists = lists.map((list: List) => {
      if (list.listName == selectedList?.listName) {
        return { ...list, items: updatedItems };
      }
      return list;
    });

    setLists(updatedLists);
  }

  /**
   *Handles list item delete
   *
   */
  function handleItemDelete() {
    if (!storedItem) return;

    const updatedItems = items.filter(
      (item: Item) => item.item.trim() !== storedItem.item.trim()
    );

    setItems(updatedItems);

    const updatedLists = lists.map((list: List) => {
      if (list.listName == selectedList?.listName) {
        return { ...list, items: updatedItems };
      }
      return list;
    });
    setLists(updatedLists);
  }
  const [tempQuantities, setTempQuantities] = useState<(string | undefined)[]>(
    []
  );

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
            className="context-menu-item"
            contextMenuRef={contextMenuRef}
            isToggled={contextMenuObject.toggled}
            positionX={contextMenuObject.position.x}
            positionY={contextMenuObject.position.y}
            buttons={[
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

          {items.map((item: Item, index: number) => {
            return (
              <li
                key={index}
                className={`list-item-checkbox ${
                  item.checked ? "checked" : false
                }`}
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
                    type="number"
                    min="1"
                    value={
                      tempQuantities[index] ?? items[index].quantity.toString()
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      const numberVal = +val;

                      // Temporarily store empty value
                      const newTemps = [...tempQuantities];
                      newTemps[index] = val;
                      setTempQuantities(newTemps);

                      // Only commit to the item state when the input is a valid number
                      if (/^[1-9]\d*$/.test(val)) {
                        handleQuantityChange(index, numberVal);

                        // Clean up temp value
                        newTemps[index] = undefined;
                        setTempQuantities(newTemps);
                      }
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
        <div className="create-list-item" onClick={() => setCreateItem(true)}>
          <img src="create item.svg" alt="" />
        </div>

        <div className="empty-space"></div>
        <button onClick={handleAddToList} className="fixed-button">
          Forgot Something?
        </button>
      </div>
      <Modal
        isOpen={createItem}
        onClose={() => {
          setCreateItem(false);
        }}
        className="slide-modal"
      >
        <h2 className="create-item-title">Item Name</h2>
        <input
          className="item-name-field"
          type="text"
          defaultValue={itemName !== null ? itemName : ""}
          onChange={(e) => {
            setItemName(e.target.value);
          }}
        />
        <h2 className="create-item-title">{`Price(R)`}</h2>
        <input
          className="item-price-field"
          type="numeric"
          pattern="[1-9][0-9]*"
          onChange={(e) => {
            setItemPrice(e.target.value);
          }}
        />
        <button
          onClick={() => {
            itemCreate(
              currentList !== null ? currentList : "",
              itemName !== null ? itemName : "",
              itemPrice !== null ? itemPrice : ""
            );
            setCreateItem(false);
            setItems(selectedList ? selectedList.items : []);
          }}
        >
          Add item to list
        </button>
      </Modal>
    </>
  );
}
