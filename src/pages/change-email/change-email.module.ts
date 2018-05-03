import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ChangeEmailPage } from './change-email';

@NgModule({
  declarations: [
    ChangeEmailPage,
  ],
  imports: [
    IonicPageModule.forChild(ChangeEmailPage),
    TranslateModule.forChild()            
  ],
})
export class ChangeEmailPageModule {}
