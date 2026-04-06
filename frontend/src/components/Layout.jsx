import { Outlet } from "react-router-dom";

import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-hero-grid" />
      <Navbar />
      <main className="pb-16 pt-6 md:pb-24">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
