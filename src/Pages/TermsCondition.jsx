import { motion } from "framer-motion";

const TermsAndConditions = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 m-3 bg-green-200 min-h-screen rounded-lg">
      <motion.h1
        className="text-2xl font-semibold text-green-800 text-center mb-4 "
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Terms and Conditions
      </motion.h1>
      
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section title="1. Acceptance of Terms" content="By accessing our services, you agree to comply with these terms." />
        <Section title="2. Product Availability" content="All products are subject to availability, and designs may differ slightly due to production variations." />
        <Section title="3. Orders and Payments" content="Orders are confirmed upon receipt of payment. Errors in order details provided by the customer may result in delays or cancellations." />
        <Section title="4. Returns & Exchanges" content="Returns or exchanges are accepted for defective items reported within [timeframe] from delivery." />
        <Section title="5. Delivery Policy" content="Delivery timelines may vary based on location and availability." />
        <Section title="6. Intellectual Property" content="All content, designs, and trademarks are owned by our company. Unauthorized use is prohibited." />
        <Section title="7. Limitation of Liability" content="We are not responsible for delays caused by third parties or unforeseen circumstances." />
        <Section title="8. Modification of Terms" content="We reserve the right to update these terms at any time without prior notice." />
        <Section title="9. Contact Information" content="For queries, please reach out at 7011676961" />
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
      {title && <h2 className="text-xl font-semibold text-green-700 mb-2 text-start">{title}</h2>}
      <div className="text-gray-600 text-start">
        {typeof content === 'string' ? <p>{content}</p> : content}
      </div>
      <hr className="p-0 m-0 border-t border-green-800/80 mx-5"/>
    </motion.div>
  );
};

export default TermsAndConditions;