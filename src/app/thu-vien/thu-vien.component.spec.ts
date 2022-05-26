import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThuVienComponent } from './thu-vien.component';

describe('ThuVienComponent', () => {
  let component: ThuVienComponent;
  let fixture: ComponentFixture<ThuVienComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThuVienComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThuVienComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
