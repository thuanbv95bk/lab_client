import { Component, Input, ViewChild, AfterViewInit, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartScrollService } from '../../service/chart-bar-scroll/chart-bar-scroll.service';
import { Widget } from '../../model/dashboard.model';
import { VehicleDataService } from '../../service/vehicle-data/vehicle-data.service';

/** interface set dữ liệu cho biểu đồ Bar
 * @Author thuan.bv
 * @Created 23/04/2025
 * @Modified date - user - description
 */
export interface BarChartData {
  key: string;
  value: number;
}

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  dataModel: BarChartData[] = [];

  @Input() minLabelWidth: number = 100;
  @Input() defaultVisibleItems: number = 3;
  @Input() widget!: Widget;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  constructor(private chartScrollService: ChartScrollService, private vehicleService: VehicleDataService) {}

  ngOnInit(): void {
    this.initData();
  }

  /** Tính toán và thiết lập dữ liệu để đẩy vào chart
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  initData() {
    if (this.widget) {
      this.dataModel = this.vehicleService.getCompanySummary(
        this.widget.dataModel.filter((x) => x.location == this.widget.location)
      );
    }
  }

  /** tùy chỉnh biểu đồ
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
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

            if (Number(this.getLabelForValue(value as number)) == maxY) return 'Số phương tiện';
            return this.getLabelForValue(value as number);
          },
        },

        title: { display: false }, // Ẩn tiêu đề mặc định của Chart.js
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
  };

  public chartType: ChartType = 'bar';

  public chartData: ChartData<'bar'> = {
    labels: [],
    datasets: [],
  };

  ngAfterViewInit(): void {
    setTimeout(async () => {
      this.buildChart();
    }, 100);
  }

  /** kiểm tra có sự thay đỗi của data để loading lại dữ liệu vào dashboard
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget'] && this.chart) {
      this.buildChart();
    }
  }

  /** Builds chart
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  buildChart(): void {
    this.chartData = {
      labels: this.dataModel.map((item) => item.key),
      datasets: [
        {
          data: this.dataModel.map((item) => item.value),
          backgroundColor: this.widget.color,
          barPercentage: 1, // Cột chiếm 50% trong nhóm
          categoryPercentage: 0.8, // Nhóm cột chiếm 50% trục X
          maxBarThickness: 30,
          minBarLength: 20,
        },
      ],
    };

    this.chart?.update();
  }

  /** Danh sách các Plugins custom do người dùng thêm
   * @Author thuan.bv
   * @Created 23/04/2025
   * @Modified date - user - description
   */

  getPlugins() {
    return [
      // ChartDataLabels,
      this.chartScrollService.getHorizontalScrollPlugin(this.minLabelWidth, this.defaultVisibleItems),
    ];
  }
}
