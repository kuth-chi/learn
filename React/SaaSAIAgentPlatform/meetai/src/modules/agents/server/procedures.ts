import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
// import { TRPCError } from "@trpc/server";


export const agentsRouter = createTRPCRouter({
    // TODO: change getMany to use 'ProtectProcedure'

    // GetOne agent by Id
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input }) => {
            const [existingAgent] = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`COUNT(meetings.id)`,
                })
                .from(agents)
                .where(eq(agents.id, input.id));
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // throw new TRPCError({ code: "BAD_REQUEST"});
            return existingAgent;
        }),

    // Get all agents
    getMany: protectedProcedure
        .input(
            z
                .object({
                    page: z.number().default(DEFAULT_PAGE_NUMBER),
                    pageSize: z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
                    search: z.string().nullish(),
                })
        )
        .query(async ({ ctx, input }) => {
            const {search, page, pageSize } = input;
            const data = await db
                .select({
                    ...getTableColumns(agents),
                    meetingCount: sql<number>`1`,
                })
                .from(agents)
                .where(
                    and(
                        ...[
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                        ].filter(Boolean)
                    )
                )
                .orderBy(desc(agents.createdAt), desc(agents.id))
                .limit(pageSize)
                .offset((page -1) * pageSize);

            const [total] = await db
                .select({ count: count()})
                .from(agents)
                .where(
                    and(
                        ...[
                        eq(agents.userId, ctx.auth.user.id),
                        search ? ilike(agents.name, `%${search}%`) : undefined,
                        ].filter(Boolean)  
                    )
                );
            
            const totalPage = Math.ceil(total.count / pageSize)

            await new Promise((resolve) => setTimeout(resolve, 3000));
            // throw new TRPCError({ code: "BAD_REQUEST"});
            // Restructure return object with Object
            return {
                items:data ,
                total: total.count,
                totalPage,
            };
        }),

    // Get Many by User
    getManyByUser: protectedProcedure.query(async () => {

        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user.id) {
            throw new Error("User ID is missing from session.");
        }
        const existingAgentsByUser = await db
            .select()
            .from(agents)
            .where(eq(agents.userId, session.user.id));
        return existingAgentsByUser;
    }),

    // Create new agent
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // TODO:
            const [createdAgent] = await db
                .insert(agents)
                .values({
                    ...input,
                    userId: ctx.auth.user.id,
                })
                .returning();
            // Test
            // const { name, instructions } = input;
            // const { auth } = ctx;

            return createdAgent;
        }),
});
