import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="w-screen h-screen min-h-screen flex flex-col items-center justify-center font-sans bg-gradient-to-br from-[#4f46e5] via-[#a21caf] to-[#18181b] relative">
      {/* Docky Heading with Word Art */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-30 w-full flex justify-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-center bg-gradient-to-r from-fuchsia-500 via-indigo-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg tracking-widest font-poppins animate-pulse select-none" style={{ letterSpacing: '0.2em', fontFamily: 'Poppins, Inter, sans-serif' }}>
          D<span className="text-white drop-shadow-[0_2px_8px_rgba(236,72,153,0.7)]">o</span>c<span className="text-indigo-200">k</span>y
        </h1>
      </div>
      <div className="flex flex-col items-center mb-8 mt-24 md:mt-32">
        <span className="text-3xl font-extrabold text-white tracking-wide font-poppins mb-2">SmartClass</span>
        <h1 className="text-2xl md:text-4xl font-bold text-white text-center mb-2">Welcome to SmartClass Submissions</h1>
        <p className="text-base md:text-lg text-white/80 text-center max-w-xl">Login as a User or Admin to continue</p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl items-center justify-center">
        <Link to="/login/user" className="w-full max-w-xs py-6 px-8 rounded-2xl shadow-xl bg-white/90 flex flex-col items-center gap-4 hover:bg-indigo-50 transition">
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900">User Login</h2>
          <span className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">Go to User Login</span>
        </Link>
        <Link to="/login/admin" className="w-full max-w-xs py-6 px-8 rounded-2xl shadow-xl bg-white/90 flex flex-col items-center gap-4 hover:bg-indigo-50 transition">
          <h2 className="text-xl font-bold text-center mb-2 text-gray-900">Admin Login</h2>
          <span className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg text-center transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer">Go to Admin Login</span>
        </Link>
      </div>
    </div>
  );
} 