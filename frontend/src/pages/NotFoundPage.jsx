import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="section-shell">
      <div className="card-surface mx-auto max-w-2xl px-8 py-14 text-center">
        <p className="badge-pill bg-coral/10 text-coral">404</p>
        <h1 className="mt-5 font-heading text-4xl font-bold text-ink">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-ink/65">
          The page you are looking for does not exist. Head back to the homepage and continue from
          there.
        </p>
        <Link
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-sea"
          to="/"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
