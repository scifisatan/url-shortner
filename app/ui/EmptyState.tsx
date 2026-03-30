function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl">
      <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
        <svg
          className="w-5 h-5 text-zinc-600"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 1 0-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
      <p className="text-sm font-medium text-zinc-500">No links yet</p>
      <p className="text-xs text-zinc-600 mt-1">Shorten your first URL above</p>
    </div>
  );
}

export default EmptyState;
