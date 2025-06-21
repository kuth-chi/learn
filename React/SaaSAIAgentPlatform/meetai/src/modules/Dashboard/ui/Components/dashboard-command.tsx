import { CommandResponsiveDialog, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}
const DashboardCommand = ({open, setOpen}: Props) =>{
    return (
        <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
            <CommandInput autoFocus placeholder="Find a meetings or agent"/>
            <CommandList>
                <CommandItem>
                    Test result...
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    );
}

export default DashboardCommand;