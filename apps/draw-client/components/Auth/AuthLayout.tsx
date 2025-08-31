'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { Palette, ArrowLeft } from 'lucide-react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  showBackButton?: boolean;
}

export default function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true 
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      
      <div className="relative z-10 flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Palette className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold">DevPort Draw</span>
              </div>
              <h1 className="text-4xl font-bold mb-4 leading-tight">
                Transform Ideas Into
                <span className="block text-blue-200">Visual Reality</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed max-w-md">
                Join thousands of creators who bring their ideas to life with our collaborative drawing platform.
              </p>
            </div>
            
            {/* Feature highlights */}
            <div className="space-y-4 max-w-md">
              {[
                "Real-time collaboration",
                "Infinite canvas",
                "Professional tools",
                "Cloud synchronization"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                  <span className="text-blue-100">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-10 right-10 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-10 left-10 w-24 h-24 border border-white/20 rounded-full"></div>
        </div>
        
        {/* Right side - Auth form */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-md">
            {/* Back button */}
            {showBackButton && (
              <Link 
                href="/"
                className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors mb-8 group"
              >
                <ArrowLeft className="mt-10 w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                <div className='mt-10'>Back to home</div>
              </Link>
            )}
            
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center justify-center mb-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DevPort Draw
                </span>
              </div>
            </div>
            
            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {title}
              </h2>
              <p className="text-gray-600">
                {subtitle}
              </p>
            </div>
            
            {/* Form content */}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}