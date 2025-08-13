import prisma from "../db/prisma.js";
import passport from "../auth/passport.js";
import bcrypt from "bcryptjs";

export const logIn = [
  passport.authenticate("local"),
  (req, res) => {
    res.json({ message: "Logged in", user: req.user });
  },
];
export async function signUp(req, res) {
  try {
    let { username, password } = req.body;
    password = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, password } });
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
}
