const LoadingSpinner = ({ label = "Loading..." }) => {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-ink/60">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-ink/20 border-t-coral" />
      <span>{label}</span>
    </div>
  );
};

export default LoadingSpinner;
