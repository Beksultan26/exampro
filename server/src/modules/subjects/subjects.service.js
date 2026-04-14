"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubjects = getAllSubjects;
exports.getSubjectBySlug = getSubjectBySlug;
const db_1 = require("../../config/db");
async function getAllSubjects() {
    return db_1.prisma.subject.findMany({
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
async function getSubjectBySlug(slug) {
    return db_1.prisma.subject.findUnique({
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
//# sourceMappingURL=subjects.service.js.map