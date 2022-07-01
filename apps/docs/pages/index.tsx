import { useState } from 'react';
import { HwcDragPane, HwcEvent, HwcEventsRenderer, HwcGrid, HwcHeader, HwcProvider, useHwc } from 'hwc';

export default function Docs() {
  const [events, setEvents] = useState<HwcEvent[]>([]);

  const cal = useHwc({
    events,
    onAddEventRequest: (ev) => setEvents([...events, ev]),
  });

  return (
    <HwcProvider value={cal}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <HwcHeader />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <HwcDragPane>
          <HwcGrid />
          <HwcEventsRenderer
            renderCard={({ rect, isFirst }) => (
              <div
                style={{
                  position: 'absolute',
                  backgroundColor: '#eee',
                  border: '#ccc solid 1px',
                  padding: `.5rem`,
                  borderRadius: '4px',
                  left: `${rect.left + 1}px`,
                  top: `${rect.top + 1}px`,
                  width: `${rect.width - 3}px`,
                  height: `${rect.height - 3}px`,
                  overflow: 'hidden',
                }}
              >
                <div style={{ fontSize: !isFirst ? '10px' : undefined, color: !isFirst ? '#666' : undefined }}>Title</div>
              </div>
            )}
          />
        </HwcDragPane>
      </div>
    </HwcProvider>
  );
}
