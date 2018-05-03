import { Component, ViewChild } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ToastController, ModalController,
  AlertController, LoadingController, Loading, Navbar, Config } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { SignupPage } from '../signup/signup';
import { InicioPage } from '../inicio/inicio';
import { HomePage } from '../home/home';
import { ResetPasswordPage } from '../reset-password/reset-password';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  @ViewChild(Navbar) navBar: Navbar;  

  loginForm: FormGroup; 
  loading: Loading;  
  isActive: boolean = true; 
  eyeOn: boolean = true;
  eyeOff: boolean = false;
  passwordErrorString: string;
  emailString: string;
  passString: string; 
  userNotExistString: string;
  okString: string;
  cancelString: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    public toastCtrl: ToastController, public alertCtrl: AlertController, public config: Config,
    public translateService: TranslateService, public authData: AuthProvider, public loadingCtrl: LoadingController,
    public modalCtrl: ModalController) {
      this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });      
      this.translateService.get('EMAIL').subscribe((value) => {
        this.emailString = value;
      });
      this.translateService.get('PASSWORD').subscribe((value) => {
        this.passString = value;
      });
      this.translateService.get('USER_NOT_EXIST').subscribe((value) => {
        this.userNotExistString = value;
      });
      this.translateService.get('ERROR_PASSWORD').subscribe((value) => {
        this.passwordErrorString = value;
      });
      this.translateService.get('OK').subscribe((value) => {
        this.okString = value;
      });
      this.translateService.get('CANCEL').subscribe((value) => {
        this.cancelString = value;
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

  loginUser(){
    if (!this.loginForm.valid){
      console.log(this.loginForm.value);
    } else {
      this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then( authData => {
        this.navCtrl.setRoot(InicioPage);
      }, error => {
        var errorMessage;
        switch (error.code) {
          case 'auth/user-not-found':
            errorMessage = this.userNotExistString;
            break;
          case 'auth/wrong-password':        
            errorMessage = this.passwordErrorString;
            break;
          default:
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

  createAccount(){
    this.navCtrl.push(SignupPage);
  }

  goToResetPassword(){
    let modal = this.modalCtrl.create(ResetPasswordPage);
    modal.present();
  }

  showPassword(){
    if (this.loginForm.value.password){
      if (this.isActive){
        this.isActive = false;
        this.eyeOff = true;
        this.eyeOn = false;        
      } else{
        this.isActive = true;
        this.eyeOff = false;
        this.eyeOn = true;                
      }
    }
  }

  showEyeOff(){
    if (!this.loginForm.value.password || this.loginForm.value.password.length === 0){
      this.eyeOff = false;
      this.eyeOn = true;
      this.isActive = true;
    } 
    return this.eyeOff;
  }

}