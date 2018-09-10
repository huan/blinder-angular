import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadPhotoComponent } from './download-photo.component';

describe('DownloadPhotoComponent', () => {
  let component: DownloadPhotoComponent;
  let fixture: ComponentFixture<DownloadPhotoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadPhotoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadPhotoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
