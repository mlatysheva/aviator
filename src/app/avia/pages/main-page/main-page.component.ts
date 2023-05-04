import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { AviaService } from '../../services/avia.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(
    public authService: AuthService,
    private aviaService: AviaService
  ) {}

  ngOnInit(): void {
    this.aviaService.isSearchSubmitted$.next(false);
  }
}
