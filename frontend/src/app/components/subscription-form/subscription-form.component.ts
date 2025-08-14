import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-subscription-form',
  templateUrl: './subscription-form.component.html',
  styleUrls: ['./subscription-form.component.css']
})
export class SubscriptionFormComponent implements OnInit {
  subscriptionForm: FormGroup;
  loading = false;
  error = '';
  isEditMode = false;
  subscriptionId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private subscriptionService: SubscriptionService,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.subscriptionForm = this.formBuilder.group({
      userId: [1, Validators.required], // Default to user ID 1 for demo
      planName: ['', Validators.required],
      planType: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.subscriptionId = this.route.snapshot.params['id'];
    this.isEditMode = !!this.subscriptionId;

    if (this.isEditMode) {
      this.loadSubscription();
    }

    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    this.subscriptionForm.patchValue({ startDate: today });
  }

  get f() { return this.subscriptionForm.controls; }

  loadSubscription(): void {
    if (this.subscriptionId) {
      this.subscriptionService.getSubscriptionById(this.subscriptionId).subscribe({
        next: (subscription) => {
          this.subscriptionForm.patchValue({
            userId: subscription.user_id,
            planName: subscription.plan_name,
            planType: subscription.plan_type,
            price: subscription.price,
            status: subscription.status,
            startDate: subscription.start_date,
            endDate: subscription.end_date
          });
        },
        error: (error) => {
          this.error = 'Failed to load subscription';
          console.error('Error loading subscription:', error);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.subscriptionForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const formData = this.subscriptionForm.value;

    if (this.isEditMode && this.subscriptionId) {
      this.subscriptionService.updateSubscription(this.subscriptionId, formData).subscribe({
        next: () => {
          this.router.navigate(['/subscriptions']);
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to update subscription';
          this.loading = false;
        }
      });
    } else {
      this.subscriptionService.createSubscription(formData).subscribe({
        next: () => {
          this.router.navigate(['/subscriptions']);
        },
        error: (error) => {
          this.error = error.error?.error || 'Failed to create subscription';
          this.loading = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/subscriptions']);
  }
}