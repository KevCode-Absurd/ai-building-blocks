import { AbsoluteFill, Sequence } from 'remotion';
import { Captions } from './Captions';
import { BRollSlot } from './BRollSlot';
import { EndCard } from './EndCard';

type Scene = {
  in: number;
  out: number;
  type: 'talking-head' | 'b-roll';
  caption?: string;
  assetUrl?: string;
};

type Props = {
  scenes: Scene[];
  endCard: { cta: string; duration: number };
};

export const ReelComposition: React.FC<Props> = ({ scenes, endCard }) => {
  const fps = 30;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0B0D0E' }}>
      {scenes.map((scene, i) => {
        const from = scene.in * fps;
        const duration = (scene.out - scene.in) * fps;

        return (
          <Sequence key={i} from={from} durationInFrames={duration}>
            {scene.type === 'b-roll' && scene.assetUrl ? (
              <BRollSlot assetUrl={scene.assetUrl} />
            ) : null}
            {scene.caption ? <Captions text={scene.caption} /> : null}
          </Sequence>
        );
      })}

      <Sequence
        from={(scenes[scenes.length - 1]?.out || 0) * fps}
        durationInFrames={endCard.duration * fps}
      >
        <EndCard cta={endCard.cta} />
      </Sequence>
    </AbsoluteFill>
  );
};
