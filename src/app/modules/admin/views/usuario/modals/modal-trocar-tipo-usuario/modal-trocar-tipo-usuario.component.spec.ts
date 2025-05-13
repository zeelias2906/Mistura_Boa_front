import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTrocarTipoUsuarioComponent } from './modal-trocar-tipo-usuario.component';

describe('ModalTrocarTipoUsuarioComponent', () => {
  let component: ModalTrocarTipoUsuarioComponent;
  let fixture: ComponentFixture<ModalTrocarTipoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTrocarTipoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTrocarTipoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
