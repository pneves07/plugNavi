import { Component, OnInit,  ViewChild } from '@angular/core';
import { IonModal } from '@ionic/angular';


declare var mapboxgl: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild("stepsModal") stepsModal: IonModal; //Steps modal
  openModal: boolean = false; //Steps modal visible status
  start = []; // Starting position
  end = []; // Ending position
  map: any; // Map reference
  mode: string = "driving"; // Mode ie., driving || cycling || walking
  route: number = 1; // Current route
  routeLoaded: boolean = false; // Route loaded status
  distance: string = ""; // Distance between routes
  duration: string = ""; // Travel duration
  steps: Array<any> = []; // Instruction steps
  routeData: any; // Loaded route data

  constructor() { }

  ngOnInit() {

  }

  ionViewDidEnter() {
    this.loadMap();
  }

  loadMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXBwbGRzMjAyMyIsImEiOiJjbG54ZHN0eGUwZXhqMnJsZWQwdjQ2eGo3In0.sjYUyiQqmHivuVPw14GH5g';
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.10153989181986844, 51.497635790108916], // starting position
      zoom: 14
    });
    // // set the bounds of the map
    // const bounds = [
    //   [-123.069003, 45.395273],
    //   [-122.303707, 45.612333]
    // ];
    // map.setMaxBounds(bounds);

    // an arbitrary start will always be the same
    // only the end or destination will change
    this.start = [-0.10153989181986844, 51.497635790108916];

    // this is where the code for the next step will go

    this.map.on('load', () => {
      // make an initial directions request that
      // starts and ends at the same location
    //  this.getRoute(this.start);

      // Add starting point to the map
      this.map.addLayer({
        id: 'point',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [
              {
                type: 'Feature',
                properties: {},
                geometry: {
                  type: 'Point',
                  coordinates: this.start
                }
              }
            ]
          }
        },
        paint: {
          'circle-radius': 5,
          'circle-color': '#3880ff',
          'circle-stroke-color': 'white',
          'circle-stroke-width': 2,

        }
      });
      // this is where the code from the next step will go
    });

    this.map.on('click', (event) => {
      this.route = 1;
      const coords = Object.keys(event.lngLat).map((key) => event.lngLat[key]);
      this.end = coords;
      const end = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: coords
            }
          }
        ]
      };
      if (this.map.getLayer('end')) {
        this.map.getSource('end').setData(end);
      } else {
        this.map.addLayer({
          id: 'end',
          type: 'circle',
          source: {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  properties: {},
                  geometry: {
                    type: 'Point',
                    coordinates: coords
                  }
                }
              ]
            }
          },
          paint: {
            'circle-radius': 5,
            'circle-color': '#3880ff',
            'circle-stroke-color': 'white',
            'circle-stroke-width': 2,

          }
        });
      }
      this.getRoute(coords);
    });
  }

  async getRoute(end) {
    // make a directions request using cycling profile
    // an arbitrary start will always be the same
    // only the end or destination will change
    mapboxgl.accessToken = 'pk.eyJ1IjoiYXBwbGRzMjAyMyIsImEiOiJjbG54ZHN0eGUwZXhqMnJsZWQwdjQ2eGo3In0.sjYUyiQqmHivuVPw14GH5g';

    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/${this.mode}/${this.start[0]},${this.start[1]};${end[0]},${end[1]}?steps=true&alternatives=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    this.routeData = await query.json();
    this.drawRoute();
  }

  drawRoute() {
    let r = this.route == 1 ? this.routeData.routes[0].geometry.coordinates : this.routeData.routes[1].geometry.coordinates;

    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: r
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (this.map.getSource('route')) {
      this.map.getSource('route').setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      this.map.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3880ff',
          'line-width': 3,
          'line-opacity': 0.75
        }
      });
    }

    if (this.route == 1) {
      this.steps = this.routeData.routes[0].legs[0].steps;
      this.duration = this.secondsToHms(this.routeData.routes[0].duration);
      this.distance = this.formatDistance(this.routeData.routes[0].distance);
    }
    else {
      this.steps = this.routeData.routes[1].legs[0].steps;
      this.duration = this.secondsToHms(this.routeData.routes[1].duration);
      this.distance = this.formatDistance(this.routeData.routes[1].distance);
    }

    this.routeLoaded = true;
  }

  secondsToHms(d) {
    d = Number(d);
    var h = Math.floor(d / 3600);
    var m = Math.floor(d % 3600 / 60);
    var s = Math.floor(d % 3600 % 60);

    var hDisplay = h > 0 ? h + (" h, ") : "";
    var mDisplay = m > 0 ? m + (" m, ") : "";
    var sDisplay = s > 0 ? s + (" s") : "";
    return hDisplay + mDisplay + sDisplay;
  }

  formatDistance(distance) {
    return (distance / 1000).toFixed(2) + " km";
  }

  changeMode(m) {
    this.route = 1;
    this.mode = m;

    this.getRoute(this.end);
  }

  changeRoute(r) {
    this.route = r;

    this.drawRoute();
  }

  openSteps() {
    this.openModal = true;

    this.stepsModal.onWillDismiss().then(() => {
      this.openModal = false;
    });
  }
}
