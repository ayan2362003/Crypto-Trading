import { logout } from "@/Redux/Auth/Action";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import {
  ExitIcon,
  BookmarkIcon,
  PersonIcon,
  DashboardIcon,
  HomeIcon,
  ActivityLogIcon,
} from "@radix-ui/react-icons";
import { CreditCardIcon, LandmarkIcon, WalletIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useMemo, useCallback } from "react";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // Define menu items with useMemo to prevent unnecessary recreations
  const menuItems = useMemo(() => [
    { name: "Home", path: "/", icon: <HomeIcon className="h-5 w-5" /> },
    { name: "Portfolio", path: "/portfolio", icon: <DashboardIcon className="h-5 w-5" /> },
    { name: "Watchlist", path: "/watchlist", icon: <BookmarkIcon className="h-5 w-5" /> },
    { name: "Activity", path: "/activity", icon: <ActivityLogIcon className="h-5 w-5" /> },
    { name: "Wallet", path: "/wallet", icon: <WalletIcon className="h-5 w-5" /> },
    { name: "Payment Details", path: "/payment-details", icon: <LandmarkIcon className="h-5 w-5" /> },
    { name: "Withdrawal", path: "/withdrawal", icon: <CreditCardIcon className="h-5 w-5" /> },
    { name: "Profile", path: "/profile", icon: <PersonIcon className="h-5 w-5" /> },
    { name: "Logout", path: "/", icon: <ExitIcon className="h-5 w-5 text-red-500" />, isLogout: true },
  ], []);

  // Memoized logout handler
  const handleLogout = useCallback(() => {
    dispatch(logout());
    navigate("/");
  }, [dispatch, navigate]);

  // Memoized navigation handler
  const handleMenuClick = useCallback((item) => {
    if (item.isLogout) {
      handleLogout();
      return;
    }
    navigate(item.path);
  }, [navigate, handleLogout]);

  // Separate regular menu items from logout
  const regularMenuItems = useMemo(() =>
    menuItems.filter(item => !item.isLogout),
    [menuItems]);

  const logoutItem = useMemo(() =>
    menuItems.find(item => item.isLogout),
    [menuItems]);

  return (
    <div className="mt-5 space-y-4 bg-gray-900 p-4 rounded-lg shadow-lg max-h-screen overflow-y-auto flex flex-col">
      <div className="flex-grow space-y-2">
        {regularMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <SheetClose key={item.name} asChild>
              <Button
                onClick={() => handleMenuClick(item)}
                variant="ghost"
                className={cn(
                  "flex items-center gap-3 py-4 px-4 w-full rounded-lg transition-all justify-start",
                  isActive
                    ? "bg-gray-700 text-white"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="w-6 flex justify-center" aria-hidden="true">
                  {item.icon}
                </span>
                <p className="text-sm font-medium">{item.name}</p>
              </Button>
            </SheetClose>
          );
        })}
      </div>

      {/* Logout button at the bottom */}
      {logoutItem && (
        <SheetClose asChild>
          <Button
            onClick={() => handleMenuClick(logoutItem)}
            variant="ghost"
            className="flex items-center gap-3 py-4 px-4 w-full text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition-all justify-start mt-auto"
          >
            <span className="w-6 flex justify-center" aria-hidden="true">
              {logoutItem.icon}
            </span>
            <p className="text-sm font-medium">{logoutItem.name}</p>
          </Button>
        </SheetClose>
      )}
    </div>
  );
};

export default SideBar;