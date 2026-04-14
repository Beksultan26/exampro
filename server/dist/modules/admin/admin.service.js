"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSubjects = getAdminSubjects;
exports.createAdminSubject = createAdminSubject;
exports.updateAdminSubject = updateAdminSubject;
exports.deleteAdminSubject = deleteAdminSubject;
exports.getAdminQuestionsBySubject = getAdminQuestionsBySubject;
exports.createAdminQuestion = createAdminQuestion;
exports.updateAdminQuestion = updateAdminQuestion;
exports.deleteAdminQuestion = deleteAdminQuestion;
exports.getAdminTopicsBySubject = getAdminTopicsBySubject;
exports.createAdminTopic = createAdminTopic;
exports.updateAdminTopic = updateAdminTopic;
exports.deleteAdminTopic = deleteAdminTopic;
const db_1 = require("../../config/db");
async function getAdminSubjects() {
    return db_1.prisma.subject.findMany({
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
async function createAdminSubject(data) {
    const exists = await db_1.prisma.subject.findUnique({
        where: { slug: data.slug },
    });
    if (exists) {
        throw new Error("Предмет с таким slug уже существует");
    }
    return db_1.prisma.subject.create({
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
async function updateAdminSubject(id, data) {
    const exists = await db_1.prisma.subject.findFirst({
        where: {
            slug: data.slug,
            NOT: { id },
        },
    });
    if (exists) {
        throw new Error("Другой предмет уже использует этот slug");
    }
    return db_1.prisma.subject.update({
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
async function deleteAdminSubject(id) {
    return db_1.prisma.subject.delete({
        where: { id },
    });
}
async function getAdminQuestionsBySubject(subjectSlug) {
    const subject = await db_1.prisma.subject.findUnique({
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
async function createAdminQuestion(data) {
    const subject = await db_1.prisma.subject.findUnique({
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
    return db_1.prisma.question.create({
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
async function updateAdminQuestion(id, data) {
    return db_1.prisma.question.update({
        where: { id },
        data: {
            questionText: data.questionText,
            explanation: data.explanation || null,
        },
    });
}
async function deleteAdminQuestion(id) {
    return db_1.prisma.question.delete({
        where: { id },
    });
}
async function getAdminTopicsBySubject(subjectSlug) {
    const subject = await db_1.prisma.subject.findUnique({
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
async function createAdminTopic(data) {
    const subject = await db_1.prisma.subject.findUnique({
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
    return db_1.prisma.theoryTopic.create({
        data: {
            subjectId: subject.id,
            title: data.title,
            slug: `${data.title.toLowerCase().trim().replace(/\s+/g, "-")}-${Date.now()}`,
            content: data.content,
            order: nextOrder,
        },
    });
}
async function updateAdminTopic(id, data) {
    return db_1.prisma.theoryTopic.update({
        where: { id },
        data: {
            title: data.title,
            content: data.content,
        },
    });
}
async function deleteAdminTopic(id) {
    return db_1.prisma.theoryTopic.delete({
        where: { id },
    });
}
//# sourceMappingURL=admin.service.js.map