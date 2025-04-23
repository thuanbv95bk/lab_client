import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './lab-component/dash-board/share-component/vehicle-list/vehicle-list.component';
import { DashBoardComponent } from './lab-component/dash-board/dash-board.component';
import { LoginComponent } from './lab-component/login/login.component';
import { UserVehicleGroupComponent } from './lab-component/user-vehicle-group/user-vehicle-group.component';
import { LayoutComponent } from './layout/layout.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dash-board', component: DashBoardComponent, canActivate: [AuthGuard] },
      { path: 'user-vehicle-group', component: UserVehicleGroupComponent, canActivate: [AuthGuard] },
    ],
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
