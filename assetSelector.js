// Integrates the official Adobe Asset Selector (Content Advisor) UMD build.
// Docs / examples: https://github.com/adobe/aem-assets-selectors-mfe-examples

// 1) Register the auth service on page load (recommended by Adobe).
(function registerAuth() {
  if (typeof PureJSSelectors === 'undefined') {
    console.error('PureJSSelectors is not loaded. Check the <script> tag in index.html.');
    return;
  }
  PureJSSelectors.registerContentAdvisorAuthService({
    imsClientId: CONFIG.IMS_CLIENT_ID,
    imsScope: CONFIG.IMS_SCOPE,
    redirectUrl: CONFIG.REDIRECT_URL,
    modalMode: true,
  });
})();

const _dialog = document.getElementById('assetSelectorDialog');
const _container = document.getElementById('assetSelectorContainer');
const _closeBtn = document.getElementById('closeSelectorBtn');

_closeBtn.addEventListener('click', () => _dialog.close());

// 2) Expose a Promise-based helper the rest of the app can await.
//    Resolves with an array of selected asset objects (as returned by Content Advisor).
function openAssetSelector() {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (assets) => {
      if (settled) return;
      settled = true;
      _dialog.close();
      resolve(assets || []);
    };

    // If the user closes without picking anything, resolve with empty array.
    _dialog.addEventListener('close', () => finish([]), { once: true });

    PureJSSelectors.renderContentAdvisorWithAuthFlow(
      _container,
      {
        imsOrg: CONFIG.IMS_ORG || null,
        aemTierType: ['delivery', 'author'],
        selectionType: 'multiple',
        colorScheme: window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
        handleSelection: (selection) => finish(selection),
        onClose: () => finish([]),
      },
      () => _dialog.showModal(),
    );
  });
}

// 3) Normalize an asset returned by Content Advisor into { thumbnail, path, name }
//    the demo UI can consume. The response shape can vary by repository/tier, so
//    we try several well-known link relations before falling back to `path`.
function normalizeAsset(asset) {
  const links = asset._links || {};
  const rendition = links['http://ns.adobe.com/adobecloud/rel/rendition'];
  const original = links['http://ns.adobe.com/adobecloud/rel/download'];

  let thumbnail;
  if (Array.isArray(rendition) && rendition.length) {
    // Prefer a small rendition for the sidebar thumbnail.
    thumbnail = rendition[0].href;
  }

  const full =
    (Array.isArray(original) && original[0] && original[0].href) ||
    (Array.isArray(rendition) && rendition[rendition.length - 1] && rendition[rendition.length - 1].href) ||
    asset.url ||
    asset.path;

  return {
    name: asset.name || asset.title || 'asset',
    thumbnail: thumbnail || full,
    path: full,
  };
}