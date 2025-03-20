
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-museum-50 dark:bg-museum-900 border-t border-museum-100 dark:border-museum-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Museum Info */}
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-museum-900 dark:text-white">ArtMuseo</h3>
            <p className="text-museum-600 dark:text-museum-300 text-sm max-w-xs">
              Discover art, history, and culture in our world-class museum featuring exhibitions from around the globe.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="text-museum-500 hover:text-accent-700 dark:text-museum-400 dark:hover:text-accent-400 transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-museum-500 hover:text-accent-700 dark:text-museum-400 dark:hover:text-accent-400 transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-museum-500 hover:text-accent-700 dark:text-museum-400 dark:hover:text-accent-400 transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-museum-500 hover:text-accent-700 dark:text-museum-400 dark:hover:text-accent-400 transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-medium text-museum-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/tickets" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  {t('nav.tickets')}
                </Link>
              </li>
              <li>
                <Link to="/exhibitions" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  {t('nav.exhibitions')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <a href="#" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-museum-600 dark:text-museum-300 hover:text-accent-700 dark:hover:text-accent-400 text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
          
          {/* Opening Hours */}
          <div>
            <h4 className="font-medium text-museum-900 dark:text-white mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between text-museum-600 dark:text-museum-300">
                <span>Monday</span>
                <span>Closed</span>
              </li>
              <li className="flex justify-between text-museum-600 dark:text-museum-300">
                <span>Tuesday - Friday</span>
                <span>10:00 - 18:00</span>
              </li>
              <li className="flex justify-between text-museum-600 dark:text-museum-300">
                <span>Saturday - Sunday</span>
                <span>09:00 - 20:00</span>
              </li>
              <li className="flex justify-between text-museum-600 dark:text-museum-300">
                <span>Public Holidays</span>
                <span>10:00 - 16:00</span>
              </li>
            </ul>
            <p className="mt-4 text-sm text-museum-600 dark:text-museum-300">
              Last admission is 1 hour before closing.
            </p>
          </div>
          
          {/* Contact Information */}
          <div>
            <h4 className="font-medium text-museum-900 dark:text-white mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-sm">
                <MapPin className="h-5 w-5 text-accent-700 dark:text-accent-400 mt-0.5 flex-shrink-0" />
                <span className="text-museum-600 dark:text-museum-300">
                  123 Art Avenue, Cultural District,<br />City, Country, 12345
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Phone className="h-5 w-5 text-accent-700 dark:text-accent-400 flex-shrink-0" />
                <span className="text-museum-600 dark:text-museum-300">
                  +91 9313023069<br />
                  +91 9104800589
                </span>
              </li>
              <li className="flex items-center space-x-3 text-sm">
                <Mail className="h-5 w-5 text-accent-700 dark:text-accent-400 flex-shrink-0" />
                <span className="text-museum-600 dark:text-museum-300">
                  chaudharyjasmin645@gmail.com
                  anshulavaiya@gmail.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="pt-8 mt-8 border-t border-museum-200 dark:border-museum-800 text-center">
          <p className="text-sm text-museum-500 dark:text-museum-400">
            &copy; {currentYear} ArtMuseo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
