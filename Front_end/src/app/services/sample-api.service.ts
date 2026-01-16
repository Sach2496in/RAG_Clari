import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, lastValueFrom, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SampleAPIService {


  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();

  sendMessage(message: string) {
    this.messageSource.next(message);
  }
  
  //private apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Sample API URL
  // http://localhost:8000/docs#/default/query_case_query_post
  private apiUrl = 'http://localhost:8000/query'
  //private apiUrlUpdate = 'http://localhost:9000/integrate'
  public loading: boolean = false; 

  constructor(private http: HttpClient) {}

  

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
      const response = await lastValueFrom(this.http.post<any>(this.apiUrl, payload, { headers }));
      console.log("Response:", response);
      return response;  // Returns API response
    } catch (error) {
      console.error("Error:", error);
      throw error;  // Rethrow error for handling
    }
  }

  async postDataforUpdate(data: any): Promise<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    const payload = {
      ...data,  // Keeps original data values
    };
  
    try {
      const response = await lastValueFrom(this.http.post<any>(this.apiUrl, payload, { headers }));
      console.log("Response:", response);
      return response;  // Returns API response
    } catch (error) {
      console.error("Error:", error);
      throw error;  // Rethrow error for handling
    }
  }
  
}
