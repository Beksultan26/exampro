import { prisma } from "../../config/db";

export type CreateSubjectInput = {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  group: string;
};

export type UpdateSubjectInput = {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  group: string;
};

export type CreateQuestionInput = {
  subjectId: string;
  questionText: string;
  explanation?: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

export type UpdateQuestionInput = {
  questionText: string;
  explanation?: string;
  options: {
    optionText: string;
    isCorrect: boolean;
  }[];
};

export type CreateTopicInput = {
  subjectId: string;
  title: string;
  content: string;
};

export type UpdateTopicInput = {
  title: string;
  content: string;
};

function normalizeText(value?: string) {
  return value?.trim() || "";
}

function makeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-zA-Zа-яА-Я0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function validateOptions(
  options: { optionText: string; isCorrect: boolean }[]
): void {
  if (!Array.isArray(options) || options.length < 2) {
    throw new Error("Нужно минимум 2 варианта ответа");
  }

  const cleaned = options.map((o) => ({
    optionText: normalizeText(o.optionText),
    isCorrect: !!o.isCorrect,
  }));

  if (cleaned.some((o) => !o.optionText)) {
    throw new Error("Все варианты ответа должны быть заполнены");
  }

  const correctCount = cleaned.filter((o) => o.isCorrect).length;

  if (correctCount !== 1) {
    throw new Error("Должен быть ровно 1 правильный ответ");
  }
}

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
  const slug = makeSlug(data.slug || data.title);

  const exists = await prisma.subject.findUnique({
    where: { slug },
  });

  if (exists) {
    throw new Error("Предмет с таким slug уже существует");
  }

  return prisma.subject.create({
    data: {
      title: normalizeText(data.title),
      slug,
      description: normalizeText(data.description) || null,
      icon: normalizeText(data.icon) || null,
      color: normalizeText(data.color) || null,
      group: normalizeText(data.group),
    },
  });
}

export async function updateAdminSubject(id: string, data: UpdateSubjectInput) {
  const slug = makeSlug(data.slug || data.title);

  const existing = await prisma.subject.findFirst({
    where: {
      slug,
      NOT: { id },
    },
  });

  if (existing) {
    throw new Error("Другой предмет уже использует этот slug");
  }

  return prisma.subject.update({
    where: { id },
    data: {
      title: normalizeText(data.title),
      slug,
      description: normalizeText(data.description) || null,
      icon: normalizeText(data.icon) || null,
      color: normalizeText(data.color) || null,
      group: normalizeText(data.group),
    },
  });
}

export async function deleteAdminSubject(id: string) {
  return prisma.subject.delete({
    where: { id },
  });
}

export async function getAdminQuestions(subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  return prisma.question.findMany({
    where: { subjectId: subject.id },
    orderBy: [{ order: "asc" }, { createdAt: "asc" as never }],
    include: {
      options: {
        orderBy: { id: "asc" },
      },
    },
  });
}

export async function createAdminQuestion(data: CreateQuestionInput) {
  validateOptions(data.options);

  return prisma.question.create({
    data: {
      subjectId: data.subjectId,
      questionText: normalizeText(data.questionText),
      explanation: normalizeText(data.explanation) || null,
      options: {
        create: data.options.map((option) => ({
          optionText: normalizeText(option.optionText),
          isCorrect: !!option.isCorrect,
        })),
      },
    },
    include: {
      options: true,
    },
  });
}

export async function updateAdminQuestion(id: string, data: UpdateQuestionInput) {
  validateOptions(data.options);

  return prisma.$transaction(async (tx) => {
    await tx.answerOption.deleteMany({
      where: { questionId: id },
    });

    const updated = await tx.question.update({
      where: { id },
      data: {
        questionText: normalizeText(data.questionText),
        explanation: normalizeText(data.explanation) || null,
        options: {
          create: data.options.map((option) => ({
            optionText: normalizeText(option.optionText),
            isCorrect: !!option.isCorrect,
          })),
        },
      },
      include: {
        options: true,
      },
    });

    return updated;
  });
}

export async function deleteAdminQuestion(id: string) {
  return prisma.question.delete({
    where: { id },
  });
}

export async function getAdminTopics(subjectSlug: string) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  return prisma.theoryTopic.findMany({
    where: { subjectId: subject.id },
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
}

export async function createAdminTopic(data: CreateTopicInput) {
  const subject = await prisma.subject.findUnique({
    where: { id: data.subjectId },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  const slugBase = makeSlug(data.title);
  let finalSlug = slugBase;
  let counter = 1;

  while (
    await prisma.theoryTopic.findUnique({
      where: { slug: finalSlug },
    })
  ) {
    finalSlug = `${slugBase}-${counter}`;
    counter += 1;
  }

  return prisma.theoryTopic.create({
    data: {
      subjectId: data.subjectId,
      title: normalizeText(data.title),
      slug: finalSlug,
      content: normalizeText(data.content),
    },
  });
}

export async function updateAdminTopic(id: string, data: UpdateTopicInput) {
  const current = await prisma.theoryTopic.findUnique({
    where: { id },
  });

  if (!current) {
    throw new Error("Тема не найдена");
  }

  const slugBase = makeSlug(data.title);
  let finalSlug = slugBase;
  let counter = 1;

  while (
    await prisma.theoryTopic.findFirst({
      where: {
        slug: finalSlug,
        NOT: { id },
      },
    })
  ) {
    finalSlug = `${slugBase}-${counter}`;
    counter += 1;
  }

  return prisma.theoryTopic.update({
    where: { id },
    data: {
      title: normalizeText(data.title),
      slug: finalSlug,
      content: normalizeText(data.content),
    },
  });
}

export async function deleteAdminTopic(id: string) {
  return prisma.theoryTopic.delete({
    where: { id },
  });
}