import { PrismaClient } from "@prisma/client";
import { successResponse } from "../utils/response.js";

const prisma = new PrismaClient();


// GET GUESTS (USER)
export const getGuests = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const where = {
      createdById: req.user.userId,
      OR: [
          { 
            name: { 
              contains: search, 
              // mode: "insensitive" 
            } 
          },
          { email: { 
            contains: search, 
            // mode: "insensitive" 
          } 
        },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.guest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.guest.count({ where }),
    ]);

    return successResponse(
      res,
      "Guest list retrieved",
      data,
      {
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      }
    );
  } catch (err) {
    next(err);
  }
};


// CREATE GUEST
export const createGuest = async (req, res, next) => {
  try {
    const guest = await prisma.guest.create({
      data: {
        ...req.body,
        createdById: req.user.userId,
      },
    });

    return successResponse(res, "Guest created", guest, null, 201);
  } catch (err) {
    next(err);
  }
};

// UPDATE GUEST (OWNER)
export const updateGuest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest)
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });

    if (
      guest.createdById !== req.user.userId &&
      req.user.role !== "ADMIN"
    )
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });

    const updated = await prisma.guest.update({
      where: { id },
      data: req.body,
    });

    return successResponse(res, "Guest updated", updated);
  } catch (err) {
    next(err);
  }
};


// DELETE GUEST (OWNER)
export const deleteGuest = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest)
      return res.status(404).json({
        success: false,
        message: "Guest not found",
      });

    if (
      guest.createdById !== req.user.userId &&
      req.user.role !== "ADMIN"
    )
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });

    await prisma.guest.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
