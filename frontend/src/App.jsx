import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import MovieBrowsePage from "./pages/MovieBrowsePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import styles from './css/App.module.css'

export default function App() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearch] = useState("");
  const [toast, setToast] = useState({ show: false, icon: "", msg: "" });

  const showToast = (msg, icon = "✅") => setToast({ show: true, icon, msg });

  // เลื่อนขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className={styles.app}>
      <Header user={user} onLogin={setUser} onSearch={setSearch} />
      <main>
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                user={user}
                onToast={showToast}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="/movies"
            element={<MovieBrowsePage user={user} onToast={showToast} />}
          />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/contact"
            element={<ContactPage onToast={showToast} />}
          />
        </Routes>
      </main>
      <Footer />
      <Toast toast={toast} onHide={() => setToast({ ...toast, show: false })} />
    </div>
  );
}
