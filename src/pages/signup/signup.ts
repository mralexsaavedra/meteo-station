import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController,
  Navbar, Config } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthProvider } from '../../providers/auth/auth';
import { TranslateService } from '@ngx-translate/core';
import { EmailValidator } from '../../validators/email';
import { InicioPage } from '../inicio/inicio';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  @ViewChild(Navbar) navBar: Navbar;    

  signupForm: FormGroup;
  loading: Loading;  
  okString: string;
  cancelString: string; 
  userExistString: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    public alertCtrl: AlertController, public firebase: AngularFireDatabase, public translateService: TranslateService,
    public loadingCtrl: LoadingController, public authData: AuthProvider, public config: Config) {
      this.signupForm = formBuilder.group({
        name: ['', Validators.required],        
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });  
      this.translateService.get('OK').subscribe((value) => {
        this.okString = value;
      });
      this.translateService.get('CANCEL').subscribe((value) => {
        this.cancelString = value;
      });
      this.translateService.get('USER_EXIST').subscribe((value) => {
        this.userExistString = value;
      });
      this.translateService.get(['BACK_BUTTON_TEXT']).subscribe(values => {
        this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
      });
  }

  ionViewDidLoad() {
    this.navBar.backButtonClick = (e:UIEvent)=>{
      this.navCtrl.setRoot(HomePage);
    }
  }

  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password, this.signupForm.value.name)
      .then(() => {
        this.navCtrl.setRoot(InicioPage);
      }, (error) => {
        var errorMessage;      
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = this.userExistString;
            break;        
          default:
            console.log(error.code); 
            errorMessage = error.message;         
            break;
        }
        this.loading.dismiss().then( () => {
            let alert = this.alertCtrl.create({
              message: errorMessage,
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

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      this.loading.present();
    }
  }

  goSignIn(){
    this.navCtrl.push(LoginPage);
  }
  
}