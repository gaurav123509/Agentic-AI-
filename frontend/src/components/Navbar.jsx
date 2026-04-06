import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";

import logoMark from "../assets/logo-mark.svg";

const links = [
  { label: "Home", to: "/" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="section-shell sticky top-0 z-40 pt-4">
      <div className="card-surface flex items-center justify-between px-4 py-3 sm:px-5">
        <NavLink className="flex items-center gap-3" to="/">
          <img alt="MailPilot AI logo" className="h-11 w-11 rounded-2xl" src={logoMark} />
          <div>
            <p className="font-heading text-lg font-bold tracking-tight text-ink">MailPilot AI</p>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/45">
              Smart Email Ops
            </p>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `${isActive ? "nav-link nav-link-active" : "nav-link"}`
              }
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:block">
          <NavLink
            className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white transition hover:bg-sea"
            to="/dashboard"
          >
            Open Workspace
          </NavLink>
        </div>

        <button
          aria-label="Toggle navigation"
          className="rounded-full bg-white p-3 text-ink shadow-soft md:hidden"
          onClick={() => setIsOpen((value) => !value)}
          type="button"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {isOpen ? (
        <div className="card-surface mt-3 space-y-2 px-4 py-4 md:hidden">
          {links.map((link) => (
            <NavLink
              key={link.to}
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm font-semibold ${
                  isActive ? "bg-ink text-white" : "bg-white text-ink"
                }`
              }
              onClick={() => setIsOpen(false)}
              to={link.to}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
