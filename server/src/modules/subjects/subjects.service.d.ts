export declare function getAllSubjects(): Promise<{
    id: string;
    _count: {
        topics: number;
        questions: number;
    };
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}[]>;
export declare function getSubjectBySlug(slug: string): Promise<({
    _count: {
        questions: number;
    };
    topics: {
        id: string;
        title: string;
        slug: string;
        order: number;
    }[];
} & {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}) | null>;
//# sourceMappingURL=subjects.service.d.ts.map