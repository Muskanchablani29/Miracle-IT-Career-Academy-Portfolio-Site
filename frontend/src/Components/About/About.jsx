// import React from 'react'
// import * as echarts from 'echarts'
// import './About.css'

// export default function About() {
//   return (
//     <>
//       <header className="bg-white shadow-sm sticky top-0 z-50">
//         <div className="container mx-auto px-4 py-4 flex items-center justify-between">
//           <div className="flex items-center">
//             <h1 className="text-2xl font-['Pacifico'] text-primary">logo</h1>
//           </div>
//           <nav className="hidden md:flex space-x-8">
//             <a href="#" className="text-primary hover:text-secondary font-medium">Home</a>
//             <a href="#" className="text-gray-600 hover:text-secondary font-medium">Courses</a>
//             <a href="#" className="text-gray-600 hover:text-secondary font-medium">Teachers</a>
//             <a href="#" className="text-gray-600 hover:text-secondary font-medium">Testimonials</a>
//             <a href="#" className="text-gray-600 hover:text-secondary font-medium">AI Tools</a>
//             <a href="#" className="text-gray-600 hover:text-secondary font-medium">Contact</a>
//           </nav>
//           <div className="flex items-center space-x-4">
//             <button className="bg-white text-primary border border-primary px-4 py-2 rounded-button whitespace-nowrap hover:bg-gray-50 transition-all">Log In</button>
//             <button className="bg-secondary text-white px-4 py-2 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all">Register</button>
//             <button className="md:hidden w-10 h-10 flex items-center justify-center">
//               <i className="ri-menu-line ri-lg"></i>
//             </button>
//           </div>
//         </div>
//       </header>

