import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import './Homeone.css';

const Homeone = () => {
  useEffect(() => {
    // Text animations
    const textTimeline = gsap.timeline();
    
    textTimeline
      .to(".line-1", {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      })
      .to(".line-2", {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, "-=1")
      .to(".line-3", {
        x: 0,
        opacity: 1,
        duration: 1.5,
        ease: "power2.out"
      }, "-=1")
      .to(".genius-paragraph", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      })
      .to(".small-paragraph", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5")
      .to(".cta-button", {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }, "-=0.5");

    // Logo animation
    gsap.from(".academy-logo", {
      y: -50,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.5
    });

    // Course-related messages that appear and disappear
    const courses = [
      "Web Development",
      "Data Science",
      "Cloud Computing",
      "Cybersecurity",
      "UI/UX Design",
      "Mobile App Development",
      "DevOps",
      "Machine Learning",
      "Full Stack Development",
      "Network Administration",
      "Digital Marketing",
      "Software Testing"
    ];

    const activities = [
      "Enrolling for",
      "New batch starting for",
      "Limited seats for",
      "Practical training in",
      "Industry experts teaching",
      "Placement assistance for",
      "Advanced certification in",
      "Weekend batches for",
      "Project-based learning in",
      "Career guidance for",
      "Internship opportunities in",
      "Live workshops on"
    ];

    function createMultipleMessages() {
      const count = Math.floor(Math.random() * 2) + 2; // 2-3 messages
      const usedPositions = [];
      
      for(let i = 0; i < count; i++) {
        setTimeout(() => {
          const activity = activities[Math.floor(Math.random() * activities.length)];
          const course = courses[Math.floor(Math.random() * courses.length)];
          const message = `${activity} ${course}`;
          
          const messageEl = document.createElement('div');
          messageEl.className = 'floating-message';
          
          messageEl.innerHTML = `
            <div class="status-dot"></div>
            <span class="message-text">${message}</span>
          `;

          let x, y;
          let attempts = 0;
          const padding = 20;
          const maxX = window.innerWidth - 300;
          const maxY = window.innerHeight - 60;
          
          do {
            x = padding + Math.random() * (maxX - padding * 2);
            y = padding + Math.random() * (maxY - padding * 2);
            attempts++;
          } while (
            usedPositions.some(pos => 
              Math.abs(pos.x - x) < 320 && 
              Math.abs(pos.y - y) < 70
            ) && 
            attempts < 10
          );

          usedPositions.push({ x, y });
          
          messageEl.style.left = `${x}px`;
          messageEl.style.top = `${y}px`;
          
          document.querySelector('.genius-main-container').appendChild(messageEl);

          gsap.timeline()
            .to(messageEl, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(messageEl, {
              opacity: 0,
              y: -20,
              scale: 0.95,
              duration: 0.6,
              delay: 3,
              ease: "power3.in",
              onComplete: () => {
                messageEl.remove();
                const index = usedPositions.findIndex(pos => pos.x === x && pos.y === y);
                if (index > -1) usedPositions.splice(index, 1);
              }
            });

          gsap.to(messageEl.querySelector('.status-dot'), {
            opacity: 0.5,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power2.inOut"
          });

        }, i * 400);
      }
    }

    function startFloatingMessages() {
      setTimeout(() => {
        createMultipleMessages();
        setInterval(createMultipleMessages, 4000);
      }, 1000);
    }

    textTimeline.call(startFloatingMessages);

    // Ring animations
    const ringTimeline = gsap.timeline({
      repeat: -1,
      yoyo: true,
      repeatDelay: 1
    });

    document.querySelectorAll('.genius-ring').forEach((ring, index) => {
      ringTimeline.to(ring, {
        scale: 1,
        opacity: 0.5,
        duration: 0.8,
        ease: "power2.out"
      }, index * 0.2);
    });

    gsap.to('.genius-ring', {
      rotate: 360,
      duration: 30,
      repeat: -1,
      ease: "none",
      stagger: {
        each: 0.5,
        from: "start"
      }
    });

    gsap.to('.genius-ring', {
      boxShadow: '0 0 30px rgba(255, 107, 0, 0.15)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      stagger: {
        each: 0.3,
        from: "center"
      }
    });
    
    // Cleanup function to prevent memory leaks
    return () => {
      // Clear any intervals or timeouts
      const intervals = window._intervals || [];
      intervals.forEach(clearInterval);
    };
  }, []); // Empty dependency array ensures this runs once on component mount

  return (
    <div className="genius-main-container">
      <div className="academy-logo">
        <div className="logo-icon">M</div>
        <span>Miracle IT</span>
      </div>
      
      <div className="decorative-circle circle1"></div>
      <div className="decorative-circle circle2"></div>
      
      <div className="genius-ring-container">
        <div className="genius-ring genius-ring1"></div>
        <div className="genius-ring genius-ring2"></div>
        <div className="genius-ring genius-ring3"></div>
        <div className="genius-ring genius-ring4"></div>
        <div className="genius-ring genius-ring5"></div>
        <div className="genius-ring genius-ring6"></div>
      </div>

      <div className="genius-content">
        <h1>
          <span className="text-line line-1">
            <span className="highlight">Welcome to</span>
          </span>
          <span className="text-line line-2">
            Miracle IT Career
          </span>
          <span className="text-line line-3">
            <span className="highlight">Academy</span>
          </span>
        </h1>
        <p className="genius-paragraph">Building IT careers through expert training and mentorship.</p>
        <p className="small-paragraph">Join our industry-focused courses and transform your future in the world of technology.</p>
        <button className="cta-button">Explore Courses</button>
      </div>
    </div>
  );
};

export default Homeone;