interface ProfileHistory {
  uid: string;
  avatar: string;
  name: string;
  createdAt: number;
  updatedAt: number;
}

interface FaceLocation {
  h: number;
  w: number;
  x: number;
  y: number;
}

interface Face {
  _id: string;
  name: string;
  location: FaceLocation;
  profileHistory: [ProfileHistory];
  distance: number;
  imageData: string;
  tags: [string];
}

interface Me {
  _id: string;
  isFollowWechat: boolean;
  isVip: boolean;
  vipExpiredAt: number;
}

export class Photo {
 _id: string;
 url: string;
 width: number;
 height: number;
 faces: [Face];
 filesize: number;
 me: Me;
 privateTags: any;
}
