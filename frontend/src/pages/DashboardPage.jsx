import { RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardTable from "../components/DashboardTable";
import EmptyState from "../components/EmptyState";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import PriorityChart from "../components/PriorityChart";
import ResponsePreviewCard from "../components/ResponsePreviewCard";
import SectionHeading from "../components/SectionHeading";
import StatCard from "../components/StatCard";
import { getErrorMessage } from "../services/apiClient";
import { getEmailHistory } from "../services/emailService";
import { buildPriorityChartData } from "../utils/formatters";

const STORAGE_KEY = "mailpilot-latest-analysis";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchHistory = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await getEmailHistory({ limit: 25 });
      setHistory(response.emails || []);
      setMeta({ total: response.total || 0 });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      setLatestAnalysis(JSON.parse(storedValue));
    }
  }, []);

  const metrics = useMemo(() => {
    const urgentCount = history.filter((item) => item.priority === "Urgent").length;
    const actionCount = history.filter((item) => item.priority === "Requires Action").length;
    const avgTasks = history.length
      ? (history.reduce((sum, item) => sum + (item.taskList?.length || 0), 0) / history.length).toFixed(1)
      : "0.0";

    return {
      urgentCount,
      actionCount,
      avgTasks,
    };
  }, [history]);

  const chartData = useMemo(() => buildPriorityChartData(history), [history]);

  return (
    <div className="section-shell space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Dashboard"
          title="Operational visibility for your inbox workflow"
          description="Track analyzed messages, monitor how priorities shift, and keep the latest AI response close at hand."
        />
        <button
          className="inline-flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
          onClick={fetchHistory}
          type="button"
        >
          <RefreshCw size={18} />
          Refresh Data
        </button>
      </div>

      <ErrorAlert message={errorMessage} />

      {isLoading ? (
        <div className="card-surface p-8">
          <LoadingSpinner label="Loading dashboard insights" />
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              accent="bg-ink text-white"
              helper="Total records returned from GET /api/emails/history"
              label="Emails"
              value={meta.total}
            />
            <StatCard
              accent="bg-coral/10 text-coral"
              helper="Messages marked as time-sensitive"
              label="Urgent"
              value={metrics.urgentCount}
            />
            <StatCard
              accent="bg-sun/25 text-ink"
              helper="Messages requiring explicit follow-up"
              label="Action"
              value={metrics.actionCount}
            />
            <StatCard
              accent="bg-sea/10 text-sea"
              helper="Average number of extracted tasks per email"
              label="Avg Tasks"
              value={metrics.avgTasks}
            />
          </div>

          {history.length > 0 ? (
            <>
              <PriorityChart chartData={chartData} />
              <DashboardTable emails={history} />
            </>
          ) : (
            <EmptyState
              description="As soon as the first email is analyzed through the landing page form, it will appear here with metrics, charts, and a full response preview."
              title="No email history yet"
            />
          )}

          {latestAnalysis ? (
            <ResponsePreviewCard analysis={latestAnalysis} />
          ) : null}
        </>
      )}
    </div>
  );
};

export default DashboardPage;
