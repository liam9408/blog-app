/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject } from 'react';
import useEventListener from './use-event-listener';

type AnyEvent = MouseEvent | TouchEvent;

export default function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  cb: (payload: AnyEvent) => void
) {
  useEventListener(
    'click',
    (e: any) => {
      if (ref.current == null || ref.current.contains(e.target)) return;
      cb(e);
    },
    document
  );
}

/*

USAGE:

export default function ClickOutsideComponent() {
  const [open, setOpen] = useState(false)
  const modalRef = useRef()

  useClickOutside(modalRef, () => {
    if (open) setOpen(false)
  })

  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      <div
        ref={modalRef}
        style={{
          display: open ? "block" : "none",
          backgroundColor: "blue",
          color: "white",
          width: "100px",
          height: "100px",
          position: "absolute",
          top: "calc(50% - 50px)",
          left: "calc(50% - 50px)",
        }}
      >
        <span>Modal</span>
      </div>
    </>
  )
}


*/
