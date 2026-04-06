import { AlertTriangle } from "lucide-react";

const ErrorAlert = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="rounded-[24px] border border-coral/20 bg-coral/10 px-5 py-4 text-sm text-coral">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 shrink-0" size={18} />
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ErrorAlert;
