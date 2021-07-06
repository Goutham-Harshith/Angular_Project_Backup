import { Component } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'wdasv2';
  showHeader: boolean

  constructor(private router: Router)
  {
    this.router.events.subscribe((event)=>
    {
      if(event instanceof NavigationEnd )
      {
        if(event['urlAfterRedirects'].includes('/login'))
        {
          this.showHeader = false;
        }
        else
        {
          this.showHeader = true;
        }
      }
    })
  }
}
