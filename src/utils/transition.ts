import type { TransitionAnimationPair, TransitionAnimationValue } from 'astro';
import { m3anim } from './consts';

const __dropdown = {
  new: {
    name: 'dropdown',
    direction: 'reverse',
    delay: '200ms',
    ...m3anim.expressiveDefaultEffects,
  },
  old: {
    name: 'dropdown',
    ...m3anim.expressiveDefaultEffects,
  },
};

export const dropdown = () =>
  ({
    backwards: __dropdown,
    forwards: __dropdown,
  }) satisfies TransitionAnimationValue;
