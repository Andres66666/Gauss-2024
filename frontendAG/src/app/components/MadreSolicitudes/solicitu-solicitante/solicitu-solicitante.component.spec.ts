import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicituSolicitanteComponent } from './solicitu-solicitante.component';

describe('SolicituSolicitanteComponent', () => {
  let component: SolicituSolicitanteComponent;
  let fixture: ComponentFixture<SolicituSolicitanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicituSolicitanteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicituSolicitanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
