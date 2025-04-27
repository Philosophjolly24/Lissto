interface List {
  listName: string;
  id: string;
  description?: string;
  items: Item[];
}
interface Item {
  item: string;
  quantity: number;
  price: number;
}

export function addItem(listName: string, itemList: Item) {
  const storedList = localStorage.getItem("myLists");
  const myLists: List[] = storedList !== null ? JSON.parse(storedList) : [];
  myLists.forEach((list: List) => {
    if (list.listName === listName) {
      list.items?.push(itemList);
    }
    // * push back into localstorage
    localStorage.setItem("myLists", JSON.stringify(myLists));
  });
}
