import { motion } from "framer-motion";

const ShippingPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 m-3 bg-green-200 min-h-screen rounded-lg">
      <motion.h1
        className="text-2xl font-semibold text-green-800 text-center mb-4 "
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Shipping Policy
      </motion.h1>
      
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section title="Party DecorHUB Commitment" content="Party DecorHUB is dedicated to providing a seamless shopping experience for our customers." />
        <Section title="Processing Time" content="Orders are processed within 1-2 business days after payment confirmation. Customized or personalized items may require additional processing time, which will be communicated at the time of purchase." />
        <Section title="Shipping Methods and Delivery Times" content={
          <>
            We offer standard shipping across India.
            <p className="mt-2">Estimated delivery times are as follows:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Metro Cities: 3-5 business days</li>
              <li>Non-Metro Areas: 5-7 business days</li>
            </ul>
            <p className="mt-2">Please note that delivery times are estimates and may vary due to factors beyond our control, such as courier delays or unforeseen circumstances.</p>
          </>
        } />
        <Section title="Shipping Charges" content="Shipping charges are calculated based on the weight and dimensions of the package, as well as the delivery location." />
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

export default ShippingPolicy;