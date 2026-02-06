'use client'
import { forwardRef, TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div>
                {label && (
                    <label htmlFor={id} className='block text-xs font-semibold
            text-slate-500 uppercase tracking-widest mb-2'>
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full px-4 py-3 bg-white border border-slate-200 rounded-lg',
                        'text-slate-900 text-sm placeholder:text-slate-400',
                        'transition-all duration-200 resize-none',
                        'focus:outline-none focus:ring-2 focus:ring-navy-900/10 focus:border-navy-900',
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
Textarea.displayName = 'Textarea'
export default Textarea
