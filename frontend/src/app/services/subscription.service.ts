import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscription, SubscriptionRequest } from '../models/subscription.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  getSubscriptions(filters?: { status?: string; planType?: string }): Observable<Subscription[]> {
    let params = new HttpParams();
    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.planType) {
      params = params.set('planType', filters.planType);
    }

    return this.http.get<Subscription[]>(`${this.apiUrl}/subscriptions`, {
      headers: this.getHeaders(),
      params
    });
  }

  getSubscriptionById(id: number): Observable<Subscription> {
    return this.http.get<Subscription>(`${this.apiUrl}/subscriptions/${id}`, {
      headers: this.getHeaders()
    });
  }

  createSubscription(subscription: SubscriptionRequest): Observable<Subscription> {
    return this.http.post<Subscription>(`${this.apiUrl}/subscriptions`, subscription, {
      headers: this.getHeaders()
    });
  }

  updateSubscription(id: number, subscription: Partial<SubscriptionRequest>): Observable<Subscription> {
    return this.http.put<Subscription>(`${this.apiUrl}/subscriptions/${id}`, subscription, {
      headers: this.getHeaders()
    });
  }

  deleteSubscription(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/subscriptions/${id}`, {
      headers: this.getHeaders()
    });
  }
}