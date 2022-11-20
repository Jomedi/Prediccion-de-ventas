import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdministrateComponent } from './administrate.component';

describe('AdministrateComponent', () => {
  let component: AdministrateComponent;
  let fixture: ComponentFixture<AdministrateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministrateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
