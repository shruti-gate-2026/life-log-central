
import React from 'react';

// TypeScript interface defines the shape of props
interface LearningCardProps {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

// Component with TypeScript typing
const LearningCard: React.FC<LearningCardProps> = ({ 
  title, 
  description, 
  difficulty 
}) => {
  // Tailwind classes for styling
  return (
    <div className="max-w-sm rounded-lg shadow-md overflow-hidden m-4 
      bg-white hover:bg-gray-100 transition-colors duration-300">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>
        <span className={`
          inline-block px-3 py-1 rounded-full text-sm font-semibold 
          ${difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
            difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'}
        `}>
          {difficulty}
        </span>
      </div>
    </div>
  );
};

export default LearningCard;

