import { ArrowRight, Bot, ChartColumnIncreasing, SendHorizonal } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="section-shell grid gap-8 pt-6 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:pt-10">
      <div className="space-y-6">
        <span className="badge-pill bg-white text-ink shadow-soft">AI-Powered Inbox Command</span>
        <div className="space-y-4">
          <h1 className="max-w-3xl font-heading text-4xl font-bold leading-tight text-ink sm:text-5xl xl:text-6xl">
            Triage every email with calm, clarity, and a dashboard your team actually wants to use.
          </h1>
          <p className="max-w-2xl text-base leading-8 text-ink/70 sm:text-lg">
            MailPilot AI turns raw emails into priorities, draft replies, calendar suggestions, and
            task lists. Plug it into your REST backend and move from inbox chaos to action in one
            smooth workflow.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-4 text-sm font-semibold text-white transition hover:bg-sea"
            href="#analyze"
          >
            Analyze an Email
            <ArrowRight size={18} />
          </a>
          <Link
            className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-6 py-4 text-sm font-semibold text-ink transition hover:border-coral/40 hover:text-coral"
            to="/dashboard"
          >
            Open Dashboard
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: Bot,
              title: "Smart Triage",
              copy: "Analyze intent, urgency, and suggested next steps in seconds.",
            },
            {
              icon: SendHorizonal,
              title: "Reply Drafts",
              copy: "Generate professional email drafts with consistent tone.",
            },
            {
              icon: ChartColumnIncreasing,
              title: "Ops Visibility",
              copy: "Track inbox trends with cards, tables, and charts built for teams.",
            },
          ].map(({ icon: Icon, title, copy }) => (
            <div className="card-surface p-5" key={title}>
              <div className="mb-4 inline-flex rounded-2xl bg-coral/10 p-3 text-coral">
                <Icon size={20} />
              </div>
              <h3 className="font-heading text-lg font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-ink/65">{copy}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card-surface overflow-hidden p-6 shadow-lift sm:p-8">
        <div className="grid gap-5">
          <div className="rounded-[24px] bg-ink p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-white/60">Live Workflow</p>
                <h2 className="mt-2 font-heading text-2xl font-bold">Inbox Pulse</h2>
              </div>
              <div className="badge-pill bg-white/10 text-white">Realtime</div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-white/65">Urgent Classifications</p>
                <p className="mt-2 font-heading text-3xl font-bold">32%</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-4">
                <p className="text-sm text-white/65">Avg. Response Draft Time</p>
                <p className="mt-2 font-heading text-3xl font-bold">14s</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.92fr_1.08fr]">
            <div className="rounded-[24px] bg-coral/10 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-coral">
                Priority Lens
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                    High Focus
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold text-ink">Urgent client issues</p>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/45">
                    Automatable
                  </p>
                  <p className="mt-2 font-heading text-xl font-bold text-ink">Draft follow-ups</p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-ink/10 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ink/45">
                Latest Analysis
              </p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-paper px-4 py-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-heading text-lg font-bold text-ink">
                      Quarterly business review scheduling
                    </h3>
                    <span className="badge-pill bg-sun/20 text-ink">Requires Action</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-ink/70">
                    <li>Summarized agenda and attendees from client thread</li>
                    <li>Suggested calendar event with pending time confirmation</li>
                    <li>Extracted presentation prep and feedback tasks</li>
                  </ul>
                </div>
                <div className="rounded-2xl bg-mist/40 px-4 py-4 text-sm text-ink/70">
                  Built for API-first products with reusable React components and separate service
                  modules.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
