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
}

// constants
const ListContext = createContext<ListContextType | undefined>(undefined);

// ListProvider element
export const ListProvider = ({ children }: { children: ReactNode }) => {
  const [lists, setLists] = useState<List[]>([]);

  // Initialize lists from localStorage on mount
  useEffect(() => {
    const storedLists = localStorage.getItem("myLists");
    if (storedLists) {
      setLists(JSON.parse(storedLists));
    }
  }, []);

  // Sync the lists state with localStorage
  useEffect(() => {
    if (lists.length > 0) {
      localStorage.setItem("myLists", JSON.stringify(lists));
    }
  }, [lists]);

  function updateList(updatedList: List) {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  }

  return (
    <ListContext.Provider value={{ lists, setLists, updateList }}>
      {children}
    </ListContext.Provider>
  );
};

export default ListContext;
