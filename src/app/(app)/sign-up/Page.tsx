"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  //   useEffect(() => {
  //     const checkUsernameUnique = async () => {
  //       if (username) {
  //         setIsCheckingUsername(true);
  //         setUsernameMessage("");
  //       }
  //       try {
  //         const response = await axios.get(
  //           `/api/check-username-unique?username=${username}`
  //         );
  //         setUsernameMessage(response.data.message);
  //       } catch (error) {
  //         const axiosError = error as AxiosError<ApiResponse>;
  //         setUsernameMessage(
  //           axiosError.response?.data.message ??
  //             "Error checking username uniqueness"
  //         );
  //       } finally {
  //         setIsCheckingUsername(false);
  //       }
  //     };
  //     checkUsernameUnique();
  //   }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      setIsSubmitting(false);
      if (response.data.success === true) router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      setIsSubmitting(false);
      console.error(errorMessage || "Error while signing up the user");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-green-50">
      <div className="w-full max-w-xl mx-4 p-8 space-y-8 bg-white rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight lg:text-4xl mb-2">
            Welcome to Analog IC Design Lab
          </h1>
          <p className="text-sm text-gray-600">
            Sign up to continue on the forum
          </p>
        </div>

        {/* Form Section */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username"
                      className="focus:ring-black focus:border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      className="focus:ring-black focus:border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="focus:ring-black focus:border-black"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-lg transition-all"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Signing up...
                </span>
              ) : (
                "Sign Up"
              )}
            </Button>
          </form>
        </Form>

        {/* Footer Section */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already a member?{" "}
            <Link href="/sign-in" className="text-black hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
