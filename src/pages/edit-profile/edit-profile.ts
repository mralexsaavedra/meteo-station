import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Navbar, AlertController, 
  ModalController, ToastController, ActionSheetController,
  LoadingController, Loading } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Http } from '@angular/http';
import { TranslateService } from '@ngx-translate/core';
import { Camera } from '@ionic-native/camera';
import { HomePage } from '../home/home';
import { ChangeEmailPage } from '../change-email/change-email';
import firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  @ViewChild('fileInput') fileInput;  
  @ViewChild(Navbar) navBar: Navbar;      
  
  editProfileForm: FormGroup; 
  user = firebase.auth().currentUser;
  dataSavedString: string;
  userDeletedString: string;
  deleteAccountString: string;
  questionDeleteAccountString: string;
  agreeString: string;
  cancelString: string;
  changeAPIString: string;
  messageAPIString: string;  
  placeholderAPIString: string; 
  saveString: string;
  isReadyToSave: boolean;  
  user_api_key: string;
  channel_id: string;
  channel_name: string;
  channelString: string;
  loading: Loading;

  constructor(public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder,
    public camera: Camera, public toastCtrl: ToastController, public translateService: TranslateService,
    public alertCtrl: AlertController, public modalCtrl: ModalController, public afDB: AngularFireDatabase, 
    public actionSheetCtrl: ActionSheetController, public http: Http, public loadingCtrl: LoadingController) {
    this.editProfileForm = formBuilder.group({  
      profilePic: [''],      
      name: [''], 
      email: ['']      
    });  
    this.translateService.get('DATA_SAVED').subscribe((value) => {
      this.dataSavedString = value;
    });    
    this.translateService.get('USER_DELETED').subscribe((value) => {
      this.userDeletedString = value;
    });
    this.translateService.get('DELETE_ACCOUNT').subscribe((value) => {
      this.deleteAccountString = value;
    });
    this.translateService.get('QUESTION_DELETE_ALERT').subscribe((value) => {
      this.questionDeleteAccountString = value;
    });
    this.translateService.get('AGREE').subscribe((value) => {
      this.agreeString = value;
    });
    this.translateService.get('CANCEL').subscribe((value) => {
      this.cancelString = value;
    });
    this.translateService.get('USER_API_KEY_THINGSPEAK').subscribe((value) => {
      this.changeAPIString = value;
    });
    this.translateService.get('THINGSPEAK_MESSAGE').subscribe((value) => {
      this.messageAPIString = value;
    });
    this.translateService.get('THINGSPEAK_PLACEHOLDER').subscribe((value) => {
      this.placeholderAPIString = value;
    });
    this.translateService.get('CHANNEL_MESSAGE').subscribe((value) => {
      this.channelString = value;
    });
    this.translateService.get('SAVE').subscribe((value) => {
      this.saveString = value;
    });
    this.editProfileForm.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.editProfileForm.valid;
    });
    this.editProfileForm.patchValue({ 'name': this.user.displayName });
    //this.editProfileForm.patchValue({ 'email': this.user.email });
    if (this.user.photoURL){
      this.editProfileForm.patchValue({ 'profilePic': this.user.photoURL });      
    }
    this.afDB.object('users/'+this.user.uid).valueChanges().subscribe( user => {
      if (user){
        this.user_api_key = user['user_api'];
        this.channel_name = user['channel_name'];
        this.channel_id = user['channel_id'];
        if (!user['user_api'])
          this.user_api_key = this.messageAPIString;
        if (!user['channel_id'])
          this.channel_name = this.channelString;
      }
    });
  }

  ionViewDidLoad() {
  }

  updateEmail(){
    let modal = this.modalCtrl.create(ChangeEmailPage);
    modal.present();
  }

  done(){
    let success = true;
    let message;
    var that = this;
    if (!this.editProfileForm.valid){
      //Invalid form
    } else {
      that.loading = that.loadingCtrl.create({
        dismissOnPageChange: true,
      });
      that.loading.present();
      this.user.updateProfile({
        displayName: this.editProfileForm.value.name,
        photoURL: this.editProfileForm.controls['profilePic'].value
      }).then(function() {        
        that.updateAPI();
        that.navCtrl.pop();
      }).catch(function(error) {
        success = false;  
        message = error.message;                  
        console.log(error);        
      });
      that.loading.dismiss();        
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

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.editProfileForm.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });    
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      let imageData = (readerEvent.target as any).result;
      this.editProfileForm.patchValue({ 'profilePic': imageData });      
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.editProfileForm.controls['profilePic'].value + ')'
  }

  deleteAccount(){
    let that = this;
    this.user.delete().then(function() {
      firebase.database().ref('users/' + that.user.uid).remove();
      //that.showToast(that.userDeletedString);            
      that.navCtrl.setRoot(HomePage); 
    }).catch(function(error) {
      console.log(error);
    });
  }

  showConfirmDelete() {
    let confirm = this.alertCtrl.create({
      title: this.deleteAccountString,
      message: this.questionDeleteAccountString,
      buttons: [
        {
          text: this.cancelString,
          handler: () => {
            //Disagree clicked
          }
        },
        {
          text: this.agreeString,
          handler: () => {
            this.deleteAccount();
          }
        }
      ]
    });
    confirm.present();
  }

  showPromptUserAPI() {
    let prompt = this.alertCtrl.create({
      title: this.changeAPIString,
      message: this.messageAPIString,
      inputs: [
        {
          name: 'user_api',
          placeholder: this.placeholderAPIString
        },
      ],
      buttons: [
        {
          text: this.cancelString,
          handler: data => {
            
          }
        },
        {
          text: this.saveString,
          handler: data => {
            if (!data.user_api || data.user_api == ""){
              this.user_api_key = this.messageAPIString;
              this.channel_name = this.channelString;
              this.channel_id = null;
            } else {
              this.user_api_key = data.user_api;               
            }
          }
        }
      ]
    });
    prompt.present();
  }

  presentActionSheet() {
    if (this.user_api_key && this.user_api_key != "" && this.user_api_key != this.messageAPIString){
      var channels = [];
      this.http.get('https://api.thingspeak.com/channels.json?api_key='+this.user_api_key)
      .map( data => data.json() )
      .subscribe( parsed_data => {
        parsed_data.forEach(element => {
          for (let index = 0; index < element['tags'].length; index++) {
            if (element['tags'][index]['name'] == "SAGA"){
              channels.push({
                text: element['name'],
                handler: () => {
                  this.channel_name = element['name'];
                  this.channel_id = element['id'];
                }
              });
            }
          }
        });
        channels.push({
          text: this.cancelString,
          role: 'cancel',
          handler: () => {
            //Cancel
          }
        });
        let actionSheet = this.actionSheetCtrl.create({
          title: this.channelString,
          buttons: channels
        });
        actionSheet.present();
      })
    }
  }

  updateAPI(){
    firebase.database().ref('/users').child(this.user.uid).set({ user: this.user.email, name: this.user.displayName, 
      user_api: this.user_api_key, channel_id: this.channel_id, channel_name: this.channel_name }); 
  }
}