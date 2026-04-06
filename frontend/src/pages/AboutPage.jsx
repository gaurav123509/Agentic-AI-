import { Database, LayoutPanelTop, ShieldCheck, Sparkles } from "lucide-react";

import SectionHeading from "../components/SectionHeading";

const capabilities = [
  {
    icon: Sparkles,
    title: "AI-first workflow",
    description:
      "The frontend is optimized for email triage flows where the response payload includes summaries, priorities, draft replies, calendar suggestions, and tasks.",
  },
  {
    icon: LayoutPanelTop,
    title: "Reusable structure",
    description:
      "UI elements are split into components, while route-level pages stay focused on composition and orchestration.",
  },
  {
    icon: Database,
    title: "REST-ready services",
    description:
      "Axios integrations live in dedicated service files so backend URLs, interceptors, and endpoint methods stay easy to manage.",
  },
  {
    icon: ShieldCheck,
    title: "Resilient experience",
    description:
      "Loading states, empty states, and error messaging are built in so production failures are visible without breaking the interface.",
  },
];

const AboutPage = () => {
  return (
    <div className="section-shell space-y-8">
      <SectionHeading
        eyebrow="About"
        title="A polished React frontend built to sit comfortably on top of your API"
        description="MailPilot AI pairs a modern visual system with a service-driven frontend architecture. It is designed for teams that want a crisp experience without losing API flexibility."
      />

      <div className="grid gap-5 md:grid-cols-2">
        {capabilities.map(({ icon: Icon, title, description }) => (
          <div className="card-surface p-6" key={title}>
            <div className="mb-5 inline-flex rounded-2xl bg-ink p-3 text-white">
              <Icon size={20} />
            </div>
            <h3 className="font-heading text-2xl font-bold text-ink">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-ink/65">{description}</p>
          </div>
        ))}
      </div>

      <div className="card-surface p-8">
        <h3 className="font-heading text-2xl font-bold text-ink">Included API integration patterns</h3>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] bg-ink p-5 text-sm text-white">
            <p className="font-semibold uppercase tracking-[0.24em] text-white/60">
              Real backend usage
            </p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-white/80">
{`POST /api/emails/analyze
GET /api/emails/history
POST /api/emails/execute-action`}
            </pre>
          </div>
          <div className="rounded-[24px] bg-paper p-5 text-sm text-ink/75">
            <p className="font-semibold uppercase tracking-[0.24em] text-ink/50">
              Sample generic REST usage
            </p>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-6 text-ink/75">
{`GET /api/data
POST /api/submit`}
            </pre>
            <p className="mt-4 text-xs leading-6 text-ink/55">
              These sample helper methods are included in the dedicated service layer so future
              integrations remain straightforward.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
