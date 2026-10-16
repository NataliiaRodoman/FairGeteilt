import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageFairRunde } from './page-fair-runde';

describe('PageFairRunde', () => {
  let component: PageFairRunde;
  let fixture: ComponentFixture<PageFairRunde>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageFairRunde],
    }).compileComponents();

    fixture = TestBed.createComponent(PageFairRunde);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
