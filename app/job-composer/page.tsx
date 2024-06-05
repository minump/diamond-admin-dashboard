import { JobComposerForm } from "./form";

export default async function JobComposerPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 m-8 md:gap-8 md:p-6 items-start">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">Job Composer</h1>
      </div>
      <div className="flex flex-2 flex-col items-center gap-2 px-8 w-full">
        <JobComposerForm />
      </div>
    </main>
  );
}