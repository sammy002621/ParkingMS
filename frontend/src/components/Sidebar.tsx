/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoRound } from "@/assets";
import { logout } from "@/redux/slices/userReducer";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard, MdEventAvailable } from "react-icons/md";
import { FaCar, FaClipboardList } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
  };

  const userSlice = useSelector((state: any) => state.userSlice);
  const role: string = userSlice.user.role;

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <MdDashboard size={22} />,
    },
    {
      name: "Vehicles",
      path: "/vehicle",
      icon: <FaCar size={20} />,
    },
    {
      name: "Requests",
      path: "/requests",
      icon: <FaClipboardList size={20} />,
    },
  ];
  if (role.toLowerCase() === "admin") {
    menuItems.push({
      name: "Slots",
      path: "/slots",
      icon: <MdEventAvailable size={20} />,
    });
  }

  return (
    <div className="w-2/12 hidden smlg:flex flex-col min-h-screen bg-white px-4 py-8 shadow-md">
      <img src={LogoRound} className="w-24 mx-auto mb-4" alt="Logo" />
      <span className="font-bold text-xl text-center text-slate-700 mb-6">
        PMS
      </span>
      <div className="flex flex-col space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition ${
              location.pathname === item.path
                ? "bg-slate-300/70 font-semibold"
                : ""
            }`}
          >
            {item.icon}
            <span className="text-base">{item.name}</span>
          </Link>
        ))}
      </div>
      <div className="mt-auto pt-8">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-700 hover:bg-slate-200 transition"
        >
          <BiLogOut size={22} />
          <span className="text-base">Logout</span>
        </button>
      </div>
    </div>
  );
};
export default Sidebar;
