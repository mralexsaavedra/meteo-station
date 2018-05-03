import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GeolocalizacionPage } from './geolocalizacion';

@NgModule({
  declarations: [
    GeolocalizacionPage,
  ],
  imports: [
    IonicPageModule.forChild(GeolocalizacionPage),
    TranslateModule.forChild()            
  ],
})
export class GeolocalizacionPageModule {}
