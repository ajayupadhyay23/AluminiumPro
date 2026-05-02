# Goal
Support direct Google Pay / PhonePe payments by bypassing Razorpay when keys are not available.

## Proposed Changes
1. **`api/checkout/route.ts`**:
   - Make Razorpay completely optional. If keys are missing, we still create the order in Prisma but skip calling the Razorpay API. We return `razorpayOrderId: null`.
2. **`checkout/page.tsx`**:
   - Catch the `razorpayOrderId: null` response.
   - If it's null, redirect directly to the success page instead of loading the Razorpay SDK.
3. **`checkout/success/page.tsx`**:
   - Update the success page to display instructions for the customer to manually pay via Google Pay / PhonePe to the user's provided number, since Razorpay was bypassed.
