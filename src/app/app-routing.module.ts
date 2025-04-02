import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehicleListComponent } from './common/vehicle-list/vehicle-list.component';
import { DashBoardGridComponent } from './dash-board-grid/dash-board-grid.component';
import { DashBoardComponent } from './dash-board/dash-board.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dash-board',
    pathMatch: 'full',
  },
  { path: 'dash-board-grid', component: DashBoardGridComponent },
  { path: 'dash-board', component: DashBoardComponent },
  { path: 'vehicle-list', component: VehicleListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
