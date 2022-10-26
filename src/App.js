/** @format */

import logo from "./logo.svg";
import "./App.css";
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Projects } from "./components/Projects";
import { Blog } from "./components/Blog";
import { Resume } from "./components/Resume";
import { Home } from "./components/Home";

function App() {
  return (
    <div className="font-mono">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="blog" element={<Blog />} />
          <Route path="resume" element={<Resume />} />
          <Route path="projects" element={<Projects />} />
          <Route path="blog/tar_pit" element={<Blog currentState={1} />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
