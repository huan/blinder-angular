export const renderCanvasContent = (ctx, photo, colorMap, zip, removeBrand, cb) => {
  const bgImgSrc = photo.url;
  const faceLocations = photo.faces;

  const hasTagsItems = [];
  for (let i = 0; i < faceLocations.length; i++) {
    const item = faceLocations[i];
    if (item.tags && item.tags.length > 0) {
      hasTagsItems.push({
        name: item.name,
        avatar: item.imageData,
        tags: item.tags
      })
    }
  }
  let tagBoxHeight = 0;
  if (hasTagsItems.length > 0) {
    tagBoxHeight = 60 * hasTagsItems.length + 20;
  }
  const bgImg = new Image();
  // bgImg.crossOrigin = 'Anonymous';
  // bgImg.setAttribute('crossOrigin', 'anonymous');
  bgImg.src = bgImgSrc;
  if (zip && photo.width && photo.width > 1600) {
    console.log('work here')
    bgImg.src = bgImgSrc + '!medium_1600';
  }
  const charLen = (text) => {
    const r = /[^\x00-\xff]/g;
    return text.replace(r, 'mm').length;
  }
  bgImg.onload = function () {
    let radius = photo.width / photo.height;
    let canvasWidth = photo.width;
    if (photo.width > 1600) {
      canvasWidth = 1600;
    }
    let photoHeight = canvasWidth / radius;
    let qrcodeSize = 80;
    let gap = 10;
    let logoFs = 18;

    if (!zip) {
      radius = 1;
      canvasWidth = photo.width;
      photoHeight = photo.height;
    }
    if (canvasWidth > 1600) {
      qrcodeSize = Math.ceil(canvasWidth / 10);
      logoFs = Math.ceil(0.0225 * canvasWidth);
      gap = Math.ceil(logoFs * 5 / 9)
    }
    let canvasHeight = photoHeight + tagBoxHeight;
    if (!removeBrand) {
      canvasHeight = photoHeight + qrcodeSize + gap
    }
    ctx.drawImage(this, 0, 0, canvasWidth, photoHeight);



    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    let scale = canvasWidth / photo.width;
    if (!zip) {
      scale = 1;
    }

    for (let i = 0; i < faceLocations.length; i++) {
      const item = faceLocations[i];

      // ctx.fillStyle = '#1ab394';
      ctx.fillStyle = colorMap[item._id];
      const fontSize = Math.floor(item.location.w * 0.12 + 8);
      ctx.font = fontSize + 'px 微软雅黑';
      ctx.globalAlpha = 0.6;
      const sinCharLen = fontSize * 0.5
      let title = `${i + 1}. ${item.name}`;
      if (item.name === '未命名') {
        title = `${i + 1}`;
      }
      if (zip) {
        title = item.name;
      }
      const boxWidth = Math.floor(charLen(title) * sinCharLen + sinCharLen * 1.5);
      const boxHeight = Math.floor(sinCharLen * 3);
      // const hasTags = item.tags && item.tags.length>0? true: false;

      ctx.fillRect((item.location.x + item.location.w / 2) * scale - boxWidth / 2, item.location.y * scale - boxHeight, boxWidth, boxHeight)
      ctx.fillStyle = '#fff'; // 文字颜色
      ctx.globalAlpha = 1;
      ctx.fillText(title, (item.location.x + item.location.w / 2) * scale, item.location.y * scale - boxHeight);
    }
    // 品牌信息
    // if (!removeBrand) {
    //   // 品牌信息
    //   ctx.textBaseline = 'middle';
    //   ctx.textAlign = 'left';
    //   ctx.fillStyle = '#f5f5f5';
    //   ctx.font = `${logoFs}px Microsoft YaHei`;
    //   ctx.globalAlpha = 1;
    //   ctx.fillRect(0, canvasHeight - qrcodeSize - gap + tagBoxHeight, canvasWidth, qrcodeSize + gap);
    //   ctx.fillStyle = '#999';
    //   ctx.fillText('脸盲助手，您身边的智能认人助手!', qrcodeSize + 2 * gap, canvasHeight - qrcodeSize + 2 * gap + tagBoxHeight)
    //   ctx.fillText('长按识别二维码，告别脸盲。', qrcodeSize + 2 * gap, canvasHeight - qrcodeSize + 5 * gap + tagBoxHeight)
    //   const qrcode = new Image();
    //   qrcode.onload = function () {
    //     ctx.drawImage(qrcode, gap, canvasHeight - qrcodeSize - gap / 2 + tagBoxHeight, qrcodeSize, qrcodeSize);
    //     cb()
    //   }
    //   qrcode.src = '/qrcode.jpg';
    // } else {
    //   cb();
    // }
    cb();
  }
}

export const filterSubmit = (defaultForm, faceMap, oj) => {
  const shouldUpdateArr = [];
  const shouldUpdateId = [];
  const keys = Object.keys(oj);
  const idMap = {};
  const newFaces = [];
  for (let i = 0; i < keys.length; i++) {

    let nName = '未命名';
    let tags: any = '';
    let id = '';

    if (keys[i].startsWith('tags_')) {
      const tagKeyArr = keys[i].split('tags_');
      id = tagKeyArr[1];
      tags = oj[keys[i]];
      if (tags) {
        tags = tags.split(',');
        if (tags.length === 1) {
          tags = tags[0].split('，')
        }
      } else {
        tags = []
      }

      nName = oj[id] || defaultForm[id] || '未命名';

      if (!idMap[id]) {
        idMap[id] = true
        newFaces.push({
          ...faceMap[id],
          name: nName,
          tags: tags
        })
      }

    } else {
      id = keys[i];

      nName = oj[id] || defaultForm[id] || '未命名';

      if (!idMap[id]) {
        idMap[id] = true;
        tags = oj['tags_' + id];
        if (tags) {
          tags = tags.split(',');
          if (tags.length === 1) {
            tags = tags[0].split('，')
          }
        } else {
          tags = []
        }

        newFaces.push({
          ...faceMap[id],
          name: nName || '未命名',
          tags: tags
        })
      }
    }
    if (
      (nName !== '未命名' && nName !== defaultForm[id])
      || (tags && (tags.join(',') !== defaultForm['tags_' + id]))
    ) {
      if (shouldUpdateId.indexOf(id) === -1) {
        shouldUpdateArr.push({
          _id: id, name: nName, tags: tags
        })
        shouldUpdateId.push(id)
      }
    }
  }
  return {
    shouldUpdateArr,
    newFaces
  }
}
