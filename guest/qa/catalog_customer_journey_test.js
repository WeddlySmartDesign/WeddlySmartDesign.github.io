const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..','..');
const ok=(x,m)=>{if(!x)throw new Error(m)};
const flow=fs.readFileSync(path.join(root,'guest/backend/guest-invitation-flow/index.ts'),'utf8');
const access=fs.readFileSync(path.join(root,'guest/access.html'),'utf8');

ok(flow.includes("subject:'Hemos recibido vuestros datos'"),'order confirmation subject still exposes internal product naming');
ok(flow.includes("'Vuestra invitación está lista para revisar'"),'review subject missing');
ok(flow.includes("'Vuestra invitación está lista para compartir'"),'delivery subject missing');
ok(!flow.includes("subject:'Vuestra invitación GUEST está lista para revisar'"),'legacy GUEST review subject remains');
ok(!flow.includes("subject:localTest?'Entrega de prueba GUEST completada':'Vuestra invitación GUEST está lista'"),'legacy GUEST delivery subject remains');

ok(flow.includes("emailButton(inviteUrl,'Ver nuestra invitación')"),'final invitation CTA missing');
ok(flow.includes("emailButton(accessUrl,'Organizar invitados y enviarla',true)"),'included management CTA missing');
ok(flow.includes('GESTIÓN DE INVITADOS INCLUIDA'),'delivery does not explain management before brand');
ok(flow.includes("emailStep('01','Añadid o importad invitados'"),'visual delivery guide missing guest-list step');
ok(flow.includes("emailStep('03','Elegid destinatarios y enviad'"),'visual delivery guide missing send step');
ok(flow.includes("emailStep('04','Las respuestas llegan solas'"),'visual delivery guide missing automatic response step');

ok(flow.includes("error:'missing_management_license'"),'production delivery is not gated by management license');
ok(flow.includes("error:'missing_management_access'"),'production delivery is not gated by management access');
ok(flow.includes("license_delivery_codes"),'management activation access is not derived from existing license delivery system');
ok(flow.includes("guest/access.html#code="),'delivery does not use existing management activation route');

ok(access.includes('Gestión de invitados incluida'),'access page does not identify GUEST by function');
ok(access.includes('Abrir vuestra gestión de invitados'),'access page title still assumes brand knowledge');
ok(access.includes('Abrir gestión de invitados'),'activation CTA still assumes brand knowledge');
ok(!access.includes('Activa vuestro GUEST'),'legacy unexplained activation title remains');
ok(!access.includes('Activar GUEST'),'legacy unexplained activation button remains');

console.log('CATALOG CUSTOMER JOURNEY / COMMUNICATION CONTRACT PASS');