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
export declare function getAdminSubjects(): Promise<({
    _count: {
        topics: number;
        questions: number;
    };
} & {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
})[]>;
export declare function createAdminSubject(data: CreateSubjectInput): Promise<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}>;
export declare function updateAdminSubject(id: string, data: UpdateSubjectInput): Promise<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}>;
export declare function deleteAdminSubject(id: string): Promise<{
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}>;
export declare function getAdminQuestionsBySubject(subjectSlug: string): Promise<{
    questions: ({
        options: {
            id: string;
            questionId: string;
            optionText: string;
            isCorrect: boolean;
        }[];
    } & {
        id: string;
        order: number;
        subjectId: string;
        questionText: string;
        explanation: string | null;
    })[];
} & {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}>;
export declare function createAdminQuestion(data: CreateQuestionInput): Promise<{
    options: {
        id: string;
        questionId: string;
        optionText: string;
        isCorrect: boolean;
    }[];
} & {
    id: string;
    order: number;
    subjectId: string;
    questionText: string;
    explanation: string | null;
}>;
export declare function updateAdminQuestion(id: string, data: UpdateQuestionInput): Promise<{
    id: string;
    order: number;
    subjectId: string;
    questionText: string;
    explanation: string | null;
}>;
export declare function deleteAdminQuestion(id: string): Promise<{
    id: string;
    order: number;
    subjectId: string;
    questionText: string;
    explanation: string | null;
}>;
export declare function getAdminTopicsBySubject(subjectSlug: string): Promise<{
    topics: {
        id: string;
        title: string;
        slug: string;
        order: number;
        subjectId: string;
        content: string;
    }[];
} & {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
}>;
export declare function createAdminTopic(data: CreateTopicInput): Promise<{
    id: string;
    title: string;
    slug: string;
    order: number;
    subjectId: string;
    content: string;
}>;
export declare function updateAdminTopic(id: string, data: UpdateTopicInput): Promise<{
    id: string;
    title: string;
    slug: string;
    order: number;
    subjectId: string;
    content: string;
}>;
export declare function deleteAdminTopic(id: string): Promise<{
    id: string;
    title: string;
    slug: string;
    order: number;
    subjectId: string;
    content: string;
}>;
export {};
//# sourceMappingURL=admin.service.d.ts.map