import { Injectable } from '@angular/core';
import { LocationEnum } from '../../common/model/enum/location.enum';
import { Vehicle } from '../../common/model/enum/vehicle.model';
import { DoughnutModel } from '../../common/chart-items/dashboard-doughnut/dashboard-doughnut.component';

/**
 * Injectable Sinh dữ liệu xe, theo radom,
 * số lương xe sinh ra bằng tổng value của companyList
 */
@Injectable({
  providedIn: 'root',
})
export class VehicleDataService {
  private vehicleList: Vehicle[] = [];
  private idCounter = 1;

  private companyList = [
    { label: '504', value: 40 },
    { label: 'Anh Minh', value: 40 },
    { label: 'Anh Bữu, Đại đồng, Đại Lộc', value: 40 },
    { label: 'Anh Lợi Tĩnh', value: 40 },
    { label: 'An Phú Tải', value: 50 },
    { label: 'Anh Bữu (giác trầm, làm hương)', value: 40 },
    { label: 'Bãi 1/4 VSC Quy nhơn', value: 20 },
    { label: 'Bãi contemner chân thật', value: 10 },
    { label: 'Bãi contemner Công ty Hoàng Bão Anh', value: 30 },
    { label: 'Bãi contemner Hoàng Bão Anh', value: 60 },
    { label: 'Bãi contemner Hoàng Bão Anh (KCN BPA)', value: 40 },
    { label: 'Bãi dăm bạch đàn', value: 30 },
    { label: 'Bãi X50', value: 50 },
    { label: 'Bãi xe 223 Trường Chính (trả hàng)', value: 40 },
    { label: 'Cty Sedovina (trang thiết bị trường học)', value: 2 },
    { label: 'Keyhinge Hòa Cầm', value: 1 },
    { label: 'Sợi Phú Nam', value: 1 },
    { label: 'Sợi Thiên phú', value: 3 },
    { label: 'Vinaco next', value: 13 },
  ];

  private locations = Object.values(LocationEnum);

  constructor() {
    this.generateVehicles();
  }

  public generateVehicles(): void {
    for (const company of this.companyList) {
      for (let i = 0; i < company.value; i++) {
        const vehicle = {
          id: this.idCounter++,
          code: `43C${(0 + this.idCounter).toString().padStart(5, '0')}_C`,
          isLoaded: Math.random() < 0.6,
          location:
            this.locations[Math.floor(Math.random() * this.locations.length)],
          company: company.label,
        };
        this.vehicleList.push(vehicle);
      }
    }
  }

  /**
   * Gets vehicles
   * @returns vehicles danh sách xe
   */
  getVehicles(): Vehicle[] {
    this.vehicleList = [];
    this.generateVehicles();
    return this.vehicleList;
  }

  /**
   * Gets company summary
   * @description Tính toán, tổng hợp số lượng xe dựa trên địa điểm công ty của nó
   * @param data
   * @returns company summary
   */
  getCompanySummary(data: any): any[] {
    // kiểm tra dữ liệu đầu vào
    const factoryVehicles = data || [];

    //  trường hợp mảng rỗng
    const companyCounts = (factoryVehicles as any[]).reduce(
      (acc: { [key: string]: number }, vehicle) => {
        if (vehicle?.company) {
          //  Kiểm tra tồn tại vehicle
          acc[vehicle.company] = (acc[vehicle.company] || 0) + 1;
        }
        return acc;
      },
      {}
    );

    return Object.entries(companyCounts).map(([key, value]) => ({
      key,
      value: value as number,
    }));
  }

  /**
   * Gets summary
   * @description tính toán số lượng xe: có hàng, không có hàng, theo tiêu chí vị trí
   * @param data
   * @param locationEnum
   * @returns summary VehicleLoaded[]
   */
  getDataToDoughnut(data: Vehicle[], locationEnum: string): DoughnutModel[] {
    // kiểm tra dữ liệu đầu vào
    let res: DoughnutModel[] = [];
    const emptyVehicles = {
      key: 'Phương tiện không hàng',
      value: data.filter(
        (x) => x.isLoaded == false && x.location == locationEnum
      ).length,
    };
    const loadedVehicles = {
      key: 'Phương tiện có hàng',
      value: data.filter(
        (x) => x.isLoaded == true && x.location == locationEnum
      ).length,
    };

    res.push(loadedVehicles);
    res.push(emptyVehicles);

    return res;
  }
}
