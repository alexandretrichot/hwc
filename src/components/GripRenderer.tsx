import React, { useMemo, useCallback } from 'react';
import { useHwcContext } from '../contexts/HwcContext';
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
  const { setEventResizing } = useHwcContext<EvType>();

  const style = useMemo<GripStyle>(() => {
    return {
      position: 'absolute',
      top: position === 'start' ? '-4px' : undefined,
      bottom: position === 'end' ? '-4px' : undefined,
      height: '9px',
      width: '100%',
      cursor: 'ns-resize',
    };
  }, [position]);

  const onMouseDownHandler = useCallback(
    (ev: React.MouseEvent) => {
      ev.preventDefault();
      ev.stopPropagation();

      setEventResizing(index, position);
    },
    [setEventResizing, index, position],
  );

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
  }, [event, index, position, style, onMouseDownHandler]);

  if (renderGrip) return <>{renderGrip(props)}</>;

  return <div {...props.elProps} />;
};
