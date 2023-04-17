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
        public publishDate: string,
        public userAnswers: number,
        public saved: Boolean
      ) {  }

    static emptyFeedback(): Feedback {
        return new this("", "", "", [], [], [], "", 0, true)
    }
}