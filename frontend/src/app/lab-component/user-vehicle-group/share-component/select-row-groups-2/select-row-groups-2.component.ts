import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { Groups } from '../../model/groups';
@Component({
  selector: 'app-select-row-groups-2',
  templateUrl: './select-row-groups-2.component.html',
  styleUrls: ['./select-row-groups-2.component.scss'],
})
export class SelectRowGroups2Component implements OnInit, AfterViewInit, OnChanges {
  @Input()
  attribute!: Groups;

  @Input() allSelected: boolean = false;
  @Output() selectedChange = new EventEmitter<Groups>();

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // this.toggleSelectAll();
  }
  ngOnChanges(changes: SimpleChanges): void {
    // console.log('data');
    // if (changes['data']) {
    //   this.toggleSelectAll();
    // }
  }
  ngAfterViewInit(): void {
    this.cdRef.detectChanges(); // ✅ ép Angular kiểm tra lại
  }

  /**
   * Toggles select all
   * @description chọn/ bỏ chọn check all
   * emit sự kiện ra ngoài: trả về danh sách
   */
  toggleSelectAll() {
    if (this.allSelected) {
      this.attribute.allComplete = true;
      this.attribute.isSelected = true;
      this.attribute.groupsChild.forEach((x) => (x.isSelected = true));
    } else {
      this.attribute.allComplete = false;
      this.attribute.isSelected = false;
      this.attribute.groupsChild.forEach((x) => (x.isSelected = false));
    }
    this.attribute.isUiCheck = this.allSelected;
    this.selectedChange.emit(this.attribute);
  }

  isExpandAll = false;
  paddingLevel(item: Groups) {
    if (item.parentVehicleGroupId) {
      return 'padding-' + (item.level - 1);
    }
    return 'padding-0';
  }
  //-----------------------------------------------------------------------------------//
  updateAllComplete(Attribute: Groups) {
    Attribute.allComplete = Attribute.groupsChild != null && Attribute.groupsChild.every((t) => t.isSelected);
    this.attribute.isSelected = Attribute.allComplete;
  }

  someComplete(node: Groups): boolean {
    if (node.groupsChild == null) {
      return false;
    }

    return node.groupsChild.filter((t) => t.isSelected).length > 0 && !node.allComplete;
  }
  onCheckboxChange(event: Event, item: Groups): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    item.isSelected = isChecked;
    this.changeEditNode(isChecked, item);
    if (this.attribute.groupsChild.length == 1) this.attribute.isSelected = isChecked;
    this.attribute.isUiCheck = isChecked;
    this.selectedChange.emit(this.attribute);
  }
  changeEditNode(checked: boolean, Attribute: Groups) {
    Attribute.allComplete = checked;
    Attribute.isSelected = checked;
    if (Attribute.groupsChild == null) {
      return;
    }
    Attribute.groupsChild.forEach((t) => (t.isSelected = checked));
  }

  toggleVisibility(attribute: Groups) {
    attribute.isHideChildren = !attribute.isHideChildren; // Mở hoặc đóng
  }
}
