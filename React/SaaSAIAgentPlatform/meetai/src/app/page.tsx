import { ModeToggle } from "@/components/dark-mode-toggle";
import { Button } from "@/components/ui/button";


export default function Home() {
  return (
    
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground space-y-4">
      <ModeToggle />
      <Button variant="default">Click me</Button>
    </div>
  );
}
