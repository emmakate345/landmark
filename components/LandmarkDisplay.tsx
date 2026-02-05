'use client';

import { Landmark } from '@/types/landmark';
import styles from './LandmarkDisplay.module.css';

interface LandmarkDisplayProps {
  landmark: Landmark;
}

export default function LandmarkDisplay({ landmark }: LandmarkDisplayProps) {
  return (
    <div className={styles.container}>
      <div className={styles.imageContainer}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={landmark.imageUrl}
          alt="Mystery landmark"
          className={styles.image}
        />
      </div>
    </div>
  );
}
