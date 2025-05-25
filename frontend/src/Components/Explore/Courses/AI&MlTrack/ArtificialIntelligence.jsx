import React, { useState, useEffect } from 'react';
import CourseTemplate from '../../CourseTemplate';
import { FaRobot, FaBrain, FaChartBar, FaCode } from 'react-icons/fa';
import { SiPytorch, SiTensorflow, SiScikitlearn, SiKeras, SiOpencv } from 'react-icons/si';
import { fetchCourseSyllabus } from '../../../../api';

const ArtificialIntelligence = () => {
  const [syllabus, setSyllabus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSyllabus = async () => {
      try {
        // Try to fetch from API first
        const courseId = 3; // Assuming AI course has ID 3
        const data = await fetchCourseSyllabus(courseId);
        if (data && data.length > 0) {
          setSyllabus(data);
        } else {
          // Fallback to mock data if API returns empty
          setSyllabus(mockSyllabus);
        }
      } catch (error) {
        console.error('Error loading syllabus:', error);
        // Fallback to mock data on error
        setSyllabus(mockSyllabus);
      } finally {
        setLoading(false);
      }
    };

    loadSyllabus();
  }, []);

  const technologies = [
    {
      name: 'TensorFlow',
      icon: <SiTensorflow />,
      description: 'Open-source machine learning framework'
    },
    {
      name: 'PyTorch',
      icon: <SiPytorch />,
      description: 'Deep learning framework'
    },
    {
      name: 'Scikit-learn',
      icon: <SiScikitlearn />,
      description: 'Machine learning library'
    },
    {
      name: 'Keras',
      icon: <SiKeras />,
      description: 'Neural network API'
    },
    {
      name: 'OpenCV',
      icon: <SiOpencv />,
      description: 'Computer vision library'
    },
    {
      name: 'Neural Networks',
      icon: <FaBrain />,
      description: 'Deep learning architectures'
    },
    {
      name: 'Data Visualization',
      icon: <FaChartBar />,
      description: 'Visual representation of data'
    },
    {
      name: 'Python',
      icon: <FaCode />,
      description: 'Programming language for AI'
    }
  ];

  const learningOutcomes = [
    'Understand the fundamentals of artificial intelligence and its applications',
    'Build and train neural networks using TensorFlow and PyTorch',
    'Implement computer vision systems with OpenCV',
    'Develop natural language processing applications',
    'Create intelligent agents and expert systems',
    'Apply reinforcement learning techniques',
    'Design and implement AI solutions for real-world problems',
    'Evaluate and optimize AI models for performance and accuracy'
  ];

  return (
    <CourseTemplate
      title="Artificial Intelligence"
      description="Dive into the world of Artificial Intelligence with this comprehensive course covering neural networks, computer vision, natural language processing, and more. Learn to build intelligent systems that can perceive, reason, and act."
      duration="16 Weeks"
      internshipDuration="6 Weeks"
      isCertified={true}
      syllabus={loading ? [] : syllabus}
      technologies={technologies}
      learningOutcomes={learningOutcomes}
      placementAssistance={true}
      courseId={3} // Assuming AI course has ID 3
    />
  );
};

// Mock syllabus data as fallback
const mockSyllabus = [
  {
    id: 1,
    title: 'Introduction to Artificial Intelligence',
    order: 1,
    items: [
      { id: 1, title: 'History and evolution of AI' },
      { id: 2, title: 'Types of AI: narrow, general, and super AI' },
      { id: 3, title: 'AI ethics and societal impact' },
      { id: 4, title: 'Python for AI: libraries and tools' },
      { id: 5, title: 'Setting up the development environment' }
    ]
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    order: 2,
    items: [
      { id: 6, title: 'Supervised vs. unsupervised learning' },
      { id: 7, title: 'Regression and classification' },
      { id: 8, title: 'Feature engineering and selection' },
      { id: 9, title: 'Model evaluation and validation' },
      { id: 10, title: 'Ensemble methods' }
    ]
  },
  {
    id: 3,
    title: 'Neural Networks and Deep Learning',
    order: 3,
    items: [
      { id: 11, title: 'Perceptrons and multilayer networks' },
      { id: 12, title: 'Activation functions and backpropagation' },
      { id: 13, title: 'TensorFlow and Keras fundamentals' },
      { id: 14, title: 'PyTorch framework' },
      { id: 15, title: 'Convolutional Neural Networks (CNNs)' },
      { id: 16, title: 'Recurrent Neural Networks (RNNs)' }
    ]
  },
  {
    id: 4,
    title: 'Computer Vision',
    order: 4,
    items: [
      { id: 17, title: 'Image processing fundamentals' },
      { id: 18, title: 'OpenCV library' },
      { id: 19, title: 'Object detection and recognition' },
      { id: 20, title: 'Face detection and recognition' },
      { id: 21, title: 'Image segmentation' },
      { id: 22, title: 'Video analysis' }
    ]
  },
  {
    id: 5,
    title: 'Natural Language Processing',
    order: 5,
    items: [
      { id: 23, title: 'Text preprocessing and tokenization' },
      { id: 24, title: 'Word embeddings and vector spaces' },
      { id: 25, title: 'Sentiment analysis' },
      { id: 26, title: 'Named entity recognition' },
      { id: 27, title: 'Language models and transformers' },
      { id: 28, title: 'BERT and GPT architectures' }
    ]
  },
  {
    id: 6,
    title: 'Reinforcement Learning',
    order: 6,
    items: [
      { id: 29, title: 'Markov decision processes' },
      { id: 30, title: 'Q-learning and SARSA' },
      { id: 31, title: 'Deep Q-Networks (DQN)' },
      { id: 32, title: 'Policy gradient methods' },
      { id: 33, title: 'Actor-critic architectures' },
      { id: 34, title: 'Applications in games and robotics' }
    ]
  },
  {
    id: 7,
    title: 'Advanced AI Topics',
    order: 7,
    items: [
      { id: 35, title: 'Generative Adversarial Networks (GANs)' },
      { id: 36, title: 'Transfer learning' },
      { id: 37, title: 'Explainable AI' },
      { id: 38, title: 'AI in edge devices' },
      { id: 39, title: 'Federated learning' },
      { id: 40, title: 'AI system design and architecture' }
    ]
  },
  {
    id: 8,
    title: 'Capstone Project',
    order: 8,
    items: [
      { id: 41, title: 'Project planning and requirements' },
      { id: 42, title: 'Data collection and preparation' },
      { id: 43, title: 'Model development and training' },
      { id: 44, title: 'System integration' },
      { id: 45, title: 'Testing and evaluation' },
      { id: 46, title: 'Deployment and presentation' }
    ]
  }
];

export default ArtificialIntelligence;