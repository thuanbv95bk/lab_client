import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashBoardComponent } from './lab-component/dash-board/dash-board.component';
import { LoginComponent } from './lab-component/login/login.component';
import { UserVehicleGroupComponent } from './lab-component/user-vehicle-group/user-vehicle-group.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth/auth.guard';
import { DrivingInfoComponent } from './lab-component/driving-info/driving-info.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dash-board', component: DashBoardComponent, canActivate: [AuthGuard] },
      { path: 'user-vehicle-group', component: UserVehicleGroupComponent, canActivate: [AuthGuard] },
      { path: 'driving-info', component: DrivingInfoComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
