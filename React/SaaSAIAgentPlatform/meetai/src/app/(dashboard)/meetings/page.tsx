import { auth } from "@/lib/auth";
import type { SearchParams } from "nuqs/server";
import { MeetingsListHeader } from "@/modules/meetings/ui/components/list-header";
import { MeetingsView, MeetingsViewError, MeetingsViewLoading } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { loadSearchParams } from "@/modules/meetings/params";


interface Props {
    SearchParams: Promise<SearchParams>;
}

const Page = async ({ SearchParams }: Props ) => {
    const filters = await loadSearchParams(SearchParams);
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const queryClient = getQueryClient();
    
    // Preload any necessary data here if needed
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({
            ...filters
        })
    );

    return (
        <>
        <MeetingsListHeader />
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<MeetingsViewLoading />}>
                <ErrorBoundary fallback={<MeetingsViewError />}>
                    {/* Render the MeetingsView component */}
                    <MeetingsView />
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
        </>
    );
}
export default Page;