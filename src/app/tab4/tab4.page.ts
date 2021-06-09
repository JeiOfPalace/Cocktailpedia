import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';
import { map } from 'rxjs/operators';
import { Cocktail } from '../models/cocktail';
import { AuthService } from '../services/auth.service';
import { Tab1Page } from '../tab1/tab1.page';

@Component({
  selector: 'app-tab4',
  templateUrl: 'tab4.page.html',
  styleUrls: ['tab4.page.scss']
})

export class Tab4Page implements OnInit {

  email: string = "";
  password: string = "";
  password2: string = "";

  status: string = "";
  editing: boolean = false;
  updating: boolean = false;

  newCocktail: Cocktail;
  auxCocktail: Cocktail;
  cocktails = [];

  cName: string = "";
  cCategory: string = "";

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController,
    public toastController: ToastController,
    private firestore: AngularFirestore,
    private tab1page: Tab1Page
  ) { }

  ngOnInit() {
    this.status = (!this.authService.isLoggedIn) ? "login" : "profile";
    this.retrieveCocktails();
  }

  retrieveCocktails(param?: string): void {
    if (this.authService.isLoggedIn) {
      if (param) {
        this.presentToast("Refreshed!", "success", 500)
      }

      console.log("aAA2")
      this.authService.getCocktails().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {
        this.cocktails = data;
      });
    }
  }

  async presentToast(message: string, color: string, duration?: number) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      duration: duration ? duration : 2000,
      position: "top",
      translucent: true
    });
    toast.present();
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
        .then(() => { this.status = "profile" })
        .then(() => { this.presentToast("Account successfully created", "success"); })
        .then(() => { this.router.navigate(["."]); },
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
    this.authService.logoutUser().then(() => { this.status = "login" });
  }

  refreshData() {
    //this.updatedCocktail = null
    this.retrieveCocktails;
  }

  cancelCocktail() {
    this.editing = false;
    this.updating = false;
    this.refreshData();
  }

  saveCocktail() {
    if (!this.updating) {
      this.authService.addCocktail(
        {
          idDrink: this.firestore.createId(),
          strDrink: this.cName,
          strCategory: this.cCategory,
          strDrinkThumb: "../../assets/icon/beerIcon.png"
        }
      )
    } else {
      this.authService.updateCocktail(this.newCocktail)
    }
    this.editing = false;
    this.updating = false;
    this.refreshData();
  }

  editCocktail(cocktail: Cocktail) {
    this.newCocktail = new Cocktail(cocktail.idDrink, cocktail.strDrink, cocktail.strCategory)
    this.updating = true;
    this.auxCocktail = cocktail;
  }

  removeCocktail(id: string, cocktail: Cocktail) {
    this.authService.deleteCocktail(id);
    //this.tab1page.toggleStarred(cocktail);
    this.refreshData();
  }
}
