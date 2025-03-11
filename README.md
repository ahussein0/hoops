# Hoop Session

A web application for managing basketball session signups and payments.

## Features

- User signup for basketball sessions
- Payment processing with Stripe
- Participant tracking

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/ahussein0/hoops.git
cd hoops
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in your Stripe API keys in `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Create a new project on Vercel.
2. Connect your GitHub repository.
3. Add the following environment variables in the Vercel dashboard:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Deploy the project.

## Testing Payments

For testing payments, use the following test card:
- Card number: `4242 4242 4242 4242`
- Expiration date: Any future date
- CVC: Any 3 digits
- Postal code: Any 5 digits 