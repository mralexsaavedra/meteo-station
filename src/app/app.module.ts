import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Camera } from '@ionic-native/camera';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule, AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { GoogleMaps } from '@ionic-native/google-maps';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { InicioPage } from '../pages/inicio/inicio';
import { ResetPasswordPage } from '../pages/reset-password/reset-password';
import { OtherLoginPage } from '../pages/other-login/other-login';
import { GraphicsPage } from '../pages/graphics/graphics';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { ChangeEmailPage } from '../pages/change-email/change-email';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { GeolocalizacionPage } from '../pages/geolocalizacion/geolocalizacion';
import { AboutUsPage } from '../pages/about-us/about-us';

import { AuthProvider } from '../providers/auth/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyBkL5c9QwD6oCbH92fY5WY3cbH2uSWVTBo",
  authDomain: "saga-ionic.firebaseapp.com",
  databaseURL: "https://saga-ionic.firebaseio.com",
  storageBucket: "saga-ionic.appspot.com",
  messagingSenderId: '146850990651'
};

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    InicioPage,
    ResetPasswordPage,
    OtherLoginPage,
    GraphicsPage,
    EditProfilePage,
    ChangeEmailPage,
    ChangePasswordPage,
    GeolocalizacionPage,
    AboutUsPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    HttpClientModule,
    HttpModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    SignupPage,
    InicioPage,
    ResetPasswordPage,
    OtherLoginPage,
    GraphicsPage,
    EditProfilePage,
    ChangeEmailPage,
    ChangePasswordPage,
    GeolocalizacionPage,
    AboutUsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AngularFireDatabase,
    AuthProvider,
    GooglePlus,
    Facebook,
    TwitterConnect,
    Camera,
    GoogleMaps,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
