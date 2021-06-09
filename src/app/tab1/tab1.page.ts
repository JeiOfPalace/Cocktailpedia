import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Cocktail } from '../models/cocktail';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allCocktails: Array<Cocktail> = [];
  public myCocktail: any;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.getAllCocktails()
  }

  getAllCocktails() {
    const apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s='
    this.http.get(apiURL).subscribe((data: any) => {
      this.allCocktails = data.drinks;
      this.allCocktails.sort();
    });
  }

  setSelectedCocktail(cocktail: any) {
    this.myCocktail = cocktail;
  }

  toggleStarred(cocktail: Cocktail) {
    if (cocktail.starred) {
      this.authService.deleteCocktail(cocktail.idDrink);
    } else {
      this.authService.addCocktail(cocktail)
    }
  }

  clearSelectedCocktail() {
    this.myCocktail = "";
  }
}
