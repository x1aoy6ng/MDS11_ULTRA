import React from 'react';

export type ButtonProps = {
    icon: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    ariaLabel: string;
    circle?: boolean;
    size?: number;
};

const IconButton: React.FC<ButtonProps> = ({
    icon, children, onClick, className='', ariaLabel, circle=false, size=40
}) => {
    if (circle) {
        return (
            <button
                onClick={onClick}
                type='button'
                aria-label={ariaLabel}
                className={`inline-flex items-center justify-center rounded-full bg-white transition-all duration-200 border-none shadow-lg hover:shadow-xl hover:bg-gray-200${className}`}
                style={{
                    width: size,
                    height:size,
                    padding: 0
                }}
            >
                <span
                    aria-hidden='true'
                    className='flex items-center justify-center'
                    style={{
                        fontSize: size * 0.5, 
                        lineHeight: 1
                    }}
                >
                    {icon}
                </span>
            </button>
        )
    }

    return (
        <button
            onClick={onClick}
            type="button"
            aria-label={ariaLabel}
            className={`inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-[#187FF5] via-[#2A8BFB] to-[#51ABFF] hover:from-[#419AFF] hover:via-[#4B9FFF] hover:to-[#6CB8FF] text-white font-medium text-lg rounded-full transition-all duration-200 border-none shadow-lg hover:shadow-xl${className}`}
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