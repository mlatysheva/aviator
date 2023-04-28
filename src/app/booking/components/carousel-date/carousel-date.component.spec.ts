import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselDateComponent } from './carousel-date.component';

describe('CarouselDateComponent', () => {
  let component: CarouselDateComponent;
  let fixture: ComponentFixture<CarouselDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarouselDateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarouselDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
