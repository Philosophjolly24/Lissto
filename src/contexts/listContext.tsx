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

interface ListContextType {
  lists: List[];
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  updateList: (updatedList: List) => void;
  addList: (newList: List) => void;
  deleteList: (currentListName: string) => void;
  addItem: (listName: string, itemList: Item) => void;
}

// constants
const ListContext = createContext<ListContextType | undefined>(undefined);

// ListProvider element
const storedLists = localStorage.getItem("myLists");
const initialList = storedLists !== null ? JSON.parse(storedLists) : [];
export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<List[]>(initialList);

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

  function addItem(listName: string, itemList: Item) {
    const updatedLists = lists.map((list: List) => {
      if (list.listName === listName) {
        return {
          ...list,
          items: [...(list.items || []), itemList],
        };
      }
      return list;
    });
    setLists(updatedLists);
  }

  return (
    <ListContext.Provider
      value={{ lists, setLists, updateList, addList, deleteList, addItem }}
    >
      {children}
    </ListContext.Provider>
  );
};

export default ListContext;
