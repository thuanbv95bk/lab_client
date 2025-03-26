import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Vehicle } from '../model/vehicle/vehicle.model';

// interface SelectItem {
//   id: number;
//   code: string;
//   name: string;
// }

@Component({
  selector: 'app-multi-select',
  templateUrl: './multi-select.component.html',
  styleUrls: ['./multi-select.component.scss'],
})
export class MultiSelectComponent implements OnInit {
  // @Input() options: string[] = [];
  @Input() vehicles: Vehicle[] = [];
  @Input() placeholder: string = 'Select';
  @Input() search: boolean = true;
  @Input() selectAll: boolean = true;
  @Input() maxItems: number = 3;

  @Output() selectedChange = new EventEmitter<Vehicle[]>();

  @ViewChild('searchInput') searchInput!: ElementRef;

  selectedItems: Vehicle[] = [];
  filteredItems: Vehicle[] = [];
  searchQuery: string = '';
  isOpen: boolean = false;
  allSelected: boolean = false;

  constructor(private elementRef: ElementRef) {}
  ngOnInit(): void {
    this.filteredItems = this.vehicles;
  }

  ngAfterViewInit() {
    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.filterList();
      setTimeout(() => {
        if (this.searchInput) {
          this.searchInput.nativeElement.focus();
        }
      }, 0);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(target)) {
      this.isOpen = false;
    }
  }

  filterList() {
    this.filteredItems = this.vehicles.filter((item) =>
      item.code.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  toggleList(item: Vehicle) {
    const index = this.selectedItems.indexOf(item);
    if (index === -1) {
      if (this.selectedItems.length < this.maxItems) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems.splice(index, 1);
    }
    this.selectedChange.emit(this.selectedItems);
    this.allSelected = this.selectedItems.length === this.vehicles.length;
  }

  removeItem(item: Vehicle) {
    const index = this.selectedItems.indexOf(item);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedChange.emit(this.selectedItems);
    }
    this.allSelected = this.selectedItems.length === this.vehicles.length;
  }

  toggleSelectAll() {
    if (this.allSelected) {
      this.selectedItems = [...this.vehicles];
    } else {
      this.selectedItems = [];
    }
    this.selectedChange.emit(this.selectedItems);
  }

  isSelected(item: Vehicle): boolean {
    return this.selectedItems.includes(item);
  }

  getDisplayText(): string {
    if (this.allSelected == true) {
      return `Tất cả (${this.vehicles.length})`;
    }
    if (this.selectedItems.length == 0) return '';
    return `${this.selectedItems.length} xe được chọn`;
  }
}
