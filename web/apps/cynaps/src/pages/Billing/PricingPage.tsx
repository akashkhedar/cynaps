import React, { useState, useEffect } from 'react';
import { billingApi, SubscriptionPlan, CreditPackage } from '../../services/billingApi';
import { Spinner } from "@cynaps/ui";
import './PricingPage.css';
import { Activity, ShieldCheck, Zap, Users, BarChart3, Download, Check } from 'lucide-react';

// Icons for Features
const MedicalIcon = () => <Activity color="#8b5cf6" size={32} strokeWidth={1.5} />;
const SecurityIcon = () => <ShieldCheck color="#8b5cf6" size={32} strokeWidth={1.5} />;
const SpeedIcon = () => <Zap color="#8b5cf6" size={32} strokeWidth={1.5} />;
const TeamIcon = () => <Users color="#8b5cf6" size={32} strokeWidth={1.5} />;
const AnalyticsIcon = () => <BarChart3 color="#8b5cf6" size={32} strokeWidth={1.5} />;
const ExportIcon = () => <Download color="#8b5cf6" size={32} strokeWidth={1.5} />;
const CheckIcon = () => <Check size={16} strokeWidth={2.5} />;

interface PricingPageProps {
  onPurchase?: (planId: number, type: 'subscription' | 'credits') => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onPurchase }) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    loadPricingData();
  }, []);

  const loadPricingData = async () => {
    try {
      setLoading(true);
      const [plansData, packagesData] = await Promise.all([
        billingApi.getSubscriptionPlans(),
        billingApi.getCreditPackages(),
      ]);
      setPlans(plansData);
      setPackages(packagesData);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load pricing from API:', err);
      setError('Failed to load pricing plans. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = plans.filter(plan => plan.billing_cycle === billingCycle);

  const handleSelectPlan = (planId: number) => {
    if (onPurchase) {
      onPurchase(planId, 'subscription');
    }
  };

  const handleSelectPackage = (packageId: number) => {
    if (onPurchase) {
      onPurchase(packageId, 'credits');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitting(true);

    try {
      const pData = {
        name: contactForm.name,
        email: contactForm.email,
        company: contactForm.company,
        subject: `Enterprise Inquiry: ${contactForm.company}`,
        message: `Phone: ${contactForm.phone}\n\n${contactForm.message}`
      };

      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pData)
      });

      if (!response.ok) {
        throw new Error('Failed to send enterprise inquiry message');
      }

      console.log('Enterprise Contact form submitted via API');
      setContactSuccess(true);

      // Reset form after 2 seconds
      setTimeout(() => {
        setShowContactModal(false);
        setContactSuccess(false);
        setContactForm({
          name: '',
          email: '',
          company: '',
          phone: '',
          message: '',
        });
      }, 2000);
    } catch (error) {
      console.error('Error submitting enterprise contact form:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleContactFormChange = (field: string, value: string) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="pricing-page">
        <div className="pricing-loading">
          <Spinner size={64} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pricing-page">
        <div className="pricing-error">
          <h3>Error loading pricing</h3>
          <p>{error}</p>
          <button onClick={loadPricingData}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="pricing-page">
      <div className="pricing-header">
        <h1>Choose Your Plan</h1>
        <p className="pricing-subtitle">
          Flexible pricing for teams of all sizes. Pay as you go or subscribe for better rates.
        </p>
      </div>

      {/* Subscription Plans Section */}
      <section className="pricing-section">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2>Subscription Plans</h2>
          <div className="billing-cycle-toggle">
            <button
              className={billingCycle === 'monthly' ? 'active' : ''}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button
              className={billingCycle === 'annual' ? 'active' : ''}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="badge">Save 15-20%</span>
            </button>
          </div>
        </div>

        <div className="pricing-cards">
          {filteredPlans.map((plan) => (
            <div key={plan.id} className={`pricing-card ${plan.plan_type}`}>
              <div className="card-header">
                <h3>{plan.name.replace(` - ${billingCycle === 'monthly' ? 'Monthly' : 'Annual'}`, '')}</h3>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{plan.price_inr.toLocaleString()}</span>
                  <span className="period"> / {billingCycle === 'monthly' ? 'month' : 'year'}</span>
                </div>
                <div className="effective-rate" style={{ color: '#10b981', fontWeight: 600 }}>
                  Gets you {plan.credits_per_month.toLocaleString()} Credits / {billingCycle === 'monthly' ? 'month' : 'year'}
                </div>
              </div>

              <div className="card-body">
                <ul className="features">
                  <li>
                    <span className="icon"><CheckIcon /></span>
                    <strong>{plan.credits_per_month.toLocaleString()}</strong> credits per month
                  </li>
                  <li>
                    <span className="icon"><CheckIcon /></span>
                    <strong>{plan.storage_gb} GB</strong> storage
                  </li>
                  <li className="sub-feature">
                    <span className="icon" style={{ opacity: 0.5 }}><CheckIcon /></span>
                    <span style={{ color: '#9ca3af', fontSize: '0.85em' }}>
                      +{plan.extra_storage_rate_per_gb} credits/GB for extra storage
                    </span>
                  </li>
                  <li>
                    <span className="icon"><CheckIcon /></span>
                    {plan.max_users ? `Up to ${plan.max_users} users` : 'Unlimited users'}
                  </li>
                  {plan.priority_support && (
                    <li>
                      <span className="icon"><CheckIcon /></span>
                      Priority support
                    </li>
                  )}
                  {plan.api_access && (
                    <li>
                      <span className="icon"><CheckIcon /></span>
                      Full API access
                    </li>
                  )}
                </ul>
              </div>

              <div className="card-footer">
                <button
                  className="btn-select-plan"
                  onClick={() => handleSelectPlan(plan.id)}
                >
                  Choose {plan.plan_type.charAt(0).toUpperCase() + plan.plan_type.slice(1)}
                </button>
              </div>
            </div>
          ))}

          {/* Enterprise Contact Card */}
          <div className="pricing-card enterprise">
            <div className="card-header">
              <h3>Enterprise</h3>
              <div className="price">
                <span className="amount" style={{ fontSize: '2rem' }}>Custom</span>
              </div>
              <div className="effective-rate">
                Tailored for your needs
              </div>
            </div>

            <div className="card-body">
              <ul className="features">
                <li>
                  <span className="icon"><CheckIcon /></span>
                  <strong>Unlimited</strong> credits
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  <strong>Custom</strong> storage
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  Unlimited users
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  24/7 dedicated support
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  Custom integrations
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  SLA guarantees
                </li>
                <li>
                  <span className="icon"><CheckIcon /></span>
                  On-premise deployment
                </li>
              </ul>
            </div>

            <div className="card-footer">
              <button
                className="btn-select-plan"
                onClick={() => setShowContactModal(true)}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Pay As You Go Section */}
      <section className="pricing-section payg-section">
        <div className="section-header" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <h2>Pay As You Go</h2>
          <p>One-time credit purchases. Perfect for trying out or occasional use.</p>
        </div>

        <div className="pricing-cards payg-cards">
          {packages.map((pkg) => (
            <div key={pkg.id} className="pricing-card payg-card">
              <div className="card-header">
                <h3>{pkg.credits.toLocaleString()} Credits</h3>
                <div className="price">
                  <span className="currency">₹</span>
                  <span className="amount">{pkg.price_inr.toLocaleString()}</span>
                </div>
                <div className="rate" style={{ color: '#10b981', fontWeight: 600 }}>
                  Gets you {pkg.credits.toLocaleString()} Credits
                </div>
              </div>

              <div className="card-body">
                <div className="package-info">
                  <p>One-time purchase</p>
                  <p className="note">Credits never expire</p>
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="btn-select-package"
                  onClick={() => handleSelectPackage(pkg.id)}
                >
                  Buy {pkg.credits.toLocaleString()} Credits
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="payg-note">
          <p>
            <strong>Pro tip:</strong> Subscriptions offer better rates (₹1.00-1.25 / credit) compared to PAYG (₹1.30-1.75 / credit).
            Subscribe to save up to 40%!
          </p>
        </div>
      </section>

      {/* Features Comparison */}
      <section className="features-section">
        <h2>What's included in all plans</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon"><MedicalIcon /></div>
            <h4>Medical AI Annotations</h4>
            <p>X-ray, CT, MRI, ECG, and 20+ modalities</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><SecurityIcon /></div>
            <h4>Secure & Compliant</h4>
            <p>HIPAA-ready data handling</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><SpeedIcon /></div>
            <h4>Fast Processing</h4>
            <p>Real-time annotation and export</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><TeamIcon /></div>
            <h4>Team Collaboration</h4>
            <p>Manage teams and assign tasks</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><AnalyticsIcon /></div>
            <h4>Analytics Dashboard</h4>
            <p>Track usage and performance</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon"><ExportIcon /></div>
            <h4>Export Formats</h4>
            <p>JSON, COCO, YOLO, and more</p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How do credits work?</h4>
            <p>
              Credits are deducted based on annotation type and data complexity. For example, a bounding box
              on a chest X-ray costs 6 credits (1 base + 5 for bounding box).
            </p>
          </div>
          <div className="faq-item">
            <h4>Can I change plans?</h4>
            <p>
              Yes! You can upgrade or downgrade anytime. Unused credits from subscriptions can be rolled over
              to the next month.
            </p>
          </div>
          <div className="faq-item">
            <h4>Do credits expire?</h4>
            <p>
              All credits (both PAYG and Subscription) never expire and remain in your account permanently.
            </p>
          </div>
          <div className="faq-item">
            <h4>What payment methods?</h4>
            <p>
              We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="modal-overlay" onClick={() => setShowContactModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Enterprise Sales</h2>
              <button className="modal-close" onClick={() => setShowContactModal(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {contactSuccess ? (
              <div className="modal-body">
                <div className="success-message">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h3>Message Sent!</h3>
                  <p>Our team will contact you within 24 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="modal-body">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={contactForm.name}
                    onChange={(e) => handleContactFormChange('name', e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactFormChange('email', e.target.value)}
                    required
                    placeholder="john@company.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="company">Company Name *</label>
                  <input
                    type="text"
                    id="company"
                    value={contactForm.company}
                    onChange={(e) => handleContactFormChange('company', e.target.value)}
                    required
                    placeholder="Your Company"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    value={contactForm.phone}
                    onChange={(e) => handleContactFormChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message *</label>
                  <textarea
                    id="message"
                    value={contactForm.message}
                    onChange={(e) => handleContactFormChange('message', e.target.value)}
                    required
                    rows={4}
                    placeholder="Tell us about your requirements, expected volume, and any specific needs..."
                  />
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setShowContactModal(false)}
                    disabled={contactSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={contactSubmitting}
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

