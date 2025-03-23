import React, { useState } from 'react';
import { Shield, Target, Heart, X, Menu } from 'lucide-react';
import { Link } from "react-router-dom";

function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <div className="bg-white">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <img src="../../public/Asset 3.png" alt="Fairshare Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold">Fairshare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="hover:text-gray-300">Home</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            <button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
              Login
            </button>
            <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-black p-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:text-gray-300">Home</Link>
              <Link to="/about" className="hover:text-gray-300">About</Link>
              <button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
                Login
              </button>
              <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
                Sign Up
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">About Fairshare</h1>
          <p className="text-xl text-gray-600">
            We're on a mission to make group finances simple and stress-free for everyone.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
              <p className="text-gray-600">Your financial data is always protected with bank-level security.</p>
            </div>
            <div className="text-center">
              <Target className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">Our Mission</h3>
              <p className="text-gray-600">Making expense sharing accessible and hassle-free for everyone.</p>
            </div>
            <div className="text-center">
              <Heart className="w-16 h-16 text-black mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">User First</h3>
              <p className="text-gray-600">Built with love and care for the best user experience.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;