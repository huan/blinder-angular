import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it(`should have as title '脸盲助手'`, async(() => {
    fixture = TestBed.createComponent(HomeComponent)
    const app = fixture.debugElement.componentInstance
    expect(app.title).toContain('脸盲助手')
  }))
  it('should render title in a h1 tag', async(() => {
    fixture = TestBed.createComponent(HomeComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('h1').textContent).toContain('欢迎使用')
  }))

  it('should render qrcode', async(() => {
    fixture = TestBed.createComponent(HomeComponent)
    fixture.detectChanges()
    const compiled = fixture.debugElement.nativeElement
    expect(compiled.querySelector('img').src).toContain('/assets/qrcode.jpg')
  }))
});
