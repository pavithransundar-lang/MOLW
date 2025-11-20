import React from 'react';

export const LaptopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
  </svg>
);

export const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PlusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const MinusCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const BaseTokenIcon: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        {children}
    </svg>
);

export const OneMinuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <BaseTokenIcon {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
    </BaseTokenIcon>
);

export const FiveMinuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <BaseTokenIcon {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12 18a.75.75 0 00.75-.75V7.612l2.672 2.672a.75.75 0 001.06-1.06l-4-4a.75.75 0 00-1.06 0l-4 4a.75.75 0 101.06 1.06L11.25 7.612v9.638A.75.75 0 0012 18z" clipRule="evenodd" />
    </BaseTokenIcon>
);

export const TenMinuteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <BaseTokenIcon {...props}>
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM10.5 6a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3zM9 10.5a.75.75 0 000 1.5h6a.75.75 0 000-1.5H9zm.75 3.75a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5z" clipRule="evenodd" />
    </BaseTokenIcon>
);

export const BankIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
  </svg>
);

export const MoneyIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const CalculatorIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm0 3h.008v.008H8.25v-.008zm3-6h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm0 3h.008v.008H11.25v-.008zm3-6h.008v.008H14.25v-.008zm0 3h.008v.008H14.25v-.008zM4.5 21V5.25A2.25 2.25 0 016.75 3h10.5a2.25 2.25 0 012.25 2.25v12.75A2.25 2.25 0 0117.25 21H6.75a2.25 2.25 0 01-2.25-2.25z" />
    </svg>
);

export const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

export const Coin50SenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><linearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stopColor="#D4D4D8"/><stop offset="100%" stopColor="#71717A"/></linearGradient><linearGradient id="b" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stopColor="#F5F5F5"/><stop offset="100%" stopColor="#A3A3A3"/></linearGradient></defs>
        <g fill="none" fillRule="evenodd">
            <circle cx="24" cy="24" r="24" fill="url(#a)"/>
            <circle cx="24" cy="24" r="20" fill="url(#b)"/>
            <text fill="#52525B" fontFamily="Arial-BoldMT, Arial" fontSize="14" fontWeight="bold">
                <tspan x="11" y="29">50</tspan>
            </text>
            <text fill="#52525B" fontFamily="ArialMT, Arial" fontSize="8">
                <tspan x="17" y="37">SEN</tspan>
            </text>
        </g>
    </svg>
);

export const Coin1RmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs><linearGradient id="c" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stopColor="#FDE047"/><stop offset="100%" stopColor="#B45309"/></linearGradient><linearGradient id="d" x1="50%" x2="50%" y1="0%" y2="100%"><stop offset="0%" stopColor="#FEF9C3"/><stop offset="100%" stopColor="#FBBF24"/></linearGradient></defs>
        <g fill="none" fillRule="evenodd">
            <circle cx="24" cy="24" r="24" fill="url(#c)"/>
            <circle cx="24" cy="24" r="20" fill="url(#d)"/>
            <text fill="#854D0E" fontFamily="Arial-BoldMT, Arial" fontSize="16" fontWeight="bold">
                <tspan x="12" y="30">RM1</tspan>
            </text>
        </g>
    </svg>
);

export const Note2RmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" fillRule="evenodd">
            <rect width="48" height="48" fill="#A3E635" rx="8"/>
            <rect width="38" height="38" x="5" y="5" stroke="#F7FEE7" strokeWidth="2" rx="4"/>
            <text fill="#4D7C0F" fontFamily="Arial-BoldMT, Arial" fontSize="16" fontWeight="bold">
                <tspan x="10" y="30">RM2</tspan>
            </text>
        </g>
    </svg>
);

export const Note5RmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" fillRule="evenodd">
            <rect width="48" height="48" fill="#34D399" rx="8"/>
            <rect width="38" height="38" x="5" y="5" stroke="#ECFDF5" strokeWidth="2" rx="4"/>
            <text fill="#065F46" fontFamily="Arial-BoldMT, Arial" fontSize="16" fontWeight="bold">
                <tspan x="10" y="30">RM5</tspan>
            </text>
        </g>
    </svg>
);

export const Note10RmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" fillRule="evenodd">
            <rect width="48" height="48" fill="#F87171" rx="8"/>
            <rect width="38" height="38" x="5" y="5" stroke="#FEF2F2" strokeWidth="2" rx="4"/>
            <text fill="#7F1D1D" fontFamily="Arial-BoldMT, Arial" fontSize="14" fontWeight="bold" textAnchor="middle">
                <tspan x="24" y="30">RM10</tspan>
            </text>
        </g>
    </svg>
);

export const Note15RmIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g fill="none" fillRule="evenodd">
            <rect width="48" height="48" fill="#818CF8" rx="8"/>
            <rect width="38" height="38" x="5" y="5" stroke="#EEF2FF" strokeWidth="2" rx="4"/>
            <text fill="#312E81" fontFamily="Arial-BoldMT, Arial" fontSize="14" fontWeight="bold" textAnchor="middle">
                <tspan x="24" y="30">RM15</tspan>
            </text>
        </g>
    </svg>
);