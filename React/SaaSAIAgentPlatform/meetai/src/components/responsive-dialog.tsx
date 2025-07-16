
"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription

} from "@/components/ui/drawer";
import React from "react";

interface ResponsiveDailogProps {
    title: string,
    description: string,
    children: React.ReactNode;
    open: boolean,
    onOpenChange: (open: boolean) => void;

}

export const ResponsiveDailog = ({
    title,
    description,
    children,
    open,
    onOpenChange,
}: ResponsiveDailogProps) => {
    const isMobile = useIsMobile();

    // Return Drawer instead of Dailog when detected device is mobile
    if(isMobile){
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>
                            {title}
                        </DrawerTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DrawerHeader>
                    <div className="p-4">
                        {children}
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DrawerDescription>{description}</DrawerDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );

};
