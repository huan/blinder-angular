import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PhotoService } from '../photo.service';
import { ActivatedRoute } from '@angular/router';
import { Photo } from '../photo';
import {
  filterSubmit,
  renderCanvasContent,
} from './util';

@Component({
  selector: 'app-photo-mark',
  templateUrl: './photo-mark.component.html',
  styleUrls: ['./photo-mark.component.css']
})
export class PhotoMarkComponent implements OnInit, OnDestroy {
  @Input() photoNameMap: any;
  photo: Photo;
  faceMap: {};
  defaultForm: {};
  isLoad = false;
  rootStyles = {
    overflow: 'hidden',
    height: '667px'
  };
  height = 667;
  width = 375;
  zoom = 1;
  showShare = false;
  showFollow = false;
  isRenderCanvas = false;
  faceHistorys: Array<any> = [];
  faceAvatars: Array<string> = [];
  transformY = 'translateY(0px)';
  rid = 0;
  currentScrollIdx = 0;
  constructor(
    private route: ActivatedRoute,
    private photoService: PhotoService
  ) { }

  ngOnInit() {
    this.getPhoto();
    const height = window.innerHeight;
    this.width = window.innerWidth;
    this.height = height;
    this.rootStyles.height = `${height}px`;
    if (!window.localStorage.getItem('token')) {
      const source = window.location.pathname + window.location.search
      const path = `${window.location.protocol}//${window.location.host}/login.html?redirect=${encodeURIComponent(source)}`;
      window.location.href = path;
    }
  }
  ngOnDestroy() {
    if (this.rid) {
      window.clearInterval(this.rid)
    }
  }
  toggleShare(val) {
    this.showShare = val;
  }
  toggleFollow(val) {
    this.showFollow = val;
  }
  getPhoto(): void {
    const photoId = this.route.snapshot.params['id'];
    // console.log('get photoId', photoId);
    this.photoService.getPhoto(photoId)
      .subscribe(photo => {
        this.setShare(photo);
        this.initPhoto(photo);
        this.isLoad = true;
        this.initFaceHistory(photo);
      });
  }
  async updatePhoto(formVal): Promise<void> {
    const { defaultForm, faceMap, photo } = this;
    const { shouldUpdateArr, newFaces } = filterSubmit(defaultForm, faceMap, formVal);
    if (shouldUpdateArr.length > 0) {
      for (let i = 0; i < shouldUpdateArr.length; i++) {
        try {
          await this.photoService.fixProfile(shouldUpdateArr[i]).subscribe()
          // hasUpdate = true;
        } catch (e) {
          console.log('get fix profile error', e);
        }
      }
      const nPhoto = {
        ...photo,
        faces: newFaces
      }
      this.initPhoto(nPhoto);
    }
  }
  sendPhoto() {
    const { photo } = this;
    if (photo.me.isFollowWechat) {
      this.photoService.markPhoto(photo._id, false).subscribe(result => {
        if (result.statusCode === 200) {
          alert('发送成功，请到脸盲助手服务号中查看：）')
        } else if (result.statusCode === 400) {
          alert('发送失败,原因:' + result.message)
        } else {
          alert('发送失败，原因未知');
        }
      });

    } else {
      // 显示follow wechat的二维码
      this.photoService.followMark(photo._id).subscribe();
      this.showFollow = true;
    }
  }
  initFaceHistory(photo: Photo) {
    const out = [];
    const faceAvatars = [];
    for (let i = 0; i < photo.faces.length; i++) {
      const face = photo.faces[i];
      for (let j = 0; j < face.profileHistory.length; j++) {
        const history: any = face.profileHistory[j];
        if (faceAvatars.indexOf(history.avatar) === -1) {
          faceAvatars.push(history.avatar);
        }
        out.push({
          faceId: face._id,
          name: history.payload.name,
          faceImage: face.imageData,
          uid: history.uid,
          avatar: history.avatar,
          username: history.name,
          updatedAt: history.updatedAt,
        })
      }
    }
    if (out.length > 0) {
      const compare = ((a, b) => {
        return b.updatedAt - a.updatedAt;
      });
      out.sort(compare);
      this.faceHistorys = out;
      this.faceAvatars = faceAvatars;
      // 动态设置translate的值
      const self = this;
      this.rid = window.setInterval(() => {
        const idx = self.currentScrollIdx;
        const len = out.length;
        if (idx < len) {
          const y = 0 - idx * 65;
          this.transformY = `translateY(${y}px)`;
          this.currentScrollIdx = idx + 1;
        } else {
          this.transformY = `translateY(5px)`;
          this.currentScrollIdx = 0;
        }
      }, 2000)
    }
  }
  setShare(photo) {
    const nameArr = [];
    const total = photo.faces.length;
    for (let i = 0; i < total; i++) {
      const face = photo.faces[i];
      if (face.name !== '未命名') {
        nameArr.push(face.name);
      }
    }
    const unNameCount = photo.faces.length - nameArr.length;
    try {
      if (window['setShare']) {
        window['setShare']({
          title: `脸盲助手认出图片有${photo.faces.length}人`,
          desc: nameArr.length === 0 ? `还没认出任何人哦，点此帮忙认人` :
            `已认出${nameArr.splice(0, 5).join(',')}等人，还有${unNameCount}人未命名，点此帮忙认人`,
          link: window.location.href.split('#')[0],
          imgUrl: photo.url + '!shareLogo_100',
        }, () => {
          // share ok
        })
      }
    } catch (e) {
      console.log('get set share error', e)
    }
  }
  initPhoto(photo) {
    this.photo = photo;
    this.isRenderCanvas = true;
    // render canvas
    const colorMap = {};
    let faceSum = 0;
    const faceNameMap = {};
    const faceMap = {};
    const defaultForm = {};
    for (let i = 0; i < photo.faces.length; i++) {
      const face = photo.faces[i];
      const color = `rgb(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;
      colorMap[face._id] = color;
      faceSum += face.location.w;
      faceNameMap[face._id] = face.name;
      faceMap[face._id] = face;
      if (face.name !== '未命名') {
        defaultForm[face._id] = face.name;
      }
      defaultForm['tags_' + face._id] = photo.privateTags[face._id] ? photo.privateTags[face._id].join(',') : '';

    }
    this.defaultForm = defaultForm;
    this.photoNameMap = faceNameMap;
    this.faceMap = faceMap;
    const avgWith = Math.floor(faceSum / photo.faces.length);
    // const zoom: number = avgWith < 90 ? 1 : (90 / avgWith);
    // this.zoom = zoom;
    this.renderCanvas(photo, colorMap, (canvas) => {
      // finish drawing
      const ele = document.getElementById('markBox');
      // 检查是否存在canvas，如果存在，先取出
      ele.appendChild(canvas);
      // 平移到第一个人物的位置上
      if (photo.faces.length > 0) {
        const item = photo.faces[0];
        this.scrollToFace(ele, item);
      }
      this.isRenderCanvas = false
    });
  }
  scrollToFace(ele, item) {
    const width = window.innerWidth;
    const { photo } = this;
    let canvasWidth = photo.width;
    if (canvasWidth > 1600) {
      canvasWidth = 1600;
    }
    const radius = canvasWidth / photo.width;
    const x = (item.location.x + item.location.w / 2) * radius - width / 2
    const y = (item.location.y + item.location.h / 2) * radius - 150
    if (ele && ele.scrollTo && typeof ele.scrollTo === 'function') {
      ele.scrollTo(x, y);
    }
  }
  focusFace(face) {
    const ele = document.getElementById('markBox');
    this.scrollToFace(ele, face);
  }
  renderCanvas(photo, colorMap, cb) {
    const ele = document.getElementById('photoCanvas');
    if (ele) {
      console.log('ele', ele);
      ele.remove();
    }
    const canvas = document.createElement('canvas');
    let radius = 1;
    if (photo.width > 1600) {
      radius = 1600 / photo.width;
    }
    canvas.setAttribute('id', 'photoCanvas');
    canvas.setAttribute('width', (photo.width * radius).toString());
    canvas.setAttribute('height', (photo.height * radius).toString());
    // canvas.style.zoom = zoom;
    const ctx = canvas.getContext('2d');
    renderCanvasContent(ctx, photo, colorMap, true, false, () => {
      cb(canvas)
    })
  }

}



