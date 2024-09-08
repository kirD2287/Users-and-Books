

export class CreateBookDto {
    readonly title!: string;
    readonly authorId!: number;
    readonly publicationDate!: Date;
    readonly genres!: string;
}