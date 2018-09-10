import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhotoMarkComponent } from './photo-mark.component';

describe('PhotoMarkComponent', () => {
  let component: PhotoMarkComponent;
  let fixture: ComponentFixture<PhotoMarkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhotoMarkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhotoMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
