(()=>{
'use strict';
if(window.__GuestCatalogTemplateAdapters?.botanica)return;
const root=window.__GuestCatalogTemplateAdapters=window.__GuestCatalogTemplateAdapters||{};
root.botanica={
  id:'botanica',
  version:'14.1',
  applyConfig(config){
    if(typeof window.BOTANICA_APPLY_CONFIG!=='function')throw new Error('botanica_renderer_unavailable');
    return window.BOTANICA_APPLY_CONFIG(config);
  }
};
})();
