export function WaveDivider() {
  return (
    <div className="relative -mt-px h-[88px] overflow-hidden bg-transparent leading-[0] text-white">
      <svg className="absolute inset-0 h-full w-[200%]" viewBox="0 0 1440 88" preserveAspectRatio="none" aria-hidden="true">
        <path className="wave-a" fill="currentColor" d="M0,48 C240,88 360,8 720,40 C1080,72 1200,16 1440,40 L1440,88 L0,88 Z" />
      </svg>
      <svg className="absolute inset-0 h-full w-[200%] text-white/70" viewBox="0 0 1440 88" preserveAspectRatio="none" aria-hidden="true">
        <path className="wave-b" fill="currentColor" d="M0,32 C280,0 480,80 720,48 C960,16 1160,72 1440,36 L1440,88 L0,88 Z" />
      </svg>
    </div>
  );
}
