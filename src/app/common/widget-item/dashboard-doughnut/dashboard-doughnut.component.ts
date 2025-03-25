import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { Chart, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { debounceTime, fromEvent, Subscription } from 'rxjs';
import { DoughnutPluginService } from '../../../service/doughnut-plugin/doughnut-plugin.service';
import { LegendAlignmentService } from '../../../service/legend-alignment-plugin/legend-alignment-plugin.service';

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})
export class DashboardDoughnutComponent implements OnDestroy {
  @Input() emptyVehicles: number = 40; // Phương tiện không hàng
  @Input() loadedVehicles: number = 0; // Phương tiện có hàng
  @Input() width: string = ''; // Độ rộng có thể là '50%', '80%', '300px'...
  @ViewChild('doughnutChart', { static: true }) chartRef!: ElementRef;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private resizeSubscription: Subscription | undefined;
  constructor(
    private doughnutPlugin: DoughnutPluginService,
    private legendService: LegendAlignmentService
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

  ngOnDestroy() {
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
  ngAfterViewInit(): void {
    this.renderChart();
  }

  public doughnutChartType: ChartType = 'doughnut';

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

  /**
   * Renders chart
   * tạo biểu đồ hình tròn
   * Với hiển thị tổng ở giữa biểu đồ
   * @author thuan.bv
   */
  renderChart() {
    const ctx = this.chartRef.nativeElement as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
        datasets: [
          {
            data: [this.loadedVehicles, this.emptyVehicles],
            backgroundColor: ['#28a745', '#e87d3e'],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: {
            top: 20,
            left: 20,
            right: 20,
            bottom: 20,
          },
        },
        // animation: { animateRotate: true, animateScale: true },
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
              font: { size: 12 }, // Kích thước chữ
              textAlign: 'center', // Căn giữa nội dung Legend
            },
          },

          tooltip: {
            enabled: false,
          },
        },
      },

      plugins: [
        this.textAroundDoughnut,
        this.doughnutPlugin.getDoughnutLabelPlugin(),
        this.legendService.getPlugin(),
      ],
    });
  }
}
