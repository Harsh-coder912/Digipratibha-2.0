export default function ErrorMessage({ message, className = '' }: { message?: string; className?: string }) {
  if (!message) return null;
  return (
    <div className={`px-3 py-2 rounded bg-red-50 text-red-700 border border-red-200 animate-bounce ${className}`}>
      {message}
    </div>
  );
}



