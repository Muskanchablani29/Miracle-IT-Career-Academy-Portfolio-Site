import React from 'react';

const TailwindExample = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Up Your</span>
            <span className="block text-indigo-600">Skills to Advance</span>
            <span className="block">Your Career Path</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Get hands-on training in the latest technologies and boost your professional journey with our expert-led courses.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <a href="#" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
                Get Started
              </a>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center">
            <span className="mr-2">💬</span>
            <span className="font-medium">Public Speaking</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center">
            <span className="mr-2">🎯</span>
            <span className="font-medium">Career-Oriented</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-full shadow-md flex items-center">
            <span className="mr-2">💡</span>
            <span className="font-medium">Creative Thinking</span>
          </div>
        </div>

        {/* Partners */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-16">
          <p className="text-center font-bold text-lg mb-4">250+ Collaboration</p>
          <div className="flex flex-wrap justify-center gap-8 text-gray-500">
            <span className="text-lg font-semibold">duolingo</span>
            <span className="text-lg font-semibold">Codecov</span>
            <span className="text-lg font-semibold">UserTesting</span>
            <span className="text-lg font-semibold">Magic Leap</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105">
            <div className="p-6">
              <div className="text-2xl mb-2">🚀</div>
              <h3 className="font-bold">Fast Learning</h3>
              <p className="text-gray-600 mt-2">Accelerate your learning with our proven methods</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105">
            <div className="p-6">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-bold">Top Rated</h3>
              <p className="text-gray-600 mt-2">Join our highly rated courses trusted by thousands</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105">
            <div className="p-6">
              <div className="text-2xl mb-2">💻</div>
              <h3 className="font-bold">Hands-on</h3>
              <p className="text-gray-600 mt-2">Practice with real-world projects and scenarios</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all hover:scale-105">
            <div className="p-6">
              <div className="text-2xl mb-2">🔄</div>
              <h3 className="font-bold">Updated</h3>
              <p className="text-gray-600 mt-2">Stay current with regularly updated content</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-100 rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl mb-2">📹</div>
            <div className="text-3xl font-bold">200+</div>
            <div className="text-gray-700">Video Courses</div>
          </div>
          <div className="bg-indigo-100 rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl mb-2">👨‍🏫</div>
            <div className="text-3xl font-bold">250+</div>
            <div className="text-gray-700">Tutors</div>
          </div>
          <div className="bg-indigo-100 rounded-xl shadow-md p-6 text-center">
            <div className="text-2xl mb-2">📘</div>
            <div className="text-3xl font-bold">250+</div>
            <div className="text-gray-700">Online Courses</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindExample;