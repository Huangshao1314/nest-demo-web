import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Button } from "antd";
import Home from "./pages/home";
import Login from "./pages/login";
import Project from "./pages/project";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Project />
    </>
  );
}

export default App;
