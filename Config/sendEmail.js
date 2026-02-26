const nodemailer = require("nodemailer");

const sendOrderEmail = async (to, orderId, totalAmount) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Flower Shop " <${process.env.EMAIL}>`,
    to,
    subject: "Order Confirmed ",
    html: `
      <h2>Thank you for your order!</h2>
      <p><b>Order ID:</b> ${orderId}</p>
      <p><b>Total Amount:</b> ₹${totalAmount}</p>
      <p>Your flowers will be delivered soon </p>
    `
  });
};
const sendCancelEmail = async (to, orderId,totalAmount) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  await transporter.sendMail({
    from: `"Flower Shop " <${process.env.EMAIL}>`,
    to,
    subject: "Order cancelled ",
    html: `
      <h2>Order cancelled!</h2>
      <p><b>Order ID:</b> ${orderId}</p>
    <p><b>Total Amount:</b> ₹${totalAmount}</p>
      <p>Your flowers will be delivered soon </p>
    `
  });
};



module.exports = {sendOrderEmail, sendCancelEmail};
