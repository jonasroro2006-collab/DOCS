const CONFIG={adminPassword:"9512369",waveNumber:"05 XX XX XX XX",supabaseUrl:"TON_SUPABASE_URL",supabaseKey:"TON_SUPABASE_ANON_KEY"};
const PRICES={cvSimple:500,cvPhoto:1000,motivation:1000,devis:1500,lettre:1000};
function priceFor(type){if(type==="cv")return current.photo?PRICES.cvPhoto:PRICES.cvSimple;return PRICES[type]||1000}
let current={type:"",step:0,code:"",photo:""};
const names={cv:"CV professionnel",motivation:"Lettre de motivation",devis:"Devis professionnel",lettre:"Lettre professionnelle"};
const forms={cv:[["Informations personnelles",`<div class="field"><label>Nom *</label><input name="nom" required></div><div class="field"><label>Prénom *</label><input name="prenom" required></div><div class="field"><label>Téléphone *</label><input name="telephone" required></div><div class="field"><label>Email</label><input name="email" type="email"></div><div class="field"><label>Ville</label><input name="ville"></div>`],["Photo",`<div class="photo"><p>Ajoutez une photo professionnelle.</p><label class="primary">📷 Choisir une photo<input id="photoFile" type="file" accept="image/*" hidden></label><img id="preview" class="preview"></div>`],["Formation et expérience",`<div class="field"><label>Formation / diplôme</label><textarea name="formation"></textarea></div><div class="field"><label>Expériences</label><textarea name="experience"></textarea></div>`],["Compétences",`<div class="field"><label>Compétences</label><textarea name="competences"></textarea></div><div class="field"><label>Langues / autres informations</label><textarea name="autres"></textarea></div>`]],motivation:[["Vos informations",`<div class="field"><label>Nom complet *</label><input name="nom" required></div><div class="field"><label>Téléphone</label><input name="telephone"></div><div class="field"><label>Email</label><input name="email" type="email"></div>`],["Candidature",`<div class="field"><label>Entreprise / établissement *</label><input name="entreprise" required></div><div class="field"><label>Poste ou formation visé(e) *</label><input name="poste" required></div><div class="field"><label>Pourquoi cette candidature ?</label><textarea name="motif"></textarea></div>`],["Votre profil",`<div class="field"><label>Formation, expériences et qualités</label><textarea name="profil"></textarea></div>`]],devis:[["Informations client",`<div class="field"><label>Client / entreprise *</label><input name="client" required></div><div class="field"><label>Téléphone</label><input name="telephone"></div><div class="field"><label>Adresse</label><input name="adresse"></div>`],["Prestation",`<div class="field"><label>Prestation / produit *</label><input name="prestation" required></div><div class="field"><label>Quantité</label><input name="quantite" type="number" value="1" min="1"></div><div class="field"><label>Prix unitaire FCFA *</label><input name="prix" type="number" required min="0"></div>`],["Détails",`<div class="field"><label>Délai / conditions</label><textarea name="conditions"></textarea></div><div class="field"><label>Notes</label><textarea name="notes"></textarea></div>`]],lettre:[["Expéditeur",`<div class="field"><label>Nom complet *</label><input name="nom" required></div><div class="field"><label>Fonction</label><input name="fonction"></div><div class="field"><label>Téléphone</label><input name="telephone"></div>`],["Destinataire",`<div class="field"><label>Destinataire</label><input name="destinataire"></div><div class="field"><label>Entreprise / service</label><input name="entreprise"></div><div class="field"><label>Objet *</label><input name="objet" required></div>`],["Message",`<div class="field"><label>Votre message *</label><textarea name="message" required></textarea></div>`]]};
function $(id){return document.getElementById(id)}
function show(id){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$(id).classList.add("active");scrollTo(0,0)}

