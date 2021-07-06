import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { DataIngestionComponent } from './data-ingestion/data-ingestion.component';
import { DataStreamIngestionComponent } from './data-stream-ingestion/data-stream-ingestion.component';
import { LargeDataIngestionComponent } from './large-data-ingestion/large-data-ingestion.component';
import { LineageComponent } from './lineage/lineage.component';
import { RdbmsDataIngestionComponent } from './rdbms-data-ingestion/rdbms-data-ingestion.component';
import { SchedulerComponent } from './scheduler/scheduler.component';
import { VisulisationComponent } from './visulisation/visulisation.component';
import { WranglingComponent } from './wrangling/wrangling.component';
import { ScriptWriterComponent } from './script-writer/script-writer.component';
import { AuthGuardGuard } from './auth.guard';
import { AdminComponent } from './admin/admin.component';
import { AdasComponent } from './adas/adas.component';
import { PoReportsComponent } from './po-reports/po-reports.component';
import { ReportsFrameworkComponent } from './reports-framework/reports-framework.component';

const routes: Routes = [

  { path: 'dashboard', component: DashboardComponent, data: { title: 'Dashboard' }, canActivate: [AuthGuardGuard] },
  { path: 'login',      component: LoginComponent, data: { title: 'Login' } },
  { path:'data-ingestion', component: DataIngestionComponent, data: { title: 'Data Ingestion' }, canActivate: [AuthGuardGuard]},
  { path: 'data-stream-ingestion', component:DataStreamIngestionComponent, data: { title: 'Data Stream Ingestion' }, canActivate: [AuthGuardGuard]},
  { path:'large-data-ingestion',component: LargeDataIngestionComponent, data: { title: 'Large Data Ingestion' }, canActivate: [AuthGuardGuard] },
  {path:'lineage', component:LineageComponent, data: { title: 'Lineage' }, canActivate: [AuthGuardGuard]},
 
  { path:'rdbms-data-ingestion', component: RdbmsDataIngestionComponent, data: { title: 'RDBMS-Data Ingestion' }, canActivate: [AuthGuardGuard]},
  { path:'scheduler', component: SchedulerComponent, data: { title: 'Scheduler' }, canActivate: [AuthGuardGuard]},
  { path:'visualisation', component:VisulisationComponent, data: { title: 'Visualisation' }, canActivate: [AuthGuardGuard]},
  { path:'wrangling', component:WranglingComponent, data: { title: 'Wrangling' }, canActivate: [AuthGuardGuard]},
  { path:'script', component:ScriptWriterComponent, data: { title: 'Script' }, canActivate: [AuthGuardGuard]},
  { path: 'po-reports', component:PoReportsComponent, data: { title: 'POReports' }, canActivate: [AuthGuardGuard]},
  {path : 'admin',component:AdminComponent},
  {path: 'adas', component: AdasComponent},
  {path: 'reports-framework', component: ReportsFrameworkComponent},
  { path: '',redirectTo: '/login',pathMatch: 'full'},
  { path: '**',redirectTo: '/login',  pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
