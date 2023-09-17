/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';

export default function useEventListener<
  T extends HTMLElement = HTMLDivElement
>(
  eventType: keyof WindowEventMap,
  callback: (event: Event | any) => void,
  element: any = window
) {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e: Event) => callbackRef.current(e);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}

/*

export default function EventListenerComponent() {
  const [key, setKey] = useState("")
  useEventListener("keydown", e => {
    setKey(e.key)
  })

  return <div>Last Key: {key}</div>
}

*/
