import { prisma } from "../../config/db";

type SubmitAnswer = {
  questionId: string;
  selectedOptionId: string;
};

function shuffleArray<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

export async function getQuizBySubjectSlug(
  slug: string,
  userId?: string,
  mode?: string
) {
  const subject = await prisma.subject.findUnique({
    where: { slug },
    include: {
      questions: {
        orderBy: { order: "asc" },
        include: {
          options: {
            select: {
              id: true,
              optionText: true,
            },
          },
        },
      },
    },
  });

  if (!subject) {
    return null;
  }

  if (mode !== "mistakes" || !userId) {
    return {
      ...subject,
      questions: shuffleArray(subject.questions),
    };
  }

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId,
      subjectId: subject.id,
    },
    include: {
      answers: {
        where: {
          isCorrect: false,
        },
        select: {
          questionId: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const wrongQuestionIds = Array.from(
    new Set(
      attempts.flatMap((attempt) =>
        attempt.answers.map((answer) => answer.questionId)
      )
    )
  );

  const filteredQuestions = subject.questions.filter((question) =>
    wrongQuestionIds.includes(question.id)
  );

  return {
    ...subject,
    questions: shuffleArray(filteredQuestions),
  };
}

export async function getExamQuiz() {
  const questions = await prisma.question.findMany({
    include: {
      options: {
        select: {
          id: true,
          optionText: true,
        },
      },
      subject: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  const shuffled = shuffleArray(questions).slice(0, 30);

  return {
    title: "Общий экзамен",
    slug: "general-exam",
    questions: shuffled,
  };
}

export async function submitExamQuiz(
  userId: string,
  answers: SubmitAnswer[]
) {
  const questions = await prisma.question.findMany({
    include: {
      options: true,
    },
  });

  if (!questions.length) {
    throw new Error("Вопросы не найдены");
  }

  let score = 0;

  const checkedAnswers = answers.map((answer) => {
    const question = questions.find((q) => q.id === answer.questionId);

    if (!question) {
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: false,
      };
    }

    const selectedOption = question.options.find(
      (o) => o.id === answer.selectedOptionId
    );
    const isCorrect = Boolean(selectedOption?.isCorrect);

    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect,
    };
  });

  const examSubject = await prisma.subject.findFirst({
    where: { slug: "general-exam" },
  });

  if (!examSubject) {
    throw new Error(
      "Для общего экзамена нужен предмет с slug: general-exam"
    );
  }

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      subjectId: examSubject.id,
      score,
      totalQuestions: answers.length,
      answers: {
        create: checkedAnswers,
      },
    },
    include: {
      subject: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  return attempt;
}

export async function submitQuiz(
  userId: string,
  subjectSlug: string,
  answers: SubmitAnswer[]
) {
  const subject = await prisma.subject.findUnique({
    where: { slug: subjectSlug },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  if (!subject) {
    throw new Error("Предмет не найден");
  }

  let score = 0;

  const checkedAnswers = answers.map((answer) => {
    const question = subject.questions.find((q) => q.id === answer.questionId);

    if (!question) {
      return {
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect: false,
      };
    }

    const selectedOption = question.options.find(
      (o) => o.id === answer.selectedOptionId
    );
    const isCorrect = Boolean(selectedOption?.isCorrect);

    if (isCorrect) {
      score += 1;
    }

    return {
      questionId: answer.questionId,
      selectedOptionId: answer.selectedOptionId,
      isCorrect,
    };
  });

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId,
      subjectId: subject.id,
      score,
      totalQuestions: subject.questions.length,
      answers: {
        create: checkedAnswers,
      },
    },
    include: {
      subject: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });

  return attempt;
}

export async function getQuizHistory(userId: string) {
  return prisma.quizAttempt.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      subject: {
        select: {
          title: true,
          slug: true,
        },
      },
    },
  });
}

export async function getAttemptById(attemptId: string, userId: string) {
  return prisma.quizAttempt.findFirst({
    where: {
      id: attemptId,
      userId,
    },
    include: {
      subject: {
        select: {
          title: true,
          slug: true,
        },
      },
      answers: {
        include: {
          question: {
            select: {
              questionText: true,
              explanation: true,
            },
          },
          selectedOption: {
            select: {
              optionText: true,
            },
          },
        },
      },
    },
  });
}