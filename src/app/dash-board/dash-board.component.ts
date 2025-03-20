import { Component } from '@angular/core';

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

  listWidthWiget = [
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

  onSelectionChange(selectedItem: any) {
    console.log('Đã chọn:', selectedItem);
  }

  // onSelectedChange(items: any[]) {
  //   this.selectedItems = items;
  //   console.log('Đã chọn:', items);
  // }
  constructor() {}

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
}
