type SubmitAnswer = {
    questionId: string;
    selectedOptionId: string;
};
export declare function getQuizBySubjectSlug(slug: string, userId?: string, mode?: string): Promise<{
    questions: ({
        options: {
            id: string;
            optionText: string;
        }[];
    } & {
        id: string;
        order: number;
        subjectId: string;
        questionText: string;
        explanation: string | null;
    })[];
    id: string;
    title: string;
    slug: string;
    description: string | null;
    icon: string | null;
    color: string | null;
    group: string;
} | null>;
export declare function getExamQuiz(): Promise<{
    title: string;
    slug: string;
    questions: ({
        options: {
            id: string;
            optionText: string;
        }[];
        subject: {
            title: string;
            slug: string;
        };
    } & {
        id: string;
        order: number;
        subjectId: string;
        questionText: string;
        explanation: string | null;
    })[];
}>;
export declare function submitExamQuiz(userId: string, answers: SubmitAnswer[]): Promise<{
    subject: {
        title: string;
        slug: string;
    };
} & {
    id: string;
    createdAt: Date;
    subjectId: string;
    userId: string;
    score: number;
    totalQuestions: number;
}>;
export declare function submitQuiz(userId: string, subjectSlug: string, answers: SubmitAnswer[]): Promise<{
    subject: {
        title: string;
        slug: string;
    };
} & {
    id: string;
    createdAt: Date;
    subjectId: string;
    userId: string;
    score: number;
    totalQuestions: number;
}>;
export declare function getQuizHistory(userId: string): Promise<({
    subject: {
        title: string;
        slug: string;
    };
} & {
    id: string;
    createdAt: Date;
    subjectId: string;
    userId: string;
    score: number;
    totalQuestions: number;
})[]>;
export declare function getAttemptById(attemptId: string, userId: string): Promise<({
    subject: {
        title: string;
        slug: string;
    };
    answers: ({
        question: {
            questionText: string;
            explanation: string | null;
        };
        selectedOption: {
            optionText: string;
        };
    } & {
        id: string;
        questionId: string;
        isCorrect: boolean;
        attemptId: string;
        selectedOptionId: string;
    })[];
} & {
    id: string;
    createdAt: Date;
    subjectId: string;
    userId: string;
    score: number;
    totalQuestions: number;
}) | null>;
export {};
//# sourceMappingURL=quiz.service.d.ts.map