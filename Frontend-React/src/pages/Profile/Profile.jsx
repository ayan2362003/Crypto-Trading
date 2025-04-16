import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import AccountVarificationForm from "./AccountVarificationForm";
import { enableTwoStepAuthentication, verifyOtp } from "@/Redux/Auth/Action";

const Profile = () => {
  const { auth } = useSelector((store) => store);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");
  const user = auth.user || {};

  const handleEnableTwoStepVerification = (otp) => {
    dispatch(enableTwoStepAuthentication({ jwt, otp }));
  };

  const handleVerifyOtp = (otp) => {
    dispatch(verifyOtp({ jwt, otp }));
  };

  // Fixed the path to match your application's routing structure
  const handlePasswordReset = () => {
    navigate("/auth/forgot-password");
  };

  const renderVerificationBadge = (isVerified) => (
    isVerified ? (
      <Badge className="space-x-2 text-white bg-green-600">
        <CheckCircle size={16} /> <span>{isVerified ? "Verified" : "Enabled"}</span>
      </Badge>
    ) : (
      <Badge className="bg-orange-500">
        {isVerified === false ? "Pending" : "Disabled"}
      </Badge>
    )
  );

  return (
    <div className="flex flex-col items-center mb-5">
      <div className="pt-10 w-full lg:w-[60%]">
        {/* Personal Information Card */}
        <Card>
          <CardHeader className="pb-9">
            <CardTitle>Your Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="lg:flex gap-32">
              <div className="space-y-7">
                <div className="flex">
                  <p className="w-[9rem]">Email:</p>
                  <p className="text-gray-500">{user.email || "Not available"}</p>
                </div>
                <div className="flex">
                  <p className="w-[9rem]">Full Name:</p>
                  <p className="text-gray-500">{user.fullName || "Not available"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two-Factor Authentication Card */}
        <div className="mt-6">
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>2 Step Verification</CardTitle>
                {renderVerificationBadge(user.twoFactorAuth?.enabled)}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    {user.twoFactorAuth?.enabled ? "Manage" : "Enable"} Two Step Verification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="px-10 pt-5 text-center">
                      Verify Your Account
                    </DialogTitle>
                  </DialogHeader>
                  <AccountVarificationForm handleSubmit={handleEnableTwoStepVerification} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>

        {/* Password and Account Status Cards */}
        <div className="lg:flex gap-5 mt-5 space-y-5 lg:space-y-0">
          {/* Password Card */}
          <Card className="w-full">
            <CardHeader className="pb-7">
              <CardTitle>Change Password</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center">
                <p className="w-[8rem]">Email:</p>
                <p>{user.email || "Not available"}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[8rem]">Password:</p>
                <Button variant="secondary" onClick={handlePasswordReset}>
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card className="w-full">
            <CardHeader className="pb-7">
              <div className="flex items-center gap-3">
                <CardTitle>Account Status</CardTitle>
                {renderVerificationBadge(user.verified)}
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center">
                <p className="w-[8rem]">Email:</p>
                <p>{user.email || "Not available"}</p>
              </div>
              <div className="flex items-center">
                <p className="w-[8rem]">Mobile:</p>
                <p>{user.mobile || "+918987667899"}</p>
              </div>
              {!user.verified && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Verify Account</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="px-10 pt-5 text-center">
                        Verify Your Account
                      </DialogTitle>
                    </DialogHeader>
                    <AccountVarificationForm handleSubmit={handleVerifyOtp} />
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;