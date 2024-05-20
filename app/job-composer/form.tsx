"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
// Assuming these are the functions that interface with your backend to execute the tasks
import { singleNodeTask, registerContainer, multiNodeTask } from "@/lib/taskHandlers"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  taskType: z.enum(['singleNode', 'registerContainer', 'multiNode']),
  jobName: z.string().min(2, {
    message: "Job name must be at least 2 characters.",
  }),
  endpoint: z.string().optional(),
  container_id: z.string().optional(),
  task: z.string().optional(),
  base_image: z.string().optional(),
  image_file_name: z.string().optional(),
  work_path: z.string().optional(),
});

export function JobComposerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: 'singleNode',
      jobName: "registerContainer",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let response;
      switch (values.taskType) {
        case 'singleNode':
          response = await singleNodeTask({
            endpoint: values.endpoint,
            container_id: values.container_id,
            task: values.task
          });
          break;
        case 'registerContainer':
          response = await registerContainer({
            base_image: values.base_image,
            image_file_name: values.image_file_name,
            endpoint: values.endpoint,
            work_path: values.work_path
          });
          break;
        case 'multiNode':
          response = await multiNodeTask({
            endpoint: values.endpoint,
            container_id: values.container_id,
            task: values.task
          });
          break;
        default:
          console.error('Invalid task type');
          return;
      }
      console.log('Task triggered successfully:', response);
    } catch (error) {
      console.error('Error triggering task:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem className="w-[60%] md:w-[20%]">
              <FormLabel>Task Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select task type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="singleNode">Single Node Task</SelectItem>
                  <SelectItem value="registerContainer">Register Container Task</SelectItem>
                  <SelectItem value="multiNode">Multi Node Task</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Select the type of task you want to execute.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.watch('taskType') === 'singleNode' && (
          <>
            <FormField
              control={form.control}
              name="endpoint"
              render={({ field }) => (
                <FormItem className="w-[60%] md:w-[20%]">
                  <FormLabel>Endpoint</FormLabel>
                  <Input placeholder="Endpoint URL" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="container_id"
              render={({ field }) => (
                <FormItem className="w-[60%] md:w-[20%]">
                  <FormLabel>Container ID</FormLabel>
                  <Input placeholder="Container ID" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem className="w-[80%] md:w-[50%]">
                  <FormLabel>Task</FormLabel>
                  <Textarea placeholder="Task details" {...field} />
                </FormItem>
              )}
            />
          </>
        )}

        {form.watch('taskType') === 'registerContainer' && (
          <>
            <FormField
              control={form.control}
              name="base_image"
              render={({ field }) => (
                <FormItem className="w-[60%] md:w-[20%]">
                  <FormLabel>Base Image</FormLabel>
                  <Input placeholder="Base Image URL" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image_file_name"
              render={({ field }) => (
                <FormItem className="w-[60%] md:w-[20%]">
                  <FormLabel>Image File Name</FormLabel>
                  <Input placeholder="Image File Name" {...field} />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="work_path"
              render={({ field }) => (
                <FormItem className="w-[60%] md:w-[20%]">
                  <FormLabel>Work Path</FormLabel>
                  <Input placeholder="Work Path" {...field} />
                </FormItem>
              )}
            />
          </>
        )}

        {form.watch('taskType') === 'multiNode' && (
          <>
          <FormField
            control={form.control}
            name="endpoint"
            render={({ field }) => (
              <FormItem className="w-[60%] md:w-[20%]">
                <FormLabel>Endpoint</FormLabel>
                <Input placeholder="Endpoint URL" {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="container_id"
            render={({ field }) => (
              <FormItem className="w-[60%] md:w-[20%]">
                <FormLabel>Container ID</FormLabel>
                <Input placeholder="Container ID" {...field} />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="task"
            render={({ field }) => (
              <FormItem className="w-[80%] md:w-[50%]">
                <FormLabel>Task</FormLabel>
                <Textarea placeholder="Task details" {...field} />
              </FormItem>
            )}
          />
        </>
        )}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}