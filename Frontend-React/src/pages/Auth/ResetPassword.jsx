import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { verifyResetPassowrdOTP } from "@/Redux/Auth/Action";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as yup from "yup";

// Enhanced validation schema
const formSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number and special character"
    )
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], "Passwords must match")
    .required("Confirm password is required"),
  otp: yup
    .string()
    .length(6, "OTP must be exactly 6 characters")
    .matches(/^\d+$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get loading state from Redux store (assuming it exists)
  const loading = useSelector((state) => state.auth?.loading) || false;

  const form = useForm({
    resolver: yupResolver(formSchema),
    defaultValues: {
      confirmPassword: "",
      password: "",
      otp: "",
    },
    mode: "onChange", // Validate on change for better user feedback
  });

  // Session expiry check
  useEffect(() => {
    if (!session) {
      navigate("/forgot-password");
    }

    // Optional: Add a timer to check session validity
    const sessionTimer = setTimeout(() => {
      // If you want to check session validity after some time
    }, 300000); // 5 minutes

    return () => clearTimeout(sessionTimer);
  }, [session, navigate]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await dispatch(
        verifyResetPassowrdOTP({
          otp: data.otp,
          password: data.password,
          session,
          navigate
        })
      );
    } catch (error) {
      console.error("Password reset failed:", error);
      // Handle error - you could set form errors here
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <h1 className="text-2xl font-semibold text-center">Reset Your Password</h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <FormLabel className="text-lg font-medium block mb-2">Verification Code</FormLabel>
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputOTP
                          {...field}
                          maxLength={6}
                          containerClassName="justify-center"
                          disabled={isSubmitting || loading}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-2">
                <FormLabel className="text-lg font-medium block mb-2">Set New Password</FormLabel>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="New password"
                            disabled={isSubmitting || loading}
                            aria-describedby="password-requirements"
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={togglePasswordVisibility}
                          tabIndex="-1"
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <p id="password-requirements" className="text-xs text-gray-500 mt-1">
                        Password must be at least 8 characters with uppercase, lowercase, number and special character.
                      </p>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <div className="relative">
                        <FormControl>
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            className="pr-10"
                            placeholder="Confirm password"
                            disabled={isSubmitting || loading}
                          />
                        </FormControl>
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={toggleConfirmPasswordVisibility}
                          tabIndex="-1"
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="h-5 w-5 text-gray-400" />
                          ) : (
                            <EyeIcon className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading ? "Processing..." : "Change Password"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button
            variant="link"
            onClick={() => navigate("/signin")}
            disabled={isSubmitting || loading}
          >
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;