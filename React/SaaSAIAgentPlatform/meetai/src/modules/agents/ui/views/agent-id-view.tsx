"use client";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdHeader } from "../components/agent-id-header";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "../../hooks/use-confirm";
import { useState } from "react";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Use State
    const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);

    const { data } = useSuspenseQuery( trpc.agents.getOne.queryOptions({ id: agentId }));

    // Handle remove agent
    const removeAgent = useMutation(
        trpc.agents.remove.mutationOptions({
            onSuccess: async () => {
                await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}));
                // TODO: Invalidate free tier agents query
                router.push("/agents");
            },
            onError: (error) => {
                console.error("Error removing agent:", error);
                toast.error(error.message || "Failed to remove agent");
            },
        }),
    );

    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are you sure?",
        `Removing '${data.name}' is permanent and cannot be undone, '${data.meetingCount}' meeting(s) associated will be removed too. Are you sure you want to proceed?`
    );

    const handleRemoveAgent = async () => {
        const ok = await confirmRemove();
        if (!ok) return;
        await removeAgent.mutateAsync({ id: agentId });
        toast.success("Agent removed successfully");
    }

    return (
        <>
        <RemoveConfirmation />   
        <UpdateAgentDialog 
            open={updateAgentDialogOpen} 
            onOpenChange={setUpdateAgentDialogOpen}
            initialValues={data}
        />     
        <div className="flex-1 py-4 px-4 md:px-6 flex flex-col gap-y-4">
            <AgentIdHeader 
                agentId={agentId} 
                agentName={data.name} 
                onEdit={() => setUpdateAgentDialogOpen(true)}
                onRemove={handleRemoveAgent}
            />
            <div className="bg-background rounded-lg border">
                <div className="flex px-4 py-5 gap-y-5 flex-col col-span-5">
                    <div className="flex items-center gap-x-3">
                        <GeneratedAvatar 
                            className="size-16 md:size-20" 
                            seed={data.name}
                            variant="botttsNeutral" 
                        />
                        <h2 className="text-xl font-semibold capitalize">{data.name}</h2>
                    </div>
                    <div className="flex flex-col">
                        <Badge className="text-sm flex items-center gap-x-2 [&>svg]:size-4" variant="outline">
                            <VideoIcon className="text-blue-700 dark:text-blue-100" />
                            {data.meetingCount} {data.meetingCount === 1 ? "Meeting" : "Meetings"}
                        </Badge>
                        <div className="flex flex-col gap-y-4">
                            <p className="text-lg font-medium">Instructions</p>
                            <p className="text-neutral-800 dark:text-neutral-400">{data.instructions}</p>

                        </div>
                    </div>
                    <div className="text-muted-foreground text-sm">
                        <p><strong>Created At:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
        </>

    );
}

export const AgentIdViewLoading = () => {
    return <LoadingState title="Loading Agent" description="This may take a few seconds to complete"/>
}
export const AgentIdViewError = () => {
    return <ErrorState title="Error Loading Agent" description="Please try again later"/>
}