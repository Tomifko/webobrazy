interface OrderConfirmationCustomerProps {
  customerName: string;
  orderItems: Array<{
    nazov: string;
    cena: number;
    rozmery: string | null;
    technika: string | null;
  }>;
  totalPrice: number;
  orderDate: string;
}

export function OrderConfirmationCustomer({
  customerName,
  orderItems,
  totalPrice,
  orderDate,
}: OrderConfirmationCustomerProps) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
    .item { background: white; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
    .total { background: #667eea; color: white; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; border-radius: 8px; margin-top: 20px; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">✅ Objednávka potvrdená!</h1>
    </div>
    <div class="content">
      <p>Dobrý deň ${customerName},</p>
      <p>Ďakujeme za vašu objednávku! Vaša platba bola úspešne spracovaná.</p>
      
      <h3>Objednané obrazy:</h3>
      ${orderItems.map(item => `
        <div class="item">
          <strong>${item.nazov}</strong><br>
          ${item.rozmery ? `Rozmery: ${item.rozmery}<br>` : ''}
          ${item.technika ? `Technika: ${item.technika}<br>` : ''}
          Cena: <strong>${item.cena.toFixed(2)} €</strong>
        </div>
      `).join('')}
      
      <div class="total">
        Celková suma: ${totalPrice.toFixed(2)} €
      </div>
      
      <p style="margin-top: 30px;">
        <strong>Čo bude ďalej?</strong><br>
        Váš obraz budeme starostlivo baliť a čoskoro vám pošleme informácie o doručení.
      </p>
      
      <p>Dátum objednávky: ${new Date(orderDate).toLocaleDateString('sk-SK')}</p>
    </div>
    <div class="footer">
      <p>S pozdravom,<br>Galéria Umenia</p>
      <p style="font-size: 12px; color: #9ca3af;">
        Tento email bol odoslaný automaticky. Prosím neodpovedajte naň.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}