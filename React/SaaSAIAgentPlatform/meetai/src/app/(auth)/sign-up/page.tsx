import React from "react";
import { SignUpView } from "@/modules/auth/ui/views/sign-up-view";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const page = async () => {

  // This page is for signing up users
  // It should include a form for users to enter their details
  // and submit to create a new account.
  // You can use a form library like Formik or React Hook Form for better form handling.
  // For now, we'll just display a simple card with a title and description.
  // In a real application, you would also handle form submission and validation.
  // You can also include a link to the sign-in page for users who already have an account.
  // Make sure to import the necessary components and styles.
  // This is a placeholder for the sign-up form.
  // You can replace this with your actual sign-up form component.
  // Ensure that you have the necessary authentication logic in place to handle user registration.
    // Handle this page rendering when user is already signed in
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if(!!session) {
      redirect("/");
    }
  return <SignUpView />;
}
export default page;
// /auth/sign-up