export class User{
    constructor(
        public email: string,
        public name: string,
        public date: string,
        public address: string,
        public gender: string,
        public password: string,
        public key: string
      ) {  }

    static emptyUser(): User {
        return new this("", "", "", "", "", "", "");
    }
}