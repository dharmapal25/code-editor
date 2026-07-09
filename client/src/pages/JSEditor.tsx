import { useContext } from "react";
import { authUserInfo } from "../context/AuthContext";
import Navbar from "../components/Navbar/Navbar";
import CodeEditor from "../components/Code/CodeEditor";

interface Info {
  language: string;
  fileName: string;
}

function JSEditor() {
  const data = useContext(authUserInfo);
  console.log("Context Data in JSEditor:", data);

  const info: Info = {
    language: "javascript",
    fileName: "main.js",
  };

  return (
    <div>
      <Navbar />
      <CodeEditor info={info} />
    </div>
  );
}

export default JSEditor;