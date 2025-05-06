import { createContext, useState, useEffect, ReactNode } from "react";

// Interfaces
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

interface ListEdit {
  listName: string;
  description: string;
  emoji?: string;
}

interface ListContextType {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  edit: boolean;
  setEdit: React.Dispatch<React.SetStateAction<boolean>>;
  deleteListItem: boolean;
  setDeleteListItem: React.Dispatch<React.SetStateAction<boolean>>;
  updateList: (updatedList: List) => void;
  addList: (newList: List) => void;
  deleteList: (currentListName: string) => void;
  addItem: (listName: string, itemList: Item) => void;
  getListTotal: (listName: string) => number;
  editList: (editedList: ListEdit, listName: string) => void;
  itemCreate: (ListName: string, itemName: string, price: string) => void;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
}
// =============================================== //

// constants
const ListContext = createContext<ListContextType | undefined>(undefined);

/**
 * Retrieves the initial data of "myLists" from localstorage
 */
function initialList() {
  const storedLists = localStorage.getItem("myLists");
  const lists = storedLists !== null ? JSON.parse(storedLists) : [];
  return lists;
}

export const ListProvider = ({ children }: { children: ReactNode }) => {
  // initialing states
  const [lists, setLists] = useState<List[]>(initialList());
  const [edit, setEdit] = useState(false);
  const [deleteListItem, setDeleteListItem] = useState(false);
  const currentList = localStorage.getItem("currentList");
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

  // Initialize lists from localStorage on mount
  useEffect(() => {
    const storedLists = localStorage.getItem("myLists");
    if (storedLists) {
      setLists(JSON.parse(storedLists));
    }
  }, []);

  // Sync the lists state with localStorage
  useEffect(() => {
    if (lists.length >= 0) {
      localStorage.setItem("myLists", JSON.stringify(lists));
    }
  }, [lists]);

  // syncing setItems on list change
  useEffect(() => {
    const currentList = localStorage.getItem("currentList");
    const updatedList = lists.find((list) => list.listName === currentList);
    if (updatedList) {
      setItems(updatedList.items);
    }
  }, [lists]);

  /**
   * Update specific list in myList
   *
   * @param {List} updatedList
   */
  function updateList(updatedList: List) {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  }

  /**
   * Add a list to myLists
   *
   * @param {List} newList
   */
  function addList(newList: List) {
    setLists((prevLists) => [...prevLists, newList]);
  }

  /**
   *Removes a specific list
   *
   * @param {string} currentListName
   */
  function deleteList(currentListName: string) {
    const updatedLists = lists.filter(
      (list: List) => list.listName !== currentListName
    );
    setLists(updatedLists);
    localStorage.setItem("myLists", JSON.stringify(lists));
  }

  /**
   *Add an item to a specific list
   *
   * @param {string} listName
   * @param {Item} itemToAdd
   */
  function addItem(listName: string, itemToAdd: Item) {
    const updatedLists = lists.map((list: List) => {
      if (list.listName === listName.trim()) {
        // Check if item already exists
        const existingItem = list.items.find(
          (item) => item.item === itemToAdd.item
        );

        if (existingItem) {
          // If it exists, merge quantity and price
          const updatedItems = list.items.map((item) => {
            if (item.item === itemToAdd.item) {
              return {
                ...item,
                quantity: item.quantity + itemToAdd.quantity,
                price: item.price + itemToAdd.price,
              };
            }
            return item;
          });

          return {
            ...list,
            items: updatedItems,
          };
        } else {
          // If it doesn't exist, just add it
          return {
            ...list,
            items: [...list.items, itemToAdd],
          };
        }
      }
      return list;
    });
    setLists(updatedLists);
  }

  /**
   *Calculates the total of all the items on the current list
   *
   * @param {string} currentListName
   */
  function getListTotal(currentListName: string) {
    let total = 0;
    for (const list of lists) {
      if (list.listName === currentListName.trim()) {
        for (const item of list.items) {
          total += item.price;
        }
      }
    }
    return total;
  }
  /**
   *Edit the current lists title and description (emoji modification will be supported later)
   *
   * @param {ListEdit} editedList
   * @param {string} currentListName
   */
  function editList(editedList: ListEdit, currentListName: string) {
    // field validation
    if (editedList.listName.trim() === "") {
      console.error("Fields may not be empty");
      return;
    }

    // checks if the a list with that name already exists
    for (const list of lists) {
      if (
        list.listName == editedList.listName &&
        list.listName !== currentListName
      ) {
        console.error("a list with that name already exists");
        return;
      }
    }

    // updates list information
    const updatedList = lists.map((list: List) => {
      if (list.listName === currentListName.trim()) {
        list.listName = editedList.listName;
        list.description = editedList.description;
      }
      return list;
    });
    setLists(updatedList);
  }
  /**
   * Add a custom item to a specified list
   *
   * @param {string} listName
   * @param {string} itemName
   * @param {string} price
   */
  function itemCreate(listName: string, itemName: string, price: string) {
    // make sure fields are not empty
    if (itemName.trim() === "" || price.trim() === "") {
      console.error("fields may not be empty");
      return;
    }

    // adds the items to list
    addItem(listName, {
      item: itemName,
      quantity: 1,
      price: Number(price),
      checked: false,
    });
  }

  return (
    <ListContext.Provider
      value={{
        lists,
        setLists,
        updateList,
        addList,
        deleteList,
        addItem,
        getListTotal,
        edit,
        setEdit,
        editList,
        deleteListItem,
        setDeleteListItem,
        itemCreate,
        items,
        setItems,
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListContext;
