import * as internal from "stream";

export class Survey{
    constructor(
        public title: string,
        public description: string,
        public answers: string[][],
        public answerDate: string[],
        public userAnswers: number
      ) {  }

    static emptySurvey(): Survey {
        return new this("", "", [], [], 0);
    }
}