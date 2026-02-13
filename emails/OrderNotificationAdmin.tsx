interface OrderNotificationAdminProps {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerPhone: string;
  orderItems: Array<{
    nazov: string;
    cena: number;
    rozmery: string | null;
    technika: string | null;
  }>;
  totalPrice: number;
  orderDate: string;
  stripePaymentId: string;
}

export function OrderNotificationAdmin({
  customerName,
  customerEmail,
  customerAddress,
  customerPhone,
  orderItems,
  totalPrice,
  orderDate,
  stripePaymentId,
}: OrderNotificationAdminProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .section { background: white; padding: 20px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .item { background: #f3f4f6; padding: 10px; margin: 8px 0; border-radius: 5px; }
    .label { font-weight: bold; color: #4b5563; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🎨 Nová objednávka!</h1>
    </div>
    <div class="content">
      <div class="section">
        <h3 style="margin-top: 0;">👤 Informácie o zákazníkovi</h3>
        <p><span class="label">Meno:</span> ${customerName}</p>
        <p><span class="label">Email:</span> ${customerEmail}</p>
        <p><span class="label">Telefón:</span> ${customerPhone || 'Nezadaný'}</p>
        <p><span class="label">Adresa:</span> ${customerAddress}</p>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0;">🖼️ Objednané obrazy</h3>
        ${orderItems.map(item => `
          <div class="item">
            <strong>${item.nazov}</strong><br>
            ${item.rozmery ? `Rozmery: ${item.rozmery}<br>` : ''}
            ${item.technika ? `Technika: ${item.technika}<br>` : ''}
            Cena: <strong>${item.cena.toFixed(2)} €</strong>
          </div>
        `).join('')}
        <p style="font-size: 18px; margin-top: 15px;">
          <span class="label">Celková suma:</span> <strong>${totalPrice.toFixed(2)} €</strong>
        </p>
      </div>
      
      <div class="section">
        <h3 style="margin-top: 0;">💳 Platba</h3>
        <p><span class="label">Stripe Payment ID:</span> ${stripePaymentId}</p>
        <p><span class="label">Dátum:</span> ${new Date(orderDate).toLocaleString('sk-SK')}</p>
        <p><span class="label">Stav:</span> <span style="color: #10b981; font-weight: bold;">✅ Zaplatené</span></p>
      </div>
      
      <p style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
        ⚠️ <strong>Akcia potrebná:</strong> Priprav obraz na odoslanie a kontaktuj zákazníka ohľadom doručenia.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}