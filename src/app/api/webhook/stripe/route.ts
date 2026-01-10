import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
        console.error('Webhook signature verification failed:', error);
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 400 }
        );
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                const userId = session.metadata?.userId;

                if (userId) {
                    // Update user to premium
                    await adminDb.collection('users').doc(userId).update({
                        subscriptionTier: 'premium',
                        stripeCustomerId: session.customer as string,
                        subscriptionId: session.subscription as string,
                        subscriptionStatus: 'active',
                        updatedAt: new Date(),
                    });

                    console.log(`User ${userId} upgraded to premium`);
                }
                break;
            }

            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.userId;

                if (userId) {
                    const status = subscription.status;
                    const tier = status === 'active' ? 'premium' : 'free';

                    await adminDb.collection('users').doc(userId).update({
                        subscriptionTier: tier,
                        subscriptionStatus: status,
                        updatedAt: new Date(),
                    });

                    console.log(`User ${userId} subscription updated: ${status}`);
                }
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                const userId = subscription.metadata?.userId;

                if (userId) {
                    await adminDb.collection('users').doc(userId).update({
                        subscriptionTier: 'free',
                        subscriptionStatus: 'canceled',
                        subscriptionId: null,
                        updatedAt: new Date(),
                    });

                    console.log(`User ${userId} subscription canceled`);
                }
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                const subscriptionId = invoice.subscription as string;

                if (subscriptionId) {
                    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
                    const userId = subscription.metadata?.userId;

                    if (userId) {
                        await adminDb.collection('users').doc(userId).update({
                            subscriptionStatus: 'past_due',
                            updatedAt: new Date(),
                        });

                        console.log(`User ${userId} payment failed`);
                    }
                }
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json(
            { error: 'Webhook handler failed' },
            { status: 500 }
        );
    }
}
