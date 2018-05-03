import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { GraphicsPage } from './graphics';

@NgModule({
  declarations: [
    GraphicsPage,
  ],
  imports: [
    IonicPageModule.forChild(GraphicsPage),
    TranslateModule.forChild()            
  ],
})
export class GraphicsPageModule {}
