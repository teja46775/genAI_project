import { Component, OnInit } from '@angular/core';
import { SubscriptionService } from '../../services/subscription.service';
import { Subscription } from '../../models/subscription.model';

@Component({
  selector: 'app-subscription-list',
  templateUrl: './subscription-list.component.html',
  styleUrls: ['./subscription-list.component.css']
})
export class SubscriptionListComponent implements OnInit {
  subscriptions: Subscription[] = [];
  filteredSubscriptions: Subscription[] = [];
  loading = true;
  error = '';
  
  filters = {
    status: '',
    planType: ''
  };

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.loadSubscriptions();
  }

  loadSubscriptions(): void {
    this.loading = true;
    this.subscriptionService.getSubscriptions(this.filters).subscribe({
      next: (subscriptions) => {
        console.log('Received subscriptions:', subscriptions);
        this.subscriptions = subscriptions;
        this.filteredSubscriptions = subscriptions;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load subscriptions';
        this.loading = false;
        console.error('Error loading subscriptions:', error);
      }
    });
  }

  applyFilters(): void {
    this.loadSubscriptions();
  }

  clearFilters(): void {
    this.filters = { status: '', planType: '' };
    this.loadSubscriptions();
  }

  deleteSubscription(id: number): void {
    if (confirm('Are you sure you want to delete this subscription?')) {
      this.subscriptionService.deleteSubscription(id).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          this.error = 'Failed to delete subscription';
          console.error('Error deleting subscription:', error);
        }
      });
    }
  }
}