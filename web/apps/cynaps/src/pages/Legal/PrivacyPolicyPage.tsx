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

export const PrivacyPolicyPage: Page = () => {
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
              Privacy Policy
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
              <h2 className="text-3xl font-bold text-white mb-6">1. Introduction</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Cynaps ("we," "our," or "us") operates the medical data annotation platform at cynaps.xyz. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                when you use our platform.
              </p>
              <p className="text-gray-300 leading-relaxed">
                We are committed to protecting the privacy and security of all data processed through our 
                platform, including sensitive medical data and Protected Health Information (PHI). Our 
                practices comply with applicable privacy laws including GDPR, HIPAA, and other healthcare 
                data protection regulations.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-white mb-4">2.1 Account Information</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Name, email address, and contact details</li>
                <li>Organization/company name and business details</li>
                <li>Payment and billing information</li>
                <li>Profile information and credentials</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">2.2 Usage Data</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mb-6">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information and identifiers</li>
                <li>Annotation activity and performance metrics</li>
                <li>Communication records with our support team</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-4">2.3 Client Data (Medical/Healthcare Data)</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                Our clients upload medical imaging data, clinical documents, and other healthcare-related 
                content for annotation. This may include Protected Health Information (PHI). We process 
                this data solely on behalf of our clients as a data processor/business associate.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">Service Delivery:</strong> To provide and maintain our annotation platform</li>
                <li><strong className="text-white">Account Management:</strong> To manage your account, process payments, and provide support</li>
                <li><strong className="text-white">Quality Assurance:</strong> To monitor annotation quality and platform performance</li>
                <li><strong className="text-white">Security:</strong> To detect, prevent, and address fraud and security issues</li>
                <li><strong className="text-white">Communication:</strong> To send service updates, newsletters (with consent), and support responses</li>
                <li><strong className="text-white">Compliance:</strong> To comply with legal obligations and enforce our terms</li>
                <li><strong className="text-white">Improvement:</strong> To analyze usage patterns and improve our services</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">4. Data Security</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We implement industry-leading security measures to protect your data:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>End-to-end encryption using TLS 1.3 for data in transit</li>
                <li>AES-256 encryption for data at rest</li>
                <li>Role-based access control (RBAC) and multi-factor authentication</li>
                <li>Regular security audits and penetration testing</li>
                <li>SOC 2 Type II compliant infrastructure</li>
                <li>Secure data centers with physical access controls</li>
                <li>Automatic PHI redaction capabilities</li>
                <li>Comprehensive audit logging and monitoring</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">5. Data Sharing and Disclosure</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell your personal information. We may share data only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">With Annotators:</strong> Client data is shared with vetted, trained annotators solely for annotation purposes</li>
                <li><strong className="text-white">Service Providers:</strong> Trusted third-party services for hosting, payment processing, and analytics</li>
                <li><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or to protect rights and safety</li>
                <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                <li><strong className="text-white">With Consent:</strong> When you have given explicit consent for specific sharing</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">6. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We retain data for as long as necessary to provide our services and comply with legal obligations:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">Account Data:</strong> Retained while your account is active, plus 30 days after deletion request</li>
                <li><strong className="text-white">Client Project Data:</strong> Retained according to client instructions and agreements, typically deleted upon project completion or client request</li>
                <li><strong className="text-white">Payment Records:</strong> Retained for 7 years for tax and audit compliance</li>
                <li><strong className="text-white">Annotator Records:</strong> Retained for quality assurance and compliance purposes</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">7. Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">Access:</strong> Request a copy of your personal data</li>
                <li><strong className="text-white">Correction:</strong> Request correction of inaccurate data</li>
                <li><strong className="text-white">Deletion:</strong> Request deletion of your personal data</li>
                <li><strong className="text-white">Portability:</strong> Receive your data in a portable format</li>
                <li><strong className="text-white">Objection:</strong> Object to certain processing activities</li>
                <li><strong className="text-white">Restriction:</strong> Request restriction of processing</li>
                <li><strong className="text-white">Withdraw Consent:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                To exercise these rights, contact us at <a href="mailto:privacy@cynaps.xyz" className="text-purple-400 hover:text-purple-300">privacy@cynaps.xyz</a>
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">8. HIPAA Compliance</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                When processing Protected Health Information (PHI) on behalf of covered entities, we act 
                as a Business Associate under HIPAA. We:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Execute Business Associate Agreements (BAA) with healthcare clients</li>
                <li>Implement required administrative, physical, and technical safeguards</li>
                <li>Train all staff and annotators on HIPAA requirements</li>
                <li>Report any security incidents or breaches as required</li>
                <li>Maintain comprehensive audit trails</li>
              </ul>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">9. Cookies and Tracking</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use cookies and similar technologies for:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li><strong className="text-white">Essential Cookies:</strong> Required for platform functionality and security</li>
                <li><strong className="text-white">Analytics Cookies:</strong> To understand usage patterns and improve services</li>
                <li><strong className="text-white">Preference Cookies:</strong> To remember your settings and preferences</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                You can manage cookie preferences through your browser settings.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">10. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                Our servers are located in secure data centers. When data is transferred internationally, 
                we ensure appropriate safeguards are in place, including Standard Contractual Clauses for 
                EU data transfers and compliance with applicable data localization requirements.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">11. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our platform is not intended for use by individuals under 18 years of age. We do not 
                knowingly collect personal information from children. If we become aware of such collection, 
                we will take steps to delete the information.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">12. Changes to This Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of material changes by 
                posting the new policy on this page and updating the "Last updated" date. Your continued 
                use of the platform after changes constitutes acceptance of the updated policy.
              </p>
            </SmoothSection>

            <SmoothSection className="mb-12">
              <h2 className="text-3xl font-bold text-white mb-6">13. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6">
                <p className="text-gray-300 mb-2"><strong className="text-white">Cynaps</strong></p>
                <p className="text-gray-300 mb-2">Email: <a href="mailto:privacy@cynaps.xyz" className="text-purple-400 hover:text-purple-300">privacy@cynaps.xyz</a></p>
                <p className="text-gray-300 mb-2">General Inquiries: <a href="mailto:support@cynaps.xyz" className="text-purple-400 hover:text-purple-300">support@cynaps.xyz</a></p>
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

PrivacyPolicyPage.title = "Privacy Policy";
PrivacyPolicyPage.path = "/privacy";
PrivacyPolicyPage.exact = true;
