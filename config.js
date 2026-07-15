// Fill these values with the ones provisioned by Adobe for your AEM CS environment.
// NOTE: A Client ID created via Adobe Developer Console will NOT work for Content Advisor.
// It must be requested via a P2 support ticket from your AEM CS program admin.
// See: https://github.com/adobe/aem-assets-selectors-mfe-examples
const CONFIG = {
  IMS_CLIENT_ID: 'aemcs-tadigital-americas-assetselector',
  IMS_ORG: '856F5BDE58C158A50A495D50@AdobeOrg', // e.g. "ABC123@AdobeOrg", or null to let the user pick
  IMS_SCOPE: 'AdobeID,openid,additional_info.projectedProductContext,read_organizations',
  REDIRECT_URL: window.location.href,
};