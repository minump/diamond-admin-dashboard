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
import { Select } from "@/components/ui/select"
// Assuming these are the functions that interface with your backend to execute the tasks
import { singleNodeTask, registerContainer, multiNodeTask } from "@/lib/taskHandlers"

const formSchema = z.object({
  taskType: z.enum(['singleNode', 'registerContainer', 'multiNode']),
  jobName: z.string().min(2, {
    message: "Job name must be at least 2 characters.",
  }),
  params: z.string().min(2, {
    message: "Params must be at least 2 characters.",
  }),
})

export function JobComposerForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: 'singleNode',
      jobName: "",
      params: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      switch (values.taskType) {
        case 'singleNode':
          await singleNodeTask(values);
          break;
        case 'registerContainer':
          await registerContainer(values);
          break;
        case 'multiNode':
          await multiNodeTask(values);
          break;
        default:
          console.error('Invalid task type');
      }
      console.log('Task triggered successfully');
    } catch (error) {
      console.error('Error triggering task:', error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="taskType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Task Type</FormLabel>
              <FormControl>
                <Select {...field}>
                  <option value="singleNode">Single Node Task</option>
                  <option value="registerContainer">Register Container Task</option>
                  <option value="multiNode">Multi Node Task</option>
                </Select>
              </FormControl>
              <FormDescription>
                Select the type of task you want to execute.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="jobName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Name</FormLabel>
              <FormControl>
                <Input placeholder="Job name" {...field} />
              </FormControl>
              <FormDescription className="self-end justify-end">
                This is your job's name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="params"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Params</FormLabel>
              <FormControl>
                <Input placeholder="Job params" {...field} />
              </FormControl>
              <FormDescription>
                This is your job's params.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}