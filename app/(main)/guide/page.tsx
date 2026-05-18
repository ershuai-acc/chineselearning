import { HelpCircle } from 'lucide-react';

export default function GuidePage() {
  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 bg-duo-snow">
      <div className="bg-white rounded-2xl border-2 border-duo-swan shadow-card p-10 max-w-sm w-full flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-duo-polar flex items-center justify-center mb-6">
          <HelpCircle className="w-12 h-12 text-duo-lily" />
        </div>
        <h1 className="text-2xl font-extrabold text-duo-eel mb-3">使用说明</h1>
        <p className="text-duo-wolf font-medium mb-6">了解如何高效使用</p>
        <div className="px-6 py-2 bg-duo-polar rounded-xl font-bold text-duo-hare">
          即将上线
        </div>
      </div>
    </div>
  );
}