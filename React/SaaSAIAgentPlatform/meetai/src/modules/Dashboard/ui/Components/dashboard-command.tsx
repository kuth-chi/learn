import { CommandDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
const DashboardCommand = ({open, setOpen}: Props) =>{
    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Find a meetings or agent"/>
            <CommandList>
                <CommandItem>
                    Test result...
                </CommandItem>
            </CommandList>
        </CommandDialog>
    );
}

export default DashboardCommand;