import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContenidosMat1mComponent } from './contenidos-mat1m.component';

describe('ContenidosMat1mComponent', () => {
  let component: ContenidosMat1mComponent;
  let fixture: ComponentFixture<ContenidosMat1mComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContenidosMat1mComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContenidosMat1mComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
