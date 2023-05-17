import { Component, OnDestroy, OnInit } from '@angular/core';
import { AviaService } from '../../../avia/services/avia.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isSubmitted = false;

  constructor(public aviaService: AviaService) {}

  ngOnInit() {
    this.aviaService.isSearchSubmitted$.subscribe(
      (isSubmitted) => (this.isSubmitted = isSubmitted)
    );
  }
  ngOnDestroy() {
    this.aviaService.isSearchSubmitted$.unsubscribe();
  }
}
