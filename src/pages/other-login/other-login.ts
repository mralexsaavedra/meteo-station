import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, Loading,
  AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';  
import { GooglePlus } from '@ionic-native/google-plus';
import { Facebook } from '@ionic-native/facebook';  
import { TwitterConnect } from '@ionic-native/twitter-connect';
import { InicioPage } from '../inicio/inicio';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-other-login',
  templateUrl: 'other-login.html',
})
export class OtherLoginPage {

  userProfile: any;
  loading: Loading;    
  fireauth = firebase.auth();
  okString: string;
  cancelString: string;          

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, 
    public loadingCtrl: LoadingController, public translateService: TranslateService, public alertCtrl: AlertController,
    private googlePlus: GooglePlus, private facebook: Facebook, private twitter: TwitterConnect) {
    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        this.userProfile = user;
      } else {
        this.userProfile = null;
      }
    });
    this.translateService.get('OK').subscribe((value) => {
      this.okString = value;
    });
    this.translateService.get('CANCEL').subscribe((value) => {
      this.cancelString = value;
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  googleLogin(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();

    this.googlePlus.login({
      'webClientId': '146850990651-ajtkgjg69p7ge1uv7hqqkqblko6s2sr5.apps.googleusercontent.com',
      'offline': true
    }).then((res) => {
      const firecreds = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        this.fireauth.signInWithCredential(firecreds).then((res) => {
          firebase.database().ref('/users').child(res.uid).set({ user: res.email, name: res.displayName, user_api: "2ARAL1XBQHRP02JC", channel_id: "" });  
          this.loading.dismiss();                  
          this.navCtrl.setRoot(InicioPage);
        }).catch((error) => {
          console.log('Firebase auth failed ', error);
          this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: JSON.stringify(error),
              buttons: [
                {
                  text: this.okString,
                  role: this.cancelString
                }
              ]
            });
            alert.present();
          });
        })      
    }).catch((error) => {
        console.log("Error", error);
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: JSON.stringify(error),
            buttons: [
              {
                text: this.okString,
                role: this.cancelString
              }
            ]
          });
          alert.present();
        });
    });
  }

  facebookLogin(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();
    
    this.facebook.login(['email']).then( (response) => {
        const facebookCredential = firebase.auth.FacebookAuthProvider
            .credential(response.authResponse.accessToken);

        firebase.auth().signInWithCredential(facebookCredential)
        .then((success) => {
            console.log("Firebase success: " + JSON.stringify(success));
            this.userProfile = success;
            firebase.database().ref('/users').child(success.uid).set({ user: success.email, name: success.displayName, user_api: "2ARAL1XBQHRP02JC", channel_id: "" });  
            this.loading.dismiss();                    
            this.navCtrl.setRoot(InicioPage);            
        })
        .catch((error) => {
            console.log("Firebase failure: " + JSON.stringify(error));
            this.loading.dismiss().then( () => {
              let alert = this.alertCtrl.create({
                message: JSON.stringify(error.message),
                buttons: [
                  {
                    text: this.okString,
                    role: this.cancelString
                  }
                ]
              });
              alert.present();
            });
        });
      }).catch((error) => { 
        console.log(error);
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: JSON.stringify(error.message),
            buttons: [
              {
                text: this.okString,
                role: this.cancelString
              }
            ]
          });
          alert.present();
        });
      });
  }

  twitterLogin(){
    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
    });
    this.loading.present();  

    this.twitter.login().then( response => {
      const twitterCredential = firebase.auth.TwitterAuthProvider
        .credential(response.token, response.secret);
  
      firebase.auth().signInWithCredential(twitterCredential)
      .then( userProfile => {
        this.userProfile = userProfile;
        this.userProfile.twName = response.userName;
        firebase.database().ref('/users').child(userProfile.uid).set({ user: response.userName, name: userProfile.displayName, user_api: "2ARAL1XBQHRP02JC", channel_id: "" });
        console.log("Firebase success: " + JSON.stringify(response));     
        this.loading.dismiss();        
        this.navCtrl.setRoot(InicioPage);                    
      }, error => {
        console.log("Firebase failure: " + JSON.stringify(error));
        this.loading.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: JSON.stringify(error.message),
            buttons: [
              {
                text: this.okString,
                role: this.cancelString
              }
            ]
          });
          alert.present();
        });
      });
    }, error => {
      console.log("Error connecting to twitter: ", error);
      this.loading.dismiss().then( () => {
        let alert = this.alertCtrl.create({
          message: JSON.stringify(error.message),
          buttons: [
            {
              text: this.okString,
              role: this.cancelString
            }
          ]
        });
        alert.present();
      });
    });
  }
 
}
