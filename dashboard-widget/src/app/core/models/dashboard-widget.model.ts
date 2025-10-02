export interface Weather {
  description: string;
  temperature: number;
  icon: string;
}

export interface Bitcoin {
  usd: number;
}

export interface DashboardWidgetData {
  city: string;
  weather: Weather;
  bitcoin: Bitcoin;
}
