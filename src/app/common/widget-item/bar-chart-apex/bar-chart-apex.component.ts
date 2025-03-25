import { Component, Input, OnInit } from '@angular/core';
import {
  ChartComponent,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexPlotOptions,
  ApexDataLabels,
} from 'ng-apexcharts';

export type ChartOptions = {
  series: any;
  chart: ApexChart;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  colors: string[];
};

@Component({
  selector: 'app-bar-chart-apex',
  templateUrl: './bar-chart-apex.component.html',
  styleUrls: ['./bar-chart-apex.component.scss'],
})
export class BarChartApexComponent {
  @Input() chartData: { name: string; value: number }[] = [];
  @Input() barColor: string = '#FF4560'; // Màu mặc định
  @Input() columnWidth: string = 'auto'; // 'auto' hoặc giá trị cụ thể (ví dụ '40px')

  public chartOptions!: ChartOptions; // Dùng '!' để khẳng định không undefined

  ngOnInit(): void {
    this.setupChart();
  }

  setupChart() {
    const categories = this.chartData.map((item) => item.name);
    const values = this.chartData.map((item) => item.value);

    this.chartOptions = {
      series: [{ name: 'Số phương tiện', data: values }],
      chart: {
        type: 'bar',
        // height: ,
        toolbar: {
          show: false, // Ẩn toàn bộ toolbar
        },
        zoom: {
          enabled: false, // Tắt tính năng zoom khi kéo chuột
        },
      },
      grid: {
        show: false,
        padding: {
          top: 0,
          bottom: 0,
        },
        xaxis: {
          lines: {
            show: false,
          },
        },
        yaxis: {
          lines: {
            show: false,
          },
        },
      },
      plotOptions: {
        bar: {
          columnWidth: this.columnWidth === 'auto' ? '50%' : this.columnWidth, // Tùy chỉnh độ rộng cột
          dataLabels: { position: 'top' },
        },
      },
      dataLabels: {
        enabled: true,
        style: { fontSize: '14px', fontWeight: 'bold', colors: ['#000'] },
      },
      xaxis: {
        categories: categories,
        labels: {
          style: {
            fontSize: '12px',
          },
          rotate: 0, // Không xoay
          trim: false, // Không cắt bớt nội dung
        },
        tickPlacement: 'on',
      },
      yaxis: {
        title: {
          text: 'Số phương tiện',
          style: { fontSize: '12px', fontWeight: 'bold' },
        },
      },
      colors: [this.barColor],
    };
  }
}
