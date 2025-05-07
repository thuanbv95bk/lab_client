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

/** vẽ biểu đồ bar
 * @Author thuan.bv
 * @Created 08/05/2025
 * @Modified date - user - description
 */
export class BarChartComponent implements OnInit, AfterViewInit, OnChanges {
  /** data */
  dataModel: BarChartData[] = [];

  /** độ dài bé nhất cùa label */
  @Input() minLabelWidth: number = 100;
  /** giá trị của  */
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
        // Thêm khoảng trống ở 2 đầu
        offset: true,

        grid: {
          // Giúp các bar không dính vào biên
          offset: true,
        },
        afterFit: (context) => {
          context.width += 10;
        },

        ticks: {
          // Không bỏ qua tick nào
          autoSkip: false,
          // Khoảng cách tối thiểu giữa các tick
          autoSkipPadding: 80,
          // Hiển thị mỗi tick cách nhau 2 đơn vị
          stepSize: 1,
          // Không cho xoay chữ
          maxRotation: 0,
          // Giữ cố định
          minRotation: 0,
          // Tăng khoảng cách giữa các tick
          padding: 10,
          // Căn giữa tick
          align: 'center',

          font: {
            size: 12,
          },

          callback: function (value) {
            let label = this.getLabelForValue(value as number);
            //  Số ký tự tối đa mỗi dòng
            let maxCharsPerLine = 15;
            // Tách theo khoảng trắng
            let words = label.split(' ');
            let lines: string[] = [];
            let currentLine = '';

            words.forEach((word) => {
              if ((currentLine + ' ' + word).length > maxCharsPerLine) {
                // Đưa dòng cũ vào danh sách
                lines.push(currentLine);
                // Tạo dòng mới
                currentLine = word;
              } else {
                currentLine += (currentLine ? ' ' : '') + word;
              }
            });
            // Thêm dòng cuối cùng
            lines.push(currentLine);
            // Trả về mảng
            return lines;
          },
        },
      },

      y: {
        beginAtZero: true,
        min: 0,
        // offset cộng thêm cho trục y
        grace: '5%',

        ticks: {
          stepSize: 1,
          callback: function (value, index) {
            // Lấy giá trị max của trục Y
            let maxY = this.chart.scales['y'].max;

            if (Number(this.getLabelForValue(value as number)) == maxY) return 'Số phương tiện';
            return this.getLabelForValue(value as number);
          },
        },
        // Ẩn tiêu đề mặc định của Chart.js
        title: { display: false },
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
          // Cột chiếm 50% trong nhóm
          barPercentage: 1,
          // Nhóm cột chiếm 50% trục X
          categoryPercentage: 0.8,
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
