import { Component } from '@angular/core';
import { DashboardWidgetComponent } from './features/dashboard-widget/dashboard-widget.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [DashboardWidgetComponent],
  template: `<dashboard-widget></dashboard-widget>`
})
export class App {}
