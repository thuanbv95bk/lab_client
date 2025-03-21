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
        animation: { animateRotate: true, animateScale: true },
        maintainAspectRatio: false, // Cho phép co giãn theo container
        cutout: '70%', // 🛠 Tăng vòng tròn trong,
        plugins: {
          legend: {
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
        {
          id: 'centerText',
          beforeDraw: (chart: any) => {
            const { width, height, ctx } = chart;
            ctx.restore();
            const fontSize = (height / 8).toFixed(2);
            ctx.font = `bold ${fontSize}px Arial`;
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
            /**
             * Charts before draw
             * @param centerX  Căn lấy điểm giữa trục X
             * @param centerY, Căn lấy điểm giữa trục Y
             */
            const centerX = width / 2;
            const centerY = height / 2;

            // Vẽ số lượng phương tiện ở giữa
            ctx.fillStyle = '#113b92';
            ctx.fillText(this.totalVehicles.toString(), centerX, centerY - 15); //Dịch chữ số lượng phương tiện lên trên một chút để không bị đè lên dòng chữ "phương tiện".

            // Vẽ chữ "phương tiện" bên dưới
            ctx.font = `bold ${(height / 32).toFixed(2)}px Arial`;
            ctx.fillText('phương tiện', centerX, centerY + 15); // Đẩy chữ xuống thấp.
            ctx.save();
          },
        },
        {
          id: 'customLabels',
          afterDraw(chart) {
            const ctx = chart.ctx;
            ctx.font = 'bold 14px Arial';
            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';

            const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
            const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

            chart.data.datasets.forEach((dataset, i) => {
              const meta = chart.getDatasetMeta(i);
              meta.data.forEach((arcElement, index) => {
                if (!arcElement) return;

                const model = arcElement.tooltipPosition(true); // Lấy vị trí trung tâm lát cắt
                const label = dataset.label;
                const value = dataset.data[index];

                // ✅ **Lấy bán kính chính xác**
                let radius = (chart.chartArea.right - chart.chartArea.left) / 2;

                // ✅ **Tính góc**
                const dx = model.x - centerX;
                const dy = model.y - centerY;
                const angle = Math.atan2(dy, dx);

                // ✅ **Xác định vị trí đường chỉ dẫn**
                const xOffset = Math.cos(angle) * (radius + 10);
                const yOffset = Math.sin(angle) * (radius + 10);
                const startX = model.x;
                const startY = model.y;
                const endX = centerX + xOffset;
                const endY = centerY + yOffset;

                // ✅ **Vẽ đường chỉ dẫn**
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.strokeStyle = '#666';
                ctx.stroke();

                // ✅ **Hiển thị text**
                const textX = endX + (endX > centerX ? 10 : -10);
                ctx.textAlign = endX > centerX ? 'left' : 'right';
                ctx.fillText(`${value} ${label}`, textX, endY);
              });
            });
          },
        },
      ],
    });
  }
}
