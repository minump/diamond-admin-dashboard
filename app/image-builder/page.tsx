import { is_authenticated } from '@/lib/authUtils'
import { ImageBuilderStepper } from './stepper'

export default async function ImageBuilderPage() {
  const isAuthenticated = await is_authenticated()
  
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 lg:p-8 items-start bg-background dark:bg-background/90">
      <div className="w-full max-w-4xl mx-auto md:mx-10">
        <h1 className="font-bold text-2xl md:text-3xl lg:text-4xl mb-6 text-foreground text-left">Image Builder Debugger</h1>
        {/* <div className="bg-card dark:bg-card/80 shadow-lg rounded-lg p-6"> */}
          <ImageBuilderStepper />
        {/* </div> */}
      </div>
    </main>
  )
}