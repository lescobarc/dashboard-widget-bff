import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DashboardWidgetService } from '../../core/services/dashboard-widget.service';
import { DashboardWidgetData } from '../../core/models/dashboard-widget.model';

@Component({
  selector: 'dashboard-widget',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.scss']
})
export class DashboardWidgetComponent implements OnInit {
  loading = false;
  error: string | null = null;
  data: DashboardWidgetData | null = null;

  constructor(private widgetService: DashboardWidgetService) {}

  ngOnInit(): void {
    this.fetchData('Santiago');
  }

  fetchData(city: string): void {
    this.loading = true;
    this.error = null;
    this.data = null;
    this.widgetService.getWidgetData(city).subscribe({
      next: (res) => {
        this.data = res;
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.error || 'Error al obtener datos del widget';
        this.loading = false;
      }
    });
  }

  getWeatherIconUrl(icon: string): string {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  }
}
