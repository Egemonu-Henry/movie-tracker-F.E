import React from "react";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const Navigate = useNavigate();

  
  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    Navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#181818]/40 backdrop-blur-md text-white">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="shrink-0">
          <img
            src="/Logo/logo.png"
            alt="Hndrix logo"
            className="h-10 w-10 object-contain sm:h-12 sm:w-12"
          />
        </Link>

        

        {/* Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          {user ? (
            <div className="flex gap-2" >
              <button
              onClick={() => {
                document.getElementById("search-section")?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }}
              aria-label="Go to movie search"
              title="Search movies"
              className="rounded-full p-2 transition hover:bg-white/10"
              >
              <Search size={22} />
              </button>
              <button
                onClick={handleLogout}
                className=" rounded-lg bg-[#A13600] px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[#7D2400] sm:text-base "
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-200 transition-colors duration-200 hover:text-white sm:text-base"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-[#A13600] px-4 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-[#7D2400] sm:text-base"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
