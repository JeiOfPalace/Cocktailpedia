import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  public allCocktails: Array<any> = [];
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

  toggleStarred(cocktail: any) {
    cocktail.starred = !cocktail.starred;
    if (cocktail.starred) {
      this.authService.cocktails.push(cocktail)
    } else {
      for (var i = 0; i < this.authService.cocktails.length; i++) {
        if (this.authService.cocktails[i] === cocktail) {
          this.authService.cocktails.splice(i, 1);
        }
      }
    }
  }

  clearSelectedCocktail() {
    this.myCocktail = "";
  }
}
