import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, Users, Star, CreditCard, PiggyBank, Send } from 'lucide-react';
import { Button } from '../components/Button';
import { LoanCalculator } from '../components/LoanCalculator';
import { ThemeToggle } from '../components/ThemeToggle';
import { useAuth } from '../hooks/useAuth';

export function Home() {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Approval',
      description: 'Get approved for loans in minutes, not days'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Secure & Safe',
      description: 'Bank-level security for all your transactions'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: '24/7 Support',
      description: 'Our team is here to help you anytime'
    }
  ];

  const services = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: 'Personal Loans',
      description: 'Quick access to personal loans with competitive rates',
      color: 'from-brand-500 to-brand-600'
    },
    {
      icon: <PiggyBank className="h-8 w-8" />,
      title: 'Savings & Deposits',
      description: 'Grow your money with high-yield savings accounts',
      color: 'from-accent-teal to-accent-cyan'
    },
    {
      icon: <Send className="h-8 w-8" />,
      title: 'Transfers & Bills',
      description: 'Send money and pay bills instantly with low fees',
      color: 'from-accent-violet to-purple-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Small Business Owner',
      content: 'MyPrime helped me expand my business with a quick loan approval process.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'David Chen',
      role: 'Entrepreneur',
      content: 'The best financial platform I\'ve used. Simple, fast, and reliable.',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Freelancer',
      content: 'Managing my finances has never been easier. Great user experience!',
      rating: 5,
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=100&h=100&fit=crop&crop=face'
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-bgDark">
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-glow">
              <span className="text-white font-bold text-sm">MP</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">MyPrime</span>
          </motion.div>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button variant="primary">Dashboard</Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost">Login</Button>
                <Button variant="primary">Sign Up</Button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Finance,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-accent-teal">
                  Reimagined
                </span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Get instant access to loans, manage your savings, and transfer money seamlessly. 
                Your financial future starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="group shadow-glow hover:shadow-glow-lg"
                >
                  Apply Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">₦5B+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Loans Disbursed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Happy Customers</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">99.9%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Uptime</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              {/* Hero Illustration Placeholder */}
              <div className="relative bg-gradient-to-br from-brand-50 to-accent-teal/10 dark:from-brand-900/20 dark:to-accent-teal/5 rounded-3xl p-8 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent" />
                <div className="relative z-10 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-brand-500 to-accent-teal rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
                    <CreditCard className="h-16 w-16 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Smart Financial Solutions
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Powered by cutting-edge technology
                  </p>
                </div>
                
                {/* Floating Elements */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-4 right-4 w-12 h-12 bg-accent-teal/20 rounded-full blur-sm"
                />
                <motion.div
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-8 left-8 w-8 h-8 bg-accent-violet/20 rounded-full blur-sm"
                />
              </div>
              
              {/* Recommended replacement: loan-hero.svg (1200x800) from Undraw.co or Storyset */}
              <div className="absolute -bottom-4 -right-4 text-xs text-gray-400 dark:text-gray-600">
                💡 Replace with loan-hero.svg
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Complete Financial Services
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to manage your money in one place
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100 dark:border-gray-800 group cursor-pointer"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Calculator Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Calculate Your Loan
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Use our interactive calculator to see your monthly payments and find the perfect loan amount for your needs.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg text-brand-600 flex-shrink-0">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <LoanCalculator />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-glass dark:shadow-glass-dark border border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={`${testimonial.name}'s avatar`}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of satisfied customers and take control of your finances today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="shadow-glow hover:shadow-glow-lg"
              >
                Apply for Loan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">MP</span>
                </div>
                <span className="text-xl font-bold">MyPrime</span>
              </div>
              <p className="text-gray-400">
                Your trusted partner for all financial needs.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Personal Loans</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Savings</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Transfers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bill Payments</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Live Chat</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Call Support</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 MyPrime. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}