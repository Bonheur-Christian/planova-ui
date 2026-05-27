"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";

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
import { useLoginMutation } from "@/redux/features/auth/auth.api";
import { useRouter } from "next13-progressbar";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useSelector } from "react-redux";
import {
  selectIsAuthenticated,
  selectUser,
} from "@/services/auth/authSelector";
import { resolvePostLoginPath } from "@/utils/roleUtil";

const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().trim().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user?.role) {
      return;
    }

    const destination = resolvePostLoginPath(
      user.role,
      searchParams.get("next"),
    );

    router.push(destination);
  }, [isAuthenticated, router, searchParams, user?.role]);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    try {
      const res = await login(values).unwrap();
      const role = res.data.user.role;

      router.push(
        resolvePostLoginPath(role, searchParams.get("next")),
      );
      toast.success("Login successful", { duration: 3000 });
    } catch (err: any) {
      toast.error("Login failed");
    }
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
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                        />

                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
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
                  {isLoading ? "Logging in" : "Login"}
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
