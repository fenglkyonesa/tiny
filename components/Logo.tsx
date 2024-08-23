import React from 'react';
import { motion } from 'framer-motion';
import { Fan } from 'lucide-react';

export default function Logo() {
  return (
    <motion.div
      whileHover={{ scale: 1.2, rotate: 90 }}
      whileTap={{
        scale: 0.8,
        rotate: -90,
        borderRadius: "100%"
      }}
    >
      <Fan />
    </motion.div>
  );
}
