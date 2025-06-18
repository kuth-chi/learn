"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const HomePageView = () => {
    const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Welcome to MeetAI</h1>
      <p className="text-lg text-gray-600 mb-8">Your AI-powered meeting assistant</p>
      <h2></h2>
      <Button
        onClick={() => {
          // Handle sign out logic here
          authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
          })
          }}
        variant="default" className="cursor-pointer"
      >
       Sing out
      </Button>
    </div>
  );
}