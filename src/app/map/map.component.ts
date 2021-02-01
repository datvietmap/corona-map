import { Component, OnInit, AfterViewInit, Renderer } from '@angular/core';
import { AbstractControl, FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs/Rx";
import { DatePipe } from '@angular/common'
import sampleData from "../data/data.json";
import data_province from "../data/tinh.json";

import datafake from "../data/datafake.json";
import coronaviruss from "../data/coronaviruss.json";


import { StorageMap } from "@ngx-pwa/local-storage";
import { environment } from "../../environments/environment.prod";
import { MatChipsModule } from "@angular/material/chips";
import { ServiceService } from '../service.service';


declare let L;
declare let $;
declare let Highcharts;
import * as Leaflet from "leaflet";
import HeatmapOverlay from "leaflet-heatmap";
import { stringify } from "querystring";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}
interface TestLocation {
  lat: number;
  lng: number;
}


// VALIDATOR
export function forbiddenUsername(users = []) {
  return (c: AbstractControl) => {
    return (!users.includes(c.value)) ? {
      invalidusername: true
    } : null;
  };
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  providers: [DatePipe]
})
export class MapComponent implements AfterViewInit {
  isdisable: boolean;
  rfContact: FormGroup;
  constructor(private http: HttpClient, private service: ServiceService, public datepipe: DatePipe) { }
  ngOnInit() {

  }
  datachartfake: number[];
  listRecoverDataTake: number[];
  currentDate: number = Date.now();
  private map: any;
  /*  localUrl = "/app/api/democoronas/"; */
  localUrl = environment.apiUrl;
  Tilemap: any;
  datafake: any[] = datafake;
  LayerF0: any;
  LayerF1: any;
  LayerF2: any;
  Datacorona: any[] = [];
  markersclusterF0: any;
  markersclusterF1: any;
  markersclusterF2: any;
  overlayMaps: {} = {};
  dataF0: any[] = [];
  dataF1: any[] = [];
  dataF2: any[] = [];
  fromDate: string;
  toDate: string;
  ngAfterViewInit() {
    this.initMap();
    /* this.getdataF1().then();
    this.getdataF2().then();  */

  }
  public initMap(): void {
    var app: MapComponent = this;
    this.map = L.map("mapid").setView([17.290756, 106.756962], 6);
    this.Tilemap = L.tileLayer(
      'https://maps.vnpost.vn/api/tm/{z}/{x}/{y}@2x.png?apikey=f50f96fd875c023e6fd8acac6d9a7e0d15699071d3259542',
      {
        maxZoom: 22,
        minZoom: 2,
        maxNativeZoom: 18
      }
    ).addTo(this.map);

    this.LayerF0 = L.layerGroup();
    this.LayerF1 = L.layerGroup();
    this.LayerF2 = L.layerGroup();
    this.markersclusterF0 = new L.markerClusterGroup({
      disableClusteringAtZoom: 5,
      maxClusterRadius: 50
    });
    this.markersclusterF1 = new L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 0.001
    });
    this.markersclusterF2 = new L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: true,
      zoomToBoundsOnClick: false,
      maxClusterRadius: 0.001
    });
    this.overlayMaps = {};
    let pathFillColor = "";
    /*     if(this.dataF0.length === 0){
          this.getdata(1);
        } */
    this.service.getdataF0().subscribe((data: any) => {
      const res = data.data;
      let note = "";
      for (let item of res) {
        let notestep = item.note;

        if (notestep === null) {
          notestep = "";
        }

        /* const time = item.verifyDate.replace('T', ' '); */
        const time = this.datepipe.transform(item.verifyDate, 'dd-MM-yyyy');
        let div = '';
        div += '<div style="margin-bottom:5px"><strong> Tên: </strong>' + item.name + '</div>';
        div += '<div style="margin-bottom:5px"><strong> Địa chỉ:</strong> ' + item.address + '</div>';
        div += '<div style="margin-bottom:5px"><strong> Thời gian:</strong> ' + time + '</div>';
        if (item["patientGroup"] === "F0") {
          div += '<div> <strong>Ghi chú:</strong></div>';
          div += '<p style="margin-left:15px;margin-top: 0px">' + notestep + '</p>';
          pathFillColor = "red";
          const marker = L.marker([item["lat"], item["lng"]], {
            icon: L.divIcon({
              className: "ship-div-icon",
              html:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50px" height="50px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path transform="translate(0,-22)" style="fill:' +
                pathFillColor +
                '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
            })
          }).bindPopup(div);
          this.LayerF0.addLayer(marker);
        }
        if (item["patientGroup"] === "F1") {
          pathFillColor = "yellow";
          const marker = L.marker([item["lat"], item["lng"]], {
            icon: L.divIcon({
              className: "ship-div-icon",
              html:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40px" height="40px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path transform="translate(0,-22)" style="fill:' +
                pathFillColor +
                '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
            })
          }).bindPopup(div);
          this.LayerF1.addLayer(marker);
        }
        if (item["patientGroup"] === "F2") {
          pathFillColor = "blue";
          const marker = L.marker([item["lat"], item["lng"]], {
            icon: L.divIcon({
              className: "ship-div-icon",
              html:
                '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40px" height="40px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path style="fill:' +
                pathFillColor +
                '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
            })
          }).bindPopup(div);
          this.LayerF2.addLayer(marker);
        }
      }
      /* this.overlayMaps= {
        '<div class = "marker" style="background:orange"></div> Dương tính với SARS-coV-2 (F0)': this.markersclusterF0,
        '<div class = "marker" style="background:yellow"></div> Tiếp xúc với người xác định dương tính (F1)': this.markersclusterF1,
        '<div class = "marker" style="background:blue"></div> Người tiếp xúc với người tiếp xúc gần (F2 )': this.markersclusterF2
      }
      let baseMaps = {
        "Bản đồ nền": this.Tilemap
      }; */
      this.markersclusterF0.addLayer(this.LayerF0);
      this.markersclusterF1.addLayer(this.LayerF1);
      this.markersclusterF2.addLayer(this.LayerF2);
      this.map.addLayer(this.markersclusterF0);
      this.map.addLayer(this.markersclusterF1);
      this.map.addLayer(this.markersclusterF2);
      /* L.control.layers(baseMaps,this.overlayMaps,{position:'topleft',collapsed:true},).addTo(this.map); */
      /* this.http.get(this.localUrl).subscribe((data: any) => {
      }) */
      app.map.on('zoomend', function () {
        const zoom = app.map.getZoom();
        if (zoom > 15) {
          app.LayerF0['_icon'].style.height = "100px";
          app.LayerF0['_icon'].style.width = "100px";
        }
      });
    })
  }
  adddate1(event) {
    this.fromDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');

  }
  adddate2(event) {
    this.toDate = this.datepipe.transform(event.value, 'yyyy-MM-dd');
  }
  search() {
    const dataget = [this.fromDate, this.toDate];
    this.markersclusterF0.clearLayers();
    this.markersclusterF1.clearLayers();
    this.markersclusterF2.clearLayers();
    this.LayerF0.clearLayers();
    this.LayerF1.clearLayers();
    this.LayerF2.clearLayers();
    this.service.getdatasearch(dataget).subscribe((data: any) => {
      if (data.data.length !== 0) {
        let pathFillColor = "";
        let note = "";
        for (let item of data.data) {
          let notestep = item.note;
          debugger;
          if (notestep === null) {
            notestep = "";
          }

          const time = this.datepipe.transform(item.verifyDate, 'dd-MM-yyyy');
          let div = '';
          div += '<div style="margin-bottom:5px"><strong> Tên: </strong>' + item.name + '</div>';
          div += '<div style="margin-bottom:5px"><strong> Địa chỉ:</strong> ' + item.address + '</div>';
          div += '<div style="margin-bottom:5px"><strong> Thời gian:</strong> ' + time + '</div>';
          if (item["patientGroup"] === "F0") {
            div += '<div> <strong>Lộ trình di chuyển:</strong></div>';
            div += '<p style="margin-left:15px;margin-top: 0px">' + notestep + '</p>';
            pathFillColor = "red";
            const marker = L.marker([item["lat"], item["lng"]], {
              icon: L.divIcon({
                className: "ship-div-icon",
                html:
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="50px" height="50px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path style="fill:' +
                  pathFillColor +
                  '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
              })
            }).bindPopup(div);
            this.LayerF0.addLayer(marker);
          }
          if (item["patientGroup"] === "F1") {
            pathFillColor = "yellow";
            const marker = L.marker([item["lat"], item["lng"]], {
              icon: L.divIcon({
                className: "ship-div-icon",
                html:
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40px" height="40px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path style="fill:' +
                  pathFillColor +
                  '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
              })
            }).bindPopup(item["address"]);
            this.LayerF1.addLayer(marker);
          }
          if (item["patientGroup"] === "F2") {
            pathFillColor = "blue";
            const marker = L.marker([item["lat"], item["lng"]], {
              icon: L.divIcon({
                className: "ship-div-icon",
                html:
                  '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="40px" height="40px" id="Capa_1" x="0px" y="0px" viewBox="0 0 60 60" style="enable-background:new 0 0 60 60;" xml:space="preserve"><g><path style="fill:' +
                  pathFillColor +
                  '" d="M8,22c-4.411,0-8,3.589-8,8s3.589,8,8,8s8-3.589,8-8S12.411,22,8,22z"/></g><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/><g/></svg>'
              })
            }).bindPopup(div);
            this.LayerF2.addLayer(marker);
          }
        }
        this.markersclusterF0.addLayer(this.LayerF0);
        this.markersclusterF1.addLayer(this.LayerF1);
        this.markersclusterF2.addLayer(this.LayerF2);
      }
    });
  }
}
