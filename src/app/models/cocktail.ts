export class Cocktail {
    idDrink: string;
    strDrink: string;
    strCategory: string;
    strDrinkThumb: string;
    custom: boolean;
    starred: boolean;

    constructor(id: string, name: string, category: string, thumbail?: string) {
        this.idDrink = id;
        this.strDrink = name;
        this.strCategory = category;
        this.strDrinkThumb = thumbail ? thumbail : "../../assets/icon/beerIcon.png";
        this.custom = true;
        this.starred = true;
    }
}
