import { Prisma } from "@prisma/client";
import { config } from "dotenv";
import { Request, Response } from "express";
import prisma from "../prisma/prisma-client";
import { AuthRequest } from "../types";
import ServerResponse from "../utils/ServerResponse";
import { paginator } from "../utils/paginator";

config();

const createParkingSlot: any = async (req: AuthRequest, res: Response) => {
  try {
    const { number } = req.body;
    const parkingSlot = await prisma.parkingSlot.create({
      data: {
        number,
      },
    });
    return ServerResponse.created(res, "Parking Slot created successfully", {
      parkingSlot,
    });
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
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const fetchParkingSlots = async (req: Request, res: Response) => {
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

    const whereCondition: Prisma.ParkingSlotWhereInput = {};
    if (searchKey) {
      whereCondition.OR = [
        { number: { contains: searchKey as string, mode: "insensitive" } },
      ];
    }
    const parkingSlots = await prisma.parkingSlot.findMany({
      where: whereCondition,
      skip:
        page && limit
          ? (parseInt(page as string) - 1) * parseInt(limit as string)
          : 0,
      take: limit ? Number(limit) : 10,
    });
    const total = await prisma.parkingSlot.count({});
    return ServerResponse.success(res, "ParkingSlots fetched successfully", {
      parkingSlots,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        total,
      }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};
const fetchFreeSlots = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query;

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

    const parkingSlots = await prisma.parkingSlot.findMany({
      where: {
        isOccupied: true,
      },
      skip:
        page && limit
          ? (parseInt(page as string) - 1) * parseInt(limit as string)
          : 0,
      take: limit ? Number(limit) : 10,
    });
    const total = await prisma.parkingSlot.count({});
    return ServerResponse.success(res, "ParkingSlots fetched successfully", {
      parkingSlots,
      meta: paginator({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        total,
      }),
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parkingSlot = await prisma.parkingSlot.findUnique({
      where: {
        id,
      },
    });
    if (!parkingSlot)
      return ServerResponse.notFound(
        res,
        `ParkingSlot with id ${id} as not found`
      );
    return ServerResponse.success(res, "ParkingSlot fetched successfully", {
      parkingSlot,
    });
  } catch (error) {
    return ServerResponse.error(res, "Error occurred", { error });
  }
};

const parkingSlotController = {
  createParkingSlot,
  fetchParkingSlots,
  fetchFreeSlots,
  findById,
};

export default parkingSlotController;
