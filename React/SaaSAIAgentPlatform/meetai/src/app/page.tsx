"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();

  const { data: session } = authClient.useSession(); // Assuming it's reactive
  const [isLoginForm, setIsLoginForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !password) {
      return alert("Please fill in all fields.");
    }

    authClient.signUp.email(
      { name, email, password },
      {
        onSuccess: () => {
          alert("Sign up successful! Redirecting...");
          router.push("/login");
        },
        onError: (err) => {
          alert("Error: " + (err.error?.message || "Unknown error"));
        },
      }
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return alert("Please fill in all fields.");
    }

    authClient.signIn.email(
      { email, password },
      {
        onSuccess: () => {
          alert("Login successful! Redirecting...");
          router.push("/dashboard");
        },
        onError: (err) => {
          alert("Error: " + (err.error?.message || "Unknown error"));
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground space-y-4 px-4">
      <div className="absolute top-4 right-4 flex items-center gap-x-4">
        {session ? (
          <>
            <span>Welcome, {session.user.name || "User"}!</span>
            <Button onClick={() => authClient.signOut()}>Logout</Button>
          </>
        ) : (
          <span>Please log in</span>
        )}
        <ModeToggle />
      </div>

      <h1 className="text-4xl font-bold">Welcome to MeetAI</h1>
      <p className="text-lg">Your AI-powered meeting assistant</p>

      <form
        className="flex flex-col space-y-4 w-full max-w-sm"
        onSubmit={isLoginForm ? handleLogin : handleSignUp}
      >
        {!isLoginForm && (
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button type="submit" className="bg-blue-500 text-white">
          {isLoginForm ? "Login" : "Sign Up"}
        </Button>
      </form>

      <div className="mt-4 text-sm">
        {isLoginForm ? (
          <p>
            Don’t have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setIsLoginForm(false)}
            >
              Sign up
            </button>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setIsLoginForm(true)}
            >
              Login
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
