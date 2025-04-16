import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
import SpinnerBackdrop from "@/components/custome/SpinnerBackdrop";

import { register } from "@/Redux/Auth/Action";

// Schema definition moved outside component to prevent recreation on each render
const formSchema = z.object({
  fullName: z.string().nonempty("Full name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// Default values as a constant to prevent recreation
const defaultValues = {
  fullName: "",
  email: "",
  password: "",
};

const SignupForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((store) => store.auth);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  // Memoized submit handler prevents recreation on re-renders
  const onSubmit = useCallback((data) => {
    dispatch(register({ ...data, navigate }));
  }, [dispatch, navigate]);

  return (
    <div className="space-y-5">
      <h1 className="text-center text-xl">Create New Account</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Enter your full name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="border w-full border-gray-700 py-5 px-5"
                    placeholder="Enter your password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {loading ? (
            <SpinnerBackdrop show={true} />
          ) : (
            <Button type="submit" className="w-full py-5">
              Register
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default SignupForm;