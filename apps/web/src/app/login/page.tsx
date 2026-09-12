"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { loginUser, clearError } from "@/store/slices/authSlice";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useEffect } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: LoginForm) => {
    const result = await dispatch(loginUser(data) as any);
    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful!");
      const role = result.payload.user.role;
      if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            error={errors.password?.message}
            {...register("password")}
          />

          {error && (
            <div className="error-message mb-4">{error}</div>
          )}

          <Button type="submit" className="btn-block" loading={loading}>
            Login
          </Button>
        </form>

        <p className="auth-link">
          Don&apos;t have an account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
