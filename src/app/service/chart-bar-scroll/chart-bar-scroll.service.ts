import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChartScrollService {
  getHorizontalScrollPlugin(
    minLabelWidth: number = 100,
    defaultVisibleItems: number = 5
  ) {
    return {
      id: 'horizontalScrollPlugin',
      beforeInit: (chart: any) =>
        this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterUpdate: (chart: any) =>
        this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterDatasetsDraw: (chart: any) =>
        this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterRender: (chart: any) =>
        this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
    };
  }

  private adjustChartLayout(
    chart: any,
    minLabelWidth: number,
    defaultVisibleItems: number
  ) {
    const chartCard = chart.canvas.closest('.chart-card');
    const containerBody = chart.canvas.closest('.container-body');
    const chartContainer = chart.canvas.closest('.chart-container');

    if (!chartCard || !containerBody || !chartContainer) return;

    const availableWidth = chartCard.clientWidth;
    const totalLabels = chart.data.labels?.length || 0;

    // Tính toán chiều rộng tối thiểu để hiển thị đẹp
    const calculatedWidth = Math.max(
      availableWidth, // Ít nhất bằng kích thước container
      defaultVisibleItems * minLabelWidth, // Hoặc đủ cho số item mặc định
      totalLabels * minLabelWidth // Hoặc đủ cho tất cả labels
    );

    // Áp dụng kích thước
    containerBody.style.width = `${calculatedWidth}px`;
    containerBody.style.minWidth = `${calculatedWidth}px`;
    chartContainer.style.overflowX =
      calculatedWidth > availableWidth ? 'auto' : 'hidden';

    // Đảm bảo chart chiếm đủ không gian
    chart.canvas.style.width = `${calculatedWidth}px`;
    chart.canvas.style.height = '100%';
    chart.resize(); // Yêu cầu chart vẽ lại với kích thước mới
  }
}
