import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashBoardComponent } from './dash-board/dash-board.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { MultiSelectComponent } from './common/multi-select/multi-select.component';
import { SetWidthWidgetComponent } from './common/set-width-widget/set-width-widget.component';
import { VehicleWidgetComponent } from './common/widget-item/vehicle-widget/vehicle-widget.component';
import { DashboardDoughnutComponent } from './common/widget-item/dashboard-doughnut/dashboard-doughnut.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiSelectComponent,
    SetWidthWidgetComponent,
    VehicleWidgetComponent,
    DashboardDoughnutComponent,
    DashBoardComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgChartsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
