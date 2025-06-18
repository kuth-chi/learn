import { auth } from "@/lib/auth";
import { SignInView } from "@/modules/auth/ui/views/sign-in-view";
import { headers } from "next/headers";
import { redirect } from "next/navigation";


const page = async () => {
  // Handle this page rendering when user is already signed in
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if(!!session) {
    redirect("/");
  }
  return <SignInView />

}
export default page;
// /auth/sign-in