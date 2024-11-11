// Import loadStripe from @stripe/stripe-js
import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe('pk_test_51QEF5RD8NPOEYFGimBKhjVLEVgPz5WurYZSt9vdJWmXGWyt2Uh1X6bvLpRJvb5VIZ47JBTSH6Jfh6LKxk0r0Hg6k00CnziuH5R');

export default stripePromise;
