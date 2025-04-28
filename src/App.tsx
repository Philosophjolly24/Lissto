import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Create from "./pages/create";
import Layout from "./components/layout";
import Search from "./pages/search";
import { useEffect, useState } from "react";
import * as xlsx from "xlsx";
import "../src/styles/index.css";
import List from "./pages/list";
import { ListProvider } from "./contexts/listContext";

function App() {
  // excel to json data conversion
  const [jsonData, setJsonData] = useState<Array<string>>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.xlsx");
      const arrayBuffer = await response.arrayBuffer();
      const workbook = xlsx.read(arrayBuffer, { type: "array" });
      const giantSheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = xlsx.utils.sheet_to_json(giantSheet) as unknown[];
      setJsonData(json as string[]);
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (jsonData.length > 0) {
      localStorage.setItem("productData", JSON.stringify(jsonData)); // Save to localStorage
    }
  }, [jsonData]);
  // =========================================== //
  return (
    <ListProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout></Layout>}>
            <Route index element={<Home></Home>}></Route>
            <Route path="create-list" element={<Create></Create>}></Route>
            <Route path="list" element={<List></List>}></Route>
            <Route path="search" element={<Search></Search>}></Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </ListProvider>
  );
}

export default App;
