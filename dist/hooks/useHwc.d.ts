import { IHwcContext } from '../contexts/HwcContext';
import { HwcEvent } from '../models/event.model';
export declare type UseHwcProps = {
    startDay?: Date;
    daysCount?: number;
    cellHeight?: number;
    events?: HwcEvent[];
    onAddEventRequest?: (ev: HwcEvent) => void;
};
export declare const useHwc: (props?: UseHwcProps) => IHwcContext;
