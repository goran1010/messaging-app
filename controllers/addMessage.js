import express from "express";
import prisma from "../db/prisma.js";
import isLoggedIn from "../auth/isLoggedIn.js";

const router = express.Router();

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { chatId, content } = req.body;
    const userId = req.user.id;

    if (!chatId || !content) {
      return res.status(400).json({ error: "Missing chatId or content" });
    }

    const chat = await prisma.chat.findUnique({
      where: { id: chatId },
      include: { users: true },
    });

    if (!chat || !chat.users.some((u) => u.id === userId)) {
      return res.status(403).json({ error: "You are not in this chat" });
    }

    const message = await prisma.message.create({
      data: {
        content,
        chatId,
        userId,
      },
    });
    const user = await prisma.user.findFirst({
      where: { id: req.user.id },
      include: {
        userInfo: true,
        chats: { include: { users: true, messages: true } },
      },
    });
    res.json({ user, message });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
