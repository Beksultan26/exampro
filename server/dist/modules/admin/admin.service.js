"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminSubjects = getAdminSubjects;
exports.createAdminSubject = createAdminSubject;
exports.updateAdminSubject = updateAdminSubject;
exports.deleteAdminSubject = deleteAdminSubject;
exports.getAdminQuestions = getAdminQuestions;
exports.createAdminQuestion = createAdminQuestion;
exports.updateAdminQuestion = updateAdminQuestion;
exports.deleteAdminQuestion = deleteAdminQuestion;
exports.getAdminTopics = getAdminTopics;
exports.createAdminTopic = createAdminTopic;
exports.updateAdminTopic = updateAdminTopic;
exports.deleteAdminTopic = deleteAdminTopic;
const db_1 = require("../../config/db");
function normalizeText(value) {
    return value?.trim() || "";
}
function makeSlug(value) {
    return value
        .trim()
        .toLowerCase()
        .replace(/[^a-zA-Zа-яА-Я0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}
function validateOptions(options) {
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
    const slug = makeSlug(data.slug || data.title);
    const exists = await db_1.prisma.subject.findUnique({
        where: { slug },
    });
    if (exists) {
        throw new Error("Предмет с таким slug уже существует");
    }
    return db_1.prisma.subject.create({
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
async function updateAdminSubject(id, data) {
    const slug = makeSlug(data.slug || data.title);
    const existing = await db_1.prisma.subject.findFirst({
        where: {
            slug,
            NOT: { id },
        },
    });
    if (existing) {
        throw new Error("Другой предмет уже использует этот slug");
    }
    return db_1.prisma.subject.update({
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
async function deleteAdminSubject(id) {
    return db_1.prisma.subject.delete({
        where: { id },
    });
}
async function getAdminQuestions(subjectSlug) {
    const subject = await db_1.prisma.subject.findUnique({
        where: { slug: subjectSlug },
    });
    if (!subject) {
        throw new Error("Предмет не найден");
    }
    return db_1.prisma.question.findMany({
        where: { subjectId: subject.id },
        orderBy: { order: "asc" },
        include: {
            options: {
                orderBy: { id: "asc" },
            },
        },
    });
}
async function createAdminQuestion(data) {
    validateOptions(data.options);
    return db_1.prisma.question.create({
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
async function updateAdminQuestion(id, data) {
    validateOptions(data.options);
    return db_1.prisma.$transaction(async (tx) => {
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
async function deleteAdminQuestion(id) {
    return db_1.prisma.question.delete({
        where: { id },
    });
}
async function getAdminTopics(subjectSlug) {
    const subject = await db_1.prisma.subject.findUnique({
        where: { slug: subjectSlug },
    });
    if (!subject) {
        throw new Error("Предмет не найден");
    }
    return db_1.prisma.theoryTopic.findMany({
        where: { subjectId: subject.id },
        orderBy: [{ order: "asc" }, { title: "asc" }],
    });
}
async function createAdminTopic(data) {
    const subject = await db_1.prisma.subject.findUnique({
        where: { id: data.subjectId },
    });
    if (!subject) {
        throw new Error("Предмет не найден");
    }
    const slugBase = makeSlug(data.title);
    let finalSlug = slugBase;
    let counter = 1;
    while (await db_1.prisma.theoryTopic.findUnique({
        where: { slug: finalSlug },
    })) {
        finalSlug = `${slugBase}-${counter}`;
        counter += 1;
    }
    return db_1.prisma.theoryTopic.create({
        data: {
            subjectId: data.subjectId,
            title: normalizeText(data.title),
            slug: finalSlug,
            content: normalizeText(data.content),
        },
    });
}
async function updateAdminTopic(id, data) {
    const current = await db_1.prisma.theoryTopic.findUnique({
        where: { id },
    });
    if (!current) {
        throw new Error("Тема не найдена");
    }
    const slugBase = makeSlug(data.title);
    let finalSlug = slugBase;
    let counter = 1;
    while (await db_1.prisma.theoryTopic.findFirst({
        where: {
            slug: finalSlug,
            NOT: { id },
        },
    })) {
        finalSlug = `${slugBase}-${counter}`;
        counter += 1;
    }
    return db_1.prisma.theoryTopic.update({
        where: { id },
        data: {
            title: normalizeText(data.title),
            slug: finalSlug,
            content: normalizeText(data.content),
        },
    });
}
async function deleteAdminTopic(id) {
    return db_1.prisma.theoryTopic.delete({
        where: { id },
    });
}
//# sourceMappingURL=admin.service.js.map