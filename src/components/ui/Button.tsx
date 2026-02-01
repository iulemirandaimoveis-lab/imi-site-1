'use client'

import { ButtonHTMLAttributes, forwardRef, ReactElement } from 'react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, asChild = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

        const variants = {
            primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500',
            secondary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500',
            outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
            ghost: 'text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
        }

        const sizes = {
            sm: 'px-4 py-2 text-sm rounded-md',
            md: 'px-6 py-3 text-base rounded-lg',
            lg: 'px-8 py-4 text-lg rounded-lg',
        }

        const classes = cn(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
        )

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as ReactElement<any>, {
                className: cn((children as ReactElement<any>).props.className, classes),
            })
        }

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={classes}
                {...props}
            >
                {children}
            </motion.button>
        )
    }
)

Button.displayName = 'Button'

export default Button
