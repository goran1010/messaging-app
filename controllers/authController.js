import prisma from "../db/prisma.js";
import passport from "../auth/passport.js";
import bcrypt from "bcryptjs";
import isLoggedIn from "../auth/isLoggedIn.js";
import supabase from "../db/supabase.js";

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

export async function updateProfile(req, res) {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.user.id;
    const imageBuffer = req.file?.buffer;
    const imageName = req.file?.originalname;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    let userInfo = await prisma.userInfo.findUnique({
      where: { userId },
      include: { image: true },
    });

    let imageUrl = userInfo?.image?.url || null;
    let imagePath = userInfo?.image?.name || null;

    if (imageBuffer) {
      if (imagePath) {
        await supabase.storage.from("images").remove([imagePath]);
      }

      const newPath = `users/${Date.now()}-${imageName}`;
      const { data, error } = await supabase.storage
        .from("images")
        .upload(newPath, imageBuffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      imagePath = data.path;

      const { data: publicUrlData } = supabase.storage
        .from("images")
        .getPublicUrl(imagePath);

      imageUrl = publicUrlData.publicUrl;

      if (userInfo?.image) {
        await prisma.image.update({
          where: { id: userInfo.image.id },
          data: {
            url: imageUrl,
            name: imagePath,
          },
        });
      } else {
        const newImage = await prisma.image.create({
          data: {
            url: imageUrl,
            name: imagePath,
          },
        });

        if (userInfo) {
          await prisma.userInfo.update({
            where: { userId },
            data: { imageId: newImage.id },
          });
        }
      }
    }

    if (userInfo) {
      userInfo = await prisma.userInfo.update({
        where: { userId },
        data: { firstName, lastName },
        include: { image: true },
      });
    } else {
      const newUserInfoData = {
        userId,
        firstName,
        lastName,
      };

      if (imageUrl) {
        const newImage = await prisma.image.upsert({
          where: { url: imageUrl },
          update: { name: imagePath },
          create: {
            url: imageUrl,
            name: imagePath,
          },
        });

        newUserInfoData.imageId = newImage.id;
      }

      userInfo = await prisma.userInfo.create({
        data: newUserInfoData,
        include: { image: true },
      });
    }

    return res.json(userInfo);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function profileImage(req, res) {
  const { userId } = req.query;
  const userInfo = await prisma.userInfo.findFirst({
    where: { userId },
    include: { image: { select: { url: true } } },
  });
  res.json(userInfo.image.url);
}

export const me = [
  isLoggedIn,
  function (req, res) {
    try {
      res.json(req.user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
];
export function logOut(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.json("Logged out");
  });
}
