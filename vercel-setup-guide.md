# Vercel Environment Variables Setup Guide

To deploy your Hoop Session application on Vercel without exposing your API keys in your GitHub repository, follow these steps:

## 1. Go to your Vercel Dashboard

Visit [vercel.com](https://vercel.com) and log in to your account.

## 2. Select Your Project

Find and select your "hoops" project from the dashboard.

## 3. Navigate to Project Settings

Click on the "Settings" tab in the top navigation bar.

## 4. Add Environment Variables

1. In the left sidebar, click on "Environment Variables"
2. Add the following environment variables:

   | Name | Value |
   |------|-------|
   | `STRIPE_SECRET_KEY` | `sk_test_51R1FY2RdAYNrQFsOnpqcIJdbAYwXDdj7xRtXQTsCmFFfB8CKWC5dTgyy0cNF0MHFpd4O5GXhbNMZCOUPOx5HnHGF001RB8kXqn` |
   | `STRIPE_PUBLISHABLE_KEY` | `pk_test_51R1FY2RdAYNrQFsOBzsuLemKmbvWRYZXyHtl5ohM7Kxj78hiJKazKHDJox4oQ9Hg2vTbrMlxlpL6chPXxxdquXiz007qStbwd4` |
   | `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_51R1FY2RdAYNrQFsOBzsuLemKmbvWRYZXyHtl5ohM7Kxj78hiJKazKHDJox4oQ9Hg2vTbrMlxlpL6chPXxxdquXiz007qStbwd4` |

3. Make sure all variables are set to be available in "Production", "Preview", and "Development" environments
4. Click "Save" to store your environment variables

## 5. Redeploy Your Application

1. Go to the "Deployments" tab
2. Find your latest deployment
3. Click the three dots menu (⋮) and select "Redeploy"

This will trigger a new deployment with your environment variables properly set.

## Security Notes

- These environment variables are securely stored in Vercel and are not visible in your GitHub repository
- The values are encrypted at rest and only injected during build and runtime
- You can rotate these keys in the future by updating them in both Stripe and Vercel

**Important**: Delete this file after setting up your Vercel environment variables, as it contains your actual API keys. 