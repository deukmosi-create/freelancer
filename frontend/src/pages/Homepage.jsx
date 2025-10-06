import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Homepage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-white">
      {/* Navigation Bar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-gray-900' : 'bg-transparent'} py-4 px-6`}>
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo (Placeholder) */}
          <div className="text-white font-bold text-xl">FreelancerKE</div>
          
          {/* Nav Links */}
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Features', 'How It Works', 'Contact'].map((item) => (
              <a 
                key={item}
                href="#" 
                className="text-white hover:text-orange-400 transition-colors relative group"
              >
                {item}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all group-hover:w-full"></span>
              </a>
            ))}
            {/* Login Link */}
            <Link 
              to="/login" 
              className="text-white hover:text-orange-400 transition-colors relative group"
            >
              Login
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-400 transition-all group-hover:w-full"></span>
            </Link>
          </div>
          
          {/* Get Started Button → Links to /login */}
          <Link to="/login" className="bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-6 rounded-full transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-16 bg-gradient-to-r from-gray-900 via-blue-900 to-teal-700 overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 0 20 L 20 20 L 20 0" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Text Content */}
          <div className="md:w-1/2 text-white">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">
              Work. Earn. Grow.
            </h1>
            {/* UPDATED TAGLINE */}
            <p className="text-lg mb-8">
              Your trusted platform with secure payments and limitless opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Get Started → /login */}
              <Link to="/login" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1">
                Get Started
              </Link>
              {/* Learn More REMOVED */}
            </div>
          </div>

          {/* Illustration (STATIC image) */}
          <div className="md:w-1/2 flex justify-center">
            <div className="w-full max-w-md h-64 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center">
              <img 
                src="https://picsum.photos/600/400?random=1" 
                alt="Freelancers at work" 
                className="rounded-lg shadow-lg max-h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <img 
                src="https://picsum.photos/600/400?random=2" 
                alt="Collaboration" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="md:w-1/2">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-teal-500 text-white p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v3m-6-3a3 3 0 116 0v3a3 3 0 116 0v3" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l6-6m0 0l6 6M9 18l6-6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                    <p>Get paid via M-Pesa, Airtel Money, PayPal, or bank transfer — all transactions are encrypted and protected.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-orange-500 text-white p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Fast Task Matching</h3>
                    <p>Our smart algorithm connects you with tasks that match your skills within minutes — no waiting.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="bg-gray-800 text-white p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11.69A24.02 24.02 0 0112 12c2.57 0 5.09-.47 7.48-1.31a24.02 24.02 0 011.78 5.87 24.02 24.02 0 01-1.78 5.87m-11.44 0a24.02 24.02 0 011.78-5.87m0 0a24.02 24.02 0 011.78 5.87m11.44 0a24.02 24.02 0 01-1.78-5.87m0 0a24.02 24.02 0 011.78-5.87" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Local Opportunities</h3>
                    <p>Connect with clients across Kenya — from Nairobi to Mombasa, Kisumu to Eldoret — find work close to home.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Profile Builder", icon: "👤", desc: "Create a professional profile that showcases your skills and experience." },
              { title: "Task Dashboard", icon: "📋", desc: "Browse, filter, and apply to tasks that match your expertise." },
              { title: "Payment Tracker", icon: "💰", desc: "Track your earnings and get paid securely via M-Pesa, PayPal, or bank transfer." },
              { title: "Messaging System", icon: "💬", desc: "Communicate directly with clients through our built-in messaging platform." }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white text-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl hover:transform hover:-translate-y-1 transition-all duration-300 border border-teal-500 hover:border-teal-400"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {[
              { step: 1, title: "Sign Up", desc: "Create your free account in under 2 minutes." },
              { step: 2, title: "Activate", desc: "Pay KES 300 to unlock full access to tasks." },
              { step: 3, title: "Browse Tasks", desc: "Apply to tasks that match your skills and start earning." }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="bg-orange-500 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-teal-100">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Freelancers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Jane Wanjiru", role: "Graphic Designer", quote: "I've earned over KES 50,000 in just 3 months. The platform is easy to use and payments are always on time." },
              { name: "Samuel Omondi", role: "Web Developer", quote: "The task matching is spot on — I only get offers that fit my skills. Highly recommend!" },
              { name: "Amina Hassan", role: "Content Writer", quote: "As a mom of two, I love being able to work from home. This platform has changed my life." }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                    <span className="text-xl font-bold text-gray-600">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Freelance Journey?</h2>
          {/* Get Started → /login */}
          <Link to="/login" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Get Started
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-white font-bold text-xl mb-4">FreelancerKE</div>
              <p className="text-gray-400">Helping Kenyan freelancers find work, earn money, and grow their careers.</p>
            </div>
            <div>
              <h3 className="font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'About', 'Features', 'How It Works', 'Contact'].map((item) => (
                  <li key={item}><a href="#" className="text-gray-400 hover:text-white">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li><a href="mailto:support@freelancerke.com" className="text-gray-400 hover:text-white">support@freelancerke.com</a></li>
                <li><a href="tel:+254791043674" className="text-gray-400 hover:text-white">+254 791 043 674</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-4 text-center text-gray-500 text-sm">
            © 2025 FreelancerKE. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}