import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneracionReportesObrasComponent } from './generacion-reportes-obras.component';

describe('GeneracionReportesObrasComponent', () => {
  let component: GeneracionReportesObrasComponent;
  let fixture: ComponentFixture<GeneracionReportesObrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneracionReportesObrasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneracionReportesObrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
