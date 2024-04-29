import { Parallax } from 'react-scroll-parallax'
import styles from './Main.module.css'
import React, { useState, useEffect } from 'react'
import { useParallaxController } from 'react-scroll-parallax'
import Cloud from './Cloud'

const ParallaxImage = (props: any) => {
  const parallaxController = useParallaxController()

  // updates cached values after image dimensions have loaded
  const handleLoad = () => parallaxController?.update()

  return <img src={props.src} onLoad={handleLoad} alt='parallax image' />
}

const HeroImage = () => {
  const [windowWidth, setWindowWidth] = useState(100000)
  const [windowHeight, setWindowHeight] = useState(10000)

  useEffect(() => {
    const updateDimensions = () => {
      setWindowWidth(window.innerWidth)
      setWindowHeight(window.innerHeight)
    }

    updateDimensions() // Initial update
    window.addEventListener('resize', updateDimensions)

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  return (
    <div
      style={{
        display: 'block',
        position: 'relative',
        backgroundColor: 'transparent',
        width: '100vw',
        height: windowWidth > windowHeight ? '65vw' : '60vh'
      }}
    >
      <Parallax className={styles.backMountainTwo} translateX={[20, 0]}>
        <ParallaxImage src={'/images/landing/hero/Back_mountain_2.svg'} />
      </Parallax>
      <div className={styles.waterRipple}></div>
      <Parallax className={styles.backMountainOne} translateX={[-20, 0]}>
        <ParallaxImage src={'/images/landing/hero/Back_mountain_1.svg'} />
      </Parallax>
      <Parallax className={styles.fourthTerrain} translateX={[30, 0]}>
        <ParallaxImage src={'/images/landing/hero/4th_terrain.svg'} />
      </Parallax>
      <Parallax className={styles.thirdTerrain} translateX={[-30, 0]}>
        <ParallaxImage src={'/images/landing/hero/3rd_terrain.svg'} />
      </Parallax>
      <Parallax className={styles.secondTerrain} translateX={[10, 0]}>
        <ParallaxImage src={'/images/landing/hero/2nd_terrain.svg'} />
      </Parallax>
      <Parallax className={styles.firstTerrain} translateX={[-10, 0]}>
        <ParallaxImage src={'/images/landing/hero/1st_terrain.svg'} />
      </Parallax>
      <div
        style={{
          position: 'absolute',
          width: '100vw',
          zIndex: 1,
          bottom: '-10px'
        }}
      >
        <ParallaxImage src={'/images/landing/hero/front rocks.svg'} />
      </div>
      <div
        style={{
          position: 'absolute',
          width: '10vw',
          zIndex: 1,
          bottom: '23.5vw',
          right: '27.5vw'
        }}
      >
        <ParallaxImage src={'/images/landing/hero/fisherman.svg'} />
      </div>
      <svg>
        <filter id='turbulence' x='0' y='0' width='100%' height='100%'>
          <feTurbulence id='sea-filter' numOctaves='3' seed='2' baseFrequency='0.02 0.05'></feTurbulence>
          <feDisplacementMap scale='15' in='SourceGraphic'></feDisplacementMap>
          <animate
            xlinkHref='#sea-filter'
            attributeName='baseFrequency'
            dur='60s'
            keyTimes='0;0.5;1'
            values='0.02 0.05;0.04 0.07;0.02 0.05'
            repeatCount='indefinite'
          />
        </filter>
      </svg>
    </div>
  )
}

const Sky = () => {
  return (
    <div style={{ zIndex: -10 }}>
      <div className={styles.x1}>
        <Cloud top={-100} height={100} width={400} seed={7654} />
      </div>
      <div className={styles.x2}>
        <Cloud top={100} height={80} width={600} seed={2654} />
      </div>
      <div className={styles.x3}>
        <Cloud top={230} height={30} width={900} seed={8517} />
      </div>
      <div className={styles.x4}>
        <Cloud top={350} height={100} width={1000} seed={3817} />
      </div>
      <div className={styles.x5}>
        <Cloud top={480} height={120} width={1500} seed={6217} />
      </div>
    </div>
  )
}

const Main = () => {
  return (
    <div
      style={{
        backgroundColor: '#E0ECF0',
        overflowY: 'hidden',
        position: 'relative'
      }}
    >
      <Sky />
      <HeroImage />
    </div>
  )
}

export default Main
