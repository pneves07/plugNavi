import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular'; // Se estiver usando o NavController


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home'},
    { title: 'Conta', url: '/profile', icon: 'person'},
    /*{ title: 'Inbox', url: '/folder/inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/spam', icon: 'warning' },
    */
  ];



  constructor(private router: Router, private navCtrl: NavController) {}


  goToLogin(){
    this.router.navigate(['/login']);
  }

}
