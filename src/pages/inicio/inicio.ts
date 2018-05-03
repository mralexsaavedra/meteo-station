import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Http } from '@angular/http';
import { Chart } from 'chart.js';
import { AngularFireDatabase } from 'angularfire2/database';
import firebase from 'firebase';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-inicio',
  templateUrl: 'inicio.html',
})
export class InicioPage {

  @ViewChild('lineCanvas') lineCanvas;
  @ViewChild('lineCanvas2') lineCanvas2;
  @ViewChild('pressureCanvas') pressureCanvas;
  
  user = firebase.auth().currentUser; 
  lineChart: any;
  lineChart2: any;
  pressureChart: any;
  temperature: String;
  humidity: String;
  pressure: String;
  heatIndex: String;
  dewPoint: String;
  ultimo: number = 0;
  data: any;
  loading: Loading;
  channel_id: string;
  channel_name: string;  
  primera_vez: boolean = true;  
  slides: any;  
  beta_title: string;
  beta_message: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public translateService: TranslateService, 
    public loadingCtrl: LoadingController, public afDB: AngularFireDatabase, public alertCtrl: AlertController) {
    this.translateService.get('TEMPERATURE').subscribe((value) => {
      this.temperature = value;
    });   
    this.translateService.get('HUMIDITY').subscribe((value) => {
      this.humidity = value;
    });   
    this.translateService.get('PRESSURE').subscribe((value) => {
      this.pressure = value;
    });   
    this.translateService.get('HEAT_INDEX').subscribe((value) => {
      this.heatIndex = value;
    });   
    this.translateService.get('DEW_POINT').subscribe((value) => {
      this.dewPoint = value;
    });  
    this.translateService.get('BETA_TITLE').subscribe((value) => {
      this.beta_title = value;
    });   
    this.translateService.get('BETA_MESSAGE').subscribe((value) => {
      this.beta_message = value;
    });  
    this.data = setInterval(() => {
      this.getDataAfter();
    }, 15000);
  }

  /*ionViewDidLoad() {
  }*/

  ionViewDidEnter(){
    if (this.primera_vez){
      this.primera_vez = false;
      this.drawLineChart();
      let alert = this.alertCtrl.create({
        title: this.beta_title,
        subTitle: this.beta_message,
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.loading = this.loadingCtrl.create({
                dismissOnPageChange: true
              });
              this.loading.present();
              if (this.user.uid){
                this.afDB.object('users/'+this.user.uid).valueChanges().subscribe( user => {
                  if (user){
                    if (user['channel_id']){
                      this.channel_id = user['channel_id'];
                      this.channel_name = user['channel_name'];    
                      if (this.channel_id){
                        this.getData();
                      }
                    }
                  }
                });
              }
              this.loading.dismiss(); 
            }
          }
        ]
      });
      alert.present();
    } else {
      this.getDataAfter();
    }
  }

  getDataAfter(){
    if (this.channel_id){
      this.http.get('https://api.thingspeak.com/channels/'+this.channel_id+'/feeds.json?results=30')
      .map( data => data.json() )
      .subscribe( parsed_data => {
          for (let index = 0; index < parsed_data['feeds'].length; index++) {
            if (this.ultimo < parsed_data['feeds'][index]['entry_id']){
              this.addNewElement(parsed_data['feeds'][index]);
              this.ultimo = parsed_data['feeds'][index]['entry_id']; 
            }
          }
      });
    }
  }

  getData(){
    if (this.channel_id){
      this.http.get('https://api.thingspeak.com/channels/'+this.channel_id+'/feeds.json?results=60')
      .map( data => data.json() )
      .subscribe( parsed_data => {
          for (let index = 0; index < parsed_data['feeds'].length; index++) {
            this.addNewElement(parsed_data['feeds'][index]);
            this.ultimo = parsed_data['feeds'][index]['entry_id']; 
          }
      });
    }
  }

  addData(chart, index, data) {
    chart.data.datasets[index].data.push(data);
    chart.update();
  }

  addNewElement(element){
    let date = moment(element.created_at).format('HH:mm');
    this.lineChart.data.labels.push(date);
    this.lineChart2.data.labels.push(date);
    this.pressureChart.data.labels.push(date);
    this.addData(this.lineChart, 0, element.field1);
    this.addData(this.lineChart, 1, element.field2);
    this.addData(this.lineChart2, 0, element.field4);
    this.addData(this.lineChart2, 1, element.field5);
    this.addData(this.pressureChart, 0, element.field3);
  }

  drawLineChart(){
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {      
      type: 'line',
      data: {
          labels: [],
          datasets: [
              {
                  label: this.temperature,
                  yAxisID: 'A',
                  fill: false,
                  lineTension: 0.1,
                  backgroundColor: "rgba(255,0,0,0.4)",
                  borderColor: "rgba(255,0,0,1)",
                  borderCapStyle: 'butt',
                  borderDash: [],
                  borderDashOffset: 0.0,
                  borderJoinStyle: 'miter',
                  pointBorderColor: "rgba(255,0,0,1)",
                  pointBackgroundColor: "#fff",
                  pointBorderWidth: 1,
                  pointHoverRadius: 5,
                  pointHoverBackgroundColor: "rgba(255,0,0,1)",
                  pointHoverBorderColor: "rgba(220,220,220,1)",
                  pointHoverBorderWidth: 2,
                  pointRadius: 1,
                  pointHitRadius: 10,
                  data: [],
                  spanGaps: false,
              },
              {
                label: this.humidity,
                yAxisID: 'B',
                fill: false,
                lineTension: 0.1,
                backgroundColor: "rgba(75,192,192,0.4)",
                borderColor: "rgba(75,192,192,1)",
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "rgba(75,192,192,1)",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: [],
                spanGaps: false,
              }
          ]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'A',
            scaleLabel: { display: true, labelString: this.temperature+" (ºC)" },
            type: 'linear',
            position: 'left'
          }, {
            id: 'B',
            scaleLabel: { display: true, labelString: this.humidity+" (%)" },
            type: 'linear',
            position: 'right'
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var currentValue = dataset.data[tooltipItem.index];
              if (tooltipItem.datasetIndex === 0){
                return currentValue + "ºC";
              } else {
                return currentValue + "%";
              }
            }
          }
        } 
      }
    });
    this.lineChart2 = new Chart(this.lineCanvas2.nativeElement, {      
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: this.heatIndex,
                    yAxisID: 'C',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(255, 111, 63, 0.4)",
                    borderColor: "rgba(255, 111, 63, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(255, 111, 63, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(255, 111, 63, 1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                    spanGaps: false,
                },
                {
                    label: this.dewPoint,
                    yAxisID: 'C',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(0, 191, 48, 0.4)",
                    borderColor: "rgba(0, 191, 48, 1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(0, 191, 48, 1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(0, 191, 48, 1)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: [],
                    spanGaps: false,
                }
            ]
        },
        options: {
          scales: {
            yAxes: [{
              id: 'C',
              scaleLabel: { display: true, labelString: this.temperature+" (ºC)" },
              type: 'linear',
              position: 'left'
            }]
          },
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                var dataset = data.datasets[tooltipItem.datasetIndex];
                var currentValue = dataset.data[tooltipItem.index];
                return currentValue + "ºC";
              }
            }
          } 
        }
    });  
    this.pressureChart = new Chart(this.pressureCanvas.nativeElement, {      
      type: 'line',
      data: {
          labels: [],
          datasets: [
            {
              label: this.pressure,
              yAxisID: 'D',
              fill: false,
              lineTension: 0.1,
              backgroundColor: "rgba(125, 127, 117, 0.4)",
              borderColor: "rgba(125, 127, 117, 1)",
              borderCapStyle: 'butt',
              borderDash: [],
              borderDashOffset: 0.0,
              borderJoinStyle: 'miter',
              pointBorderColor: "rgba(125, 127, 117, 1)",
              pointBackgroundColor: "#fff",
              pointBorderWidth: 1,
              pointHoverRadius: 5,
              pointHoverBackgroundColor: "rgba(125, 127, 117, 1)",
              pointHoverBorderColor: "rgba(220,220,220,1)",
              pointHoverBorderWidth: 2,
              pointRadius: 1,
              pointHitRadius: 10,
              data: [],
              spanGaps: false,
          }
          ]
      },
      options: {
        scales: {
          yAxes: [{
            id: 'D',
            scaleLabel: { display: true, labelString: this.pressure+" (mbar)" },
            type: 'linear',
            position: 'left'
          }]
        },
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              var dataset = data.datasets[tooltipItem.datasetIndex];
              var currentValue = dataset.data[tooltipItem.index];
              return currentValue + "mbar";
            }
          }
        } 
      }
  });         
  }

}