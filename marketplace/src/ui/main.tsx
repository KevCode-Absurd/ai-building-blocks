import { render } from "preact";
import "./styles.css";
import { AuthProvider } from "./lib/auth.tsx";
import { App } from "./app.tsx";

render(<AuthProvider><App /></AuthProvider>, document.getElementById("app")!);
