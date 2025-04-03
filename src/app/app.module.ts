import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { MultiSelectComponent } from './common/multi-select/multi-select.component';
import { setHiddenExtendComponent } from './common/set-hidden-extend/set-hidden-extend.component';
import { WidthWidgetComponent } from './common/width-widget/width-widget.component';
import { DoughnutPluginService } from './service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from './service/legend-alignment-plugin/legend-alignment-plugin.service';
import { ChartScrollService } from './service/chart-bar-scroll/chart-bar-scroll.service';
import { VehicleListComponent } from './common/vehicle-list/vehicle-list.component';
import { VehicleDataService } from './service/vehicle-data/vehicle-data.service';
import { DashBoardComponent } from './dash-board/dash-board.component';

import { DashboardDoughnutComponent } from './common/chart-items/dashboard-doughnut/dashboard-doughnut.component';
import { BarChartComponent } from './common/chart-items/bar-chart/bar-chart.component';
import { VehicleWidgetComponent } from './common/chart-items/vehicle-widget/vehicle-widget.component';
import { WidgetItemComponent } from './common/widget-item/widget-item.component';
import { DynamicLoadWidgetComponent } from './common/chart-items/dynamic-load-widget/dynamic-load-widget.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiSelectComponent,
    WidthWidgetComponent,
    setHiddenExtendComponent,
    VehicleWidgetComponent,
    DashboardDoughnutComponent,
    BarChartComponent,
    VehicleListComponent,
    DynamicLoadWidgetComponent,
    DashBoardComponent,
    WidgetItemComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgChartsModule,
  ],
  providers: [
    DoughnutPluginService,
    LegendService,
    ChartScrollService,
    VehicleDataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
