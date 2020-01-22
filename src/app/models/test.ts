import { Question} from './question';

export class Test {
  _id: string;
  name: string;
  description: string;
  questions: Question[];
  participants: number;
}
