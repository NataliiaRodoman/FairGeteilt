import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageAusgaben } from './page-ausgaben';

describe('PageAusgaben', () => {
  let component: PageAusgaben;
  let fixture: ComponentFixture<PageAusgaben>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageAusgaben],
    }).compileComponents();

    fixture = TestBed.createComponent(PageAusgaben);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
