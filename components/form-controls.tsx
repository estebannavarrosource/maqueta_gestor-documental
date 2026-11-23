import { useId } from 'react'

export const inputCls =
  'h-10 w-full rounded-md border border-input bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring focus-visible:outline-2 focus-visible:outline-ring/40 disabled:bg-muted'

export function Field({
  label,
  hint,
  children,
  className = '',
}: {
  label: React.ReactNode
  hint?: string
  children: (id: string) => React.ReactNode
  className?: string
}) {
  const id = useId()
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {children(id)}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function Card({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`rounded-xl border border-border bg-card ${className}`}>{children}</div>
}

export function PageTitle({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 font-mono text-xs uppercase tracking-wider text-muted-foreground">{eyebrow}</p>
        )}
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      </div>
      {children}
    </div>
  )
}
