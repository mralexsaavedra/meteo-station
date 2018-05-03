import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ViewController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-reset-password',
  templateUrl: 'reset-password.html',
})

export class ResetPasswordPage {

  resetPasswordForm: FormGroup;  
  okString: string;
  cancelString: string;
  resetPasswordString: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthProvider, 
    public formBuilder: FormBuilder, public alertCtrl: AlertController, public translateService: TranslateService,
    public viewCtrl: ViewController) {
      this.resetPasswordForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      });
      this.translateService.get('OK').subscribe((value) => {
        this.okString = value;
      });
      this.translateService.get('CANCEL').subscribe((value) => {
        this.cancelString = value;
      });
      this.translateService.get('RESET_PASSWORD_STRING').subscribe((value) => {
        this.resetPasswordString = value;
      });
  }

  resetPassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authData.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
        let alert = this.alertCtrl.create({
          message: this.resetPasswordString,
          buttons: [
            {
              text: this.okString,
              role: this.cancelString,
              handler: () => {
                this.navCtrl.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: this.okString,
              role: this.cancelString
            }
          ]
        });
        errorAlert.present();
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
