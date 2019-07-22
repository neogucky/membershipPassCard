import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpressPage } from './impress.page';

describe('ImpressPage', () => {
  let component: ImpressPage;
  let fixture: ComponentFixture<ImpressPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpressPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpressPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
