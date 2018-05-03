import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import { Http } from '@angular/http';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  //CameraPosition,
  //MarkerOptions,
  //Marker,
  HtmlInfoWindow
} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-geolocalizacion',
  templateUrl: 'geolocalizacion.html',
})
export class GeolocalizacionPage {

  map: GoogleMap; 
  user = firebase.auth().currentUser; 
  channel_id: string;
  channel_name: string;  
  googleMapMarker: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public afDB: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    this.afDB.object('users/'+this.user.uid).valueChanges().subscribe( user => {
      if (user){
        if (user['channel_id']){
          this.channel_id = user['channel_id'];
          this.channel_name = user['channel_name'];
        }
      }
      this.loadMap(); 
    });
        
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: 43.262272,
          lng: -2.948305
        },
        zoom: 18,
        tilt: 30
      }
    };
  
    this.map = GoogleMaps.create('map_canvas', mapOptions);
  
    this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      if (this.channel_id){
        this.getPosition();
      }
    })
    .catch(error =>{
      console.log(error);
    });
  }

  getPosition(){
    this.http.get('https://api.thingspeak.com/channels/'+this.channel_id+'/feeds.json?results=1')
    .map( data => data.json() )
    .subscribe( parsed_data => {
      let element = parsed_data['feeds'][0];
      let latitud = element.field6;
      let longitud = element.field7;
      this.map.moveCamera({
        target:  {
          lat: latitud,
          lng: longitud
        }
      });
      let htmlInfoWindow = new HtmlInfoWindow();
      let frame: HTMLElement = document.createElement('div');
      frame.innerHTML = [
        '<p><b>Temp. </b>'+element.field1+'ºC \n <b>Hum. </b>'+element.field2+'% \n <b>Pres. </b>'+element.field3+'</p>'
      ].join("");
      htmlInfoWindow.setContent(frame, {width: "auto", height: "auto"});
      this.map
        .addMarker({
          //title: 'Temp. ' + element.field1 + 'ºC \n Hum. ' + element.field2 + '% \n Pres. ' + element.field3 + 'mbar',
          icon: 'red',
          animation: 'DROP',
          position:  {
            lat: latitud,
            lng: longitud
          }
        })
        .then(marker => {
          htmlInfoWindow.open(marker);
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            htmlInfoWindow.open(marker);
          });
        });
    });
  }

}
