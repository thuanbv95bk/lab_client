import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { DoughnutPluginService } from '../../service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from '../../service/legend-alignment-plugin/legend-alignment-plugin.service';
import { Widget } from '../../model/dashboard.model';
import { VehicleDataService } from '../../service/vehicle-data/vehicle-data.service';

/** data của biểu đồ Doughnut
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export interface DoughnutModel {
  /** khoá */
  key: string;
  /** giá trị */
  value: number;
}

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})

/** hiển thị biểu đồ  DashboardDoughnut
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class DashboardDoughnutComponent implements OnInit, OnDestroy, OnChanges {
  /** Phương tiện không hàng */
  emptyVehicles: number = 0;
  /**  Phương tiện có hàng*/
  /** số pt có hàng */
  loadedVehicles: number = 0;
  /** chứa data */
  @Input() dataModel: DoughnutModel[] = [];
  /** các thuộc tính của 1 Widget */
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
  /** khởi tạo
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

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

  /** vẽ biểu đồ
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

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
    // Cho phép co giãn theo container
    maintainAspectRatio: false,
    // Change Size of Doughnut Chart
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
          padding: 20,
          // Kích thước chữ
          font: { size: 12 },
          // Căn giữa nội dung Legend
          textAlign: 'center',
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
      // Lấy kích thước biểu đồ
      const { width, height, data } = chart;
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      // lấy ra tổng
      const total = data.datasets[0].data[0] + data.datasets[0].data[1];
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
