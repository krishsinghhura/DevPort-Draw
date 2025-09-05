"use client";

import { Github } from "lucide-react";
import AuthButton from "./AuthButton";

interface SocialAuthProps {
  mode: "signin" | "signup";
}

export default function SocialAuth({ mode }: SocialAuthProps) {
  const handleGoogleAuth = () => {
    // Implement Google OAuth logic here
    console.log(`${mode} with Google`);
  };

  const handleGithubAuth = () => {
    // Implement GitHub OAuth logic here
    console.log(`${mode} with GitHub`);
  };

  return (
    <div className="space-y-4 mb-6">
      <AuthButton 
        type="button" 
        variant="secondary" 
        onClick={handleGoogleAuth}
        className="flex items-center justify-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        <span>Continue with Google</span>
      </AuthButton>

      <AuthButton 
        type="button" 
        variant="secondary" 
        onClick={handleGithubAuth}
        className="flex items-center justify-center space-x-2"
      >
        <Github className="w-5 h-5" />
        <span>Continue with GitHub</span>
      </AuthButton>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 transition-colors">
            Or continue with email
          </span>
        </div>
      </div>
    </div>
  );
}