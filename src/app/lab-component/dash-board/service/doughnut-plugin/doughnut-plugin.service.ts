import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * Injectable
 * @description vẽ lại thanh tooltip : đường chỉ và giá trị
 */
export class DoughnutPluginService {
  getDoughnutLabelPlugin(config?: any) {
    const defaultConfig = {
      // màu đường line
      lineColor: '#999',
      // Độ dày của đường nối.
      lineWidth: 1.5,
      // font chữ
      textFont: '12px Arial',
      // màu sắc
      textColor: '#333',
      //Tỷ lệ phần trăm tối thiểu của một phần dữ liệu để quyết định có vẽ đường nối hay không.
      minPercentageToShow: 1,
      // Tỉ lệ tính độ dài của đường nối dựa trên kích thước biểu đồ.
      lineExtensionRatio: 0.05,
      // Giới hạn độ dài tối thiểu và tối đa của đường nối.
      minLineExtension: 15,
      // Giới hạn độ dài tối thiểu và tối đa của đường nối.
      maxLineExtension: 25,
      // Một giá trị offset để tránh vẽ nhãn trùng với các góc biên (như 0, π/2, π, 3π/2, 2π).
      boundaryOffset: 0.001,
      // Biên an toàn để đảm bảo rằng không bị cắt xén khi vẽ.
      margin: 15,
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
        const total = datasetData.reduce((sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0);
        if (total <= 0) return;

        // Tâm chart
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) / 2;
        // Xác định kích thước của biểu đồ bằng cách lấy giá trị nhỏ nhất giữa width và height.
        const chartSize = Math.min(width, height);

        /**
         * Tính độ dài line
         * @description Độ dài của đường nối (lineExtension) được tính dựa trên tỉ
         * lệ lineExtensionRatio của kích thước biểu đồ.
         * Sau đó, giá trị này được giới hạn trong khoảng giữa minLineExtension và maxLineExtension.
         *
         */
        let lineExtension = chartSize * mergedConfig.lineExtensionRatio;
        lineExtension = Math.max(mergedConfig.minLineExtension, Math.min(mergedConfig.maxLineExtension, lineExtension));
        // duyệt qua các phần của biểu đồ
        chart.data.datasets.forEach((dataset: any, i: number) => {
          const meta = chart.getDatasetMeta(i); //lấy thông tin meta của dataset từ Chart.js.

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
            const { startAngle, endAngle, outerRadius } = arc.getProps(['startAngle', 'endAngle', 'outerRadius'], true);

            // Nếu góc của phần (sự chênh lệch giữa startAngle và endAngle)
            // nhỏ hơn boundaryOffset, bỏ qua phần đó để tránh vẽ nhãn cho những phần quá nhỏ.
            if (Math.abs(endAngle - startAngle) < mergedConfig.boundaryOffset) {
              return;
            }

            // Tính midAngle (góc giữa cung)
            let midAngle = (startAngle + endAngle) / 2;

            // Nếu phần chiếm gần 100% biểu đồ, ép midAngle thành một giá trị cố định (ở đây là 5π/4)
            //  để nhãn không bị đặt theo hướng đứng.
            //  7π/4 (~315°) là góc chéo lên trái
            //  5π/4 (~225°) là góc chéo xuống trái
            if (Math.abs(percentage - 100) < mergedConfig.boundaryOffset) {
              midAngle = (5 * Math.PI) / 4;
            }

            // Né góc ranh giới (nếu không phải 100% => offset)
            if (Math.abs(percentage - 100) > mergedConfig.boundaryOffset) {
              const boundaryAngles = [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 2 * Math.PI];

              //kiểm tra và điều chỉnh nếu midAngle quá gần với các góc biên
              // (0, π/2, π, 3π/2, 2π) bằng cách thêm boundaryOffset.
              boundaryAngles.forEach((bAngle) => {
                if (Math.abs(midAngle - bAngle) < mergedConfig.boundaryOffset) {
                  midAngle += mergedConfig.boundaryOffset;
                }
              });
            }

            // Điểm bắt đầu (mép ngoài Doughnut)
            // tính điểm bắt đầu của đường nối ngay trên biên ngoài của phần hình tròn.
            // xStart, yStart: Tọa độ điểm bắt đầu tính từ tâm biểu đồ.
            //outerRadius: Là bán kính bên ngoài của phần doughnut (phần hình tròn chứa dữ liệu).
            //midAngle: Là góc trung bình (đơn vị radian) của phần đó, xác định hướng từ tâm biểu đồ đến giữa phần dữ liệu.
            const xStart = centerX + Math.cos(midAngle) * outerRadius;
            const yStart = centerY + Math.sin(midAngle) * outerRadius;
            //Giá trị Math.cos(midAngle) cho biết tỉ lệ của chiều dài bán kính theo trục hoành (x).
            // Khi nhân với outerRadius, ta được độ lệch trên trục x từ tâm đến biên ngoài của phần arc.
            // Sau đó cộng với centerX để dịch chuyển về vị trí tuyệt đối trên canvas.

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

            // Xác định nửa trên/dưới
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
            const textDisplay = `${value} phương tiện (${percentage.toFixed(0)}%)`;

            // Vẽ text (có hỗ trợ xuống dòng)
            const availableWidth = xLine >= centerX ? right - textX - mergedConfig.margin : textX - left - mergedConfig.margin;
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
  /** vẽ các ký hiệu
   * @Author thuan.bv
   * @Created 08/05/2025
   * @Modified date - user - description
   */

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
