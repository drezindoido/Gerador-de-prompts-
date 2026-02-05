import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

console.log("KaizenPrompts v2.1.0 - Loaded at " + new Date().toISOString());
console.log("Rebranding & UX Fixes Applied");

createRoot(document.getElementById("root")!).render(<App />);
