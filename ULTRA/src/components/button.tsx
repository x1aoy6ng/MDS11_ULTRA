import React from 'react';

export type ButtonProps = {
    icon?: React.ReactNode;
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    ariaLabel: string;
    circle?: boolean;
    size?: number;
    disabled?: boolean;
};

const IconButton: React.FC<ButtonProps> = ({
    icon, children, onClick, className='', ariaLabel, circle=false, size=40, disabled=false
}) => {
    if (circle) {
        return (
            <button
                onClick={onClick}
                type='button'
                aria-label={ariaLabel}
                className={`inline-flex items-center justify-center rounded-full bg-white dark:bg-[#404040] transition-all duration-200 border-none shadow-lg hover:shadow-xl hover:bg-gray-200${className}`}
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

    // two condition: button with text & icon, button with text
    const hasIcon = icon != null && icon != undefined
    const hasText = children != null && children != undefined
    const needGaps = hasIcon && hasText
    const RegularButtonClass = `inline-flex items-center justify-center ${needGaps? 'gap-2': ''} px-4 py-2 bg-gradient-to-r from-[#187FF5] via-[#2A8BFB] to-[#51ABFF] hover:from-[#419AFF] hover:via-[#4B9FFF] hover:to-[#6CB8FF] text-white font-medium text-lg rounded-full transition-all duration-200 border-none shadow-lg hover:shadow-xl${className}`

    return (
        <button
            onClick={disabled? undefined : onClick}
            type="button"
            aria-label={ariaLabel}
            disabled={disabled}
            className={RegularButtonClass}
        >
            {hasIcon && (
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
            )}
            {hasText && (
                <span
                    style={{whiteSpace: 'nowrap'}}
                    className={!hasIcon? 'text-center': ''}
                >
                    {children}
                </span>
            )}
        </button>
    )
}



export default IconButton