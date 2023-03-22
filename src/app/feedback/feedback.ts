import * as internal from "stream";

export class Feedback{
    constructor(
        public key: string,
        public title: string,
        public description: string,
        public questions: any[],
        // usuario / respuesta
        public answers: string[][],
        public answerDate: string[],
        public userAnswers: number,
      ) {  }

    static emptyFeedback(): Feedback {
        return new this("", "", "", [], [], [], 0)
    }
}