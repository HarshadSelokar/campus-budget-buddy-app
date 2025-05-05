import React, { useEffect } from "react";

type Props = {
  onFinish: () => void;
};

const SplashScreen: React.FC<Props> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="flex items-center justify-center h-screen bg-white flex-col gap-4 animate-fadeIn">
      <img src="/Budget_Buddy-logo.png" alt="Logo" className="w-[26rem] h-[26rem]" />
      {/* <h1 className="text-2xl font-bold">Budget Buddy</h1> */}
      <p className=" text-gray-500 absolute bottom-[30px] text-base">Developed by Harshad 🐕</p>
    </div>
  );
};

export default SplashScreen;
