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

    //Tìm tất cả .chart-doughnut-container
    const chartRows = Array.from(
      document.querySelectorAll('.chart-doughnut-container')
    ) as HTMLElement[];

    let getHeightMax = 0;

    if (chartRows.length > 0) {
      getHeightMax = Math.max(...chartRows.map((row) => row.clientHeight || 0));
    }

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

    if (getHeightMax > 0) {
      if (chartContainer.style.overflowX == 'hidden') {
        containerBody.style.height = `${getHeightMax}px`;
      } else {
        const offset = this.getScrollbarHeight();
        containerBody.style.height = `${getHeightMax - offset}px`;
      }
    }

    // Đảm bảo chart chiếm đủ không gian
    chart.canvas.style.width = `${calculatedWidth}px`;
    chart.canvas.style.height = '100%';
    chart.resize(); // Yêu cầu chart vẽ lại với kích thước mới
  }

  getScrollbarHeight(): number {
    // Tạo một thẻ div ẩn để đo scrollbar
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.style.overflow = 'scroll'; // Kích hoạt thanh cuộn
    div.style.position = 'absolute';
    div.style.top = '-9999px';
    div.style.width = '100px';
    div.style.height = '100px';

    document.body.appendChild(div);

    // Tạo một thẻ con bên trong để xác định chiều cao scrollbar
    const innerDiv = document.createElement('div');
    innerDiv.style.width = '100%';
    innerDiv.style.height = '200px';
    div.appendChild(innerDiv);

    // Chiều cao của scrollbar chính là sự chênh lệch giữa div chứa và div con
    const scrollbarHeight = div.offsetHeight - div.clientHeight;

    // Xóa thẻ div khỏi DOM
    document.body.removeChild(div);

    return scrollbarHeight;
  }
}
