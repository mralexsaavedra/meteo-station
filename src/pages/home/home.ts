import { Component } from '@angular/core';
import { NavController, AlertController, ModalController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { OtherLoginPage } from '../other-login/other-login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  testRadioOpen: boolean;
  
  constructor(public navCtrl: NavController, public translateService: TranslateService, public alertCtrl: AlertController,
    public modalCtrl: ModalController) {
  }

  goSignIn(){
    this.navCtrl.push(LoginPage);
  }

  goRegister(){
    this.navCtrl.push(SignupPage);
  }

  goToOtherLogin(){
    let modal = this.modalCtrl.create(OtherLoginPage);
    modal.present();
  }

  changeLanguage(){
    let alert = this.alertCtrl.create();
    this.translateService.get('SELECT_LANGUAGE').subscribe((value) => {
      alert.setTitle(value);
    });
    
    alert.addInput({
      type: 'radio',
      label: 'Español',
      value: 'es',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'English',
      value: 'en',
      checked: false
    });
    alert.addInput({
      type: 'radio',
      label: 'Euskera',
      value: 'eu',
      checked: false
    });

    var inputs = alert.getNavParams().get('inputs');
    if (this.translateService.currentLang === "es"){
      inputs[0].checked = true;      
    } else if (this.translateService.currentLang === "en"){
      inputs[1].checked = true;            
    } else {
      inputs[2].checked = true;
    }

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        this.testRadioOpen = false;        
        this.translateService.use(data);         
      }
    });

    alert.present().then(() => {
      this.testRadioOpen = true;
    });
  }

}
