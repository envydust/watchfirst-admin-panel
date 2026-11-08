import type { ReactNode } from 'react'

/** Centered card used by login, first access and forced password change. */
export function AuthShell({ title, description, children, aside }: { title: string; description?: ReactNode; children: ReactNode; aside?: ReactNode }) {
  return (
    <div className="grid min-h-svh place-items-center bg-bg px-4 py-10">
      <div className="w-full max-w-[420px]">
        <div className="mb-8 flex items-center gap-3">
          <img src={`${import.meta.env.BASE_URL}icons/icon-192.png`} alt="" width={40} height={40} className="size-10 rounded-[10px]" />
          <div>
            <p className="text-[19px] font-extrabold leading-none tracking-[-0.02em]">
              <span className="text-fg">WATCH</span>
              <span className="text-accent">FIRST</span>
            </p>
            <p className="mt-1 text-[11.5px] font-medium uppercase tracking-[0.14em] text-fg-dim">Central de controle</p>
          </div>
        </div>
        <div className="rounded-lg border border-line-strong bg-panel p-6 shadow-pop sm:p-7">
          <h1 className="text-[22px] font-semibold leading-tight">{title}</h1>
          {description && <p className="mt-1.5 text-[13.5px] text-fg-muted">{description}</p>}
          <div className="mt-6">{children}</div>
        </div>
        {aside && <div className="mt-5 text-center text-[13px] text-fg-muted">{aside}</div>}
      </div>
    </div>
  )
}
