"use client";

import Image from "next/image";
import {
  Palette,
  Zap,
  Users,
  Download,
  Star,
  ArrowRight,
  Play,
  CheckCircle,
  Layers,
  Smartphone,
  Globe,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                DevPort Draw
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Features
              </a>
              <a
                href="#gallery"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Gallery
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-blue-400 transition-colors"
              >
                Pricing
              </a>
              <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-200">
                <a href="/signup">Get Started</a>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-600 to-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-600 to-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-600 to-orange-700 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  Draw Ideas Into
                  <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Reality
                  </span>
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  The ultimate collaborative drawing tool that transforms your
                  ideas into beautiful diagrams, wireframes, and illustrations.
                  Create, collaborate, and bring your vision to life.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="group bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                   <a href="/signin">Start Drawing Free</a>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-gray-600 text-gray-300 px-8 py-4 rounded-full text-lg font-semibold hover:border-blue-400 hover:text-blue-400 transition-colors duration-300 flex items-center justify-center">
                   <a href="/canvas/guest">Try Now</a>
                </button>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full border-2 border-gray-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full border-2 border-gray-900"></div>
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full border-2 border-gray-900"></div>
                  </div>
                  <span className="ml-3 text-gray-400">
                    Trusted by 10,000+ creators
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-400">4.9/5 rating</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-gray-800 rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300 border border-gray-700">
                <Image
                  src="https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Creative drawing workspace"
                  width={600}
                  height={400}
                  className="rounded-xl"
                  priority
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  ✨ New Features
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-xl shadow-lg transform -rotate-6">
                <Users className="w-6 h-6 mb-2" />
                <div className="text-sm font-semibold">Real-time</div>
                <div className="text-xs">Collaboration</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything you need to create
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Powerful features that make drawing and collaboration effortless
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: "Infinite Canvas",
                description: "Unlimited space for your creativity with smooth panning and zooming",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: Users,
                title: "Real-time Collaboration",
                description: "Work together with your team in real-time, see changes instantly",
                color: "from-purple-500 to-pink-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance ensures smooth drawing experience",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: Layers,
                title: "Smart Layers",
                description: "Organize your work with intelligent layer management",
                color: "from-green-500 to-emerald-500"
              },
              {
                icon: Smartphone,
                title: "Cross Platform",
                description: "Works seamlessly across desktop, tablet, and mobile devices",
                color: "from-indigo-500 to-blue-500"
              },
              {
                icon: Globe,
                title: "Cloud Sync",
                description: "Your work is automatically saved and synced across all devices",
                color: "from-rose-500 to-pink-500"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="group bg-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-gray-600 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:transform hover:scale-105"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              See what others are creating
            </h2>
            <p className="text-xl text-gray-400">
              Join thousands of creators bringing their ideas to life
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                src: "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "UI Wireframes",
                category: "Design"
              },
              {
                src: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Team Brainstorming",
                category: "Collaboration"
              },
              {
                src: "https://images.pexels.com/photos/7688235/pexels-photo-7688235.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Architecture Diagrams",
                category: "Technical"
              },
              {
                src: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Creative Sketches",
                category: "Art"
              },
              {
                src: "https://images.pexels.com/photos/7688347/pexels-photo-7688347.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Process Flows",
                category: "Business"
              },
              {
                src: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600",
                title: "Mind Maps",
                category: "Planning"
              }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 transform hover:scale-105 border border-gray-700"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  width={400}
                  height={300}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="text-sm text-blue-300 mb-1">{item.category}</div>
                  <div className="text-lg font-semibold">{item.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section id="showcase" className="py-20 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4 animate-bounce">
              Built for Modern Teams
            </h2>
            <p className="text-xl text-gray-400">
              From startups to enterprises, see how DevPort Draw transforms workflows
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-3xl font-bold text-white animate-pulse">Real-time Magic</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Watch your ideas come to life as your team collaborates in real-time. See cursors move, 
                strokes appear instantly, and ideas evolve together. No more waiting for updates or 
                version conflicts.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 transition-all duration-300 transform hover:scale-105 animate-pulse">
                  <div className="text-2xl font-bold text-blue-400">50ms</div>
                  <div className="text-sm text-gray-400">Average latency</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300 transform hover:scale-105 animate-pulse">
                  <div className="text-2xl font-bold text-purple-400">100+</div>
                  <div className="text-sm text-gray-400">Concurrent users</div>
                </div>
              </div>
            </div>
            <div className="relative animate-bounce">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 transform hover:rotate-1 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="aspect-video bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl flex items-center justify-center">
                  <div className="text-6xl animate-spin">🎨</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative animate-bounce order-2 lg:order-1">
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700 transform hover:-rotate-1 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="aspect-video bg-gradient-to-br from-green-900/50 to-blue-900/50 rounded-xl flex items-center justify-center">
                  <div className="text-6xl animate-pulse">⚡</div>
                </div>
              </div>
            </div>
            <div className="space-y-6 animate-fade-in order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-white animate-pulse">Lightning Performance</h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Built with cutting-edge technology for blazing-fast performance. Smooth 60fps rendering, 
                instant sync across devices, and optimized for both desktop and mobile experiences.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-green-500 transition-all duration-300 transform hover:scale-105 animate-pulse">
                  <div className="text-xl font-bold text-green-400">60fps</div>
                  <div className="text-xs text-gray-400">Smooth rendering</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-yellow-500 transition-all duration-300 transform hover:scale-105 animate-pulse">
                  <div className="text-xl font-bold text-yellow-400">99.9%</div>
                  <div className="text-xs text-gray-400">Uptime</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-red-500 transition-all duration-300 transform hover:scale-105 animate-pulse">
                  <div className="text-xl font-bold text-red-400">&lt;1s</div>
                  <div className="text-xs text-gray-400">Load time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-bold text-white mb-4 animate-bounce">
              Why Choose DevPort Draw?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              We're not just another drawing tool. We're building the future of visual collaboration.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: "🚀",
                title: "Future-Ready",
                description: "Built with the latest web technologies for maximum performance and reliability"
              },
              {
                icon: "🔒",
                title: "Secure by Design",
                description: "Enterprise-grade security with end-to-end encryption and SOC2 compliance"
              },
              {
                icon: "🌍",
                title: "Global Scale",
                description: "CDN-powered infrastructure ensures fast performance worldwide"
              }
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4 animate-pulse hover:animate-bounce transition-all duration-300">
                <div className="text-6xl mb-4 transform hover:scale-125 hover:rotate-12 transition-all duration-500">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-3xl p-8 border border-gray-700 hover:border-blue-500 transition-all duration-500 animate-pulse hover:shadow-2xl hover:shadow-blue-500/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-white animate-bounce">Join the Revolution</h3>
                <p className="text-gray-300">
                  Be part of a community that's reshaping how we think about visual collaboration. 
                  From quick sketches to complex diagrams, from solo brainstorming to team workshops.
                </p>
                <div className="flex space-x-4">
                  <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-300 animate-pulse">
                    <a href="/signin">Start Creating</a>
                  </button>
                  <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold hover:border-blue-400 hover:text-blue-400 transition-all duration-300 transform hover:scale-105">
                    Learn More
                  </button>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center transform hover:rotate-3 transition-all duration-500 hover:scale-105">
                  <div className="text-8xl animate-spin">✨</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to bring your ideas to life?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using DevPort Draw to visualize their ideas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-110 hover:rotate-1 transition-all duration-300 animate-bounce">
              <a href="/signin">Start Drawing Now</a>
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
              <a href="/canvas/guest">Try Demo</a>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">DevPort Draw</span>
              </div>
              <p className="text-gray-400">
                The ultimate collaborative drawing tool for creators, designers, and teams.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-gray-300 cursor-pointer">Features</div>
                <div className="hover:text-gray-300 cursor-pointer">Templates</div>
                <div className="hover:text-gray-300 cursor-pointer">Integrations</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-gray-300 cursor-pointer">About</div>
                <div className="hover:text-gray-300 cursor-pointer">Blog</div>
                <div className="hover:text-gray-300 cursor-pointer">Careers</div>
                <div className="hover:text-gray-300 cursor-pointer">Contact</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <div className="space-y-2 text-gray-400">
                <div className="hover:text-gray-300 cursor-pointer">Help Center</div>
                <div className="hover:text-gray-300 cursor-pointer">Documentation</div>
                <div className="hover:text-gray-300 cursor-pointer">Community</div>
                <div className="hover:text-gray-300 cursor-pointer">Status</div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm">
              © 2025 DevPort Draw. All rights reserved.
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Privacy</div>
              <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Terms</div>
              <div className="text-gray-400 hover:text-white cursor-pointer transition-colors">Security</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

