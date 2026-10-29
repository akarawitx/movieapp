import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import HomePage from "./pages/HomePage";
import MovieBrowsePage from "./pages/MovieBrowsePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import WatchlistPage from "./pages/WatchlistPage";
import SearchPage from "./pages/SearchPage";
import ChartsPage from "./pages/ChartsPage";
import CalendarPage from "./pages/CalendarPage";
import ReviewsFeedPage from "./pages/ReviewsFeedPage";
import PublicProfilePage from "./pages/PublicProfilePage";
import { PrivacyPage, TermsPage } from "./pages/LegalPages";
import { ForgotPasswordPage, ResetPasswordPage } from "./pages/PasswordRecoveryPages";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import { useAccounts } from "./context/AccountsContext";
import { ProfileProvider } from "./context/ProfileContext";
import { AccountsProvider } from "./context/AccountsContext";
import { CatalogProvider } from "./context/CatalogContext";
import { load, save } from "./utils/storage";
import styles from './css/App.module.css'

// ส่วนผู้ดูแลโหลดแยก (ผู้ใช้ทั่วไปไม่ต้องโหลดโค้ดส่วนนี้)
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMovies = lazy(() => import("./pages/admin/AdminMovies"));
const AdminMovieForm = lazy(() => import("./pages/admin/AdminMovieForm"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminUserDetail = lazy(() => import("./pages/admin/AdminUserDetail"));
const AdminReviews = lazy(() => import("./pages/admin/AdminReviews"));
const AdminGenres = lazy(() => import("./pages/admin/AdminGenres"));
const AdminActivity = lazy(() => import("./pages/admin/AdminActivity"));

// ส่วนผู้ดูแลใช้ layout ของตัวเอง (ซ่อน Header/Footer ของหน้าเว็บเฉพาะเมื่อเป็นผู้ดูแลจริง)
function AppShell({ user, setUser }) {
  const navigate = useNavigate();
  const { isAdmin } = useAccounts();
  const [toast, setToast] = useState({ show: false, icon: "", msg: "" });

  const showToast = (msg, icon = "✅") => setToast({ show: true, icon, msg });
  const hideToast = useCallback(
    () => setToast((t) => ({ ...t, show: false })),
    [],
  );

  // เลื่อนขึ้นบนสุดทุกครั้งที่เปลี่ยนหน้า
  const location = useLocation();
  const { pathname, search } = location;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const inAdmin = isAdmin && /^\/admin(\/|$)/.test(pathname);

  // ออกจากระบบจากหน้าที่ต้องล็อกอิน: ไปหน้าแรกก่อน แล้วค่อยล้างผู้ใช้เมื่อถึงหน้าแรก
  // (ถ้าล้างก่อน ProtectedRoute/AdminRoute จะเห็นว่ายังไม่ล็อกอินแล้วเปิดหน้าต่าง Login ขึ้นมา)
  useEffect(() => {
    if (!location.state?.logout) return;
    setUser(null);
    navigate(location.pathname, { replace: true, state: null });
  }, [location, navigate, setUser]);
  const adminLogout = () => navigate("/", { state: { logout: true } });

  return (
    <div className={styles.app}>
      {!inAdmin && <Header user={user} onLogin={setUser} />}
      <main>
        <Suspense fallback={null}>
          <Routes>
            <Route
              path="/"
              element={
                <HomePage user={user} onToast={showToast} />
              }
            />
            <Route
              path="/movies"
              element={
                <MovieBrowsePage
                  key={search}
                  user={user}
                  onToast={showToast}
                />
              }
            />
            <Route
              path="/charts"
              element={<ChartsPage user={user} onToast={showToast} />}
            />
            <Route path="/reviews" element={<ReviewsFeedPage user={user} />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/u/:username" element={<PublicProfilePage user={user} />} />
            <Route
              path="/calendar"
              element={<CalendarPage user={user} onToast={showToast} />}
            />
            <Route
              path="/search"
              element={
                <SearchPage key={search} user={user} onToast={showToast} />
              }
            />
            <Route
              path="/movies/:id"
              element={<MovieDetailPage user={user} onToast={showToast} />}
            />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/contact"
              element={<ContactPage onToast={showToast} />}
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/watchlist"
              element={
                <ProtectedRoute user={user}>
                  <WatchlistPage onToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings/:section?"
              element={
                <ProtectedRoute user={user}>
                  <SettingsPage onToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <AdminRoute user={user}>
                  <AdminLayout onLogout={adminLogout} />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="movies/new" element={<AdminMovieForm key="new" />} />
              <Route path="movies/:id/edit" element={<AdminMovieForm key={pathname} />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:username" element={<AdminUserDetail key={pathname} />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="genres" element={<AdminGenres />} />
              <Route path="activity" element={<AdminActivity />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      {!inAdmin && <Footer />}
      <Toast toast={toast} onHide={hideToast} />
    </div>
  );
}

export default function App() {
  // จำผู้ใช้ที่ล็อกอินไว้ข้ามการรีเฟรช (ระบบล็อกอินจำลอง ยังไม่ต่อ API)
  const [user, setUser] = useState(() => load("user", null));
  useEffect(() => {
    save("user", user);
  }, [user]);

  return (
    <AccountsProvider user={user} onUserChange={setUser}>
      <CatalogProvider>
        <ProfileProvider user={user} onUserChange={setUser}>
          <AppShell user={user} setUser={setUser} />
        </ProfileProvider>
      </CatalogProvider>
    </AccountsProvider>
  );
}
