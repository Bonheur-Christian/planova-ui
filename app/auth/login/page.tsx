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
import Image from "next/image";

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
    <div className="min-h-screen flex items-center justify-center p-6 gap-[12rem] bg-background">
      <Card className="w-full max-w-md shadow-none p-8">
        <CardContent className="p-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Welcome Back</h1>

            <p className="text-muted-foreground mt-2">Login to continue</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter your email" {...field} />
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
              <div className="flex items-center justify-center">
                <Button type="submit" className="w-1/2 py-6">
                  Login
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-medium text-primary">
              Register
            </Link>
          </p>
        </CardContent>
      </Card>
      {/* SVG SIDE */}
      <Image
        src="/login.svg"
        alt="Login Illustration"
        width={400}
        height={400}
        loading="eager"
      />
    </div>
  );
}
