/* eslint-disable @typescript-eslint/no-explicit-any */
import { IMeta, ISession } from "@/types";
import { Dispatch } from "@reduxjs/toolkit";
import { createContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export const CommonContext = createContext<any>({});
export const CommonProvider = ({ children }: any) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [sessions, setSessions] = useState<ISession[]>([]);
  const [slots, setSlots] = useState<ISession[]>([]);
  const [meta, setMeta] = useState<IMeta>({
    total: 0,
    lastPage: 0,
    currentPage: 0,
    perPage: 0,
    prev: 0,
    next: 0,
  });
  const userSlice = useSelector((state: any) => state.userSlice);
  const dispatch: Dispatch = useDispatch();
  const isLoggedIn: boolean = userSlice.isLoggedIn;

  return (
    <CommonContext.Provider
      value={{
        showSidebar,
        setShowSidebar,
        dispatch,
        isLoggedIn,
        user: userSlice.user,
        sessions,
        setSessions,
        meta,
        setMeta,
        slots,
        setSlots,
      }}
    >
      {children}
    </CommonContext.Provider>
  );
};
