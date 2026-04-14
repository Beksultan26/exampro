import { prisma } from "../../config/db";

export async function getAllSubjects() {
  return prisma.subject.findMany({
    orderBy: { title: "asc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      icon: true,
      color: true,
      group: true,
      _count: {
        select: {
          topics: true,
          questions: true,
        },
      },
    },
  });
}

export async function getSubjectBySlug(slug: string) {
  return prisma.subject.findUnique({
    where: { slug },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
    },
  });
}