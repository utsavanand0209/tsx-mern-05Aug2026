export default function Loader({ label = 'Loading characters…' }: { label?: string }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-4 py-24">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-2 border-[#2a2f3a]" />
        <div className="absolute inset-0 rounded-full border-2 border-t-[#E0B84B] border-r-transparent border-b-transparent border-l-transparent animate-spin" />
      </div>
      <p className="font-mono text-sm tracking-widest text-[#8b93a7] uppercase">{label}</p>
    </div>
  );
}
