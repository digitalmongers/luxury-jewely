import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface SplitRevealProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p';
  className?: string;
  delay?: number;
  immediate?: boolean;
}

export const SplitReveal: React.FC<SplitRevealProps> = ({
  text,
  as = 'h1',
  className = '',
  delay = 0,
  immediate = false,
}) => {
  const prefersReduced = useReducedMotion();
  const words = text.split(' ');
  const Tag = as;

  if (prefersReduced) {
    return (
      <Tag className={className} style={{ textWrap: 'balance' }}>
        {text}
      </Tag>
    );
  }

  return (
    <Tag className={className} style={{ textWrap: 'balance' }}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom mr-[0.26em] last:mr-0"
        >
          <motion.span
            className="inline-block"
            initial={{ y: '100%', opacity: 0 }}
            {...(immediate
              ? { animate: { y: '0%', opacity: 1 } }
              : {
                  whileInView: { y: '0%', opacity: 1 },
                  viewport: { once: true, amount: 0.1 },
                })}
            transition={{
              duration: 0.55,
              delay: delay + idx * 0.035,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};
