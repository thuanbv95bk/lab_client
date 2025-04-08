import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './common/shared-component/vehicle-list/vehicle-list.component';
import { DashBoardComponent } from './lab-component/dash-board/dash-board.component';
import { LoginComponent } from './lab-component/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: 'dash-board', component: DashBoardComponent },
  { path: 'vehicle-list', component: VehicleListComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
