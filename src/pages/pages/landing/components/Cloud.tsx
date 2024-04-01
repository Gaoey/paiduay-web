import React from "react";
import styles from "./Cloud.module.css";

const Cloud = ({ top = 290, height = 100, width = 600, seed = 8517 }) => {
  const baseTop = top;
  const baseHeight = height;
  const baseWidth = width;

  const backTop = top;
  const backHeight = Math.round(height * 0.3);
  const backWidth = width - 10;

  const midTop = top - 10;
  const midHeight = Math.round(height * 0.3) - 5;
  const midWidth = width - 20;

  const frontTop = top - 10;
  const frontHeight = Math.round(height * 0.3) - 10;
  const frontWidth = width - 50;

  return (
    <>
      <div
        style={{ top: `${baseTop}px`, height: `${baseHeight}px`, width: `${baseWidth}px` }}
        className={`${styles.cloud} ${styles.cloudBase}`}
      ></div>
      <div
        style={{ top: `${backTop}px`, height: `${backHeight}px`, width: `${backWidth}px` }}
        className={`${styles.cloud} ${styles.cloudBack}`}
      ></div>
      <div
        style={{ top: `${midTop}px`, height: `${midHeight}px`, width: `${midWidth}px` }}
        className={`${styles.cloud} ${styles.cloudMid}`}
      ></div>
      <div
        style={{ top: `${frontTop}px`, height: `${frontHeight}px`, width: `${frontWidth}px` }}
        className={`${styles.cloud} ${styles.cloudFront}`}
      ></div>
      <svg width="0" height="0">
        <filter id="filter-base">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011"
            numOctaves="5"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="120" />
        </filter>
        <filter id="filter-back">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011"
            numOctaves="3"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="120" />
        </filter>
        <filter id="filter-mid">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011"
            numOctaves="3"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="120" />
        </filter>
        <filter id="filter-front">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.009"
            numOctaves="4"
            seed={seed}
          />
          <feDisplacementMap in="SourceGraphic" scale="50" />
        </filter>
      </svg>
    </>
  );
};

export default Cloud;
