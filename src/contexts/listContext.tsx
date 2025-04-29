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
}

// constants
const ListContext = createContext<ListContextType | undefined>(undefined);

// ListProvider element
function initialList() {
  const storedLists = localStorage.getItem("myLists");
  const lists = storedLists !== null ? JSON.parse(storedLists) : [];
  return lists;
}

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<List[]>(initialList());
  const [edit, setEdit] = useState(false);
  const [deleteListItem, setDeleteListItem] = useState(false);

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

  function updateList(updatedList: List) {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  }

  function addList(newList: List) {
    setLists((prevLists) => [...prevLists, newList]);
  }

  function deleteList(currentListName: string) {
    const updatedLists = lists.filter(
      (list: List) => list.listName !== currentListName
    );
    setLists(updatedLists);
    localStorage.setItem("myLists", JSON.stringify(lists));
  }

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

    console.log(updatedLists);
    setLists(updatedLists);
  }

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
  function editList(editedList: ListEdit, currentListName: string) {
    // field validation
    if (editedList.listName.trim() === "") {
      console.error("Fields may not be empty");
      return;
    }
    for (const list of lists) {
      if (
        list.listName == editedList.listName &&
        list.listName !== currentListName
      ) {
        console.error("a list with that name already exists");
        return;
      }
    }
    // field replacement
    const updatedList = lists.map((list: List) => {
      if (list.listName === currentListName.trim()) {
        list.listName = editedList.listName;
        list.description = editedList.description;
      }
      return list;
    });
    console.log(updatedList);
    setLists(updatedList);
  }
  // console.log(getListTotal("test list#1") ? getListTotal("test list#1") : "");

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
      }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListContext;
