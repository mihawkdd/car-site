import emailjs from '@emailjs/browser';

emailjs.init("YOUR_PUBLIC_KEY"); // You'll need to replace this with your EmailJS public key

export const sendEmail = async (templateParams: Record<string, unknown>) => {
  try {
    const response = await emailjs.send(
      "YOUR_SERVICE_ID", // Replace with your EmailJS service ID
      "YOUR_TEMPLATE_ID", // Replace with your EmailJS template ID
      {
        ...templateParams,
        to_email: "autoutilitareneamt@gmail.com"
      }
    );
    return response;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};