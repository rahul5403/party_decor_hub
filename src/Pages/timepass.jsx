import React from 'react';
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin } from 'lucide-react';

function App() {
  return (
    <footer className="bg-gradient-to-b from-white to-green-50 text-green-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold">
              <span className="text-red-600">PARTY</span>{' '}
              <span className="text-green-900">DECOR</span>{' '}
              <span className="text-red-600">HUB</span>
            </h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-700 flex-shrink-0 mt-1" />
                <p className="text-green-800">A-800, GD Colony, Mayur Vihar Phase-3, DELHI -110096</p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-700" />
                <a href="tel:+917011676961" className="text-green-700 hover:text-red-600 transition">
                  +91 7011676961
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-700" />
                <a href="mailto:info@gmail.com" className="text-green-700 hover:text-red-600 transition">
                  info@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-900 pb-2 border-b-2 border-green-200 inline-block">
              Services
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/party" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🎈</span>
                  Decoration Items
                </a>
              </li>
              <li>
                <a href="/decoration" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🎨</span>
                  Decoration Services
                </a>
              </li>
              <li>
                <a href="/disposable" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🛍️</span>
                  Disposable Items
                </a>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-900 pb-2 border-b-2 border-green-200 inline-block">
              About Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">💡</span>
                  Our Mission
                </a>
              </li>
              <li>
                <a href="/about" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🌎</span>
                  Impact
                </a>
              </li>
            </ul>
          </div>

          {/* Our Policies */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-green-900 pb-2 border-b-2 border-green-200 inline-block">
              Our Policies
            </h3>
            <ul className="space-y-4">
              <li>
                <a href="/privacy-policy" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🔒</span>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/refund-policy" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">💰</span>
                  Refund & Return Policy
                </a>
              </li>
              <li>
                <a href="/shipping-policy" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">🚚</span>
                  Shipping Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="flex items-center text-green-700 hover:text-red-600 transition">
                  <span className="mr-2">📜</span>
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-green-200">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-green-800">
              Made with ❤️ by{' '}
              <a
                href="https://pixeladsmedia.com"
                className="text-red-600 font-semibold hover:text-red-700 transition"
              >
                Pixel Ads Media
              </a>{' '}
              | © 2025
            </p>
            <div className="flex items-center space-x-6">
              <a
                href="#"
                className="text-green-700 hover:text-red-600 transition"
                aria-label="Facebook"
              >
                <Facebook className="w-6 h-6" />
              </a>
              <a
                href="https://www.instagram.com/partydecorhub_/?utm_source=qr#"
                target="_blank"
                className="text-green-700 hover:text-red-600 transition"
                aria-label="Instagram"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href="#"
                className="text-green-700 hover:text-red-600 transition"
                aria-label="YouTube"
              >
                <Youtube className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default App;