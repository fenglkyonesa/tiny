import React, { useMemo } from "react";
import { motion, Variants } from "framer-motion";

interface ECGAnimationProps {
  color: string;
}

// 使用 React.memo 来防止不必要的重新渲染
const ECGAnimation: React.FC<ECGAnimationProps> = React.memo(({ color }) => {
  // 预定义动画的变体
  const ecgVariants: Variants = useMemo(
    () => ({
      initial: { pathLength: 0, opacity: 0 },
      animate: {
        pathLength: 1,
        opacity: 1,
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop",
          ease: "linear",
        },
      },
    }),
    []
  );

  return (
    <motion.svg
      viewBox="0 0 100 40"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-6"
    >
      <motion.path
        d="M0 20 L10 10 L20 30 L30 15 L40 25 L50 5 L60 30 L70 20 L80 25 L90 10 L100 20"
        fill="none"
        stroke={color}
        strokeWidth="3"
        variants={ecgVariants}
        initial="initial"
        animate="animate"
      />
    </motion.svg>
  );
});

export default ECGAnimation;
