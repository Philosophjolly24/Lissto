import { useContext } from "react";
import ListContext from "../contexts/listContext";

/**
 * Custom hook for the context
 */
export function useList() {
  const context = useContext(ListContext);
  if (context === undefined) {
    throw new Error("useList must be used within a ListProvider");
  }
  return context;
}
