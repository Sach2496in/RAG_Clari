import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, lastValueFrom, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleAPIService {

  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();

  // ✅ Runtime API base URL (from index.html)
  private apiBaseUrl: string = (window as any).__env?.API_BASE_URL;

  public loading: boolean = false;

  constructor(private http: HttpClient) {
    if (!this.apiBaseUrl) {
      console.error('API_BASE_URL is not defined. Check index.html runtime config.');
    }
  }

  sendMessage(message: string) {
    this.messageSource.next(message);
  }

  // ✅ Correct API URL
  private apiUrl = `${this.apiBaseUrl}/query`;

  getPosts(): Observable<any> {
    this.loading = true;
    return this.http.get(this.apiUrl).pipe(
      finalize(() => (this.loading = false))
    );
  }

  async postData(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const payload = {
      message: data
    };

    try {
      const response = await lastValueFrom(
        this.http.post<any>(this.apiUrl, payload, { headers })
      );
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }

  async postDataforUpdate(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    try {
      const response = await lastValueFrom(
        this.http.post<any>(this.apiUrl, data, { headers })
      );
      console.log('Response:', response);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
}
