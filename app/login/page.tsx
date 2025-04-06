'use client';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios'; 
import { useRouter } from 'next/navigation';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: any = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password.trim()) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      const response = await axios.post(`http://192.168.1.16:5000/login`, formData);
      if (response.data.success) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log("saved user:", localStorage.getItem('user'));
        router.push("/");
      } else {
        setMessage(response.data.message || 'Đăng nhập thất bại!');
      }
    } catch (err) {
      console.error('Lỗi khi gửi yêu cầu đăng nhập:', err);
      setMessage('Đã xảy ra lỗi khi đăng nhập.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100">
      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <span className="text-red-600 text-2xl font-bold cursor-pointer">MOVIEFLIX</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 flex justify-center">
        <div className="w-full max-w-md">
          <div className="bg-gray-800/30 rounded-xl p-8 backdrop-blur-sm shadow-xl">
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="item p-2">
                <label htmlFor="email" className="block text-sm font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="item p-2">
                <label htmlFor="password" className="block text-sm font-medium mb-1">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full p-3 bg-gray-700/50 border rounded-lg focus:ring-2 focus:ring-red-500 ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-red-600 cursor-pointer hover:bg-red-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {/* Message */}
              {message && (
                <div className="text-center mt-4 text-sm text-gray-400">
                  <p>{message}</p>
                </div>
              )}

              {/* Link to sign up */}
              <div className="text-center mt-4 text-gray-400">
                Don’t have an account?{' '}
                <Link href="/signup" className="text-red-500 hover:underline">
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
