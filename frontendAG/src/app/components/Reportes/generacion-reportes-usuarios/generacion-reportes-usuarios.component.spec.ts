import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionReportesUsuariosComponent } from './generacion-reportes-usuarios.component';

describe('GeneracionReportesUsuariosComponent', () => {
  let component: GeneracionReportesUsuariosComponent;
  let fixture: ComponentFixture<GeneracionReportesUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionReportesUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionReportesUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
