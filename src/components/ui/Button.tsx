'use client'

import { ComponentPropsWithoutRef, forwardRef, ReactElement } from 'react'
import { cn } from '@/lib/utils'
import React from 'react'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    fullWidth?: boolean
    asChild?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', fullWidth = false, asChild = false, children, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]'

        const variants = {
            primary: 'bg-primary-700 text-white hover:bg-primary-800 focus:ring-primary-500',
            secondary: 'bg-accent-600 text-white hover:bg-accent-700 focus:ring-accent-500',
            outline: 'border-2 border-primary-700 text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
            ghost: 'text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
        }

        const sizes = {
            sm: 'px-4 py-2.5 text-sm rounded-lg',
            md: 'px-6 py-3.5 text-base rounded-xl',
            lg: 'px-8 py-4.5 text-lg rounded-xl',
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
            <button
                ref={ref}
                className={classes}
                {...props}
            >
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'

export default Button
