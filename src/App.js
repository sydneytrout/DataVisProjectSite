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
      <Home />
    </div>
  );
}

export default App;
