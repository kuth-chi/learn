import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { meetingsInsertSchema } from "../../schemas";
import { Input } from "@/components/ui/input";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { MeetingGetOne } from "../../types";
import { useState } from "react";
import { CommandSelect } from "@/components/command-select";
import { GeneratedAvatar } from "@/components/generated-avatar";

interface MeetingFormProps {
    onSuccess?: (id?: string ) => void;
    onCancel?: () => void;
    initialValues?: MeetingGetOne;
}

export const MeetingForm = ({
    onSuccess,
    onCancel,
    initialValues
}: MeetingFormProps) => {

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();
    
    const [open, setOpent] = useState(false);
    const [agentSearch, setAgentSearch] = useState("");
    // Get all agents for the select input or command input
    const agents = useQuery(
        trpc.agents.getMany.queryOptions({
            pageSize: 100,
            search: agentSearch,
        }),
    );
    // Define create agent function
    const createMeeting = useMutation(
        trpc.meetings.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({}),
            );

            // Invalidate free tier agents query
            onSuccess?.();
            },
            onError: (error) => {
                toast.error(error.message);
                
                // TODO: Check if error code is "FORBIDENT", redirect to "/upgrade"
            },

        }),
    );

    // Define update agent function
    const updateMeeting = useMutation(
        trpc.meetings.update.mutationOptions({
        onSuccess: (data) => {
            queryClient.invalidateQueries(
                trpc.meetings.getMany.queryOptions({}),
            );
            if(initialValues?.id){
                queryClient.invalidateQueries(
                    trpc.meetings.getOne.queryOptions({ id: initialValues.id }),
                )
            };
            onSuccess?.(data.id);
        },
        onError: (error) => {
            toast.error(error.message);
            
            // TODO: Check if error code is "FORBIDENT", redirect to "/upgrade"
        },

        }),
    );

    const form = useForm<z.infer<typeof meetingsInsertSchema>>({
        resolver: zodResolver(meetingsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            agentId: initialValues?.agentId ?? "",
        },
    });

    const isEditMode = !!initialValues?.id;
    const isPending = createMeeting.isPending || updateMeeting.isPending;

    const onSubmit = (values: z.infer<typeof meetingsInsertSchema>) => {
        if(isEditMode) {
            // simulate editing mode
            updateMeeting.mutate({
                id: initialValues?.id,
                ...values,
            });
            console.log("Edit form is enabled to update meeting");
            
        } else {
            createMeeting.mutate(values);
        };
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                    name ="name" 
                    control ={form.control}
                    render ={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g Math Consultation" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    name ="agentId" 
                    control ={form.control}
                    render ={({ field }) => (
                        <FormItem>
                            <FormLabel>Agent</FormLabel>
                            <FormControl>
                                <CommandSelect 
                                    options={(agents.data?.items ?? []).map((agent) => ({
                                        id: agent.id,
                                        value: agent.id,
                                        children: (
                                            <div className="flex items-center gap-x-2">
                                                <GeneratedAvatar 
                                                   variant="botttsNeutral"
                                                   seed={agent.name}
                                                   className="size-6 border"
                                                />
                                                <span>{agent.name}</span>
                                            </div>
                                        )
                                    }))}
                                    onSelect={field.onChange}
                                    onSearch={setAgentSearch}
                                    value={field.value}
                                    placeholder="Select an agent"
                                />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <div className="flex justify-between gap-x-2">
                    {onCancel && (
                        <Button
                            variant="ghost"
                            disabled={isPending}
                            type="button"
                            onClick={() => onCancel()}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button disabled={isPending} type="submit">
                        {isEditMode ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
};