import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSolicitudesComponent } from './registrar-solicitudes.component';

describe('RegistrarSolicitudesComponent', () => {
  let component: RegistrarSolicitudesComponent;
  let fixture: ComponentFixture<RegistrarSolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarSolicitudesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
