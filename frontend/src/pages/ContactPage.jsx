import { LifeBuoy, Mail, MapPin } from "lucide-react";

import SectionHeading from "../components/SectionHeading";

const contactItems = [
  {
    icon: Mail,
    title: "Project inbox",
    value: "hello@mailpilot.ai",
    copy: "Use this slot for support, stakeholder questions, or handoff requests.",
  },
  {
    icon: LifeBuoy,
    title: "API support",
    value: "REST-friendly architecture",
    copy: "Axios services are isolated so endpoint changes stay localized and predictable.",
  },
  {
    icon: MapPin,
    title: "Deployment-ready",
    value: "Frontend + backend separation",
    copy: "Keep the backend base URL in one service file and move between environments cleanly.",
  },
];

const ContactPage = () => {
  return (
    <div className="section-shell space-y-8">
      <SectionHeading
        eyebrow="Contact"
        title="Ready for the next layer of product polish"
        description="This frontend is structured so you can add auth, more dashboard slices, or richer workflow actions without rewriting the foundation."
      />

      <div className="grid gap-5 md:grid-cols-3">
        {contactItems.map(({ icon: Icon, title, value, copy }) => (
          <div className="card-surface p-6" key={title}>
            <div className="mb-5 inline-flex rounded-2xl bg-coral/10 p-3 text-coral">
              <Icon size={20} />
            </div>
            <h3 className="font-heading text-2xl font-bold text-ink">{title}</h3>
            <p className="mt-2 text-sm font-semibold text-sea">{value}</p>
            <p className="mt-3 text-sm leading-7 text-ink/65">{copy}</p>
          </div>
        ))}
      </div>

      <div className="card-surface overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="bg-ink p-8 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/60">
              Production checklist
            </p>
            <ul className="mt-5 space-y-3 text-sm leading-7 text-white/80">
              <li>Set `VITE_API_BASE_URL` per environment</li>
              <li>Point CORS `CLIENT_URL` to the frontend deployment</li>
              <li>Use the shared Axios client for all backend requests</li>
              <li>Expand dashboard cards as new REST resources arrive</li>
            </ul>
          </div>
          <div className="bg-white p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-ink/45">
              Why this structure works
            </p>
            <p className="mt-4 text-sm leading-7 text-ink/70">
              Pages focus on data orchestration. Components stay reusable and visual. Services own
              the HTTP layer. That balance makes the app easy to reason about when backend contracts
              evolve or the product grows.
            </p>
            <div className="mt-6 rounded-[24px] bg-paper px-5 py-5 text-sm leading-7 text-ink/70">
              If you later add authentication, role-based dashboards, or team inboxes, this
              structure scales cleanly without forcing a redesign of the whole frontend.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
