import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from '../../models/subscription.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  subscriptions: Subscription[] = [];
  loading = true;
  stats = {
    total: 0,
    active: 0,
    inactive: 0,
    cancelled: 0
  };

  constructor(
    private subscriptionService: SubscriptionService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.subscriptionService.getSubscriptions().subscribe({
      next: (subscriptions) => {
        this.subscriptions = subscriptions;
        this.calculateStats();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading subscriptions:', error);
        this.loading = false;
      }
    });
  }

  calculateStats(): void {
    this.stats.total = this.subscriptions.length;
    this.stats.active = this.subscriptions.filter(s => s.status === 'active').length;
    this.stats.inactive = this.subscriptions.filter(s => s.status === 'inactive').length;
    this.stats.cancelled = this.subscriptions.filter(s => s.status === 'cancelled').length;
  }
}