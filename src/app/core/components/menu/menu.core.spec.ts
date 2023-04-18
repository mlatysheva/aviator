import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuCore } from './menu.core';

describe('MenuCore', () => {
  let component: MenuCore;
  let fixture: ComponentFixture<MenuCore>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuCore ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuCore);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
