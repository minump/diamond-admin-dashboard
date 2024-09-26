'use client'

import { useState } from 'react'
import { defineStepper } from '@stepperize/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

const { Scoped, useStepper } = defineStepper(
  { id: 'base-image', title: 'Base Image' },
  { id: 'dependencies', title: 'Dependencies' },
  { id: 'environment', title: 'Environment Variables' },
  { id: 'commands', title: 'Build Commands' },
  { id: 'review', title: 'Review' }
)

const baseImageSchema = z.object({
  baseImage: z.string().min(1, 'Base image is required')
})

const dependenciesSchema = z.object({
  dependencies: z.string().optional()
})

const environmentSchema = z.object({
  environment: z.string().optional()
})

const commandsSchema = z.object({
  commands: z.string().min(1, 'At least one build command is required')
})

const reviewSchema = z.object({})

type FormData = z.infer<typeof baseImageSchema> &
  z.infer<typeof dependenciesSchema> &
  z.infer<typeof environmentSchema> &
  z.infer<typeof commandsSchema>

export function ImageBuilderStepper() {
  const [formData, setFormData] = useState<Partial<FormData>>({})
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(z.object({})),
    defaultValues: formData
  })

  const handleStepSubmit = (stepData: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...stepData }))
  }

  const handleFinalSubmit = async (data: FormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))
      console.log('Submitted data:', data)
      toast({
        title: 'Success',
        description: 'Image build configuration submitted successfully!',
        className: 'bg-green-500 text-white'
      })
    } catch (error) {
      console.error('Error submitting data:', error)
      toast({
        title: 'Error',
        description: 'Failed to submit image build configuration. Please try again.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Scoped>
      <StepperContent
        formData={formData}
        onStepSubmit={handleStepSubmit}
        onFinalSubmit={handleFinalSubmit}
        isLoading={isLoading}
      />
    </Scoped>
  )
}

function StepperContent({
  formData,
  onStepSubmit,
  onFinalSubmit,
  isLoading
}: {
  formData: Partial<FormData>
  onStepSubmit: (data: Partial<FormData>) => void
  onFinalSubmit: (data: FormData) => void
  isLoading: boolean
}) {
  const stepper = useStepper()
  const form = useForm<FormData>({
    resolver: zodResolver(z.object({})),
    defaultValues: formData
  })

  return (
    // <div className="w-full max-w-2xl mx-auto bg-card dark:bg-card/80 p-6 rounded-xl shadow-lg border border-border">
    <div className="bg-card dark:bg-card/80 shadow-lg rounded-xl p-6 border border-border">
      <div className="mb-8">
        <StepIndicator />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => {})}>
          {stepper.switch({
            'base-image': () => (
              <BaseImageStep
                onSubmit={(data) => {
                  onStepSubmit(data)
                  stepper.next()
                }}
                defaultValue={formData.baseImage}
              />
            ),
            dependencies: () => (
              <DependenciesStep
                onSubmit={(data) => {
                  onStepSubmit(data)
                  stepper.next()
                }}
                defaultValue={formData.dependencies}
              />
            ),
            environment: () => (
              <EnvironmentStep
                onSubmit={(data) => {
                  onStepSubmit(data)
                  stepper.next()
                }}
                defaultValue={formData.environment}
              />
            ),
            commands: () => (
              <CommandsStep
                onSubmit={(data) => {
                  onStepSubmit(data)
                  stepper.next()
                }}
                defaultValue={formData.commands}
              />
            ),
            review: () => (
              <ReviewStep
                formData={formData as FormData}
                onSubmit={() => onFinalSubmit(formData as FormData)}
                isLoading={isLoading}
              />
            )
          })}
        </form>
      </Form>
      <div className="mt-8 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={stepper.prev}
          disabled={stepper.isFirst || isLoading}
          className="bg-background dark:bg-background/80 text-foreground hover:bg-muted"
        >
          Previous
        </Button>
        {!stepper.isLast && (
          <Button
            type="button"
            onClick={stepper.next}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Next
          </Button>
        )}
      </div>
    </div>
  )
}

