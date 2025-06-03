import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [menu, setMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleMenu = () => setMenu(!menu);
  const handleProfileClick = () => setShowProfileMenu(!showProfileMenu);

  const openFund = () => navigate("/Basicdetails");
  const openLogin = () => navigate("/Signup");

  const openBloodRegister = () => navigate("/blooddonation");

  const logout = () => {
    localStorage.removeItem("token");
    setShowProfileMenu(false);
    navigate("/"); // or navigate to /login if preferred
  };

  const headers = [
    { id: 1, title: "Home", path: "/" },
    { id: 2, title: "Donate", path: "/donate" },
    { id: 3, title: "My Fundraisers", path: "/myfundraisers" },
    { id: 4, title: "About us", path: "/aboutus" },
    { id: 5, title: "Contact us", path: "/contactus" },
  ];

  useEffect(() => {
  if (menu) {
    document.body.style.overflow = "hidden"; // Disable scroll
  } else {
    document.body.style.overflow = "auto"; // Re-enable scroll
  }

  // Cleanup on unmount
  return () => {
    document.body.style.overflow = "auto";
  };
}, [menu]);

const location = useLocation()

  const rawPath = location.pathname.replace(/^\/+/, '');
  const formattedPath = rawPath
    ? rawPath.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    : 'Home';

  const token = localStorage.getItem("token");

  return (
    <nav className="bg-background sticky top-0 z-50 h-16 px-6 medium:px-16 w-full flex items-center justify-between">
      <div className="flex items-center gap-20">
        <img src="logo.png" className="h-12 w-9" alt="Logo" />
      </div>
<span className="text-white small:hidden">{formattedPath}</span>
      <div className="hidden small:flex gap-2 small:gap-4 medium-6 sl:gap-10 items-center">
        {headers.map((header) => (
          <NavLink
            key={header.id}
            to={header.path}
            onClick={() => setShowDropdown(false)}
            className={({ isActive }) =>
              `block px-4 py-2 text-gray-800 hover:border-b-2 hover:border text-white ${
                isActive ? "border-[#EB373F]" : "border-none"
              }`
            }
          >
            {({ isActive }) => (
              <span
                className={
                  isActive
                    ? " border-b-2 border-[#fff] text-white hover:border-b-2 pb-1 mb-4 font-[700]"
                    : "text-[#EDEDED] hover:text-white font-[600]"
                }
              >
                {header.title}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      <div className="flex items-center gap-4 relative">
        <button
          onClick={openFund}
          className="py-2 px-4 hidden border-2 border-white medium:flex rounded-full hover:bg-opacity-90 bg-background"
        >
          <p className="text-white font-[600]">Start a fundraiser</p>
        </button>
        <button
          onClick={openBloodRegister}
          className="py-2 px-4 hidden bg-white border-2 border-background medium:flex rounded-full"
        >
          <p className="text-background font-[600]">Be a Blood donor</p>
        </button>

<div
  className="relative"
  onMouseEnter={() => setShowProfileMenu(true)}
  onMouseLeave={() => setShowProfileMenu(false)}
>
  <div className="bg-background rounded-full p-2 cursor-pointer">
    <Icon
      className="text-white"
      icon="iconoir:profile-circle"
      width="24"
      height="24"
    />
  </div>

  {/* Dropdown menu shown on hover */}
  {showProfileMenu && (
    <div className="absolute bg- right-0 w-32 rounded-md py-2 z-50">
      {token ? (
        <button
          onClick={logout}
          className="w-full text-left px-4 bg-white rounded-md py-2 bg-white text-sm text-gray-700 hover:bg-gray-100"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={openLogin}
          className="w-full text-left px-4 bg-white rounded-md py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Signin
        </button>
      )}
    </div>
  )}
</div>

        <div className="small:hidden">
          <Icon
            onClick={handleMenu}
            icon="material-symbols:menu-rounded"
            width="30"
            height="30"
            style={{ color: "#fff" }}
          />
        </div>
        {/* Mobile Menu Fullscreen Overlay */}
{menu && (
  <div className="fixed inset-0 z-50 bg-white flex flex-col h-screen p-6">
    
    {/* Header */}
    <div className="flex w-full justify-between items-center mb-4">
      <img src="logo.png" className="h-10 w-auto" alt="Logo" />
      <Icon
        icon="material-symbols:close-rounded"
        width="30"
        height="30"
        onClick={() => setMenu(false)}
        className="text-gray-800 cursor-pointer"
      />
    </div>

    {/* Scrollable nav and action content */}
    <div className="flex-1 overflow-y-auto flex flex-col gap-4">
      {headers.map((header) => (
        <NavLink
          key={header.id}
          to={header.path}
          onClick={() => setMenu(false)}
          className={({ isActive }) =>
            `block py-2 text-lg font-semibold ${
              isActive ? "bg-[#EB373F] text-white p-4" : "p-4 text-gray-800"
            }`
          }
        >
          {header.title}
        </NavLink>
      ))}

      <button
        onClick={() => {
          openFund();
          setMenu(false);
        }}
        className="w-full py-2 px-4 border-2 border-background  text-background font-semibold rounded-md"
      >
        Start a fundraiser
      </button>

      <button
        onClick={() => {
          openBloodRegister();
          setMenu(false);
        }}
        className="w-full py-2 px-4 border-2 border-background text-background font-semibold rounded-md"
      >
        Be a Blood Donor
      </button>
    </div>

    <div className="pt-4">
      {token ? (
        <button
          onClick={() => {
            logout();
            setMenu(false);
          }}
          className="w-full py-2 px-4 text-red-600 font-semibold rounded-md"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => {
            openLogin();
            setMenu(false);
          }}
          className="w-full py-2 px-4 text-background font-semibold rounded-md"
        >
          Signin
        </button>
      )}
    </div>
  </div>
)}


      </div>
    </nav>
  );
};

export default Navbar;
