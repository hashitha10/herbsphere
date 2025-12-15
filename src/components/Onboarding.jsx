import React, { useState, useEffect } from 'react';

export default function Onboarding({ open, onClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => { if (!open) setStep(0); }, [open]);

  if (!open) return null;

  const steps = [
    { title: 'Welcome', body: 'Welcome to the Virtual Herbal Garden — explore medicinal plants in interactive 3D.' },
    { title: 'Zones', body: 'Choose an AYUSH zone to filter plants: Ayurveda, Unani, Siddha, Homeopathy, and more.' },
    { title: '3D & AR', body: 'Click a plant card to open the detail modal; 3D and AR previews appear when available.' },
    { title: 'Search', body: 'Use the search box (press /) to quickly find plants.' },
  ];

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-xl w-full p-6 z-70">
        <h2 className="text-xl font-bold">{steps[step].title}</h2>
        <p className="mt-3 text-sm text-gray-700">{steps[step].body}</p>
        <div className="mt-4 flex justify-between">
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded" onClick={() => { setStep(s => Math.max(0, s-1)); }} disabled={step===0}>Back</button>
            <button className="px-3 py-1 bg-emerald-600 text-white rounded" onClick={() => { if (step < steps.length-1) setStep(s => s+1); else onClose(); }}>{step < steps.length-1 ? 'Next' : 'Done'}</button>
          </div>
          <button className="px-3 py-1 text-sm text-gray-500" onClick={onClose}>Skip</button>
        </div>
      </div>
    </div>
  );
}
