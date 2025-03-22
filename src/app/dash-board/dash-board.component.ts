import { Component, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dash-board',
  templateUrl: './dash-board.component.html',
  styleUrl: './dash-board.component.scss',
})
export class DashBoardComponent {
  itemList1 = [
    { id: 1, code: '43C01338_C' },
    { id: 2, code: '43C01339_C' },
    { id: 3, code: '43C01340_C' },
  ];
  itemList = [
    { id: 1, code: 'A01', name: 'Hà Nội' },
    { id: 2, code: 'A02', name: 'Hồ Chí Minh' },
    { id: 3, code: 'A03', name: 'Đà Nẵng' },
    { id: 4, code: 'A04', name: 'Hải Phòng' },
  ];

  listWidthWidget = [
    {
      id: 1,
      name: 'Độ rộng',
      children: [
        { id: 2, name: 'Tự động' },
        { id: 3, name: 'Nhỏ' },
        { id: 4, name: 'Trung bình' },
        { id: 5, name: 'Lớn' },
      ],
    },
  ];

  chartValues = [
    { label: 'Cty Sedovina (trang thiết bị trường học)', value: 2 },
    { label: 'Keyhinge Hòa Cầm', value: 1 },
    { label: 'Sợi Phú Nam', value: 1 },
    { label: 'Sợi Thiên phú', value: 3 },
  ];

  onSelectionChange(selectedItem: any) {
    console.log('Đã chọn:', selectedItem);
  }

  @ViewChild('chart1') chart1!: ElementRef;
  @ViewChild('chart2') chart2!: ElementRef;
  @ViewChild('chart3') chart3!: ElementRef;
  @ViewChild('chart4') chart4!: ElementRef;
  isVisible: boolean = true;
  constructor() {}

  ngAfterViewInit(): void {
    // this.createChart(this.chart1.nativeElement);
    // this.createChart(this.chart2.nativeElement);
    // this.createChart(this.chart3.nativeElement);
    // this.createChart(this.chart4.nativeElement, 'bar');
  }

  createChart(canvas: HTMLCanvasElement, type: string = 'doughnut') {
    // new Chart();
  }

  // Biểu đồ cột
  chartData = [{ data: [65, 59, 80, 81, 56, 55, 40], label: 'Doanh thu' }];
  chartLabels = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
  ];

  // Biểu đồ tròn
  pieChartData = [
    {
      data: [300, 500, 100],
      backgroundColor: ['#FF7360', '#6FC8CE', '#FAFFF2'],
    },
  ];
  pieChartLabels = ['Sản phẩm A', 'Sản phẩm B', 'Sản phẩm C'];

  // Cấu hình chung
  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  onSelectedChange(selectedItems: any) {
    console.log('Mục đã chọn:', selectedItems);
  }
  toggleContent() {
    this.isVisible = !this.isVisible;
  }
}
