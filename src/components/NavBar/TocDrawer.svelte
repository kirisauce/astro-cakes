<script lang="ts">
  import IconClose from '~icons/mingcute/close-line?raw';
  import TableOfContents from '../TableOfContents.svelte';
  import type { TocHeading } from '../TableOfContents.svelte';
  import { toggle, getAutoClose } from '../../client/toggler';

  interface Props {
    headings: TocHeading[];
  }

  const { headings }: Props = $props();

  let overlayEl: HTMLDivElement | null = $state(null);
  let panelEl: HTMLDivElement | null = $state(null);

  // 本项目滚动容器是 #page（BasicLayout .page），锁 body 无效。
  // 锁定滚动：不改变 #page 的 overflow（保持 auto，滚动条常驻不闪没，
  // scrollbar-gutter: stable 保证槽位稳定），改为拦截遮罩上的滚动输入——
  // 遮罩覆盖全屏（position:fixed，inset:0），wheel/touchmove 目标都是它，
  // 给它 preventDefault 即可锁住背后内容滚动。
  let scrollBlocker: ((e: Event) => void) | null = null;
  function lockScroll(locked: boolean) {
    const overlay = overlayEl;
    if (locked && overlay && !scrollBlocker) {
      scrollBlocker = (e: Event) => {
        if (e.type === 'wheel' || e.type === 'touchmove') e.preventDefault();
      };
      overlay.addEventListener('wheel', scrollBlocker, { passive: false });
      overlay.addEventListener('touchmove', scrollBlocker, { passive: false });
    } else if (!locked && scrollBlocker && overlay) {
      overlay.removeEventListener('wheel', scrollBlocker);
      overlay.removeEventListener('touchmove', scrollBlocker);
      scrollBlocker = null;
    }
  }

  function escHandler(e: KeyboardEvent) {
    if (e.key === 'Escape') toggle(overlayEl!);
  }

  // 遮罩（#toc-drawer）的开合由 MenuButton 的
  // toggle(#toc-drawer, { autoCloseWhen: 'pointerdown' }) 驱动（fade 淡入淡出），
  // 这里只做“伴随”：同步面板（slide-down）、锁滚动、Esc。
  // $effect 依赖 overlayEl + panelEl，两者都赋值后才建 observer，
  // 清理也走 $effect 的返回函数（只在客户端触发，SSR 安全）。
  let observer: MutationObserver | null = null;
  $effect(() => {
    const overlay = overlayEl;
    const panel = panelEl;
    if (!overlay || !panel) return;

    observer?.disconnect();
    observer = new MutationObserver(() => {
      const state = overlay.getAttribute('data-toggler-state');
      if (state === 'show') {
        if (panel.getAttribute('data-toggler-state') !== 'show') {
          toggle(panel, { presetName: 'slide-down' });
        }
        lockScroll(true);
        document.addEventListener('keydown', escHandler);
      } else {
        if (panel.getAttribute('data-toggler-state') !== 'hide') {
          toggle(panel, { presetName: 'slide-down' });
        }
        lockScroll(false);
        document.removeEventListener('keydown', escHandler);
      }
    });
    observer.observe(overlay, {
      attributes: true,
      attributeFilter: ['data-toggler-state'],
    });

    return () => {
      observer?.disconnect();
      observer = null;
      lockScroll(false);
      document.removeEventListener('keydown', escHandler);
    };
  });

  // 点击面板内：忽略全局自动关闭（面板是对话内容，点它不关遮罩）
  function handlePanelPointerdown(e: PointerEvent) {
    getAutoClose(overlayEl!)?.ignore?.(e);
  }

  // 关闭按钮 / 点击目录条目：直接 toggle 遮罩，面板由观察者同步
  function closeWithAnim() {
    toggle(overlayEl!);
  }
</script>

<!--
  抽屉 = 遮罩（fade，MenuButton 的 target，autoCloseWhen:'pointerdown' 自动关闭）
        + 面板（slide-down，由组件观察遮罩状态同步开合）。
  - 打开：菜单按钮 toggle(#toc-drawer, {autoCloseWhen:'pointerdown'}) → 遮罩淡入 + 面板滑下
  - 关闭：点击遮罩区 → document pointerdown 未被 ignore → autoClose 自动关闭
          点击面板内 → getAutoClose().ignore() 忽略（不关闭）
  - Esc / 关闭按钮 / 目录条目：手动 toggle(遮罩)，面板同步
-->
<div
  id="toc-drawer"
  class="toc-overlay"
  data-toggle-preset="fade"
  data-toggler-state="hide"
  style="display: none"
  bind:this={overlayEl}
></div>

<div
  class="toc-panel"
  role="dialog"
  aria-modal="true"
  aria-label="目录"
  tabindex="-1"
  data-toggle-preset="slide-down"
  data-toggler-state="hide"
  style="display: none"
  bind:this={panelEl}
  onpointerdown={handlePanelPointerdown}
>
  <div class="panel-header">
    <span class="panel-title">目录</span>
    <button class="close-btn" aria-label="关闭目录" onclick={closeWithAnim}>
      {@html IconClose}
    </button>
  </div>
  <div class="panel-body">
    <TableOfContents {headings} autoScroll onNavigate={closeWithAnim} />
  </div>
</div>

<style lang="stylus">
  .toc-overlay {
    position: fixed;
    inset: 0;
    z-index: 600;
    background-color: unquote("rgba(0, 0, 0, 0.45)");
    font-family: var(--font-sans);
  }

  .toc-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    margin: 0 auto;
    z-index: 601;
    width: 80%;
    max-width: 1000px;
    max-height: 80vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background-color: unquote("color-mix(in oklch, var(--primary-container) 72%, transparent)");
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding: 12px 24px 16px;
    border-radius: 0 0 20px 20px;
    border: 1px solid var(--border);
    box-shadow:
      0 12px 32px -8px var(--shadow),
      0 2px 6px -2px var(--shadow);
    font-family: var(--font-sans);

    @media (max-width: 640px) {
      width: 92%;
      padding: 12px 16px;
    }
  }

  .panel-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 6px 0 10px;
    border-bottom: 1px solid var(--border);
  }

  .panel-title {
    font-size: 1.3rem;
    font-weight: bold;
    font-family: var(--font-monospace);
    letter-spacing: 0.08em;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: none;
    border-radius: 6px;
    color: var(--text-muted);
    background-color: transparent;
    cursor: pointer;
    transition:
      background-color var(--expressive-default-effects),
      transform var(--expressive-default-spatial);

    &:hover {
      background-color: var(--primary-container);
    }

    &:active {
      transform: scale(0.92);
    }

    :global(svg) {
      width: 20px;
      height: 20px;
    }
  }

  .panel-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding-top: 8px;
    scrollbar-width: thin;
    scrollbar-color: unquote("color-mix(in srgb, var(--text) 15%, transparent) transparent");

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: unquote("color-mix(in srgb, var(--text) 15%, transparent)");
      border-radius: 3px;
    }
  }
</style>
