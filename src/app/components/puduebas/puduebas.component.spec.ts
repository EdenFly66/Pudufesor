import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PuduebasComponent } from './puduebas.component';

describe('PuduebasComponent', () => {
  let component: PuduebasComponent;
  let fixture: ComponentFixture<PuduebasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PuduebasComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PuduebasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
