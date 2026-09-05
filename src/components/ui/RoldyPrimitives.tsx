import React from 'react';
import { ChevronLeft, X, Search } from 'lucide-react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
};

export function RGButton({ variant='primary', size='md', loading=false, className='', children, disabled, ...props }: ButtonProps) {
  return <button {...props} disabled={disabled || loading} className={`rg-btn rg-btn-${variant} rg-btn-${size} ${loading ? 'is-loading' : ''} ${className}`}>
    {loading && <span className="rg-spinner" aria-hidden="true" />}
    <span>{children}</span>
  </button>;
}

export function RGScreenHeader({ title, eyebrow, onBack, action }: { title:string; eyebrow?:string; onBack?:()=>void; action?:React.ReactNode }) {
  return <header className="rg-screen-header">
    <div className="flex items-center gap-3 min-w-0">
      {onBack && <button onClick={onBack} className="rg-icon-button" aria-label="Go back"><ChevronLeft className="w-5 h-5"/></button>}
      <div className="min-w-0">{eyebrow && <p className="rg-eyebrow">{eyebrow}</p>}<h1>{title}</h1></div>
    </div>
    {action}
  </header>;
}

export function RGModalShell({ children, onClose, className='' }: { children:React.ReactNode; onClose?:()=>void; className?:string }) {
  return <div className="rg-modal-shell" role="dialog" aria-modal="true">
    <div className={`rg-modal-card ${className}`}>
      {onClose && <button onClick={onClose} className="rg-modal-close" aria-label="Close"><X className="w-5 h-5"/></button>}
      {children}
    </div>
  </div>;
}

export function RGSearchField({ value, onChange, placeholder='Search' }: { value:string; onChange:(value:string)=>void; placeholder?:string }) {
  return <label className="rg-search-field"><Search className="w-4 h-4"/><input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>;
}

export function RGState({ type='empty', title, description, action }: { type?:'empty'|'loading'|'error'; title:string; description?:string; action?:React.ReactNode }) {
  return <section className={`rg-state rg-state-${type}`} aria-live={type === 'loading' ? 'polite' : undefined}>
    {type === 'loading' && <span className="rg-spinner rg-spinner-lg" />}
    <div><h3>{title}</h3>{description && <p>{description}</p>}</div>{action}
  </section>;
}
