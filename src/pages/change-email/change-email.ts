import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email';
import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-change-email',
  templateUrl: 'change-email.html',
})
export class ChangeEmailPage {

  changeEmailForm: FormGroup; 
  user = firebase.auth().currentUser; 
  api_key: any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder, 
    public viewCtrl: ViewController) {
    this.changeEmailForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
    });
    this.changeEmailForm.patchValue({ 'email': this.user.email });            
  }

  ionViewDidLoad() {
  }

  done(){
    let that = this;
    if (!this.changeEmailForm.valid){
      //Invalid form
    } else {
      this.user.updateEmail(this.changeEmailForm.value.email).then(function() {
        this.afDB.object('users/'+this.user.uid).valueChanges().subscribe( user => {
          this.api_key = user.api;
        });
        firebase.database().ref('/users').child(this.user.uid).set({ user: this.changeEmailForm.value.email, name: this.user.displayName, api: this.api_key });         
        that.dismiss();
      }).catch(function(error) {
        console.log(error.message);
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
