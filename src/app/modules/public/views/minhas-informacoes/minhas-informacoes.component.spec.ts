import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MinhasInformacoesComponent } from './minhas-informacoes.component';

describe('MinhasInformacoesComponent', () => {
  let component: MinhasInformacoesComponent;
  let fixture: ComponentFixture<MinhasInformacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MinhasInformacoesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MinhasInformacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
