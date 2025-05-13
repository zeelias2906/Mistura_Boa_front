import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecoRegisterComponent } from './endereco-register.component';

describe('EnderecoRegisterComponent', () => {
  let component: EnderecoRegisterComponent;
  let fixture: ComponentFixture<EnderecoRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EnderecoRegisterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnderecoRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
