"use client";

import Image from "next/image"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup, 
    SidebarHeader,
    SidebarMenuButton,
    SidebarMenu, 
    SidebarMenuItem,
    SidebarSeparator,
    SidebarGroupContent,
    SidebarFooter
} from "@/components/ui/sidebar";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import DashboardUserButton from "@/modules/Dashboard/ui/components/dashboard-user-button";

const firstSection = [
    {
        icons: VideoIcon,
        label: "Meetings",
        href: "/meetings",
        
    },
    {
        icons: BotIcon,
        label: "Agents",
        href: "/agents",
        
    }
];
const secondSection = [
    {
        icons: StarIcon,
        label: "Upgrade",
        href: "/upgrade",
        
    }
];
export const DashboardSidebar = () => {
    const pathName = usePathname();
  return (
    <Sidebar className="text-sidebar-accent-foreground">
        <SidebarHeader>
            <Link href="/" className="flex items-center gap-2 px-2 pt-2">
                <Image src="/logo.svg" alt="Logo MeetAI" height={36} width={36}/>
                <p className="text-2xl font-semibold">Meet.AI</p>
            </Link>
        </SidebarHeader>
        <div className="px-4 py-2">
            <SidebarSeparator/>
        </div>

        <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        { firstSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathName == item.href && 
                                    "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                    )} isActive={pathName === item.href }>
                                    <Link href={item.href}>
                                        <item.icons className="size-5"/>
                                        <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-4 py-2">
                <SidebarSeparator/>
            </div>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        { secondSection.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton asChild className={cn(
                                    "h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B68]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50",
                                    pathName == item.href && 
                                    "bg-linear-to-r/oklch border-[#5D6B68]/10"
                                    )} isActive={pathName === item.href }>
                                    <Link href={item.href}>
                                        <item.icons className="size-5"/>
                                        <span className="text-sm font-medium tracking-tight">{item.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
           <DashboardUserButton />             
        </SidebarFooter>
    </Sidebar>
  );
}