"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import type { RootState } from "@/store/store";
import { registerUser, clearError } from "@/store/slices/authSlice";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { useEffect } from "react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword: _, ...payload } = data;
    const result = await dispatch(registerUser(payload) as any);
    if (registerUser.fulfilled.match(result)) {
      toast.success("Registration successful! Please login.");
      router.push("/login");
    } else {
      toast.error(result.payload as string);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Service Booking System today</p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Name"
            placeholder="Enter your name"
            error={errors.name?.message}
            {...register("name")}
          />
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
            placeholder="Min 6 characters"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          {error && (
            <div className="error-message mb-4">{error}</div>
          )}

          <Button type="submit" className="btn-block" loading={loading}>
            Register
          </Button>
        </form>

        <p className="auth-link">
          Already have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
