import React from 'react';
import { ShieldCheck, Mail, BookOpen, Smartphone, FileText, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400 bg-brand-500/10 px-3 py-1 rounded-full border border-brand-500/20">
            About Avazas Books
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Securing Knowledge for the Digital Era
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Avazas Books is a commercial digital publication marketplace dedicated to delivering premium technical, scientific, and professional e-books with end-to-end Readium LCP content protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Readium LCP DRM</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every digital publication is cryptographically protected with AES-256 encryption. Authors and publishers retain complete intellectual property security.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Offline Android Reader</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Our native Android reader allows secure offline reading with hardware device binding, screen protection, and multi-device synchronization.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold">Instant Entitlements</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Seamless one-click purchases with Cashfree Payment Gateway, giving customers instant access to their digital library across registered devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">Get In Touch</span>
          <h1 className="text-3xl font-extrabold mt-1">Contact Avazas Support</h1>
          <p className="text-sm text-slate-400 mt-2">
            Have questions regarding book purchases, DRM licensing, or publisher partnerships? We are here to assist.
          </p>
        </div>

        <div className="space-y-4 text-sm text-slate-300">
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <Mail className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-xs text-slate-400">Support Email</p>
              <p className="font-semibold text-white">support@avazas.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
            <FileText className="w-5 h-5 text-brand-400" />
            <div>
              <p className="text-xs text-slate-400">Publisher Inquiries</p>
              <p className="font-semibold text-white">publishers@avazas.com</p>
            </div>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert('Message received! Our support team will get back to you within 24 hours.'); }} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="Your Name"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
            <input
              type="text"
              required
              placeholder="Order / Reader / Partnership Inquiry"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Message</label>
            <textarea
              rows={4}
              required
              placeholder="How can we help you?"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500 resize-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold transition-all shadow-lg shadow-brand-500/25"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">Compliance & Privacy</span>
          <h1 className="text-3xl font-extrabold mt-1">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-2">Effective Date: November 2026 | Avazas Books</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
            <p>
              Avazas Books collects account information (name, email address, password hashes), payment transactional metadata (processed securely via Cashfree), and device identifiers for DRM authorization (hardware signature, Android OS version) required to bind offline reading licenses.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Readium LCP DRM & Device Binding</h2>
            <p>
              To protect copyrighted digital publications against unauthorized distribution, each user may authorize up to three (3) personal Android devices. Hardware identifiers are stored in a hashed, encrypted format strictly for license validation.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Payment Information</h2>
            <p>
              We do not store your credit card, debit card, or UPI credentials on our servers. All financial transactions are directly handled by Cashfree Payments India Pvt Ltd conforming to RBI standards and PCI-DSS Level 1 certification.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">4. Data Deletion Requests</h2>
            <p>
              Customers have the right to request deletion of their account and personal data by contacting support@avazas.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">Legal Agreement</span>
          <h1 className="text-3xl font-extrabold mt-1">Terms of Service</h1>
          <p className="text-xs text-slate-400 mt-2">Last Updated: November 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing Avazas Books website and reader application, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Digital Entitlement & DRM Restrictions</h2>
            <p>
              Purchasing a digital publication grants a personal, non-exclusive, non-transferable license to read the publication via authorized Avazas reader applications. Unrestricted, unencrypted copies of publications are never distributed. Attempting to reverse-engineer, circumvent DRM encryption, or dump decrypted memory violates international copyright law.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Device Authorization Limits</h2>
            <p>
              Each customer account is allowed an active maximum limit of three (3) simultaneous registered devices. Device slots may be managed from your customer dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const RefundPolicyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-brand-400">Customer Protection</span>
          <h1 className="text-3xl font-extrabold mt-1">Refund & Cancellation Policy</h1>
          <p className="text-xs text-slate-400 mt-2">Last Updated: November 2026</p>
        </div>

        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">1. Digital Publications Nature</h2>
            <p>
              Because digital goods and DRM licenses are instantly provisioned upon payment confirmation, standard retail return policies do not apply.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">2. Eligibility for Refund</h2>
            <ul className="list-disc pl-5 space-y-1 text-slate-400">
              <li>Duplicate billing caused by network interruptions during Cashfree processing.</li>
              <li>Technical inability to download or decrypt the publication due to verified server-side DRM license generation failure within 7 days of purchase.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-white">3. Refund Processing</h2>
            <p>
              Approved refunds are credited back to the original payment source (UPI, Netbanking, or Card) via Cashfree within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
