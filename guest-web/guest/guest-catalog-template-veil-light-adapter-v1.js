(()=>{
'use strict';
if(window.__GuestCatalogTemplateAdapters?.['veil-light'])return;
const root=window.__GuestCatalogTemplateAdapters=window.__GuestCatalogTemplateAdapters||{};
root['veil-light']={
  id:'veil-light',
  version:'5.3.3',
  applyConfig(config){
    if(typeof window.VEIL_APPLY_CONFIG!=='function')throw new Error('veil_renderer_unavailable');
    return window.VEIL_APPLY_CONFIG(config);
  }
};
})();