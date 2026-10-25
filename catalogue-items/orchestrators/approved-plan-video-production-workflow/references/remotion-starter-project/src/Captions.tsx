import { AbsoluteFill } from 'remotion';

type Props = {
  text: string;
};

export const Captions: React.FC<Props> = ({ text }) => {
  return (
    <AbsoluteFill
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 60,
      }}
    >
      <div
        style={{
          fontFamily: 'Druk, Oswald, sans-serif',
          fontWeight: 900,
          fontSize: 120,
          color: '#F2EFE8',
          textAlign: 'center',
          lineHeight: 1.0,
          textTransform: 'uppercase',
          paddingBottom: 400,
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};
