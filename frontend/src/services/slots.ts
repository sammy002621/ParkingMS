/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { IMeta, ISlot } from "@/types";
import React from "react";
import toast from "react-hot-toast";

export const createSlot = async ({
  slotData,
  setLoading,
}: {
  slotData: ISlot;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/slot/create";
    await api.post(url, { ...slotData });
    toast.success("Parking Slot created successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error login you in");
  } finally {
    setLoading(false);
  }
};
export const getSlots = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setSlots,
  searchKey,
}: {
  page?: number;
  limit?: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setSlots: React.Dispatch<React.SetStateAction<ISlot[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setSlots(response.data.data.slots);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking slots");
  } finally {
    setLoading(false);
  }
};

export const getAvailableSlots = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setSlots,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setSlots: React.Dispatch<React.SetStateAction<ISlot[]>>;
  searchKey?: string;
}) => {
  try {
    let url = `/slot/all/available?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setSlots(response.data.data.slots);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting parking slots");
  } finally {
    setLoading(false);
  }
};
