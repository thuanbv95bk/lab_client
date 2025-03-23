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
import { BarChartComponent } from './common/widget-item/bar-chart/bar-chart.component';
import { BtnExtendComponent } from './common/btn-extend/btn-extend.component';
import { MultiSelectDropdownComponent } from './common/multi-select-dropdown/multi-select-dropdown.component';
import { MultiselectDropdownComponent } from './common/multiselect-dropdown/multiselect-dropdown.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiSelectComponent,
    MultiSelectDropdownComponent,
    MultiselectDropdownComponent,
    SetWidthWidgetComponent,
    BtnExtendComponent,
    VehicleWidgetComponent,
    DashboardDoughnutComponent,
    BarChartComponent,
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
