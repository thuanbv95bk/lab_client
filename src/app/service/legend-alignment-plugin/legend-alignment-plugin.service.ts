// legend-alignment.service.ts
import { Injectable } from '@angular/core';
import { Chart, Plugin } from 'chart.js';

@Injectable({ providedIn: 'root' })
export class LegendAlignmentService {
  getPlugin(): Plugin {
    return {
      id: 'bottomLegendPlugin',
      beforeInit: (chart) => this.configureLegend(chart),
      beforeUpdate: (chart) => this.configureLegend(chart),
      afterDraw: (chart) => this.drawBottomLegend(chart),
    };
  }

  private configureLegend(chart: Chart) {
    if (!chart.legend) return;

    chart.legend.options = {
      ...chart.legend.options,
      display: false, // Tắt legend mặc định
    };
  }

  private drawBottomLegend(chart: Chart) {
    const ctx = chart.ctx;
    const chartArea = chart.chartArea;
    const datasets = chart.data.datasets;

    if (!datasets?.length) return;

    // Tính toán font size
    const fontSize = Math.min(14, chart.width * 0.02);
    const padding = 20;
    const boxWidth = 15;
    const lineHeight = fontSize + padding;

    // Vị trí bắt đầu (dưới cùng)
    let xPos = chartArea.left;
    const yPos = chart.height - padding; // Sát đáy chart

    // Vẽ từng item
    datasets.forEach((dataset) => {
      if (!dataset.label) return;

      // Vẽ ô màu
      ctx.fillStyle = dataset.backgroundColor as string;
      ctx.fillRect(xPos, yPos - fontSize, boxWidth, boxWidth);

      // Vẽ text
      ctx.fillStyle = '#666';
      ctx.font = `${fontSize}px Arial`;
      ctx.fillText(dataset.label, xPos + boxWidth + 5, yPos);

      // Tính toán vị trí tiếp theo
      xPos += ctx.measureText(dataset.label).width + boxWidth + 25;
    });
  }
}
