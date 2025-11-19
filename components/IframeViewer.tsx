import React from 'react';

interface IframeViewerProps {
  src: string;
  headerHeight: number;
  footerHeight: number;
  isLightMode: boolean;
}

const IframeViewer: React.FC<IframeViewerProps> = ({ src, headerHeight, footerHeight, isLightMode }) => {
  // Zoom scale factor (1.25 = 125% zoom)
  const zoomScale = 1.25;

  return (
    <div className="iframe-viewer-container relative flex-grow w-full bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200" style={{ minHeight: '70vh' }}>
      <style>{`
        .iframe-viewer-container {
          --extra-footer-clip: 120px;
        }
        @media (min-width: 1024px) {
          .iframe-viewer-container {
            --extra-footer-clip: 0px;
          }
        }
      `}</style>
      <iframe
        src={src}
        title="Embedded Website"
        className="absolute border-0"
        style={{
          // Adjust width so that when scaled up, it fills 100% of the container
          width: `${100 / zoomScale}%`,
          // Adjust height and top offset to account for the scale factor
          height: `calc((100% / ${zoomScale}) + ${headerHeight}px + ${footerHeight}px + var(--extra-footer-clip))`,
          top: `-${headerHeight * zoomScale}px`,
          // Apply zoom
          transform: `scale(${zoomScale})`,
          transformOrigin: '0 0',
          // Apply filter for light mode and a smooth transition
          filter: isLightMode ? 'invert(1) hue-rotate(180deg)' : 'none',
          transition: 'filter 0.3s ease',
          // Set a base background color that works well when inverted
          backgroundColor: '#121212',
        }}
        allow="fullscreen"
      ></iframe>
    </div>
  );
};

export default IframeViewer;
