import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';  
import { Resend } from 'resend';
import { OrderConfirmationCustomer } from '@/emails/OrderConfirmationCustomer';
import { OrderNotificationAdmin } from '@/emails/OrderNotificationAdmin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const resend = new Resend(process.env.RESEND_API_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      console.error('❌ No signature provided');
      return NextResponse.json(
        { error: 'No signature' },
        { status: 400 }
      );
    }

    // Overenie webhooku
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Webhook signature verification failed' },
        { status: 400 }
      );
    }

    console.log('✅ Webhook event received:', event.type);

    // Spracuj checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('📦 Processing checkout session:', session.id);

      try {
        // Získaj line items z session
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ['data.price.product'],
        });

        console.log('📋 Line items:', lineItems.data.length);

        // Priprav dáta pre databázu
        const customerEmail = session.customer_email || session.customer_details?.email || '';
        const customerName = session.metadata?.customerName || '';
        const customerAddress = session.metadata?.customerAddress || '';
        const customerPhone = session.metadata?.customerPhone || '';
        const totalAmount = (session.amount_total || 0) / 100;

        console.log('👤 Customer:', customerName, customerEmail);

        if (!customerEmail) {
          throw new Error('No customer email found');
        }

        // Ulož objednávku do databázy
        const { data: objednavka, error: objednavkaError } = await supabaseAdmin
          .from('objednavky')
          .insert({
            email: customerEmail,
            meno: customerName,
            adresa: customerAddress,
            celkova_suma: totalAmount,
            stav: 'zaplatené',
            stripe_payment_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (objednavkaError) {
          console.error('❌ Error creating order:', objednavkaError);
          throw objednavkaError;
        }

        console.log('✅ Order created:', objednavka.id);

        // Priprav dáta pre emaily a ulož položky
        const orderItems = [];

        for (const item of lineItems.data) {
          const productName = 
          typeof item.price?.product === 'object' && 'name' in item.price.product
            ? item.price.product.name 
            : '';
          const price = (item.price?.unit_amount || 0) / 100;

          console.log('🖼️ Processing item:', productName);

          // Nájdi obraz v databáze podľa názvu
          const { data: obraz, error: obrazError } = await supabaseAdmin
            .from('obrazy')
            .select('*')
            .eq('nazov', productName)
            .single();

          if (obrazError) {
            console.error('⚠️ Obraz not found:', productName, obrazError);
            // Pokračuj aj keď sa nenájde obraz
            orderItems.push({
              nazov: productName,
              cena: price,
              rozmery: null,
              technika: null,
            });
            continue;
          }

          // Ulož položku objednávky
          const { error: polozkaError } = await supabaseAdmin
            .from('polozky_objednavky')
            .insert({
              objednavka_id: objednavka.id,
              obraz_id: obraz.id,
              cena: price,
            });

          if (polozkaError) {
            console.error('⚠️ Error creating order item:', polozkaError);
          }

          // Označ obraz ako predaný
          const { error: updateError } = await supabaseAdmin
            .from('obrazy')
            .update({ dostupny: false })
            .eq('id', obraz.id);

          if (updateError) {
            console.error('⚠️ Error updating obraz availability:', updateError);
          } else {
            console.log('✅ Obraz marked as sold:', obraz.nazov);
          }

          orderItems.push({
            nazov: productName,
            cena: price,
            rozmery: obraz.rozmery || null,
            technika: obraz.technika || null,
          });
        }

        // Pošli email zákazníkovi
        console.log('📧 Sending customer email to:', customerEmail);
        try {
          const customerEmailResult = await resend.emails.send({
            from: 'Galéria Umenia <onboarding@resend.dev>',
            to: customerEmail,
            subject: '✅ Potvrdenie objednávky - Galéria Umenia',
            html: OrderConfirmationCustomer({
              customerName,
              orderItems,
              totalPrice: totalAmount,
              orderDate: new Date().toISOString(),
            }),
          });
          console.log('✅ Customer email sent:', customerEmailResult);
        } catch (emailError) {
          console.error('❌ Failed to send customer email:', emailError);
        }

        // Pošli email adminovi
        const adminEmail = process.env.ADMIN_EMAIL || '';
        if (adminEmail) {
          console.log('📧 Sending admin email to:', adminEmail);
          try {
            const adminEmailResult = await resend.emails.send({
              from: 'Galéria Umenia <onboarding@resend.dev>',
              to: adminEmail,
              subject: '🎨 Nová objednávka na Galéria Umenia!',
              html: OrderNotificationAdmin({
                customerName,
                customerEmail,
                customerAddress,
                customerPhone,
                orderItems,
                totalPrice: totalAmount,
                orderDate: new Date().toISOString(),
                stripePaymentId: session.payment_intent as string,
              }),
            });
            console.log('✅ Admin email sent:', adminEmailResult);
          } catch (emailError) {
            console.error('❌ Failed to send admin email:', emailError);
          }
        } else {
          console.warn('⚠️ No ADMIN_EMAIL configured');
        }

        console.log('✅ Order processed successfully:', objednavka.id);
      } catch (processingError) {
        console.error('❌ Error processing checkout session:', processingError);
        // Vráť error ale s detailmi
        return NextResponse.json(
          { 
            error: 'Failed to process order',
            details: processingError instanceof Error ? processingError.message : 'Unknown error'
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return NextResponse.json(
      { 
        error: 'Webhook handler failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}