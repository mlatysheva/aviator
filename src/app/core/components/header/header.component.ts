import { Component } from '@angular/core';
import { AviaService } from '../../../avia/services/avia.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public isSubmitted = false;

  constructor(public aviaService: AviaService) {
    this.aviaService.isSearchSubmitted$.subscribe(
      (isSubmitted) => (this.isSubmitted = isSubmitted)
    );
  }
}
