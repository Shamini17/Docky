import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  return (
    <nav className="flex items-center justify-between py-4 px-6 bg-gradient-to-r from-indigo-700 to-purple-700 text-white rounded-b-lg shadow-md">
      <div className="font-bold text-2xl tracking-tight">Docky</div>
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span className="font-medium">{user.name} ({user.role})</span>
            <button
              onClick={logout}
              className="bg-white/10 px-3 py-1 rounded hover:bg-white/20 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; 