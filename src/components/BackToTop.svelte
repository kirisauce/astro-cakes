<script lang="ts">
  import IconArrowUp from '~icons/mingcute/arrow-up-line';

  interface Props {
    /** 滚动容器选择器 */
    scrollContainer?: string;
    /** 滚动超过多少倍容器视口高度后出现 */
    threshold?: number;
  }

  const { scrollContainer = '#page', threshold = 1 }: Props = $props();

  let visible = $state(false);

  $effect(() => {
    const container = document.querySelector<HTMLElement>(scrollContainer);
    if (!container) return;

    const limit = container.clientHeight * threshold;
    const onScroll = () => {
      visible = container.scrollTop > limit;
    };

    onScroll();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  });

  function scrollToTop() {
    document.querySelector<HTMLElement>(scrollContainer)?.scrollTo({
      top: 0,
      // 尊重系统的减少动态效果设置
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches
        ? 'auto'
        : 'smooth',
    });
  }
</script>

<button
  id="back-to-top"
  class="back-to-top"
  class:visible
  type="button"
  aria-label="返回顶部"
  title="返回顶部"
  aria-hidden={!visible}
  tabindex={visible ? 0 : -1}
  onclick={scrollToTop}
>
  <IconArrowUp />
</button>

<style lang="stylus">
  // 显隐与 hover 反馈共用的常驻过渡
  motion = opacity var(--expressive-fast-effects), translate var(--expressive-fast-spatial), background-color var(--expressive-default-effects), box-shadow var(--expressive-default-effects), scale var(--expressive-fast-spatial)

  .back-to-top {
    position: fixed;
    right: 24px;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    // 高于正文（10）与页脚，低于导航栏（500）
    z-index: 400;

    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    padding: 0;
    box-sizing: border-box;
    border: 1px solid var(--border);
    border-radius: 50%;
    background-color: var(--primary-container-72);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    box-shadow:
      0 12px 32px -8px var(--shadow),
      0 2px 6px -2px var(--shadow);
    color: var(--secondary);
    cursor: pointer;

    // 离场：缩小 + 下沉 + 淡出，visibility 等过渡走完再切
    opacity: 0;
    visibility: hidden;
    translate: 0 12px;
    scale: 0.8;
    pointer-events: none;
    transition:
      motion,
      visibility 0s linear var(--expressive-fast-spatial-duration);

    &.visible {
      opacity: 1;
      visibility: visible;
      translate: 0 0;
      scale: 1;
      pointer-events: auto;
      transition:
        motion,
        visibility 0s;
    }

    &:hover {
      background-color: var(--primary-container);
      box-shadow:
        0 16px 40px -8px var(--shadow),
        0 2px 6px -2px var(--shadow);
      scale: 1.08;
    }

    &:active {
      scale: 0.94;
    }

    &:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    :global(svg) {
      width: 22px;
      height: 22px;
    }

    @media (max-width: 640px) {
      right: 16px;
      bottom: calc(16px + env(safe-area-inset-bottom, 0px));
      width: 44px;
      height: 44px;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }
</style>
