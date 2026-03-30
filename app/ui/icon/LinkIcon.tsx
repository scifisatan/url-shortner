function LinkIcon() {
  return (
    <svg
      className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors duration-200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
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
  );
}

export default LinkIcon;
