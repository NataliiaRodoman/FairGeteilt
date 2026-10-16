import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageStart } from './page-start';

describe('PageStart', () => {
  let component: PageStart;
  let fixture: ComponentFixture<PageStart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageStart],
    }).compileComponents();

    fixture = TestBed.createComponent(PageStart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
