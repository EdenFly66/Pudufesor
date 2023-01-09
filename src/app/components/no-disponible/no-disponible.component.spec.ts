import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDisponibleComponent } from './no-disponible.component';

describe('NoDisponibleComponent', () => {
  let component: NoDisponibleComponent;
  let fixture: ComponentFixture<NoDisponibleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDisponibleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDisponibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
