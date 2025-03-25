import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { DoughnutPluginService } from '../../../service/doughnut-plugin/doughnut-plugin.service';
import { LegendService } from '../../../service/legend-alignment-plugin/legend-alignment-plugin.service';

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})
export class DashboardDoughnutComponent implements OnDestroy {
  @Input() emptyVehicles: number = 100; // Phương tiện không hàng
  @Input() loadedVehicles: number = 100; // Phương tiện có hàng
  @Input() width: string = ''; // Độ rộng có thể là '50%', '80%', '300px'...
  // @ViewChild('doughnutChart', { static: true }) chartRef!: ElementRef;

  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @ViewChild(BaseChartDirective, { static: false }) chart!: BaseChartDirective;
  private resizeSubscription: Subscription | undefined;
  public chartOptions: ChartConfiguration['options'];
  constructor(
    private doughnutPlugin: DoughnutPluginService,
    private legendService: LegendService
  ) {
    this.chart?.update();
    // Đăng ký plugin
    // Chart.register(this.doughnutPlugin.getDoughnutLabelPlugin());
    // Kiểm tra có phải môi trường browser không
    if (typeof window !== 'undefined') {
      this.resizeSubscription = fromEvent(window, 'resize')
        .pipe(debounceTime(100))
        .subscribe(() => {
          this.chart?.update();
        });
    }
    this.chartOptions = {
      responsive: true,

      layout: {
        padding: {
          bottom: 60, // Sát mép dưới
          top: 40,
          left: 10,
          right: 10,
        },
      },

      maintainAspectRatio: false, // Cho phép co giãn theo container
      aspectRatio: 1, // Change Size of Doughnut Chart
      // cutout: '70%', //
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
  }

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    if (this.chart?.chart) {
      // this.legendService.adjustLegend(this.chart.chart);
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.updateLegend();
  }
  public chartType: ChartType = 'doughnut';

  public chartData = {
    labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
    datasets: [
      {
        data: [this.loadedVehicles, this.emptyVehicles],
        backgroundColor: ['#28a745', '#e87d3e'],
        borderWidth: 0,
        cutout: '70%', // Áp dụng cho từng dataset
        // animation: { animateRotate: false, animateScale: false },
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

  private updateLegend(): void {
    console.log('updateLegend');
    if (this.chart?.chart) {
      // this.legendService.adjustLegend(this.chart.chart);
    }
  }
  /**
   * Chart plugins of bar chart component
   * @description Danh sách các Plugins custom do người dùng thêm
   */
  getPlugins() {
    return [
      this.doughnutPlugin.getDoughnutLabelPlugin(),
      this.textAroundDoughnut,
      this.legendService.getCustomLegendPlugin(10, 0, 10),
    ];
  }
}
