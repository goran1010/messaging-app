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
    include: { friends: true, userInfo: true },
  });
  res.json(userFriends);
}

export async function friends(req, res) {
  const user = req.user;

  const friends = await prisma.user.findFirst({
    where: { id: user.id },
    select: {
      friends: { include: { userInfo: true } },
    },
    orderBy: { userInfo: { firstName: "asc" } },
  });
  res.json(friends);
}
