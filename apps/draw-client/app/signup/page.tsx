"use client";

import { useState,useEffect } from "react";
import Link from "next/link";
import { Eye, EyeOff, Check } from "lucide-react";
import AuthLayout from "@/components/Auth/AuthLayout";
import AuthInput from "@/components/Auth/AuthInput";
import AuthButton from "@/components/Auth/AuthButton";
import SocialAuth from "@/components/Auth/SocialAuth";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const router = useRouter();

  useEffect(()=>{
      const token=localStorage.getItem("token");
      if(token){
        router.push("/dashboard");
      }
    })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${HTTP_BACKEND}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.message || "Failed to sign up" });
        setLoading(false);
        return;
      }

      router.push("/signin");
    } catch (err) {
      console.error("Signup error:", err);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = [
    "bg-red-500 dark:bg-red-400", 
    "bg-orange-500 dark:bg-orange-400", 
    "bg-yellow-500 dark:bg-yellow-400", 
    "bg-blue-500 dark:bg-blue-400", 
    "bg-green-500 dark:bg-green-400"
  ];
  const strengthLabels = ["Very Weak", "Weak", "Fair", "Good", "Strong"];

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join DevPort Draw and start creating amazing diagrams"
    >
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/30 transition-colors">
        <SocialAuth mode="signup" />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.general && (
            <p className="text-sm text-red-600 dark:text-red-400 transition-colors">
              {errors.general}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <AuthInput
              label="First name"
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              error={errors.firstName}
              placeholder="John"
              autoComplete="given-name"
            />
            <AuthInput
              label="Last name"
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              error={errors.lastName}
              placeholder="Doe"
              autoComplete="family-name"
            />
          </div>

          <AuthInput
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            placeholder="john@example.com"
            autoComplete="email"
          />

          <div className="relative">
            <AuthInput
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              error={errors.password}
              placeholder="Create a strong password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
            
            {formData.password && (
              <div className="mt-2">
                <div className="flex space-x-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        i < passwordStrength 
                          ? strengthColors[passwordStrength - 1] 
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors">
                  Password strength: {strengthLabels[passwordStrength - 1] || "Very Weak"}
                </p>
              </div>
            )}
          </div>

          <div className="relative">
            <AuthInput
              label="Confirm password"
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <div className="space-y-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-all ${
                  agreedToTerms 
                    ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500" 
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-400"
                }`}>
                  {agreedToTerms && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed transition-colors">
                I agree to the{" "}
                <Link 
                  href="/terms" 
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link 
                  href="/privacy" 
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.terms && (
              <p className="text-sm text-red-600 dark:text-red-400 animate-fade-in-up transition-colors">
                {errors.terms}
              </p>
            )}
          </div>

          <AuthButton type="submit" loading={loading}>
            Create Account
          </AuthButton>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-300 transition-colors">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
}