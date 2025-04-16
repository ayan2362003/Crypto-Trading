import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./Redux/Auth/Action";
import { shouldShowNavbar } from "./Util/shouldShowNavbar";

// Component imports
import Navbar from "./pages/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Portfolio from "./pages/Portfilio/Portfolio";
import Auth from "./pages/Auth/Auth";
import StockDetails from "./pages/StockDetails/StockDetails";
import Profile from "./pages/Profile/Profile";
import Notfound from "./pages/Notfound/Notfound";
import Wallet from "./pages/Wallet/Wallet";
import Watchlist from "./pages/Watchlist/Watchlist";
import TwoFactorAuth from "./pages/Auth/TwoFactorAuth";
import ResetPasswordForm from "./pages/Auth/ResetPassword";
import PasswordUpdateSuccess from "./pages/Auth/PasswordUpdateSuccess";
import LoginWithGoogle from "./pages/Auth/LoginWithGoogle.";
import Withdrawal from "./pages/Wallet/Withdrawal";
import PaymentDetails from "./pages/Wallet/PaymentDetails";
import WithdrawalAdmin from "./Admin/Withdrawal/WithdrawalAdmin";
import Activity from "./pages/Activity/Activity";
import SearchCoin from "./pages/Search/Search";

// Route configuration
const routes = [
  { path: "/", role: "ROLE_USER" },
  { path: "/portfolio", role: "ROLE_USER" },
  { path: "/activity", role: "ROLE_USER" },
  { path: "/wallet", role: "ROLE_USER" },
  { path: "/withdrawal", role: "ROLE_USER" },
  { path: "/payment-details", role: "ROLE_USER" },
  { path: "/wallet/success", role: "ROLE_USER" },
  { path: "/market/:id", role: "ROLE_USER" },
  { path: "/watchlist", role: "ROLE_USER" },
  { path: "/profile", role: "ROLE_USER" },
  { path: "/search", role: "ROLE_USER" },
  { path: "/admin/withdrawal", role: "ROLE_ADMIN" }
];

// Auth routes configuration
const authRoutes = [
  { path: "/", element: <Auth /> },
  { path: "/signup", element: <Auth /> },
  { path: "/signin", element: <Auth /> },
  { path: "/forgot-password", element: <Auth /> },
  { path: "/login-with-google", element: <LoginWithGoogle /> },
  { path: "/reset-password/:session", element: <ResetPasswordForm /> },
  { path: "/password-update-successfully", element: <PasswordUpdateSuccess /> },
  { path: "/two-factor-auth/:session", element: <TwoFactorAuth /> },
  { path: "*", element: <Notfound /> }
];

function App() {
  const { auth } = useSelector(store => store);
  const dispatch = useDispatch();
  const location = useLocation();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    if (jwt) {
      dispatch(getUser(jwt));
    }
  }, [dispatch, auth.jwt, jwt]);

  const showNavbar = auth.user ? shouldShowNavbar(location.pathname, routes, auth.user?.role) : false;
  const isAdmin = auth.user?.role === "ROLE_ADMIN";

  if (!auth.user) {
    return (
      <Routes>
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    );
  }

  return (
    <>
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/withdrawal" element={<Withdrawal />} />
        <Route path="/payment-details" element={<PaymentDetails />} />
        <Route path="/wallet/:order_id" element={<Wallet />} />
        <Route path="/market/:id" element={<StockDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<SearchCoin />} />
        {isAdmin && <Route path="/admin/withdrawal" element={<WithdrawalAdmin />} />}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </>
  );
}

export default App;