import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    data:any[] = []
    /* localUrl = '/'; */
    localUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }
  getdataF0(){
    return this.http.get(''+this.localUrl+'apps/covid19/api/patientapi/list');
  }
  getdatasearch(data){
    return this.http.get(''+this.localUrl+'apps/covid19/api/patientapi/ListByDate?toDate='+data[1]+'&fromDate='+data[0]+'');
  }
 /*  getdataF1(){
    return this.http.get('apis/patientsf1');
  }
  getdataF2(){
    return this.http.get('apis/patientsf2');
  }
  getdata(){
    this.getdataF0();
    this.getdataF1();
    this.getdataF2();
    return this.data;
  } */
}
