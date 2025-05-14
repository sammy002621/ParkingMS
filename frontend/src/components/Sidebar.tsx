/* eslint-disable @typescript-eslint/no-explicit-any */
import { LogoRound } from "@/assets";
import { logout } from "@/redux/slices/userReducer";
import React from "react";
import { BiLogOut } from "react-icons/bi";
import { MdDashboard } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="w-2/12 hidden smlg:flex flex-col min-h-screen bg-white px-4">
      <img src={LogoRound} className="w-28 mx-auto my-10" alt="" />
      <span className="font-bold text-xl text-center">PMS</span>
      <div className="my-4 flex flex-col">
        <Link
          to={`/`}
          className={`flex items-center rounded-lg p-3 hover:bg-slate-300/60 ${
            window.location.pathname && "bg-slate-300/60"
          }`}
        >
          <MdDashboard size={23} className="text-slate-400" />
          <span className="ml-2 text-lg text-slate-700">Dashboard</span>
        </Link>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center rounded-lg p-3 hover:bg-slate-300/60"
      >
        <BiLogOut size={23} className="text-slate-400" />
        <span className="ml-2 text-lg text-slate-700">Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
