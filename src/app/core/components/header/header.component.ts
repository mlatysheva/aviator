import { Component } from '@angular/core';
import { AviaService } from 'src/app/avia/services/avia.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(public aviaService: AviaService) {}
}
