'use client';

import { useEffect } from 'react';
import { useVisualIdentity } from '@/contexts/visual-identity-context';
import { getVisualIdentityUrl } from '@/lib/visual-identity';

/** Keep existing browser tabs in sync; initial links also come from server metadata. */
export function VisualIdentityIcons() {
  const { settings, loaded } = useVisualIdentity();
  const favicon = getVisualIdentityUrl(settings?.favicon_path);
  const apple = getVisualIdentityUrl(settings?.apple_touch_icon_path);

  useEffect(() => {
    if (!loaded) return;
    for (const [rel, href] of [['icon', favicon], ['apple-touch-icon', apple]] as const) {
      const selector = `link[data-portfolio-visual-identity="${rel}"]`;
      const existing = document.head.querySelector<HTMLLinkElement>(selector);
      if (!href) {
        existing?.remove();
        continue;
      }
      const link = existing || document.createElement('link');
      link.dataset.portfolioVisualIdentity = rel;
      link.rel = rel;
      link.href = href;
      link.type = href.endsWith('.ico') ? 'image/x-icon' : 'image/png';
      link.removeAttribute('sizes');
      if (!existing) document.head.appendChild(link);
    }
  }, [favicon, apple, loaded]);

  return null;
}