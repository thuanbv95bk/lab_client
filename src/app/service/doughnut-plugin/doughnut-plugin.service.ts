// doughnut-plugin.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DoughnutPluginService {
  getDoughnutLabelPlugin(config?: any) {
    const defaultConfig = {
      lineColor: '#999',
      lineWidth: 1.5,
      textFont: '12px Arial',
      textColor: '#333',

      // Tỷ lệ tối thiểu để hiển thị line
      minPercentageToShow: 1,

      // Độ dài line tính theo tỉ lệ chartSize
      lineExtensionRatio: 0.05,
      minLineExtension: 15,
      maxLineExtension: 25,

      // Né góc ranh giới (0, π/2, π, 3π/2, 2π)
      boundaryOffset: 0.001,

      // Biên an toàn tránh cắt text
      margin: 10,
    };

    const mergedConfig = { ...defaultConfig, ...config };

    return {
      id: 'doughnutLabelsLine',
      afterDraw: (chart: any) => {
        const {
          ctx,
          data,
          chartArea: { width, height, left, right, top, bottom },
        } = chart;
        if (!data?.datasets?.[0]?.data) return;

        const datasetData: any[] = data.datasets[0].data || [];
        const total = datasetData.reduce(
          (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0),
          0
        );
        if (total <= 0) return;

        // Tâm chart
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        const chartSize = Math.min(width, height);

        // Tính độ dài line
        let lineExtension = chartSize * mergedConfig.lineExtensionRatio;
        lineExtension = Math.max(
          mergedConfig.minLineExtension,
          Math.min(mergedConfig.maxLineExtension, lineExtension)
        );

        chart.data.datasets.forEach((dataset: any, i: number) => {
          const meta = chart.getDatasetMeta(i);

          meta.data.forEach((arc: any, index: number) => {
            const value = datasetData[index];
            if (value == null) return;

            // Tính phần trăm
            const percentage = (value / total) * 100;

            // 1) Nếu 0% -> bỏ qua
            if (percentage <= 0) {
              return;
            }

            // Lấy startAngle, endAngle, outerRadius
            const { startAngle, endAngle, outerRadius } = arc.getProps(
              ['startAngle', 'endAngle', 'outerRadius'],
              true
            );

            // Nếu cung quá nhỏ (startAngle ~ endAngle) => bỏ qua
            if (Math.abs(endAngle - startAngle) < mergedConfig.boundaryOffset) {
              return;
            }

            // Tính midAngle (góc giữa cung)
            let midAngle = (startAngle + endAngle) / 2;

            // 2) Nếu 100% -> ép góc chéo xuống (thay vì đứng)
            // ví dụ 7π/4 (~315°) là góc chéo xuống phải
            if (Math.abs(percentage - 100) < mergedConfig.boundaryOffset) {
              midAngle = (5 * Math.PI) / 4;
            }

            // Né góc ranh giới (nếu không phải 100% => offset)
            if (Math.abs(percentage - 100) > mergedConfig.boundaryOffset) {
              const boundaryAngles = [
                0,
                Math.PI / 2,
                Math.PI,
                (3 * Math.PI) / 2,
                2 * Math.PI,
              ];
              boundaryAngles.forEach((bAngle) => {
                if (Math.abs(midAngle - bAngle) < mergedConfig.boundaryOffset) {
                  midAngle += mergedConfig.boundaryOffset;
                }
              });
            }

            // Điểm bắt đầu (mép ngoài Doughnut)
            const xStart = centerX + Math.cos(midAngle) * outerRadius;
            const yStart = centerY + Math.sin(midAngle) * outerRadius;

            // Kéo chéo thêm lineExtension
            const xLine = xStart + Math.cos(midAngle) * lineExtension;
            const yLine = yStart + Math.sin(midAngle) * lineExtension;

            // Vẽ 1 đoạn chéo
            ctx.beginPath();
            ctx.moveTo(xStart, yStart);
            ctx.lineTo(xLine, yLine);
            ctx.strokeStyle = mergedConfig.lineColor;
            ctx.lineWidth = mergedConfig.lineWidth;
            ctx.stroke();

            // Đuôi line = điểm bắt đầu text
            let textX = xLine;
            let textY = yLine;

            // 3) & 4) Xác định nửa trên/dưới
            // so sánh yLine với centerY
            if (yLine < centerY) {
              // Nửa trên -> chữ bám đáy (textBaseline = 'bottom')
              ctx.textBaseline = 'bottom';
            } else {
              // Nửa dưới -> chữ bám đỉnh (textBaseline = 'top')
              ctx.textBaseline = 'top';
            }

            // Style text
            ctx.font = mergedConfig.textFont;
            ctx.fillStyle = mergedConfig.textColor;
            ctx.textAlign = xLine >= centerX ? 'left' : 'right';

            // Kiểm tra biên
            if (textX > right - mergedConfig.margin) {
              textX = right - mergedConfig.margin;
            }
            if (textX < left + mergedConfig.margin) {
              textX = left + mergedConfig.margin;
            }
            if (textY > bottom - mergedConfig.margin) {
              textY = bottom - mergedConfig.margin;
            }
            if (textY < top + mergedConfig.margin) {
              textY = top + mergedConfig.margin;
            }

            // Tạo nội dung
            const textDisplay = `${value} phương tiện (${percentage.toFixed(
              0
            )}%)`;

            // Vẽ text (có hỗ trợ xuống dòng)
            const availableWidth =
              xLine >= centerX
                ? right - textX - mergedConfig.margin
                : textX - left - mergedConfig.margin;
            const availableHeight = bottom - top;

            this.drawFullText(
              ctx,
              textDisplay,
              textX,
              textY,
              availableWidth,
              availableHeight,
              ctx.textAlign as 'left' | 'right',
              1.1
            );
          });
        });
      },
    };
  }

  private drawFullText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    maxHeight: number,
    align: 'left' | 'right',
    lineHeightMultiplier: number
  ) {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = words[0];
    const fontSize = parseInt(ctx.font, 10);
    const lineHeight = fontSize * lineHeightMultiplier;

    for (let i = 1; i < words.length; i++) {
      const testLine = currentLine + ' ' + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width <= maxWidth) {
        currentLine = testLine;
      } else {
        lines.push(currentLine);
        currentLine = words[i];
      }
    }
    lines.push(currentLine);

    const maxVisibleLines = Math.floor(maxHeight / lineHeight);
    const visibleLines = lines.slice(0, maxVisibleLines);

    // Căn giữa theo chiều dọc (theo số dòng)
    const startY = y - ((visibleLines.length - 1) * lineHeight) / 2;

    ctx.textAlign = align;
    visibleLines.forEach((line, idx) => {
      const currentY = startY + idx * lineHeight;
      ctx.fillText(line, x, currentY);
    });

    // Nếu nhiều dòng hơn khả năng hiển thị
    if (lines.length > maxVisibleLines) {
      const indicator = `(+${lines.length - maxVisibleLines} dòng)`;
      const indicatorY = startY + visibleLines.length * lineHeight;
      ctx.fillText(indicator, x, indicatorY);
    }
  }
}
