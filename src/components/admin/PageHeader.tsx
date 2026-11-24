import React from 'react';
import type { LucideIcon } from 'lucide-react';

const tones = {
  blue: 'from-blue-500 to-[#0b498d] shadow-blue-500/30',
  indigo: 'from-blue-500 to-[#0b498d] shadow-blue-500/30',
  sky: 'from-sky-400 to-blue-500 shadow-sky-500/30',
  violet: 'from-violet-500 to-blue-700 shadow-violet-500/30',
  emerald: 'from-emerald-400 to-teal-500 shadow-emerald-500/30',
  amber: 'from-amber-400 to-orange-500 shadow-amber-500/30',
} as const;

export type Tone = keyof typeof tones;

export const IconChip: React.FC<{ icon: LucideIcon; tone?: Tone; className?: string }> = ({
  icon: Icon,
  tone = 'blue',
  className = '',
}) => (
  <div className={`admin-icon-chip bg-gradient-to-br ${tones[tone]} ${className}`}>
    <Icon className="h-5 w-5" />
  </div>
);

interface PageHeaderProps {
  icon: LucideIcon;
  tone?: Tone;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

/** Big bold title with a breadcrumb trail underneath. */
export const PageTitle: React.FC<{ icon: LucideIcon; title: React.ReactNode; subtitle?: React.ReactNode }> = ({
  icon: Icon,
  title,
  subtitle,
}) => (
  <div>
    <h1 className="admin-page-title">{title}</h1>
    <nav className="mt-1.5 flex items-center gap-2 text-sm text-gray-500" aria-label="Breadcrumb">
      <Icon className="h-4 w-4 text-blue-500" />
      <span>Admin</span>
      <span className="text-gray-300">/</span>
      <span className="text-gray-700">{title}</span>
    </nav>
    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
  </div>
);

/** Page title on the left, actions on the right. */
export const PageHeader: React.FC<PageHeaderProps> = ({ icon, title, subtitle, actions }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <PageTitle icon={icon} title={title} subtitle={subtitle} />
    {actions && <div className="flex items-center gap-2 self-start sm:self-auto">{actions}</div>}
  </div>
);
