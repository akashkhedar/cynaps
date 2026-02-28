import { motion } from "framer-motion";
import { Footer } from "../Landing/components/Footer";
import { Navigation } from "../Landing/components/Navigation";
import type { Page } from "../types/Page";

const SmoothSection: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export const RefundPolicyPage: Page = () => {
  const lastUpdated = "February 18, 2026";

  return (
    <div className="bg-black min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden pt-32 pb-16">
        <div className="absolute inset-0 opacity-[0.03]">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(to right, #ffffff 1px, transparent 1px),
                linear-gradient(to bottom, #ffffff 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Refund & Cancellation Policy
            </h1>
            <p className="text-gray-400 text-lg">
              Last updated: {lastUpdated}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 relative">
        <div className="max-w-4xl mx-auto px-6">
          <div className="prose prose-invert prose-lg max-w-none">
            
            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">1. Overview</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                At Cynaps, we strive to provide high-quality medical data annotation services. This 
                Refund and Cancellation Policy outlines the terms under which refunds may be issued 
                and how cancellations are handled.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Our platform operates on a credit-based system where clients purchase credits in advance 
                to pay for annotation services. Please read this policy carefully before making any purchases.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. Credit Purchases</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">2.1 How Credits Work</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Credits are purchased in advance and added to your account balance</li>
                <li>Credits are used to pay for annotation tasks as they are completed</li>
                <li>Credit pricing is displayed at the time of purchase</li>
                <li>All transactions are processed in Credits</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">2.2 Credit Validity</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Purchased credits are valid for <strong className="text-white">12 months</strong> from the date of purchase</li>
                <li>Unused credits after 12 months will expire automatically</li>
                <li>You will receive reminder notifications 30 days before credit expiration</li>
                <li>Expired credits cannot be refunded or restored</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. Refund Eligibility</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">3.1 Eligible for Refund</h3>
              <div className="bg-green-900/20 border border-green-800 rounded-lg p-6 mb-6">
                <p className="text-gray-300 mb-4">You may request a refund in the following cases:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong className="text-white">Duplicate Payment:</strong> If you were charged multiple times for the same transaction</li>
                  <li><strong className="text-white">Technical Failure:</strong> If credits were not added to your account despite successful payment</li>
                  <li><strong className="text-white">Service Not Delivered:</strong> If we are unable to provide the annotation services you paid for</li>
                  <li><strong className="text-white">Quality Issues:</strong> If annotation quality consistently fails to meet agreed standards after multiple revisions</li>
                  <li><strong className="text-white">Account Termination by Us:</strong> If we terminate your account without cause</li>
                </ul>
              </div>

              <h3 className="text-xl font-semibold text-white mb-4">3.2 Not Eligible for Refund</h3>
              <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                <p className="text-gray-300 mb-4">Refunds will NOT be provided in the following cases:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li><strong className="text-white">Change of Mind:</strong> Deciding you no longer need the service after purchase</li>
                  <li><strong className="text-white">Used Credits:</strong> Credits that have already been consumed for completed annotations</li>
                  <li><strong className="text-white">Expired Credits:</strong> Credits that have passed their 12-month validity period</li>
                  <li><strong className="text-white">Account Violations:</strong> If your account was terminated due to policy violations</li>
                  <li><strong className="text-white">External Factors:</strong> Business changes, project cancellations, or decisions not related to our service</li>
                  <li><strong className="text-white">Partial Dissatisfaction:</strong> Subjective quality concerns without documented issues</li>
                </ul>
              </div>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Refund Process</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">4.1 How to Request a Refund</h3>
              <ol className="list-decimal list-inside text-gray-300 space-y-3 mb-6">
                <li>
                  <strong className="text-white">Submit Request:</strong> Email us at{" "}
                  <a href="mailto:billing@cynaps.xyz" className="text-purple-400 hover:text-purple-300">billing@cynaps.xyz</a>{" "}
                  with subject line "Refund Request - [Your Account Email]"
                </li>
                <li>
                  <strong className="text-white">Provide Details:</strong> Include transaction ID, date of purchase, amount, and reason for refund
                </li>
                <li>
                  <strong className="text-white">Review Period:</strong> We will review your request within 5-7 business days
                </li>
                <li>
                  <strong className="text-white">Decision:</strong> You will receive an email with our decision and next steps
                </li>
              </ol>

              <h3 className="text-xl font-semibold text-white mb-4">4.2 Refund Timeline</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Approved refunds are processed within <strong className="text-white">7-10 business days</strong></li>
                <li>Refunds are issued to the original payment method</li>
                <li>Bank processing may take an additional 5-7 business days</li>
                <li>You will receive email confirmation when the refund is processed</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Refund Amount</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">5.1 Full Refund</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A full refund of the purchase amount is provided when:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Duplicate payment is confirmed</li>
                <li>Credits were never added to your account</li>
                <li>No credits from the purchase have been used</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">5.2 Partial Refund</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                A partial refund (unused credits only) may be provided when:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Some credits have already been used</li>
                <li>Service issues occurred after partial usage</li>
                <li>Refund is approved for quality concerns after review</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                The refund amount will be calculated based on the unused credit balance at the time of request.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Project Cancellation</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">6.1 Client-Initiated Cancellation</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you wish to cancel an ongoing annotation project:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li><strong className="text-white">Before Work Begins:</strong> Full credit refund for the project</li>
                <li><strong className="text-white">Work In Progress:</strong> You will be charged for completed and in-progress tasks only</li>
                <li><strong className="text-white">After Completion:</strong> No refund available; annotations are delivered as agreed</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">6.2 Cynaps-Initiated Cancellation</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                In rare cases, we may need to cancel a project due to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Insufficient qualified annotators for specialized requirements</li>
                <li>Data that violates our acceptable use policies</li>
                <li>Inability to meet quality standards for specific data types</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                In such cases, you will receive a full refund for any unused credits allocated to that project.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Subscription Cancellation</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For clients on subscription plans:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Cancel anytime from your account settings</li>
                <li>Access continues until the end of the current billing period</li>
                <li>No refund for the current billing period, regardless of usage</li>
                <li>Unused credits remain valid for 12 months from purchase date</li>
                <li>Auto-renewal will be stopped for future periods</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. Annotator Payouts</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For annotators working on the platform:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Earnings are based on approved/accepted annotations only</li>
                <li>Rejected annotations due to quality issues are not compensated</li>
                <li>Minimum payout threshold: 500 Credits</li>
                <li>Payout requests are processed within 7-10 business days</li>
                <li>Payouts are non-reversible once processed</li>
                <li>Platform reserves the right to withhold payouts if fraud is suspected</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. Disputes and Chargebacks</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Before initiating a chargeback with your bank or payment provider:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Please contact us first at <a href="mailto:billing@cynaps.xyz" className="text-purple-400 hover:text-purple-300">billing@cynaps.xyz</a></li>
                <li>We are committed to resolving issues quickly and fairly</li>
                <li>Chargebacks initiated without contacting us may result in account suspension</li>
                <li>Fraudulent chargebacks will be contested and may result in permanent ban</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. Payment Methods</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We accept the following payment methods through Razorpay:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Credit/Debit Cards (Visa, MasterCard, RuPay)</li>
                <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
                <li>Net Banking</li>
                <li>Wallets (Paytm, Mobikwik, etc.)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                All payments are secured with industry-standard encryption.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">11. Policy Changes</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify this Refund and Cancellation Policy at any time. Changes 
                will be posted on this page with an updated "Last updated" date. Material changes will 
                be notified via email. Your continued use of the platform after changes constitutes 
                acceptance of the updated policy.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For refund requests, billing questions, or concerns about this policy:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Cynaps - Billing Support</strong></p>
                <p className="text-gray-300 mb-2">Email: <a href="mailto:billing@cynaps.xyz" className="text-purple-400 hover:text-purple-300">billing@cynaps.xyz</a></p>
                <p className="text-gray-300 mb-2">General Support: <a href="mailto:support@cynaps.xyz" className="text-purple-400 hover:text-purple-300">support@cynaps.xyz</a></p>
                <p className="text-gray-300 mb-4">Website: <a href="https://cynaps.xyz" className="text-purple-400 hover:text-purple-300">cynaps.xyz</a></p>
                <p className="text-gray-400 text-sm">
                  Response time: 1-2 business days for billing inquiries
                </p>
              </div>
            </SmoothSection>

            {/* Quick Reference Box */}
            <SmoothSection className="mb-12">
              <div className="bg-purple-900/20 border border-purple-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-white mb-4">Quick Reference</h3>
                <div className="grid md:grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <p className="mb-2"><strong className="text-white">Refund Request Deadline:</strong> Within 30 days of purchase</p>
                    <p className="mb-2"><strong className="text-white">Processing Time:</strong> 7-10 business days</p>
                    <p><strong className="text-white">Credit Validity:</strong> 12 months</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong className="text-white">Minimum Payout:</strong> 500 Credits</p>
                    <p className="mb-2"><strong className="text-white">Payout Processing:</strong> 7-10 business days</p>
                    <p><strong className="text-white">Support Email:</strong> billing@cynaps.xyz</p>
                  </div>
                </div>
              </div>
            </SmoothSection>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

RefundPolicyPage.title = "Refund & Cancellation Policy";
RefundPolicyPage.path = "/refund-policy";
RefundPolicyPage.exact = true;
