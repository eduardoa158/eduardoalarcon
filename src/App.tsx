import { HashRouter, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Product } from "@/pages/Product";
import { Blog } from "@/pages/Blog";
import { BlogPost } from "@/pages/BlogPost";
import { ScrollToTop } from "@/components/ui/custom/ScrollToTop";

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        
        {/* Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        
        {/* Product Landings */}
        <Route path="/product/:slug" element={<Product />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
