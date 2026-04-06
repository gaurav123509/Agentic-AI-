import { CalendarDays, CheckCircle2, FileText } from "lucide-react";

import PriorityBadge from "./PriorityBadge";

const ResponsePreviewCard = ({ analysis }) => {
  if (!analysis) {
    return null;
  }

  const hasCalendarEvent = Boolean(analysis.calendarEvent?.shouldCreate);

  return (
    <div className="card-surface h-full p-6 shadow-lift sm:p-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sea">AI Output</p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink">Latest analyzed email</h3>
        </div>
        <PriorityBadge priority={analysis.priority} />
      </div>

      <div className="mt-8 space-y-6">
        <section className="rounded-[24px] bg-paper/80 p-5">
          <div className="mb-3 flex items-center gap-2 text-ink">
            <FileText size={18} />
            <h4 className="font-heading text-lg font-bold">Summary</h4>
          </div>
          <ul className="space-y-2 text-sm leading-6 text-ink/70">
            {(analysis.summary || []).map((item) => (
              <li className="rounded-2xl bg-white px-4 py-3" key={item}>
                {item}
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-[24px] bg-white p-5 shadow-soft">
          <h4 className="font-heading text-lg font-bold text-ink">Draft reply</h4>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-ink/70">
            {analysis.draftReply}
          </p>
        </section>

        <div className="grid gap-5 xl:grid-cols-2">
          <section className="rounded-[24px] bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2 text-ink">
              <CheckCircle2 size={18} />
              <h4 className="font-heading text-lg font-bold">Task list</h4>
            </div>
            <ul className="space-y-2 text-sm leading-6 text-ink/70">
              {(analysis.taskList || []).map((task) => (
                <li className="rounded-2xl bg-paper/70 px-4 py-3" key={task.title}>
                  {task.title}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[24px] bg-white p-5 shadow-soft">
            <div className="mb-3 flex items-center gap-2 text-ink">
              <CalendarDays size={18} />
              <h4 className="font-heading text-lg font-bold">Calendar event</h4>
            </div>
            {hasCalendarEvent ? (
              <div className="space-y-3 text-sm leading-6 text-ink/70">
                <p>
                  <span className="font-semibold text-ink">Title:</span>{" "}
                  {analysis.calendarEvent.title || "Suggested follow-up"}
                </p>
                <p>
                  <span className="font-semibold text-ink">Timezone:</span>{" "}
                  {analysis.calendarEvent.timezone || "UTC"}
                </p>
                <p>
                  <span className="font-semibold text-ink">Status:</span>{" "}
                  {analysis.calendarEvent.status || "suggested"}
                </p>
              </div>
            ) : (
              <p className="text-sm leading-6 text-ink/65">
                No clear meeting details were found, so MailPilot AI kept the calendar suggestion
                empty.
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default ResponsePreviewCard;
