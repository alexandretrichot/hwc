import React from 'react';
import { useCards } from '../hooks/useCards';
import { useShadowCards } from '../hooks/useShadowCards';
import { HwcEvent, Rect } from '../types';

export type RenderCardProps<EvType extends HwcEvent> = {
  event: EvType;
  index: number;
  rect: Rect;
  style: Pick<React.CSSProperties, 'width' | 'height'>;
  isFirst: boolean;
  isLast: boolean;
};

export type RenderShadowCardProps = RenderCardProps<HwcEvent>;

export type HwcEventsRendererProps<EvType extends HwcEvent> = {
  renderCard: (props: RenderCardProps<EvType>) => React.ReactNode;
  renderShadowCard: (props: RenderShadowCardProps) => React.ReactNode;
};

export const HwcEventsRenderer = <EvType extends HwcEvent>({
  renderCard,
  renderShadowCard,
}: HwcEventsRendererProps<EvType>): React.ReactElement => {
  const cards = useCards<EvType>();
  const shadowCards = useShadowCards();

  return (
    <div style={{ position: 'relative' }}>
      {cards.map((cardProps, index) => (
        <div
          key={index}
          style={{
            ...cardProps.style,
            position: 'absolute',
            left: `${cardProps.rect.left}px`,
            top: `${cardProps.rect.top}px`,
          }}
        >
          {renderCard(cardProps)}
          <div className='' />
        </div>
      ))}
      {shadowCards.map((shadowCardProps, index) => (
        <div
          key={index}
          style={{
            ...shadowCardProps.style,
            position: 'absolute',
            left: `${shadowCardProps.rect.left}px`,
            top: `${shadowCardProps.rect.top}px`,
          }}
        >
          {renderShadowCard(shadowCardProps)}
        </div>
      ))}
    </div>
  );
};
