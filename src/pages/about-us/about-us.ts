import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-about-us',
  templateUrl: 'about-us.html',
})
export class AboutUsPage {

  message1: any;
  message2: any;
  message3: any;
  message4: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public translateService: TranslateService) {
    this.translateService.get('MESSAGE_1').subscribe((value) => {
      this.message1 = value;
    });  
    this.translateService.get('MESSAGE_2').subscribe((value) => {
      this.message2 = value;
    }); 
    this.translateService.get('MESSAGE_3').subscribe((value) => {
      this.message3 = value;
    }); 
    this.translateService.get('MESSAGE_4').subscribe((value) => {
      this.message4 = value;
    }); 
  }

  /*ionViewDidLoad() {
  }*/

}
