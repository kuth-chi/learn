"use client";

import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";

export const HomePageView = () => {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.hello.queryOptions({text: "Kuth Chi"}));
  return (
    <div className="flex flex-col p-4 gap-y-4">
      {data?.greeting}
    </div>
  );
}