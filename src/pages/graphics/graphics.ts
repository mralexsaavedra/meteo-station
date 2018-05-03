import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { Http } from '@angular/http';
import { AngularFireDatabase } from 'angularfire2/database';
import { Chart } from 'chart.js';
import firebase from 'firebase';
import moment from 'moment';
import heatindex from 'heat-index';
import dewpoint  from 'dewpoint';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-graphics',
  templateUrl: 'graphics.html',
})
export class GraphicsPage {

  @ViewChild('lineCanvasTemp') lineCanvasTemp;
  @ViewChild('lineCanvasHum') lineCanvasHum;
  @ViewChild('lineCanvasPress') lineCanvasPress;
  @ViewChild('lineCanvasHI') lineCanvasHI;
  @ViewChild('lineCanvasDP') lineCanvasDP;

  user = firebase.auth().currentUser; 
  lineChartTemp: any;
  lineChartHum: any;
  lineChartPress: any;
  lineChartHI: any;
  lineChartDP: any;
  data: any;
  ultimo: number = 0;
  ultimoAemet: number = 0;
  loading: Loading;
  channel_id: string;
  temperature: String;
  humidity: String;
  pressure: String;
  heatIndex: String;
  dewPoint: String;
  
    constructor(public navCtrl: NavController, public navParams: NavParams, public http: Http, public loadingCtrl: LoadingController, 
        public afDB: AngularFireDatabase, public translateService: TranslateService) {
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
        this.data = setInterval(() => {
            this.getDataAfter();
            this.getDataAfterAemet();
        }, 15000);
    }

    ionViewDidLoad() {
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
        });
        this.loading.present();
        this.drawLineChart();
        this.afDB.object('users/'+this.user.uid).valueChanges().subscribe( user => {
            if (user){
                if (user['channel_id']){
                    this.channel_id = user['channel_id'];
                    this.getData();
                    this.getDataAemet();
                }
            }
            this.loading.dismiss(); 
        });
    }

    getDataAfterAemet(){
        if (this.channel_id){
            this.http.get('https://api.thingspeak.com/channels/196281/feeds.json?results=10')
            .map( data => data.json() )
            .subscribe( parsed_data => {
                for (let index = 0; index < parsed_data['feeds'].length; index++) {
                    if (this.ultimoAemet < parsed_data['feeds'][index]['entry_id']){
                        this.addAemetElement(parsed_data['feeds'][index]);
                        this.ultimoAemet = parsed_data['feeds'][index]['entry_id'];                        
                    }
                }
            });
        }
    }

    getDataAemet(){    
        this.http.get('https://api.thingspeak.com/channels/196281/feeds.json?results=60')
        .map( data => data.json() )
        .subscribe( parsed_data => {
            for (let index = this.ultimoAemet; index < parsed_data['feeds'].length; index++) {
                this.addAemetElement(parsed_data['feeds'][index]);
                this.ultimoAemet = parsed_data['feeds'][index]['entry_id'];                 
            }
        });
    }

    addAemetElement(element){ 
        this.addData(this.lineChartTemp, 1, element.field1);
        this.addData(this.lineChartHum, 1, element.field2);
        this.addData(this.lineChartPress, 1, element.field3);
        let heat_index = heatindex.heatIndex({temperature: parseInt(element.field1), humidity: parseInt(element.field2)});
        this.addData(this.lineChartHI, 1, heat_index);
        var xdp = new dewpoint(40);
        var y = xdp.Calc(parseInt(element.field1), parseInt(element.field2));
        //var x = y.x;
        let dew_point = y.dp;
        this.addData(this.lineChartDP, 1, dew_point);
    }

    getDataAfter(){
        if (this.channel_id){
            this.http.get('https://api.thingspeak.com/channels/'+this.channel_id+'/feeds.json?results=10')
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
                for (let index = this.ultimo; index < parsed_data['feeds'].length; index++) {
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
        this.lineChartTemp.data.labels.push(date);
        this.lineChartHum.data.labels.push(date);
        this.lineChartPress.data.labels.push(date);
        this.lineChartHI.data.labels.push(date);
        this.lineChartDP.data.labels.push(date);
        this.addData(this.lineChartTemp, 0, element.field1);
        this.addData(this.lineChartHum, 0, element.field2);
        this.addData(this.lineChartPress, 0, element.field3);
        this.addData(this.lineChartHI, 0, element.field4);
        this.addData(this.lineChartDP, 0, element.field5);
    }

    drawLineChart(){
        this.loading = this.loadingCtrl.create({
            dismissOnPageChange: true,
        });
        this.loading.present();
        this.lineChartTemp = new Chart(this.lineCanvasTemp.nativeElement, {      
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: "My dataset",
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
                    label: "ThingSpeak",
                    yAxisID: 'A',
                    fill: false,
                    lineTension: 0.1,
                    backgroundColor: "rgba(25,26,31,0.4)",
                    borderColor: "rgba(25,26,31,1)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    pointBorderColor: "rgba(25,26,31,1)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(25,26,31,1)",
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
        this.lineChartHum = new Chart(this.lineCanvasHum.nativeElement, {      
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "My dataset",
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
                    },
                    {
                        label: "ThingSpeak",
                        yAxisID: 'B',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(25,26,31,0.4)",
                        borderColor: "rgba(25,26,31,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(25,26,31,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(25,26,31,1)",
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
                      id: 'B',
                      scaleLabel: { display: true, labelString: this.humidity+" (%)" },
                      type: 'linear',
                      position: 'left'
                    }]
                },
                tooltips: {
                  callbacks: {
                    label: function(tooltipItem, data) {
                      var dataset = data.datasets[tooltipItem.datasetIndex];
                      var currentValue = dataset.data[tooltipItem.index];
                      return currentValue + "%";
                    }
                  }
                } 
            }
        }); 
        this.lineChartPress = new Chart(this.lineCanvasPress.nativeElement, {      
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "My dataset",
                        yAxisID: 'C',
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
                    },
                    {
                        label: "ThingSpeak",
                        yAxisID: 'C',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(25,26,31,0.4)",
                        borderColor: "rgba(25,26,31,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(25,26,31,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(25,26,31,1)",
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
        this.lineChartHI = new Chart(this.lineCanvasHI.nativeElement, {      
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "My dataset",
                        yAxisID: 'D',
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
                        label: "ThingSpeak",
                        yAxisID: 'D',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(25,26,31,0.4)",
                        borderColor: "rgba(25,26,31,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(25,26,31,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(25,26,31,1)",
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
        this.lineChartDP = new Chart(this.lineCanvasDP.nativeElement, {      
            type: 'line',
            data: {
                labels: [],
                datasets: [
                    {
                        label: "My dataset",
                        yAxisID: 'E',
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
                    },
                    {
                        label: "ThingSpeak",
                        yAxisID: 'E',
                        fill: false,
                        lineTension: 0.1,
                        backgroundColor: "rgba(25,26,31,0.4)",
                        borderColor: "rgba(25,26,31,1)",
                        borderCapStyle: 'butt',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: "rgba(25,26,31,1)",
                        pointBackgroundColor: "#fff",
                        pointBorderWidth: 1,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgba(25,26,31,1)",
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
                      id: 'E',
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
    }

}