/* --- Base de données partagée (Supabase) --- */
const sbReady = CONFIG.supabaseUrl && CONFIG.supabaseKey && CONFIG.supabaseUrl!=="TON_SUPABASE_URL" && window.supabase;
const sb = sbReady ? window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey) : null;
async function dataGetAll(){
  if(!sb){return JSON.parse(localStorage.getItem("prodoc_requests")||"[]")}
  const {data,error}=await sb.from("requests").select("payload").order("created_at",{ascending:false});
  if(error){console.error(error);return []}
  return data.map(row=>row.payload);
}
async function dataGetOne(id){
  if(!sb){return dataGet_local().find(x=>x.id===id)||null}
  const {data,error}=await sb.from("requests").select("payload").eq("id",id).maybeSingle();
  if(error||!data)return null;
  return data.payload;
}
async function dataInsert(r){
  if(!sb){const a=dataGet_local();a.unshift(r);localStorage.setItem("prodoc_requests",JSON.stringify(a));return}
  const {error}=await sb.from("requests").insert({id:r.id,payload:r});
  if(error)console.error(error);
}
async function dataUpdate(r){
  if(!sb){const a=dataGet_local();const i=a.findIndex(x=>x.id===r.id);if(i>-1)a[i]=r;localStorage.setItem("prodoc_requests",JSON.stringify(a));return}
  const {error}=await sb.from("requests").update({payload:r}).eq("id",r.id);
  if(error)console.error(error);
}
function dataGet_local(){return JSON.parse(localStorage.getItem("prodoc_requests")||"[]")}

