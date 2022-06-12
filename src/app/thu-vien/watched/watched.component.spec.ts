import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchedComponent } from './watched.component';

describe('WatchedComponent', () => {
  let component: WatchedComponent;
  let fixture: ComponentFixture<WatchedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WatchedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
