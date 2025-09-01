"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BACKEND_URL } from "@/config";
import { useAuth } from "@/context/AuthProvider";
import axios from "axios";

export default function SignUpPage() {
  const [role, setRole] = useState("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"email" | "otp">("email");
  const router = useRouter();
  const { login } = useAuth();

  const requestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
        email,
        password,
      }, {
        withCredentials: true
      });
      
      if (response?.data) {
        setStep("otp");
      }
    } catch (err: any) {
      console.error("Failed to request OTP:", err);
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;
    
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/user/verify-otp`,
        {
          email,
          password,
          otp: code,
        },
        {
          withCredentials: true
        }
      );
   
      if (response.status === 200) {
        const { accessToken, user } = response.data;
        login(user, accessToken);
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Failed to verify OTP:", err);
      setError(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid w-full max-w-md gap-6">
      <div className="text-center">
        <h1 className="text-pretty text-2xl font-semibold">
          Welcome to 100xContest
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign up with your email to join live developer challenges.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {step === "email" ? "Sign up" : "Enter OTP"}
          </CardTitle>
          <CardDescription>
            {step === "email"
              ? "We will generate a one-time passcode"
              : "Enter the 6-digit code shown."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={requestOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="user">User</option>
                  {/* <option value="admin" disabled>Admin</option> */}
                </select>
              </div>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground transition-colors duration-200 hover:opacity-90 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send code"}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <p className="text-xs text-muted-foreground">
                Tip: use your personal email.
              </p>
              
              <div className="text-center text-sm">
                <span className="text-muted-foreground">Already have an account? </span>
                <a href="/signin" className="text-primary hover:underline">
                  Sign in here
                </a>
              </div>
            </form>
          ) : (
            <form onSubmit={verifyOtp} className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="code">6-digit code</Label>
                <Input
                  id="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground transition-colors duration-200 hover:opacity-90 disabled:opacity-70"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </Button>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
