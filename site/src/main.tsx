import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import "@xyflow/react/dist/base.css";
import "./styles.css";
import { Footer, Header } from "./components";
import Home from "./pages/Home";
import Library from "./pages/Library";
import BlockPage from "./pages/BlockPage";
import Canvas from "./pages/Canvas";
import Kits from "./pages/Kits";
import Workflows from "./pages/Workflows";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView();
    else window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

function App() {
  const { pathname } = useLocation();
  const bare = pathname.startsWith("/canvas");
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/library" element={<Library />} />
          <Route path="/blocks/:slug" element={<BlockPage />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/canvas" element={<Canvas />} />
          <Route path="/kits" element={<Kits />} />
          <Route path="*" element={<div className="wrap empty"><h3 className="h3">This page isn't here</h3><p>Try the <a className="link" href="/library">library</a>.</p></div>} />
        </Routes>
      </main>
      {!bare && <Footer />}
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
