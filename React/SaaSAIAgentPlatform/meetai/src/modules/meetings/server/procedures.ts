import { z } from "zod";
import { db } from "@/db";
import { meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentsInsertSchema, agentsUpdateSchema } from "../schemas";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE_NUMBER, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { TRPCError } from "@trpc/server";
// import { TRPCError } from "@trpc/server";


export const meetingsRouter = createTRPCRouter({
    // Update Agent
    update: protectedProcedure
        .input(agentsUpdateSchema)
        .mutation(async ({ input, ctx }) => {
            // Check if the agent exists and belongs to the authenticated user
            const [updatedAgent] = await db
                .update(agents)
                .set(input)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id), // Ensure the agent belongs to the authenticated user
                    ),
                )
                .returning();

            // If no agent was found, throw an error
            if (!updatedAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or does not belong to the authenticated user",
                });
            };
            // Return the updated agent
            return updatedAgent;
        }),

    // TODO: Remove  Agent
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation( async ({ input, ctx }) => {
            // Check if the agent exists and belongs to the authenticated user
            const [removeAgent] = await db
                .delete(agents)
                .where(
                    and(
                        eq(agents.id, input.id),
                        eq(agents.userId, ctx.auth.user.id), // Ensure the agent belongs to the authenticated user
                    ),
                )
                .returning();
            // If no agent was deleted, throw an error
            if (!removeAgent) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Agent not found or does not belong to the authenticated user",
                });
            }
            return removeAgent;
        }),

    // TODO: change getMany to use 'ProtectProcedure'
    // GetOne agent by Id
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db
                .select({
                    ...getTableColumns(meetings),
                })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.id, input.id),
                        eq(meetings.userId, ctx.auth.user.id), // Ensure the agent belongs to the authenticated user
                    )
                );

            // Check if the agent exists
            if (!existingMeeting) {
                throw new TRPCError({
                    code: "NOT_FOUND", 
                    message: "Meeting not found"
                });
            }
            // await new Promise((resolve) => setTimeout(resolve, 1000));
            // throw new TRPCError({ code: "BAD_REQUEST"});
            return existingMeeting;
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
                    ...getTableColumns(meetings),
                })
                .from(meetings)
                .where(
                    and(
                        ...[
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        ].filter(Boolean)
                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page -1) * pageSize);

            const [total] = await db
                .select({ count: count()})
                .from(meetings)
                .where(
                    and(
                        ...[
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        ].filter(Boolean)  
                    )
                );
            
            const totalPage = Math.ceil(total.count / pageSize)

            await new Promise((resolve) => setTimeout(resolve, 3000));
            // throw new TRPCError({ code: "BAD_REQUEST"}); // Uncomment to test error handling
            // Restructure return object with Object
            return {
                items:data ,
                total: total.count,
                totalPage,
            };
        }),

    // Create new agent
    create: protectedProcedure
        .input(agentsInsertSchema)
        .mutation(async ({ input, ctx }) => {
            // TODO:
            const [createdMeeting] = await db
                .insert(meetings)
                .values({
                    ...input,
                    meetingId: ctx.auth.user.id,
                })
                .returning();
            // Test
            // const { name, instructions } = input;
            // const { auth } = ctx;

            return createdMeeting;
        }),
});
