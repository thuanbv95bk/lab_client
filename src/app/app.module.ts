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
import { WidthWidgetComponent } from './common/width-widget/width-widget.component';
import { BarChartApexComponent } from './common/widget-item/bar-chart-apex/bar-chart-apex.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DoughnutPluginService } from './service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from './service/legend-alignment-plugin/legend-alignment-plugin.service';
import { ChartScrollService } from './service/chart-bar-scroll/chart-bar-scroll.service';

@NgModule({
  declarations: [
    AppComponent,
    MultiSelectComponent,
    SetWidthWidgetComponent,
    WidthWidgetComponent,
    BtnExtendComponent,
    VehicleWidgetComponent,
    DashboardDoughnutComponent,
    BarChartComponent,
    BarChartApexComponent,
    DashBoardComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgChartsModule,
    NgApexchartsModule,
  ],
  providers: [DoughnutPluginService, LegendService, ChartScrollService],
  bootstrap: [AppComponent],
})
export class AppModule {}
