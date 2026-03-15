import { m3anim } from '../utils/consts';

const STATE_KEY = 'data-toggler-state';
const ANIM_ID_KEY = 'data-toggler-anim-id';
const PRESET_KEY = 'data-toggle-preset';

export interface AnimationParamters {
  keyframes: Keyframe[];
  options: KeyframeAnimationOptions;
}

export interface TogglePreset {
  enter: AnimationParamters;
  exit: AnimationParamters;
}

export const PRESETS: Record<string, TogglePreset> = {
  fade: {
    enter: {
      keyframes: [{ opacity: 0 }, { opacity: 1 }],
      options: { ...m3anim.expressiveSlowEffects },
    },
    exit: {
      keyframes: [{ opacity: 1 }, { opacity: 0 }],
      options: { ...m3anim.expressiveSlowEffects },
    },
  },

  dropdown: {
    enter: {
      keyframes: [
        { opacity: 0, transform: 'translateY(-40%)' },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      options: { ...m3anim.expressiveSlowSpatial },
    },
    exit: {
      keyframes: [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-40%)' },
      ],
      options: { ...m3anim.expressiveSlowSpatial },
    },
  },
} as const;

const generateId = () => Math.random().toString(36).slice(2, 2 + 8);

export const toggle = (el: HTMLElement, presetName?: string): Animation => {
  let currentState = el.getAttribute(STATE_KEY);
  if (!currentState) {
    currentState =
      el.computedStyleMap().get('display') === 'none' ? 'hide' : 'show';
    el.setAttribute(STATE_KEY, currentState);
  }

  // Cancel previous animation
  const previousAnimId = el.getAttribute(ANIM_ID_KEY);
  if (previousAnimId) {
    const anim = el.getAnimations().find((anim) => anim.id === previousAnimId);
    try {
      anim?.commitStyles();
    } catch (err) {}
    anim?.cancel();
  }

  // Decide which preset will be used
  if (!presetName) {
    presetName = el.getAttribute(PRESET_KEY) ?? 'fade';
  }
  const preset = PRESETS[presetName];

  if (currentState === 'show') {
    // From show to hide (exit)
    el.setAttribute(STATE_KEY, 'hide');
    const { keyframes, options } = preset.exit;

    // Configure the animation
    const anim = el.animate(keyframes, options);
    anim.id = generateId();
    anim.addEventListener('finish', (ev) => {
      el.style.display = 'none';
      el.removeAttribute(ANIM_ID_KEY);
    });
    el.setAttribute(ANIM_ID_KEY, anim.id);

    anim.play();
    return anim;
  } else if (currentState === 'hide') {
    // From hide to show (enter)
    el.setAttribute(STATE_KEY, 'show');
    const { keyframes, options } = preset.enter;

    // Configure the animation
    const anim = el.animate(keyframes, options);
    anim.id = generateId();
    anim.addEventListener('finish', (ev) => {
      el.removeAttribute(ANIM_ID_KEY);
      try {
        anim.commitStyles();
      } catch (err) {}
    });
    el.style.display = '';
    el.setAttribute(ANIM_ID_KEY, anim.id);

    anim.play();
    return anim;
  } else {
    throw new Error(`Invalid state: ${currentState}`);
  }
};
