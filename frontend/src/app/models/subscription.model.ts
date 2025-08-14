export interface Subscription {
  id: number;
  user_id: number;
  plan_name: string;
  plan_type: 'basic' | 'premium' | 'enterprise';
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  start_date: string;
  end_date: string;
  created_at?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
}

export interface SubscriptionRequest {
  userId: number;
  planName: string;
  planType: 'basic' | 'premium' | 'enterprise';
  price: number;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate: string;
}