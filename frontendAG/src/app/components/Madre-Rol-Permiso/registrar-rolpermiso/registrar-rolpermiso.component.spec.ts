import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarRolpermisoComponent } from './registrar-rolpermiso.component';

describe('RegistrarRolpermisoComponent', () => {
  let component: RegistrarRolpermisoComponent;
  let fixture: ComponentFixture<RegistrarRolpermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarRolpermisoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarRolpermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
