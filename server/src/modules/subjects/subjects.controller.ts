import { Request, Response } from "express";
import { getAllSubjects, getSubjectBySlug } from "./subjects.service";

export async function getSubjectsController(_req: Request, res: Response) {
  const subjects = await getAllSubjects();
  return res.status(200).json(subjects);
}

export async function getSubjectBySlugController(req: Request, res: Response) {
  const slug = String(req.params.slug);

  const subject = await getSubjectBySlug(slug);

  if (!subject) {
    return res.status(404).json({ message: "Предмет не найден" });
  }

  return res.status(200).json(subject);
}