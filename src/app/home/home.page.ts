import { Component, OnInit,  ViewChild, ElementRef  } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('map') mapContainer: ElementRef;

  private map: mapboxgl.Map
  originInput: string;
  destinationInput: string;

  constructor() {}

  ngOnInit() {
  }






}
