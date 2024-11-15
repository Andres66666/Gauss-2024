import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionReportesMantenimientosComponent } from './generacion-reportes-mantenimientos.component';

describe('GeneracionReportesMantenimientosComponent', () => {
  let component: GeneracionReportesMantenimientosComponent;
  let fixture: ComponentFixture<GeneracionReportesMantenimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionReportesMantenimientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionReportesMantenimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
