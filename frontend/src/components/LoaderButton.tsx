import React from 'react';
import Button from 'react-bootstrap/Button';
import { BsArrowRepeat } from 'react-icons/bs';
import './LoaderButton.css';

interface LoaderButtonProps {
    isLoading: boolean;
    className?: string;
    block: boolean;
    type: string;
    disabled: boolean;
    children?: React.ReactNode;
    variant?: string;
}

export const LoaderButton: React.FC<LoaderButtonProps> = (
    props
): JSX.Element => {
    const { disabled, isLoading, className, children, block, type, variant } =
        props;
    return (
        <Button
            disabled={disabled || isLoading}
            className={`LoaderButton ${className}`}
            block={block}
            type={type}
            variant={variant}
            size="lg"
        >
            {isLoading && <BsArrowRepeat className="spinning" />}
            {children}
        </Button>
    );
};
