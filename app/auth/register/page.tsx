// app/register/page.tsx

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
import { useRegisterMutation } from "@/redux/features/auth/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next13-progressbar";

const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),

  email: z.string().email("Valid email is required"),

  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: RegisterValues) => {
    try {
      await register(values).unwrap();
      toast.success("Account created successfully ", {
        duration: 3000,
      });
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err?.data?.message ?? "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 gap-[12rem] bg-background">
      <Card className="w-full max-w-md shadow-none p-8 ">
        <CardContent className="p-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Create Account</h1>

            <p className="text-muted-foreground mt-2">
              Register to get started
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>

                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
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
                        placeholder="Create password"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center">
                <Button
                  type="submit"
                  className="w-1/2 py-6"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </div>
            </form>
          </Form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="font-medium text-primary">
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
      {/* SVG SIDE */}
      <Image
        src="/register.svg"
        alt="Register Illustration"
        width={400}
        height={400}
      />
    </div>
  );
}
