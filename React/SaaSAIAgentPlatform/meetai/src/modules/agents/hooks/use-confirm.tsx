import { ResponsiveDailog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { JSX, useState } from "react";


export const useConfirm = (
    title: string,
    description: string,
):[() => JSX.Element, () => Promise<unknown>] => {
    const [promise, setPromise ] = useState<({
        resolve: (value: boolean) => void;
    } | null )>(null);

    const confirm = () => {
        return new Promise((resolve) => {
            setPromise({ resolve });
        });
    };

    // Handle close 
    const handleClose = () => {
        setPromise(null);
    }

    // Handle confirm
    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    }

    // Handle cancel
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    }

    // Render the confirmation dialog
    const ConfirmationDialog = () => (
        <ResponsiveDailog 
            open={ promise !== null }
            onOpenChange={ handleClose }
            title={ title }
            description={ description }

        >
            
            <div className="flex flex-col-reverse gap-x-2 gap-y-2 pt-4 w-full lg:flex-row items-center justify-end">
                <Button
                    onClick={handleCancel}
                    className="w-full lg:w-auto"
                    variant={"outline"}
                >
                    Cancel
                </Button>
                <Button
                    onClick={ handleConfirm }
                    className="w-full lg:w-auto"
                >
                    Confirm
                </Button>
            </div>
            
        </ResponsiveDailog>
    );

    return [ConfirmationDialog, confirm];
};