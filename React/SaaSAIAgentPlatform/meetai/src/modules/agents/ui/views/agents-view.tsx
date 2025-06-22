"use client";

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { DataPagination } from "../components/data-pagination";
import { useRouter } from "next/navigation";


export const AgentsView = () => {
    // Usser Router from Next/navigation
    const router = useRouter();
    const trpc = useTRPC();
    const [ filters, setFilters ] = useAgentsFilters();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));

    return (
        <div className="flex-1 px-4 md:px-8 flex flex-col gap-y-4 overflow-y-scroll">
            <DataTable 
                data={data.items} 
                columns={columns}
                onRowClick={( row )=> router.push(`/agents/${row.id}`)}
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

export const AgentsViewLoading = () => {
    return <LoadingState title="Loading Agents" description="This may take a few seconds to complete"/>
}
export const AgentsViewError = () => {
    return <ErrorState title="Error Loading Agents" description="Please try again later"/>
}