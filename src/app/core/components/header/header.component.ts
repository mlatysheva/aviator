import { Component, OnDestroy, OnInit } from '@angular/core';
import { AviaService } from '../../../avia/services/avia.service';
import { TRIP_ID } from '../../../constants/localStorage';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public changeStyle = false;

  constructor(public aviaService: AviaService) {}

  ngOnInit() {
    this.aviaService.changeHeaderStyle$.subscribe(
      (changeStyle) => (this.changeStyle = changeStyle)
    );
  }
  ngOnDestroy() {
    this.aviaService.changeHeaderStyle$.unsubscribe();
  }

  onLogoClick() {
    localStorage.removeItem(TRIP_ID);
  }
}
