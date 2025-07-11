"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from "lucide-react";
import DashboardCommand from "@/modules/Dashboard/ui/components/dashboard-command";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/dark-mode-toggle";

// Dashboard/ui/components/dashboard-navbar.tsx

const DashboardNavbar = () => {
    const { state, toggleSidebar, isMobile } = useSidebar();
    const [ commandOpen, setCommandOpen ] = useState(false);
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if(e.key === "k" && (e.metaKey || e.ctrlKey)){
                e.preventDefault();
                setCommandOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return ()=> document.removeEventListener("keydown", down);
    }, []);
    return (
        <>
        <DashboardCommand open={commandOpen} setOpen={setCommandOpen}/>
        <nav className="flex px-2 gap-x-2 items-center py-3 border-b bg-background sticky top-0 z-10">
            <Button className="size-9 cursor-pointer" variant="outline" onClick={toggleSidebar}>
                {( state === "collapsed" || isMobile ) 
                ? <PanelLeftIcon className="size-4"/> 
                : <PanelLeftCloseIcon className="size-4"/> }
            </Button>
            <Button className="h-9 w-[240px] justify-start font-normal text-muted-foreground hover:text-muted-foreground" 
            variant="outline"
            onClick={() => setCommandOpen((open) => !open)}>
                <SearchIcon/>
                Search...
                <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    <span className="text-xs">&#8984;</span> K
                </kbd>
            </Button>
            <div className="ml-auto">
                <ThemeToggle/>
            </div>
        </nav>
        </>
    );
}

export default DashboardNavbar;