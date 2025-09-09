import express from "express";
import prisma from "../db/prisma.js";
import isLoggedIn from "../auth/isLoggedIn.js";

const router = express.Router();

router.put("/", isLoggedIn, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const friendUsername = req.query.friend;

    if (!friendUsername) {
      return res.status(400).json({ error: "Missing friend username" });
    }
    const friendUser = await prisma.user.findUnique({
      where: { username: friendUsername },
    });

    if (!friendUser) {
      return res.status(404).json({ error: "Friend not found" });
    }

    const existingChat = await prisma.chat.findFirst({
      where: {
        AND: [
          { users: { some: { id: currentUserId } } },
          { users: { some: { id: friendUser.id } } },
        ],
      },
      include: { users: true, messages: true },
    });

    if (existingChat) {
      return res.status(200).json(
        await prisma.user.findUnique({
          where: { id: currentUserId },
          include: { chats: { include: { users: true, messages: true } } },
        }),
      );
    }

    const newChat = await prisma.chat.create({
      data: {
        users: {
          connect: [{ id: currentUserId }, { id: friendUser.id }],
        },
      },
      include: { users: true, messages: true },
    });

    const updatedUser = await prisma.user.findUnique({
      where: { id: currentUserId },
      include: { chats: { include: { users: true, messages: true } } },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
