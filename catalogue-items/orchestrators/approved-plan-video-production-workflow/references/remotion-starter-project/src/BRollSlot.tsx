import { AbsoluteFill, Video } from 'remotion';

type Props = {
  assetUrl: string;
};

export const BRollSlot: React.FC<Props> = ({ assetUrl }) => {
  return (
    <AbsoluteFill>
      <Video src={assetUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </AbsoluteFill>
  );
};