//       <section className="hero-section relative">
//         <div className="hero-overlay w-full">
//           <div className="container mx-auto px-4 py-16">
//             <div className="flex flex-col md:flex-row items-center">
//               <div className="w-full md:w-1/2 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//                 <div className="text-secondary uppercase tracking-wider font-semibold mb-2">ABOUT US</div>
//                 <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Our Education System <span className="text-secondary">Inspires</span> You More.</h1>
//                 <p className="text-gray-700 mb-8 max-w-lg">From cutting-edge curriculum to personalized learning paths, we've created a comprehensive computer training experience that goes beyond the ordinary. Join us and discover what makes our approach unique.</p>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                     <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                       <i className="ri-computer-line ri-lg text-white"></i>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg mb-2">Modern Services</h3>
//                       <p className="text-gray-600 text-sm">Access to the latest technology and cutting-edge learning tools</p>
//                     </div>
//                   </div>
//                   <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                     <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                       <i className="ri-global-line ri-lg text-white"></i>
//                     </div>
//                     <div>
//                       <h3 className="font-semibold text-lg mb-2">International Help</h3>
//                       <p className="text-gray-600 text-sm">Join students from over 30 countries in our global learning community</p>
//                     </div>
//                   </div>
//                 </div>
//                 <div className="flex flex-wrap items-center gap-4">
//                   <button className="bg-secondary text-white px-6 py-3 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all flex items-center">
//                     <span>Contact Now</span>
//                     <i className="ri-arrow-right-line ml-2"></i>
//                   </button>
//                   <div className="flex items-center">
//                     <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
//                       <i className="ri-phone-line text-white"></i>
//                     </div>
//                     <span className="text-primary font-semibold">+1 555 123 4567</span>
//                   </div>
//                 </div>
//               </div>
//               <div className="w-full md:w-1/2 mt-10 md:mt-0 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//                 <img src="https://readdy.ai/api/search-image?query=diverse%2520students%2520working%2520on%2520computers%2520in%2520a%2520modern%2520lab%2520environment%2C%2520focused%2520on%2520programming%2C%2520data%2520analysis%2C%2520and%2520design%2C%2520bright%2520and%2520professional%2520setting%2C%2520high-quality%2520equipment%2C%2520collaborative%2520learning%2520environment%2C%2520clean%2520and%2520organized%2520workspace&width=600&height=400&seq=3&orientation=landscape" alt="Students learning" className="rounded-xl shadow-lg object-cover object-top" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="stats-section relative">
//         <div className="stats-overlay py-16">
//           <div className="container mx-auto px-4">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
//               <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//                 <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <i className="ri-user-line ri-2x"></i>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2"><span className="counter-value">500</span>+</h3>
//                 <p className="text-white text-opacity-80">Total Students</p>
//               </div>
//               <div className="animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//                 <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <i className="ri-group-line ri-2x"></i>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2"><span className="counter-value">1900</span>+</h3>
//                 <p className="text-white text-opacity-80">Class Members</p>
//               </div>
//               <div className="animate-fadeIn" style={{ animationDelay: '0.6s' }}>
//                 <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <i className="ri-emotion-happy-line ri-2x"></i>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2"><span className="counter-value">750</span>+</h3>
//                 <p className="text-white text-opacity-80">Satisfied Customers</p>
//               </div>
//               <div className="animate-fadeIn" style={{ animationDelay: '0.8s' }}>
//                 <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
//                   <i className="ri-award-line ri-2x"></i>
//                 </div>
//                 <h3 className="text-4xl font-bold mb-2"><span className="counter-value">30</span>+</h3>
//                 <p className="text-white text-opacity-80">Expert Awards</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular <span className="text-secondary">Courses</span></h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Discover our most sought-after training programs designed to equip you with in-demand skills for today's technology landscape.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//               <div className="h-48 overflow-hidden">
//                 <img src="https://readdy.ai/api/search-image?query=professional%2520web%2520development%2520workspace%2520with%2520code%2520on%2520screens%2C%2520modern%2520office%2520setting%2C%2520clean%2520desk%2520with%2520multiple%2520monitors%2520showing%2520HTML%2C%2520CSS%2C%2520and%2520JavaScript%2520code%2C%2520web%2520design%2520elements%2C%2520professional%2520environment&width=400&height=250&seq=4&orientation=landscape" alt="Web Development" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" />
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">Bestseller</span>
//                   <div className="flex items-center">
//                     <i className="ri-star-fill text-yellow-400 mr-1"></i>
//                     <span className="text-gray-700 font-medium">4.9</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Full-Stack Web Development</h3>
//                 <p className="text-gray-600 mb-4">Master front-end and back-end technologies to build complete web applications.</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-secondary font-bold text-xl">$599</span>
//                   <button className="bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all">Enroll Now</button>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//               <div className="h-48 overflow-hidden">
//                 <img src="https://readdy.ai/api/search-image?query=data%2520science%2520visualization%2520workspace%2520with%2520charts%2C%2520graphs%2C%2520and%2520statistics%2520on%2520multiple%2520screens%2C%2520clean%2520modern%2520office%2520environment%2C%2520data%2520analysis%2520tools%2C%2520professional%2520setting%2520with%2520analytics%2520dashboard%2520visible&width=400&height=250&seq=5&orientation=landscape" alt="Data Science" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" />
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">New</span>
//                   <div className="flex items-center">
//                     <i className="ri-star-fill text-yellow-400 mr-1"></i>
//                     <span className="text-gray-700 font-medium">4.8</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">Data Science & Analytics</h3>
//                 <p className="text-gray-600 mb-4">Learn to analyze and interpret complex data sets using Python, R, and SQL.</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-secondary font-bold text-xl">$699</span>
//                   <button className="bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all">Enroll Now</button>
//                 </div>
//               </div>
//             </div>
//             <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl animate-fadeIn" style={{ animationDelay: '0.6s' }}>
//               <div className="h-48 overflow-hidden">
//                 <img src="https://readdy.ai/api/search-image?query=artificial%2520intelligence%2520and%2520machine%2520learning%2520workspace%2520with%2520neural%2520network%2520visualizations%2C%2520algorithm%2520flowcharts%2C%2520and%2520code%2520on%2520screens%2C%2520clean%2520modern%2520office%2520environment%2C%2520professional%2520AI%2520development%2520setting&width=400&height=250&seq=6&orientation=landscape" alt="AI & Machine Learning" className="w-full h-full object-cover object-top transition-transform duration-500 hover:scale-105" />
//               </div>
//               <div className="p-6">
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-3 py-1 rounded-full">Advanced</span>
//                   <div className="flex items-center">
//                     <i className="ri-star-fill text-yellow-400 mr-1"></i>
//                     <span className="text-gray-700 font-medium">4.7</span>
//                   </div>
//                 </div>
//                 <h3 className="text-xl font-bold mb-2">AI & Machine Learning</h3>
//                 <p className="text-gray-600 mb-4">Develop intelligent systems and algorithms that can learn and adapt.</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-secondary font-bold text-xl">$799</span>
//                   <button className="bg-primary text-white px-4 py-2 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all">Enroll Now</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="text-center mt-12">
//             <button className="bg-white text-primary border border-primary px-6 py-3 rounded-button whitespace-nowrap hover:bg-gray-50 transition-all">
//               View All Courses
//               <i className="ri-arrow-right-line ml-2"></i>
//             </button>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered <span className="text-secondary">Learning Experience</span></h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Our innovative AI system analyzes your learning patterns to provide personalized recommendations and track your progress in real-time.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//               <div className="bg-white p-8 rounded-lg shadow-lg">
//                 <div id="performance-chart" className="h-80 w-full"></div>
//               </div>
//             </div>
//             <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-brain-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Personalized Learning Path</h3>
//                   <p className="text-gray-600">Our AI analyzes your strengths and areas for improvement to create a customized learning journey that adapts as you progress.</p>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-line-chart-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Performance Analytics</h3>
//                   <p className="text-gray-600">Track your progress with detailed metrics and visualizations that help you understand your learning patterns and achievements.</p>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-time-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Attendance Tracking</h3>
//                   <p className="text-gray-600">Automated attendance system with biometric verification ensures accurate records and helps maintain consistent learning schedules.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <div className="text-secondary uppercase tracking-wider font-semibold mb-2">TESTIMONIALS</div>
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students <span className="text-secondary">Say</span></h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">It's a joy to see how our training has helped students transform their careers and achieve their technology goals.</p>
//           </div>
//           <div className="relative testimonial-slider">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"Their web development course completely transformed my career. The hands-on projects and mentorship were exactly what I needed to land my dream job as a frontend developer."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4 text-white font-bold">JM</div>
//                   <div>
//                     <h4 className="font-semibold">James Mitchell</h4>
//                     <p className="text-gray-500 text-sm">Frontend Developer</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"The data science program exceeded all my expectations. The curriculum was comprehensive and up-to-date with industry standards. The AI-powered learning tools helped me master complex concepts quickly."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">RN</div>
//                   <div>
//                     <h4 className="font-semibold">Rebecca Nguyen</h4>
//                     <p className="text-gray-500 text-sm">Data Analyst</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"As someone transitioning from a non-tech background, I was worried about keeping up. The personalized learning path and supportive instructors made all the difference. Now I'm confidently working as a junior developer."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">DL</div>
//                   <div>
//                     <h4 className="font-semibold">David Liang</h4>
//                     <p className="text-gray-500 text-sm">Software Developer</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"The cybersecurity bootcamp was intense but incredibly rewarding. The practical labs and real-world scenarios prepared me for the challenges I now face daily as a security analyst. Worth every penny."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">SA</div>
//                   <div>
//                     <h4 className="font-semibold">Sophia Ahmed</h4>
//                     <p className="text-gray-500 text-sm">Security Analyst</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-center mt-10 space-x-2">
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full active"></button>
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full"></button>
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full"></button>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered <span className="text-secondary">Learning Experience</span></h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">Our innovative AI system analyzes your learning patterns to provide personalized recommendations and track your progress in real-time.</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//             <div className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//               <div className="bg-white p-8 rounded-lg shadow-lg">
//                 <div id="performance-chart" className="h-80 w-full"></div>
//               </div>
//             </div>
//             <div className="space-y-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-brain-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Personalized Learning Path</h3>
//                   <p className="text-gray-600">Our AI analyzes your strengths and areas for improvement to create a customized learning journey that adapts as you progress.</p>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-line-chart-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Performance Analytics</h3>
//                   <p className="text-gray-600">Track your progress with detailed metrics and visualizations that help you understand your learning patterns and achievements.</p>
//                 </div>
//               </div>
//               <div className="bg-white p-6 rounded-lg shadow-md flex items-start space-x-4">
//                 <div className="feature-icon w-12 h-12 rounded-full flex items-center justify-center">
//                   <i className="ri-time-line ri-lg text-white"></i>
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-lg mb-2">Attendance Tracking</h3>
//                   <p className="text-gray-600">Automated attendance system with biometric verification ensures accurate records and helps maintain consistent learning schedules.</p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <div className="text-secondary uppercase tracking-wider font-semibold mb-2">TESTIMONIALS</div>
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Students <span className="text-secondary">Say</span></h2>
//             <p className="text-gray-600 max-w-2xl mx-auto">It's a joy to see how our training has helped students transform their careers and achieve their technology goals.</p>
//           </div>
//           <div className="relative testimonial-slider">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"Their web development course completely transformed my career. The hands-on projects and mentorship were exactly what I needed to land my dream job as a frontend developer."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mr-4 text-white font-bold">JM</div>
//                   <div>
//                     <h4 className="font-semibold">James Mitchell</h4>
//                     <p className="text-gray-500 text-sm">Frontend Developer</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"The data science program exceeded all my expectations. The curriculum was comprehensive and up-to-date with industry standards. The AI-powered learning tools helped me master complex concepts quickly."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">RN</div>
//                   <div>
//                     <h4 className="font-semibold">Rebecca Nguyen</h4>
//                     <p className="text-gray-500 text-sm">Data Analyst</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.6s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"As someone transitioning from a non-tech background, I was worried about keeping up. The personalized learning path and supportive instructors made all the difference. Now I'm confidently working as a junior developer."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">DL</div>
//                   <div>
//                     <h4 className="font-semibold">David Liang</h4>
//                     <p className="text-gray-500 text-sm">Software Developer</p>
//                   </div>
//                 </div>
//               </div>
//               <div className="testimonial-card bg-white rounded-lg shadow-md p-6 animate-fadeIn" style={{ animationDelay: '0.8s' }}>
//                 <div className="flex text-yellow-400 mb-3">
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                   <i className="ri-star-fill"></i>
//                 </div>
//                 <p className="text-gray-600 mb-6">"The cybersecurity bootcamp was intense but incredibly rewarding. The practical labs and real-world scenarios prepared me for the challenges I now face daily as a security analyst. Worth every penny."</p>
//                 <div className="flex items-center">
//                   <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4 text-white font-bold">SA</div>
//                   <div>
//                     <h4 className="font-semibold">Sophia Ahmed</h4>
//                     <p className="text-gray-500 text-sm">Security Analyst</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             <div className="flex justify-center mt-10 space-x-2">
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full active"></button>
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full"></button>
//               <button className="custom-dot w-4 h-2 bg-gray-300 rounded-full"></button>
//             </div>
//           </div>
//         </div>
//       </section>
//       <section className="py-20 bg-white">
//         <div className="container mx-auto px-4">
//           <div className="text-center mb-16 animate-fadeIn">
//             <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular <span className="text-secondary">Courses</span></h2>
//           <div class="max-w-4xl mx-auto text-center animate-fadeIn">
//             <h2 class="text-3xl md:text-4xl font-bold mb-6">Stay Updated with Our Latest <span class="text-secondary">Courses & Tech News</span></h2>
//             <p class="text-gray-600 mb-8">Join our newsletter and be the first to know about new course offerings, technology trends, and exclusive discounts.</p>
//             <div class="flex flex-col sm:flex-row gap-4 justify-center">
//               <input type="email" placeholder="Enter your email address" class="px-6 py-3 rounded-lg border-none shadow-md focus:ring-2 focus:ring-secondary flex-grow max-w-md" />
//               <button class="bg-secondary text-white px-6 py-3 rounded-button whitespace-nowrap hover:bg-opacity-90 transition-all">
//                 Subscribe Now
//               </button>
//             </div>
//             <p class="text-gray-500 text-sm mt-4">We respect your privacy. Unsubscribe at any time.</p>
//           </div>
//           </div>
//         </div>
//       </section>
//       <section class="py-16 bg-white">
//         <div class="container mx-auto px-4">
//           <div class="text-center mb-12 animate-fadeIn">
//             <h2 class="text-2xl font-bold mb-2">Trusted By Leading Organizations</h2>
//             <p class="text-gray-600">Our graduates work at these top companies and many more</p>
//           </div>
//           <div class="flex flex-wrap justify-center items-center gap-8 md:gap-16">
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-google-fill ri-3x text-gray-400"></i>
//             </div>
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-microsoft-fill ri-3x text-gray-400"></i>
//             </div>
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-amazon-fill ri-3x text-gray-400"></i>
//             </div>
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-apple-fill ri-3x text-gray-400"></i>
//             </div>
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-facebook-fill ri-3x text-gray-400"></i>
//             </div>
//             <div class="partner-logo w-24 h-24 flex items-center justify-center">
//               <i class="ri-netflix-fill ri-3x text-gray-400"></i>
//             </div>
//           </div>
//         </div>
//       </section>
//       <footer class="bg-primary text-white pt-16 pb-8">
//         <div class="container mx-auto px-4">
//           <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
//             <div>
//               <h1 class="text-3xl font-['Pacifico'] text-white mb-4">logo</h1>
//               <p class="text-gray-300 mb-6">Empowering students with cutting-edge technology skills since 2010. Join our community of over 50,000 successful graduates.</p>
//               <div class="flex space-x-4">
//                 <a href="#" class="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
//                   <i class="ri-facebook-fill"></i>
//                 </a>
//                 <a href="#" class="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
//                   <i class="ri-twitter-fill"></i>
//                 </a>
//                 <a href="#" class="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
//                   <i class="ri-instagram-fill"></i>
//                 </a>
//                 <a href="#" class="w-10 h-10 bg-white bg-opacity-10 rounded-full flex items-center justify-center hover:bg-secondary transition-all">
//                   <i class="ri-linkedin-fill"></i>
//                 </a>
//               </div>
//             </div>
//             <div>
//               <h3 class="text-xl font-bold mb-6">Quick Links</h3>
//               <ul class="space-y-3">
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">About Us</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Courses</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Teachers</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Events</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Blog</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 class="text-xl font-bold mb-6">Courses</h3>
//               <ul class="space-y-3">
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Web Development</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Data Science</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">AI & Machine Learning</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Cybersecurity</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Cloud Computing</a></li>
//                 <li><a href="#" class="text-gray-300 hover:text-secondary transition-all">Mobile App Development</a></li>
//               </ul>
//             </div>
//             <div>
//               <h3 class="text-xl font-bold mb-6">Contact Info</h3>
//               <ul class="space-y-4">
//                 <li class="flex items-start">
//                   <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3 mt-1">
//                     <i class="ri-map-pin-line"></i>
//                   </div>
//                   <span class="text-gray-300">123 Tech Campus Drive, Silicon Valley, CA 94025</span>
//                 </li>
//                 <li class="flex items-center">
//                   <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
//                     <i class="ri-phone-line"></i>
//                   </div>
//                   <span class="text-gray-300">+1 555 123 4567</span>
//                 </li>
//                 <li class="flex items-center">
//                   <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
//                     <i class="ri-mail-line"></i>
//                   </div>
//                   <span class="text-gray-300">info@techtraining.edu</span>
//                 </li>
//                 <li class="flex items-center">
//                   <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center mr-3">
//                     <i class="ri-time-line"></i>
//                   </div>
//                   <span class="text-gray-300">Mon-Fri: 8:00 AM - 8:00 PM</span>
//                 </li>
//               </ul>
//             </div>
//           </div>
//           <div class="border-t border-gray-700 pt-8 mt-8">
//             <div class="flex flex-col md:flex-row justify-between items-center">
//               <p class="text-gray-400 mb-4 md:mb-0">© 2025 Computer Training Institute. All rights reserved.</p>
//               <div class="flex space-x-6">
//                 <a href="#" class="text-gray-400 hover:text-secondary transition-all">Privacy Policy</a>
//                 <a href="#" class="text-gray-400 hover:text-secondary transition-all">Terms of Service</a>
//                 <a href="#" class="text-gray-400 hover:text-secondary transition-all">Cookie Policy</a>
//               </div>
//             </div>
//           </div>
//         </div>
//       </footer>
//       </>
//       )
// }

import React from 'react'

export default function About() {
  return (
    <div>About</div>
  )
}
