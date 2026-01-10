import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminDb } from '@/lib/firebase-admin';

// Lazy initialization to avoid build-time errors
function getStripe() {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });
}

function getWebhookSecret() {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
    }
    return process.env.STRIPE_WEBHOOK_SECRET;
}

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(body, signature, getWebhookSecret());
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
                // Use any cast since Invoice type definition varies between Stripe versions
                const invoice = event.data.object as any;
                const subscriptionId = invoice.subscription;

                if (subscriptionId && typeof subscriptionId === 'string') {
                    const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
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
