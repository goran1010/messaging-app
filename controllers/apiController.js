import prisma from "../db/prisma.js";

export function check(req, res) {
  res.status(200).json("OK");
}
export async function addFriend(req, res) {
  const user = req.user;

  const { username } = req.query;

  const userFriends = await prisma.user.update({
    where: { id: user.id },
    data: { friends: { connect: { username } } },
    include: { friends: true },
  });
  res.json(userFriends);
}
