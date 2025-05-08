import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

/**
 * Injectable
 *  @description Service tính toán sụ xuất hiện
 * của thanh cuộn ở dashboard bar
 * Là 1 Plugin có id
 * @author thuan.bv
 */
export class ChartScrollService {
  getHorizontalScrollPlugin(minLabelWidth: number = 100, defaultVisibleItems: number = 5) {
    return {
      id: 'horizontalScrollPlugin',
      beforeInit: (chart: any) => this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterUpdate: (chart: any) => this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterDatasetsDraw: (chart: any) => this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
      afterRender: (chart: any) => this.adjustChartLayout(chart, minLabelWidth, defaultVisibleItems),
    };
  }

  /**
   * Adjusts chart layout
   * @param chart
   * @param minLabelWidth độ rộng tối thiểu của 1 tick-x: đơn vị px
   * @param defaultVisibleItems số lượng tối thiểu của item để xuất hiện thanh cuộn:
   * @returns
   */
  private adjustChartLayout(chart: any, minLabelWidth: number, defaultVisibleItems: number) {
    const chartCard = chart.canvas.closest('.chart-card');
    const containerBody = chart.canvas.closest('.container-body');
    const chartContainer = chart.canvas.closest('.chart-container');

    //Tìm tất cả .chart-doughnut-container
    const chartRows = Array.from(document.querySelectorAll('.chart-doughnut-container')) as HTMLElement[];

    let getHeightMax = 0;

    if (chartRows.length > 0) {
      getHeightMax = Math.max(...chartRows.map((row) => row.clientHeight || 0));
    }

    if (!chartCard || !containerBody || !chartContainer) return;

    const availableWidth = chartCard.clientWidth;
    const totalLabels = chart.data.labels?.length || 0;

    // Tính toán chiều rộng tối thiểu để hiển thị đẹp
    const calculatedWidth = Math.max(
      // Ít nhất bằng kích thước container
      availableWidth,
      // Hoặc đủ cho số item mặc định
      defaultVisibleItems * minLabelWidth,
      // Hoặc đủ cho tất cả labels
      totalLabels * minLabelWidth
    );

    // Áp dụng kích thước
    containerBody.style.width = `${calculatedWidth}px`;
    containerBody.style.minWidth = `${calculatedWidth}px`;
    chartContainer.style.overflowX = calculatedWidth > availableWidth ? 'auto' : 'hidden';

    containerBody.style.height = `${getHeightMax}px`;
    // Đảm bảo chart chiếm đủ không gian
    chart.canvas.style.width = `${calculatedWidth}px`;
    chart.canvas.style.height = '100%';
    // Yêu cầu chart vẽ lại với kích thước mới
    chart.resize();
  }

  /**
   * Gets scrollbar height
   * @description tính toán chiều cao của thanh cuộn
   * từ đó để căn chỉnh chiều cao khớp với chiều cao của các char cùng 1 hàng
   * @returns scrollbar height
   */
  getScrollbarHeight(): number {
    // Tạo một thẻ div ẩn để đo scrollbar
    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    // Kích hoạt thanh cuộn
    div.style.overflow = 'scroll';
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
