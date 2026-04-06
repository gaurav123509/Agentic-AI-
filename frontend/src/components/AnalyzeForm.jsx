import { Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { analyzeEmail } from "../services/emailService";
import { getErrorMessage } from "../services/apiClient";
import ErrorAlert from "./ErrorAlert";
import LoadingSpinner from "./LoadingSpinner";

const initialFormState = {
  subject: "",
  body: "",
};

const AnalyzeForm = ({ onAnalysisComplete }) => {
  const [formState, setFormState] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await analyzeEmail(formState);
      onAnalysisComplete(response);
      setFormState(initialFormState);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-surface p-6 shadow-lift sm:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-coral">
            API Submission
          </p>
          <h3 className="mt-2 font-heading text-2xl font-bold text-ink">Send an email for analysis</h3>
        </div>
        <div className="rounded-full bg-coral/10 px-4 py-2 text-sm font-semibold text-coral">
          POST /api/emails/analyze
        </div>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink" htmlFor="subject">
            Subject
          </label>
          <input
            className="w-full rounded-2xl border border-ink/10 bg-white px-4 py-3 text-sm text-ink outline-none transition focus:border-coral/40 focus:ring-4 focus:ring-coral/10"
            id="subject"
            name="subject"
            onChange={handleChange}
            placeholder="Urgent client meeting tomorrow"
            type="text"
            value={formState.subject}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-ink" htmlFor="body">
            Email body
          </label>
          <textarea
            className="min-h-[180px] w-full rounded-3xl border border-ink/10 bg-white px-4 py-4 text-sm text-ink outline-none transition focus:border-coral/40 focus:ring-4 focus:ring-coral/10"
            id="body"
            name="body"
            onChange={handleChange}
            placeholder="Paste an incoming email here so MailPilot AI can summarize it, score priority, draft a reply, and suggest next actions."
            value={formState.body}
          />
        </div>

        <ErrorAlert message={errorMessage} />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-6 text-ink/65">
            Uses Axios through a dedicated service layer, so you can swap or extend REST endpoints
            cleanly.
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-sea disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <LoadingSpinner label="Analyzing" />
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Email
                </>
              )}
            </button>
            <Link
              className="rounded-full border border-ink/10 bg-white px-5 py-3 text-sm font-semibold text-ink transition hover:border-coral/30 hover:text-coral"
              to="/dashboard"
            >
              View History
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnalyzeForm;
