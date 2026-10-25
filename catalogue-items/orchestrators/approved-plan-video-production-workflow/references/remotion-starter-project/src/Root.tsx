import { Composition } from 'remotion';
import { ReelComposition } from './ReelComposition';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ReelComposition"
        component={ReelComposition}
        durationInFrames={45 * 30}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          scenes: [],
          endCard: { cta: 'Learn more', duration: 3 },
        }}
      />
    </>
  );
};
