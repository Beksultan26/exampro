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

router.get("/", async (req: any, res) => {
  try {
    const userId = req.user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: "Не удалось загрузить профиль" });
  }
});

router.put("/", async (req: any, res) => {
  try {
    const userId = req.user.userId;
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Введите имя" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
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

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Не удалось обновить профиль" });
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

    return res.json(updatedUser);
  } catch (error) {
    return res.status(500).json({ message: "Не удалось загрузить фото" });
  }
});

export default router;