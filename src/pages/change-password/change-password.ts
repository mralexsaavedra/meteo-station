import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Md5 } from 'ts-md5/dist/md5';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  changePasswordForm: FormGroup;  
  user = firebase.auth().currentUser; 
  passwordsNotMatchString: string; 
  passwordSavedString: string;  

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    public toastCtrl: ToastController, public translateService: TranslateService) {
    this.changePasswordForm = formBuilder.group({        
      //current_password: ['', Validators.compose([Validators.required])],
      new_password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      repeat_password: ['', Validators.compose([Validators.required])]      
    });    
    this.translateService.get('PASSWORDS_NOT_MATCH').subscribe((value) => {
      this.passwordsNotMatchString = value;
    });
    this.translateService.get('PASSWORD_SAVED').subscribe((value) => {
      this.passwordSavedString = value;
    });  
  }

  ionViewDidLoad() {
  }

  done(){
    let success = true;
    let message;
    if (!this.changePasswordForm.valid){
      //Invalid form
    } else {
      let newPassword =  this.changePasswordForm.value.new_password;
      if (newPassword != ""){
        let repeatPassword =  this.changePasswordForm.value.repeat_password;        
        if (newPassword === repeatPassword){
          this.user.updatePassword( Md5.hashStr(newPassword).toString()).then(function() {
            // Update successful.
          }).catch(function(error) {
            success = false;   
            message = error.message;                              
            console.log(error);        
          });  
        } else{
          success = false;
          message = this.passwordsNotMatchString;                          
        }
      }
      if (success){
        message = this.passwordSavedString;
        this.navCtrl.pop();              
      }
      this.showToast(message);
    }
  }

  showToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.present(toast);
  }

  dismiss() {
    this.navCtrl.pop();
  }

}
