'use client'
import { forwardRef, InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label htmlFor={id} className='block text-xs font-semibold
            text-slate-500 uppercase tracking-widest mb-2'>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full h-12 px-4 bg-white border border-slate-200 rounded-lg',
                        'text-slate-900 text-sm placeholder:text-slate-400',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-navy-900/10',
                        'focus:border-navy-900',
                        'hover:border-slate-300',
                        error && 'border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
                {error && <p className='mt-1 text-xs text-red-600'>{error}</p>}
            </div>
        )
    }
)
Input.displayName = 'Input'
export default Input
