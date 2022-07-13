import React, { useMemo, useCallback } from 'react';
import { HwcEvent } from '../types';

export type GripPosition = 'start' | 'end';

export type GripStyle = Pick<
  React.CSSProperties,
  'height' | 'position' | 'cursor' | 'width' | 'top' | 'bottom'
>;

export type GripMouseEvents = Required<
  Pick<React.ComponentProps<'div'>, 'onMouseDown'>
>;

export type RenderGripProps<EvType extends HwcEvent> = {
  event: EvType;
  index: number;
  style: GripStyle;
  position: GripPosition;
  elProps: GripMouseEvents & {
    style: GripStyle;
  };
};

export type GripRendererProps<EvType extends HwcEvent> = {
  position: GripPosition;
  index: number;
  event: EvType;

  renderGrip?: (props: RenderGripProps<EvType>) => React.ReactNode;
};

export const GripRenderer = <EvType extends HwcEvent>({
  event,
  index,
  position,
  renderGrip,
}: GripRendererProps<EvType>): React.ReactElement => {
  const style = useMemo<GripStyle>(() => {
    return {
      position: 'absolute',
      top: position === 'start' ? '-2px' : undefined,
      bottom: position === 'end' ? '-2px' : undefined,
      height: '5px',
      width: '100%',
      cursor: 'ns-resize',
      background: 'red',
    };
  }, [position]);

  const onMouseDownHandler = useCallback((ev: React.MouseEvent) => {
    ev.preventDefault();
    ev.stopPropagation();

    console.log('resize grabbed');
  }, []);

  const props = useMemo<RenderGripProps<EvType>>(() => {
    return {
      event,
      index,
      position,
      style,
      elProps: {
        style,
        onMouseDown: onMouseDownHandler,
      },
    };
  }, [event, index, position, onMouseDownHandler]);

  if (renderGrip) return <>{renderGrip(props)}</>;

  return <div {...props.elProps} />;
};
