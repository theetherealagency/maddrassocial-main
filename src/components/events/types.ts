import type { EventType } from './eventForms';

export interface EventPanel extends EventType {
  /** Only the two featured collage cards carry imagery. */
  image?: string;
}
