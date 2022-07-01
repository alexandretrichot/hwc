import { useState } from 'react';
import { RhwcDragPane, RhwcEvent, RhwcEventsRenderer, RhwcGrid, RhwcHeader, RhwcProvider, useRhwc } from 'rhwc';

export default function Docs() {
  const [events, setEvents] = useState<RhwcEvent[]>([]);

  const cal = useRhwc({
    events,
    onAddEventRequest: (ev) => setEvents([...events, ev]),
  });

  return (
    <RhwcProvider value={cal}>
      <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <RhwcHeader />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '100px minmax(0, 1fr)' }}>
        <div />
        <RhwcDragPane>
          <RhwcGrid />
          <RhwcEventsRenderer
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
        </RhwcDragPane>
      </div>
    </RhwcProvider>
  );
}
