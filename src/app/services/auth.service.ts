import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';
import { Cocktail } from '../models/cocktail';


@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private user;
  public userDetails: firebase.User = null;
  public displayName = '';
  public points = 0;
  private cocktailCollection: AngularFirestoreCollection<Cocktail>

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private router: Router) {

    this.user = afAuth.authState;
    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          this.displayName = (this.userDetails.displayName) ? this.userDetails.displayName : this.userDetails.email;
          this.cocktailCollection = this.firestore.collection('users').doc(this.userDetails.uid).collection('cocktails');
          this.router.navigate(['/']);
        } else this.userDetails = null;
      }
    );
  }

  getUserDetalis(): firebase.User {
    return this.userDetails;
  }

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  get isLoggedIn(): boolean {
    return (this.userDetails) ? true : false;
  }

  deleteCocktail(id: string) {
    this.cocktailCollection.doc(id).delete();
  }

  getCocktails(): AngularFirestoreCollection<Cocktail> {
    return this.cocktailCollection;
  }

  updateCocktail(cocktail: Cocktail) {
    return this.cocktailCollection.doc(cocktail.idDrink).update({
      strDrink: cocktail.strDrink,
      strCategory: cocktail.strCategory
    });
  }

  addCocktail(cocktail: any) {
    return this.cocktailCollection.doc(cocktail.idDrink).set(cocktail);
  }
}