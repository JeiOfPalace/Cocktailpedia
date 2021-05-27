import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import firebase from 'firebase/app';
import 'firebase/auth';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private user;
  public userDetails: firebase.User = null;
  public displayName = '';
  public points = 0;
  public cocktails: Array<any> = [];

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
          this.router.navigate(['/']);
        } else {
          this.userDetails = null;
        }
      }
    )
  }

  loginUser(email: string, password: string): Promise<firebase.auth.UserCredential> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  get isLoggedIn() {
    return (this.userDetails) ? true : false;
  }

  saveCocktail(
    id: string,
    name: string,
    category: string
  ) {
    return this.firestore.collection('usuaris').doc(this.userDetails.uid).collection('cocktails').doc(id).set({
      id,
      name,
      category
    })
  }

  deleteCocktail(id: string) {
    return this.firestore.collection('usuaris').doc(this.userDetails.uid).collection('cocktails').doc(id).delete();
  }
}
