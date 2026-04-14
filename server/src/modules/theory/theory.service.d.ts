export declare function getTopicBySlug(slug: string): Promise<({
    subject: {
        id: string;
        title: string;
        slug: string;
        icon: string | null;
        color: string | null;
    };
} & {
    id: string;
    title: string;
    slug: string;
    order: number;
    subjectId: string;
    content: string;
}) | null>;
//# sourceMappingURL=theory.service.d.ts.map