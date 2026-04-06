const Footer = () => {
  return (
    <footer className="section-shell pb-8">
      <div className="card-surface flex flex-col gap-4 px-6 py-6 text-sm text-ink/65 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-lg font-bold text-ink">MailPilot AI</p>
          <p>Modern triage, action planning, and AI-assisted inbox operations.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="badge-pill bg-ink/5 text-ink/70">React</span>
          <span className="badge-pill bg-coral/10 text-coral">Tailwind CSS</span>
          <span className="badge-pill bg-sea/10 text-sea">REST Ready</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
