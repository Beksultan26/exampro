import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { prisma } from "../../config/db";

const router = Router();

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req: any, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${req.user.userId}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

router.use(authMiddleware);

router.put("/update", async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Не удалось обновить профиль" });
  }
});

router.post("/avatar", upload.single("avatar"), async (req: any, res) => {
  try {
    const userId = req.user.userId;

    if (!req.file) {
      return res.status(400).json({ message: "Файл не выбран" });
    }

    const avatarUrl = `/uploads/${req.file.filename}`;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Не удалось загрузить фото" });
  }
});

export default router;