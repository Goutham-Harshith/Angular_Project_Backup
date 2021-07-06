import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'
import { HeaderService } from './header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string;
  reportDetails = [];

  constructor(private cookie: CookieService, private router: Router, private headerService: HeaderService) {
    this.userName = this.cookie.get("username");
    this.headerService.getPageReportsDetails().subscribe((res) => {
      let response = res['response'];
      var arrMap = {};
      for (var i = 0; i < response.length; i++) {
        if (!arrMap[response[i].category]) {
          arrMap[response[i].category] = {
            'category': response[i].category,
            'subCategory': [{
              'name': response[i].subCategory,
              'pages': response[i].pages
            }]
          }
        } else {
          arrMap[response[i].category].subCategory.push({
            'name': response[i].subCategory,
            'pages': response[i].pages
          });
        }
      }
      for(var key in arrMap){
        this.reportDetails.push(arrMap[key]);
      }
    })
  }

  ngOnInit() {
  }

  logout() {
    let authToken = this.cookie.get("authToken");
    this.headerService.deleteToken(authToken).subscribe((res) => {
    })
    this.cookie.deleteAll('/wdasv2');
    this.router.navigate(['/login'])
  }

}

export interface reportDetails {
  category: string;
  subCategory: [];
}
