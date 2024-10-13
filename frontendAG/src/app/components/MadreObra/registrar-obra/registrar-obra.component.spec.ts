import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarObraComponent } from './registrar-obra.component';

describe('RegistrarObraComponent', () => {
  let component: RegistrarObraComponent;
  let fixture: ComponentFixture<RegistrarObraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrarObraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarObraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
