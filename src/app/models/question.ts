/**
 * QUESTION TYPES:
 *
 * 1 : Richtige Antwort(en) auswählem
 *
 * 2 : Zuordnen
 *
 * TODO : 3 : Codeschnipsel
 */

export class Question {
    question: string;
    images: string;
    possibleAnswers: string[];
    possibleFields: string[];
    type: number;
}
