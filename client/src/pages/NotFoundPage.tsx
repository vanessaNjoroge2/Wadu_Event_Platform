import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-4">
          404
        </h1>
        <p className="text-2xl text-white mb-4 font-semibold">
          Oops! Page not found
        </p>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          We couldn't find the page you're looking for. It might have been moved
          or doesn't exist yet.
        </p>
        <Link
          to="/"
          className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
