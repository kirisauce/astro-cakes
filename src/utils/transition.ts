import type { TransitionAnimationPair, TransitionAnimationValue } from 'astro';
import { m3anim } from './consts';

const __dropdown = {
  new: {
    name: 'dropdown',
    direction: 'reverse',
    delay: '600ms',
    ...m3anim.expressiveFastSpatial,
    easing: 'ease-out',
  },
  old: {
    name: 'dropdown',
    ...m3anim.expressiveFastSpatial,
    easing: 'ease-out',
  },
};

export const dropdown = () =>
  ({
    backwards: __dropdown,
    forwards: __dropdown,
  }) satisfies TransitionAnimationValue;
