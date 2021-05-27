import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  public randomCocktails: Array<any> = [];

  public correctCocktail: any = "";
  public answer: any = "";
  public message: string = "";

  constructor(
    private user: AuthService,
    private http: HttpClient,
    public toastController: ToastController
  ) { }

  ngOnInit() {
    this.getRandomCocktails();
  }

  getRandomCocktails(): any {
    this.message = "";
    this.randomCocktails = [];

    for (let i = 0; i < 3; i++) {
      let apiURL = 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
      this.http.get(apiURL).subscribe(
        (data: Array<any>) => {
          this.randomCocktails.push(data['drinks'][0]);
          if (this.randomCocktails.length == 3) {
            this.correctCocktail = this.randomCocktails[Math.floor(Math.random() * 2)];
          }
        }
      );
    }
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 1000,
      position: "top",
      translucent: true
    });
    toast.present();
  }

  getAnswer(cocktail: any) {

    this.answer = cocktail;

    if (this.answer == this.correctCocktail) {
      this.presentToast("Correct!", "success");
      this.user.points++;
    } else {
      this.user.points--;
      if (this.user.points < 0) this.user.points = 0;
      this.presentToast("Incorrect. It was " + this.correctCocktail['strDrink'] + " drink...", "danger");
    }

    this.getRandomCocktails()
  }

  reset() {
    this.user.points = 0;
    this.ngOnInit()
  }
}
