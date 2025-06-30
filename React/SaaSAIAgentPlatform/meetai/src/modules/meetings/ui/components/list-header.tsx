"use client";

import { useState } from "react";
import { PlusIcon, XCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { NewMeetingDialog } from "./new-meeting-dialog";
import { MeetingsSearchFilters } from "./meetings-search-filters";
import { StatusFilter } from "./status-filter";
import { AgentIdFilter } from "./agent-id-filter";
import { useMeetingsFilters } from "../../hooks/use-meeting-search-filters";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { DEFAULT_PAGE_NUMBER } from "@/constants";
// import { AgentForm } from "./agent-form";

export const MeetingsListHeader = () => {
    // Filtering
    const [ filters, setFilters ] = useMeetingsFilters();
    // Handle new agent dialog
    const [isDialogOpen, setIsDialogOpen ] = useState(false);

    const isAnyFilterModified = 
        !!filters.status || !!filters.search || !!filters.agentId;

    const onClearedFilter = () => {
        setFilters({
            page: DEFAULT_PAGE_NUMBER,
            status: null,
            search: "",
            agentId: "",
        });
    };


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
            <ScrollArea >
                <div className="flex items-center gap-x-2 p-1">
                    <MeetingsSearchFilters />
                    <StatusFilter />
                    <AgentIdFilter />
                    {isAnyFilterModified && (
                        <Button 
                            variant={"outline"}
                            onClick={onClearedFilter}
                        >
                            <XCircleIcon className="size-4" />
                        </Button>
                    )}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
        </>
    );
};