interface GradeBadgeProps {
  grade: string;
  size?: 'sm' | 'md' | 'lg';
}

export function GradeBadge({ grade, size = 'md' }: GradeBadgeProps) {
  const isPass = grade !== 'F';
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1';

  const getGradient = () => {
    if (grade.startsWith('A')) return 'from-emerald-400 to-green-500 shadow-emerald-200';
    if (grade.startsWith('B')) return 'from-blue-400 to-indigo-500 shadow-blue-200';
    if (grade.startsWith('C')) return 'from-amber-400 to-orange-500 shadow-amber-200';
    if (grade === 'D') return 'from-orange-400 to-red-500 shadow-orange-200';
    return 'from-red-400 to-rose-500 shadow-red-200';
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-bold rounded-full text-white bg-gradient-to-r ${getGradient()} shadow-md ${sizeClasses} ${
        !isPass ? 'animate-pulse' : ''
      }`}
      title={`Grade: ${grade}`}
    >
      {grade}
    </span>
  );
}