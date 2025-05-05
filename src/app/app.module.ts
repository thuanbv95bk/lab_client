import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgChartsModule } from 'ng2-charts';
import { MultiSelectComponent } from './lab-component/dash-board/share-component/multi-select/multi-select.component';
import { setHiddenExtendComponent } from './lab-component/dash-board/share-component/set-hidden-extend/set-hidden-extend.component';
import { WidthWidgetComponent } from './lab-component/dash-board/share-component/width-widget/width-widget.component';
import { DoughnutPluginService } from './lab-component/dash-board/service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from './lab-component/dash-board/service/legend-alignment-plugin/legend-alignment-plugin.service';
import { ChartScrollService } from './lab-component/dash-board/service/chart-bar-scroll/chart-bar-scroll.service';
import { VehicleDataService } from './lab-component/dash-board/service/vehicle-data/vehicle-data.service';
import { DashboardDoughnutComponent } from './lab-component/dash-board/chart-item/dashboard-doughnut/dashboard-doughnut.component';
import { BarChartComponent } from './lab-component/dash-board/chart-item/bar-chart/bar-chart.component';
import { VehicleWidgetComponent } from './lab-component/dash-board/chart-item/vehicle-widget/vehicle-widget.component';
import { DynamicLoadWidgetComponent } from './lab-component/dash-board/chart-item/dynamic-load-widget/dynamic-load-widget.component';
import { VehicleListComponent } from './lab-component/dash-board/share-component/vehicle-list/vehicle-list.component';
import { DashBoardComponent } from './lab-component/dash-board/dash-board.component';
import { WidgetUpdateDataService } from './lab-component/dash-board/service/vehicle-data/widget-update-data.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { WidgetItemComponent } from './lab-component/dash-board/share-component/widget-item/widget-item.component';
import { LoginComponent } from './lab-component/login/login.component';
import { UserVehicleGroupComponent } from './lab-component/user-vehicle-group/user-vehicle-group.component';
import { AppConfig, InitApp } from './app.config';
import { SelectRowGroupsComponent } from './lab-component/user-vehicle-group/share-component/select-row-groups/select-row-groups.component';
import { FilterPipe } from './pipe/filter.pipe';
import { VehicleGroupComponent } from './lab-component/user-vehicle-group/share-component/vehicle-group.component';
import { LayoutComponent } from './layout/layout.component';
import { ToolbarMenuComponent } from './layout/toolbar-menu/toolbar-menu.component';
import { UserMenuComponent } from './layout/user-menu/user-menu.component';
import { CookieService } from 'ngx-cookie-service';
import { TextSearchComponent } from './lab-component/user-vehicle-group/share-component/text-search/text-search.component';
import { DrivingInfoComponent } from './lab-component/driving-info/driving-info.component';
import { InputSearchOptionComponent } from './lab-component/driving-info/share-component/input-search-option/input-search-option.component';
import { MultiSelectDropdownComponent } from './lab-component/driving-info/share-component/multi-select-dropdown/multi-select-dropdown.component';
import { PaginationComponent } from './lab-component/driving-info/share-component/pagination/pagination.component';
import { ValidatedInputComponent } from './lab-component/driving-info/share-component/validated-input/validated-input.component';
import { NgbDatepickerI18n, NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { NgbDatepickerI18nViService } from './service/ngb-datepicker-i18n-vi.service';
import { IsoToDdmmyyyyPipe } from './pipe/isoToDdmmyyyy.pipe';
import { LoadingMaskComponent } from './layout/loading-mask/loading-mask.component';
import { LoadingInterceptor } from './layout/loading-mask/loading.interceptor';
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

registerLocaleData(localeVi);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    FilterPipe,
    IsoToDdmmyyyyPipe,
    ToolbarMenuComponent,
    UserMenuComponent,
    SelectRowGroupsComponent,
    LoadingMaskComponent,
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
    LoginComponent,
    VehicleGroupComponent,
    TextSearchComponent,
    UserVehicleGroupComponent,
    InputSearchOptionComponent,
    MultiSelectDropdownComponent,
    PaginationComponent,
    ValidatedInputComponent,
    DrivingInfoComponent,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    BrowserAnimationsModule,
    NgbDatepickerModule,
    NgbModule,
    NgbDatepickerModule,

    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
    }),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    AppConfig,
    DoughnutPluginService,
    LegendService,
    ChartScrollService,
    VehicleDataService,
    WidgetUpdateDataService,
    TranslateService,
    { provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nViService },
    CookieService,
    {
      provide: APP_INITIALIZER,
      useFactory: InitApp,
      deps: [AppConfig],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
