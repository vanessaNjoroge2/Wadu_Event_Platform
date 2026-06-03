import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-wadu-bg dark:bg-wadu-dark flex items-center justify-center px-4 transition-colors duration-300">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-extrabold text-wadu-purple mb-4">
          404
        </h1>
        <p className="text-2xl text-wadu-navy dark:text-white mb-4 font-bold">
          Oops! Page not found
        </p>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto font-semibold">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-wadu-navy border border-wadu-navy/15 text-white px-8 py-3 rounded-lg font-bold hover:bg-wadu-teal hover:text-wadu-navy hover:border-wadu-teal transition duration-200 shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