function StepIndicator() {
  const stepper = useStepper()
  return (
    <div className="flex justify-between">
      {stepper.all.map((step, index) => (
        <div
          key={step.id}
          className={`flex flex-col items-center ${
            index <= stepper.all.indexOf(stepper.current)
              ? 'text-primary'
              : 'text-muted-foreground'
          }`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 border-2 ${
              index <= stepper.all.indexOf(stepper.current)
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground bg-background text-muted-foreground'
            }`}
          >
            {index + 1}
          </div>
          <span className="text-sm">{step.title}</span>
        </div>
      ))}
    </div>
  )
}

function BaseImageStep({
  onSubmit,
  defaultValue
}: {
  onSubmit: (data: { baseImage: string }) => void
  defaultValue?: string
}) {
  const form = useForm<z.infer<typeof baseImageSchema>>({
    resolver: zodResolver(baseImageSchema),
    defaultValues: { baseImage: defaultValue || '' }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Base Image</h2>
      <FormField
        control={form.control}
        name="baseImage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Base Image</FormLabel>
            <FormControl>
              <Input placeholder="e.g., python:3.9-slim" {...field} />
            </FormControl>
            <FormDescription>
              Enter the base Docker image for your build
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function DependenciesStep({
  onSubmit,
  defaultValue
}: {
  onSubmit: (data: { dependencies: string }) => void
  defaultValue?: string
}) {
  const form = useForm<z.infer<typeof dependenciesSchema>>({
    resolver: zodResolver(dependenciesSchema),
    defaultValues: { dependencies: defaultValue || '' }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dependencies</h2>
      <FormField
        control={form.control}
        name="dependencies"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Dependencies</FormLabel>
            <FormControl>
              <Textarea
                placeholder="numpy==1.21.0&#10;pandas==1.3.0"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter your project dependencies, one per line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function EnvironmentStep({
  onSubmit,
  defaultValue
}: {
  onSubmit: (data: { environment: string }) => void
  defaultValue?: string
}) {
  const form = useForm<z.infer<typeof environmentSchema>>({
    resolver: zodResolver(environmentSchema),
    defaultValues: { environment: defaultValue || '' }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Environment Variables</h2>
      <FormField
        control={form.control}
        name="environment"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Environment Variables</FormLabel>
            <FormControl>
              <Textarea
                placeholder="DEBUG=1&#10;API_KEY=your_api_key"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter environment variables, one per line (KEY=VALUE)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function CommandsStep({
  onSubmit,
  defaultValue
}: {
  onSubmit: (data: { commands: string }) => void
  defaultValue?: string
}) {
  const form = useForm<z.infer<typeof commandsSchema>>({
    resolver: zodResolver(commandsSchema),
    defaultValues: { commands: defaultValue || '' }
  })

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Build Commands</h2>
      <FormField
        control={form.control}
        name="commands"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Build Commands</FormLabel>
            <FormControl>
              <Textarea
                placeholder="pip install -r requirements.txt&#10;python setup.py install"
                {...field}
              />
            </FormControl>
            <FormDescription>
              Enter build commands, one per line
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}

function ReviewStep({
  formData,
  onSubmit,
  isLoading
}: {
  formData: FormData
  onSubmit: () => void
  isLoading: boolean
}) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-foreground">Review</h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-semibold text-foreground">Base Image:</h3>
          <p className="bg-muted/50 dark:bg-muted p-2 rounded-md">{formData.baseImage}</p>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Dependencies:</h3>
          <pre className="bg-muted/50 dark:bg-muted p-2 rounded-md">{formData.dependencies}</pre>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Environment Variables:</h3>
          <pre className="bg-muted/50 dark:bg-muted p-2 rounded-md">{formData.environment}</pre>
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Build Commands:</h3>
          <pre className="bg-muted/50 dark:bg-muted p-2 rounded-md">{formData.commands}</pre>
        </div>
      </div>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          'Submit'
        )}
      </Button>
    </div>
  )
}