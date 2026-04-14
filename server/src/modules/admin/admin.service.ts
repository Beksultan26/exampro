import { prisma } from "../../config/db";

type CreateSubjectInput = {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  group: string;
};

type UpdateSubjectInput = {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  group: string;
};

type CreateQuestionInput = {
  subjectSlug: string;
  questionText: string;
  explanation?: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

type UpdateQuestionInput = {
  questionText: string;
  explanation?: string;
};

type CreateTopicInput = {
  subjectSlug: string;
  title: string;
  content: string;
};

type UpdateTopicInput = {
  title: string;
  content: string;
};

export async function getAdminSubjects() {
  return prisma.subject.findMany({
    orderBy: { title: "asc" },
    include: {
      _count: {
        select: {
          topics: true,
          questions: true,
        },
      },
    },
  });
}

export async function createAdminSubject(data: CreateSubjectInput) {
  const exists = await prisma.subject.findUnique({
    where: { slug: data.slug },
  });

  if (exists) {
    throw new Error("Предмет с таким slug уже существует");
  }

  return prisma.subject.create({
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || "",
      icon: data.icon || "📘",
      color: data.color || "#06b6d4",
      group: data.group,
    },
  });
}

export async function updateAdminSubject(id: string, data: UpdateSubjectInput) {
  const exists = await prisma.subject.findFirst({
    where: {
      slug: data.slug,
      NOT: { id },
    },
  });

  if (exists) {
    throw new Error("Другой предмет уже использует этот slug");
  }

  return prisma.subject.update({
    where: { id },
    data: {
      title: data.title,
      slug: data.slug,
      description: data.description || "",
      icon: data.icon || "📘",
      color: data.color || "#06b6d4",
      group: data.group,
    },
  });
}

export async function deleteAdminSubject(id: string) {
  return prisma.subject.delete({
    where: { id },
  });
}

export async function getAdminQuestionsBySubject(subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: {
            orderBy: { id: "asc" },
          },
        },
      },
    },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  return subject;
}

export async function createAdminQuestion(data: CreateQuestionInput) {
  const subject = await prisma.subject.findUnique({
    where: { slug: data.subjectSlug },
    include: {
      questions: true,
    },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  if (!data.questionText.trim()) {
    throw new Error("Текст вопроса обязателен");
  }

  if (!Array.isArray(data.options) || data.options.length < 2) {
    throw new Error("Нужно минимум 2 варианта ответа");
  }

  const filteredOptions = data.options.filter((o) => o.optionText.trim() !== "");

  if (filteredOptions.length < 2) {
    throw new Error("Нужно минимум 2 заполненных варианта");
  }

  const correctCount = filteredOptions.filter((o) => o.isCorrect).length;

  if (correctCount !== 1) {
    throw new Error("Должен быть ровно 1 правильный ответ");
  }

  const nextOrder = subject.questions.length + 1;

  return prisma.question.create({
    data: {
      subjectId: subject.id,
      questionText: data.questionText,
      explanation: data.explanation || null,
      order: nextOrder,
      options: {
        create: filteredOptions.map((option) => ({
          optionText: option.optionText,
          isCorrect: option.isCorrect,
        })),
      },
    },
    include: {
      options: true,
    },
  });
}

export async function updateAdminQuestion(id: string, data: UpdateQuestionInput) {
  return prisma.question.update({
    where: { id },
    data: {
      questionText: data.questionText,
      explanation: data.explanation || null,
    },
  });
}

export async function deleteAdminQuestion(id: string) {
  return prisma.question.delete({
    where: { id },
  });
}

export async function getAdminTopicsBySubject(subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  return subject;
}

export async function createAdminTopic(data: CreateTopicInput) {
  const subject = await prisma.subject.findUnique({
    where: { slug: data.subjectSlug },
    include: {
      topics: true,
    },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  if (!data.title.trim()) {
    throw new Error("Название темы обязательно");
  }

  if (!data.content.trim()) {
    throw new Error("Текст темы обязателен");
  }

  const nextOrder = subject.topics.length + 1;

  return prisma.theoryTopic.create({
    data: {
      subjectId: subject.id,
      title: data.title,
      slug: `${data.title.toLowerCase().trim().replace(/\s+/g, "-")}-${Date.now()}`,
      content: data.content,
      order: nextOrder,
    },
  });
}

export async function updateAdminTopic(id: string, data: UpdateTopicInput) {
  return prisma.theoryTopic.update({
    where: { id },
    data: {
      title: data.title,
      content: data.content,
    },
  });
}

export async function deleteAdminTopic(id: string) {
  return prisma.theoryTopic.delete({
    where: { id },
  });
}