import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, memo } from "react";

// UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// Icons
import {
  AvatarIcon,
  DragHandleHorizontalIcon,
  MagnifyingGlassIcon,
} from "@radix-ui/react-icons";

// Components
import SideBar from "../SideBar/SideBar";

const Navbar = () => {
  const navigate = useNavigate();
  const { auth } = useSelector((state) => state);
  const user = auth?.user;

  const handleNavigate = () => {
    if (!user) return;

    const route = user.role === "ROLE_ADMIN"
      ? "/admin/withdrawal"
      : "/profile";

    navigate(route);
  };

  const navigateHome = () => navigate("/");
  const navigateSearch = () => navigate("/search");

  return (
    <nav className="px-2 py-3 border-b z-50 bg-background sticky top-0 left-0 right-0 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              className="rounded-full h-11 w-11"
              variant="ghost"
              size="icon"
              aria-label="Open menu"
            >
              <DragHandleHorizontalIcon className="h-7 w-7" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-72 border-r-0 flex flex-col justify-center"
            side="left"
          >
            <SheetHeader>
              <SheetTitle>
                <div className="text-3xl flex justify-center items-center gap-1">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="https://cdn.pixabay.com/photo/2021/04/30/16/47/binance-logo-6219389_1280.png" alt="Crypto Trading Logo" />
                  </Avatar>
                  <div>
                    <span className="font-bold text-orange-700">Crypto</span>
                    <span>Trading</span>
                  </div>
                </div>
              </SheetTitle>
            </SheetHeader>
            <SideBar />
          </SheetContent>
        </Sheet>

        <p
          onClick={navigateHome}
          className="text-sm lg:text-base cursor-pointer"
        >
          Crypto Trading
        </p>

        <div className="p-0 ml-9">
          <Button
            variant="outline"
            onClick={navigateSearch}
            className="flex items-center gap-3"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span>Search</span>
          </Button>
        </div>
      </div>

      <Avatar className="cursor-pointer" onClick={handleNavigate}>
        {!user ? (
          <AvatarIcon className="h-8 w-8" />
        ) : (
          <AvatarFallback>{user.fullName[0].toUpperCase()}</AvatarFallback>
        )}
      </Avatar>
    </nav>
  );
};

export default memo(Navbar);