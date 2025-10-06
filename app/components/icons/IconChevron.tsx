type IconChevronProps = {
    direction: 'back' | 'forward' | 'up' | 'down';
};

export default function IconChevron({ direction }: IconChevronProps) {
    const rotation = {
        back: 'rotate-180',
        forward: '',
        up: 'rotate-90',
        down: '-rotate-90',
    }[direction];
    return (
        <i
            className={`flex transform items-center justify-center transition-transform duration-300 ${rotation}`}
        >
            <svg
                transform='translate(-3, 0)'
                width='19'
                height='18'
                viewBox='0 0 19 18'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
            >
                <path
                    d='M17.666 9.14504L9.31334 17.4977'
                    stroke='currentColor'
                />
                <path
                    d='M17.6602 9.24658L9.20607 0.79249'
                    stroke='currentColor'
                />
            </svg>
        </i>
    );
}
