const StatCard = ({ label, value, accent = "bg-ink text-white", helper }) => {
  return (
    <div className="card-surface p-5">
      <div className={`inline-flex rounded-2xl px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${accent}`}>
        {label}
      </div>
      <div className="mt-5 font-heading text-4xl font-bold text-ink">{value}</div>
      {helper ? <p className="mt-3 text-sm leading-6 text-ink/60">{helper}</p> : null}
    </div>
  );
};

export default StatCard;
