import { HwcEvent } from '../models/event.model';
export declare const buildIsEventVisibleFilter: (startDay: Date, daysCount: number) => (ev: HwcEvent) => boolean;
export declare const getCroppedEventsByDay: (ev: HwcEvent) => HwcEvent[];
