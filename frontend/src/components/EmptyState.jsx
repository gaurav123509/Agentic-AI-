import { Inbox } from "lucide-react";

const EmptyState = ({ title, description }) => {
  return (
    <div className="card-surface p-10 text-center">
      <div className="mx-auto inline-flex rounded-full bg-paper p-4 text-ink">
        <Inbox size={24} />
      </div>
      <h3 className="mt-4 font-heading text-2xl font-bold text-ink">{title}</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink/65">{description}</p>
    </div>
  );
};

export default EmptyState;
