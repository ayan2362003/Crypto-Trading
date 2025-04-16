import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { sendResetPassowrdOTP } from "@/Redux/Auth/Action";

// Schema definition moved outside component to prevent recreation on each render
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Default values as a constant to prevent recreation
const defaultValues = {
  email: "",
};

const ForgotPasswordForm = () => {
  const [verificationType, setVerificationType] = useState("EMAIL");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Memoized submit handler prevents recreation on re-renders
  const onSubmit = useCallback((data) => {
    dispatch(
      sendResetPassowrdOTP({
        sendTo: data.email,
        navigate,
        verificationType,
      })
    );
  }, [dispatch, navigate, verificationType]);

  return (
    <div className="space-y-5">
      <h1 className="text-center text-xl">
        Where do you want to get the code?
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Enter your email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full bg-slate-400 py-5">
            Send OTP
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default ForgotPasswordForm;