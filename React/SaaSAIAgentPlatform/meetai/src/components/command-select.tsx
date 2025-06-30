"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
  CommandResponsiveDialog
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDownIcon } from "lucide-react";
import { ReactNode, useState } from "react";

interface Props {
    options: Array<{ id: string; value: string; children?: ReactNode}>;
    onSelect: (value: string) => void;
    onSearch?: (value: string) => void;
    value?: string;
    placeholder?: string;
    className?: string;
    isSearchable?: boolean;
};

export const CommandSelect = ({
    options,
    onSelect,
    onSearch,
    value,
    placeholder,
    className,
    isSearchable,
}: Props) => {

    const [open, setOpen ] = useState(false);
    const handleSelectOptions = options.find((option) => option.value === value);
    const handleOpenChange = (open: boolean)  => {
        onSearch?.("");
        setOpen(open);
    }

    return (
        <>
         <Button
         onClick={() => setOpen(true)}
        variant={"outline"}
        className={cn(
            "h-9 justify-between font-normal px-2",
            !handleSelectOptions && "text-muted-foreground",
            className,
        )}
         >
            <div>
                {handleSelectOptions?.children || placeholder}
            </div>
            <ChevronsUpDownIcon/>
         </Button>
         <CommandResponsiveDialog
          shouldFilter={!onSearch}
          open={open}
          onOpenChange={handleOpenChange}
         >
            <CommandInput placeholder="search..." onValueChange={onSearch}/>
            <CommandList>
                <CommandEmpty>
                    <span className="text-muted-foreground text-sm">
                        No options found
                    </span>
                </CommandEmpty>
                {options.map((option) =>(
                    <CommandItem key={option.id} onSelect={() => {
                        onSelect(option.value);
                        setOpen(false);
                    }}>
                        {option.children}
                    </CommandItem>
                ))}
            </CommandList>
         </CommandResponsiveDialog>
        </>
    );
}