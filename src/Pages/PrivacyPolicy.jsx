import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 m-3 bg-green-200 min-h-screen rounded-lg">
      <motion.h1
        className="text-2xl font-semibold text-green-800 text-center mb-4 "
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Privacy Policy
      </motion.h1>
      
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section title="1. Introduction" content="Party DecorHUB is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and safeguard your personal information when you visit or make a purchase from our website." />
        <Section title="2. Information We Collect" content="Personal Information: Includes your name, email address, phone number, shipping and billing address, and payment details when you place an order. Non-Personal Information: Includes your browser type, IP address, and website usage data collected through cookies." />
        <Section title="3. How We Use Your Information" content="To process and fulfill your orders, including sending order confirmations and shipping updates. To communicate with you regarding your inquiries, orders, or promotional offers. To improve our website, services, and customer experience." />
        <Section title="4. Sharing Your Information" content="We do not sell or rent your personal information. However, we may share your data with: Service Providers: Third-party partners that assist in payment processing, order fulfillment, and shipping. Legal Compliance: Authorities when required by law." />
        <Section title="5. Data Security" content="We implement strict security measures to protect your information from unauthorized access, alteration, or disclosure. However, no online transmission is completely secure, and we cannot guarantee absolute security." />
        <Section title="6. Cookies" content="Our website uses cookies to enhance your browsing experience. You can choose to disable cookies through your browser settings, though this may affect website functionality." />
        <Section title="7. Your Rights" content="Access, update, or delete your personal information by contacting us. Opt out of receiving promotional emails by using the ‘unsubscribe’ link provided." />
        <Section title="8. Policy Updates" content="We reserve the right to update this Privacy Policy at any time. Changes will be posted on this page with a revised ‘Last Updated’ date." />
      </motion.div>
    </div>
  );
};

const Section = ({ title, content }) => {
  return (
    <motion.div
      className="mb-4 px-4"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <h2 className="text-xl font-semibold text-green-700 mb-2 text-start">{title}</h2>
      <p className="text-gray-600 text-start">{content}</p>
      <hr className="p-0 m-0 border-t border-green-800/80 mx-5"/>
    </motion.div>
  );
};

export default PrivacyPolicy;
