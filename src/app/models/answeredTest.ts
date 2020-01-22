import { Answer } from './answer';

export class AnsweredTest {
    _id: string;
    userId: string;
    answers: Answer[];
    testId: string;
}

