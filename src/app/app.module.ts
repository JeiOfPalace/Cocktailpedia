import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { AngularFireModule } from '@angular/fire';
import { AuthService } from './services/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyBq0jGLIltiq5NMyVuXD46siZoZLEmgrGg",
      authDomain: "beer-id.firebaseapp.com",
      projectId: "beer-id",
      storageBucket: "beer-id.appspot.com",
      messagingSenderId: "461553793668",
      appId: "1:461553793668:web:becbbf636d9583473ee0d1"
    })],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    AngularFireAuth,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
