import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { OtherLoginPage } from './other-login';

@NgModule({
  declarations: [
    OtherLoginPage,
  ],
  imports: [
    IonicPageModule.forChild(OtherLoginPage),
    TranslateModule.forChild()            
  ],
})
export class OtherLoginPageModule {}
