/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Render mode is switched on by URL, not by a build flag, so the exact link the
 * headless renderer drives can also be opened in a normal browser to preview the
 * video full-screen and chrome-free. One code path, three contexts.
 */

export interface RenderMode {
  active: boolean;
  /** Spec name to load from `public/specs/<name>.json`. */
  specName: string | null;
  /** Start paused and wait for `__polypals.seek()` rather than free-running. */
  stepped: boolean;
}

export function getRenderMode(search: string = window.location.search): RenderMode {
  const params = new URLSearchParams(search);
  const active = params.get('render') === '1';
  return {
    active,
    specName: params.get('spec'),
    // A human previewing in a browser wants it to play; puppeteer wants to step it.
    stepped: active && params.get('play') !== '1',
  };
}
