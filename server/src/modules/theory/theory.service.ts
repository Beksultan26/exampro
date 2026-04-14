import { prisma } from "../../config/db";

export async function getTopicBySlug(slug: string) {
  return prisma.theoryTopic.findUnique({
    where: { slug },
    include: {
      subject: {
        select: {
          id: true,
          title: true,
          slug: true,
          icon: true,
          color: true,
        },
      },
    },
  });
}