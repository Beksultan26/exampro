"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopicBySlug = getTopicBySlug;
const db_1 = require("../../config/db");
async function getTopicBySlug(slug) {
    return db_1.prisma.theoryTopic.findUnique({
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
//# sourceMappingURL=theory.service.js.map