import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from '../../model/admin-user';

@Component({
  selector: 'app-text-search',
  templateUrl: './text-search.component.html',
  styleUrls: ['./text-search.component.scss'],
})
export class TextSearchComponent {
  @Input() placeholder: string;

  searchField: string;
  @Output() searchFieldChange = new EventEmitter<string>();

  /**
   * Changes input
   * emit sự kiên ra ngoài khi ng dùng gõ input
   */
  /**
   * Changes input
   */
  /**
   * Changes input
   * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
   */
  changeInput() {
    this.searchFieldChange.emit(this.searchField);
  }
}
