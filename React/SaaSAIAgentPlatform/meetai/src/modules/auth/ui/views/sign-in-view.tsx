"use client";

import { Loader2, OctagonAlertIcon, OctagonAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";

import { Card, CardContent } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";


const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password must be at least 1 characters long"),
    rememberMe: z.boolean().optional(),
});

export const SignInView = () => {
    const router = useRouter();
    // Define error state
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Initialize the form with react-hook-form and zod for validation
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });
    // Handle form submission
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setError(null); // Reset error state
        setIsLoading(true); // Set loading state to true

            authClient.signIn.email({
                email: data.email,
                password: data.password,
                rememberMe: data.rememberMe,
            }, {
                onSuccess: () => {
                    router.push("/");
                },
                onError: ({ error }) => {
                    // Set error message if sign-in fails
                    setError(error?.message || "An unexpected error occurred");
                    setIsLoading(false);
                },

            });
    
    }

    return (
        <div className="flex flex-col gap-6">
        <Card className="overflow-hidden p-0 ease-in transition-all duration-1000">
            <CardContent className="grid p-0 md:grid-cols-2">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className={`p-6 md:p-8 ${isLoading ? "cursor-wait" : ""}`} >
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center justify-center">
                               <h1 className="text-2xl font-bold">Welcome Back</h1>
                               <p className="text-muted-foreground text-balance">
                                Login to your MeetAI account
                               </p>
                            </div>
                            <div className="grid gap-3">
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="mail@example.com" {...field} autoComplete="false"/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                                </FormField>
                                <FormField control={form.control} name="password" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="********" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}>
                                </FormField>
                            </div>
                            {!!error && (
                                <Alert className="bg-destructive/10 border-none">
                                    <OctagonAlertIcon className="h-4 w-4 !text-destructive"/>
                                    <AlertTitle>{error}</AlertTitle>
                                </Alert>
                            )}
                            <Button 
                                className="w-full cursor-pointer" 
                                type="submit" 
                                disabled={isLoading}
                                >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : null}
                                {isLoading ? "Signing In..." : "Sign In"}
                            </Button>


                            <div className="after:border-border relative text-sm text-center after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                <span className="bg-card text-muted-foreground relative z-10 px-2"> Or continue with</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" className="w-full cursor-pointer">
                                    <img src="/google.svg" alt="Google" className="w-4 h-4 mr-2 inline-block"/>
                                    Google
                                </Button>
                                <Button variant="outline" className="w-full cursor-pointer">
                                    <img src="/github.svg" alt="GitHub" className="w-4 h-4 mr-2 inline-block"/>
                                    GitHub
                                </Button>
                            </div>
                            <div className="text-sm text-muted-foreground text-center">
                                Don&apos;t have an account?{" "}
                                <a href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                                    Sign Up
                                </a>
                            </div>
                        </div>
                    </form>
                </Form>
                <div className="bg-radial from-green-700 to-green-900 text-white relative hidden md:flex flex-col gap-y-4 items-center justify-center">
                    <img src="/logo.svg" alt="Logo" className="w-[96px] h-[96px]"/>
                    <div className="text-2xl text-white font-semibold">
                        MeetAI
                     </div>
                </div>
            </CardContent>
        </Card>
        <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
            By clicking continue, you agree to our{" "}
            <a href="/terms" className="text-primary underline-offset-4 hover:underline">Terms of Service</a> and {" "} <a href="/privacy-policy" className="text-primary underline-offset-4 hover:underline">Privacy Policy</a>
        </div>
    </div>

    );
}