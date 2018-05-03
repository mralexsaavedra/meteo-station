import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthProvider } from '../providers/auth/auth';
import { HomePage } from '../pages/home/home';
import { InicioPage } from '../pages/inicio/inicio';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { GraphicsPage } from '../pages/graphics/graphics';
import { ChangePasswordPage } from '../pages/change-password/change-password';
import { GeolocalizacionPage } from '../pages/geolocalizacion/geolocalizacion';
import { AboutUsPage } from '../pages/about-us/about-us';

@Component({
  templateUrl: 'app.html',
})

export class MyApp {

  @ViewChild('content') navCtrl: NavController;

  rootPage:any;
  userProfile: any;
  //pages: Array<{title: string, component: any}>  

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, 
    public translate: TranslateService, afAuth: AngularFireAuth, private authData: AuthProvider) {      
      const authObserver = afAuth.authState.subscribe( user => {
        if (!user) {
          this.rootPage = HomePage;
          authObserver.unsubscribe();
        } else {
          this.userProfile = user;          
          this.rootPage = InicioPage;
          authObserver.unsubscribe();
        }
      });
      platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        statusBar.styleDefault();
        splashScreen.hide();
      });
      this.initTranslate();       
                       
  }
  
  initTranslate() {
    this.translate.setDefaultLang('es');

    if (this.translate.getBrowserLang() !== undefined) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use('es'); 
    } 
  }

  /*openPage(page) {
    this.navCtrl.push(page.component);
  }*/

  openEditProfile(){
    this.navCtrl.push(EditProfilePage);    
  }

  openViewGraphics(){
    this.navCtrl.push(GraphicsPage);        
  }

  openChangePassword(){
    this.navCtrl.push(ChangePasswordPage);            
  }

  openGeolocalizacion(){
    this.navCtrl.push(GeolocalizacionPage);                
  }

  openAboutUs(){
    this.navCtrl.push(AboutUsPage);                
  }

  logout(){
    this.authData.logoutUser();
    this.navCtrl.push(HomePage);
  }
}

