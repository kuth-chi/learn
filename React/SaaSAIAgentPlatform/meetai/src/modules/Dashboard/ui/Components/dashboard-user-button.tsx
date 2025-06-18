import { authClient } from "@/lib/auth-client";
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger, 

} from "@/components/ui/dropdown-menu"
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import GeneratedAvatar from "@/components/generated-avatar";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";

const DashboardUserButton = () => {
    const router = useRouter();
    const onLogout = () => {
        authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/sign-in");
                }
            }
        });
    };
    const { data, isLoading } = authClient.useSession();
    if(isLoading || !data?.user ){
        return null;
    }
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
                { data.user.image ? (
                    <Avatar className="mr-3">
                        <AvatarImage src={data.user.image} />
                    </Avatar>
                ): (
                    <GeneratedAvatar 
                    seed={data.user.name} 
                    variant="initials" 
                    className="size-9 mr-3"/>
                )}
                <div className="flex flex-col gap-0.3 text-left overflow-hidden flex-1 min-w-0">
                    <p className="text-sm truncate w-full font-medium">
                        {data.user.name}
                    </p>
                    <p className="text-xm truncate w-full">
                        {data.user.email}
                    </p>
                </div>
                <ChevronDownIcon className="size-4 shrink-0"/>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="right" className="w-72">
                <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                        <span className="font-medium truncate">
                            {data.user.name}
                        </span>
                        <span className="text-xs font-normal text-muted-foreground truncate">
                            {data.user.email}
                        </span>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem className="flex items-center justify-between cursor-pointer">
                        Billing 
                    <CreditCardIcon className="size-4"/>
                </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="flex items-center justify-between cursor-pointer">
                        Logout 
                    <LogOutIcon className="size-4"/>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default DashboardUserButton;