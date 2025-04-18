export default function Loading() {
  return (
    <div className="flex items-center justify-center">
          <div className="loader relative w-12 h-12 rounded-full transform rotate-45 perspective-[1000px]">
            <div className="absolute top-0 left-0 w-full h-full rounded-full transform rotate-x-[70deg] animate-spin-slow before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:shadow-[0.2em_0_0_0] before:shadow-purple-600"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full transform rotate-y-[70deg] animate-spin-slow-delay before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:rounded-full before:shadow-[0.2em_0_0_0] before:shadow-slate-800 dark:before:shadow-slate-100" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
  );
}