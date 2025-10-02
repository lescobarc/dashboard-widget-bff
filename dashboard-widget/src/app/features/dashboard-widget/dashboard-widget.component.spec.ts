import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DashboardWidgetComponent } from './dashboard-widget.component';
import { DashboardWidgetService } from '../../core/services/dashboard-widget.service';
import { DashboardWidgetData } from '../../core/models/dashboard-widget.model';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DashboardWidgetComponent', () => {
  let component: DashboardWidgetComponent;
  let fixture: ComponentFixture<DashboardWidgetComponent>;
  let mockService: jasmine.SpyObj<DashboardWidgetService>;

  const mockData: DashboardWidgetData = {
    city: 'Santiago',
    weather: {
      description: 'cielo claro',
      temperature: 25.3,
      icon: '01d'
    },
    bitcoin: {
      usd: 68000.12
    }
  };

  beforeEach(waitForAsync(() => {
    mockService = jasmine.createSpyObj('DashboardWidgetService', ['getWidgetData']);
    TestBed.configureTestingModule({
      imports: [DashboardWidgetComponent, CommonModule, HttpClientTestingModule],
      providers: [
        { provide: DashboardWidgetService, useValue: mockService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardWidgetComponent);
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe cargar datos correctamente', () => {
    mockService.getWidgetData.and.returnValue(of(mockData));
    component.fetchData('Santiago');
    fixture.detectChanges();
    expect(component.data).toEqual(mockData);
    expect(component.error).toBeNull();
    expect(component.loading).toBe(false);
  });

  it('debe manejar errores al cargar datos', () => {
    mockService.getWidgetData.and.returnValue(throwError(() => ({ error: { error: 'Error de API' } })));
    component.fetchData('Santiago');
    fixture.detectChanges();
    expect(component.data).toBeNull();
    expect(component.error).toBe('Error de API');
    expect(component.loading).toBe(false);
  });

  it('debe retornar la URL del icono del clima', () => {
    const icon = '01d';
    const url = component.getWeatherIconUrl(icon);
    expect(url).toBe('https://openweathermap.org/img/wn/01d@2x.png');
  });
});
