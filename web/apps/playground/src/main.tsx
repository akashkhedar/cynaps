import { createRoot } from "react-dom/client";
import "./utils/embedFeatureFlags";
import { PlaygroundApp } from "./components/PlaygroundApp";

import "@cynaps/ui/src/styles.scss";
import "@cynaps/ui/src/tailwind.css";

const root = createRoot(document.getElementById("root")!);
root.render(<PlaygroundApp />);

