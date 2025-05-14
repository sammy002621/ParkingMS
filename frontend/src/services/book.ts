/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/api";
import { IBook, IMeta } from "@/types";
import React from "react";
import toast from "react-hot-toast";

export const createBook = async ({
  bookData,
  setLoading,
}: {
  bookData: IBook;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  try {
    const url = "/books/create";
    await api.post(url, { ...bookData });
    toast.success("Book created successfully");
  } catch (error: any) {
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error login you in");
  } finally {
    setLoading(false);
  }
};
export const getBooks = async ({
  page,
  limit,
  setLoading,
  setMeta,
  setBooks,
  searchKey,
}: {
  page: number;
  limit: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setMeta: React.Dispatch<React.SetStateAction<IMeta>>;
  setBooks: React.Dispatch<React.SetStateAction<IBook[]>>;
  searchKey: string;
}) => {
  try {
    let url = `/books/all?page=${page}&limit=${limit}`;
    if (searchKey) url += `&searchKey=${searchKey}`;
    const response = await api.get(url);
    setBooks(response.data.data.books);
    setMeta(response.data.data.meta);
  } catch (error: any) {
    if (error.response.data.status === 401)
      return window.location.replace("/auth/login");
    error?.response?.data?.message
      ? toast.error(error.response.data.message)
      : toast.error("Error getting books");
  } finally {
    setLoading(false);
  }
};
