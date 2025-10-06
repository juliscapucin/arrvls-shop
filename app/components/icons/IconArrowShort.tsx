type IconArrowShortProps = {
    color?: string;
};

export default function IconArrowShort({ color }: IconArrowShortProps) {
    const colorFinal = color;

    return (
        <>
            <svg
                width='31'
                height='28'
                viewBox='0 0 31 28'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    d='M30.5351 14.0464L17.4122 27.1694'
                    stroke={colorFinal}
                />
                <path
                    d='M30.5273 14.2056L17.245 0.923241'
                    stroke={colorFinal}
                />
                <path
                    d='M0.609375 14.0103L30.4147 14.0103'
                    stroke={colorFinal}
                />
            </svg>
        </>
    );
}
