import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBankingAccountComponent } from './add-banking-account.component';

describe('AddBankingAccountComponent', () => {
  let component: AddBankingAccountComponent;
  let fixture: ComponentFixture<AddBankingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBankingAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBankingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
