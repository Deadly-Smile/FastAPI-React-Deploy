import type React from "react";
type prop = {
  leftside: React.ReactNode;
  rightside: React.ReactNode;
};

export default function Navbar({ leftside, rightside }: prop) {
  return (
    <section className="flex justify-between items-center w-full py-2">
      <div>{leftside}</div>
      <div>{rightside}</div>
    </section>
  );
}
