"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { columns } from "../components/columns";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";

export const MeetingsView = () => {
    const trpc = useTRPC();
    const router = useRouter();
    const [ filters, setFilters ] = useMeetingsFilters();
    const { data } = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
            ...filters,
        }));

    return (
        <div className="flex-1 px-4 md:px-8 flex flex-col gap-y-4 overflow-y-scroll">
            <DataTable 
                data={data.items} 
                columns={columns}
                onRowClick={( row )=> router.push(`/meetings/${row.id}`)}
                />
            <DataPagination 
                page={filters.page}
                totalPage={data.totalPage}
                onPageChange={(page)=> setFilters({ page })}
            />
            {data.items.length === 0 && (
                <EmptyState title="Create Your First Agent" 
                    description="Create an agent to join your meetings, each agent will follow your instructions and can interact with arpticiepant during a call."/>
            )}
        </div>
    );
};

export const MeetingsViewLoading = () => {
    return <LoadingState title="Loading Meetings" description="This may take a few seconds to complete"/>
};
export const MeetingsViewError = () => {
    return <ErrorState title="Error Loading Meetings" description="Please try again later"/>
};