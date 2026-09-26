import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ message = 'Loading...', size = 'default' }) => {
    const isLarge = size === 'large';
    const dotSize = isLarge ? 'w-3 h-3' : 'w-2.5 h-2.5';
    const orbitSize = isLarge ? 'w-20 h-20' : 'w-16 h-16';
    const containerMinH = isLarge ? 'min-h-[500px]' : 'min-h-[400px]';

    return (
        <div className={`flex flex-col items-center justify-center ${containerMinH} space-y-8`}>
            {/* Animated orbital loader */}
            <div className="relative flex items-center justify-center">
                {/* Outer pulsing ring */}
                <motion.div
                    className={`absolute ${isLarge ? 'w-28 h-28' : 'w-24 h-24'} rounded-full border border-blue-200 dark:border-blue-900`}
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.3, 0.1, 0.3],
                    }}
                    transition={{
                        duration: 2.5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />

                {/* Middle pulsing ring */}
                <motion.div
                    className={`absolute ${isLarge ? 'w-24 h-24' : 'w-20 h-20'} rounded-full border border-blue-300 dark:border-blue-800`}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.4, 0.15, 0.4],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 0.3,
                    }}
                />

                {/* Spinning arc */}
                <motion.div
                    className={`${orbitSize} rounded-full`}
                    style={{
                        border: '2.5px solid transparent',
                        borderTopColor: 'rgb(59, 130, 246)',
                        borderRightColor: 'rgba(59, 130, 246, 0.3)',
                    }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1.2,
                        repeat: Infinity,
                        ease: 'linear',
                    }}
                />

                {/* Center icon */}
                <motion.div
                    className="absolute flex items-center justify-center"
                    animate={{
                        scale: [1, 1.15, 1],
                    }}
                    transition={{
                        duration: 1.8,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                >
                    <span className="material-symbols-outlined text-blue-500 dark:text-blue-400 text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        auto_awesome
                    </span>
                </motion.div>
            </div>

            {/* Bouncing dots row */}
            <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                    <motion.div
                        key={i}
                        className={`${dotSize} rounded-full bg-blue-500 dark:bg-blue-400`}
                        animate={{
                            y: [0, -8, 0],
                            opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            ease: 'easeInOut',
                            delay: i * 0.15,
                        }}
                    />
                ))}
            </div>

            {/* Animated message */}
            <motion.p
                className="font-body-lg text-secondary text-center max-w-xs"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                {message}
            </motion.p>
        </div>
    );
};

export default LoadingSpinner;
