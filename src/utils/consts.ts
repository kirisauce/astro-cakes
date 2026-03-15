export interface Animation {
  /**
   * The easing function in CSS string format.
   *
   * @example "cubic-bezier(0.4, 0, 0.2, 1)"
   */
  easing: string;

  /**
   * The duration of the animation in milliseconds.
   */
  duration: number;
}

const _m3anim = {
  expressiveFastSpatial: {
    easing: 'cubic-bezier(0.42, 1.67, 0.21, 0.90)',
    duration: 350,
  },
  expressiveDefaultSpatial: {
    easing: 'cubic-bezier(0.38, 1.21, 0.22, 1.00)',
    duration: 500,
  },
  expressiveSlowSpatial: {
    easing: 'cubic-bezier(0.39, 1.29, 0.35, 0.98)',
    duration: 650,
  },
  expressiveFastEffects: {
    easing: 'cubic-bezier(0.31, 0.94, 0.34, 1.00)',
    duration: 150,
  },
  expressiveDefaultEffects: {
    easing: 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
    duration: 200,
  },
  expressiveSlowEffects: {
    easing: 'cubic-bezier(0.34, 0.88, 0.34, 1.00)',
    duration: 300,
  },
  standardFastSpatial: {
    easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
    duration: 350,
  },
  standardDefaultSpatial: {
    easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
    duration: 500,
  },
  standardSlowSpatial: {
    easing: 'cubic-bezier(0.27, 1.06, 0.18, 1.00)',
    duration: 750,
  },
  standardFastEffects: {
    easing: 'cubic-bezier(0.31, 0.94, 0.34, 1.00)',
    duration: 150,
  },
  standardDefaultEffects: {
    easing: 'cubic-bezier(0.34, 0.80, 0.34, 1.00)',
    duration: 200,
  },
  standardSlowEffects: {
    easing: 'cubic-bezier(0.34, 0.88, 0.34, 1.00)',
    duration: 300,
  },
} as const;
export const m3anim: Record<keyof typeof _m3anim, Animation> = _m3anim;
