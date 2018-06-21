import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Employee } from '../models/employee';

@Injectable()
export class EmployeeService {

  httpHeaders = new HttpHeaders({'Content-Type': 'application/json; charset=utf-8'});
  baseUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<any> {
    return this.http.get(this.baseUrl + 'employees/', this.getAuthHeaders());
  }


  getEmployeebyid(id: number): Observable<any> {
    console.log("employebyid" + this.baseUrl + 'employees/' + id + '/', this.getAuthHeaders());
    return this.http.get(this.baseUrl + 'employees/' + id + '/', this.getAuthHeaders());
  }

  addEmployee(employee: Employee, ): Observable<any> {
    return this.http.post(this.baseUrl + 'employees/', employee, this.getAuthHeaders());
  }
  addEmployeebyid(employee: Employee, id: number): Observable<any> {
    return this.http.put(this.baseUrl + 'employees/'+ id + '/', employee, this.getAuthHeaders());
  }

  editEmployee(employee: Employee, id: number): Observable<any> {
    return this.http.put(this.baseUrl + 'employees/' + id + '/', employee, this.getAuthHeaders());
  }
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(this.baseUrl + 'employees/' + id + '/', this.getAuthHeaders());
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    const httpHeaders = new HttpHeaders(
      {'Content-Type': 'application/json; charset=utf-8',
      'Authorization': 'Token ' + token});
    return { headers: httpHeaders};
  }

}
