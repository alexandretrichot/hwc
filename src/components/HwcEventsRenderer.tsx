import React, { useCallback } from 'react';
import { useHwcContext } from '../contexts/HwcContext';
import { useCards } from '../hooks/useCards';
import { useShadowCards } from '../hooks/useShadowCards';
import { HwcEvent, Rect } from '../types';
import { GripRenderer, RenderGripProps } from './GripRenderer';

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
  renderGrip?: (props: RenderGripProps<EvType>) => React.ReactNode;
};

export const HwcEventsRenderer = <EvType extends HwcEvent>({
  renderCard,
  renderShadowCard,
  renderGrip,
}: HwcEventsRendererProps<EvType>): React.ReactElement => {
  const { setEventMoving } = useHwcContext<EvType>();

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
          onMouseDown={ev => {
            ev.preventDefault();
            console.log(cardProps.index);
            setEventMoving(cardProps.index);
          }}
        >
          {renderCard(cardProps)}

          {cardProps.isFirst && (
            <GripRenderer
              position='start'
              event={cardProps.event}
              index={cardProps.index}
              renderGrip={renderGrip}
            />
          )}
          {cardProps.isLast && (
            <GripRenderer
              position='end'
              event={cardProps.event}
              index={cardProps.index}
              renderGrip={renderGrip}
            />
          )}
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
