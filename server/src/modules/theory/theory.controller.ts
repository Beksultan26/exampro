import { Request, Response } from "express";
import { getTopicBySlug } from "./theory.service";

export async function getTopicBySlugController(req: Request, res: Response) {
  const slug = String(req.params.slug);

  const topic = await getTopicBySlug(slug);

  if (!topic) {
    return res.status(404).json({ message: "Тема не найдена" });
  }

  return res.status(200).json(topic);
}