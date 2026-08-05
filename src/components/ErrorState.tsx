interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center gap-4 py-24 text-center px-4">
      <div className="h-14 w-14 rounded-full border-2 border-[#CE6262] flex items-center justify-center font-mono text-2xl text-[#CE6262]">
        !
      </div>
      <p className="font-mono text-sm uppercase tracking-widest text-[#CE6262]">Transmission failed</p>
      <p className="max-w-md text-[#8b93a7]">{message}</p>
      <button
        onClick={onRetry}
        className="mt-2 rounded-md border border-[#E0B84B] px-5 py-2 font-mono text-sm uppercase tracking-widest text-[#E0B84B] transition-colors hover:bg-[#E0B84B] hover:text-[#0d0f14] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0B84B]"
      >
        Retry
      </button>
    </div>
  );
}
