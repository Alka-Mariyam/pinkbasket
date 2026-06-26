const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

let transporter = null;

let globalProducts = [];
let clients = [];

const broadcastProducts = () => {
  const data = `data: ${JSON.stringify(globalProducts)}\n\n`;
  clients.forEach(client => client.write(data));
};

// Initialize Gmail transporter
async function initNodemailer() {
  try {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "alka70552@gmail.com", // Correct email from user
        pass: "jqaeybhqrywxsnhj", // App password
      },
    });

    // Verify connection configuration
    await transporter.verify();
    console.log("Gmail SMTP Transporter initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Nodemailer: ", error);
  }
}

initNodemailer();

app.get('/api/products', (req, res) => {
  res.json(globalProducts);
});

app.get('/api/products/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  // Send initial data immediately
  res.write(`data: ${JSON.stringify(globalProducts)}\n\n`);
  
  clients.push(res);
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
});

app.post('/api/products/seed', (req, res) => {
  globalProducts = req.body;
  broadcastProducts();
  res.json({ success: true, count: globalProducts.length });
});

app.post('/api/products', (req, res) => {
  const newProduct = req.body;
  globalProducts.unshift(newProduct);
  broadcastProducts();
  res.json({ success: true, product: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updatedProduct = req.body;
  const index = globalProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    globalProducts[index] = { ...globalProducts[index], ...updatedProduct };
    broadcastProducts();
    res.json({ success: true, product: globalProducts[index] });
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  globalProducts = globalProducts.filter(p => p.id !== id);
  broadcastProducts();
  res.json({ success: true });
});

app.post('/api/checkout-success', async (req, res) => {
  const { userEmail, orderId, total, items, trackingUrl } = req.body;

  if (!transporter) {
    return res.status(500).json({ error: 'SMTP Service not ready yet.' });
  }

  try {
    // Construct HTML email body
    let itemsHtml = items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name} (x${item.quantity})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.product.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #FF2E93; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">PinkBasket</h1>
        </div>
        <div style="padding: 20px; background-color: #fffafb; border: 1px solid #ffe3ec;">
          <h2>Order Confirmed!</h2>
          <p>Thank you for shopping with PinkBasket! Your order <strong>#${orderId}</strong> has been successfully placed.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #FF2E93; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #FF2E93;">Expected Delivery</h3>
            <p style="margin-bottom: 0; font-size: 16px; font-weight: bold;">${req.body.eta || 'Standard Delivery'}</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background-color: #fce4ec;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr>
                <td style="padding: 10px; font-weight: bold; text-align: right;">Total:</td>
                <td style="padding: 10px; font-weight: bold; text-align: right;">₹${total}</td>
              </tr>
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${trackingUrl}" style="background-color: #FF2E93; color: white; padding: 15px 25px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Track Your Order</a>
          </div>
        </div>
      </div>
    `;

    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"PinkBasket" <alka70552@gmail.com>', // sender address
      to: 'alka70552@gmail.com', // ALWAYS send to user's real email for testing
      subject: `Order Confirmation #${orderId} - PinkBasket`, // Subject line
      text: `Your order #${orderId} for ₹${total} has been placed. Track it here: ${trackingUrl}`, // plain text body
      html: htmlBody, // html body
    });

    console.log("Message sent: %s", info.messageId);

    res.json({ 
      success: true, 
      message: 'Email sent successfully'
    });

  } catch (error) {
    console.error("Error sending email: ", error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.post('/api/refund-success', async (req, res) => {
  const { userEmail, orderId, refundAmount } = req.body;

  if (!transporter) {
    return res.status(500).json({ error: 'SMTP Service not ready yet.' });
  }

  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #ff4444; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">PinkBasket</h1>
        </div>
        <div style="padding: 20px; background-color: #fffafb; border: 1px solid #ffe3ec;">
          <h2 style="color: #ff4444;">Cancellation Confirmed & Refund Initiated</h2>
          <p>We're sorry to see your order go! Your order <strong>#${orderId}</strong> has been successfully cancelled.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #ff4444; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #ff4444;">Refund Amount</h3>
            <p style="margin-bottom: 0; font-size: 18px; font-weight: bold;">₹${refundAmount}</p>
          </div>

          <p>This amount has been credited back to your original payment method. Please allow 3-5 business days for it to reflect in your account.</p>
          
          <p>We hope to see you shopping with us again soon!</p>
        </div>
      </div>
    `;

    // Send mail
    let info = await transporter.sendMail({
      from: '"PinkBasket" <alka70552@gmail.com>',
      to: 'alka70552@gmail.com', // Always send to user's real email for testing
      subject: `Order Cancellation & Refund #${orderId} - PinkBasket`,
      text: `Your order #${orderId} has been cancelled. A refund of ₹${refundAmount} has been initiated.`,
      html: htmlBody,
    });

    console.log("Refund Message sent: %s", info.messageId);

    res.json({ success: true, message: 'Refund email sent successfully' });
  } catch (error) {
    console.error("Error sending refund email: ", error);
    res.status(500).json({ error: 'Failed to send refund email' });
  }
});

app.post('/api/return-success', async (req, res) => {
  const { userEmail, orderId, refundAmount } = req.body;

  if (!transporter) {
    return res.status(500).json({ error: 'SMTP Service not ready yet.' });
  }

  try {
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #9C27B0; padding: 20px; text-align: center; color: white;">
          <h1 style="margin: 0;">PinkBasket</h1>
        </div>
        <div style="padding: 20px; background-color: #fdfafb; border: 1px solid #f3e5f5;">
          <h2 style="color: #9C27B0;">Return Initiated</h2>
          <p>Your return request for order <strong>#${orderId}</strong> has been successfully initiated.</p>
          
          <div style="background-color: #fff; padding: 15px; border-radius: 8px; border-left: 4px solid #9C27B0; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #9C27B0;">Next Steps</h3>
            <p style="margin-bottom: 8px;">A delivery agent will pick up the item(s) from your address <strong>tomorrow</strong>.</p>
            <p style="margin-bottom: 0;">Once the item is picked up, your refund of <strong>₹${refundAmount}</strong> will be processed to your original payment method within 3-5 business days.</p>
          </div>
          
          <p>Please ensure the item is in its original condition with all tags attached.</p>
        </div>
      </div>
    `;

    // Send mail
    let info = await transporter.sendMail({
      from: '"PinkBasket" <alka70552@gmail.com>',
      to: 'alka70552@gmail.com', // Always send to user's real email for testing
      subject: `Return Initiated - Order #${orderId}`,
      text: `Your return for order #${orderId} is initiated. A pickup is scheduled for tomorrow.`,
      html: htmlBody,
    });

    console.log("Return Message sent: %s", info.messageId);

    res.json({ success: true, message: 'Return email sent successfully' });
  } catch (error) {
    console.error("Error sending return email: ", error);
    res.status(500).json({ error: 'Failed to send return email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email SMTP server running on http://localhost:${PORT}`);
});
