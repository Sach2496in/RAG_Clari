import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SampageComponent } from './sampage.component';

describe('SampageComponent', () => {
  let component: SampageComponent;
  let fixture: ComponentFixture<SampageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SampageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SampageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
