import React from 'react';
import { Heart, Dumbbell, Apple, TrendingUp, Mail, Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-green-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Dumbbell className="w-8 h-8 text-green-400" />
              <h3 className="text-2xl font-bold">IntelliFit</h3>
            </div>
            <p className="text-blue-200 mb-4 leading-relaxed">
              Your intelligent fitness companion. Track workouts, get personalized diet plans, 
              and achieve your health goals with AI-powered insights.
            </p>
            <div className="flex items-center gap-2 text-green-300">
              <Heart className="w-5 h-5 animate-pulse" />
              <span className="text-sm">Made with passion for your health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-blue-200 hover:text-white transition flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/workouts" className="text-blue-200 hover:text-white transition flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Workouts
                </a>
              </li>
              <li>
                <a href="/diet" className="text-blue-200 hover:text-white transition flex items-center gap-2">
                  <Apple className="w-4 h-4" />
                  Diet Plan
                </a>
              </li>
              <li>
                <a href="/tutorials" className="text-blue-200 hover:text-white transition flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" />
                  Tutorials
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-green-300">Features</h4>
            <ul className="space-y-2 text-blue-200">
              <li>✓ AI-Powered Diet Plans</li>
              <li>✓ Workout Tracking</li>
              <li>✓ BMI Monitoring</li>
              <li>✓ Calorie Calculator</li>
              <li>✓ Progress Analytics</li>
              <li>✓ Diet Bot Assistant</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-blue-700 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-blue-200 text-sm text-center md:text-left">
            © {currentYear} IntelliFit. All rights reserved. | Built with React & Node.js
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a 
              href="mailto:support@intellifit.com" 
              className="text-blue-200 hover:text-white transition"
              title="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition"
              title="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition"
              title="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-200 hover:text-white transition"
              title="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Extra Info */}
        <div className="mt-6 text-center text-xs text-blue-300">
          <p>Track your fitness journey • Achieve your goals • Stay healthy 💪</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
