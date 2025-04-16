import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PasswordUpdateSuccess = () => {
  const navigate = useNavigate();
  
  // Auto-redirect after a delay (optional)
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      navigate("/");
    }, 5000); // 5 second auto-redirect
    
    // Cleanup timer on component unmount
    return () => clearTimeout(redirectTimer);
  }, [navigate]);
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <Card className="w-full max-w-md shadow-lg" onKeyDown={handleKeyDown} tabIndex={0}>
        <CardHeader className="flex flex-col items-center pt-8">
          <CheckCircle className="text-green-600 h-16 w-16 mb-2" />
          <h1 className="text-2xl font-semibold text-center">Password Changed!</h1>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-500 text-center">
            Your password has been changed successfully. You can now log in with your new credentials.
          </p>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-8">
          <Button 
            onClick={() => navigate("/")} 
            className="w-full max-w-xs transition-all hover:scale-105"
            aria-label="Go to login page"
          >
            Go to Login
          </Button>
        </CardFooter>
      </Card>
      
      <p className="text-sm text-gray-400 mt-4">You will be redirected automatically in 5 seconds...</p>
    </div>
  );
};

export default PasswordUpdateSuccess;