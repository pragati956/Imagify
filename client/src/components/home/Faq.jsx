import React, { useState } from 'react';
import { motion as Motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "What is Imagify?",
    answer: "Imagify is an AI-powered platform that converts your text descriptions into stunning, high-quality images in seconds. It is designed to help creators, designers, and hobbyists bring their visual ideas to life effortlessly."
  },
  {
    question: "How does the AI Prompt Assistant work?",
    answer: "When you type a simple idea, our built-in Gemini AI Assistant automatically analyzes it and rewrites it into a highly detailed, professional-grade prompt, adding crucial details like lighting, camera angles, and textures to get the best possible image."
  },
  {
    question: "What are Style Tags?",
    answer: "Style tags are quick-select buttons (like 'Cinematic', 'Anime', or 'Cyberpunk') that automatically inject specific artistic directions into your prompt, ensuring the AI model understands exactly what aesthetic you are aiming for."
  },
  {
    question: "Are my generated images saved?",
    answer: "Yes! Any image you generate is automatically saved to your personal 'My Creations' dashboard. For your security and privacy, we employ a 30-day retention policy, meaning images are automatically deleted from our servers 30 days after creation. You can also manually delete them anytime."
  },
  {
    question: "How does the credit system work?",
    answer: "Every time you generate an image, 1 credit is deducted from your balance. You get free credits upon signing up, and you can purchase more credits securely via Razorpay in the Pricing section whenever you run out."
  }
];

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Motion.div
      initial={{ opacity: 0.2, y: 50 }}
      transition={{ duration: 0.8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-4xl mx-auto py-16 px-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-gray-900 dark:text-white transition-colors">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Everything you need to know about the product and how it works.</p>
      </div>

      <div className="flex flex-col gap-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div 
              key={index} 
              className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${
                isOpen 
                  ? 'border-blue-500 bg-white dark:bg-gray-800 shadow-md' 
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800'
              }`}
            >
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full p-5 text-left focus:outline-none"
              >
                <span className="font-medium text-gray-900 dark:text-white text-lg">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-blue-500' : ''}`} 
                  size={20} 
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <Motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-5 pb-5 pt-0 text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 mt-2 pt-4">
                      {faq.answer}
                    </div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Motion.div>
  );
};

export default Faq;