import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';


const serialize = (obj) => {
  return Object.keys(obj).map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`).join('&');
};

@Injectable({
  providedIn: 'root'
})
export class WeixinService {
  private base = 'http://blinder.hui51.cn';
  constructor(
    private http: HttpClient
  ) { }
  // 初始化
  initJSSDK() {
    const url = window.location.href.split('#')[0]
    return this.http.post<any>(this.base + '/api/weixin/initJssdk', serialize({url}), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'})
    }).pipe(
      tap(({ data, statusCode }) => {
        if (statusCode === 200) {
          console.log('get data', data);
          const apis = ['onMenuShareTimeline', 'onMenuShareAppMessage', 'onMenuShareQQ',
            'onMenuShareWeibo', 'onMenuShareQZone', 'previewImage', 'chooseWXPay']
          if (window['wx']) {
            window['wx'].config({
              debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
              appId: data.appId, // 必填，公众号的唯一标识
              timestamp: data.timestamp, // 必填，生成签名的时间戳
              nonceStr: data.nonceStr, // 必填，生成签名的随机串
              signature: data.signature, // 必填，签名，见附录1
              jsApiList: apis,
            })
          }
        }
      }),
      catchError(this.handleError<any>('weixin init'))
    );
  }
  /**
  * Handle Http operation that failed.
  * Let the app continue.
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
