/** @format */

import { MenuBar } from "./Menubar";
import { useState } from "react";

export function Blog({ currentState = 0 }) {
  const [currentBlog, setCurrentBlog] = useState(currentState);
  return (
    <>
      <MenuBar currentState={2} />
    </>
  );
}
