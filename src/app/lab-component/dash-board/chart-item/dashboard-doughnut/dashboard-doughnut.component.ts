import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { DoughnutPluginService } from '../../service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from '../../service/legend-alignment-plugin/legend-alignment-plugin.service';
import { Widget } from '../../model/dashboard.model';
import { VehicleDataService } from '../../service/vehicle-data/vehicle-data.service';

export interface DoughnutModel {
  key: string;
  value: number;
}

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})
export class DashboardDoughnutComponent implements OnInit, OnDestroy, OnChanges {
  emptyVehicles: number = 0; // Phương tiện không hàng
  loadedVehicles: number = 0; // Phương tiện có hàng
  @Input() dataModel: DoughnutModel[] = [];
  @Input() widget!: Widget;
  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;
  private resizeSubscription: Subscription | undefined;

  constructor(
    private doughnutPlugin: DoughnutPluginService,
    private legendService: LegendService,
    private vehicleService: VehicleDataService
  ) {
    // Kiểm tra có phải môi trường browser không
    if (typeof window !== 'undefined') {
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.chart?.update();
        });
    }
  }
  ngOnInit(): void {
    this.initData();
  }

  /** khi có sự thay đỗi của data thì loading lại dữ liệu, cập nhật dashboard
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['dataModel'] || (changes['widget'] && this.chart)) {
      this.buildChart();
    }
  }

  /** resizeSubscription hủy đăng ký resizeSubscription
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.buildChart();
    }, 100);
  }

  /** Tính toán và thiết lập dư liệu để đẩy vào chart
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  initData() {
    if (this.widget) {
      this.dataModel = this.vehicleService.getDataToDoughnut(this.widget?.dataModel, this.widget?.location);
    }
  }

  public chartType: ChartType = 'doughnut';

  /** setup chart chartOptions
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,

    layout: {
      padding: {
        bottom: 60,
        top: 40,
        left: 10,
        right: 10,
      },
    },

    maintainAspectRatio: false, // Cho phép co giãn theo container
    aspectRatio: 1, // Change Size of Doughnut Chart
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 20,

          font: { size: 12 }, // Kích thước chữ
          textAlign: 'center', // Căn giữa nội dung Legend
        },
      },

      tooltip: {
        enabled: false,
      },
    },
  };

  public chartData = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [
      {
        data: [this.loadedVehicles, this.emptyVehicles],
        backgroundColor: ['#28a745', '#e87d3e'],
        borderWidth: 0,
        cutout: '65%',
      },
    ],
  };

  /**
   * viết chữ to ở giữa biểu đồ hình tròn
   * id = textAroundDoughnut
   * @author thuan.bv
   */
  textAroundDoughnut = {
    id: 'textAroundDoughnut',

    afterDraw(chart: any) {
      const ctx = chart.ctx;
      const { width, height, data } = chart; // Lấy kích thước biểu đồ
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      const total = data.datasets[0].data[0] + data.datasets[0].data[1]; // lấy ra tổng
      ctx.translate(xCenter, yCenter);

      let fontSize = (Math.min(width, height) / 10).toFixed(2);

      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = '#0D2D6C';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText(`${total}`, 0, 0);

      fontSize = (Math.min(width, height) / 20).toFixed(2);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = '#0052A3';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillText('phương tiện', 0, 0);
      ctx.restore();
    },
  };

  /**  Danh sách các Plugins custom do người dùng thêm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getPlugins() {
    return [
      this.doughnutPlugin.getDoughnutLabelPlugin(),
      this.textAroundDoughnut,
      this.legendService.getCustomLegendPlugin(10, 0, 10),
    ];
  }

  /**  Builds chart
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  public buildChart(): void {
    this.chartData = {
      labels: this.dataModel.map((item) => item.key),
      datasets: [
        {
          data: this.dataModel.map((item) => item.value),
          backgroundColor: ['#28a745', '#e87d3e'],
          borderWidth: 0,
          cutout: '65%',
        },
      ],
    };
    this.chart?.update();
  }
}
