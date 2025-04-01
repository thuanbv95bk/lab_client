import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './common/vehicle-list/vehicle-list.component';
import { DashBoardGridComponent } from './dash-board-grid/dash-board-grid.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash-board-grid',
    pathMatch: 'full',
  },
  { path: 'dash-board-grid', component: DashBoardGridComponent },
  { path: 'vehicle-list', component: VehicleListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
