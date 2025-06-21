
import type { SearchParams } from "nuqs";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import AgentListHeader from "@/modules/agents/ui/components/list-header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
    searchParam: Promise<SearchParams>;
}

const Page = async ({ searchParam }: Props) => {
    const filters = await loadSearchParams(searchParam);
    // Project Unauthorized user
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session){
        redirect("/sign-in");
    }
    // Deal TRPC with Server
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
        ...filters,
    }));
    return (
        <>
        <AgentListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsViewLoading />}>
                <ErrorBoundary fallback={<AgentsViewError />}>
                    <AgentsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    );
};

export default Page;