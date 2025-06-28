// src/components/layouts/Layout.jsx
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <div className="app-wrapper">
      <Header />
      <main style={{ padding: "2rem", minHeight: "80vh" }}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
