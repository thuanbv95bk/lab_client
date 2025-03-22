import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-dashboard-doughnut',
  templateUrl: './dashboard-doughnut.component.html',
  styleUrl: './dashboard-doughnut.component.scss',
})
export class DashboardDoughnutComponent {
  @Input() emptyVehicles: number = 40; // Phương tiện không hàng
  @Input() loadedVehicles: number = 0; // Phương tiện có hàng
  @Input() width: string = '100%'; // Độ rộng có thể là '50%', '80%', '300px'...
  @Input() isVisible: boolean = false; // Độ rộng có thể là '50%', '80%', '300px'...
  totalVehicles: number = this.emptyVehicles + this.loadedVehicles;
  @ViewChild('doughnutChart', { static: true }) chartRef!: ElementRef;
  ngAfterViewInit(): void {
    this.renderChart();
  }

  /**
   * viết chữ to ở giữa biểu đồ hình tròn
   * id = textAroundDoughnut
   * @author thuan.bv
   */
  textAroundDoughnut = {
    id: 'textAroundDoughnut',

    beforeDatasetsDraw(chart: any) {
      const { ctx, data } = chart;

      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      const total = data.datasets[0].data[0] + data.datasets[0].data[1]; // lấy ra tổng
      ctx.translate(xCenter, yCenter);
      ctx.font = 'bold 27px Arial';
      ctx.fillStyle = '#1E0CFE';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText(`${total}`, 0, 0);

      const fontSize = 14;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = '#0D6EFD';
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
              data,
              chartArea: { top, bottom, left, right, width, height },
            } = chart;

            const total = Object.values(data.datasets[0].data).reduce(
              (a, b) => a + b,
              0
            ); // lấy ra tổng

            chart.data.datasets.forEach((dataset, i) => {
              chart.getDatasetMeta(i).data.forEach((datapoint, index) => {
                i = i + 1;
                const percentage = (data.datasets[0].data[i - 1] / total) * 100; // tính phần trăm
                if (percentage == 0) return;

                const { x, y } = datapoint.tooltipPosition(true);

                // draw line
                const halfWidth = width / 2; // lấy ra 1/2 chiều rộng
                const halfHeight = height / 2; // lấy ra 1/2 chiều cao

                const xLine = x >= halfWidth ? x + 15 : x - 15;
                const yLine = y >= halfHeight ? y + 15 : y - 15;
                const extraLine = x >= halfWidth ? 15 : -15;

                // line
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(xLine, yLine);
                ctx.lineTo(xLine + extraLine, yLine);
                ctx.stroke();

                // text

                const textDisplay = `${
                  data.datasets[0].data[i - 1]
                } phương tiện( ${percentage.toFixed(0)}%)`;
                const textWidth = ctx.measureText(textDisplay).width;
                ctx.font = '10px Arial';

                // control the position
                const textXPosition = x >= halfWidth ? 'left' : 'right';
                const plusFivePx = x >= halfWidth ? 5 : -5;
                ctx.textAlign = textXPosition;
                ctx.textBaseline = 'middle';
                ctx.fillText(
                  textDisplay,
                  xLine + extraLine + plusFivePx,
                  yLine
                );
              });
            });
          },
        },
      ],
    });
  }
}
