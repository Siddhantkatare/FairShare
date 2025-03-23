import React, { useState } from 'react';
import { Receipt, Users, PieChart, ArrowRight, Menu, X } from 'lucide-react';
import { Link } from "react-router-dom";
import { loggedData } from '../lib/config';


function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const loginUser = loggedData(); // Logged-in user
  return (
    <div className="bg-white">
      <nav className="bg-black text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/home" className="flex items-center space-x-2">
            <img src="../../public/Asset 3.png" alt="Fairshare Logo" className="h-8 w-8" />
            <span className="text-2xl font-bold">Fairshare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/home" className="hover:text-gray-300">Home</Link>
            <Link to="/about" className="hover:text-gray-300">About</Link>
            <Link to="/"><button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition">
              Login
            </button></Link>
            <Link to="/"><button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition">
              Sign Up
            </button></Link>
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
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-5xl font-bold text-black mb-6">
              Split Bills Effortlessly with Friends
            </h1>
            <p className="text-gray-600 text-xl mb-8">
              Track expenses, split bills, and manage group finances with ease. Never worry about who owes what again.
            </p>
            <button className="bg-black text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-800 transition">
              Get Started Free
            </button>
          </div>
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80"
              alt="Friends splitting bill"
              className="rounded-lg shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Fairshare?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Receipt className="w-12 h-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-3">Easy Bill Splitting</h3>
              <p className="text-gray-600">Split bills instantly with custom amounts and multiple payment options.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <Users className="w-12 h-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-3">Group Management</h3>
              <p className="text-gray-600">Create and manage multiple groups for different occasions and circles.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <PieChart className="w-12 h-12 text-black mb-4" />
              <h3 className="text-xl font-semibold mb-3">Expense Tracking</h3>
              <p className="text-gray-600">Keep track of all expenses with detailed reports and insights.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-black text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Splitting Bills?</h2>
          <p className="text-xl mb-8">Join thousands of users who make group expenses stress-free with Fairshare.</p>
          <button className="bg-white text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-200 transition inline-flex items-center">
            Get Started <ArrowRight className="ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Home;