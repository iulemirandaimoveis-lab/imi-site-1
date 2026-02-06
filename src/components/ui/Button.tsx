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
    ({ className, variant = 'primary', size = 'md', fullWidth = false,
        asChild = false, children, ...props }, ref) => {

        const base = [
            'inline-flex items-center justify-center font-semibold',
            'tracking-wide transition-all duration-300 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'active:scale-[0.98]',
        ].join(' ')

        const variants = {
            primary: 'bg-navy-900 text-white hover:bg-navy-800 shadow-sm hover:shadow-md',
            secondary: 'bg-white text-navy-900 border-2 border-navy-900 hover:bg-navy-900 hover:text-white',
            outline: 'bg-transparent text-navy-900 border border-slate-200 hover:border-navy-900 hover:bg-slate-50',
            ghost: 'text-navy-700 hover:text-navy-900 hover:bg-slate-50',
        }

        const sizes = {
            sm: 'h-10 px-5 text-xs rounded-lg gap-2',
            md: 'h-12 px-8 text-sm rounded-lg gap-2',
            lg: 'h-14 px-10 text-base rounded-lg gap-3',
        }

        const classes = cn(base, variants[variant], sizes[size],
            fullWidth && 'w-full', className)

        if (asChild && React.isValidElement(children)) {
            return React.cloneElement(children as ReactElement<any>, {
                className: cn((children as ReactElement<any>).props.className, classes),
            })
        }

        return <button ref={ref} className={classes} {...props}>{children}</button>
    }
)

Button.displayName = 'Button'
export default Button
