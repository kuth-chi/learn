"use client";

import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AgentIdHeader } from "../components/agent-id-header";
import { Badge } from "@/components/ui/badge";
import { VideoIcon } from "lucide-react";

interface Props {
    agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery( trpc.agents.getOne.queryOptions({ id: agentId }));

    return (
        <>        
        <div className="flex-1 py-4 px-4 md:px-6 flex flex-col gap-y-4">
            <AgentIdHeader 
                agentId={agentId} 
                agentName={data.name} 
                onEdit={() => {}}
                onRemove={() => {}}
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