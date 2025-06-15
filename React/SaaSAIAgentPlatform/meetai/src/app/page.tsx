"use client";
import React, { useState } from "react";
import { ModeToggle } from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";


export default function Home() {
  // Test form for BetterAuth
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Handle form submission
  const onSubmit = () => {
    authClient.signUp.email({
      name,
      email,
      password,
    }, { 
        onRequest: () => {
            //show loading
        },
        onSuccess: () => {
            //redirect to the dashboard or sign in page
            window.alert("Sign up successful! Redirecting to login page...");
        },
        onError: () => {
            // display the error message
            window.alert("An error occurred while signing up");
        },
      }
    );
  }

  return (
    
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground space-y-4">
      <ModeToggle />
      <h1 className="text-4xl font-bold">Welcome to MeetAI</h1>
      <p className="text-lg">Your AI-powered meeting assistant</p>
      <form className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <Button type="submit" onClick={onSubmit} className="bg-blue-500 text-white">Sign Up</Button>
      </form>
      <div className="mt-4">
        <p className="text-sm">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Login</a></p>
      </div>
    </div>
  );
}
