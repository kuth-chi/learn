import { ResponsiveDailog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDialogProps {
    open: boolean,
    onOpenChange: (open: boolean) => void,
    initialValues?: AgentGetOne,
}

export const UpdateAgentDialog = ({ 
    open, 
    onOpenChange,
    initialValues,
}: UpdateAgentDialogProps ) => {

    return ( 
        <ResponsiveDailog 
            title="Edit Agent" 
            description="Modify the agent's details below." 
            open={open} 
            onOpenChange={onOpenChange}
        > 
            <AgentForm 
                onSuccess={()=> onOpenChange(false)}
                onCancel={() => onOpenChange(false)}
                initialValues={initialValues}
            />
        </ResponsiveDailog>
    );
};