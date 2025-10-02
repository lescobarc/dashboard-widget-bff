import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardWidgetData } from '../models/dashboard-widget.model';

@Injectable({ providedIn: 'root' })
export class DashboardWidgetService {
  private readonly apiUrl = 'http://localhost:3000/api/dashboard-widget';

  constructor(private http: HttpClient) {}

  getWidgetData(city: string): Observable<DashboardWidgetData> {
    return this.http.get<DashboardWidgetData>(`${this.apiUrl}?city=${encodeURIComponent(city)}`);
  }
}
