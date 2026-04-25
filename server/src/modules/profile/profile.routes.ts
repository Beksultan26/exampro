import { Router } from "express";
import multer from "multer";
import path from "path";
import { prisma } from "../../config/db";
import { authMiddleware, AuthRequest } from "../../middlewares/auth.middleware";

const router = Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post(
  "/avatar",
  authMiddleware,
  upload.single("avatar"),
  async (req: AuthRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Не авторизован" });
      }

      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Файл не загружен" });
      }

      const avatarUrl = `/uploads/${file.filename}`;

      const user = await prisma.user.update({
        where: { id: req.user.userId },
        data: { avatarUrl },
      });

      res.json({
        avatarUrl: user.avatarUrl,
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: "Ошибка загрузки" });
    }
  }
);

export default router;