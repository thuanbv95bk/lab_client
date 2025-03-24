import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
  SimpleChanges,
  ElementRef,
} from '@angular/core';
import { ChartOptions, ChartType, ChartData, Chart } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  // @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  @Input() data: { label: string; value: number }[] = [];
  @Input() width: string = '100%'; // có thể set từ ngoài
  @Input() height: string = '300px';
  @Input() barColor: string = '#d90429';
  @ViewChild('chartCanvas', { static: true })
  chartCanvas!: ElementRef<HTMLCanvasElement>;
  chart!: Chart;
  public chartOptions: ChartOptions = {
    responsive: true,
    // maintainAspectRatio: false,
    maintainAspectRatio: false,
    aspectRatio: 1,

    layout: {
      padding: {
        top: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: 10,
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
      x: {
        ticks: {
          maxRotation: 0, // Không cho xoay chữ
          minRotation: 0, // Giữ cố định
          autoSkip: false, // Hiển thị đầy đủ
          align: 'center',
          font: {
            size: 10,
          },

          callback: function (value) {
            let label = this.getLabelForValue(value as number);
            let maxCharsPerLine = 20; //  Số ký tự tối đa mỗi dòng
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
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      datalabels: {
        anchor: 'end',
        align: 'top',
        font: { weight: 'bold', size: 10 },
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.chart) {
      this.buildChart();
    }
  }

  buildChart(): void {
    this.chartData = {
      labels: this.data.map((item) => item.label),
      datasets: [
        {
          data: this.data.map((item) => item.value),
          backgroundColor: this.barColor,
          barPercentage: 0.5, // Cột chiếm 80% trong nhóm
          categoryPercentage: 0.2, // Nhóm cột chiếm 20% trục X
          // borderWidth: 1,
          barThickness: 10, // Độ rộng cố định của cột
        },
      ],
    };

    this.chart?.update();
  }

  yScaleLabelPlugin = {
    id: 'yScaleLabel',

    beforeDatasetsDraw(chart: any) {
      const {
        ctx,
        scales: { y },
      } = chart;
      const chartArea = chart.chartArea;
      if (!chartArea) return;

      ctx.save();
      const yCenter = y.bottom - y.top + y.top;

      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = 'gray';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.fillText('Số phương tiện', y.left, y.top + 5);
      // ctx.restore();
    },
  };

  public chartPlugins = [ChartDataLabels];
}
