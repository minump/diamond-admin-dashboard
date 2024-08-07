'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
// Assuming these are the functions that interface with your backend to execute the tasks
import {
  singleNodeTask,
  registerContainer,
  multiNodeTask
} from '@/lib/taskHandlers';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

const formSchema = z.object({
  taskType: z.enum(['singleNode', 'registerContainer', 'multiNode']),
  jobName: z.string().min(2, {
    message: 'Job name must be at least 2 characters.'
  }),
  endpoint: z.string().optional(),
  container_id: z.string().optional(),
  task: z.string().optional(),
  base_image: z.string().optional(),
  image_file_name: z.string().optional(),
  work_path: z.string().optional()
});

export function ImageManagerForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskType: 'singleNode',
      jobName: 'registerContainer'
    }
  });

  const [endpoints, setEndpoints] = useState<
    { endpoint_uuid: string; endpoint_name: string }[]
  >([]);

  useEffect(() => {
    async function fetchEndpoints() {
      try {
        const response = await fetch('/api/list_active_endpoints');
        const data = await response.json();
        setEndpoints(data);
      } catch (error) {
        console.error('Error fetching endpoints:', error);
      }
    }
    fetchEndpoints();
    console.log('Endpoints:', endpoints);
  }, []);

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
          console.log('response after register container:', response);
          if (response !== null) {
            console.log('response in form:', response);
            toast({
              title: 'Success',
              description: response.message
            });
          }
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
          name="endpoint"
          render={({ field }) => (
            <FormItem className="w-[60%] md:w-[20%]">
              <FormLabel>Endpoint</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select endpoint" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {endpoints.length > 0 ? (
                    endpoints.map((endpoint) => (
                      <SelectItem
                        key={endpoint.endpoint_uuid}
                        value={endpoint.endpoint_uuid}
                      >
                        {endpoint.endpoint_name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="none" disabled>
                      No endpoints available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
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

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
