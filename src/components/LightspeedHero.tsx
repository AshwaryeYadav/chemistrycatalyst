<h1
  className="text-5xl md:text-7xl font-display font-semibold tracking-tight leading-tight text-white flex items-center justify-center gap-2"
  style={{
    transform: `rotateX(${-mousePosition.y * 0.5}deg) rotateY(${mousePosition.x * 0.5}deg) translateZ(20px)`,
    textShadow: `
      0 1px 0 rgba(255,255,255,0.1),
      0 2px 4px rgba(0,0,0,0.35),
      ${mousePosition.x * 0.5}px ${mousePosition.y * 0.5}px 14px rgba(0,0,0,0.25)
    `,
    transformStyle: "preserve-3d",
  }}
>
  {/* Inline L slot */}
  <span
    className="inline-block align-baseline"
    style={{
      width: "0.9em",
      height: "1.1em",
      overflow: "visible",
      flexShrink: 0,
    }}
  >
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [2.5, 2.2, 3.4], fov: 38 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 6, 5]}
        castShadow
        intensity={1.1}
        shadow-mapSize={[1024, 1024]}
      />
      <hemisphereLight args={["#ffffff", "#222222", 0.35]} />
      <LMesh />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        rotateSpeed={0.7}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </Canvas>
  </span>

  {/* Rest of the word */}
  <span className={`i-slot ${iAsTower ? "on" : ""}`}>
    {/* block I */}
    <span className="i-layer i-text">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 72 220"
        preserveAspectRatio="xMidYMax meet"
        className="text-white"
      >
        <g transform="translate(36,0)">
          <rect x={-36} y={40} width={72} height={170} fill="currentColor" />
        </g>
      </svg>
    </span>
    {/* tower I */}
    <span className="i-layer i-tower">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 72 220"
        preserveAspectRatio="xMidYMax meet"
        className="text-white"
      >
        <g transform="translate(36,0)">
          <rect x={-36} y={40} width={72} height={170} fill="currentColor" />
          <rect x={-36} y={32} width={72} height={8} fill="currentColor" />
          <g transform="translate(0,20)">
            <circle r={9} fill="rgba(0,0,0,.8)" stroke="currentColor" strokeWidth={3} />
            <circle r={1} fill="currentColor" />
          </g>
          <polygon
            points="0,0 36,32 -36,32"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </span>
  </span>

  <span>GHTSPEED</span>
  <br />
  <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
    FELLOWS
  </span>
</h1>
