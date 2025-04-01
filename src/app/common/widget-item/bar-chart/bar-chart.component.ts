import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ChartOptions, ChartType, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ChartScrollService } from '../../../service/chart-bar-scroll/chart-bar-scroll.service';
import { VehicleCompany } from '../../model/dashboard/dashboard.model';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @Input() data: VehicleCompany[] = [];
  @Input() barColor: string = '#d90429';
  @Input() minLabelWidth: number = 100;
  @Input() defaultVisibleItems: number = 5;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor(private chartScrollService: ChartScrollService) {}

  /**
   * Chart options of bar chart component
   * @author thuan.bv
   * @description tùy chỉnh biểu đồ
   */
  public chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x', // Giữ trục X nằm ngang
    aspectRatio: 1,

    layout: {
      padding: {
        top: 10,
        right: 5,
        left: 5,
      },
    },
    scales: {
      x: {
        offset: true, // Thêm khoảng trống ở 2 đầu

        grid: {
          offset: true, // Giúp các bar không dính vào biên
        },
        afterFit: (context) => {
          context.width += 10;
        },

        ticks: {
          autoSkip: false, // Không bỏ qua tick nào
          autoSkipPadding: 80, // Khoảng cách tối thiểu giữa các tick
          stepSize: 1, // Hiển thị mỗi tick cách nhau 2 đơn vị
          maxRotation: 0, // Không cho xoay chữ
          minRotation: 0, // Giữ cố định
          padding: 10, // Tăng khoảng cách giữa các tick
          align: 'center', // Căn giữa tick

          font: {
            size: 12,
          },

          callback: function (value) {
            let label = this.getLabelForValue(value as number);
            let maxCharsPerLine = 15; //  Số ký tự tối đa mỗi dòng
            let words = label.split(' '); // Tách theo khoảng trắng
            let lines: string[] = [];
            let currentLine = '';

            words.forEach((word) => {
              if ((currentLine + ' ' + word).length > maxCharsPerLine) {
                lines.push(currentLine); // Đưa dòng cũ vào danh sách
                currentLine = word; // Tạo dòng mới
              } else {
                currentLine += (currentLine ? ' ' : '') + word;
              }
            });
            lines.push(currentLine); // Thêm dòng cuối cùng
            return lines; // Trả về mảng
          },
        },
      },

      y: {
        beginAtZero: true,
        min: 0,
        grace: '5%', // offset cộng thêm cho trục y

        ticks: {
          stepSize: 1,
          callback: function (value, index) {
            let maxY = this.chart.scales['y'].max; // Lấy giá trị max của trục Y

            if (Number(this.getLabelForValue(value as number)) == maxY)
              return 'Số phương tiện';
            return this.getLabelForValue(value as number);
          },
        },

        title: { display: false }, // Ẩn tiêu đề mặc định của Chart.js
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        font: { weight: 'bold', size: 12 },
      },
    },
  };

  public chartType: ChartType = 'bar';

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  ngAfterViewInit(): void {
    this.buildChart();
    // new ResizeObserver(() => {
    //   // Kích thước container thay đổi sẽ tự động cập nhật
    // }).observe(this.chartContainer.nativeElement);
  }

  /**
   * on changes
   * @param changes
   * @description kiểm tra có sự thay đỗi của data để loading lại dữ liệu vào dashboard
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.buildChart();
    }
  }

  /**
   * Builds chart
   * @author thuan.bv
   * @description Builds chart
   */
  buildChart(): void {
    this.chartData = {
      labels: this.data.map((item) => item.company),
      datasets: [
        {
          data: this.data.map((item) => item.value),
          backgroundColor: this.barColor,
          barPercentage: 1, // Cột chiếm 50% trong nhóm
          categoryPercentage: 0.8, // Nhóm cột chiếm 50% trục X
          maxBarThickness: 30,
          minBarLength: 20,
        },
      ],
    };

    this.chart?.update();
  }

  /**
   * Chart plugins of bar chart component
   * @description Danh sách các Plugins custom do người dùng thêm
   */

  getPlugins() {
    return [
      ChartDataLabels,
      this.chartScrollService.getHorizontalScrollPlugin(
        this.minLabelWidth,
        this.defaultVisibleItems
      ),
    ];
  }
}
