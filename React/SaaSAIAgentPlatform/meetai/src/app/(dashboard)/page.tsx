// import { ModeToggle } from "@/components/dark-mode-toggle";
import { HomePageView } from "@/modules/home/ui/views/home-view";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const HomePage = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  }); 

  if(!session){
    redirect("/sign-in");
  }

  return (
      <section>
          <HomePageView />
      </section>
  );
}
export default HomePage;