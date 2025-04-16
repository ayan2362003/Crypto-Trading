import React, { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import CustomeToast from "@/components/custome/CustomeToast";
import LoginForm from "./login/login";
import SignupForm from "./signup/SignupForm";
import ForgotPasswordForm from "./ForgotPassword";

import "./Auth.css";

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useSelector((store) => store.auth);
  const { toast } = useToast();

  // Memoize navigation handler to prevent recreation on re-renders
  const handleNavigation = useCallback((path) => {
    navigate(path);
  }, [navigate]);

  // Determine which form to show based on current path
  const renderAuthForm = () => {
    const path = location.pathname;

    if (path === "/signup") {
      return (
        <section className="w-full login">
          <div className="loginBox w-full px-10 space-y-5">
            <SignupForm />

            <div className="flex items-center justify-center">
              <span>{"Already have an account?"}</span>
              <Button
                onClick={() => handleNavigation("/signin")}
                variant="ghost"
              >
                Sign In
              </Button>
            </div>
          </div>
        </section>
      );
    }

    if (path === "/forgot-password") {
      return (
        <section className="p-5 w-full">
          <ForgotPasswordForm />

          <div className="flex items-center justify-center mt-5">
            <span>Back to Login?</span>
            <Button
              onClick={() => navigate("/signin")}
              variant="ghost"
            >
              Sign In
            </Button>
          </div>
        </section>
      );
    }

    // Default to login form
    return (
      <section className="w-full login">
        <div className="loginBox w-full px-10 space-y-5">
          <LoginForm />

          <div className="flex items-center justify-center">
            <span>Don't have an account?</span>
            <Button
              onClick={() => handleNavigation("/signup")}
              variant="ghost"
            >
              Sign Up
            </Button>
          </div>

          <div>
            <Button
              onClick={() => navigate("/forgot-password")}
              variant="outline"
              className="w-full py-5"
            >
              Forgot Password?
            </Button>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="authContainer h-screen relative">
      <div className="absolute top-0 right-0 left-0 bottom-0 bg-[#030712] bg-opacity-50"></div>

      <div className="bgBlure absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 box flex flex-col justify-center items-center h-[35rem] w-[30rem] rounded-md z-50 bg-black bg-opacity-50 shadow-2xl shadow-white">
        <CustomeToast show={error} message={error?.error} />
        <h1 className="text-6xl font-bold pb-9">Crypto Trading</h1>

        {renderAuthForm()}
      </div>
    </div>
  );
};

export default Auth;