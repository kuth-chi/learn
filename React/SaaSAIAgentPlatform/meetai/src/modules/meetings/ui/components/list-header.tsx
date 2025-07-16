"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { MeetingSearchFilters } from "./meeting-search-filters";
import { NewMeetingDialog } from "./new-meeting-dialog";
// import { AgentForm } from "./agent-form";

export const MeetingsListHeader = () => {
    // Filtering
    // const [ filters, setFilters ] = useAgentsFilters();
    // Handle new agent dialog
    const [isDialogOpen, setIsDialogOpen ] = useState(false);


    return (
        <>
        <NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Meetings</h5>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <PlusIcon />
                    New Meetings
                </Button>
            </div>
            <div className="flex items-center gap-x-2 p-1">
                <MeetingSearchFilters />
            </div>
        </div>
        </>
    );
};