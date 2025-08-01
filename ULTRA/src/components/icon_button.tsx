import React from 'react';

export type IconButtonProps = {
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    ariaLabel: string;
};

const IconButton: React.FC<IconButtonProps> = ({
    icon, children, onClick, className='', ariaLabel
}) => {
    return (
        <button
            onClick={onClick}
            type="button"
            aria-label={ariaLabel}
            className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-[#187FF5] via-[#2A8BFB] to-[#51ABFF] text-white font-medium text-lg rounded-full transition-all duration-200 border-none shadow-lg hover:shadow-xl ${className}`}
        >   
            <span 
                className='flex shrink-0' 
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '24px'
                }}
                aria-hidden="true"
            >
                {icon}
            </span>
            {children && <span style={{whiteSpace: 'nowrap'}}>{children}</span>}
        </button>
    )
}


export default IconButton