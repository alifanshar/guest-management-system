import { PrismaClient } from "@prisma/client";
import { successResponse } from "../utils/response.js";

const prisma = new PrismaClient();


// GET: EVENTS (PUBLIC)
export const getEvents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    const where = {
      OR: [
        { 
          title: { 
            contains: search, 
            // mode: "insensitive" // Untuk pencarian yang lebih flexibel
          } 
        },
        { 
          location: { 
            contains: search, 
            // mode: "insensitive" // Untuk pencarian yang lebih flexibel
          } 
        },
      ],
    };

    const [data, total] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { guests: true },
      }),
      prisma.event.count({ where }),
    ]);

    return successResponse(
      res,
      "Event list retrieved",
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


// CREATE: EVENT (ADMIN)
export const createEvent = async (req, res, next) => {
  try {
    const event = await prisma.event.create({
      data: {
        ...req.body,
        createdById: req.user.userId,
      },
    });

    return successResponse(res, "Event created", event, null, 201);
  } catch (err) {
    next(err);
  }
};


// UPDATE: EVENT (ADMIN)
export const updateEvent = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event)
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });

    const updated = await prisma.event.update({
      where: { id },
      data: req.body,
    });

    return successResponse(res, "Event updated", updated);
  } catch (err) {
    next(err);
  }
};


// DELETE: EVENT (ADMIN)
export const deleteEvent = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    await prisma.event.delete({ where: { id } });

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};
