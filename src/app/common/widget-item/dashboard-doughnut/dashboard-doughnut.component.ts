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

    afterDraw(chart: any) {
      const ctx = chart.ctx;
      const { width, data } = chart; // Lấy kích thước biểu đồ
      const xCenter = chart.getDatasetMeta(0).data[0].x;
      const yCenter = chart.getDatasetMeta(0).data[0].y;

      ctx.save();
      const total = data.datasets[0].data[0] + data.datasets[0].data[1]; // lấy ra tổng
      ctx.translate(xCenter, yCenter);
      // const fontSize = 14;
      let fontSize = Math.min(25, width / 15);
      console.log(fontSize);

      ctx.font = `bold ${fontSize}px Arial`;
      // ctx.font = 'bold 27px Arial';
      ctx.fillStyle = '#0D2D6C';
      ctx.textBaseline = 'bottom';
      ctx.textAlign = 'center';
      ctx.fillText(`${total}`, 0, 0);

      fontSize = Math.max(12, width / 30);
      ctx.font = `bold 12px Arial`;
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
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        // layout: {
        //   padding: {
        //     top: 10,
        //     left: 20,
        //     right: 20,
        //   },
        // },
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
        {
          id: 'doughnutLabelsLine',
          afterDraw(chart) {
            const {
              ctx,
              data,
              chartArea: { width, height },
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

                const xLine = x >= halfWidth ? x + 20 : x - 20;
                const yLine = y >= halfHeight ? y + 20 : y - 20;
                const extraLine = x >= halfWidth ? 20 : -20;

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
                ctx.font = '12px Arial';

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
