/**
 * IDEA:
 *
 * the strings in the chosenFields array will be compared by their order. Either 1 point for each answer in the right spot
 * OR 1 point if all answers are correctly ordered.
 *
 */

export class Answer {
    chosenFields: string[];
    tickedBoxes: boolean[];

    constructor(amount: number) {
        this.chosenFields = new Array(amount);
        this.tickedBoxes = new Array(amount);

        for (let i = 0; i < this.tickedBoxes.length; i++) {
            this.tickedBoxes[i] = false;
        }
    }
}
