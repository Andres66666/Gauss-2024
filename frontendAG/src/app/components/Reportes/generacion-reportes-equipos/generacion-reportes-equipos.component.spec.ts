import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionReportesEquiposComponent } from './generacion-reportes-equipos.component';

describe('GeneracionReportesEquiposComponent', () => {
  let component: GeneracionReportesEquiposComponent;
  let fixture: ComponentFixture<GeneracionReportesEquiposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionReportesEquiposComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionReportesEquiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
