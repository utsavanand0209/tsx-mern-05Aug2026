interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-2 py-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="rounded-md border border-[#2a2f3a] px-3 py-2 font-mono text-sm text-[#c8ccd6] transition-colors hover:border-[#E0B84B] hover:text-[#E0B84B] disabled:opacity-30 disabled:hover:border-[#2a2f3a] disabled:hover:text-[#c8ccd6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0B84B]"
      >
        ← Prev
      </button>
      <span className="font-mono text-sm tracking-widest text-[#8b93a7]">
        Page <span className="text-[#E0B84B]">{page}</span> / {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="rounded-md border border-[#2a2f3a] px-3 py-2 font-mono text-sm text-[#c8ccd6] transition-colors hover:border-[#E0B84B] hover:text-[#E0B84B] disabled:opacity-30 disabled:hover:border-[#2a2f3a] disabled:hover:text-[#c8ccd6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0B84B]"
      >
        Next →
      </button>
    </nav>
  );
}
