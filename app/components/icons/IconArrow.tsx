type IconArrowProps = {
    color?: string;
};

export default function IconArrow({ color }: IconArrowProps) {
    const colorFinal = color;
    return (
        <>
            <svg
                width='100'
                height='14'
                viewBox='0 0 100 14'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path d='M0 7.37378L98.9441 7' stroke={colorFinal} />
                <path d='M93 1L99 7L93 13' stroke={colorFinal} />
            </svg>
        </>
    );
}
