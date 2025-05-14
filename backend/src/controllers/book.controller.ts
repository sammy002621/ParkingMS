import { Prisma } from "@prisma/client";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { paginator } from "../utils/paginator";

config();

const createBook: any = async (req: AuthRequest, res: Response) => {
  try {
    const { name, author, publisher, publicationYear, subject } = req.body;
    const book = await prisma.book.create({
      data: {
        name,
        author,
        publisher,
        publicationYear,
        subject,
        createdBy: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    return ServerResponse.created(res, "Book created successfully", { book });
  } catch (error: any) {
    if (error.code === "P2002") {
      const key = error.meta.target[0];
      return ServerResponse.error(
        res,
        `${key.charAt(0).toUpperCase() + key.slice(1)} (${
          req.body[key]
        }) already exists`,
        400
      );
    }
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const fetchBooks = async (req: Request, res: Response) => {
  try {
    const { searchKey, page, limit } = req.query;

    if (parseInt(page as string) <= 0)
      return ServerResponse.error(
        res,
        "Page number cannot be less than or equal to 0"
      );
    if (parseInt(limit as string) <= 0)
      return ServerResponse.error(
        res,
        "Limit number cannot be less than or equal to 0"
      );

    const whereCondition: Prisma.BookWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { name: { contains: searchKey as string, mode: "insensitive" } },
        { author: { contains: searchKey as string, mode: "insensitive" } },
        { publisher: { contains: searchKey as string, mode: "insensitive" } },
        {
          publicationYear: {
            contains: searchKey as string,
            mode: "insensitive",
          },
        },
        { subject: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }
    const books = await prisma.book.findMany({
      where: whereCondition,
      skip:
        page && limit
          ? (parseInt(page as string) - 1) * parseInt(limit as string)
          : 0,
      take: limit ? Number(limit) : 10,
    });
    const total = await prisma.book.count({});
    return ServerResponse.success(res, "Books fetched successfully", {
      books,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        total,
      }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occured", { error });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const book = await prisma.book.findUnique({
      where: {
        id: parseInt(id),
      },
    });
    if (!book)
      return ServerResponse.notFound(res, `Book with id ${id} as not found`);
    return ServerResponse.success(res, "Book fetched successfully", { book });
  } catch (error) {}
};

const bookController = {
  createBook,
  fetchBooks,
  findById,
};

export default bookController;
