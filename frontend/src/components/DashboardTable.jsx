import PriorityBadge from "./PriorityBadge";
import { formatDate } from "../utils/formatters";

const DashboardTable = ({ emails }) => {
  return (
    <div className="card-surface overflow-hidden">
      <div className="border-b border-ink/10 px-6 py-5">
        <h3 className="font-heading text-2xl font-bold text-ink">Recent email history</h3>
        <p className="mt-2 text-sm text-ink/65">
          Latest analyzed emails stored in MongoDB and returned by the REST API.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-paper/70 text-ink/65">
            <tr>
              <th className="px-6 py-4 font-semibold">Subject</th>
              <th className="px-6 py-4 font-semibold">Priority</th>
              <th className="px-6 py-4 font-semibold">Tasks</th>
              <th className="px-6 py-4 font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {emails.map((email) => (
              <tr className="hover:bg-white/80" key={email._id}>
                <td className="px-6 py-5">
                  <div className="font-semibold text-ink">{email.subject || "(No subject)"}</div>
                  <div className="mt-1 max-w-md text-xs leading-5 text-ink/55">
                    {(email.summary || []).join(" ")}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <PriorityBadge priority={email.priority} />
                </td>
                <td className="px-6 py-5 text-ink/70">{email.taskList?.length || 0}</td>
                <td className="px-6 py-5 text-ink/70">{formatDate(email.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DashboardTable;
