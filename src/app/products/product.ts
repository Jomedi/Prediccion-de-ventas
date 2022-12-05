import * as internal from "stream";

export class Product{
    constructor(
        public title: string,
        public description: string,
        public price: number,
        public img: string,
        public key: string
      ) {  }

    static emptyProduct(): Product {
        return new this("", "", 0, "", "");
    }
}