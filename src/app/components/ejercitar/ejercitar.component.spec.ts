import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjercitarComponent } from './ejercitar.component';

describe('EjercitarComponent', () => {
  let component: EjercitarComponent;
  let fixture: ComponentFixture<EjercitarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EjercitarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjercitarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
