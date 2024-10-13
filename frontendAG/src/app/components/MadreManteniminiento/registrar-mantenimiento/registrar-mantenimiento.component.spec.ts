import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarMantenimientoComponent } from './registrar-mantenimiento.component';

describe('RegistrarMantenimientoComponent', () => {
  let component: RegistrarMantenimientoComponent;
  let fixture: ComponentFixture<RegistrarMantenimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarMantenimientoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarMantenimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
