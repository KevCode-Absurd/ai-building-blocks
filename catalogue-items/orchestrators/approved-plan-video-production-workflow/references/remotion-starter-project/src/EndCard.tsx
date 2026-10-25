import { AbsoluteFill, Img, staticFile } from 'remotion';

type Props = {
  cta: string;
};

export const EndCard: React.FC<Props> = ({ cta }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0B0D0E',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontFamily: 'Druk, Oswald, sans-serif',
          fontWeight: 900,
          fontSize: 140,
          color: '#2CC5B8',
          textTransform: 'uppercase',
          marginBottom: 40,
        }}
      >
        {cta}
      </div>
      <Img src={staticFile('logo.svg')} style={{ width: 120, opacity: 0.8 }} />
    </AbsoluteFill>
  );
};
