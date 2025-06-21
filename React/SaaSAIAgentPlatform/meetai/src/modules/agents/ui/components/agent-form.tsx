import { z } from "zod";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useTRPC } from "@/trpc/client";
import { agentsInsertSchema } from "../../schemas";
import { AgentGetOne } from "../../types";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormLabel, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

interface AgentFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
    initialValues?: AgentGetOne;
}

export const AgentForm = ({
    onSuccess,
    onCancel,
    initialValues
}: AgentFormProps) => {

    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();

    // Define create agent function
    const createAgent = useMutation(
        trpc.agents.create.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries(
                trpc.agents.getMany.queryOptions({}),
            );
            if(initialValues?.id){
                queryClient.invalidateQueries(
                    trpc.agents.getOne.queryOptions({ id: initialValues.id }),
                )
            };
            onSuccess?.();
        },
        onError: (error) => {
            toast.error(error.message);
            
            // TODO: Check if error code is "FORBIDENT", redirect to "/upgrade"
        },

        }),
    );

    const form = useForm<z.infer<typeof agentsInsertSchema>>({
        resolver: zodResolver(agentsInsertSchema),
        defaultValues: {
            name: initialValues?.name ?? "",
            instructions: initialValues?.instructions ?? "",
        },
    });

    const isEditMode = !!initialValues?.id;
    const isPending = createAgent.isPending ;//|| updateAgent.isPending;

    const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
        if(isEditMode) {
            // simulate editing mode
            console.log("Edit form is enabled to update agent");
        } else {
            createAgent.mutate(values);
        };
    };

    return (
        <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                <GeneratedAvatar 
                    seed={form.watch("name")} 
                    variant="botttsNeutral" 
                    className="border size-16"
                />
                <FormField 
                    name ="name" 
                    control ={form.control}
                    render ={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} placeholder="e.g Sok Sothavy" />
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <FormField 
                    name ="instructions" 
                    control ={form.control}
                    render ={({ field }) => (
                        <FormItem>
                            <FormLabel>Instructions</FormLabel>
                            <FormControl>
                                <Textarea 
                                {...field} 
                                placeholder="you are a helpful assistant that can answer questions and help with assingments." />
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