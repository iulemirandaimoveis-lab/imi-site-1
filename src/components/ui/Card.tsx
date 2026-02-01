'use client'

import { HTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, hover = false, children, ...props }, ref) => {
        const Component = hover ? motion.div : 'div'
        const motionProps = hover
            ? {
                whileHover: { y: -4 },
                transition: { duration: 0.3 },
            }
            : {}

        return (
            <Component
                ref={ref}
                className={cn(
                    'bg-white rounded-lg border border-neutral-200 overflow-hidden',
                    hover && 'transition-shadow duration-300 hover:shadow-lg',
                    className
                )}
                {...motionProps}
                {...props}
            >
                {children}
            </Component>
        )
    }
)

Card.displayName = 'Card'

export default Card
