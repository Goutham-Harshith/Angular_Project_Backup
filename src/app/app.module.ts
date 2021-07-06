import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// import { FormsModule } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { DataStreamIngestionComponent } from './data-stream-ingestion/data-stream-ingestion.component';

import { LargeDataIngestionComponent } from './large-data-ingestion/large-data-ingestion.component';
import { LineageComponent } from './lineage/lineage.component';
import { RdbmsDataIngestionComponent } from './rdbms-data-ingestion/rdbms-data-ingestion.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { VisulisationComponent } from './visulisation/visulisation.component';
import { WranglingComponent } from './wrangling/wrangling.component';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';
import { ScriptWriterComponent } from './script-writer/script-writer.component';
import { PageLeftContComponent } from './page-left-cont/page-left-cont.component';
import { AuthService } from './auth.service';
import { AuthGuardGuard } from './auth.guard';
import { CookieService } from 'ngx-cookie-service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Interceptor } from './Interceptor';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';

import { TableSearchPipe } from './pipes/table-search.pipe';
import {FilterPipe} from './pipes/filter.pipe';
import { DatePipe } from '@angular/common';

import {NgxPaginationModule} from 'ngx-pagination';
import { AdminComponent } from './admin/admin.component';
import { UserSearchPipe } from './pipes/user-search.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { SuccessAndFailureComponent } from './success-and-failure/success-and-failure.component';
import { AdasComponent } from './adas/adas.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { AgmCoreModule } from '@agm/core';
import { PoReportsComponent } from './po-reports/po-reports.component';

import { NgxGraphModule } from '@swimlane/ngx-graph';
import { ShortNumberPipe } from './pipes/short-number.pipe';
import { ReportsFrameworkComponent } from './reports-framework/reports-framework.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


declare var require: any;

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    LoginComponent,
    HeaderComponent,
    DataIngestionComponent,
    DataStreamIngestionComponent,
    LargeDataIngestionComponent,
    LineageComponent,
    RdbmsDataIngestionComponent,
    SchedulerComponent,
    VisulisationComponent,
    WranglingComponent,
    ScriptWriterComponent,
    PageLeftContComponent,
    TableSearchPipe,
    FilterPipe,
    ShortNumberPipe,
    
    AdminComponent,
    UserSearchPipe,
    SuccessAndFailureComponent,
    AdasComponent,
    PoReportsComponent,
    ReportsFrameworkComponent,
   
  ],
  imports: [
    
    BrowserModule,
    NgxPaginationModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    HttpClientModule,
    CodemirrorModule,
    AngularMultiSelectModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(),
    GoogleChartsModule,
    NgxGraphModule,
    InfiniteScrollModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBWZbeq9nzy_pWFVzLxJKNv6Kk1cXz4jGo'
    }),
   
  ],
  providers: [ DatePipe,ShortNumberPipe, AuthService, AuthGuardGuard, AppComponent,CookieService,{ provide: HTTP_INTERCEPTORS, useClass: Interceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
