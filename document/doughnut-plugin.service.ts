// doughnut-plugin.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DoughnutPluginService {
  getDoughnutLabelPlugin(config?: any) {
    const defaultConfig = {
      lineColor: '#999',
      lineWidth: 1.5, // Độ dày của đường kết nối (1.5px)
      textFont: '12px Arial',
      textColor: '#333',
      textPadding: 2, // Khoảng cách giữa đường kết nối và chữ (1px)
      // lineExtension: 10, // Chiều dài đoạn ngang của đường kết nối (40px)
      minPercentageToShow: 1, // Phần trăm tối thiểu để hiển thị nhãn (1%)
      horizontalExtension: 10, // Chiều dài đoạn ngang của đường kết nối (40px)

      maxTextWidth: null,
      lineHeight: 1.1, // Hệ số nhân chiều cao giữa các dòng (1.2 lần font size)
      forceFullDisplay: true, // Thêm option mới để luôn hiển thị đầy đủ

      minLineExtension: 10, // Giá trị tối thiểu
      maxLineExtension: 20, // Giá trị tối đa
    };

    const mergedConfig = { ...defaultConfig, ...config };

    return {
      id: 'doughnutLabelsLine',
      afterDraw: (chart: any) => {
        const {
          ctx,
          data,
          chartArea: { width, height, left, right, top, bottom },
        } = chart;

        if (!data?.datasets?.[0]?.data) return;

        // Tính toán lineExtension dựa trên kích thước biểu đồ
        const chartSize = Math.min(width, height);
        let lineExtension = chartSize * mergedConfig.lineExtensionRatio;

        // Giới hạn trong khoảng min-max
        lineExtension = Math.max(
          mergedConfig.minLineExtension,
          Math.min(mergedConfig.maxLineExtension, lineExtension)
        );

        // Tính tổng an toàn
        const datasetData = data.datasets[0].data || [];
        const total = Array.isArray(datasetData)
          ? datasetData
              .filter((val) => typeof val === 'number')
              .reduce((sum, val) => sum + val, 0)
          : Object.values(datasetData)
              .filter((val) => typeof val === 'number')
              .reduce((sum, val) => sum + val, 0);

        if (total <= 0) return;

        chart.data.datasets.forEach((dataset: any, i: number) => {
          chart
            .getDatasetMeta(i)
            .data.forEach((datapoint: any, index: number) => {
              i = i + 1;
              const value = data.datasets[0].data[i - 1];
              if (value === null || value === undefined) return;

              const percentage = (value / total) * 100;
              // if (percentage <= mergedConfig.minPercentageToShow) return;

              if (percentage < mergedConfig.minPercentageToShow) return; // Áp dụng minPercentageToShow

              const { x, y } = datapoint.tooltipPosition(true);
              const halfWidth = width / 2;
              const halfHeight = height / 2;

              const xLine = x >= halfWidth ? x + 20 : x - 20;
              const yLine = y >= halfHeight ? y + 30 : y - 30;
              // const extraLine =
              //   x >= halfWidth
              //     ? mergedConfig.lineExtension
              //     : -mergedConfig.lineExtension;
              const extraLine =
                x >= halfWidth
                  ? mergedConfig.horizontalExtension
                  : -mergedConfig.horizontalExtension; // Áp dụng horizontalExtension

              // Draw line
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(xLine + extraLine, yLine);
              ctx.strokeStyle = mergedConfig.lineColor;
              ctx.lineWidth = mergedConfig.lineWidth;
              ctx.stroke();

              // Prepare text
              const textDisplay = `${value} phương tiện (${percentage.toFixed(
                0
              )}%)`;

              // Set text style
              ctx.font = mergedConfig.textFont;
              ctx.fillStyle = mergedConfig.textColor;
              const textAlign = x >= halfWidth ? 'left' : 'right';
              ctx.textAlign = textAlign;
              ctx.textBaseline = 'middle';

              // Calculate text position
              const textX =
                xLine +
                extraLine +
                (x >= halfWidth
                  ? mergedConfig.textPadding
                  : -mergedConfig.textPadding);

              // Tính toán không gian hiển thị
              const availableWidth =
                x >= halfWidth ? right - textX - 5 : textX - left - 5;

              const availableHeight = bottom - top;

              // Hiển thị text đầy đủ không cắt bớt
              this.drawFullText(
                ctx,
                textDisplay,
                textX,
                yLine,
                availableWidth + 5,
                availableHeight,
                textAlign,
                mergedConfig.lineHeight
              );
            });
        });
      },
    };
  }

  private drawFullText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    align: 'left' | 'right',
    lineHeightMultiplier: number
  ) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    const fontSize = parseInt(ctx.font);
    const lineHeight = fontSize * lineHeightMultiplier;

    // Tách text thành các dòng phù hợp
    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);

      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    // Tính toán số dòng có thể hiển thị trong khoảng height cho phép
    const maxVisibleLines = Math.floor(maxHeight / lineHeight);
    const visibleLines = lines.slice(0, maxVisibleLines);

    // Tính vị trí bắt đầu vẽ (căn giữa theo chiều dọc)
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    // Vẽ tất cả các dòng có thể hiển thị
    ctx.textAlign = align;
    visibleLines.forEach((line, i) => {
      const currentY = startY + i * lineHeight;
      ctx.fillText(line, x, currentY);
    });

    // Vẽ indicator nếu có dòng bị ẩn
    if (lines.length > maxVisibleLines) {
      const indicator = `(+${lines.length - maxVisibleLines} dòng)`;
      const indicatorY = startY + visibleLines.length * lineHeight;
      ctx.fillText(indicator, x, indicatorY);
    }
  }
}

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
  @Input() emptyVehicles: number = 90; // Phương tiện không hàng
  @Input() loadedVehicles: number = 10; // Phương tiện có hàng
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
