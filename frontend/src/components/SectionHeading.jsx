const SectionHeading = ({ eyebrow, title, description, align = "left" }) => {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow ? (
        <span className="badge-pill bg-white text-ink/70 shadow-soft">{eyebrow}</span>
      ) : null}
      <h2 className="max-w-3xl font-heading text-3xl font-bold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-7 text-ink/70">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
