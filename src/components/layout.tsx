import { Outlet } from "react-router-dom";

/**
 *Displays all the main pages of the apps
 */
export default function Layout() {
  return (
    <>
      <main>
        <Outlet></Outlet>
      </main>
    </>
  );
}
