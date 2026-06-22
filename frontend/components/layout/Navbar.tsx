"use client";

import NavbarGreeting from "./navbar/NavbarGreeting";
import NavbarNotification from "./navbar/NavbarNotification";
import NavbarProfile from "./navbar/NavbarProfile";

export default function Navbar() {
  return (
    <header
      className="
      sticky
      top-0
      z-30
      flex
      items-center
      justify-between
      border-b
      border-slate-200
      bg-white
      px-8
      py-5
      shadow-sm
      "
    >
      <NavbarGreeting />

      <div className="flex items-center gap-4">
        <NavbarNotification />

        <NavbarProfile />
      </div>
    </header>
  );
}
