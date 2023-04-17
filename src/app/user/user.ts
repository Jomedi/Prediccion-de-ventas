export class User{
    constructor(
        public email: string,
        public name: string,
        public date: string,
        public address: string,
        public gender: string,
        public password: string,
        public key: string,
        public favourite_products: string[],
        public sharedFeedbacks: string[],
        public publishDate: string[],
        public feedbackDone: Boolean[],
        public feedbackOpened: Boolean[]
      ) {  }

    static emptyUser(): User {
        return new this("", "", "", "", "", "", "", [], [], [], [], []);
    }
}