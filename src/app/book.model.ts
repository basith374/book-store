export class Book {
    constructor(public id: string,
        public title: string,
        public author: string,
        public isbn: string,
        public publisher: string,
        public format: string,
        public publication_date: string,
        public price: number,
        public genre: string,) {

    }
}