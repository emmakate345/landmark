'use client';

import styles from './HintButton.module.css';

interface HintButtonProps {
  onClick: () => void;
  disabled: boolean;
  continent: string;
}

export default function HintButton({ onClick, disabled, continent }: HintButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={styles.button}
    >
      {disabled ? (
        <>🌍 Hint: {continent}</>
      ) : (
        <>💡 Get Hint</>
      )}
    </button>
  );
}
