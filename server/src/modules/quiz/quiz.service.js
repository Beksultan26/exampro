"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuizBySubjectSlug = getQuizBySubjectSlug;
exports.getExamQuiz = getExamQuiz;
exports.submitExamQuiz = submitExamQuiz;
exports.submitQuiz = submitQuiz;
exports.getQuizHistory = getQuizHistory;
exports.getAttemptById = getAttemptById;
const db_1 = require("../../config/db");
function shuffleArray(items) {
    return [...items].sort(() => Math.random() - 0.5);
}
async function getQuizBySubjectSlug(slug, userId, mode) {
    const subject = await db_1.prisma.subject.findUnique({
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
    const attempts = await db_1.prisma.quizAttempt.findMany({
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
    const wrongQuestionIds = Array.from(new Set(attempts.flatMap((attempt) => attempt.answers.map((answer) => answer.questionId))));
    const filteredQuestions = subject.questions.filter((question) => wrongQuestionIds.includes(question.id));
    return {
        ...subject,
        questions: shuffleArray(filteredQuestions),
    };
}
async function getExamQuiz() {
    const questions = await db_1.prisma.question.findMany({
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
async function submitExamQuiz(userId, answers) {
    const questions = await db_1.prisma.question.findMany({
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
        const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
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
    const examSubject = await db_1.prisma.subject.findFirst({
        where: { slug: "general-exam" },
    });
    if (!examSubject) {
        throw new Error("Для общего экзамена нужен предмет с slug: general-exam");
    }
    const attempt = await db_1.prisma.quizAttempt.create({
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
async function submitQuiz(userId, subjectSlug, answers) {
    const subject = await db_1.prisma.subject.findUnique({
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
        const selectedOption = question.options.find((o) => o.id === answer.selectedOptionId);
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
    const attempt = await db_1.prisma.quizAttempt.create({
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
async function getQuizHistory(userId) {
    return db_1.prisma.quizAttempt.findMany({
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
async function getAttemptById(attemptId, userId) {
    return db_1.prisma.quizAttempt.findFirst({
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
//# sourceMappingURL=quiz.service.js.map