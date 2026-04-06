import { useEffect, useState } from "react";

import AnalyzeForm from "../components/AnalyzeForm";
import HeroSection from "../components/HeroSection";
import ResponsePreviewCard from "../components/ResponsePreviewCard";
import SectionHeading from "../components/SectionHeading";

const STORAGE_KEY = "mailpilot-latest-analysis";

const HomePage = () => {
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (storedValue) {
      setAnalysisResult(JSON.parse(storedValue));
    }
  }, []);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
  };

  return (
    <div className="space-y-16">
      <HeroSection />

      <section className="section-shell">
        <div className="card-surface overflow-hidden px-6 py-10 sm:px-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <div className="space-y-6">
              <SectionHeading
                eyebrow="Designed For REST APIs"
                title="A frontend that feels polished for users and clean for engineers"
                description="The UI is split into reusable components and service modules, so your team can evolve backend routes without wrestling with tangled view logic."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  "Responsive layout for desktop, tablet, and mobile",
                  "Axios-based request layer with centralized base URL",
                  "Beautiful success, loading, and error states",
                  "Dashboard with tables and Recharts visualizations",
                ].map((feature) => (
                  <div className="rounded-[24px] bg-paper/80 px-5 py-4 text-sm font-medium text-ink/70" key={feature}>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] bg-ink p-8 text-white shadow-lift">
              <p className="text-sm uppercase tracking-[0.22em] text-white/60">What happens next</p>
              <div className="mt-6 grid gap-4">
                {[
                  {
                    title: "1. Paste an email",
                    copy: "Submit subject and body through the landing page form.",
                  },
                  {
                    title: "2. Receive AI output",
                    copy: "See summaries, draft replies, calendar ideas, and task lists instantly.",
                  },
                  {
                    title: "3. Monitor operations",
                    copy: "Open the dashboard to review history, trends, and priority distribution.",
                  },
                ].map((step) => (
                  <div className="rounded-[24px] bg-white/10 p-4" key={step.title}>
                    <h3 className="font-heading text-xl font-bold">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/72">{step.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell scroll-mt-24" id="analyze">
        <div className="mb-8">
          <SectionHeading
            eyebrow="Analyze"
            title="Submit email content and see the backend response in a refined workspace"
            description="This form posts directly to your live REST API and stores the latest result locally so the dashboard can pick it up as soon as it lands."
          />
        </div>
        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <AnalyzeForm onAnalysisComplete={handleAnalysisComplete} />
          <ResponsePreviewCard analysis={analysisResult} />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
