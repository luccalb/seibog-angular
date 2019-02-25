import { User } from './user';
import { Answer } from './answer';

export class TestSheet {
    _id: string;
    user: User;
    answers: Answer[];
    version: string;
}
