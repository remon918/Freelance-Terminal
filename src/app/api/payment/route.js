import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe';
import { auth } from '@/lib/auth';

export async function POST(request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    const userSession = await auth.api.getSession({
      headers: await headers()
    })

    const user = userSession?.user;
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const price = formData.get("price")
    const title = formData.get("title")
    const taskId = formData.get("taskId")
    const proposalId = formData.get("proposalId")

    // Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer_email: user?.email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(Number(price) * 100), // দশমিক এড়াতে রাউন্ড করা
            product_data: { // 💡 ফিক্সড: payment_data পরিবর্তন করে product_data করা হলো
              name: title,
              description: `Escrow payment for project contract.`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: { // 💡 ডাটাবেজ মেটাডেটা প্রিপারেশন
        taskId: taskId,
        proposalId: proposalId,
        userId: user?.id,
        userEmail: user?.email,
        price: price
      },
      mode: 'payment',
      success_url: `${origin}/api/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/client/proposals`,
    });

    return NextResponse.redirect(session.url, 303)
  } catch (err) {
    console.error("Stripe Session Error: ", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}