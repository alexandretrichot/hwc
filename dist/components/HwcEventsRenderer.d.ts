import React from 'react';
import { HwcEvent } from '../models/event.model';
export declare type Rect = {
    width: number;
    height: number;
    left: number;
    top: number;
};
export declare type RenderCardProps = {
    event: HwcEvent;
    rect: Rect;
    isFirst: boolean;
    isLast: boolean;
};
export declare type HwcEventsRendererProps = {
    renderCard?: (props: RenderCardProps) => React.ReactNode;
};
export declare const HwcEventsRenderer: React.FC<HwcEventsRendererProps>;
