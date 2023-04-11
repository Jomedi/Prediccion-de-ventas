import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackUserComponent } from './feedback-user.component';

describe('FeedbackUserComponent', () => {
  let component: FeedbackUserComponent;
  let fixture: ComponentFixture<FeedbackUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackUserComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
