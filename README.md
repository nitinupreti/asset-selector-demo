Simple vanilla-JS drag-and-drop demo backed by the official Adobe **Content Advisor** (formerly Asset Selector) micro-frontend.

## Setup

1. Open [config.js](config.js) and fill in the values provisioned by Adobe for your AEM as a Cloud Service environment:
   - `IMS_CLIENT_ID` — provided by Adobe via a P2 support ticket. Client IDs created in Adobe Developer Console will **not** work for Content Advisor.
   - `IMS_ORG` — your organization ID (e.g. `ABC123@AdobeOrg`), or `null` to let the user pick.
   - `IMS_SCOPE` — usually leave as-is.
   - `REDIRECT_URL` — must match the domain registered when the client ID was provisioned.
2. Serve the folder locally (the CDN + IMS require a real origin, not `file://`), e.g.:

   ```powershell
   npx serve .
   ```

3. Open the served URL, click **Browse AEM Assets**, sign in with Adobe, pick one or more assets, then drag them from the sidebar onto the canvas.

## How it works

- [index.html](index.html) loads Adobe's UMD build from `https://experience.adobe.com/solutions/CQ-assets-selectors/static-assets/resources/assets-selectors.js`, which exposes the global `PureJSSelectors`.
- [assetSelector.js](assetSelector.js) calls `PureJSSelectors.registerContentAdvisorAuthService(...)` on page load and exposes `openAssetSelector()`, which renders `renderContentAdvisorWithAuthFlow(...)` inside a `<dialog>` and resolves with the selected assets.
- [app.js](app.js) wires up the button, sidebar thumbnails, drag source, and drop target on the canvas.

See the [official examples repository](https://github.com/adobe/aem-assets-selectors-mfe-examples) for full API reference and additional integrations.