import { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) setVisible(true);
  }, []);

  const handleConsent = (accepted: boolean) => {
    localStorage.setItem('cookieConsent', accepted ? 'accepted' : 'rejected');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 bg-navy-900 text-white px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
      <div className="flex-1 text-sm md:text-base">
        Questo sito utilizza cookie essenziali e, previo consenso, cookie analitici. Consulta la nostra{' '}
        <a href="/privacy" className="text-gold-500 underline">Privacy Policy</a>.
      </div>
      <div className="flex gap-2">
        <button
          className="bg-gold-500 hover:bg-gold-600 text-white px-4 py-2 rounded transition"
          onClick={() => handleConsent(true)}
        >
          Accetta
        </button>
        <button
          className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition"
          onClick={() => handleConsent(false)}
        >
          Rifiuta
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
