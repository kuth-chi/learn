"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { AgentSearchFilters } from "./agent-search-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
// import { AgentForm } from "./agent-form";

const AgentListHeader = () => {
    // Filtering
    // const [ filters, setFilters ] = useAgentsFilters();
    // Handle new agent dialog
    const [isDialogOpen, setIsDialogOpen ] = useState(false);


    return (
        <>
        <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon />
                    New Agent
                </Button>
            </div>
            <ScrollArea>
                <div className="flex items-center gap-x-2 p-1">
                    <AgentSearchFilters />
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
       
        </div>
        </>
    );
};

export default AgentListHeader;