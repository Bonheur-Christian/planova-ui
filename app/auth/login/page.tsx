// app/login/page.tsx

"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginValues) => {
    console.log(values);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* FORM SIDE */}
      <div className="flex items-center justify-center p-6 bg-background">
        <Card className="w-full max-w-md shadow-none border-none">
          <CardContent className="p-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold">Welcome Back</h1>

              <p className="text-muted-foreground mt-2">
                Login to continue
              </p>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field}) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>

                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Login
                </Button>
              </form>
            </Form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SVG SIDE */}
      <div className="hidden md:flex items-center justify-center bg-black p-10">
        <svg
          viewBox="0 0 500 500"
          className="w-[400px] h-[400px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="250" cy="250" r="180" fill="white" opacity="0.1" />

          <rect
            x="140"
            y="120"
            width="220"
            height="260"
            rx="20"
            fill="white"
          />

          <circle cx="250" cy="200" r="40" fill="black" />

          <rect
            x="180"
            y="270"
            width="140"
            height="18"
            rx="9"
            fill="black"
          />

          <rect
            x="160"
            y="310"
            width="180"
            height="18"
            rx="9"
            fill="black"
            opacity="0.7"
          />
        </svg>
      </div>
    </div>
  );
}