function makeCode(){return"PD-"+Math.floor(100000+Math.random()*900000)}
function startForm(type){current={type,step:0,code:"",photo:""};renderStep();show("form")}
function renderStep(){const list=forms[current.type],s=list[current.step];$("formBox").innerHTML=`<div class="stepCard"><div class="stepTop"><div><small>ÉTAPE ${current.step+1}/${list.length}</small><h2>${s[0]}</h2></div><b>${names[current.type]}</b></div><div class="bar"><i style="width:${((current.step+1)/list.length)*100}%"></i></div>${s[1]}<div class="actions"><button class="secondary" onclick="previousStep()" ${current.step===0?"disabled":""}>Précédent</button><button class="primary" onclick="nextStep()">${current.step===list.length-1?"Envoyer ma demande":"Suivant"}</button></div></div>`;const file=$("photoFile");if(file)file.onchange=e=>{const f=e.target.files[0];if(!f)return;const rd=new FileReader();rd.onload=()=>{current.photo=rd.result;$("preview").src=rd.result;$("preview").style.display="block"};rd.readAsDataURL(f)}}
function validStep(){for(const x of $("formBox").querySelectorAll("input,textarea")){if(!x.checkValidity()){x.reportValidity();return false}}return true}
function previousStep(){if(current.step>0){saveVisible();current.step--;renderStep();restoreVisible()}}
function saveVisible(){current.saved=current.saved||{};$("formBox").querySelectorAll("input,textarea").forEach(x=>{if(x.name)current.saved[x.name]=x.value})}
function restoreVisible(){if(!current.saved)return;$("formBox").querySelectorAll("input,textarea").forEach(x=>{if(x.name&&current.saved[x.name]!==undefined)x.value=current.saved[x.name]})}
function nextStep(){if(!validStep())return;saveVisible();if(current.step<forms[current.type].length-1){current.step++;renderStep();restoreVisible()}else{const btn=event.target;btn.disabled=true;btn.textContent="Envoi...";submitRequest()}}
async function submitRequest(){const price=priceFor(current.type);const r={id:makeCode(),type:current.type,typeName:names[current.type],data:current.saved||{},photo:current.photo,status:"pending",price,paymentLink:"",pdf:"",created:new Date().toISOString()};await dataInsert(r);current.code=r.id;$("newCode").textContent=r.id;$("newPrice").textContent="Tarif indicatif : "+price.toLocaleString()+" FCFA";show("success")}
function trackNew(){$("trackCode").value=current.code;trackRequest()}
async function trackRequest(){const c=$("trackCode").value.trim().toUpperCase();if(!c)return;show("tracking");$("trackingBox").innerHTML='<div class="panel center"><p>Recherche…</p></div>';const r=await dataGetOne(c);if(!r){$("trackingBox").innerHTML='<div class="panel center"><h2>Demande introuvable</h2><p>Vérifiez votre numéro de demande.</p></div>';return}renderTracking(r)}
function renderTracking(r){let body="";if(r.status==="payment"){body=`<div class="paymentBox"><h3>💳 Paiement demandé</h3><p>Votre document est prêt.</p><p>Montant : <b>${Number(r.price).toLocaleString()} FCFA</b></p><p>Wave Business : <b>${CONFIG.waveNumber}</b></p>${r.paymentLink?`<div class="link">${r.paymentLink}</div><button class="secondary wide" onclick="copyLink('${r.paymentLink}')">Copier le lien</button>`:""}<button class="primary wide" onclick="reportPayment('${r.id}')">J'ai effectué le paiement</button></div>`}else if(r.status==="reported"){body=`<div class="notice">⏳ Paiement signalé. L'administrateur doit vérifier le paiement avant de débloquer le document.</div>`}else if(r.status==="paid"||r.status==="sent"){body=`<div class="paymentBox"><h3>✅ Paiement confirmé</h3>${r.pdf?`<a class="primary wide" style="display:block;text-align:center;text-decoration:none" href="${r.pdf}" download="document-${r.id}.pdf">📄 Télécharger mon document</a>`:"<p>Le document sera ajouté prochainement.</p>"}</div>`}else if(r.status==="ready"){body=`<div class="notice">📄 Votre document est prêt. Le lien de paiement va vous être envoyé sous peu.</div>`}else{body=`<div class="notice">⏳ Statut : <b>${label(r.status)}</b><br>Votre demande est en cours de traitement.</div>`}$("trackingBox").innerHTML=`<div class="panel"><span class="status ${r.status}">${label(r.status)}</span><h1>${r.id}</h1><h2>${r.typeName}</h2><hr><div class="grid">${Object.entries(r.data).map(([k,v])=>`<div class="info"><small>${k}</small><b>${v||"—"}</b></div>`).join("")}</div>${body}</div>`}
async function reportPayment(id){const r=await dataGetOne(id);if(!r)return;r.status="reported";await dataUpdate(r);renderTracking(r)}
function label(s){return{pending:"En attente",processing:"En traitement",ready:"Prêt",payment:"Lien de paiement envoyé",reported:"Paiement signalé",paid:"Paiement confirmé",sent:"Document envoyé"}[s]||s}
function isAdminSession(){return sessionStorage.getItem("prodoc_admin")==="1"}
function openAdminLogin(){show("adminLogin")}
function loginAdmin(){
  if($("adminPass").value===CONFIG.adminPassword){
    sessionStorage.setItem("prodoc_admin","1");
    $("adminPass").value="";
    renderAdmin();
  }else{
    alert("Mot de passe incorrect.");
  }
}
function logoutAdmin(){sessionStorage.removeItem("prodoc_admin");show("home")}
function requireAdmin(){if(!isAdminSession()){show("home");return false}return true}
let adminCache=[];
async function loadAdmin(){if(!requireAdmin())return;adminCache=await dataGetAll();renderAdminList()}
function renderAdminList(){if(!requireAdmin())return;const a=adminCache.filter(r=>!r.archived),q=($("adminSearch")?.value||"").toLowerCase();$("statAll").textContent=a.length;$("statPending").textContent=a.filter(r=>r.status==="pending").length;$("statPayment").textContent=a.filter(r=>r.status==="payment"||r.status==="reported").length;$("statPaid").textContent=a.filter(r=>r.status==="paid"||r.status==="sent").length;const list=a.filter(r=>(r.id+JSON.stringify(r.data)).toLowerCase().includes(q));$("adminList").innerHTML=list.length?list.map(r=>`<div class="request"><div><h3>${r.id} — ${r.typeName}</h3><p>${r.data.nom||r.data.client||"Client"}</p><span class="status ${r.status}">${label(r.status)}</span></div><button class="primary" onclick="openDetail('${r.id}')">Gérer</button></div>`).join(""):'<div class="empty">Aucune demande.</div>'}
async function openDetail(id){
  if(!requireAdmin())return;
  const r=await dataGetOne(id);
  if(!r)return;
  $("detailBox").innerHTML=`<div class="panel">
    <span class="status ${r.status}">${label(r.status)}</span>
    <h1>${r.id}</h1><h2>${r.typeName}</h2>
    <div class="grid">${Object.entries(r.data).map(([k,v])=>`<div class="info"><small>${k}</small><b>${v||"—"}</b></div>`).join("")}</div>
    ${r.photo?`<h3>Photo</h3><img src="${r.photo}" style="max-width:180px;border-radius:12px">`:""}
    <h2>Gestion</h2>
    <div class="field"><label>Prix FCFA</label><input id="price" type="number" value="${r.price}"></div>
    <div class="field"><label>Lien de paiement</label><input id="payLink" value="${r.paymentLink}" placeholder="Lien de paiement"></div>
    <div class="field"><label>PDF final</label><input id="pdfFile" type="file" accept="application/pdf"></div>
    <button class="secondary wide" onclick="changeStatus('${r.id}','processing')">🔵 Mettre en traitement</button>
    <button class="secondary wide" onclick="changeStatus('${r.id}','ready')">🟢 Document prêt</button>
    <button class="primary wide" onclick="sendPaymentLink('${r.id}')">💰 Envoyer le lien de paiement</button>
    <button class="primary wide" onclick="confirmPayment('${r.id}')">✅ Confirmer le paiement</button>
    <button class="secondary wide" onclick="changeStatus('${r.id}','sent')">📄 Marquer comme traité</button>
    <button class="archive wide" onclick="archiveRequest('${r.id}')">📦 Archiver la demande traitée</button>
    <button class="danger wide" onclick="deleteRequest('${r.id}')">🗑️ Supprimer la demande</button>
    ${r.paymentLink?`<div class="link" style="margin-top:12px">${r.paymentLink}</div><button class="secondary wide" onclick="copyLink('${r.paymentLink}')">Copier le lien</button>`:""}
    <p class="secureNote">Les demandes archivées restent enregistrées. Une demande supprimée est retirée de la base.</p>
  </div>`;
  show("detail");
  $("pdfFile").onchange=e=>{
    const f=e.target.files[0];if(!f)return;
    const rd=new FileReader();
    rd.onload=async()=>{
      const row=await dataGetOne(id);row.pdf=rd.result;await dataUpdate(row);
      alert("PDF ajouté.");openDetail(id);
    };
    rd.readAsDataURL(f);
  };
}
async function changeStatus(id,status){
  if(!requireAdmin())return;
  const r=await dataGetOne(id);if(!r)return;
  r.status=status;
  await dataUpdate(r);
  adminCache=await dataGetAll();
  openDetail(id);
}
async function archiveRequest(id){
  if(!requireAdmin())return;
  const r=await dataGetOne(id);if(!r)return;
  if(r.status!=="sent"&&r.status!=="paid"){
    alert("Traite et envoie d'abord la demande avant de l'archiver.");
    return;
  }
  if(!confirm("Archiver cette demande ? Elle restera enregistrée mais ne sera plus dans les demandes actives."))return;
  r.archived=true;
  await dataUpdate(r);
  adminCache=await dataGetAll();
  renderAdminList();
}
async function deleteRequest(id){
  if(!requireAdmin())return;
  if(!confirm("Supprimer définitivement cette demande ?"))return;
  if(!sb){
    const a=dataGet_local().filter(x=>x.id!==id);
    localStorage.setItem("prodoc_requests",JSON.stringify(a));
  }else{
    const {error}=await sb.from("requests").delete().eq("id",id);
    if(error){alert("Suppression impossible.");return}
  }
  adminCache=await dataGetAll();
  renderAdminList();
}
function copyLink(x){navigator.clipboard?.writeText(x).then(()=>alert("Lien copié."),()=>alert(x))}

/* --- Installation de l'application (PWA) --- */
let deferredPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredPrompt=e;const b=$("installBtn");if(b)b.style.display="inline-flex"});
function installApp(){if(!deferredPrompt)return;deferredPrompt.prompt();deferredPrompt.userChoice.finally(()=>{deferredPrompt=null;const b=$("installBtn");if(b)b.style.display="none"})}
window.addEventListener("appinstalled",()=>{const b=$("installBtn");if(b)b.style.display="none"});
if("serviceWorker" in navigator){window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js").catch(()=>{}))}

const p=new URLSearchParams(location.search).get("demande");if(p){$("trackCode").value=p;trackRequest()}

(function initAdminRoute(){
  const params=new URLSearchParams(location.search);
  if(params.get("admin")==="1"){openAdminLogin();}
  else if(document.getElementById("adminLogin")){/* public page: admin UI is not linked */}
})();

document.addEventListener("keydown",e=>{if(e.key==="Enter"&&document.activeElement?.id==="adminPass")loginAdmin()});
