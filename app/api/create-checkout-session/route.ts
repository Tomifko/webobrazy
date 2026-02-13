import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

interface RequestBody {
  items: Array<{
    obraz: {
      id: string;
      nazov: string;
      cena: number;
      url_obrazka: string;
      rozmery: string | null;
      technika: string | null;
    };
    mnozstvo: number;
  }>;
  customerInfo: {
    meno: string;
    email: string;
    telefon?: string;
    adresa: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RequestBody;
    const { items, customerInfo } = body;

    // Validácia
    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Košík je prázdny' },
        { status: 400 }
      );
    }

    // Vytvor Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.obraz.nazov,
            description: `${item.obraz.rozmery || ''} - ${item.obraz.technika || ''}`.trim(),
            images: [item.obraz.url_obrazka],
          },
          unit_amount: Math.round(item.obraz.cena * 100), // Stripe používa centy
        },
        quantity: item.mnozstvo,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/uspech?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/kosik`,
      customer_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.meno,
        customerAddress: customerInfo.adresa,
        customerPhone: customerInfo.telefon || '',
      },
    });

    // Vráť URL namiesto sessionId
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Neznáma chyba';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}