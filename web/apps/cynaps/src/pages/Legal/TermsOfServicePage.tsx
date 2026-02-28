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

export const TermsOfServicePage: Page = () => {
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
              Terms of Service
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
              <h2 className="text-3xl font-bold text-white mb-6">1. Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By accessing or using Cynaps ("Platform"), you agree to be bound by these Terms of Service 
                ("Terms"). If you disagree with any part of these terms, you may not access the Platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                These Terms apply to all users of the Platform, including Clients (those who upload data 
                for annotation), Annotators (those who perform annotation work), and Experts (those who 
                review and validate annotations).
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. Description of Service</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cynaps is a medical data annotation platform that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Connects healthcare AI companies with qualified medical annotators</li>
                <li>Provides tools for annotating medical imaging, clinical text, and healthcare data</li>
                <li>Offers quality assurance through expert review workflows</li>
                <li>Maintains secure, compliant data handling for sensitive medical information</li>
                <li>Facilitates payments between clients and annotators through a credit-based system</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">3.1 Account Registration</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                To use certain features, you must create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Provide accurate, current, and complete information</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">3.2 Account Types</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">Client Accounts:</strong> For organizations uploading data for annotation services</li>
                <li><strong className="text-white">Annotator Accounts:</strong> For individuals performing annotation work (requires qualification testing)</li>
                <li><strong className="text-white">Expert Accounts:</strong> For qualified professionals reviewing annotations</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Client Terms</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">4.1 Data Upload and Ownership</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>You retain all ownership rights to data you upload</li>
                <li>You grant us a limited license to process your data for annotation services</li>
                <li>You warrant that you have the right to upload and process the data</li>
                <li>You are responsible for obtaining necessary consents for any personal/patient data</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">4.2 Healthcare Data Compliance</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                When uploading Protected Health Information (PHI), you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Execute a Business Associate Agreement (BAA) with us</li>
                <li>Ensure de-identification or proper authorization for PHI use</li>
                <li>Comply with HIPAA and other applicable healthcare regulations</li>
                <li>Notify us immediately of any suspected data breaches</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">4.3 Credits and Payment</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Credits must be purchased in advance for annotation work</li>
                <li>Credit pricing is displayed at the time of purchase</li>
                <li>Credits are non-transferable between accounts</li>
                <li>Unused credits remain valid for 12 months from purchase date</li>
                <li>All prices are in Credits unless otherwise stated</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Annotator Terms</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">5.1 Qualification Requirements</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Pass required skill assessment tests before accessing projects</li>
                <li>Maintain accuracy standards as specified by project requirements</li>
                <li>Complete mandatory training for specialized medical annotation types</li>
                <li>Provide accurate professional credentials when required</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">5.2 Work Standards</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Complete assigned tasks within specified timeframes</li>
                <li>Follow all project guidelines and annotation standards</li>
                <li>Maintain confidentiality of all project data</li>
                <li>Not use automated tools or AI assistance unless explicitly permitted</li>
                <li>Report any issues or unclear instructions promptly</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">5.3 Compensation</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Payment for completed and approved work only</li>
                <li>Rates are specified per project/task type</li>
                <li>Minimum payout threshold: 500 Credits</li>
                <li>Payouts processed via bank transfer or UPI</li>
                <li>Annotators are responsible for their own taxes</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Prohibited Activities</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Copy, download, or distribute any project data outside the Platform</li>
                <li>Share login credentials or allow unauthorized access</li>
                <li>Use the Platform for any unlawful purpose</li>
                <li>Attempt to reverse engineer or compromise Platform security</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload malicious code or content</li>
                <li>Circumvent annotation quality controls or verification systems</li>
                <li>Create multiple accounts for fraudulent purposes</li>
                <li>Scrape, crawl, or extract data from the Platform</li>
                <li>Use bots or automated systems without authorization</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">7.1 Platform IP</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                The Platform, including its design, features, code, and content (excluding user-uploaded 
                data), is owned by Cynaps and protected by intellectual property laws. You may not copy, 
                modify, or create derivative works without our written permission.
              </p>

              <h3 className="text-xl font-semibold text-white mb-4">7.2 Annotation Work Product</h3>
              <p className="text-gray-300 leading-relaxed">
                Annotations created on the Platform become the property of the Client who commissioned 
                the work, upon payment. Annotators retain no rights to the annotations or underlying data.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. Confidentiality</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All users agree to maintain strict confidentiality of:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>All data, images, and content accessed through the Platform</li>
                <li>Project details, client identities, and business information</li>
                <li>Annotation guidelines and methodologies</li>
                <li>Any information marked as confidential</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                This obligation survives termination of your account.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. Service Availability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Perform scheduled maintenance with advance notice when possible</li>
                <li>Temporarily suspend service for emergency maintenance</li>
                <li>Modify or discontinue features with reasonable notice</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We are not liable for any losses due to service interruptions.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>We provide the Platform "as is" without warranties of any kind</li>
                <li>We are not liable for indirect, incidental, or consequential damages</li>
                <li>Our total liability is limited to amounts paid by you in the past 12 months</li>
                <li>We are not responsible for annotation accuracy in medical diagnoses or treatment decisions</li>
                <li>Users are responsible for validating annotation outputs for clinical use</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">11. Indemnification</h2>
              <p className="text-gray-300 leading-relaxed">
                You agree to indemnify and hold harmless Cynaps and its officers, directors, employees, 
                and agents from any claims, damages, or expenses arising from your use of the Platform, 
                violation of these Terms, or infringement of any third-party rights.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">12. Account Termination</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We may suspend or terminate your account if you:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-4">
                <li>Violate these Terms or our policies</li>
                <li>Engage in fraudulent or abusive behavior</li>
                <li>Fail to maintain required quality standards (for annotators)</li>
                <li>Have prolonged inactivity (12+ months)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                Upon termination, your access will be revoked. Clients may request data export within 30 
                days of termination. Earned but unpaid annotator compensation will be paid out according 
                to our standard process.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">13. Dispute Resolution</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Any disputes arising from these Terms or the Platform will be:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>First attempted to be resolved through good-faith negotiation</li>
                <li>Subject to arbitration under Indian Arbitration Act if negotiation fails</li>
                <li>Governed by the laws of India</li>
                <li>Subject to exclusive jurisdiction of courts in Bengaluru, Karnataka</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">14. Changes to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify these Terms at any time. Material changes will be notified 
                via email or Platform notification at least 30 days before taking effect. Continued use 
                after changes constitutes acceptance. If you disagree with updated Terms, you must stop 
                using the Platform and may request account deletion.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">15. Severability</h2>
              <p className="text-gray-300 leading-relaxed">
                If any provision of these Terms is found unenforceable, the remaining provisions will 
                continue in full force and effect.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">16. Contact Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For questions about these Terms, please contact us:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Cynaps</strong></p>
                <p className="text-gray-300 mb-2">Email: <a href="mailto:legal@cynaps.xyz" className="text-purple-400 hover:text-purple-300">legal@cynaps.xyz</a></p>
                <p className="text-gray-300 mb-2">Support: <a href="mailto:support@cynaps.xyz" className="text-purple-400 hover:text-purple-300">support@cynaps.xyz</a></p>
                <p className="text-gray-300">Website: <a href="https://cynaps.xyz" className="text-purple-400 hover:text-purple-300">cynaps.xyz</a></p>
              </div>
            </SmoothSection>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

TermsOfServicePage.title = "Terms of Service";
TermsOfServicePage.path = "/terms";
TermsOfServicePage.exact = true;
