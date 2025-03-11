# Testing Your Hoop Session Server Locally

This guide will help you test your Hoop Session signup and payment application locally before deploying to Vercel.

## Prerequisites

1. Stripe account with test API keys
2. Node.js and npm installed

## Step 1: Set Up Environment Variables

1. Update the `.env.local` file with your Stripe test API keys:

```
# Stripe API keys
STRIPE_SECRET_KEY=sk_test_your_actual_test_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_test_publishable_key

# Next.js environment variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_test_publishable_key

# Set to 'development' for local testing
NODE_ENV=development
```

You can get these keys from your Stripe Dashboard under Developers > API keys. Make sure to use the test keys, not the live ones.

## Step 2: Install Dependencies

If you haven't already, install the project dependencies:

```bash
npm install
```

## Step 3: Run the Development Server

Start the Next.js development server:

```bash
npm run dev
```

This will start your application on `http://localhost:3000`.

## Step 4: Test the Application Flow

1. **Test the Signup Flow**:
   - Open `http://localhost:3000` in your browser
   - Select "I'm in! 🎉" and click "Continue"
   - Fill in the name and phone number form
   - Click "Proceed to Payment"

2. **Test the Payment Flow**:
   - When the Stripe payment form appears, use these test card details:
     - Card number: `4242 4242 4242 4242`
     - Expiration date: Any future date (e.g., 12/25)
     - CVC: Any 3 digits (e.g., 123)
     - Postal code: Any 5 digits (e.g., 12345)
   - Click "Pay Now"
   - You should be redirected to the payment confirmation page

3. **Test the Participants List**:
   - After completing a payment, check if the participant appears in the list
   - The list should show the name, phone number, and payment status

## Step 5: Test the API Endpoints Directly

You can also test the API endpoints directly using tools like Postman or curl:

1. **Test the Create Payment Intent API**:

```bash
curl -X POST http://localhost:3000/api/create-payment-intent \
  -H "Content-Type: application/json" \
  -d '{"amount": 2500, "name": "Test User", "phone": "+15551234567"}'
```

This should return a JSON response with a `clientSecret`.

## Troubleshooting

- **Stripe API Key Issues**: Make sure your Stripe API keys are correctly set in the `.env.local` file.
- **Payment Processing Errors**: Check the browser console and server logs for any error messages.
- **Webhook Testing**: For testing webhooks locally, you can use the Stripe CLI to forward webhook events to your local server.

## Notes

- The current implementation uses in-memory storage for participants, which means data will be lost when the server restarts. In a production environment, you should use a database.
- For production deployment to Vercel, make sure to set the environment variables in the Vercel dashboard. 