import { motion } from "framer-motion";

const RefundReturnPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 m-3 bg-green-200 min-h-screen rounded-lg">
      <motion.h1
        className="text-2xl font-semibold text-green-800 text-center mb-4 "
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        Refund and Return Policy
      </motion.h1>
      
      <motion.div
        className="bg-white p-6 rounded-lg shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Section title="Party DecorHUB Commitment" content="Party DecorHUB is committed to ensuring customer satisfaction with every purchase." />
        <Section title="Eligibility for Returns" content="Items must be returned within 10 days from the date of delivery. Products should be in their original condition, unused, unwashed, and in the original packaging. Customized or personalized items are not eligible for return unless they are defective or damaged upon arrival." />
        <Section title="Return Process" content={
          <>
            <p><strong>Initiate a Return:</strong> Contact our customer service team at +91 7011676961 to request a return. Please provide your order number and the reason for the return.</p>
            <p><strong>Return Authorization:</strong> Once your return request is approved, you will receive a Return Authorization Number (RAN) along with instructions on how to proceed.</p>
            <p><strong>Packaging:</strong> Securely pack the item(s) in their original packaging, including all accessories, manuals, and documentation. Clearly write the RAN on the outside of the package.</p>
            <p><strong>Shipping:</strong> Ship the return package to the address provided by our customer service team. We recommend using a trackable shipping method to ensure the package reaches us safely.</p>
          </>
        } />
        <Section title="Refunds" content="Once we receive and inspect the returned item(s), we will process your refund within 7-10 business days. Refunds will be issued to the original payment method used during the purchase. Please note that shipping charges are non-refundable, and return shipping costs are the responsibility of the customer, unless the return is due to an error on our part (e.g., defective or incorrect item)." />
        <Section title="Exchanges" content="If you wish to exchange an item for a different size, color, or product, please initiate a return for the original item and place a new order for the desired item." />
        <Section title="Damaged or Defective Items" content="If you receive a damaged or defective item, please contact us immediately at +91 7011676961. Provide your order number and a description of the issue, along with photographic evidence if possible. We will arrange for a replacement or refund promptly." />
        <Section title="Non-Returnable Items" content={
          <>
            Certain items are non-returnable, including:
            <ul className="list-disc pl-5 mt-2">
              <li>Customized or personalized products.</li>
              <li>Items purchased on clearance or sale.</li>
              <li>Opened consumable items (e.g., party poppers, balloons).</li>
            </ul>
          </>
        } />
        <Section title="" content="We value your business and aim to provide a seamless shopping experience." />
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

export default RefundReturnPolicy;