"use client";

import { DarkAnnouncementBar } from "./DarkAnnouncementBar";
import { FloatingNavbar } from "./FloatingNavbar";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full flex flex-col">
      <DarkAnnouncementBar />
      <FloatingNavbar />
    </header>
  );
}
