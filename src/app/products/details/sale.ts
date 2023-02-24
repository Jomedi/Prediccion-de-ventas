import * as internal from "stream";

export class Sale{
    constructor(
        public title: string,
        public price: number,
        public email: string,
        public date: string,
        public quantity: number,
        public product_key: string,
        public key: string
        ) {  }

    static emptySale(): Sale {
        return new this("", 0, "", "", 0, "", "");
    }
}