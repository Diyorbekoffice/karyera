import { useEffect, useState } from 'react';

const MobileWarning = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      // Ekran eni 1024px dan kichik bo‘lsa, chiqadi
      setIsMobile(window.innerWidth <= 1024);
    };

    checkScreen();
    window.addEventListener('resize', checkScreen);

    return () => {
      window.removeEventListener('resize', checkScreen);
    };
  }, []);

  if (!isMobile) return null;

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">
      <p className="text-center text-lg font-semibold text-black px-6">
        Ilovani yuklab olishingiz tavsiya etiladi
      </p>
    </div>
  );
};

export default MobileWarning;
