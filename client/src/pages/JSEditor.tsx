import Navbar from "../components/Navbar/Navbar";
import CodeEditor from "../components/Code/CodeEditor";

function JSEditor() {
  const info = {
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
