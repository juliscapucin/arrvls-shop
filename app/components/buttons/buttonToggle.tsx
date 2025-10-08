import { useGSAP } from '@gsap/react';
import { useRef } from 'react';

type ButtonToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    classes?: string;
    toggleState: 'on' | 'off';
};

export default function ButtonToggle({
    classes,
    toggleState,
    ...props
}: ButtonToggleProps) {
    const toggleKnobRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!toggleKnobRef.current) return;

        // Kill any existing tweens on the knob
        gsap.killTweensOf(toggleKnobRef.current);

        // Animate the knob position based on toggleState
        gsap.to(toggleKnobRef.current, {
            x: toggleState === 'on' ? 20 : 0,
            duration: 0.3,
            ease: 'power4.out',
        });
    }, [toggleState]);

    return (
        <button
            className={`relative flex h-[18px] w-8 items-center justify-center rounded-full bg-secondary p-1 transition-colors duration-200 hover:bg-accent ${classes}`}
            {...props}
        >
            <div
                className={`absolute aspect-square h-4 rounded-full bg-primary transition-colors duration-200 ${toggleState === 'on' ? 'right-1' : 'left-1'}`}
            ></div>
        </button>
    );
}
