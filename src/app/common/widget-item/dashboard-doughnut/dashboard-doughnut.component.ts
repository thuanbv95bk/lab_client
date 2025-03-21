import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})
export class DashboardDoughnutComponent {
  @Input() totalVehicles: number = 100; // Tổng số phương tiện
  @Input() loadedVehicles: number = 40; // Phương tiện có hàng
  @Input() width: string = '100%'; // Độ rộng có thể là '50%', '80%', '300px'...
  @ViewChild('doughnutChart', { static: true }) chartRef!: ElementRef;
  private chart!: Chart;
  ngAfterViewInit(): void {
    this.renderChart();
  }

  private createChart() {
    const ctx = this.chartRef.nativeElement.getContext('2d');
    if (!ctx) return;

    const emptyVehicles = this.totalVehicles - this.loadedVehicles;

    this.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
        datasets: [
          {
            data: [this.loadedVehicles, emptyVehicles],
            backgroundColor: ['#28a745', '#e87d3e'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              // boxWidth: 5, // Điều chỉnh kích thước hộp màu
              font: { size: 10 }, // Kích thước chữ
              textAlign: 'center', // Căn giữa nội dung Legend
            },
          },
        },
        cutout: '70%', // Điều chỉnh kích thước vòng tròn rỗng bên trong
        animation: {
          onComplete: () => this.drawText(ctx),
        },
      },
    });
  }
  private drawText(ctx: CanvasRenderingContext2D) {
    const { width, height } = ctx.canvas;

    ctx.restore();
    const fontSize = (height / 8).toFixed(2);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillText(this.totalVehicles.toString(), centerX, centerY - 15);
    // Vẽ chữ "phương tiện" bên dưới
    ctx.font = `bold ${(height / 32).toFixed(2)}px Arial`;
    ctx.fillText('phương tiện', centerX, centerY + 15);
  }

  textAroundDoughnut = {
    id: 'textAroundDoughnut',
    beforeDatasetsDraw(chart: any) {
      const { ctx, data } = chart;

      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;
      const sum = 6;

      ctx.save();
      // ctx.font = 'bold 14px sans-serif';
      // ctx.fillStyle = 'black';
      // ctx.textAlign = 'center';
      // ctx.fillText('Objective', xCenter, 0 + 30);

      // ctx.font = '18px sans-serif';
      // ctx.fillStyle = 'gray';
      // ctx.textAlign = 'center';
      // ctx.fillText(`Total: `, xCenter, 0 + 60);
      // const textWidth = ctx.measureText('').width;

      // ctx.font = '18px sans-serif';
      // ctx.fillStyle = 'gray';
      // ctx.textAlign = 'center';
      // ctx.fillText(sum, xCenter + textWidth / 2, 0 + 60);

      const total = data.datasets[0].data[0] + data.datasets[0].data[1];

      ctx.translate(xCenter, yCenter);

      ctx.font = 'bold 27px Arial';
      ctx.fillStyle = 'gray';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText(`${total}`, 0, 0);

      const fontSize = 14;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = 'red';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      ctx.fillText('phương tiện', 0, 0);

      // right text
      const angle = Math.PI / 180;
      const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius + 30;
      //Right
      const xRight = Math.cos(angle * 30) * outerRadius;
      const yRight = Math.sin(angle * 30) * outerRadius;

      ctx.font = 'bold 10px Arial';
      ctx.fillStyle = 'margin-right: 5px; red';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      const percentage1 = (data.datasets[0].data[0] / total) * 100;

      ctx.fillText(
        `${data.datasets[0].data[0]} phương tiện(${percentage1.toFixed(1)}%)`,
        xRight + 10,
        yRight
      );
      //Left
      const xLeft = Math.cos(angle * 150) * outerRadius;
      const yLeft = Math.sin(angle * 150) * outerRadius;

      ctx.font = 'bold 10px sans-serif';
      ctx.fillStyle = 'red';
      ctx.textBaseline = 'top';
      ctx.textAlign = 'center';
      const percentage2 = (data.datasets[0].data[1] / total) * 100;
      ctx.fillText(
        `${data.datasets[0].data[0]} phương tiện(${percentage2.toFixed(1)}%)`,
        xLeft - 10,
        yLeft
      );

      // ctx.font = 'bold 20px sans-serif';
      // ctx.fillStyle = 'gray';
      // ctx.textBaseline = 'top';
      // ctx.textAlign = 'center';
      // ctx.fillText('Completed', xLeft, yLeft + 50);

      // ctx.font = 'bold 20px sans-serif';
      // ctx.fillStyle = 'gray';
      // ctx.textBaseline = 'top';
      // ctx.textAlign = 'center';
      // const x2 = `phương tiện ${fontSize}px Arial`;
      // ctx.font = `bold ${fontSize}px Arial`;
      // ctx.fillText('phương tiện ', xRight, yRight + 50);

      ctx.restore();
    },
  };

  renderChart() {
    const ctx = this.chartRef.nativeElement as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Phương tiện có hàng', 'Phương tiện không hàng'],
        datasets: [
          {
            data: [
              this.loadedVehicles,
              this.totalVehicles - this.loadedVehicles,
            ],
            backgroundColor: ['#28a745', '#e87d3e'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        animation: { animateRotate: true, animateScale: true },
        maintainAspectRatio: false, // Cho phép co giãn theo container
        aspectRatio: 1, // Change Size of Doughnut Chart
        cutout: '70%', //
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: { size: 10 }, // Kích thước chữ
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
        {
          id: 'doughnutLabelsLine',
          afterDraw(chart) {
            const {
              ctx,
              chartArea: { top, bottom, left, right, width, height },
            } = chart;

            chart.data.datasets.forEach((dataset, i) => {
              chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                // console.log(dataset)
                const { x, y } = datapoint.tooltipPosition(true);

                // ctx.fillStyle = dataset.borderColor[index];
                // ctx.fill();
                // ctx.fillRect(x, y, 10, 10);

                console.log(x);

                // draw line
                const halfwidth = width / 2;
                const halfheight = height / 2;

                const xLine = x >= halfwidth ? x + 15 : x - 15;
                const yLine = y >= halfheight ? y + 15 : y - 15;
                const extraLine = x >= halfwidth ? 15 : -15;

                // line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(xLine, yLine);
                ctx.lineTo(xLine + extraLine, yLine);
                // ctx.strokeStyle = dataset.data[index];
                ctx.stroke();

                // text
                const textWidth = ctx.measureText('sss').width;
                console.log(textWidth);
                ctx.font = '12px Arial';

                // control the position
                const textXPosition = x >= halfwidth ? 'left' : 'right';
                const plusFivePx = x >= halfwidth ? 5 : -5;
                ctx.textAlign = textXPosition;
                ctx.textBaseline = 'middle';
                // ctx.fillStyle = dataset.borderColor[index];
                ctx.fillText('111111', xLine + extraLine + plusFivePx, yLine);
              });
            });
          },
        },
      ],
    });
  }
}
