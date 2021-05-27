import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page {

  email: string = "";
  password: string = "";
  password2: string = "";

  status: string = "";
  editing: boolean = false;
  updating: boolean = false;

  cName: string = "";
  cCategory: string = "";

  auxCocktail: any = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.status = (!this.authService.isLoggedIn) ? "login" : "profile"
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: 2000,
      position: "top",
      translucent: true
    });
    toast.present();
  }

  removeCocktail(cocktail: any) {
    for (var i = 0; i < this.authService.cocktails.length; i++) {
      if (this.authService.cocktails[i] === cocktail) {
        this.authService.cocktails.splice(i, 1);
      }
    }
    this.cName = "";
    this.cCategory = "";
  }

  async loginUser(): Promise<void> {
    this.authService.loginUser(this.email, this.password)
      .then(() => {
        this.status = "profile"
      })
      .then(() => {
        this.presentToast("Hi again!", "success");
      })
      .then(
        () => {
          this.router.navigate(['/']);
        },
        async error => {
          const alert = await this.alertCtrl.create({
            message: error.message,
            buttons: [{ text: 'Ok', role: 'cancel' }],
          });
          await alert.present();
        }
      );
  }

  async registerUser(): Promise<void> {
    if (this.password === this.password2) {
      this.authService.signupUser(this.email, this.password)
        .then(() => {
          this.status = "profile"
        })
        .then(() => {
          this.presentToast("Account successfully created", "success");
        })
        .then(
          () => {
            this.router.navigate(["."]);
          },
          async error => {
            const alert = await this.alertCtrl.create({
              message: error.message,
              buttons: [{ text: 'Ok', role: 'cancel' }],
            });
            await alert.present();
          }
        );
    } else alert("Passwords are different!")
  }

  async logoutUser(): Promise<void> {
    this.authService.logoutUser()
      .then(() => {
        this.status = "login"
      })
  }

  cancelCocktail() {
    this.cName = "";
    this.cCategory = "";
    this.editing = false;
    this.updating = false;
  }

  saveCocktail() {
    if (!this.updating) {
      this.authService.cocktails.push({
        strDrink: this.cName,
        strCategory: this.cCategory,
        strDrinkThumb: "../../assets/icon/beerIcon.png"
      })
    } else {
      for (var i = 0; i < this.authService.cocktails.length; i++) {
        if (this.authService.cocktails[i] === this.auxCocktail) {
          this.authService.cocktails[i].strDrink = this.cName;
          this.authService.cocktails[i].strCategory = this.cCategory;
        }
      }
    }

    this.editing = false;
    this.updating = false;
  }

  editCocktail(cocktail: any) {
    this.updating = true;
    this.auxCocktail = cocktail;
  }
}
