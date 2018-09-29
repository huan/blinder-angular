import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Photo } from './photo';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MessageService } from './message.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'user ' + window.localStorage['token'] })
};


@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  private base = 'http://blinder.hui51.cn';
  private photoUrl = this.base + '/api/photo';
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  // 获取图片数据
  getPhoto(_id: string): Observable<Photo> {
    const url = `${this.photoUrl}/${_id}`;
    return this.http.get<Photo>(url, httpOptions).pipe(
      tap(_ => this.log(`fetched hero id=${_id}`)),
      catchError(this.handleError<Photo>(`getHero id=${_id}`))
    );
  }
  // 更新图片数据
  fixProfile(profile: {
    _id: string;
    name: string;
    tags: [string];
  }) {
    return this.http.post<any>(this.base + '/api/profile/' + profile._id, profile, httpOptions).pipe(
      tap((result) => this.log(`update profile ${result._id}`)),
      catchError(this.handleError<any>('addHero'))
    );
  }
  // 关注扫码之前发送信息
  followMark(photoId: string) {
    return this.http.post<any>(this.base + '/api/photo/' + photoId + '/followMark', {}, httpOptions).pipe(
      tap(() => this.log(`follow mark ok`)),
      catchError(this.handleError<any>('followMark'))
    );
  }
  // 关注扫码之前发送信息
  markPhoto(photoId: string, addTag: boolean) {
    return this.http.post<any>(this.base + '/api/photo/' + photoId + '/mark', { addTag }, httpOptions).pipe(
      tap(() => this.log(`mark photo ok`)),
      catchError(this.handleError<any>('markPhoto'))
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

      if (error.status === 401) {
        if (window.localStorage.getItem('token')) {
          window.localStorage.removeItem('token');
        }
        const source = window.location.pathname + window.location.search
        const path = `${window.location.protocol}//${window.location.host}/login.html?redirect=${encodeURIComponent(source)}`;
        window.location.href = path;
      }
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`PhotoService: ${message}`);
  }
}
