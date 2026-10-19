/*! Energy Balancer cards. Portions derived from SEM (https://github.com/traktore-org/sem-community), MIT License, Copyright (c) 2025 belinea4071. Licensed under the MIT License; see NOTICE in the repository. */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let r=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new r(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new r("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:n,defineProperty:l,getOwnPropertyDescriptor:c,getOwnPropertyNames:h,getOwnPropertySymbols:d,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,f=g?g.emptyScript:"",_=u.reactiveElementPolyfillSupport,m=(t,e)=>t,y={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!n(t,e),b={attribute:!0,type:String,converter:y,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let v=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:r}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const a=s?.call(this);r?.call(this,e),this.requestUpdate(t,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...h(t),...d(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),r=t.litNonce;void 0!==r&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const r=(void 0!==i.converter?.toAttribute?i.converter:y).toAttribute(e,i.type);this._$Em=t,null==r?this.removeAttribute(s):this.setAttribute(s,r),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:y;this._$Em=s;const a=r.fromAttribute(e,t.type);this[s]=a??this._$Ej?.get(s)??a,this._$Em=null}}requestUpdate(t,e,i,s=!1,r){if(void 0!==t){const a=this.constructor;if(!1===s&&(r=this[t]),i??=a.getPropertyOptions(t),!((i.hasChanged??x)(r,e)||i.useDefault&&i.reflect&&r===this._$Ej?.get(t)&&!this.hasAttribute(a._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:r},a){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,a??e??this[t]),!0!==r||void 0!==a)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};v.elementStyles=[],v.shadowRootOptions={mode:"open"},v[m("elementProperties")]=new Map,v[m("finalized")]=new Map,_?.({ReactiveElement:v}),(u.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,$=t=>t,k=w.trustedTypes,M=k?k.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,D="?"+C,z=`<${D}>`,E=document,P=()=>E.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,F=Array.isArray,A="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,I=/>/g,O=RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),N=/'/g,H=/"/g,B=/^(?:script|style|textarea|title)$/i,W=t=>(e,...i)=>({_$litType$:t,strings:e,values:i}),j=W(1),V=W(2),U=Symbol.for("lit-noChange"),Y=Symbol.for("lit-nothing"),G=new WeakMap,q=E.createTreeWalker(E,129);function K(t,e){if(!F(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==M?M.createHTML(e):e}const X=(t,e)=>{const i=t.length-1,s=[];let r,a=2===e?"<svg>":3===e?"<math>":"",o=R;for(let e=0;e<i;e++){const i=t[e];let n,l,c=-1,h=0;for(;h<i.length&&(o.lastIndex=h,l=o.exec(i),null!==l);)h=o.lastIndex,o===R?"!--"===l[1]?o=L:void 0!==l[1]?o=I:void 0!==l[2]?(B.test(l[2])&&(r=RegExp("</"+l[2],"g")),o=O):void 0!==l[3]&&(o=O):o===O?">"===l[0]?(o=r??R,c=-1):void 0===l[1]?c=-2:(c=o.lastIndex-l[2].length,n=l[1],o=void 0===l[3]?O:'"'===l[3]?H:N):o===H||o===N?o=O:o===L||o===I?o=R:(o=O,r=void 0);const d=o===O&&t[e+1].startsWith("/>")?" ":"";a+=o===R?i+z:c>=0?(s.push(n),i.slice(0,c)+S+i.slice(c)+C+d):i+C+(-2===c?e:d)}return[K(t,a+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Z{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let r=0,a=0;const o=t.length-1,n=this.parts,[l,c]=X(t,e);if(this.el=Z.createElement(l,i),q.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=q.nextNode())&&n.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(S)){const e=c[a++],i=s.getAttribute(t).split(C),o=/([.?@])?(.*)/.exec(e);n.push({type:1,index:r,name:o[2],strings:i,ctor:"."===o[1]?it:"?"===o[1]?st:"@"===o[1]?rt:et}),s.removeAttribute(t)}else t.startsWith(C)&&(n.push({type:6,index:r}),s.removeAttribute(t));if(B.test(s.tagName)){const t=s.textContent.split(C),e=t.length-1;if(e>0){s.textContent=k?k.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),q.nextNode(),n.push({type:2,index:++r});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===D)n.push({type:2,index:r});else{let t=-1;for(;-1!==(t=s.data.indexOf(C,t+1));)n.push({type:7,index:r}),t+=C.length-1}r++}}static createElement(t,e){const i=E.createElement("template");return i.innerHTML=t,i}}function Q(t,e,i=t,s){if(e===U)return e;let r=void 0!==s?i._$Co?.[s]:i._$Cl;const a=T(e)?void 0:e._$litDirective$;return r?.constructor!==a&&(r?._$AO?.(!1),void 0===a?r=void 0:(r=new a(t),r._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=r:i._$Cl=r),void 0!==r&&(e=Q(t,r._$AS(t,e.values),r,s)),e}class J{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??E).importNode(e,!0);q.currentNode=s;let r=q.nextNode(),a=0,o=0,n=i[0];for(;void 0!==n;){if(a===n.index){let e;2===n.type?e=new tt(r,r.nextSibling,this,t):1===n.type?e=new n.ctor(r,n.name,n.strings,this,t):6===n.type&&(e=new at(r,this,t)),this._$AV.push(e),n=i[++o]}a!==n?.index&&(r=q.nextNode(),a++)}return q.currentNode=E,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class tt{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=Y,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),T(t)?t===Y||null==t||""===t?(this._$AH!==Y&&this._$AR(),this._$AH=Y):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>F(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==Y&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(E.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Z.createElement(K(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new J(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=G.get(t.strings);return void 0===e&&G.set(t.strings,e=new Z(t)),e}k(t){F(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const r of t)s===e.length?e.push(i=new tt(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(r),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=$(t).nextSibling;$(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class et{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,r){this.type=1,this._$AH=Y,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=r,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=Y}_$AI(t,e=this,i,s){const r=this.strings;let a=!1;if(void 0===r)t=Q(this,t,e,0),a=!T(t)||t!==this._$AH&&t!==U,a&&(this._$AH=t);else{const s=t;let o,n;for(t=r[0],o=0;o<r.length-1;o++)n=Q(this,s[i+o],e,o),n===U&&(n=this._$AH[o]),a||=!T(n)||n!==this._$AH[o],n===Y?t=Y:t!==Y&&(t+=(n??"")+r[o+1]),this._$AH[o]=n}a&&!s&&this.j(t)}j(t){t===Y?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class it extends et{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===Y?void 0:t}}class st extends et{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==Y)}}class rt extends et{constructor(t,e,i,s,r){super(t,e,i,s,r),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??Y)===U)return;const i=this._$AH,s=t===Y&&i!==Y||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==Y&&(i===Y||s);s&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class at{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const ot=w.litHtmlPolyfillSupport;ot?.(Z,tt),(w.litHtmlVersions??=[]).push("3.3.3");const nt=globalThis;let lt=class extends v{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let r=s._$litPart$;if(void 0===r){const t=i?.renderBefore??null;s._$litPart$=r=new tt(e.insertBefore(P(),t),t,void 0,i??{})}return r._$AI(t),r})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return U}};lt._$litElement$=!0,lt.finalized=!0,nt.litElementHydrateSupport?.({LitElement:lt});const ct=nt.litElementPolyfillSupport;ct?.({LitElement:lt}),(nt.litElementVersions??=[]).push("4.2.2");const ht={solar:"#ff9800",gridImport:"#488fc2",gridExport:"#8353d1",batteryOut:"#4db6ac",battery:"#4db6ac",home:"#5BC8D8",ev:"#8DC892",inverter:"#96CAEE"},dt=["#FF8A65","#AED581","#CE93D8","#64B5F6","#ff9800","#96CAEE"];function pt(t){if(null==t||isNaN(t))return"— W";return Math.abs(t)>=1e3?`${(t/1e3).toFixed(1)} kW`:`${Math.round(t)} W`}function ut(t,e){if(!t)return"—";try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:e||void 0})}catch(t){return"—"}}function gt(t){const e=Math.abs(t);if(e<=0)return 4;const i=4-.9*Math.log10(Math.max(e,1));return Math.max(.5,Math.min(4,i))}function ft(t){if(!t)return"EUR";const e=t.states?.["sensor.ebi_daily_costs"];return e?.attributes?.unit_of_measurement?e.attributes.unit_of_measurement:t.config?.currency||"EUR"}function _t(t,e,i){return`radial-gradient(ellipse 70% 60% at 50% 25%, ${e}${Math.round(.06*255).toString(16).padStart(2,"0")} 0%, transparent 100%),\n            radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px)`}function mt(t,e){if(!t?.states)return"";const i=e||"sensor.ebi_";return["pv1","pv2","pv3","pv4"].map(e=>t.states[`${i}pv_string_${e}_power`]?.state??"").join("|")}function yt(t,e){if(!t||!t.states)return[];const i=e||"sensor.ebi_",s=[];for(const e of["pv1","pv2","pv3","pv4"]){const r=`${i}pv_string_${e}_power`,a=t.states[r];if(!a)continue;const o=parseFloat(a.state);if(isNaN(o))continue;const n=`${i}pv_string_${e}_daily_energy`,l=t.states[n],c=l?parseFloat(l.state):NaN;s.push({slot:e,watts:o,entityId:r,energyKwh:isNaN(c)?null:c,energyEntityId:l?n:null})}return s.length>=2?s:[]}const xt="\n    .pv-strings-row {\n        display: flex;\n        flex-wrap: wrap;\n        gap: 6px;\n        padding: 6px 12px;\n        font-family: 'Segoe UI','Roboto',sans-serif;\n        font-size: 12px;\n    }\n    .pv-chip {\n        display: inline-flex;\n        align-items: baseline;\n        gap: 4px;\n        padding: 2px 8px;\n        background: rgba(255, 152, 0, 0.10);\n        border: 1px solid rgba(255, 152, 0, 0.25);\n        border-radius: 999px;\n        color: var(--secondary-text-color, #aaa);\n        cursor: pointer;\n        transition: background 120ms ease;\n    }\n    .pv-chip:hover { background: rgba(255, 152, 0, 0.18); }\n    .pv-chip-label {\n        font-size: 11px;\n        letter-spacing: 0.5px;\n        text-transform: uppercase;\n        opacity: 0.7;\n    }\n    .pv-chip-value {\n        color: var(--eb-solar, #ff9800);\n        font-weight: 600;\n        font-variant-numeric: tabular-nums;\n    }\n";function bt(t,e,i){customElements.get(t)||(customElements.define(t,e),i&&(window.customCards=window.customCards||[],window.customCards.push(i)))}class vt extends lt{constructor(){super(),this._hass=null,this._config=null,this._lang=null,this._localizeReady=!1,this._prevVals={},this._frozenEntities={},this._holdTimers={},this._holdIntervals={},this._cachedTheme=null,this._updateTimer=null}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=(this._watchedIds||this.constructor.watchedEntities||[]).map(t=>this._mapId(t));if(r.length>0&&!s){const e=t.states[r[0]]?.state;if("unavailable"===e||"unknown"===e)return}let a=!1;for(const e of r){const i=t.states[e]?.state;if(this._prevVals[e]!==i){a=!0;break}}if(a||s){for(const e of r)this._prevVals[e]=t.states[e]?.state;this._scheduleUpdate()}}get hass(){return this._hass}_scheduleUpdate(){this._updateTimer||(this._updateTimer=setTimeout(()=>{this._updateTimer=null,this.requestUpdate()},16))}_theme(){const t=getComputedStyle(document.documentElement).getPropertyValue("--primary-background-color").trim();return this._cachedTheme&&this._cachedThemeKey===t||(this._cachedThemeKey=t,this._cachedTheme=function(){const t=document.documentElement,e=getComputedStyle(t),i=(t,i)=>e.getPropertyValue(t).trim()||i,s=i("--primary-text-color","#e0e0e0"),r=i("--secondary-text-color","#888888"),a=i("--card-background-color","rgba(30,35,45,0.5)"),o=i("--divider-color","rgba(255,255,255,0.12)"),n=i("--secondary-background-color","rgba(255,255,255,0.06)"),l=i("--ha-card-box-shadow","0 2px 8px rgba(0,0,0,0.15)"),c=i("--primary-color","#42a5f5"),h=(()=>{const t=i("--primary-background-color","#111"),e=t.match(/\d+/g);return e&&e.length>=3?(.299*+e[0]+.587*+e[1]+.114*+e[2])/255<.5:!(t.startsWith("#f")||t.startsWith("#e")||t.startsWith("#d")||t.startsWith("#c")||t.startsWith("rgb(2"))})();return{text:s,textSec:r,cardBg:a,divider:o,bgSec:n,shadow:l,accent:c,isDark:h,textTertiary:h?"rgba(255,255,255,0.45)":"rgba(0,0,0,0.50)",textDisabled:h?"rgba(255,255,255,0.26)":"rgba(0,0,0,0.30)",surface:h?"rgba(255,255,255,0.06)":"rgba(0,0,0,0.03)",surfaceHover:h?"rgba(255,255,255,0.10)":"rgba(0,0,0,0.06)",surfaceBorder:h?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.08)",dotColor:h?"rgba(128,128,128,0.05)":"rgba(128,128,128,0.06)",glowAlpha:h?.05:.03,tooltipBg:h?"rgba(20,20,30,0.95)":"rgba(255,255,255,0.95)",tooltipText:h?"#e0e0e0":"#333333",tooltipBorder:h?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.12)"}}()),this._cachedTheme}_t(t){return t?"function"==typeof semLocalize?semLocalize(t,this._hass?.language):t:""}_forecastProviderLabel(t){if(!t)return"";return{solcast:"Solcast",forecast_solar:"Forecast.Solar",custom:this._t("custom")||"Custom"}[t]||t}_objPrefix(){let t=this._prefix;"function"==typeof t&&(t=t.call(this)),"string"==typeof t&&t||(t=this._config?.entity_prefix||"sensor.ebi_");const e=t.indexOf(".");return e>=0?t.slice(e+1):t}_mapId(t){const e=this._objPrefix();return"ebi_"===e||"string"!=typeof t?t:t.replace(/^([a-z_]+)\.ebi_/,`$1.${e}`)}_state(t,e=0){const i=this._frozenEntities[t];if(i)return i.value;const s=this._hass?.states[t];return s&&"unavailable"!==s.state&&"unknown"!==s.state?parseFloat(s.state)??e:e}_stateStr(t){const e=this._frozenEntities[t];if(e)return String(e.value);const i=this._hass?.states[t];return i&&"unavailable"!==i.state&&"unknown"!==i.state?i.state:""}_pcEntity(t,e,i){const s=this._hass?.states||{},r=new RegExp(`^${t}\\.${this._objPrefix()}charger_.+_${e}$`);let a=Object.keys(s).filter(t=>r.test(t));return"night_charging"===e&&(a=a.filter(t=>!t.endsWith("_smart_night_charging"))),a.sort(),a.length?a[0]:this._mapId(i)}_stateAttrs(t){return this._hass?.states[t]?.attributes||{}}_freezeEntity(t,e){const i=this._frozenEntities[t];i?.timer&&clearTimeout(i.timer),this._frozenEntities[t]={value:e,timer:setTimeout(()=>{delete this._frozenEntities[t],this.requestUpdate()},1500)}}_isFrozen(){return Object.keys(this._frozenEntities).length>0}async _callService(t,e,i){if(this._hass)try{await this._hass.callService(t,e,i)}catch(t){console.error(`[SEM ${this.tagName}]`,t)}}_setNumber(t,e){const i=this._hass?.states[t];if(!i)return;const s=parseFloat(i.attributes.min)||0,r=parseFloat(i.attributes.max)||100,a=Math.max(s,Math.min(r,e));this._freezeEntity(t,a),this.requestUpdate(),this._callService("number","set_value",{entity_id:t,value:a})}_stepNumber(t,e){const i=this._hass?.states[t];if(!i)return;const s=this._frozenEntities[t],r=s?s.value:parseFloat(i.state)||0,a=parseFloat(i.attributes.step)||1;this._setNumber(t,r+e*a)}_toggleSwitch(t){const e=this._hass?.states[t];if(!e)return;const i="on"===e.state?"off":"on";this._freezeEntity(t,i),this.requestUpdate();const s="on"===e.state?"turn_off":"turn_on";this._callService("switch",s,{entity_id:t})}_selectOption(t,e){this._freezeEntity(t,e),this.requestUpdate(),this._callService("select","select_option",{entity_id:t,option:e})}_startHold(t,e){this._stopHold(t),this._holdTimers[t]=setTimeout(()=>{this._holdIntervals[t]=setInterval(()=>{this._stepNumber(t,e)},150)},400)}_stopHold(t){clearTimeout(this._holdTimers[t]),clearInterval(this._holdIntervals[t]),delete this._holdTimers[t],delete this._holdIntervals[t]}updated(){if(window._semDebug){this.style.outline="2px solid red",this.style.outlineOffset="-2px",clearTimeout(this._debugFlashTimer),this._debugFlashTimer=setTimeout(()=>{this.style.outline="",this.style.outlineOffset=""},200);const t=this.tagName.toLowerCase();window._semRenderLog||(window._semRenderLog={}),window._semRenderLog[t]=(window._semRenderLog[t]||0)+1}}connectedCallback(){super.connectedCallback(),window._semDebug&&console.log(`[SEM DEBUG] ${this.tagName} connectedCallback`),this._localizeReady||"function"==typeof semLocalize?"function"==typeof semLocalize&&(this._localizeReady=!0):(this._onLocalizeReady=()=>{document.removeEventListener("eb-localize-ready",this._onLocalizeReady),this._onLocalizeReady=null,this._localizeReady=!0,this._hass&&this.requestUpdate()},document.addEventListener("eb-localize-ready",this._onLocalizeReady))}disconnectedCallback(){super.disconnectedCallback(),window._semDebug&&console.log(`[SEM DEBUG] ${this.tagName} disconnectedCallback !!!`),this._onLocalizeReady&&(document.removeEventListener("eb-localize-ready",this._onLocalizeReady),this._onLocalizeReady=null),this._updateTimer&&(clearTimeout(this._updateTimer),this._updateTimer=null);for(const t of Object.keys(this._holdTimers))this._stopHold(t);for(const t of Object.keys(this._frozenEntities))clearTimeout(this._frozenEntities[t]?.timer);this._frozenEntities={}}setConfig(t){this._config=t}getCardSize(){return 4}static getStubConfig(){return{}}}bt("eb-title-card",class extends vt{static get watchedEntities(){return[]}constructor(){super(),this._renderedSubtitle=null,this._templateUnsub=null,this._templateSubbed=!1}setConfig(t){super.setConfig(t),this._unsubTemplate(),this._templateSubbed=!1,this._renderedSubtitle=null}_hasJinja(t){return t&&(t.includes("{%")||t.includes("{{"))}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;(e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,this.requestUpdate()),this._hasJinja(this._config?.subtitle)&&!this._templateSubbed&&this._subscribeTemplate()}_subscribeTemplate(){if(!this._hass?.connection||this._templateSubbed)return;this._templateSubbed=!0;const t=this._config.subtitle;this._hass.connection.subscribeMessage(t=>{const e=t.result;e!==this._renderedSubtitle&&(this._renderedSubtitle=e,this.requestUpdate())},{type:"render_template",template:t,variables:{}}).then(t=>{this._templateUnsub=t}).catch(()=>{this._renderedSubtitle=this._config.subtitle,this.requestUpdate()})}_unsubTemplate(){this._templateUnsub&&(this._templateUnsub(),this._templateUnsub=null)}disconnectedCallback(){super.disconnectedCallback(),this._unsubTemplate()}render(){if(!this._config)return Y;const t=this._t(this._config.title_key||this._config.title||"");let e="";e=this._hasJinja(this._config.subtitle)?this._renderedSubtitle||"":this._t(this._config.subtitle||"");const i=this._theme();return j`
            <style>
                :host { display: block; }
                .eb-title-wrap {
                    padding: 8px 0 0 0;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                }
                .title {
                    font-size: 16px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    color: ${i.text};
                    line-height: 1.3;
                    padding: 0 16px;
                }
                .subtitle {
                    font-size: 12px;
                    color: ${i.textSec};
                    margin-top: 2px;
                    line-height: 1.4;
                    padding: 0 16px;
                }
                .divider {
                    height: 1px;
                    margin: 4px 16px 0;
                    background: linear-gradient(90deg, rgba(150,202,238,0.25) 0%, transparent 70%);
                }
            </style>
            <div class="eb-title-wrap">
                <div class="title">${t}</div>
                ${e?j`<div class="subtitle">${e}</div>`:Y}
                <div class="divider"></div>
            </div>
        `}getCardSize(){return 1}static getStubConfig(){return{title:"Section Title"}}},{type:"eb-title-card",name:"SEM Title Card",description:"Runtime-translated section header for SEM dashboard"});const wt=(t,e)=>"function"==typeof semLocalize?semLocalize(t,e?.language):t,$t={home:{titleKey:"home",subtitleKey:"home_sub",color:"#5BC8D8",icon:()=>V`
            <path d="M-20,2 L0,-16 L20,2" stroke-width="2"/>
            <rect x="-15" y="2" width="30" height="22" rx="2" stroke-width="2"/>
            <rect x="-5" y="12" width="10" height="12" stroke-width="1.5"/>`},energy:{titleKey:"energy",subtitleKey:"energy_sub",color:"#ff9800",icon:()=>V`
            <path d="M-4,-18 L-10,2 L-2,2 L-6,18 L12,-4 L2,-4 L8,-18 Z" stroke-width="2"/>`},battery:{titleKey:"battery",subtitleKey:"battery_sub",color:"#4db6ac",icon:()=>V`
            <rect x="-10" y="-16" width="20" height="32" rx="4" stroke-width="2"/>
            <rect x="-4" y="-20" width="8" height="5" rx="2" fill="currentColor" opacity="0.4" stroke="none"/>
            <line x1="-5" y1="-4" x2="5" y2="-4" stroke-width="1.5" opacity="0.5"/>
            <line x1="-5" y1="4" x2="5" y2="4" stroke-width="1.5" opacity="0.5"/>`},ev:{titleKey:"ev_charging",subtitleKey:"ev_sub",color:"#8DC892",icon:()=>V`
            <rect x="-12" y="-14" width="24" height="24" rx="5" stroke-width="2"/>
            <path d="M-3,-6 L-1,0 L-5,0 L3,8" stroke-width="2" fill="none"/>
            <line x1="0" y1="10" x2="0" y2="16" stroke-width="2"/>
            <circle cx="0" cy="18" r="2" fill="currentColor" opacity="0.4" stroke="none"/>`},control:{titleKey:"control",subtitleKey:"control_sub",color:"#96CAEE",icon:()=>V`
            <line x1="-12" y1="-12" x2="-12" y2="12" stroke-width="2"/>
            <line x1="0" y1="-12" x2="0" y2="12" stroke-width="2"/>
            <line x1="12" y1="-12" x2="12" y2="12" stroke-width="2"/>
            <circle cx="-12" cy="-4" r="4" fill="currentColor" opacity="0.6" stroke="none"/>
            <circle cx="0" cy="4" r="4" fill="currentColor" opacity="0.6" stroke="none"/>
            <circle cx="12" cy="-8" r="4" fill="currentColor" opacity="0.6" stroke="none"/>`},config:{titleKey:"config_tab_title",subtitleKey:"config_tab_subtitle",color:"#8DC892",icon:()=>V`
            <circle cx="0" cy="0" r="6" stroke-width="2"/>
            <g stroke-width="2" stroke-linecap="round">
                <line x1="0" y1="-16" x2="0" y2="-10"/>
                <line x1="0" y1="10" x2="0" y2="16"/>
                <line x1="-16" y1="0" x2="-10" y2="0"/>
                <line x1="10" y1="0" x2="16" y2="0"/>
                <line x1="-11" y1="-11" x2="-7" y2="-7"/>
                <line x1="7" y1="7" x2="11" y2="11"/>
                <line x1="11" y1="-11" x2="7" y2="-7"/>
                <line x1="-7" y1="7" x2="-11" y2="11"/>
            </g>`},costs:{titleKey:"costs",subtitleKey:"costs_sub",color:"#f06292",icon:()=>V`
            <circle cx="0" cy="0" r="16" stroke-width="2"/>
            <text x="0" y="6" text-anchor="middle" font-size="18" font-weight="700"
                  fill="currentColor" opacity="0.7" stroke="none"
                  font-family="'Segoe UI','Roboto',sans-serif">$</text>`},system:{titleKey:"system",subtitleKey:"system_sub",color:"#96CAEE",icon:()=>V`
            <path d="M-16,4 L-8,-8 L0,0 L6,-12 L10,-4 L16,4" stroke-width="2" fill="none"/>
            <line x1="-16" y1="8" x2="16" y2="8" stroke-width="1" opacity="0.3"/>`}};bt("eb-tab-header",class extends vt{static get watchedEntities(){return[]}constructor(){super(),this._tab="home",this._prefix="sensor.ebi_",this._responsiveApplied=!1,this._lastStatsKey=""}connectedCallback(){super.connectedCallback(),this._applyResponsiveContainer()}_applyResponsiveContainer(){this._responsiveApplied||requestAnimationFrame(()=>{let t=this;for(;t;){const e=t.getRootNode()?.host;if(!e)break;if("HUI-VERTICAL-STACK-CARD"===e.tagName){const t=e.parentElement;if(t&&"HUI-CARD"===t.tagName)return t.style.maxWidth="900px",t.style.margin="0 auto",t.style.display="block",void(this._responsiveApplied=!0)}t=e}})}setConfig(t){super.setConfig(t),this._tab=t.tab||"home",this._prefix=t.entity_prefix||"sensor.ebi_"}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=this._buildStatsKey(t);(r!==this._lastStatsKey||s)&&(this._lastStatsKey=r,this.requestUpdate()),this._responsiveApplied||this._applyResponsiveContainer()}_buildStatsKey(t){if(!t)return"";const e=e=>t.states[`${this._prefix}${e}`]?.state||"",i=this._tab;return"home"===i?[e("solar_power"),e("autarky_rate"),e("self_consumption_rate"),e("daily_solar_energy")].join(","):"energy"===i?[e("daily_solar_energy"),e("daily_home_energy"),e("self_consumption_rate")].join(","):"battery"===i?[e("battery_soc"),e("battery_power"),e("battery_health_score")].join(","):"ev"===i?[e("ev_power"),e("daily_ev_energy"),e("charging_state")].join(","):"control"===i?[e("target_peak_limit"),e("controllable_devices_count"),e("surplus_active_devices")].join(","):"config"===i?[e("charging_state"),e("heat_pump_registered"),e("battery_status")].join(","):"costs"===i?[e("daily_costs"),e("daily_savings"),e("daily_net_cost")].join(","):"system"===i?[e("energy_optimization_score"),e("lifetime_total_savings"),e("lifetime_co2_avoided")].join(","):""}_getState(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_exists(t){const e=this._hass?.states[`${this._prefix}${t}`];return!!e&&"unavailable"!==e.state&&"unknown"!==e.state}_getStatLabels(){const t=t=>wt(t,this._hass),e=this._tab;return"home"===e?[t("solar"),t("autarky"),t("self_use"),t("today")]:"energy"===e?[t("solar"),t("home"),t("self_use")]:"battery"===e?[t("soc"),t("power"),t("health")]:"ev"===e?[t("power"),t("today"),t("session")]:"control"===e?[t("peak"),t("devices"),t("active")]:"config"===e?[t("config_stat_chargers"),t("config_stat_heatpump"),t("config_stat_battery")]:"costs"===e?[t("cost"),t("saved"),t("net")]:"system"===e?[t("score"),t("saved"),t("co2")]:["—","—","—"]}_getStatEntities(){const t=this._tab;return"home"===t?["solar_power","autarky_rate","self_consumption_rate","daily_solar_energy"]:"energy"===t?["daily_solar_energy","daily_home_energy","self_consumption_rate"]:"battery"===t?["battery_soc","battery_power","battery_health_score"]:"ev"===t?["ev_power","daily_ev_energy","charging_state"]:"control"===t?["target_peak_limit","controllable_devices_count","surplus_active_devices"]:"config"===t?["charging_state","heat_pump_registered","battery_status"]:"costs"===t?["daily_costs","daily_savings","daily_net_cost"]:"system"===t?["energy_optimization_score","lifetime_total_savings","lifetime_co2_avoided"]:[]}_openStat(t){const e=`${this._prefix}${t}`;this._hass&&this._hass.states[e]&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_getStatValues(){const t=this._tab,e=ft(this._hass)||"EUR";if("home"===t)return[pt(this._getState("solar_power",0)),this._getState("autarky_rate",0).toFixed(0)+"%",this._getState("self_consumption_rate",0).toFixed(0)+"%",this._getState("daily_solar_energy",0).toFixed(1)+" kWh"];if("energy"===t)return[this._getState("daily_solar_energy",0).toFixed(1)+" kWh",this._getState("daily_home_energy",0).toFixed(1)+" kWh",this._getState("self_consumption_rate",0).toFixed(0)+"%"];if("battery"===t)return[this._getState("battery_soc",0).toFixed(0)+"%",pt(this._getState("battery_power",0)),this._exists("battery_health_score")?this._getState("battery_health_score",0).toFixed(0)+"%":"—"];if("ev"===t)return[pt(this._getState("ev_power",0)),this._getState("daily_ev_energy",0).toFixed(1)+" kWh",this._getState("session_energy",0).toFixed(1)+" kWh"];if("control"===t)return[pt(this._getState("target_peak_limit",0)),this._getState("controllable_devices_count",0).toFixed(0),this._getState("surplus_active_devices",0).toFixed(0)];if("config"===t){const t=t=>wt(t,this._hass),e=Object.keys(this._hass?.states||{}).filter(t=>t.match(/^number\.ebi_charger_.+_minimum_current$/)).length,i="on"===this._hass?.states[`${this._prefix}heat_pump_registered`]?.state,s=this._hass?.states[`${this._prefix}battery_soc`];return[String(e),t(i?"on":"off"),s?Math.round(parseFloat(s.state)||0)+"%":"—"]}return"costs"===t?[this._getState("daily_costs",0).toFixed(2)+" "+e,this._getState("daily_savings",0).toFixed(2)+" "+e,this._getState("daily_net_cost",0).toFixed(2)+" "+e]:"system"===t?[this._getState("energy_optimization_score",0).toFixed(0),this._getState("lifetime_total_savings",0).toFixed(0)+" "+e,this._getState("lifetime_co2_avoided",0).toFixed(0)+" kg"]:["—","—","—"]}render(){if(!this._hass||!this._config)return Y;const t=$t[this._tab]||$t.home,e=this._config.title||wt(t.titleKey,this._hass),i=this._config.subtitle||wt(t.subtitleKey,this._hass),s=t.color,r=this._getStatLabels(),a=this._getStatValues(),o=this._getStatEntities(),n=this._theme(),l=n.isDark?s:`color-mix(in srgb, ${s} 65%, black)`,c=n.isDark?`0 0 12px ${s}40`:"none",h=n.isDark?.3:.18;return j`
            <style>
                :host { display: block; }
                .header-wrap {
                    display: flex; align-items: center; gap: 16px;
                    padding: 16px 20px; position: relative; overflow: hidden;
                    background:
                        radial-gradient(ellipse 80% 70% at 20% 50%, ${s}0D 0%, transparent 70%),
                        radial-gradient(circle at 2px 2px, ${n.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                }
                .icon-ring { position: relative; flex-shrink: 0; width: 64px; height: 64px; }
                .icon-ring svg { width: 100%; height: 100%; }
                /* min-width keeps the title readable next to the stats;
                   when there isn't room for both, the stats wrap below
                   instead of crushing the title to zero width. */
                .title-area { flex: 1 1 auto; min-width: 140px; }
                .tab-title {
                    font-size: 20px; font-weight: 700; color: ${l};
                    letter-spacing: 0.5px; text-shadow: ${c};
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .tab-subtitle {
                    font-size: 12px; color: var(--secondary-text-color, ${n.textSec});
                    margin-top: 2px; font-weight: 500;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .stats { display: flex; gap: 16px; flex-shrink: 0; }
                .stat { text-align: center; min-width: 50px; }
                .stat.clickable { cursor: pointer; border-radius: 8px; padding: 2px 6px; margin: -2px -6px; transition: background 0.15s; }
                .stat.clickable:hover { background: ${n.dotColor}; }
                .stat-value {
                    font-size: 15px; font-weight: 700; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${n.text});
                }
                .stat-label {
                    font-size: 11px; color: var(--secondary-text-color, ${n.textTertiary});
                    font-weight: 500; margin-top: 1px;
                }
                @media (max-width: 500px) {
                    .header-wrap { padding: 12px 14px; gap: 8px 12px; flex-wrap: wrap; }
                    .icon-ring { width: 48px; height: 48px; }
                    .tab-title { font-size: 16px; }
                    .stats { gap: 10px; }
                    .stat-value { font-size: 13px; }
                }
            </style>
            <ha-card>
                <div class="header-wrap">
                    <div class="icon-ring">
                        <svg viewBox="-34 -34 68 68" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <filter id="glow-${this._tab}" x="-40%" y="-40%" width="180%" height="180%">
                                    <feGaussianBlur stdDeviation="4" result="blur"/>
                                    <feFlood flood-color="${s}" flood-opacity="${h}"/>
                                    <feComposite in2="blur" operator="in"/>
                                    <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                                </filter>
                            </defs>
                            <circle r="28" fill="none" stroke="${s}" stroke-width="1.2" opacity="0.25">
                                <animate attributeName="r" values="28;31;28" dur="3s" repeatCount="indefinite"/>
                                <animate attributeName="opacity" values="0.25;0.10;0.25" dur="3s" repeatCount="indefinite"/>
                            </circle>
                            <circle r="24" fill="${s}0F" stroke="${s}" stroke-width="1.5" filter="url(#glow-${this._tab})"/>
                            <g stroke="${s}" fill="none" opacity="0.75" stroke-linecap="round" stroke-linejoin="round">
                                ${t.icon()}
                            </g>
                        </svg>
                    </div>
                    <div class="title-area">
                        <div class="tab-title">${e}</div>
                        <div class="tab-subtitle">${i}</div>
                    </div>
                    <div class="stats">
                        ${r.map((t,e)=>{const i=o[e],s=i&&this._hass.states[`${this._prefix}${i}`];return j`
                            <div class="stat ${s?"clickable":""}"
                                 @click=${s?()=>this._openStat(i):null}>
                                <div class="stat-value">${a[e]}</div>
                                <div class="stat-label">${t}</div>
                            </div>`})}
                    </div>
                </div>
            </ha-card>
        `}getCardSize(){return 1}static getStubConfig(){return{tab:"home"}}},{type:"eb-tab-header",name:"SEM Tab Header",description:"Lumina-styled tab header with glow icon and live stats"});const kt={"clear-night":{icon:"🌙",key:"weather_clear"},cloudy:{icon:"☁️",key:"weather_cloudy"},fog:{icon:"🌫️",key:"weather_fog"},hail:{icon:"🧊",key:"weather_hail"},lightning:{icon:"⚡",key:"weather_thunder"},"lightning-rainy":{icon:"⛈️",key:"weather_thunderstorm"},partlycloudy:{icon:"⛅",key:"weather_partly_cloudy"},pouring:{icon:"🌧️",key:"weather_pouring"},rainy:{icon:"🌦️",key:"weather_rain"},snowy:{icon:"❄️",key:"weather_snow"},"snowy-rainy":{icon:"🌨️",key:"weather_sleet"},sunny:{icon:"☀️",key:"weather_sunny"},windy:{icon:"💨",key:"weather_windy"},"windy-variant":{icon:"💨",key:"weather_windy"},exceptional:{icon:"⚠️",key:"weather_exceptional"}};bt("eb-weather-card",class extends vt{constructor(){super(),this._clockTime="--:--",this._clockDate="",this._clockInterval=null}static get watchedEntities(){return[]}setConfig(t){if(!t.entity)throw new Error("eb-weather-card requires entity");super.setConfig(t)}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=this._config?.entity;if(!r)return;const a=t?.states[r],o=(a?.state||"")+JSON.stringify(a?.attributes?.forecast?.[0]||"")+"|"+(e||"");(o!==this._lastWeatherKey||s)&&(this._lastWeatherKey=o,this.requestUpdate())}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),this._updateClock(),this._clockInterval=setInterval(()=>{this._updateClock()},3e4)}disconnectedCallback(){super.disconnectedCallback(),this._clockInterval&&(clearInterval(this._clockInterval),this._clockInterval=null)}_updateClock(){const t=new Date,e=this._hass?.config,i=(e?.language||this._hass?.language||navigator.language||"en").split("-")[0],s=e?.country,r=s?`${i}-${s}`:i,a=e?.time_zone||void 0,o=this._hass?.locale?.time_format,n={hour:"2-digit",minute:"2-digit",timeZone:a};"24"===o?n.hour12=!1:"am_pm"!==o&&"12"!==o||(n.hour12=!0),this._clockTime=t.toLocaleTimeString(r,n),this._clockDate=t.toLocaleDateString(r,{weekday:"long",day:"numeric",month:"long",year:"numeric",timeZone:a}),this.requestUpdate()}_renderForecastRows(t,e){const i=this._hass?.language||navigator.language||"en",s=this._hass?.config?.time_zone||void 0;return t.slice(0,e).map(t=>{const e=new Date(t.datetime).toLocaleDateString(i,{weekday:"short",timeZone:s}),r=kt[t.condition]?.icon||"❓",a=null!=t.templow?Math.round(t.templow):"—",o=null!=t.temperature?Math.round(t.temperature):"—",n="number"==typeof o&&"number"==typeof a?o-a:0,l=Math.max(n/30*100,10),c="number"==typeof o&&"number"==typeof a?(a+o)/2:15,h=Math.min(Math.max((c-0)/30,0),1),d=h>.5?`rgba(255,${Math.round(200-100*h)},0,0.6)`:`rgba(${Math.round(100+200*h)},${Math.round(180+40*h)},255,0.5)`;return j`
                <div class="forecast-row">
                    <span class="f-day">${e}</span>
                    <span class="f-icon">${r}</span>
                    <span class="f-low">${a}°</span>
                    <div class="f-bar-wrap">
                        <div class="f-bar" style="width:${l}%;background:${d}"></div>
                    </div>
                    <span class="f-high">${o}°</span>
                </div>
            `})}_findUsableWeatherEntity(){const t=this._hass?.states;if(!t)return null;const e=Object.keys(t).filter(e=>{if(!e.startsWith("weather."))return!1;const i=t[e];return i&&"unavailable"!==i.state&&"unknown"!==i.state&&i.attributes&&null!=i.attributes.temperature});return e.filter(t=>!t.startsWith("weather.forecast_"))[0]||e[0]||null}render(){if(!this._config)return Y;let t=this._config.entity;const e=this._config.forecast_rows||5;let i=this._hass?.states[t];if(!i||"unavailable"===i.state||null==i.attributes?.temperature){const e=this._findUsableWeatherEntity();e&&(t=e,i=this._hass.states[e])}if(!i)return j`
                <ha-card>
                    <div style="padding:16px;color:#ef5350">Entity ${t} not found</div>
                </ha-card>
            `;const s=this._theme(),r=i.state,a=i.attributes,o=null!=a.temperature?Math.round(a.temperature):"—",n=a.temperature_unit||"°C",l=null!=a.humidity?Math.round(a.humidity):"—",c=null!=a.wind_speed?Math.round(a.wind_speed):"—",h=a.wind_speed_unit||"km/h",d=kt[r]||{icon:"❓",key:""},p=a.forecast||[];return j`
            <style>
                :host { display: block; }
                .wrap {
                    padding: 24px 20px 16px;
                    position: relative;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 35%, rgba(200,220,240,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${s.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${s.text});
                }
                .clock-section {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 20px;
                }
                .clock-left { flex: 1; }
                .time {
                    font-size: 48px;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    letter-spacing: -1px;
                    line-height: 1;
                    color: var(--primary-text-color, ${s.text});
                    text-shadow: 0 0 20px rgba(200,220,240,0.15);
                }
                .date {
                    font-size: 13px;
                    color: var(--secondary-text-color, ${s.textSec});
                    margin-top: 6px;
                    font-weight: 500;
                }
                .weather-current {
                    text-align: right;
                    flex-shrink: 0;
                }
                .weather-icon {
                    font-size: 40px;
                    line-height: 1;
                    filter: drop-shadow(0 0 8px rgba(200,220,240,0.2));
                }
                .weather-label {
                    font-size: 12px;
                    color: var(--secondary-text-color, ${s.textSec});
                    margin-top: 2px;
                    font-weight: 500;
                }
                .temp {
                    font-size: 28px;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${s.text});
                    text-shadow: 0 0 12px rgba(200,220,240,0.1);
                }
                .weather-details {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 16px;
                    padding-bottom: 14px;
                    border-bottom: 1px solid var(--divider-color, ${s.surfaceBorder});
                }
                .detail {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    color: var(--secondary-text-color, ${s.textSec});
                }
                .detail-icon { font-size: 14px; opacity: 0.7; }
                .forecast-rows {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .forecast-row {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-variant-numeric: tabular-nums;
                    padding: 4px 0;
                }
                .f-day {
                    width: 32px;
                    color: var(--secondary-text-color, ${s.textSec});
                    font-weight: 500;
                    font-size: 12px;
                }
                .f-icon { font-size: 16px; width: 24px; text-align: center; }
                .f-low {
                    width: 30px;
                    text-align: right;
                    color: #78a8d8;
                    font-weight: 500;
                    font-size: 12px;
                }
                .f-bar-wrap {
                    flex: 1;
                    height: 4px;
                    background: var(--secondary-background-color, ${s.surface});
                    border-radius: 2px;
                    overflow: hidden;
                }
                .f-bar {
                    height: 100%;
                    border-radius: 2px;
                    transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
                }
                .f-high {
                    width: 30px;
                    text-align: right;
                    color: #e0a050;
                    font-weight: 600;
                    font-size: 12px;
                }
            </style>
            <ha-card>
                <div class="wrap">
                    <div class="clock-section">
                        <div class="clock-left">
                            <div class="time">${this._clockTime}</div>
                            <div class="date">${this._clockDate}</div>
                        </div>
                        <div class="weather-current">
                            <div class="weather-icon">${d.icon}</div>
                            <div class="weather-label">${this._t(d.key)}</div>
                            <div class="temp">${o}${n}</div>
                        </div>
                    </div>

                    <div class="weather-details">
                        <div class="detail">
                            <span class="detail-icon">💧</span>
                            <span>${l}%</span>
                        </div>
                        <div class="detail">
                            <span class="detail-icon">💨</span>
                            <span>${c} ${h}</span>
                        </div>
                    </div>

                    <div class="forecast-rows">
                        ${p.length?this._renderForecastRows(p,e):Y}
                    </div>
                </div>
            </ha-card>
        `}getCardSize(){return 5}static getStubConfig(){return{entity:"weather.home"}}},{type:"custom:eb-weather-card",name:"SEM Weather",description:"Lumina-styled clock + weather card with forecast",preview:!1});const Mt=[{key:"today",labelKey:"period_today"},{key:"yesterday",labelKey:"period_yesterday"},{key:"week",labelKey:"period_this_week"},{key:"month",labelKey:"period_this_month"},{key:"year",labelKey:"period_this_year"}];bt("eb-period-selector-card",class extends vt{static get watchedEntities(){return[]}constructor(){super(),this._active="week",this._firstRender=!0}setConfig(t){super.setConfig(t),t.default_period&&(this._active=t.default_period)}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;(e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,this.requestUpdate())}get hass(){return this._hass}firstUpdated(){this._dispatchPeriod(this._active)}_getPeriod(t){const e=new Date,i=(t=>new Date(t.getFullYear(),t.getMonth(),t.getDate()))(e);switch(t){case"today":return{start:i,end:e,granularity:"hour"};case"yesterday":{const t=new Date(i);return t.setDate(t.getDate()-1),{start:t,end:i,granularity:"hour"}}case"week":{const t=e.getDay()||7,s=new Date(i);return s.setDate(s.getDate()-(t-1)),{start:s,end:e,granularity:"day"}}case"month":return{start:new Date(e.getFullYear(),e.getMonth(),1),end:e,granularity:"day"};case"year":return{start:new Date(e.getFullYear(),0,1),end:e,granularity:"month"};default:return this._getPeriod("week")}}_dispatchPeriod(t){this._active=t,this.requestUpdate();const e=this._getPeriod(t);document.dispatchEvent(new CustomEvent("eb-period-change",{detail:{...e,key:t}}))}render(){if(!this._config)return Y;const t=this._theme();return j`
            <style>
                :host { display: block; }
                .eb-period {
                    display: flex;
                    gap: 8px;
                    padding: 12px 16px;
                    justify-content: center;
                    flex-wrap: wrap;
                    background:
                        radial-gradient(ellipse 80% 60% at 50% 50%, rgba(200,220,240,0.04) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                }
                .btn {
                    border: 1px solid var(--divider-color, ${t.surfaceBorder});
                    background: var(--secondary-background-color, ${t.surface});
                    color: var(--secondary-text-color, ${t.textSec});
                    padding: 8px 18px;
                    border-radius: 12px;
                    font-size: 13px;
                    font-weight: 500;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    font-variant-numeric: tabular-nums;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4,0,0.2,1);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    user-select: none;
                }
                .btn:hover {
                    background: var(--secondary-background-color, ${t.surfaceHover});
                    color: var(--primary-text-color, ${t.text});
                    border-color: var(--divider-color, ${t.surfaceBorder});
                }
                .btn.active {
                    background: rgba(66,165,245,0.18);
                    border-color: rgba(66,165,245,0.40);
                    color: ${t.accent};
                    box-shadow: 0 0 16px rgba(66,165,245,0.12), 0 0 4px rgba(66,165,245,0.08);
                    font-weight: 600;
                }
            </style>
            <ha-card>
                <div class="eb-period">
                    ${Mt.map(t=>j`
                        <button
                            class="btn ${this._active===t.key?"active":""}"
                            role="button"
                            aria-label=${this._t(t.labelKey)}
                            aria-pressed=${this._active===t.key}
                            @click=${()=>this._dispatchPeriod(t.key)}
                        >${this._t(t.labelKey)}</button>
                    `)}
                </div>
            </ha-card>
        `}getCardSize(){return 1}static getStubConfig(){return{}}},{type:"custom:eb-period-selector-card",name:"SEM Period Selector",description:"Glassmorphism period picker for SEM chart cards",preview:!1});const St="sensor.ebi_",Ct=["flow_solar_to_home_energy","flow_solar_to_ev_energy","daily_co2_avoided","yearly_co2_avoided","lifetime_co2_avoided","yearly_trees_equivalent","lifetime_trees_equivalent"];function Dt(t){return Ct.map(e=>`${t}${e}`)}bt("eb-energy-impact-card",class extends vt{static get watchedEntities(){return Dt(St)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||St,this._prefix!==St&&(this._prevVals={})}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=Dt(this._prefix||St);let a=!1;for(const e of r)if(this._prevVals[e]!==t.states[e]?.state){a=!0;break}if(a||s){for(const e of r)this._prevVals[e]=t.states[e]?.state;this._scheduleUpdate()}}get hass(){return this._hass}_val(t,e=0){return this._state(`${this._prefix||St}${t}`,e)}_treeIcon(t){return t>=50?"mdi:forest":t>=10?"mdi:pine-tree":t>=1?"mdi:tree":"mdi:sprout"}render(){if(!this._config)return Y;const t=this._theme(),e=this._val("flow_solar_to_home_energy")+this._val("flow_solar_to_ev_energy"),i=(.128*e).toFixed(1),s=`${e.toFixed(1)} kWh × 128 g/kWh`,r=this._val("yearly_trees_equivalent"),a=this._val("lifetime_trees_equivalent"),o=this._val("yearly_co2_avoided"),n=this._val("lifetime_co2_avoided"),l=r>=10?r.toFixed(0):r.toFixed(1),c=this._treeIcon(r);return j`
            <style>
                :host { display: block; }

                .wrap {
                    padding: 16px;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 25%, rgba(255,152,0,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI', 'Roboto', sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }

                .tiles {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .tile {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 14px;
                    border-radius: 12px;
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                }

                .tile ha-icon {
                    flex-shrink: 0;
                    margin-top: 2px;
                }

                .tile-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    min-width: 0;
                }

                .tile-label {
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    color: var(--secondary-text-color, ${t.textSec});
                }

                .tile-hero {
                    font-size: 22px;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    line-height: 1.1;
                }

                .tile-detail {
                    font-size: 12px;
                    color: var(--secondary-text-color, ${t.textSec});
                }

                .stats {
                    display: flex;
                    gap: 16px;
                    margin-top: 4px;
                    flex-wrap: wrap;
                }

                .stat {
                    display: flex;
                    flex-direction: column;
                    gap: 1px;
                }

                .stat-val {
                    font-size: 13px;
                    font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }

                .stat-lbl {
                    font-size: 12px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    color: var(--secondary-text-color, ${t.textSec});
                }

                /* Hidden SVG filter */
                .glow-svg {
                    position: absolute;
                    width: 0;
                    height: 0;
                    overflow: hidden;
                }

                @media (max-width: 480px) {
                    .tiles { grid-template-columns: 1fr; }
                }
            </style>

            <!-- SVG glow filter for leaf/tree icons -->
            <svg class="glow-svg" aria-hidden="true">
                <defs>
                    <filter id="leaf-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feFlood flood-color="#8DC892" flood-opacity="0.25" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge>
                            <feMergeNode in="glow"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
            </svg>

            <div class="wrap">
                <div class="tiles">

                    <!-- Left tile: Carbon Avoided Today -->
                    <div class="tile">
                        <ha-icon
                            icon="mdi:leaf"
                            style="--mdc-icon-size:24px;color:#8DC892;filter:url(#leaf-glow)"
                        ></ha-icon>
                        <div class="tile-content">
                            <span class="tile-label">${this._t("carbon_avoided_today")}</span>
                            <span class="tile-hero" style="color:#8DC892">${i} kg</span>
                            <span class="tile-detail">${s}</span>
                        </div>
                    </div>

                    <!-- Right tile: Trees Equivalent -->
                    <div class="tile">
                        <ha-icon
                            icon="${c}"
                            style="--mdc-icon-size:24px;color:#8DC892;filter:url(#leaf-glow)"
                        ></ha-icon>
                        <div class="tile-content">
                            <span class="tile-label">${this._t("trees_equivalent")}</span>
                            <span class="tile-hero" style="color:#8DC892">${l}</span>
                            <div class="stats">
                                <div class="stat">
                                    <span class="stat-val">${o.toFixed(0)} kg</span>
                                    <span class="stat-lbl">${this._t("co2_yearly")}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-val">${n.toFixed(0)} kg</span>
                                    <span class="stat-lbl">${this._t("co2_lifetime")}</span>
                                </div>
                                <div class="stat">
                                    <span class="stat-val">${a.toFixed(0)}</span>
                                    <span class="stat-lbl">${this._t("trees_lifetime")}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        `}getCardSize(){return 3}static getStubConfig(){return{entity_prefix:St}}},{type:"custom:eb-energy-impact-card",name:"SEM Energy Impact Card",description:"Environmental impact display for Solar Energy Management",preview:!1});const zt="daily_ev_energy",Et="lifetime_ev_energy",Pt="lifetime_ev_solar_share",Tt="lifetime_ev_cost",Ft="lifetime_ev_sessions",At="sensor.ebi_";bt("eb-ev-progress-card",class extends vt{static get watchedEntities(){return[`${At}${zt}`,`${At}${Et}`,`${At}${Pt}`,`${At}${Tt}`,`${At}${Ft}`,"number.ebi_daily_ev_target","number.ebi_charger_ev_charger_daily_ev_target"]}_evDailyTarget(){const t=this._hass?.states||{},e=new RegExp(`^number\\.${this._objPrefix()}charger_.+_daily_ev_target$`),i=Object.keys(t).filter(t=>e.test(t)).sort();if(i.length){const e=parseFloat(t[i[0]]?.state);if(!isNaN(e))return e}return this._state(`number.${this._objPrefix()}daily_ev_target`,10)}setConfig(t){super.setConfig(t)}_prefix(){return this._config?.entity_prefix??At}_pct(t,e){return e<=0?0:Math.min(100,t/e*100)}_barColor(t,e){return 0===t?"#666":e>=100?"#8DC892":e>=70?"#ff9800":"#f44336"}_fmtEnergy(t){return null==t||isNaN(t)?"—":t.toFixed(t<10?2:1)+" kWh"}_fmtCost(t,e){return null==t||isNaN(t)?"—":t.toFixed(2)+" "+e}_fmtSessions(t){return null==t||isNaN(t)?"—":String(Math.round(t))}render(){if(!this._hass||!this._config)return Y;const t=this._theme(),e=this._prefix(),i=this._state(`${e}${zt}`),s=this._evDailyTarget(),r=this._state(`${e}${Et}`),a=this._state(`${e}${Pt}`),o=this._state(`${e}${Tt}`),n=this._state(`${e}${Ft}`),l=ft(this._hass),c=this._pct(i,s),h=this._barColor(s,c),d=s>0?j`<span class="target-pct">${Math.round(c)}% ${this._t("of_target")}</span>`:j`<span class="target-pct no-target">${this._t("no_target")}</span>`,p=["radial-gradient(ellipse 80% 70% at 20% 50%, rgba(141,200,146,0.06) 0%, transparent 70%)",`radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px)`].join(", ");return j`
            <style>
                :host {
                    display: block;
                    font-family: 'Segoe UI', 'Roboto', sans-serif;
                }

                .card {
                    background: ${t.cardBg};
                    background-image: ${p};
                    background-size: auto, 16px 16px;
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: ${t.shadow};
                    color: ${t.text};
                }

                /* ── Progress section ── */
                .progress-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 10px;
                }

                .ev-icon {
                    font-size: 22px;
                    color: #8DC892;
                    flex-shrink: 0;
                    display: flex;
                    align-items: center;
                }

                .ev-icon ha-icon {
                    --mdc-icon-size: 22px;
                    color: #8DC892;
                }

                .progress-info {
                    flex: 1;
                    min-width: 0;
                }

                .progress-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: ${t.text};
                    letter-spacing: 0.3px;
                }

                .progress-values {
                    font-size: 12px;
                    color: ${t.textSec};
                    margin-top: 2px;
                }

                .target-pct {
                    font-size: 11px;
                    color: ${t.textSec};
                    margin-top: 1px;
                    display: block;
                }

                .no-target {
                    opacity: 0.6;
                    font-style: italic;
                }

                /* ── Progress bar ── */
                .progress-track {
                    height: 6px;
                    border-radius: 3px;
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    overflow: hidden;
                    margin-top: 10px;
                }

                .progress-fill {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.5s ease, background 0.3s ease;
                }

                /* ── Section divider ── */
                .divider {
                    height: 1px;
                    background: ${t.divider};
                    margin: 14px 0;
                }

                /* ── Lifetime stats section ── */
                .lifetime-label {
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    color: ${t.textSec};
                    margin-bottom: 10px;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr 1fr;
                    gap: 8px;
                }

                @media (max-width: 400px) {
                    .stats-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                .stat-tile {
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    border-radius: 8px;
                    padding: 10px 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    text-align: center;
                }

                .stat-icon ha-icon {
                    --mdc-icon-size: 18px;
                    color: #8DC892;
                }

                .stat-value {
                    font-size: 13px;
                    font-weight: 700;
                    color: ${t.text};
                    line-height: 1.2;
                }

                .stat-label {
                    font-size: 11px;
                    color: ${t.textSec};
                    letter-spacing: 0.3px;
                    line-height: 1.2;
                }
            </style>

            <div class="card">
                <!-- Progress section -->
                <div class="progress-header">
                    <div class="ev-icon">
                        <ha-icon icon="mdi:car-electric"></ha-icon>
                    </div>
                    <div class="progress-info">
                        <div class="progress-label">${this._t("daily_progress")}</div>
                        <div class="progress-values">
                            ${this._fmtEnergy(i)}${s>0?` / ${this._fmtEnergy(s)}`:""}
                        </div>
                        ${d}
                    </div>
                </div>

                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width:${c}%;background:${h}"
                    ></div>
                </div>

                <div class="divider"></div>

                <!-- Lifetime stats section -->
                <div class="lifetime-label">${this._t("lifetime_stats")}</div>
                <div class="stats-grid">
                    <div class="stat-tile">
                        <div class="stat-icon"><ha-icon icon="mdi:lightning-bolt"></ha-icon></div>
                        <div class="stat-value">${this._fmtEnergy(r)}</div>
                        <div class="stat-label">${this._t("energy")}</div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon"><ha-icon icon="mdi:weather-sunny"></ha-icon></div>
                        <div class="stat-value">${Math.round(a)}%</div>
                        <div class="stat-label">${this._t("solar")}</div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon"><ha-icon icon="mdi:currency-usd"></ha-icon></div>
                        <div class="stat-value">${this._fmtCost(o,l)}</div>
                        <div class="stat-label">${this._t("cost")}</div>
                    </div>
                    <div class="stat-tile">
                        <div class="stat-icon"><ha-icon icon="mdi:counter"></ha-icon></div>
                        <div class="stat-value">${this._fmtSessions(n)}</div>
                        <div class="stat-label">${this._t("sessions")}</div>
                    </div>
                </div>
            </div>
        `}getCardSize(){return 3}static getStubConfig(){return{entity_prefix:At}}},{type:"eb-ev-progress-card",name:"SEM EV Progress Card",description:"Daily EV progress bar and lifetime charging statistics"});bt("eb-gauge-card",class extends vt{static get watchedEntities(){return[]}setConfig(t){if(!t.entity)throw new Error("eb-gauge-card requires entity");super.setConfig(t),this._entity=t.entity,this._name=t.name||null,this._min=t.min??0,this._max=t.max??100,this._color=t.color||"#4db6ac",this._unit=t.unit||"%"}set hass(t){this._hass,this._hass=t;const e=t?.states[this._entity]?.state;e!==this._lastState&&(this._lastState=e,this.requestUpdate())}get hass(){return this._hass}render(){if(!this._hass||!this._config)return Y;const t=this._hass.states[this._entity],e=t&&parseFloat(t.state)||0,i=this._name||t?.attributes?.friendly_name||this._entity,s=Math.min(Math.max((e-this._min)/(this._max-this._min),0),1),r=this._theme(),a=this._color,o=58,n=-210,l=n+240*s,c=t=>{const e=t*Math.PI/180;return{x:70+o*Math.cos(e),y:70+o*Math.sin(e)}},h=c(n),d=c(30),p=c(l),u=240*s>180?1:0,g=s<.5?`color-mix(in srgb, #f44336 ${Math.round(100*(1-2*s))}%, #ff9800)`:`color-mix(in srgb, ${a} ${Math.round(2*(s-.5)*100)}%, #ff9800)`;return j`
            <ha-card>
                <div class="gauge-wrap">
                    <svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <filter id="glow-${this._entity.replace(/\./g,"_")}" x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="3" result="blur"/>
                                <feFlood flood-color="${g}" flood-opacity="0.3"/>
                                <feComposite in2="blur" operator="in"/>
                                <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
                            </filter>
                        </defs>
                        <!-- Background arc -->
                        <path d="M ${h.x} ${h.y} A ${o} ${o} 0 ${1} 1 ${d.x} ${d.y}"
                              fill="none" stroke="${r.surface||"rgba(255,255,255,0.08)"}" stroke-width="8"
                              stroke-linecap="round"/>
                        <!-- Value arc -->
                        ${s>.01?V`
                            <path d="M ${h.x} ${h.y} A ${o} ${o} 0 ${u} 1 ${p.x} ${p.y}"
                                  fill="none" stroke="${g}" stroke-width="8"
                                  stroke-linecap="round"
                                  filter="url(#glow-${this._entity.replace(/\./g,"_")})"
                                  style="transition: d 1s ease"/>
                        `:""}
                    </svg>
                    <div class="gauge-center">
                        <span class="gauge-value" style="color:${g}">${e.toFixed(1)}${this._unit}</span>
                    </div>
                    <div class="gauge-label">${i}</div>
                </div>
            </ha-card>
        `}static get styles(){return a`
            :host { display: block; }
            ha-card {
                background: transparent !important;
                border: none !important;
                box-shadow: none !important;
            }
            .gauge-wrap {
                position: relative;
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px 16px 8px;
            }
            svg {
                width: 180px;
                height: 130px;
            }
            .gauge-center {
                position: absolute;
                top: 65px;
                left: 50%;
                transform: translateX(-50%);
                text-align: center;
            }
            .gauge-value {
                font-size: 28px;
                font-weight: 700;
                font-variant-numeric: tabular-nums;
                font-family: 'Segoe UI', 'Roboto', sans-serif;
            }
            .gauge-label {
                font-size: 13px;
                font-weight: 500;
                color: var(--secondary-text-color, #9e9e9e);
                text-align: center;
                margin-top: -8px;
                font-family: 'Segoe UI', 'Roboto', sans-serif;
            }
        `}getCardSize(){return 3}static getStubConfig(){return{entity:"sensor.ebi_self_consumption_rate"}}},{type:"custom:eb-gauge-card",name:"SEM Gauge Card",description:"Lumina-styled arc gauge for percentage values",preview:!1});const Rt="sensor.ebi_",Lt=["solar_power","daily_solar_energy","monthly_solar_yield_energy","yearly_solar_yield_energy","flow_solar_to_home_power","flow_solar_to_battery_power","flow_solar_to_ev_power","flow_solar_to_grid_power","flow_solar_to_home_energy","flow_solar_to_battery_energy","flow_solar_to_ev_energy","flow_solar_to_grid_energy","forecast_today_kwh","forecast_tomorrow_kwh","forecast_remaining_today_kwh","forecast_peak_power_today_w","forecast_peak_time_today","best_surplus_window","pv_daily_specific_yield","pv_performance_vs_forecast","pv_estimated_annual_degradation","pv_degradation_trend","pv_string_pv1_power","pv_string_pv1_daily_energy","pv_string_pv2_power","pv_string_pv2_daily_energy","pv_string_pv3_power","pv_string_pv3_daily_energy","pv_string_pv4_power","pv_string_pv4_daily_energy"];function It(t){return Lt.map(e=>`${t}${e}`)}bt("eb-solar-card",class extends vt{static get watchedEntities(){return It(Rt)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Rt,this._prefix!==Rt&&(this._prevVals={})}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=It(this._prefix||Rt);let a=!1;for(const e of r)if(this._prevVals[e]!==t.states[e]?.state){a=!0;break}if(a||s){for(const e of r)this._prevVals[e]=t.states[e]?.state;this._scheduleUpdate()}}get hass(){return this._hass}_val(t,e=0){return this._state(`${this._prefix}${t}`,e)}_valStr(t){return this._stateStr(`${this._prefix}${t}`)}_exists(t){const e=this._hass?.states?.[`${this._prefix}${t}`];return!!e&&"unavailable"!==e.state&&"unknown"!==e.state}_fmt(t,e=1){return null==t||isNaN(t)?"—":t.toFixed(e)}render(){if(!this._config)return Y;const t=this._theme(),e=this._val("solar_power"),i=this._val("daily_solar_energy"),s=this._val("monthly_solar_yield_energy"),r=this._val("yearly_solar_yield_energy"),a=Math.min(Math.max(e/1e4,0),1),o=2*Math.PI*42,n=(o*(1-a)).toFixed(1),l=e>50?"solarPulse 3s ease-in-out infinite":"none",c=this._val("flow_solar_to_home_power"),h=this._val("flow_solar_to_home_energy"),d=this._val("flow_solar_to_battery_power"),p=this._val("flow_solar_to_battery_energy"),u=this._val("flow_solar_to_ev_power"),g=this._val("flow_solar_to_ev_energy"),f=this._val("flow_solar_to_grid_power"),_=this._val("flow_solar_to_grid_energy"),m=this._val("forecast_today_kwh"),y=this._val("forecast_tomorrow_kwh"),x=this._val("forecast_remaining_today_kwh"),b=this._val("forecast_peak_power_today_w"),v=this._valStr("forecast_peak_time_today"),w=this._valStr("best_surplus_window"),$=this._val("pv_daily_specific_yield"),k=this._val("pv_performance_vs_forecast"),M=this._val("pv_estimated_annual_degradation"),S=this._valStr("pv_degradation_trend"),C=0!==k?this._fmt(k,0)+"%":"—",D=k>=0?"#8DC892":"#f06292",z=["flow_solar_to_home_energy","flow_solar_to_battery_energy","flow_solar_to_ev_energy","flow_solar_to_grid_energy"].some(t=>this._exists(t)),E=["pv_daily_specific_yield","pv_performance_vs_forecast","pv_estimated_annual_degradation","pv_degradation_trend"].some(t=>this._exists(t)),P=yt(this._hass,this._prefix);return j`
            <style>
                :host { display: block; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${_t(t,ht.solar)};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }
                .glow-svg { position: absolute; width: 0; height: 0; overflow: hidden; }

                /* ── Hero ── */
                .hero { display: flex; align-items: center; gap: 20px; }
                @media (max-width: 400px) { .hero { flex-direction: column; gap: 12px; } }

                .solar-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
                .solar-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
                .ring-bg { fill: none; stroke: rgba(255,152,0,0.12); stroke-width: 5; }
                .solar-arc {
                    fill: none; stroke: #ff9800; stroke-width: 5; stroke-linecap: round;
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1);
                    filter: url(#solar-glow);
                }
                .solar-glow-ring {
                    fill: none; stroke: #ff9800; stroke-width: 8; opacity: 0.2;
                    filter: url(#solar-glow-soft);
                }
                @keyframes solarPulse { 0%,100%{opacity:1}50%{opacity:0.6} }

                .ring-center {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center; pointer-events: none;
                }
                .solar-power-value {
                    font-size: 13px; font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    color: #ff9800;
                    text-shadow: 0 0 8px rgba(255,152,0,0.35);
                    line-height: 1.2;
                }
                .solar-daily-value {
                    font-size: 11px; color: var(--secondary-text-color,${t.textSec});
                    font-variant-numeric: tabular-nums;
                }

                /* ── Section ── */
                .section {
                    margin-top: 12px;
                    padding: 10px 12px;
                    background: var(--secondary-background-color, ${t.surface});
                    border: 1px solid var(--divider-color, ${t.surfaceBorder});
                    border-radius: 10px;
                }
                .section-title {
                    font-size: 12px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.6px; color: #ff9800; margin-bottom: 8px;
                }

                /* ── Flows grid ── */
                .flows-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px 24px;
                }
                .flow-row { display: flex; align-items: center; gap: 6px; }
                .flow-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
                .flow-label { font-size: 12px; color: var(--secondary-text-color,${t.textSec}); flex: 1; }
                .flow-vals { text-align: right; }
                .flow-power {
                    font-size: 13px; font-weight: 600;
                    font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color,${t.text});
                }
                .flow-energy {
                    font-size: 11px; color: var(--secondary-text-color,${t.textSec});
                    font-variant-numeric: tabular-nums;
                }

                /* ── Two-column section ── */
                .two-col {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 20px;
                }
                @media (max-width: 400px) { .two-col { grid-template-columns: 1fr; } }

                /* Mobile polish (added during the same fix as the
                   render-bug repair): the existing 400px breakpoints
                   only handle the very narrowest phones. The card is
                   noticeably cramped on a typical 375–480px viewport
                   without these — the 2-col flows grid produces two
                   ~155px columns of dense kWh data. */
                @media (max-width: 480px) {
                    .hero { flex-direction: column; gap: 12px; align-items: stretch; }
                    .solar-ring { width: 90px; height: 90px; margin: 0 auto; }
                    .flows-grid { grid-template-columns: 1fr; gap: 6px; }
                    .section { padding: 8px 10px; margin-top: 10px; }
                    .metric-row { padding: 1px 0; }
                    .chip { padding: 5px 6px; }
                    .chip-value { font-size: 12px; }
                }

                /* ── Metric rows ── */
                .metric-row {
                    display: flex; justify-content: space-between; align-items: baseline;
                    padding: 2px 0;
                }
                .metric-label {
                    font-size: 12px; color: var(--secondary-text-color,${t.textSec});
                    font-weight: 500;
                }
                .metric-val {
                    font-size: 13px; font-weight: 600;
                    font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color,${t.text});
                }

                /* ── Monthly / yearly chips ── */
                .chips { display: flex; gap: 8px; margin-top: 10px; }
                .chip {
                    flex: 1; text-align: center; padding: 7px 8px;
                    background: var(--secondary-background-color, ${t.surface});
                    border: 1px solid var(--divider-color, ${t.surfaceBorder});
                    border-radius: 10px;
                }
                .chip-label {
                    font-size: 12px; color: var(--secondary-text-color,${t.textTertiary});
                    font-weight: 500; margin-bottom: 2px;
                }
                .chip-value {
                    font-size: 14px; font-weight: 600; color: #ff9800;
                    font-variant-numeric: tabular-nums;
                }
                /* v1.7.1 / #312: per-PV-string chip strip styles */
                ${xt}
            </style>

            <!-- SVG glow filters -->
            <svg class="glow-svg" aria-hidden="true">
                <defs>
                    <filter id="solar-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feFlood flood-color="#ff9800" flood-opacity="0.3" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="solar-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
            </svg>

            <ha-card>
                <div class="wrap">

                    <!-- v1.7.1 / #312: per-PV-string chip strip (auto-shown ≥ 2 strings) -->
                    ${P.length>=2?j`
                        <div class="pv-strings-row">
                            ${P.map(t=>j`
                                <div class="pv-chip"
                                     title="${t.entityId}"
                                     data-entity="${t.entityId}"
                                     @click=${()=>this._fireMoreInfo?.(t.entityId)}>
                                    <span class="pv-chip-label">PV${t.slot.replace(/^pv/,"")}</span>
                                    <span class="pv-chip-value">${(Math.abs(t.watts)/1e3).toFixed(2)} kW</span>
                                </div>
                            `)}
                        </div>
                    `:Y}

                    <!-- Hero -->
                    <div class="hero">
                        <div class="solar-ring">
                            <svg viewBox="0 0 100 100">
                                <circle class="solar-glow-ring" cx="50" cy="50" r="42">
                                    <animate attributeName="opacity" values="0.2;0.07;0.2" dur="4s" repeatCount="indefinite"/>
                                </circle>
                                <circle class="ring-bg" cx="50" cy="50" r="42"/>
                                <circle class="solar-arc" cx="50" cy="50" r="42"
                                    stroke-dasharray="${o.toFixed(1)}"
                                    style="stroke-dashoffset:${n};animation:${l}"/>
                            </svg>
                            <div class="ring-center">
                                <ha-icon icon="mdi:solar-power" style="--mdc-icon-size:22px;color:#ff9800;opacity:0.8"></ha-icon>
                                <div class="solar-power-value">${pt(e)}</div>
                                <div class="solar-daily-value">${this._fmt(i,2)} kWh</div>
                            </div>
                        </div>

                        <!-- Monthly + Yearly chips -->
                        <div style="flex:1;min-width:0">
                            <div class="chips" style="margin-top:0">
                                ${this._exists("monthly_solar_yield_energy")?j`
                                <div class="chip">
                                    <div class="chip-label">${this._t("monthly")}</div>
                                    <div class="chip-value">${this._fmt(s,1)} kWh</div>
                                </div>`:Y}
                                ${this._exists("yearly_solar_yield_energy")?j`
                                <div class="chip">
                                    <div class="chip-label">${this._t("yearly")}</div>
                                    <div class="chip-value">${this._fmt(r,1)} kWh</div>
                                </div>`:Y}
                            </div>
                        </div>
                    </div>

                    <!-- Today's Flows (hidden when this backend has no flow sensors) -->
                    ${z?j`
                    <div class="section">
                        <div class="section-title">${this._t("solar_flows_today")}</div>
                        <div class="flows-grid">
                            <div class="flow-row">
                                <div class="flow-dot" style="background:#5BC8D8"></div>
                                <span class="flow-label">${this._t("home")}</span>
                                <div class="flow-vals">
                                    <div class="flow-power">${pt(c)}</div>
                                    <div class="flow-energy">${this._fmt(h,2)} kWh</div>
                                </div>
                            </div>
                            <div class="flow-row">
                                <div class="flow-dot" style="background:#f06292"></div>
                                <span class="flow-label">${this._t("battery")}</span>
                                <div class="flow-vals">
                                    <div class="flow-power">${pt(d)}</div>
                                    <div class="flow-energy">${this._fmt(p,2)} kWh</div>
                                </div>
                            </div>
                            <div class="flow-row">
                                <div class="flow-dot" style="background:#8DC892"></div>
                                <span class="flow-label">${this._t("ev")}</span>
                                <div class="flow-vals">
                                    <div class="flow-power">${pt(u)}</div>
                                    <div class="flow-energy">${this._fmt(g,2)} kWh</div>
                                </div>
                            </div>
                            <div class="flow-row">
                                <div class="flow-dot" style="background:#8353d1"></div>
                                <span class="flow-label">${this._t("grid_export")}</span>
                                <div class="flow-vals">
                                    <div class="flow-power">${pt(f)}</div>
                                    <div class="flow-energy">${this._fmt(_,2)} kWh</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `:Y}

                    <!-- v1.7.0 / #312: per-PV-string detail. Reuses
                         the "flow row" style for visual consistency
                         with the Today's Flows section above. Auto-
                         shown when 2+ strings are present; collapses
                         to nothing on single-string installs.
                         (Do NOT quote "nothing" with backticks here;
                         this HTML comment lives inside an html
                         tagged template literal, and a stray
                         backtick terminates that template at parse
                         time — see the 0x0 render bug we fixed.) -->
                    ${P.length>=2?j`
                        <div class="section">
                            <div class="section-title">${this._t("pv_strings_today")||"Per string today"}</div>
                            <div class="flows-grid">
                                ${P.map(t=>j`
                                    <div class="flow-row"
                                         style="cursor:pointer"
                                         @click=${()=>this._fireMoreInfo?.(t.entityId)}>
                                        <div class="flow-dot" style="background:#ff9800"></div>
                                        <span class="flow-label">PV${t.slot.replace(/^pv/,"")}</span>
                                        <div class="flow-vals">
                                            <div class="flow-power">${pt(t.watts)}</div>
                                            <div class="flow-energy">${null!=t.energyKwh?this._fmt(t.energyKwh,2)+" kWh":"—"}</div>
                                        </div>
                                    </div>
                                `)}
                            </div>
                        </div>
                    `:Y}

                    <!-- Forecast + Performance (side by side) -->
                    <div class="section two-col">
                        <div>
                            <div class="section-title">${this._t("forecast")}</div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("today")}</span>
                                <span class="metric-val">${this._fmt(m,1)} kWh</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("tomorrow")}</span>
                                <span class="metric-val">${this._fmt(y,1)} kWh</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("remaining")}</span>
                                <span class="metric-val">${this._fmt(x,1)} kWh</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("peak_power")}</span>
                                <span class="metric-val">
                                    ${b>0?pt(b):"—"}
                                    <span style="font-size:11px;opacity:0.7;margin-left:4px">${v||"—"}</span>
                                </span>
                            </div>
                            ${this._exists("best_surplus_window")?j`
                            <div class="metric-row">
                                <span class="metric-label">${this._t("best_surplus_window")}</span>
                                <span class="metric-val" style="color:#ff9800;font-size:11px">${w||"—"}</span>
                            </div>`:Y}
                        </div>
                        ${E?j`<div>
                            <div class="section-title">${this._t("performance")}</div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("specific_yield")}</span>
                                <span class="metric-val">${$>0?this._fmt($,2)+" kWh/kWp":"—"}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("vs_forecast")}</span>
                                <span class="metric-val" style="color:${D}">${C}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("degradation")}</span>
                                <span class="metric-val">${0!==M?this._fmt(M,2)+"%/yr":"—"}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("trend")}</span>
                                <span class="metric-val">${S?this._t(S):"—"}</span>
                            </div>
                        </div>`:Y}
                    </div>

                </div>
            </ha-card>
        `}getCardSize(){return 5}static getStubConfig(){return{entity_prefix:Rt}}},{type:"eb-solar-card",name:"SEM Solar",description:"Consolidated solar production card with flows, forecast, and performance metrics"});const Ot="sensor.ebi_",Nt=["solar_power","daily_solar_energy","monthly_solar_yield_energy","forecast_today_kwh","forecast_tomorrow_kwh","self_consumption_rate","autarky_rate","daily_costs","daily_savings","daily_ev_energy","daily_grid_import_energy"];function Ht(t){return Nt.map(e=>`${t}${e}`)}bt("eb-solar-summary-card",class extends vt{static get watchedEntities(){return Ht(Ot)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Ot,this._prefix!==Ot&&(this._prevVals={})}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=Ht(this._prefix||Ot);let a=!1;for(const e of r)if(this._prevVals[e]!==t.states[e]?.state){a=!0;break}if(a||s){for(const e of r)this._prevVals[e]=t.states[e]?.state;this._scheduleUpdate()}}get hass(){return this._hass}_val(t,e=0){return this._state(`${this._prefix}${t}`,e)}_valStr(t){return this._stateStr(`${this._prefix}${t}`)}_fmt(t,e=1){return null==t||isNaN(t)?"—":t.toFixed(e)}render(){if(!this._config)return Y;const t=this._theme(),e=this._val("solar_power"),i=this._val("daily_solar_energy"),s=this._val("monthly_solar_yield_energy"),r=this._val("forecast_today_kwh"),a=this._val("forecast_tomorrow_kwh"),o=this._val("self_consumption_rate"),n=this._val("autarky_rate"),l=this._val("daily_costs"),c=this._val("daily_savings"),h=this._val("daily_ev_energy"),d=this._val("daily_grid_import_energy"),p=ft(this._hass),u=(.15+.6*Math.min(e/1e4,1)).toFixed(3),g=2*Math.PI*42,f=(g*(1-(r>0?Math.min(i/r,1):0))).toFixed(1);return j`
            <style>
                :host { display: block; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 25%, rgba(255,152,0,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }
                .glow-svg { position: absolute; width: 0; height: 0; overflow: hidden; }

                /* Hero section */
                .hero {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .solar-ring {
                    position: relative;
                    width: 100px;
                    height: 100px;
                    flex-shrink: 0;
                }
                .solar-ring svg {
                    width: 100%;
                    height: 100%;
                    transform: rotate(-90deg);
                }
                .ring-bg {
                    fill: none;
                    stroke: rgba(255,152,0,0.12);
                    stroke-width: 5;
                }
                .progress-arc {
                    fill: none;
                    stroke: #ff9800;
                    stroke-width: 5;
                    stroke-linecap: round;
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1);
                    filter: url(#solar-glow);
                }
                .ring-icon {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }
                .ring-icon .power {
                    font-size: 18px;
                    font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    color: #ff9800;
                    text-shadow: 0 0 8px rgba(255,152,0,0.3);
                }
                .ring-icon .label {
                    font-size: 11px;
                    color: rgba(255,152,0,0.6);
                    font-weight: 500;
                    letter-spacing: 1px;
                    text-transform: uppercase;
                }
                .hero-stats {
                    flex: 1;
                    min-width: 0;
                }
                .hero-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: rgba(255,152,0,0.85);
                    letter-spacing: 0.5px;
                    margin-bottom: 8px;
                }
                .hero-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: baseline;
                    padding: 3px 0;
                }
                .hero-label {
                    font-size: 12px;
                    color: var(--secondary-text-color, ${t.textSec});
                    font-weight: 500;
                }
                .hero-value {
                    font-size: 13px;
                    font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }

                /* Metrics grid */
                .metrics {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                }
                .metric {
                    background: var(--secondary-background-color, ${t.surface});
                    border: 1px solid var(--divider-color, ${t.surfaceBorder});
                    border-radius: 10px;
                    padding: 10px;
                    text-align: center;
                    transition: border-color 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .metric:hover {
                    border-color: var(--divider-color, ${t.surfaceHover});
                }
                .metric-label {
                    font-size: 11px;
                    color: var(--secondary-text-color, ${t.textTertiary});
                    font-weight: 500;
                    letter-spacing: 0.3px;
                    margin-bottom: 4px;
                }
                .metric-value {
                    font-size: 14px;
                    font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }
                .c-solar   { color: #ff9800; }
                .c-grid    { color: #488fc2; }
                .c-ev      { color: #8DC892; }
                .c-home    { color: #5BC8D8; }
                .c-savings { color: #4db6ac; }
                .c-cost    { color: #f06292; }
            </style>

            <!-- SVG glow filters -->
            <svg class="glow-svg" aria-hidden="true">
                <defs>
                    <filter id="solar-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feFlood flood-color="#ff9800" flood-opacity="0.25" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="solar-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
            </svg>

            <ha-card>
                <div class="wrap">

                    <!-- Hero -->
                    <div class="hero">
                        <div class="solar-ring">
                            <svg viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="42"
                                    fill="none" stroke="#ff9800" stroke-width="8"
                                    filter="url(#solar-glow-soft)"
                                    style="opacity:${u}">
                                    <animate attributeName="r" values="42;45;42" dur="3s" repeatCount="indefinite"/>
                                    <animate attributeName="opacity" values="${u};${(.4*parseFloat(u)).toFixed(3)};${u}" dur="3s" repeatCount="indefinite"/>
                                </circle>
                                <circle class="ring-bg" cx="50" cy="50" r="42"/>
                                <circle class="progress-arc" cx="50" cy="50" r="42"
                                    stroke-dasharray="${g.toFixed(1)}"
                                    style="stroke-dashoffset:${f}"/>
                            </svg>
                            <div class="ring-icon">
                                <div class="power">${pt(e)}</div>
                                <div class="label">${this._t("solar").toUpperCase()}</div>
                            </div>
                        </div>

                        <div class="hero-stats">
                            <div class="hero-title">${this._t("production")}</div>
                            <div class="hero-row">
                                <span class="hero-label">${this._t("yield_today")}</span>
                                <span class="hero-value c-solar">${this._fmt(i,2)} kWh</span>
                            </div>
                            <div class="hero-row">
                                <span class="hero-label">${this._t("grid_today")}</span>
                                <span class="hero-value c-grid">${this._fmt(d,2)} kWh</span>
                            </div>
                            <div class="hero-row">
                                <span class="hero-label">${this._t("forecast")}</span>
                                <span class="hero-value c-solar">${this._fmt(r,1)} kWh</span>
                            </div>
                            <div class="hero-row">
                                <span class="hero-label">${this._t("tomorrow")}</span>
                                <span class="hero-value" style="color:var(--secondary-text-color)">${this._fmt(a,1)} kWh</span>
                            </div>
                        </div>
                    </div>

                    <!-- Metrics 3x2 grid -->
                    <div class="metrics">
                        <div class="metric">
                            <div class="metric-label">${this._t("self_use")}</div>
                            <div class="metric-value c-home">${this._fmt(o,1)}%</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">${this._t("autarky")}</div>
                            <div class="metric-value c-savings">${this._fmt(n,1)}%</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">${this._t("ev_today")}</div>
                            <div class="metric-value c-ev">${this._fmt(h,1)} kWh</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">${this._t("cost")}</div>
                            <div class="metric-value c-cost">${this._fmt(l,2)} ${p}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">${this._t("saved")}</div>
                            <div class="metric-value c-savings">${this._fmt(c,2)} ${p}</div>
                        </div>
                        <div class="metric">
                            <div class="metric-label">${this._t("monthly")}</div>
                            <div class="metric-value c-solar">${this._fmt(s,1)} kWh</div>
                        </div>
                    </div>

                </div>
            </ha-card>
        `}getCardSize(){return 4}static getStubConfig(){return{entity_prefix:Ot}}},{type:"eb-solar-summary-card",name:"SEM Solar Summary",description:"Lumina-styled solar overview with glow ring and production metrics"});const Bt="sensor.ebi_",Wt=["battery_soc","battery_power","battery_charge_power","battery_discharge_power","battery_status","battery_health_score","battery_cycles_estimated","battery_temperature","battery_session_type","battery_session_energy","battery_session_solar_share","battery_session_duration","battery_session_avg_power","battery_session_cost","battery_session_savings","daily_battery_charge_energy","daily_battery_discharge_energy","daily_battery_savings","flow_solar_to_battery_energy","flow_grid_to_battery_energy","monthly_battery_charge_energy","monthly_battery_discharge_energy"],jt=["#4db6ac","#FFB74D","#BA68C8","#64B5F6"];bt("eb-battery-card",class extends vt{constructor(){super(),this._batteries=[],this._lastStateCount=0}static get watchedEntities(){return Wt.map(t=>`${Bt}${t}`)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Bt}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;(e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0);const r=Object.keys(t.states).length;if(r!==this._lastStateCount){this._lastStateCount=r;const e=[];for(const i of Object.keys(t.states)){const t=i.match(new RegExp(`^sensor\\.${this._objPrefix()}battery_(b\\d+)_power$`));t&&e.push(t[1])}e.sort(),this._batteries=e}if(this._isFrozen()&&!s)return;const a=t?.states[`${this._prefix}battery_status`]?.state;if(("unavailable"===a||"unknown"===a)&&!s)return;let o=Wt.map(e=>t?.states[`${this._prefix}${e}`]?.state||"").join(",")+"|"+e;this._batteries.length?o+="|"+this._batteries.map(e=>{const i=[`battery_${e}_power`,`battery_${e}_soc`,`battery_${e}_status`,`battery_${e}_capacity_kwh`].map(e=>t?.states[`${this._prefix}${e}`]?.state||"").join(":"),s=[`select.${this._objPrefix()}battery_${e}_mode`,`number.${this._objPrefix()}battery_${e}_reserve_soc`].map(e=>t?.states[e]?.state||"").join(":");return i+":"+s}).join("|"):o+="|"+[`select.${this._objPrefix()}battery_mode`,`number.${this._objPrefix()}battery_reserve_soc`].map(e=>t?.states[e]?.state||"").join(":"),(o!==this._lastBattKey||s)&&(this._lastBattKey=o,this._scheduleUpdate())}get hass(){return this._hass}_val(t,e=0){return this._state(`${this._prefix}${t}`,e)}_valStr(t){return this._stateStr(`${this._prefix}${t}`)}_exists(t){const e=this._hass?.states?.[`${this._prefix}${t}`];return!!e&&"unavailable"!==e.state&&"unknown"!==e.state}_fmt(t,e=1){return null==t||isNaN(t)?"—":t.toFixed(e)}_fmtDuration(t){if(null==t||isNaN(t))return"—";const e=Math.round(t);if(e<90)return`${e} min`;const i=Math.floor(e/60),s=e-60*i;return 0===s?`${i} h`:`${i} h ${s} min`}_batteryName(t){const e=this._hass?.states[`${this._prefix}battery_${t}_power`];let i=t.toUpperCase();return e?.attributes?.friendly_name&&(i=e.attributes.friendly_name.replace(/^SEM\s+/i,"").replace(/\s+Power$/i,"")),i}_renderMiniSocRing(t,e){const i=null!=t?Math.max(0,Math.min(100,t)):0,s=2*Math.PI*22,r=s*(1-i/100);return j`
            <svg viewBox="0 0 56 56" width="56" height="56"
                 style="display:block;">
                <circle cx="28" cy="28" r="${22}" fill="none"
                        stroke="rgba(255,255,255,0.12)" stroke-width="4" />
                <circle cx="28" cy="28" r="${22}" fill="none"
                        stroke="${e}" stroke-width="4"
                        stroke-linecap="round"
                        stroke-dasharray="${s.toFixed(1)}"
                        stroke-dashoffset="${r.toFixed(1)}"
                        transform="rotate(-90 28 28)" />
                <text x="28" y="32" text-anchor="middle"
                      fill="${e}" font-size="13" font-weight="800"
                      font-family="'Segoe UI','Roboto',sans-serif"
                      style="paint-order:stroke;stroke:rgba(0,0,0,0.45);stroke-width:0.5px;">
                    ${null!=t?Math.round(i)+"%":"—"}
                </text>
            </svg>
        `}_renderBatteryGlyph(t,e,i){const s=null!=t?Math.max(0,Math.min(100,t)):0,r=Math.max(2,s/100*52),a=i?"socPulse 2s ease-in-out infinite":"none";return j`
            <svg viewBox="0 0 44 76" width="40" height="69">
                <rect x="14" y="0" width="16" height="5" rx="2" fill="rgba(255,255,255,0.15)"/>
                <rect x="6" y="4" width="32" height="60" rx="4"
                    fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
                <rect x="9" y="${(52-r+7).toFixed(1)}" width="26"
                    height="${r.toFixed(1)}" rx="2"
                    fill="${e}" opacity="0.78" style="animation:${a}"/>
                <text x="22" y="40" text-anchor="middle"
                    fill="white" font-size="13" font-weight="700"
                    font-family="'Segoe UI','Roboto',sans-serif" opacity="0.95">
                    ${null!=t?Math.round(s)+"%":"—"}
                </text>
            </svg>
        `}_fmtHours(t){if(null==t||!isFinite(t)||t<=0)return"—";if(t<1)return`${Math.round(60*t)} min`;const e=Math.floor(t),i=Math.round(60*(t-e));return 0===i?`${e} h`:`${e} h ${i} min`}_batteryEta(t,e,i){if(null==t||e<=0||Math.abs(i)<50)return null;if(i>50){const s=(100-t)/100*e;return{key:"until_full",text:this._fmtHours(s/(i/1e3))}}const s=t/100*e;return{key:"until_empty",text:this._fmtHours(s/(Math.abs(i)/1e3))}}_renderModeControls(t,e){const i=this._hass?.states[t];if(!i)return Y;const s=this._hass?.states[e],r=i.state,a=s&&("allow_arbitrage"===r||"force_discharge"===r),o=this._t("battery_mode_hint_"+r)||"";return j`
            <div class="battery-section-controls">
                <div class="bsc-row">
                    <span class="bsc-label">${this._t("mode")}</span>
                    <select class="bsc-select" .value=${r}
                            @click=${t=>t.stopPropagation()}
                            @change=${e=>this._selectOption(t,e.target.value)}>
                        ${(i.attributes.options||[]).map(t=>j`
                            <option value=${t} ?selected=${t===r}>
                                ${this._t("battery_mode_"+t)||t}
                            </option>`)}
                    </select>
                </div>
                ${o?j`
                    <div class="bsc-hint">
                        <ha-icon icon="mdi:information-outline"></ha-icon>
                        <span>${o}</span>
                    </div>
                `:Y}
                ${a?j`
                    <div class="bsc-row">
                        <span class="bsc-label">${this._t("reserve_soc")}</span>
                        <span class="bsc-stepper">
                            <button class="bsc-btn"
                                @click=${()=>this._stepNumber(e,-1)}>−</button>
                            <span class="bsc-stepval">${Math.round(parseFloat(s.state)||0)}%</span>
                            <button class="bsc-btn"
                                @click=${()=>this._stepNumber(e,1)}>+</button>
                        </span>
                    </div>
                `:Y}
            </div>
        `}_renderBatterySection(t,e){const i=jt[e%jt.length],s=this._val(`battery_${t}_power`,0),r=this._val(`battery_${t}_soc`,null),a=(this._valStr(`battery_${t}_status`)||"idle").toLowerCase(),o=this._val(`battery_${t}_capacity_kwh`,0),n=this._batteryName(t),l="selling"===a,c=!l&&("charging"===a||s>50),h=!l&&("discharging"===a||s<-50),d=c||h||l,p=l?"selling_to_grid":c?"charging":h?"discharging":"idle",u=l?"#FCD170":c?"#f06292":h?"#4db6ac":"#999",g=null!=r&&o>0?r/100*o:null,f=this._batteryEta(r,o,s);return j`
            <div class="battery-section">
                <div class="battery-section-header">
                    <div class="battery-dot" style="background:${i}"></div>
                    <span class="battery-section-name">${n}</span>
                    <span class="battery-section-status"
                          style="color:${u}">
                        ${this._t(p)}
                    </span>
                </div>
                <div class="battery-section-body">
                    <div class="battery-section-glyph">
                        ${this._renderBatteryGlyph(r,u,d)}
                        <span class="battery-section-soc-label">SOC</span>
                    </div>
                    <div class="battery-section-metrics">
                        <div class="bs-row">
                            <span class="bs-label">${this._t("power")}</span>
                            <span class="bs-val"
                                  style="color:${s>50||s<-50?u:""}">
                                ${pt(s)}
                            </span>
                        </div>
                        ${null!=g?j`
                            <div class="bs-row">
                                <span class="bs-label">${this._t("stored")}</span>
                                <span class="bs-val">${this._fmt(g,1)} kWh</span>
                            </div>
                        `:Y}
                        ${o>0?j`
                            <div class="bs-row">
                                <span class="bs-label">${this._t("capacity")}</span>
                                <span class="bs-val">${this._fmt(o,1)} kWh</span>
                            </div>
                        `:Y}
                        ${f?j`
                            <div class="bs-row">
                                <span class="bs-label">${this._t(f.key)}</span>
                                <span class="bs-val">${f.text}</span>
                            </div>
                        `:Y}
                    </div>
                </div>
                ${this._renderModeControls(`select.${this._objPrefix()}battery_${t}_mode`,`number.${this._objPrefix()}battery_${t}_reserve_soc`)}
            </div>
        `}render(){if(!this._hass||!this._config)return Y;const t=this._theme(),e=2*Math.PI*42,i=e.toFixed(1),s=this._val("battery_soc",0),r=this._val("battery_power",0),a=this._val("battery_charge_power",0),o=this._val("battery_discharge_power",0),n=(this._valStr("battery_status")||"").toLowerCase(),l=this._val("battery_health_score",0),c=this._val("battery_cycles_estimated",0),h=this._val("daily_battery_charge_energy",0),d=this._val("daily_battery_discharge_energy",0),p=this._val("daily_battery_savings",0),u=this._val("monthly_battery_charge_energy",0),g=this._val("monthly_battery_discharge_energy",0),f=this._val("flow_solar_to_battery_energy",0),_=ft(this._hass),m=this._hass?.states[`${this._prefix}battery_temperature`],y=m&&"unavailable"!==m.state&&"unknown"!==m.state?parseFloat(m.state):null,x="selling"===n,b=!x&&("charging"===n||a>10),v=!x&&("discharging"===n||o>10),w=this._hass?.states[`${this._prefix}tariff_current_export_rate`],$=w&&"unavailable"!==w.state&&"unknown"!==w.state?parseFloat(w.state):null,k="#FCD170",M=x?this._t("selling_to_grid"):b?this._t("charging"):v?this._t("discharging"):this._t("idle"),S=x?k:b?"#f06292":"#4db6ac",C=x?k:b?"#f06292":v?"#4db6ac":t.textSec||"#888",D=b||v||x?"0.5":"0.2",z=b||v||x?"socPulse 2s ease-in-out infinite":"none",E=Math.min(Math.max(s/100,0),1),P=(e*(1-E)).toFixed(1),T=h>0?Math.round(f/h*100):0,F=this._valStr("battery_session_type"),A="charge"===F||"discharge"===F,R="charge"===F,L=A?this._val("battery_session_energy",0):0,I=A?this._val("battery_session_duration",0):0,O=A?this._val("battery_session_avg_power",0):0,N=A?this._val("battery_session_solar_share",0):0,H=A?this._val("battery_session_cost",0):0,B=A?this._val("battery_session_savings",0):0,W=R?"#f06292":"#4db6ac";t.dotColor;const V=t.surface||"rgba(255,255,255,0.06)",U=t.surfaceBorder||"rgba(255,255,255,0.05)",G=t.surfaceHover||"rgba(255,255,255,0.12)",q=t.textSec||"#999",K=t.textTertiary||"#888";return j`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${_t(t,ht.battery)};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .glow-svg { position: absolute; width: 0; height: 0; }
                .hero { display: flex; align-items: center; gap: 20px; }
                @media (max-width: 400px) { .hero { flex-direction: column; gap: 12px; } }
                .battery-ring { position: relative; width: 100px; height: 100px; flex-shrink: 0; }
                .battery-ring svg { width: 100%; height: 100%; transform: rotate(-90deg); }
                .ring-bg { fill: none; stroke: rgba(77,182,172,0.12); stroke-width: 5; }
                .soc-arc {
                    fill: none; stroke-width: 5; stroke-linecap: round;
                    transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1);
                    filter: url(#batt-glow);
                }
                .glow-ring {
                    fill: none; stroke-width: 8; opacity: 0.2;
                    filter: url(#batt-glow-soft);
                    animation: glowPulse 3s ease-in-out infinite;
                }
                @keyframes glowPulse { 0%,100% { opacity: 0.2; } 50% { opacity: 0.08; } }
                @keyframes socPulse  { 0%,100% { opacity: 1; }   50% { opacity: 0.6; } }
                .ring-center {
                    position: absolute; top: 50%; left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center; pointer-events: none;
                }
                .battery-icon { display: block; margin: 0 auto 1px; }
                .soc-value {
                    font-size: 14px; font-weight: 700;
                    font-variant-numeric: tabular-nums;
                    text-shadow: 0 0 8px rgba(77,182,172,0.3); line-height: 1;
                }
                .metrics-col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; }
                .metric-row {
                    display: flex; justify-content: space-between; align-items: baseline; padding: 2px 0; gap: 8px;
                }
                .metric-label { font-size: 12px; color: var(--secondary-text-color, ${q}); font-weight: 500; }
                .metric-val { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; color: #4db6ac; }
                .chips { display: flex; gap: 8px; margin-top: 14px; flex-wrap: wrap; }
                .chip {
                    flex: 1; min-width: 80px;
                    background: var(--secondary-background-color, ${V});
                    border: 1px solid var(--divider-color, ${U});
                    border-radius: 10px; padding: 8px 10px; text-align: center;
                    transition: border-color 0.3s cubic-bezier(0.4,0,0.2,1);
                }
                .chip:hover { border-color: var(--divider-color, ${G}); }
                .chip-label {
                    font-size: 11px; color: var(--secondary-text-color, ${K});
                    font-weight: 500; letter-spacing: 0.3px; margin-bottom: 3px;
                }
                .chip-value { font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums; }
                .c-charge { color: #f06292; }
                .c-discharge { color: #4db6ac; }
                .c-savings { color: #8DC892; }
                .chip-src { font-size: 10px; color: var(--secondary-text-color, ${K}); margin-top: 1px; }
                .session-section {
                    margin-top: 14px; padding: 10px 12px;
                    background: var(--secondary-background-color, ${V});
                    border: 1px solid var(--divider-color, ${U});
                    border-radius: 10px;
                }
                .sess-header { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; }
                .sess-title {
                    font-size: 12px; font-weight: 600;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .sess-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
                .sess-item-label { font-size: 11px; color: var(--secondary-text-color, ${K}); }
                .sess-item-value {
                    font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .monthly-section { display: flex; gap: 8px; margin-top: 10px; }

                /* ── Per-battery sections (Phase B). Same structural
                       shape as the EV card's per-charger sections so
                       a user who already knows the EV tab reads the
                       battery tab without re-learning the layout. ── */
                .battery-sections {
                    margin-top: 16px;
                    display: flex; flex-direction: column;
                    gap: 12px;
                }
                .battery-section {
                    background: ${V};
                    border: 1px solid ${U};
                    border-radius: 12px;
                    padding: 12px 14px;
                }
                .battery-section-header {
                    display: flex; align-items: center; gap: 8px;
                    margin-bottom: 10px;
                }
                .battery-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .battery-section-name {
                    flex: 1; font-weight: 600; font-size: 0.95em;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .battery-section-status {
                    font-size: 0.8em; font-weight: 500;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .battery-section-body {
                    display: flex; align-items: center; gap: 12px;
                }
                .battery-section-ring {
                    flex-shrink: 0; width: 56px; text-align: center;
                }
                .battery-section-glyph {
                    flex-shrink: 0; width: 44px; text-align: center;
                }
                .battery-section-soc-label {
                    display: block;
                    font-size: 10px; color: ${q};
                    margin-top: 2px;
                    text-transform: uppercase; letter-spacing: 0.05em;
                }
                .battery-section-metrics {
                    flex: 1;
                    display: flex; flex-direction: column; gap: 2px;
                }
                .bs-row {
                    display: flex; justify-content: space-between; align-items: baseline;
                    padding: 2px 0;
                }
                .bs-label {
                    font-size: 11px; color: ${q};
                    font-weight: 500;
                }
                .bs-val {
                    font-size: 12px; font-weight: 600;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                    font-variant-numeric: tabular-nums;
                }
                /* Per-battery controls (#523) — mode select + reserve stepper */
                .battery-section-controls {
                    margin-top: 10px; padding-top: 10px;
                    border-top: 1px solid ${U};
                    display: flex; flex-direction: column; gap: 8px;
                }
                .bsc-row {
                    display: flex; align-items: center; justify-content: space-between;
                    gap: 8px;
                }
                .bsc-hint {
                    display: flex; align-items: flex-start; gap: 5px;
                    font-size: 11px; line-height: 1.35;
                    color: ${q};
                    margin: -2px 0 1px 0;
                    opacity: 0.92;
                }
                .bsc-hint ha-icon {
                    --mdc-icon-size: 13px;
                    flex: 0 0 auto; margin-top: 1px; opacity: 0.8;
                }
                .bsc-label {
                    font-size: 12px; color: ${q}; font-weight: 500;
                }
                .bsc-select {
                    background: ${V};
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                    border: 1px solid ${U};
                    border-radius: 8px; padding: 5px 8px; font-size: 12px;
                    font-weight: 600; cursor: pointer; min-width: 150px;
                }
                .bsc-stepper { display: flex; align-items: center; gap: 8px; }
                .bsc-btn {
                    width: 24px; height: 24px; border-radius: 6px;
                    background: ${V}; border: 1px solid ${U};
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                    font-size: 15px; font-weight: 700; cursor: pointer; line-height: 1;
                }
                .bsc-btn:hover { border-color: ${G}; }
                .bsc-stepval {
                    min-width: 38px; text-align: center; font-size: 13px;
                    font-weight: 700; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                /* Phase B mobile breakpoint — single column from the
                   ring + metrics layout collapses to stacked at
                   < 480 px (mirrors the eb-solar-card pattern). */
                @media (max-width: 480px) {
                    .battery-section-body {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .battery-section-ring { margin: 0 auto; }
                    .battery-section-glyph { margin: 0 auto; }
                }
                .month-chip {
                    flex: 1; text-align: center; padding: 6px 8px;
                    background: var(--secondary-background-color, ${V});
                    border: 1px solid var(--divider-color, ${U});
                    border-radius: 8px;
                }
            </style>

            <svg class="glow-svg">
                <defs>
                    <filter id="batt-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feFlood flood-color="${S}" flood-opacity="0.25" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="batt-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
            </svg>

            <ha-card>
                <div class="wrap">
                    <div class="hero">
                        <div class="battery-ring">
                            <svg viewBox="0 0 100 100">
                                <circle class="glow-ring" cx="50" cy="50" r="42"
                                    style="stroke:${S};opacity:${D}"/>
                                <circle class="ring-bg" cx="50" cy="50" r="42"/>
                                <circle class="soc-arc" cx="50" cy="50" r="42"
                                    stroke-dasharray="${i}"
                                    style="stroke-dashoffset:${P};stroke:${S};animation:${z}"/>
                            </svg>
                            <div class="ring-center">
                                <!-- #523/#524 follow-up: filled SOC-level
                                     battery glyph matching the system card
                                     (was a flat outline). Fills bottom-up to
                                     SOC, tints with the arc colour, and shows a
                                     charging bolt. -->
                                <svg class="battery-icon" width="18" height="26" viewBox="0 0 20 30">
                                    <rect x="6" y="0" width="8" height="4" rx="1.5"
                                        fill="${S}" opacity="0.7"/>
                                    <rect x="2" y="4" width="16" height="26" rx="3"
                                        fill="rgba(0,0,0,0.30)" stroke="${S}"
                                        stroke-width="1.6" opacity="0.9"/>
                                    <rect x="4" y="${(28-22*E).toFixed(1)}" width="12"
                                        height="${(22*E).toFixed(1)}" rx="1.5"
                                        fill="${S}" opacity="0.55"/>
                                    <path d="M11,9.5 L6.5,18.5 L9.5,18.5 L8.5,24.5 L13.5,15 L10.5,15 Z"
                                        fill="#FCD170" opacity="${b?.95:0}"/>
                                </svg>
                                <div class="soc-value" style="color:${S}">
                                    ${s.toFixed(0)}%
                                </div>
                            </div>
                        </div>

                        <div class="metrics-col">
                            <div class="metric-row">
                                <span class="metric-label">${this._t("soc")}</span>
                                <span class="metric-val">${this._fmt(s,1)}%</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("power")}</span>
                                <span class="metric-val">${pt(r)}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("status")}</span>
                                <span class="metric-val" style="color:${C}">${M}</span>
                            </div>
                            ${x&&null!=$?j`
                            <div class="metric-row">
                                <span class="metric-label">${this._t("export_rate")}</span>
                                <span class="metric-val" style="color:${k}">${this._fmt($,3)} ${_}/kWh</span>
                            </div>
                            `:Y}
                            ${this._exists("battery_health_score")?j`
                            <div class="metric-row">
                                <span class="metric-label">${this._t("health")}</span>
                                <span class="metric-val">${this._fmt(l,1)}%</span>
                            </div>
                            `:Y}
                            ${this._exists("battery_cycles_estimated")?j`
                            <div class="metric-row">
                                <span class="metric-label">${this._t("cycles")}</span>
                                <span class="metric-val">${this._fmt(c,1)}</span>
                            </div>
                            `:Y}
                            ${this._batteries.length>1?"":j`
                                <div class="metric-row">
                                    <span class="metric-label">${this._t("temperature")}</span>
                                    <span class="metric-val">
                                        ${null!=y?`${this._fmt(y,1)} °C`:"—"}
                                    </span>
                                </div>
                            `}
                            <!-- #404: On multi-battery installs (length > 1)
                                 the fleet-tile temperature is hidden because
                                 each battery has its own temperature shown in
                                 its per-battery section. Per RienduPre's UX
                                 confirmation 2026-06-04. Single-battery
                                 installs (today's PROD majority) unchanged. -->
                        </div>
                    </div>

                    ${this._batteries.length>=1?j`
                        <div class="battery-sections">
                            ${this._batteries.map((t,e)=>this._renderBatterySection(t,e))}
                        </div>
                    `:j`
                        <!-- Single-battery install (#523): global mode control
                             on the hero, no per-battery section. -->
                        ${this._renderModeControls(`select.${this._objPrefix()}battery_mode`,`number.${this._objPrefix()}battery_reserve_soc`)}
                    `}

                    <div class="session-section">
                        <div class="sess-header">
                            <ha-icon icon="mdi:battery-sync"
                                style="--mdc-icon-size:14px;color:${A?W:t.textSec}">
                            </ha-icon>
                            <span class="sess-title" style="color:${A?W:t.textSec}">
                                ${this._t("current_session")}
                            </span>
                        </div>
                        ${A?j`
                        <div class="sess-grid">
                            <div>
                                <div class="sess-item-label">${this._t("energy")}</div>
                                <div class="sess-item-value">${this._fmt(L,2)} kWh</div>
                            </div>
                            <div>
                                <div class="sess-item-label">${this._t("duration")}</div>
                                <div class="sess-item-value">${this._fmtDuration(I)}</div>
                            </div>
                            <div>
                                <div class="sess-item-label">${this._t("avg_power")}</div>
                                <div class="sess-item-value">${pt(O)}</div>
                            </div>
                            <div>
                                <div class="sess-item-label">${this._t("source")}</div>
                                <div class="sess-item-value">
                                    ${R?`${this._t("solar")}: ${this._fmt(N,0)}%`:""}
                                </div>
                            </div>
                            <div>
                                <div class="sess-item-label">${this._t("cost")}</div>
                                <div class="sess-item-value">
                                    ${R?`${this._fmt(H,2)} ${_}`:`${this._t("saved")} ${this._fmt(B,2)} ${_}`}
                                </div>
                            </div>
                        </div>
                        `:j``}
                    </div>

                    <div class="chips">
                        <div class="chip">
                            <div class="chip-label">${this._t("charge_today")}</div>
                            <div class="chip-value c-charge">${this._fmt(h,2)} kWh</div>
                            <div class="chip-src">
                                ${T>0?`${T}% ${this._t("solar")}`:""}
                            </div>
                        </div>
                        <div class="chip">
                            <div class="chip-label">${this._t("discharge_today")}</div>
                            <div class="chip-value c-discharge">${this._fmt(d,2)} kWh</div>
                        </div>
                        <div class="chip">
                            <div class="chip-label">${this._t("savings_today")}</div>
                            <div class="chip-value c-savings">
                                ${this._fmt(p,2)} ${_}
                            </div>
                        </div>
                    </div>

                    <div class="monthly-section">
                        <div class="month-chip">
                            <div class="chip-label">
                                ${this._t("monthly")} ${this._t("charge")}
                            </div>
                            <div class="chip-value c-charge">${this._fmt(u,1)} kWh</div>
                        </div>
                        <div class="month-chip">
                            <div class="chip-label">
                                ${this._t("monthly")} ${this._t("discharge")}
                            </div>
                            <div class="chip-value c-discharge">${this._fmt(g,1)} kWh</div>
                        </div>
                    </div>
                </div>
            </ha-card>
        `}getCardSize(){return 3}static getStubConfig(){return{}}},{type:"eb-battery-card",name:"SEM Battery",description:"Lumina-styled battery hero card with SOC arc ring and key metrics"});const Vt="sensor.ebi_",Ut=["grid_power","grid_import_power","grid_export_power","grid_status","daily_grid_import_energy","daily_grid_export_energy","monthly_grid_import_energy","monthly_grid_export_energy","consecutive_peak_15min","monthly_consecutive_peak","current_vs_peak_percentage","target_peak_limit","peak_margin","peak_trend","load_management_status","loads_currently_shed","available_load_reduction","controllable_devices_count","tariff_current_import_rate","tariff_current_export_rate","tariff_price_level","tariff_today_min_price","tariff_today_max_price","surplus_total_w","surplus_unallocated_w","surplus_active_devices","surplus_total_devices"];bt("eb-grid-card",class extends vt{static get watchedEntities(){return Ut.map(t=>`${Vt}${t}`)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Vt}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=Ut.map(e=>t?.states[`${this._prefix}${e}`]?.state||"").join(",")+"|"+e;(r!==this._lastGridKey||s)&&(this._lastGridKey=r,this._scheduleUpdate())}get hass(){return this._hass}_val(t,e=0){return this._state(`${this._prefix}${t}`,e)}_valStr(t){return this._stateStr(`${this._prefix}${t}`)}_fmt(t,e=1){return null==t||isNaN(t)?"—":t.toFixed(e)}_peakColor(t){return t>=90?"#f06292":t>=70?"#ff9800":"#8DC892"}_priceLevelColor(t){return"high"===t?"#f06292":"low"===t?"#8DC892":"—"!==t?"#ff9800":"#888"}_metricRow(t,e){return j`
            <div class="metric-row">
                <span class="metric-label">${this._t(t)}</span>
                <span class="metric-val">${e}</span>
            </div>
        `}render(){if(!this._hass||!this._config)return Y;const t=this._theme(),e=ft(this._hass),i=this._val("grid_import_power"),s=this._val("grid_export_power"),r=s>i&&s>10,a=i>10,o=r?"mdi:transmission-tower-export":"mdi:transmission-tower-import",n=r?"#8353d1":"#488fc2",l=a||r?"0.45":"0.1",c=this._valStr("grid_status"),h=""!==c&&"—"!==c?this._t(c.toLowerCase()):r?this._t("exporting"):a?this._t("importing"):this._t("idle"),d=r?"#8353d1":a?"#488fc2":"#888",p=this._val("daily_grid_import_energy"),u=this._val("daily_grid_export_energy"),g=p-u,f=g<=0?"#8353d1":"#488fc2",_=this._val("current_vs_peak_percentage"),m=this._val("consecutive_peak_15min"),y=this._val("monthly_consecutive_peak"),x=this._val("target_peak_limit"),b=this._val("peak_margin"),v=this._valStr("peak_trend"),w=this._peakColor(_),$=b>0?"#8DC892":"#f06292",k=(200*Math.min(Math.max(_/100,0),1)).toFixed(1),M=this._valStr("load_management_status"),S=this._val("loads_currently_shed"),C=this._val("available_load_reduction"),D=this._val("controllable_devices_count"),z=this._val("tariff_current_import_rate"),E=this._val("tariff_current_export_rate"),P=this._valStr("tariff_price_level"),T=this._val("tariff_today_min_price"),F=this._val("tariff_today_max_price"),A=this._priceLevelColor(P),R=this._val("surplus_total_w"),L=this._val("surplus_unallocated_w"),I=Math.max(0,R-L),O=this._val("surplus_active_devices"),N=this._val("surplus_total_devices");t.dotColor;const H=t.textSec||"#999",B=t.surface||"rgba(255,255,255,0.06)",W=t.surfaceBorder||"rgba(255,255,255,0.12)";return j`
            <style>
                :host { display: block; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${_t(t,ht.inverter)};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .glow-svg { position: absolute; width: 0; height: 0; }
                .hero { display: flex; align-items: center; gap: 16px; padding-bottom: 8px; }
                @media (max-width: 400px) { .hero { flex-direction: column; gap: 10px; } }
                .grid-icon-area { position: relative; width: 80px; height: 80px; flex-shrink: 0; }
                .grid-icon-area svg { width: 100%; height: 100%; }
                .grid-glow-ring {
                    fill: none; stroke-width: 6;
                    filter: url(#grid-glow-soft);
                    transition: stroke 0.4s ease, opacity 0.4s ease;
                }
                .ring-bg { fill: none; stroke: rgba(72,143,194,0.12); stroke-width: 3; }
                .ring-fill { fill: rgba(72,143,194,0.06); }
                .hero-info { flex: 1; min-width: 0; }
                .hero-power-row { display: flex; gap: 14px; margin-bottom: 4px; flex-wrap: wrap; }
                .hero-pw { display: flex; flex-direction: column; }
                .hero-pw-label {
                    font-size: 12px; text-transform: uppercase; letter-spacing: 0.4px;
                    color: var(--secondary-text-color, ${H}); margin-bottom: 1px;
                }
                .hero-pw-val { font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; }
                .hero-pw-val.import { color: #488fc2; }
                .hero-pw-val.export { color: #8353d1; }
                .hero-status {
                    font-size: 12px; font-weight: 500;
                    text-transform: uppercase; letter-spacing: 0.5px;
                }
                .section {
                    margin-top: 10px; padding: 10px 12px;
                    background: var(--secondary-background-color, ${B});
                    border: 1px solid var(--divider-color, ${W});
                    border-radius: 10px;
                }
                .section-title {
                    font-size: 12px; font-weight: 600; text-transform: uppercase;
                    letter-spacing: 0.6px; margin-bottom: 6px;
                }
                .metric-row {
                    display: flex; justify-content: space-between; align-items: baseline; padding: 2px 0;
                }
                .metric-label {
                    font-size: 12px; color: var(--secondary-text-color, ${H}); font-weight: 500;
                }
                .metric-val {
                    font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .net-row {
                    margin-top: 4px; padding-top: 4px;
                    border-top: 1px solid var(--divider-color, ${W});
                }
                .peak-bar-wrap { margin: 6px 0 4px; position: relative; }
                .peak-bar-bg { width: 100%; height: 8px; fill: rgba(72,143,194,0.12); }
                .peak-bar-fill {
                    height: 8px;
                    transition: width 0.8s cubic-bezier(0.4,0,0.2,1), fill 0.4s ease;
                }
                .peak-bar-svg { width: 100%; height: 8px; display: block; }
                .peak-pct-label {
                    font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums;
                    margin-top: 2px; text-align: right;
                }
                .c-import { color: #488fc2; }
                .c-export { color: #8353d1; }
                .c-green  { color: #8DC892; }
                .c-solar  { color: #ff9800; }
            </style>

            <svg class="glow-svg">
                <defs>
                    <filter id="grid-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="blur"/>
                        <feFlood flood-color="#488fc2" flood-opacity="0.3" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="grid-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
            </svg>

            <ha-card>
                <div class="wrap">
                    <!-- Hero -->
                    <div class="hero">
                        <div class="grid-icon-area">
                            <svg viewBox="0 0 80 80">
                                <circle class="grid-glow-ring" cx="40" cy="40" r="34"
                                    style="stroke:${n};opacity:${l}"/>
                                <circle class="ring-bg" cx="40" cy="40" r="34"/>
                                <circle class="ring-fill" cx="40" cy="40" r="31"/>
                                <foreignObject x="14" y="14" width="52" height="52">
                                    <div xmlns="http://www.w3.org/1999/xhtml"
                                        style="width:52px;height:52px;display:flex;align-items:center;justify-content:center">
                                        <ha-icon icon="${o}"
                                            style="--mdc-icon-size:28px;color:${n}">
                                        </ha-icon>
                                    </div>
                                </foreignObject>
                            </svg>
                        </div>

                        <div class="hero-info">
                            <div class="hero-power-row">
                                <div class="hero-pw">
                                    <span class="hero-pw-label">${this._t("import")}</span>
                                    <span class="hero-pw-val import">
                                        ${a?pt(i):"—"}
                                    </span>
                                </div>
                                <div class="hero-pw">
                                    <span class="hero-pw-label">${this._t("export")}</span>
                                    <span class="hero-pw-val export">
                                        ${r?pt(s):"—"}
                                    </span>
                                </div>
                            </div>
                            <div class="hero-status" style="color:${d}">${h}</div>
                        </div>
                    </div>

                    <!-- Today -->
                    <div class="section">
                        <div class="section-title" style="color:#488fc2">${this._t("today")}</div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("import")}</span>
                            <span class="metric-val c-import">${this._fmt(p,2)} kWh</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("export")}</span>
                            <span class="metric-val c-export">${this._fmt(u,2)} kWh</span>
                        </div>
                        <div class="metric-row net-row">
                            <span class="metric-label"><strong>${this._t("net")}</strong></span>
                            <span class="metric-val" style="color:${f}">
                                ${this._fmt(Math.abs(g),2)} kWh
                            </span>
                        </div>
                    </div>

                    <!-- Peak Management -->
                    <div class="section">
                        <div class="section-title" style="color:#488fc2">${this._t("peak_management")}</div>
                        <div class="peak-bar-wrap">
                            <svg class="peak-bar-svg" viewBox="0 0 200 8" preserveAspectRatio="none">
                                <rect class="peak-bar-bg" x="0" y="0" width="200" height="8" rx="4" ry="4"/>
                                <rect class="peak-bar-fill" x="0" y="0"
                                    width="${k}" height="8" rx="4" ry="4"
                                    fill="${w}"/>
                            </svg>
                        </div>
                        <div class="peak-pct-label" style="color:${w}">
                            ${this._fmt(_,0)}%
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("peak_15min")}</span>
                            <span class="metric-val">${pt(m)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("monthly_peak")}</span>
                            <span class="metric-val">${pt(y)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("peak_limit")}</span>
                            <span class="metric-val">${pt(x)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("peak_margin")}</span>
                            <span class="metric-val" style="color:${$}">
                                ${pt(b)}
                            </span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("trend")}</span>
                            <span class="metric-val">${v?this._t(v):"—"}</span>
                        </div>
                    </div>

                    <!-- Load Control -->
                    <div class="section">
                        <div class="section-title" style="color:#488fc2">${this._t("load_control")}</div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("status")}</span>
                            <span class="metric-val">${M?this._t(M):"—"}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("loads_shed")}</span>
                            <span class="metric-val">${this._fmt(S,0)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("available_reduction")}</span>
                            <span class="metric-val">${pt(C)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("controllable_devices")}</span>
                            <span class="metric-val">${this._fmt(D,0)}</span>
                        </div>
                    </div>

                    <!-- Tariff -->
                    <div class="section">
                        <div class="section-title" style="color:#488fc2">${this._t("tariff")}</div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("import_rate")}</span>
                            <span class="metric-val c-import">
                                ${0!==z?`${this._fmt(z,4)} ${e}/kWh`:"—"}
                            </span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("export_rate")}</span>
                            <span class="metric-val c-export">
                                ${0!==E?`${this._fmt(E,4)} ${e}/kWh`:"—"}
                            </span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("price_level")}</span>
                            <span class="metric-val" style="color:${A}">
                                ${P?this._t(P):"—"}
                            </span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("today_min")}</span>
                            <span class="metric-val c-green">
                                ${0!==T?this._fmt(T,4):"—"}
                            </span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("today_max")}</span>
                            <span class="metric-val c-solar">
                                ${0!==F?this._fmt(F,4):"—"}
                            </span>
                        </div>
                    </div>

                    <!-- Surplus -->
                    <div class="section">
                        <div class="section-title" style="color:#488fc2">${this._t("surplus")}</div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("total_surplus")}</span>
                            <span class="metric-val c-solar">${pt(R)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("allocated")}</span>
                            <span class="metric-val">${pt(I)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("unallocated")}</span>
                            <span class="metric-val c-green">${pt(L)}</span>
                        </div>
                        <div class="metric-row">
                            <span class="metric-label">${this._t("active_devices")}</span>
                            <span class="metric-val">
                                ${Math.round(O)} / ${Math.round(N)}
                            </span>
                        </div>
                    </div>
                </div>
            </ha-card>
        `}getCardSize(){return 5}static getStubConfig(){return{entity_prefix:Vt}}},{type:"eb-grid-card",name:"SEM Grid",description:"Consolidated grid card with import/export, peak management, load control, tariff, and surplus"});const Yt="sensor.ebi_",Gt=20;function qt(t){return 36+556*t}function Kt(t){if(!t||"string"!=typeof t)return null;const e=t.match(/^(\d{1,2}):(\d{2})$/);if(!e)return null;const i=parseInt(e[1],10),s=parseInt(e[2],10);return i>24||s>59?null:(i+s/60)/24}function Xt(t){if(!Array.isArray(t))return[];const e=[];let i=-1;for(let s=0;s<24;s++)t[s]&&-1===i?i=s:t[s]||-1===i||(e.push({start:i/24,end:s/24}),i=-1);return-1!==i&&e.push({start:i/24,end:1}),e}bt("eb-schedule-card",class extends vt{static get watchedEntities(){return[`${Yt}tariff_current_import_rate`,`${Yt}tariff_price_level`,`${Yt}night_start_time`,`${Yt}night_end_time`,`${Yt}best_surplus_window`,`${Yt}predicted_surplus_window`,`${Yt}ev_power`,`${Yt}charging_state`,`${Yt}surplus_total_w`]}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Yt}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=["tariff_current_import_rate","tariff_price_level","night_start_time","night_end_time","best_surplus_window","predicted_surplus_window","ev_power","charging_state"].map(e=>{const i=t?.states[`${this._prefix}${e}`];return(i?.state||"")+JSON.stringify(i?.attributes?.schedule_today||"")+JSON.stringify(i?.attributes?.tariff_schedule_today||"")+JSON.stringify(i?.attributes?.schedule_surplus_hours||"")+JSON.stringify(i?.attributes?.schedule_ev_hours||"")}),a=r.join("|")+"|"+e;(a!==this._lastSchedKey||s)&&(this._lastSchedKey=a,this._scheduleUpdate())}get hass(){return this._hass}_stateObj(t){return this._hass?.states[`${this._prefix}${t}`]||null}_getTariffSchedule(){const t=this._stateObj("tariff_current_import_rate")||this._stateObj("tariff_price_level"),e=t?.attributes?.schedule_today||t?.attributes?.tariff_schedule_today;if(Array.isArray(e)&&e.length>0)return e.map(t=>({start:Kt(t.start)??0,end:Kt(t.end)??1,level:t.level||("NT"===(t.tariff||t.type||"HT").toUpperCase()?"cheap":"normal"),type:(t.tariff||t.type||"HT").toUpperCase(),avgPrice:t.avg_price}));const i=this._stateObj("tariff_price_level")?.state,s=new Set(["cheap","very_cheap","normal","expensive","very_expensive"]);return i&&s.has(i)?[{start:0,end:1,level:i,type:"cheap"===i||"very_cheap"===i?"NT":"HT",isFallback:!0}]:[{start:0,end:1,level:"normal",type:"HT",isFallback:!0}]}_getNightWindow(){const t=Kt(this._stateObj("night_start_time")?.state),e=Kt(this._stateObj("night_end_time")?.state);return null==t||null==e?null:{start:t,end:e}}_getPredictedSurplusWindow(){for(const t of["predicted_surplus_window","best_surplus_window"]){const e=this._stateObj(t)?.state;if(!e||"unknown"===e||"unavailable"===e)continue;if(e.toLowerCase().startsWith("tomorrow"))continue;const i=e.split(/[-–]/);if(2!==i.length)continue;const s=Kt(i[0].trim()),r=Kt(i[1].trim());if(null!=s&&null!=r)return{start:s,end:r}}return null}_getSurplusBlocks(){const t=this._hass?.states[`${this._prefix}surplus_total_w`];return Xt(t?.attributes?.schedule_surplus_hours)}_getEvBlocks(){const t=this._hass?.states[`${this._prefix}surplus_total_w`];return Xt(t?.attributes?.schedule_ev_hours)}_getEvPlanWindow(){const t=this._stateObj("charging_state"),e=t?.attributes?.today_plan;if(!Array.isArray(e))return null;const i=new Date;i.setHours(0,0,0,0);const s=i.getTime()+864e5,r=t=>{const e=new Date(t).getTime();return e<i.getTime()||e>=s?null:(e-i.getTime())/864e5};let a,o,n,l;for(const t of e)"ev_charge_start"===t.kind?a=r(t.when):"ev_min_reached"===t.kind?(o=r(t.when),l=t.values?.kwh):"ev_deadline"===t.kind&&(n=r(t.when));const c=o??n;return null==a&&null==c&&null==n?null:{plan:null!=a&&null!=c&&c>a?[{start:a,end:c,kwh:l}]:[],deadlineFrac:n,minReachedFrac:o}}_getSolarIntensity(){const t=this._stateObj("forecast_peak_time_today")?.state||this._stateObj("peak_time_today")?.state,e=parseFloat(this._stateObj("forecast_today_kwh")?.state||this._stateObj("forecast_today")?.state);if(!t||isNaN(e)||e<.5)return null;const i=Kt(t.slice(0,5));if(null==i)return null;const s=new Array(24).fill(0);for(let t=0;t<24;t++){const e=t/24-i,r=Math.exp(-e*e/(.26*.13));s[t]=r}const r=Math.max(...s);return s.map(t=>t/r)}_isEvCharging(){const t=parseFloat(this._stateObj("ev_power")?.state);if(!isNaN(t)&&t>10)return!0;const e=this._stateObj("charging_state")?.state;return e&&"charging"===e.toLowerCase()}_getNowBadges(){const t=this._stateObj("tariff_price_level")?.state,e=["cheap","normal","expensive","very_cheap","very_expensive"].includes(t)?t:null,i="active"===this._stateObj("night_charging_status")?.state,s=parseFloat(this._stateObj("solar_power")?.state),r=!isNaN(s)&&s>50?`${(s/1e3).toFixed(1)} kW`:null,a=this._isEvCharging(),o=this._getEvPlanWindow();return{tariff:e,night:i?"now":null,surplus:r,ev:a?"charging":o?.plan?.length?"planned":null}}_buildSvgContent(t){const e=ht,i=t.textSec||"#888",s=t.textTertiary||"#777",r=t.surface||"rgba(255,255,255,0.03)";let a="";for(let t=0;t<=24;t+=2){const e=qt(t/24);a+=`<text x="${e}" y="12" text-anchor="middle" fill="${i}"\n                font-size="10" font-family="'Segoe UI','Roboto',sans-serif"\n                font-variant-numeric="tabular-nums">${t.toString().padStart(2,"0")}</text>`}[this._t("tariff"),this._t("night"),this._t("surplus"),this._t("ev")].forEach((t,e)=>{a+=`<text x="32" y="${Gt+22*e+9+3.5}" text-anchor="end" fill="${s}"\n                font-size="10" font-family="'Segoe UI','Roboto',sans-serif">${t}</text>`});for(let t=0;t<4;t++){a+=`<rect x="36" y="${Gt+22*t}" width="556" height="18" rx="3" fill="${r}"/>`}const o={cheap:{fill:"#66bb6a",opacity:.62},normal:{fill:e.solar,opacity:.55},expensive:{fill:"#e91e63",opacity:.9}},n={cheap:"cheap",normal:"normal",expensive:"expensive"};for(const t of this._getTariffSchedule()){const e=qt(t.start),i=qt(t.end)-e,s=o[t.level]||o.normal,r=!0===t.isFallback,l=r?.35*s.opacity:s.opacity,c=r?` stroke="${s.fill}" stroke-width="1" stroke-opacity="0.6" stroke-dasharray="3,2"`:"",h=r?`${t.level} (no per-hour data — showing current level)`:null!=t.avgPrice?`${t.level} · avg ${t.avgPrice.toFixed(2)}`:t.level;if(a+=`<rect x="${e}" y="20" width="${i}" height="18"\n                rx="3" fill="${s.fill}" opacity="${l}"${c}>\n                <title>${h}</title></rect>`,i>30){const s=t.level&&n[t.level]?n[t.level]:t.type.toLowerCase();a+=`<text x="${e+i/2}" y="32.5" text-anchor="middle"\n                    fill="rgba(255,255,255,0.92)" font-size="9" font-weight="600"\n                    font-family="'Segoe UI','Roboto',sans-serif">${this._t(s)}</text>`}}const l=this._getNightWindow();if(l){const t=t=>{const e=Math.round(24*t*60);return`${String(Math.floor(e/60)).padStart(2,"0")}:${String(e%60).padStart(2,"0")}`},e=`${this._t("night")} ${t(l.start)}–${t(l.end)}`;if(l.start>l.end){const t=qt(l.start);a+=`<rect x="${t}" y="42" width="${qt(1)-t}"\n                    height="18" rx="3" fill="#42a5f5" opacity="0.55"><title>${e}</title></rect>`,a+=`<rect x="${qt(0)}" y="42"\n                    width="${qt(l.end)-qt(0)}" height="18"\n                    rx="3" fill="#42a5f5" opacity="0.55"><title>${e}</title></rect>`}else{const t=qt(l.start),i=qt(l.end)-t;a+=`<rect x="${t}" y="42" width="${i}" height="18"\n                    rx="3" fill="#42a5f5" opacity="0.55"><title>${e}</title></rect>`}}const c=this._getSolarIntensity(),h=parseFloat(this._stateObj("forecast_today_kwh")?.state||NaN);if(c){const t=isNaN(h)?this._t("surplus"):`${this._t("surplus")} · forecast ${h.toFixed(1)} kWh`;for(let e=0;e<24;e++){const i=c[e];if(i<.08)continue;const s=qt(e/24),r=qt(1/24);a+=`<rect x="${s}" y="64" width="${r}" height="18"\n                    fill="#fdd835" opacity="${(.55*i).toFixed(2)}"><title>${t}</title></rect>`}}const d=this._getPredictedSurplusWindow();if(d){const t=qt(d.start),e=Math.max(0,qt(d.end)-t);a+=`<rect x="${t}" y="64" width="${e}" height="18"\n                rx="3" fill="none" stroke="#fdd835" stroke-width="1"\n                stroke-opacity="0.5" stroke-dasharray="2,2"/>`}for(const t of this._getSurplusBlocks()){const e=qt(t.start),i=Math.max(0,qt(t.end)-e);a+=`<rect x="${e}" y="64" width="${i}" height="18"\n                rx="3" fill="#fdd835" opacity="0.62"/>`}const p=this._getEvPlanWindow();if(p?.plan?.length)for(const t of p.plan){const i=qt(t.start),s=Math.max(0,qt(t.end)-i),r=t.kwh?`${this._t("plan_ev_charge_start")} → ${this._t("plan_ev_min_reached").replace("{kwh}",t.kwh)}`:this._t("plan_ev_charge_start");a+=`<rect x="${i}" y="86" width="${s}" height="18"\n                    rx="3" fill="${e.ev}" opacity="0.30"\n                    stroke="${e.ev}" stroke-width="0.6" stroke-opacity="0.6"\n                    stroke-dasharray="3,2"><title>${r}</title></rect>`}for(const t of this._getEvBlocks()){const i=qt(t.start),s=Math.max(0,qt(t.end)-i);a+=`<rect x="${i}" y="86" width="${s}" height="18"\n                rx="3" fill="${e.ev}" opacity="0.55"/>`}if(null!=p?.deadlineFrac){const t=qt(p.deadlineFrac);a+=`<line x1="${t}" y1="84" x2="${t}" y2="106"\n                stroke="#f06292" stroke-width="1.2" stroke-dasharray="2,1" opacity="0.85">\n                <title>${this._t("plan_ev_deadline")}</title></line>`}if(this._isEvCharging()){const t=new Date,i=(t.getHours()+t.getMinutes()/60)/24,s=.5/24,r=Math.max(0,i-s),o=Math.min(1,i+s),n=qt(r),l=qt(o)-n;a+=`<rect x="${n}" y="86" width="${l}" height="18"\n                rx="3" fill="${e.ev}" opacity="0.95"/>`}const u=new Date,g=qt((u.getHours()+u.getMinutes()/60)/24);return a+=`<line x1="${g}" y1="18" x2="${g}" y2="104"\n            stroke="#ef5350" stroke-width="1.5" stroke-linecap="round" opacity="0.9"/>`,a+=`<polygon points="${g-3},18 ${g+3},18 ${g},22"\n            fill="#ef5350" opacity="0.9"/>`,a}render(){if(!this._hass||!this._config)return Y;const t=this._theme(),e=t.dotColor||"rgba(128,128,128,0.04)",i=this._buildSvgContent(t),s=this._getNowBadges(),r={cheap:"#66bb6a",very_cheap:"#66bb6a",normal:"#ff9800",expensive:"#e91e63",very_expensive:"#e91e63",now:"#42a5f5",charging:"#8DC892",planned:"#8DC892"},a=(t,e)=>{if(!e)return Y;const i=r[e]||"#888",s=/\d/.test(e)?e:this._t(e);return j`<span class="now-badge"
                style="color:${i};border-color:${i}55;background:${i}22">${s}</span>`};return j`
            <style>
                :host { display: block; }
                .wrap {
                    padding: 12px 14px 8px;
                    position: relative;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 25%, rgba(150,202,238,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${e} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text||"#e0e0e0"});
                }
                .timeline-svg { width: 100%; height: auto; }
                .now-row {
                    display: flex; align-items: center; gap: 10px;
                    font-size: 11px; color: var(--secondary-text-color, #999);
                    margin-top: 4px; flex-wrap: wrap;
                }
                .now-row .now-label {
                    font-weight: 600; opacity: 0.7; margin-right: 4px;
                }
                .now-row .row-pair {
                    display: inline-flex; align-items: center; gap: 4px;
                }
                .now-row .row-pair > span:first-child { opacity: 0.7; }
                .now-badge {
                    display: inline-block; padding: 1px 7px;
                    border-radius: 999px; border: 1px solid;
                    font-size: 11px; font-weight: 600;
                    text-transform: capitalize;
                }
                .legend {
                    display: flex; gap: 14px; flex-wrap: wrap;
                    margin-top: 6px; padding-top: 6px;
                    border-top: 1px dashed rgba(255,255,255,0.06);
                    font-size: 11px; color: var(--secondary-text-color, #888);
                }
                .legend .item {
                    display: inline-flex; align-items: center; gap: 4px;
                }
                .legend i {
                    width: 10px; height: 10px; border-radius: 2px;
                    display: inline-block;
                }
            </style>
            <ha-card>
                <div class="wrap">
                    <svg class="timeline-svg"
                        viewBox="0 0 ${600} ${112}"
                        preserveAspectRatio="xMidYMid meet"
                        role="img"
                        aria-label="24-hour schedule timeline"
                        .innerHTML=${i}>
                    </svg>
                    <div class="now-row" role="status">
                        <span class="now-label">${this._t("plan_now")}:</span>
                        <span class="row-pair"><span>${this._t("tariff")}</span>${a(0,s.tariff)}</span>
                        <span class="row-pair"><span>${this._t("night")}</span>${a(0,s.night)}</span>
                        <span class="row-pair"><span>${this._t("surplus")}</span>${a(0,s.surplus)}</span>
                        <span class="row-pair"><span>${this._t("ev")}</span>${a(0,s.ev)}</span>
                    </div>
                    <div class="legend">
                        <span class="item"><i style="background:#66bb6a"></i>${this._t("cheap")}</span>
                        <span class="item"><i style="background:${ht.solar}"></i>${this._t("normal")}</span>
                        <span class="item"><i style="background:#e91e63"></i>${this._t("expensive")}</span>
                        <span class="item"><i style="background:#42a5f5"></i>${this._t("night")}</span>
                        <span class="item"><i style="background:#fdd835"></i>${this._t("surplus")}</span>
                        <span class="item"><i style="background:${ht.ev}"></i>${this._t("ev")}</span>
                    </div>
                </div>
            </ha-card>
        `}getCardSize(){return 2}static getStubConfig(){return{}}},{type:"eb-schedule-card",name:"SEM Schedule",description:"24-hour timeline showing tariff, night window, surplus window, and EV charging periods"});const Zt=[{id:"autostart",entity:"number.ebi_battery_auto_start_soc",icon:"mdi:play-circle",labelKey:"auto_start_soc",helpKey:"zone_help_autostart",color:"#4db6ac"},{id:"buffer",entity:"number.ebi_battery_buffer_soc",icon:"mdi:shield-half-full",labelKey:"buffer_soc",helpKey:"zone_help_buffer",color:"#ff9800"},{id:"priority",entity:"number.ebi_battery_priority_soc",icon:"mdi:shield-alert",labelKey:"priority_soc",helpKey:"zone_help_priority",color:"#f44336"}];bt("eb-battery-zones-card",class extends vt{static get watchedEntities(){return Zt.map(t=>t.entity)}static get properties(){return{...super.properties,_showHelp:{state:!0}}}constructor(){super(),this._showHelp=!1}_toggleHelp(){this._showHelp=!this._showHelp}setConfig(t){super.setConfig(t)}_getDecimalsForZone(t){const e=this._hass?.states[t];return(e&&parseFloat(e.attributes.step)||1)<1?1:0}_zoneEntity(t){return this._mapId(t.entity)}_renderZoneMarkers(t){return Zt.map(e=>{const i=this._state(this._zoneEntity(e)),s=Math.max(0,Math.min(100,i));return j`
                <div class="zone-marker" style="left:${s}%">
                    <div class="zone-dot" style="background:${e.color};border-color:${t.isDark?"#1e232d":"#fff"}"></div>
                    <span class="zone-marker-label">${i.toFixed(0)}%</span>
                </div>
            `})}_renderStepper(t,e){const i=this._zoneEntity(t),s=this._state(i),r=this._getDecimalsForZone(i),a=this._t(t.labelKey),o=this._showHelp?this._t(t.helpKey):"";return j`
            <div class="stepper-cell">
                <div class="stepper-row">
                    <ha-icon icon="${t.icon}" style="--mdc-icon-size:18px;color:${t.color}"></ha-icon>
                    <span class="stepper-label">${a}</span>
                    <div class="stepper-controls">
                        <button
                            class="stepper-minus"
                            aria-label="Decrease ${a}"
                            @click=${()=>this._stepNumber(i,-1)}
                            @pointerdown=${()=>this._startHold(i,-1)}
                            @pointerup=${()=>this._stopHold(i)}
                            @pointerleave=${()=>this._stopHold(i)}
                        >−</button>
                        <span class="stepper-value">${s.toFixed(r)}%</span>
                        <button
                            class="stepper-plus"
                            aria-label="Increase ${a}"
                            @click=${()=>this._stepNumber(i,1)}
                            @pointerdown=${()=>this._startHold(i,1)}
                            @pointerup=${()=>this._stopHold(i)}
                            @pointerleave=${()=>this._stopHold(i)}
                        >+</button>
                    </div>
                </div>
                ${this._showHelp?j`<div class="zone-help-text" style="border-left-color:${t.color}">${o}</div>`:Y}
            </div>
        `}render(){if(!this._config)return Y;const t=this._theme(),e=this._state(this._zoneEntity(Zt[0])),i=this._state(this._zoneEntity(Zt[1])),s=this._state(this._zoneEntity(Zt[2])),r=`${this._t("auto_start_soc")} ${e.toFixed(0)}% · Buffer ${i.toFixed(0)}% · ${this._t("priority_soc")} ${s.toFixed(0)}%`;return j`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 25%, rgba(77,182,172,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                }
                .header-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: #4db6ac;
                }
                .subtitle {
                    flex: 1;
                    text-align: right;
                    font-size: 12px;
                    color: var(--secondary-text-color, ${t.textSec});
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .zone-bar-wrap {
                    margin: 0 0 14px;
                    padding: 0 4px;
                }
                .zone-bar {
                    position: relative;
                    height: 8px;
                    border-radius: 4px;
                    background: linear-gradient(90deg, #f44336 0%, #ff9800 30%, #4db6ac 60%, #488fc2 80%, #8DC892 100%);
                    opacity: 0.6;
                }
                .zone-marker {
                    position: absolute;
                    top: -6px;
                    transform: translateX(-50%);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    transition: left 0.3s ease;
                }
                .zone-dot {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    border: 2px solid;
                    box-shadow: 0 0 4px rgba(0,0,0,0.3);
                }
                .zone-marker-label {
                    font-size: 10px;
                    font-weight: 600;
                    margin-top: 2px;
                    color: var(--secondary-text-color, ${t.textSec});
                    font-variant-numeric: tabular-nums;
                }
                .stepper-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 4px 16px;
                }
                .stepper-row {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 6px 0;
                }
                .stepper-label {
                    font-size: 12px;
                    font-weight: 500;
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .stepper-controls {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    flex-shrink: 0;
                }
                .stepper-minus, .stepper-plus {
                    width: 28px;
                    height: 28px;
                    border-radius: 7px;
                    border: 1px solid ${t.surfaceBorder};
                    background: ${t.surface};
                    color: var(--primary-text-color, ${t.text});
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.15s;
                    user-select: none;
                    -webkit-user-select: none;
                    touch-action: manipulation;
                    padding: 0;
                    line-height: 1;
                }
                .stepper-minus:hover, .stepper-plus:hover {
                    background: ${t.surfaceHover};
                }
                .stepper-value {
                    font-size: 13px;
                    font-weight: 600;
                    min-width: 48px;
                    text-align: center;
                    font-variant-numeric: tabular-nums;
                }
                /* Help toggle in header (#eb-zone-help, 2026-06-06). Tap
                   the (?) to reveal one-line descriptions under each
                   stepper. Off by default — keeps the card compact. */
                .help-toggle {
                    cursor: pointer;
                    color: var(--secondary-text-color, ${t.textSec});
                    opacity: 0.7;
                    flex-shrink: 0;
                    transition: opacity 0.15s, color 0.15s;
                    user-select: none;
                    -webkit-user-select: none;
                }
                .help-toggle:hover { opacity: 1; }
                .help-toggle.on { color: #4db6ac; opacity: 1; }
                .stepper-cell { display: flex; flex-direction: column; }
                .zone-help-text {
                    font-size: 11px;
                    line-height: 1.35;
                    color: var(--secondary-text-color, ${t.textSec});
                    opacity: 0.8;
                    padding: 4px 6px 6px 36px;
                    border-left: 2px solid;
                    margin-left: 9px;
                    margin-top: -2px;
                    margin-bottom: 4px;
                }
                @media (max-width: 480px) {
                    .stepper-grid { grid-template-columns: 1fr; }
                }
            </style>
            <div class="wrap">
                <div class="header">
                    <ha-icon icon="mdi:battery-charging-medium" style="--mdc-icon-size:18px;color:#4db6ac"></ha-icon>
                    <span class="header-title">${this._t("soc_zones")}</span>
                    <span class="subtitle">${r}</span>
                    <ha-icon
                        class="help-toggle ${this._showHelp?"on":""}"
                        icon="${this._showHelp?"mdi:help-circle":"mdi:help-circle-outline"}"
                        title="${this._t("zone_help_toggle")}"
                        @click=${()=>this._toggleHelp()}
                        style="--mdc-icon-size:18px"
                    ></ha-icon>
                </div>
                <div class="zone-bar-wrap">
                    <div class="zone-bar">
                        ${this._renderZoneMarkers(t)}
                    </div>
                </div>
                <div class="stepper-grid">
                    ${Zt.map(e=>this._renderStepper(e,t))}
                </div>
            </div>
        `}getCardSize(){return 4}static getStubConfig(){return{}}},{type:"custom:eb-battery-zones-card",name:"SEM Battery Zones Card",description:"SOC zone configuration for Solar Energy Management",preview:!1});const Qt="sensor.ebi_",Jt=["daily_costs","daily_savings","daily_export_revenue","daily_battery_savings","daily_net_cost","monthly_costs","monthly_savings","monthly_export_revenue","monthly_net_cost","monthly_battery_savings","yearly_costs","yearly_savings","yearly_export_revenue","yearly_net_cost","yearly_battery_savings","lifetime_total_savings","roi_percentage","roi_payback_years","roi_annual_savings","daily_co2_avoided","yearly_co2_avoided","lifetime_co2_avoided","yearly_trees_equivalent","lifetime_trees_equivalent"];bt("eb-costs-card",class extends vt{static get watchedEntities(){return Jt.map(t=>`${Qt}${t}`)}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||Qt}_val(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_fmt(t,e=2){return null==t||isNaN(t)?"—":t.toFixed(e)}_fmtCurr(t,e,i=2){return null==t||isNaN(t)?"—":t.toFixed(i)+" "+e}_netColor(t){return t<=0?"#8DC892":"#f06292"}_renderPeriodSection(t,e,i,s,r){const a=this._val(`${t}_costs`),o=this._val(`${t}_savings`),n=this._val(`${t}_battery_savings`),l=this._val(`${t}_export_revenue`),c=this._val(`${t}_net_cost`),h=this._netColor(c);return j`
            <div class="section">
                <div class="section-title">${this._t(e)}</div>
                <div class="metric-row">
                    <span class="metric-label">${this._t("import_cost")}</span>
                    <span class="metric-val c-import">${this._fmtCurr(a,s)}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">${this._t("solar_savings")}</span>
                    <span class="metric-val c-solar">${this._fmtCurr(o,s)}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">${this._t("battery_savings")}</span>
                    <span class="metric-val c-battery">${this._fmtCurr(n,s)}</span>
                </div>
                <div class="metric-row">
                    <span class="metric-label">${this._t("export_revenue")}</span>
                    <span class="metric-val c-export">${this._fmtCurr(l,s)}</span>
                </div>
                <div class="metric-row net-row">
                    <span class="metric-label"><strong>${this._t("net")}</strong></span>
                    <span class="metric-val" style="color:${h}">${this._fmtCurr(c,s)}</span>
                </div>
            </div>
        `}render(){if(!this._config||!this._hass)return Y;const t=ft(this._hass),e=this._theme(),i=this._val("daily_net_cost"),s=i<=0,r=s?"#8DC892":"#f06292",a=(s?"+":"")+this._fmt(Math.abs(i),2)+" "+t,o=s?this._t("net_saving_today"):this._t("net_cost_today"),n=this._val("roi_percentage"),l=n>=0?"#8DC892":"#f06292",c=this._val("roi_payback_years");return j`
            <ha-card>
                <div class="wrap">
                    <!-- Hero -->
                    <div class="hero">
                        <div class="hero-net" style="color:${r}">${a}</div>
                        <div class="hero-label" style="color:${r}">${o}</div>
                    </div>

                    <!-- Today / Monthly / Yearly (3 columns) -->
                    <div class="three-col">
                        ${this._renderPeriodSection("daily","today","d",t,e)}
                        ${this._renderPeriodSection("monthly","monthly","m",t,e)}
                        ${this._renderPeriodSection("yearly","yearly","y",t,e)}
                    </div>

                    <!-- ROI + Environmental (2 columns) -->
                    <div class="two-col">
                        <div class="section">
                            <div class="section-title">${this._t("roi")}</div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("lifetime_savings")}</span>
                                <span class="metric-val c-green">${this._fmtCurr(this._val("lifetime_total_savings"),t,0)}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("annual_savings")}</span>
                                <span class="metric-val c-green">${this._fmtCurr(this._val("roi_annual_savings"),t,0)}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("payback_years")}</span>
                                <span class="metric-val">${c>0?this._fmt(c,1)+" "+this._t("years"):"—"}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("roi_percentage")}</span>
                                <span class="metric-val" style="color:${l}">${0!==n?this._fmt(n,1)+"%":"—"}</span>
                            </div>
                        </div>
                        <div class="section">
                            <div class="section-title">${this._t("environment")}</div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("co2_today")}</span>
                                <span class="metric-val c-leaf">${this._fmt(this._val("daily_co2_avoided"),1)} kg</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("co2_yearly")}</span>
                                <span class="metric-val c-leaf">${this._fmt(this._val("yearly_co2_avoided"),0)} kg</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("co2_lifetime")}</span>
                                <span class="metric-val c-leaf">${this._fmt(this._val("lifetime_co2_avoided"),0)} kg</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("trees_yearly")}</span>
                                <span class="metric-val c-leaf">${this._fmt(this._val("yearly_trees_equivalent"),1)}</span>
                            </div>
                            <div class="metric-row">
                                <span class="metric-label">${this._t("trees_lifetime")}</span>
                                <span class="metric-val c-leaf">${this._fmt(this._val("lifetime_trees_equivalent"),1)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </ha-card>
        `}static get styles(){return a`
            :host { display: block; }
            .wrap {
                padding: 16px 20px;
                position: relative;
                background:
                    radial-gradient(ellipse 70% 60% at 50% 25%, rgba(240,98,146,0.06) 0%, transparent 100%),
                    radial-gradient(circle at 2px 2px, rgba(128,128,128,0.05) 0.7px, transparent 0.7px);
                background-size: 100% 100%, 50px 50px;
                font-family: 'Segoe UI','Roboto',sans-serif;
                color: var(--primary-text-color, #e0e0e0);
            }

            /* ── Hero ── */
            .hero {
                display: flex; align-items: center; justify-content: center;
                flex-direction: column; padding: 4px 0 8px;
                text-align: center;
            }
            .hero-net {
                font-size: 28px; font-weight: 700;
                font-variant-numeric: tabular-nums;
                text-shadow: 0 0 12px rgba(141,200,146,0.3);
                line-height: 1.1;
            }
            .hero-label {
                font-size: 12px; font-weight: 500; text-transform: uppercase;
                letter-spacing: 0.6px; margin-top: 2px;
                color: var(--secondary-text-color, #999);
            }

            /* ── Section ── */
            .section {
                margin-top: 10px; padding: 10px 12px;
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 10px;
            }
            .section-title {
                font-size: 12px; font-weight: 600; text-transform: uppercase;
                letter-spacing: 0.6px; color: #8DC892; margin-bottom: 6px;
            }

            /* ── Multi-column layouts ── */
            .three-col {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 0 10px;
            }
            .two-col {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0 10px;
            }
            @media (max-width: 400px) {
                .three-col { grid-template-columns: 1fr; }
                .two-col { grid-template-columns: 1fr; }
            }

            /* ── Metric rows ── */
            .metric-row {
                display: flex; justify-content: space-between; align-items: baseline;
                padding: 2px 0;
            }
            .net-row {
                margin-top: 4px; padding-top: 4px;
                border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
            }
            .metric-label {
                font-size: 12px; color: var(--secondary-text-color, #999);
                font-weight: 500;
            }
            .metric-val {
                font-size: 12px; font-weight: 600;
                font-variant-numeric: tabular-nums;
                color: var(--primary-text-color, #e0e0e0);
            }

            /* Color helpers */
            .c-import  { color: #488fc2; }
            .c-solar   { color: #ff9800; }
            .c-battery { color: #4db6ac; }
            .c-export  { color: #8353d1; }
            .c-green   { color: #8DC892; }
            .c-leaf    { color: #8DC892; }
        `}getCardSize(){return 5}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"eb-costs-card",name:"SEM Costs",description:"Consolidated financial card with daily/monthly/yearly costs, savings, ROI, and environmental impact"});const te="sensor.ebi_",ee=[{id:"ev_econ",icon:"mdi:car-electric",color:"#8DC892",titleKey:"ev_charging_economics"},{id:"investment",icon:"mdi:bank",color:"#96CAEE",titleKey:"system_investment_cost"},{id:"demand",icon:"mdi:flash-triangle",color:"#ff9800",titleKey:"demand_charge"},{id:"tariff",icon:"mdi:tag-multiple",color:"#488fc2",titleKey:"tariff_rates"}];bt("eb-costs-detail-card",class extends vt{static get watchedEntities(){return[`${te}lifetime_ev_energy`,`${te}lifetime_ev_cost`,`${te}lifetime_ev_solar_share`,"number.ebi_system_investment_cost",`${te}monthly_consecutive_peak`,`${te}power_charge_cost`,"number.ebi_demand_charge_rate",`${te}tariff_current_import_rate`,`${te}tariff_current_export_rate`,`${te}tariff_price_level`,"number.ebi_electricity_import_rate","number.ebi_electricity_export_rate"]}constructor(){super(),this._collapsed={}}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||te}_val(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_valStr(t){const e=this._hass?.states[`${this._prefix}${t}`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?e.state:""}_numVal(t,e=0){const i=this._frozenEntities[t];if(i)return i.value;const s=this._hass?.states[t];return s&&"unavailable"!==s.state&&"unknown"!==s.state?parseFloat(s.state)??e:e}_entityExists(t){const e=this._hass?.states[t];return!(!e||"unavailable"===e.state||"unknown"===e.state)}_toggleSection(t){this._collapsed={...this._collapsed,[t]:!this._collapsed[t]},this.requestUpdate()}_sectionSubtitle(t,e){if("ev_econ"===t){const t=this._val("lifetime_ev_energy");if(t<=0)return this._t("no_ev_data");const i=this._val("lifetime_ev_cost"),s=this._val("lifetime_ev_solar_share");return`${(t>0?i/t:0).toFixed(2)} ${e}/kWh · ${s.toFixed(0)}% solar`}if("investment"===t){const t=this._numVal(`number.${this._objPrefix()}system_investment_cost`);return t>0?`${t.toFixed(0)} ${e}`:""}if("demand"===t){const t=this._val("monthly_consecutive_peak"),i=this._val("power_charge_cost");return`${pt(t)} · ${i.toFixed(2)} ${e}`}if("tariff"===t){const t=this._val("tariff_current_import_rate"),i=this._valStr("tariff_price_level");return i?`${t.toFixed(4)} ${e} · ${this._t(i.toLowerCase())}`:`${t.toFixed(4)} ${e}`}return""}_renderStepper(t,e){const i=this._hass?.states[t],s=this._numVal(t),r=i&&parseFloat(i.attributes.step)||1,a=i?.attributes?.unit_of_measurement||"",o=r<1?2:0,n=s.toFixed(o)+(a?" "+a:"");return j`
            <div class="stepper-row">
                <span class="stepper-label">${this._t(e)}</span>
                <div class="stepper-controls">
                    <button
                        class="stepper-minus"
                        aria-label="Decrease"
                        @click=${()=>this._stepNumber(t,-1)}
                        @pointerdown=${()=>this._startHold(t,-1)}
                        @pointerup=${()=>this._stopHold(t)}
                        @pointerleave=${()=>this._stopHold(t)}
                    >−</button>
                    <span class="stepper-value">${n}</span>
                    <button
                        class="stepper-plus"
                        aria-label="Increase"
                        @click=${()=>this._stepNumber(t,1)}
                        @pointerdown=${()=>this._startHold(t,1)}
                        @pointerup=${()=>this._stopHold(t)}
                        @pointerleave=${()=>this._stopHold(t)}
                    >+</button>
                </div>
            </div>
        `}_renderInfoTile(t,e,i,s){return j`
            <div class="info-tile">
                <ha-icon icon="${t}" style="--mdc-icon-size:18px;color:${e}"></ha-icon>
                <div class="info-tile-content">
                    <span class="info-tile-label">${this._t(i)}</span>
                    <span class="info-tile-value">${s}</span>
                </div>
            </div>
        `}_renderSectionBody(t,e){if("ev_econ"===t){const t=this._val("lifetime_ev_energy");if(!(t>0))return j`<div class="info-empty">${this._t("no_ev_data")}</div>`;const i=this._val("lifetime_ev_cost"),s=this._val("lifetime_ev_solar_share"),r=i/t;return j`
                <div class="info-tiles">
                    ${this._renderInfoTile("mdi:currency-usd","#8DC892","cost_per_kwh",r.toFixed(4)+" "+e+"/kWh")}
                    ${this._renderInfoTile("mdi:solar-power","#ff9800","solar_share",s.toFixed(1)+"%")}
                </div>
            `}if("investment"===t)return j`${this._renderStepper(`number.${this._objPrefix()}system_investment_cost`,"system_investment_cost")}`;if("demand"===t){const t=this._val("monthly_consecutive_peak"),i=this._val("power_charge_cost");return j`
                <div class="info-tiles">
                    ${this._renderInfoTile("mdi:chart-bell-curve","#ff9800","monthly_peak",pt(t))}
                    ${this._renderInfoTile("mdi:currency-usd","#f06292","demand_charge",i.toFixed(2)+" "+e)}
                </div>
                ${this._renderStepper(`number.${this._objPrefix()}demand_charge_rate`,"demand_charge_rate")}
            `}if("tariff"===t){const t=this._hass?.states[`${this._prefix}tariff_current_import_rate`],i=this._hass?.states[`${this._prefix}tariff_current_export_rate`],s=this._hass?.states[`${this._prefix}tariff_price_level`],r=t?.state??"—",a=t?.attributes?.unit_of_measurement||e,o=i?.state??"—",n=i?.attributes?.unit_of_measurement||e,l=s?.state??"—",c=this._entityExists(`number.${this._objPrefix()}electricity_import_rate`),h=this._entityExists(`number.${this._objPrefix()}electricity_export_rate`);return j`
                <div class="info-tiles tariff-info-tiles">
                    ${this._renderInfoTile("mdi:transmission-tower-import","#488fc2","current_import_rate",`${r} ${a}`)}
                    ${this._renderInfoTile("mdi:transmission-tower-export","#8353d1","current_export_rate",`${o} ${n}`)}
                    ${this._renderInfoTile("mdi:signal-cellular-outline","#96CAEE","price_level",l?this._t(l):"—")}
                </div>
                ${c?this._renderStepper(`number.${this._objPrefix()}electricity_import_rate`,"current_import_rate"):Y}
                ${h?this._renderStepper(`number.${this._objPrefix()}electricity_export_rate`,"current_export_rate"):Y}
            `}return Y}_renderSection(t,e){const i=this._collapsed[t.id],s=this._sectionSubtitle(t.id,e);return j`
            <div class="section">
                <div
                    class="section-header"
                    tabindex="0"
                    role="button"
                    aria-expanded="${!i}"
                    @click=${()=>this._toggleSection(t.id)}
                    @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._toggleSection(t.id))}}
                >
                    <ha-icon icon="${t.icon}" style="--mdc-icon-size:20px;color:${t.color}"></ha-icon>
                    <span class="section-title-text">${this._t(t.titleKey)}</span>
                    <span class="section-subtitle">${s}</span>
                    <ha-icon
                        class="chevron"
                        icon="mdi:chevron-down"
                        style="--mdc-icon-size:18px;transform:rotate(${i?"-90deg":"0deg"});transition:transform 0.25s ease"
                    ></ha-icon>
                </div>
                ${i?Y:j`
                    <div class="section-body">
                        ${this._renderSectionBody(t.id,e)}
                    </div>
                `}
            </div>
        `}render(){if(!this._config||!this._hass)return Y;const t=ft(this._hass);return j`
            <div class="wrap">
                ${ee.map(e=>this._renderSection(e,t))}
            </div>
        `}static get styles(){return a`
            :host { display: block; }
            .wrap {
                padding: 16px;
                position: relative;
                background:
                    radial-gradient(ellipse 70% 60% at 50% 25%, rgba(240,98,146,0.06) 0%, transparent 100%),
                    radial-gradient(circle at 2px 2px, rgba(128,128,128,0.05) 0.7px, transparent 0.7px);
                background-size: 100% 100%, 50px 50px;
                font-family: 'Segoe UI','Roboto',sans-serif;
                color: var(--primary-text-color, #e0e0e0);
            }

            /* ── Sections ── */
            .section {
                margin-bottom: 8px;
                border-radius: 14px;
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                overflow: hidden;
                transition: border-color 0.2s;
            }
            .section:hover {
                border-color: rgba(255,255,255,0.18);
            }

            .section-header {
                display: flex; align-items: center; gap: 8px;
                padding: 12px 14px;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                transition: background 0.15s;
            }
            .section-header:hover {
                background: rgba(255,255,255,0.10);
            }
            .section-title-text {
                font-size: 14px; font-weight: 600;
                white-space: nowrap;
            }
            .section-subtitle {
                flex: 1;
                font-size: 12px;
                color: var(--secondary-text-color, #999);
                text-align: right;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-right: 4px;
            }

            .section-body {
                padding: 0 14px 14px;
                overflow: hidden;
            }

            /* ── Number Stepper ── */
            .stepper-row {
                display: flex; align-items: center; justify-content: space-between;
                padding: 7px 0;
            }
            .stepper-label {
                font-size: 13px; font-weight: 500;
                flex: 1; min-width: 0;
                overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
            }
            .stepper-controls {
                display: flex; align-items: center; gap: 2px;
                flex-shrink: 0;
            }
            .stepper-minus, .stepper-plus {
                width: 30px; height: 30px;
                border-radius: 8px;
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                color: var(--primary-text-color, #e0e0e0);
                font-size: 16px; font-weight: 600;
                cursor: pointer;
                display: flex; align-items: center; justify-content: center;
                transition: background 0.15s, border-color 0.15s;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                padding: 0; line-height: 1;
            }
            .stepper-minus:hover, .stepper-plus:hover {
                background: rgba(255,255,255,0.10);
                border-color: var(--primary-color, #42a5f5);
            }
            .stepper-value {
                font-size: 13px; font-weight: 600;
                min-width: 60px; text-align: center;
                font-variant-numeric: tabular-nums;
            }

            /* ── Info tiles ── */
            .info-tiles {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin: 8px 0;
            }
            .tariff-info-tiles {
                grid-template-columns: 1fr 1fr 1fr;
            }
            @media (max-width: 480px) {
                .info-tiles { grid-template-columns: 1fr; }
                .tariff-info-tiles { grid-template-columns: 1fr 1fr; }
            }
            .info-tile {
                display: flex; align-items: flex-start; gap: 8px;
                padding: 10px;
                border-radius: 10px;
                background: rgba(255,255,255,0.03);
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
            }
            .info-tile ha-icon { margin-top: 1px; flex-shrink: 0; }
            .info-tile-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
            .info-tile-label {
                font-size: 11px; font-weight: 500; text-transform: uppercase;
                color: var(--secondary-text-color, #999);
                letter-spacing: 0.3px;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .info-tile-value {
                font-size: 13px; font-weight: 600;
                font-variant-numeric: tabular-nums;
            }

            /* ── EV no data ── */
            .info-empty {
                font-size: 13px;
                color: var(--secondary-text-color, #999);
                text-align: center;
                padding: 12px 0;
                font-style: italic;
            }
        `}getCardSize(){return 8}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"custom:eb-costs-detail-card",name:"SEM Costs Detail Card",description:"Financial details — EV economics, investment, demand charge, and tariff rates",preview:!1});const ie="sensor.ebi_";bt("eb-charger-status-card",class extends vt{constructor(){super(),this._chargers=[],this._lastStateCount=0}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;if(this._chargers?.length>0&&!s){const e=this._config?.entity_prefix||ie,i=t.states[`${e}charger_${this._chargers[0]}_power`]?.state;if("unavailable"===i||"unknown"===i)return}const r=Object.keys(t.states).length;if(r!==this._lastStateCount){this._lastStateCount=r;const e=[];for(const i of Object.keys(t.states)){if(i.includes("_flow_"))continue;const t=i.match(/^sensor\.ebi_charger_(.+)_power$/);t&&e.push(t[1])}this._chargers=e}const a=this._config?.entity_prefix||ie,o=this._chargers.map(e=>[`charger_${e}_power`,`charger_${e}_session_energy`,`charger_${e}_session_solar_share`,`charger_${e}_taper_trend`].map(e=>t.states[`${a}${e}`]?.state||"").join(":")).join("|");(o!==this._lastKey||s)&&(this._lastKey=o,this._scheduleUpdate())}get hass(){return this._hass}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||ie}_val(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_valStr(t){const e=this._hass?.states[`${this._prefix}${t}`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?e.state:""}_chargerName(t){const e=this._hass?.states[`${this._prefix}charger_${t}_power`];let i=t.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase());return e?.attributes?.friendly_name&&(i=e.attributes.friendly_name.replace(/^SEM\s+/i,"").replace(/\s+Power$/i,"")),i}_renderChargerTile(t){const e=this._val(`charger_${t}_power`),i=this._val(`charger_${t}_session_energy`),s=this._val(`charger_${t}_session_solar_share`),r=this._valStr(`charger_${t}_taper_trend`)||"stable",a=this._t(r),o=this._chargerName(t),n=e>50,l=n?"#8DC892":"#888",c=n?this._t("charging"):this._t("idle");return j`
            <div class="charger-tile">
                <div class="charger-glow" style="opacity:${n?"0.15":"0"}"></div>
                <div class="charger-header">
                    <ha-icon icon="mdi:ev-station" style="--mdc-icon-size:20px;color:${l}"></ha-icon>
                    <span class="charger-name">${o}</span>
                    <span class="charger-status" style="color:${l}">${c}</span>
                </div>
                <div class="charger-metrics">
                    <div class="metric">
                        <span class="metric-value">${e.toFixed(0)}</span>
                        <span class="metric-unit">W</span>
                        <span class="metric-label">${this._t("power")}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${i.toFixed(1)}</span>
                        <span class="metric-unit">kWh</span>
                        <span class="metric-label">${this._t("session")}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${s.toFixed(0)}</span>
                        <span class="metric-unit">%</span>
                        <span class="metric-label">${this._t("solar")}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value taper-${r}">${a}</span>
                        <span class="metric-label">${this._t("taper")}</span>
                    </div>
                </div>
            </div>
        `}render(){return this._config&&this._hass?j`
            <div class="card-wrap">
                <div class="card-title">${this._t("charger_status")}</div>
                <div class="card-subtitle">${this._chargers.length} ${this._t("chargers_configured")}</div>
                <div class="charger-grid">
                    ${this._chargers.map(t=>this._renderChargerTile(t))}
                </div>
            </div>
        `:Y}static get styles(){return a`
            :host { display: block; }
            .card-wrap {
                padding: 16px;
                position: relative;
            }
            .card-title {
                font-size: 1.1em;
                font-weight: 500;
                color: var(--primary-text-color, #e0e0e0);
                margin-bottom: 4px;
            }
            .card-subtitle {
                font-size: 0.85em;
                color: var(--secondary-text-color, #999);
                margin-bottom: 16px;
            }
            .charger-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 12px;
            }
            .charger-tile {
                position: relative;
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 12px;
                padding: 14px;
                overflow: hidden;
            }
            .charger-glow {
                position: absolute;
                top: -20px; right: -20px;
                width: 80px; height: 80px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(141,200,146,0.4), transparent 70%);
                pointer-events: none;
                transition: opacity 0.5s ease;
            }
            .charger-header {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 12px;
            }
            .charger-name {
                flex: 1;
                font-weight: 500;
                color: var(--primary-text-color, #e0e0e0);
                font-size: 0.95em;
            }
            .charger-status {
                font-size: 0.8em;
                font-weight: 500;
                text-transform: uppercase;
                letter-spacing: 0.05em;
            }
            .charger-metrics {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px;
                text-align: center;
            }
            .metric-value {
                display: block;
                font-size: 1.15em;
                font-weight: 600;
                color: var(--primary-text-color, #e0e0e0);
            }
            .metric-unit {
                font-size: 0.8em;
                color: var(--secondary-text-color, #999);
                margin-left: 1px;
            }
            .metric-label {
                display: block;
                font-size: 0.8em;
                color: var(--secondary-text-color, #999);
                margin-top: 2px;
                text-transform: uppercase;
                letter-spacing: 0.03em;
            }
            .taper-rising  { color: #f06292; }
            .taper-falling { color: #8DC892; }
            .taper-stable  { color: var(--secondary-text-color, #999); }
        `}getCardSize(){return Math.max(2,this._chargers.length)}static getStubConfig(){return{}}},{type:"eb-charger-status-card",name:"SEM Charger Status",description:"Multi-charger status display with per-charger tiles"});const se="sensor.ebi_",re=["#8DC892","#64B5F6"];bt("eb-ev-status-card",class extends vt{static get properties(){return{...super.properties,_showHelp:{state:!0}}}constructor(){super(),this._chargers=[],this._lastStateCount=0,this._showHelp=!1,this._boundVisibility=()=>{document.hidden||this.requestUpdate()}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._boundVisibility)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._boundVisibility)}_toggleHelp(){this._showHelp=!this._showHelp}set hass(t){this._hass,this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=Object.keys(t.states).length;if(r!==this._lastStateCount){this._lastStateCount=r;const e=[];for(const i of Object.keys(t.states)){if(i.includes("_flow_"))continue;const t=i.match(new RegExp(`^sensor\\.${this._objPrefix()}charger_(.+)_power$`));t&&e.push(t[1])}this._chargers=e}const a=this._config?.entity_prefix||se;let o=["ev_connected","ev_charging","ev_power","calculated_current","session_energy","session_solar_share","session_cost","daily_ev_energy","energy_ev_solar_percentage","charging_state"].map(e=>{const i="ev_connected"===e||"ev_charging"===e?`binary_sensor.${this._objPrefix()}`:a;return t.states[`${i}${e}`]?.state||""}).join(",");if(this._chargers.length>=1){o+="|"+this._chargers.map(e=>[`charger_${e}_power`,`charger_${e}_session_energy`,`charger_${e}_session_energy_external`,`charger_${e}_daily_energy`,`charger_${e}_session_solar_share`,`charger_${e}_estimated_soc`,`charger_${e}_vehicle_soc`,`charger_${e}_commanded_current`].map(e=>t.states[`${a}${e}`]?.state||"").join(":")).join("|"),o+="|"+this._chargers.map(e=>t.states[`switch.${this._objPrefix()}charger_${e}_night_charging`]?.state||"").join(":"),o+="|"+this._chargers.map(e=>[t.states[`time.${this._objPrefix()}charger_${e}_target_time`]?.state||"",t.states[`switch.${this._objPrefix()}charger_${e}_tariff_optimized`]?.state||""].join(":")).join("|");const e=t.states[`${a}charging_state`]?.attributes||{};o+="|"+[e.ev_tariff_waiting,e.ev_deadline_reachable,e.ev_next_cheap_window].join(":"),o+="|"+this._chargers.map(e=>t.states[`number.${this._objPrefix()}charger_${e}_daily_ev_target`]?.state||"").join(":"),o+="|"+this._chargers.map(e=>[t.states[`select.${this._objPrefix()}charger_${e}_ev_target_type`]?.state||"",t.states[`number.${this._objPrefix()}charger_${e}_target_soc`]?.state||"",t.states[`number.${this._objPrefix()}charger_${e}_daily_ev_target_max`]?.state||"",t.states[`number.${this._objPrefix()}charger_${e}_target_soc_max`]?.state||"",t.states[`number.${this._objPrefix()}charger_${e}_ev_battery_capacity_kwh`]?.state||"",t.states[`number.${this._objPrefix()}charger_${e}_ev_kwh_per_100km`]?.state||""].join(":")).join("|"),o+="|"+(t.states[`${a}ev_remaining_range`]?.state||"")}o+="|"+this._localizeReady+"|"+this._lang,(o!==this._lastKey||s)&&(this._lastKey=o,this._scheduleUpdate())}get hass(){return this._hass}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||se}_binaryState(t){const e=this._hass?.states[`binary_sensor.${this._objPrefix()}${t}`];return"on"===e?.state}_val(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_valStr(t){const e=this._hass?.states[`${this._prefix}${t}`];return e?.state||""}_entityVal(t,e=0){const i=this._frozenEntities[t];if(i)return i.value;const s=this._hass?.states[t];return s&&"unavailable"!==s.state&&"unknown"!==s.state?parseFloat(s.state)??e:e}_fmt(t,e=1){return null==t||isNaN(t)?"—":t.toFixed(e)}_chargerName(t){const e=this._hass?.states[`${this._prefix}charger_${t}_power`];let i=t.replace(/_/g," ").replace(/\b\w/g,t=>t.toUpperCase());return e?.attributes?.friendly_name&&(i=e.attributes.friendly_name.replace(/^SEM\s+/i,"").replace(/\s+Power$/i,"")),i}_renderSocGauge(t){const e=null!=t?Math.max(0,Math.min(100,t)):0,i=e>60?"#8DC892":e>30?"#ff9800":"#f06292",s=Math.max(2,e/100*52);return j`
            <svg viewBox="0 0 44 76" width="44" height="76">
                <rect x="14" y="0" width="16" height="5" rx="2" fill="rgba(255,255,255,0.15)"/>
                <rect x="6" y="4" width="32" height="60" rx="4"
                    fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
                <rect x="9" y="${52-s+7}" width="26" height="${s}" rx="2"
                    fill="${i}" opacity="0.7"/>
                <text x="22" y="40" text-anchor="middle"
                    fill="white" font-size="14" font-weight="700"
                    font-family="'Segoe UI','Roboto',sans-serif"
                    opacity="0.95">
                    ${null!=t?Math.round(t)+"%":"—"}
                </text>
            </svg>
        `}_renderPlanStrip(t){const e=this._hass?.states[`${this._prefix}charging_state`],i=t?e?.attributes?.per_charger_plans?.[t]:null,s=Array.isArray(i)&&i.length>0,r=s?i:e?.attributes?.today_plan||[];if(!Array.isArray(r)||r.length<2)return Y;const a=new Set(["ev_charge_start","ev_min_reached","ev_deadline"]);if(!r.some(t=>a.has(t.kind)))return Y;const o=Date.now(),n=432e5,l=o+n,c=t=>Math.max(0,Math.min(100,(t-o)/n*100)),h=r.filter(t=>["now","night_open","ev_charge_start","ev_min_reached","ev_deadline"].includes(t.kind));h.sort((t,e)=>new Date(t.when)-new Date(e.when));const d=s?r.some(t=>"ev_charge_start"===t.kind&&"plan_ev_charge_tariff"===t.detail):!!e?.attributes?.ev_tariff_waiting,p=[];let u=o,g="idle";for(const t of h){const e=new Date(t.when).getTime(),i=Math.min(e,l);i>u&&p.push({s:u,e:i,state:g}),u=Math.max(u,i),"night_open"===t.kind?g=d?"wait":"charging":"ev_charge_start"===t.kind?g="charging":("ev_min_reached"===t.kind||"ev_deadline"===t.kind)&&(g="done")}u<l&&p.push({s:u,e:l,state:g});const f=[];for(const t of r){const e=new Date(t.when).getTime();if("expensive_start"===t.kind&&e<l){const i=t.values?.end;if(i){const[t,s]=i.split(":").map(Number),r=new Date(e);r.setHours(t,s,0,0),r.getTime()<e&&r.setDate(r.getDate()+1),f.push({s:e,e:Math.min(r.getTime(),l),kind:"expensive"})}}else if("cheap_start"===t.kind&&e<l){const i=t.values?.end;if(i){const[t,s]=i.split(":").map(Number),r=new Date(e);r.setHours(t,s,0,0),r.getTime()<e&&r.setDate(r.getDate()+1),f.push({s:e,e:Math.min(r.getTime(),l),kind:"cheap"})}}}const _=t=>({idle:"#566072",wait:"#8353d1",charging:"#8DC892",done:"#4db6ac"}[t]||"#566072"),m=t=>"cheap"===t?"#43a047":"#f06292",y=this._hass?.config?.time_zone||void 0,x=[];for(let t=0;t<=12;t+=3){const e=o+3600*t*1e3,i=new Date(e).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:y});x.push({x:c(e),label:i})}return j`
            <div class="plan-strip" title="${this._t("today_plan_title")} (12h)">
                <div class="strip-title">
                    <ha-icon icon="mdi:chart-timeline" style="--mdc-icon-size:13px;color:#5BC8D8"></ha-icon>
                    <span>${this._t("plan_strip_title")}</span>
                </div>
                <svg viewBox="0 0 ${100} 16" preserveAspectRatio="none" class="strip-svg">
                    ${p.map(t=>V`
                        <rect x="${c(t.s)}" y="5" width="${c(t.e)-c(t.s)}"
                              height="10" fill="${_(t.state)}" />
                    `)}
                    ${f.map(t=>V`
                        <rect x="${c(t.s)}" y="0" width="${c(t.e)-c(t.s)}"
                              height="3" fill="${m(t.kind)}"
                              opacity="0.75" />
                    `)}
                </svg>
                <div class="strip-axis">
                    ${x.map(t=>j`
                        <span class="tick" style="left: ${t.x}%">${t.label}</span>
                    `)}
                </div>
                <div class="strip-legend">
                    <span><i style="background:${_("idle")}"></i>${this._t("plan_strip_idle")}</span>
                    <span><i style="background:${_("wait")}"></i>${this._t("plan_strip_wait")}</span>
                    <span><i style="background:${_("charging")}"></i>${this._t("plan_strip_charging")}</span>
                    <span><i style="background:${_("done")}"></i>${this._t("plan_strip_done")}</span>
                    <span><i class="line" style="background:${m("cheap")}"></i>${this._t("plan_strip_cheap")}</span>
                    <span><i class="line" style="background:${m("expensive")}"></i>${this._t("plan_strip_expensive")}</span>
                </div>
                ${this._showHelp?j`
                    <div class="setting-help strip-help">${this._t("plan_strip_help")}</div>
                `:Y}
            </div>
        `}_renderRangeSlider(t,e,i){const s=this._hass?.states[t],r=this._hass?.states[e],a=i?"%":" kWh",o=t=>i?String(Math.round(t)):this._fmt(t,t%1==0?0:1);if(!s||!r){const e=this._entityVal(t,i?80:10);return j`<div class="ct-row">
                <span class="ct-label">${this._t("charge_to")}</span>
                <span class="ct-ctl"><span class="ct-val clickable"
                    @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:t}}))}
                >${o(e)}${a}</span></span></div>`}const n=Math.min(parseFloat(s.attributes.min??0),parseFloat(r.attributes.min??0)),l=Math.max(parseFloat(s.attributes.max??100),parseFloat(r.attributes.max??100)),c=l-n||1;let h=this._entityVal(t,i?80:10),d=this._entityVal(e,100);d<h&&(d=h);const p=(h-n)/c*100,u=(d-n)/c*100,g=d>=l-1e-6,f=parseFloat(this._hass?.states[t]?.attributes?.step)||(l>50?1:5),_=Math.max(f,.02*(l-n)),m=d-h<_-1e-6;return j`
            <div class="range-wrap">
                <div class="range-labels">
                    <span>${this._t("at_least")} <b style="color:#8DC892">${o(h)}${a}</b></span>
                    <span>${this._t("up_to")} <b style="color:#ff9800">${g?this._t("full"):o(d)+a}</b></span>
                </div>
                <div class="range-track">
                    <div class="range-fill" style="left:${p}%;width:${Math.max(0,u-p)}%"></div>
                    <div class="range-handle range-handle-min" style="left:${p}%"
                        @pointerdown=${i=>this._rangeHandleStart(i,"min",t,e,n,l)}></div>
                    <div class="range-handle range-handle-max" style="left:${u}%"
                        @pointerdown=${i=>this._rangeHandleStart(i,"max",t,e,n,l)}></div>
                    ${m?j`
                        <span class="range-split"
                              style="left:${p}%"
                              title="${this._t("separate_handles")}"
                              @click=${i=>{i.stopPropagation();const s=d-_;s>=n?this._setNumber(t,s):this._setNumber(e,Math.min(l,h+_))}}>
                            <ha-icon icon="mdi:arrow-split-vertical"
                                     style="--mdc-icon-size:14px"></ha-icon>
                        </span>
                    `:Y}
                </div>
            </div>`}_rangeHandleStart(t,e,i,s,r,a){t.stopPropagation(),t.preventDefault();const o=t.currentTarget.closest(".range-track");if(!o)return;const n="min"===e?i:s,l="min"===e?s:i,c=this._hass?.states[n],h=parseFloat(c?.attributes?.step)||(a>50?1:.5),d=a-r||1,p=t=>{const i=o.getBoundingClientRect();let s=(t-i.left)/(i.width||1);s=Math.max(0,Math.min(1,s));let n=Math.round((r+s*d)/h)*h;const c=this._entityVal(l,"min"===e?a:r);return n="min"===e?Math.min(n,c):Math.max(n,c),Math.max(r,Math.min(a,n))},u=t=>{this._freezeEntity(n,p(t.clientX)),this.requestUpdate()},g=t=>{window.removeEventListener("pointermove",u),window.removeEventListener("pointerup",g),window.removeEventListener("pointercancel",g),this._setNumber(n,p(t.clientX))};window.addEventListener("pointermove",u),window.addEventListener("pointerup",g),window.addEventListener("pointercancel",g)}_renderChargerSection(t,e){const i=re[e%re.length],s=this._val(`charger_${t}_power`,0),r=this._val(`charger_${t}_session_energy_external`,0),a=this._val(`charger_${t}_session_energy`,0),o=r>0?r:a,n=this._val(`charger_${t}_daily_energy`,0),l=this._val("energy_ev_solar_percentage",0),c=this._val(`charger_${t}_vehicle_soc`,null)??this._val("vehicle_soc",null),h=this._val(`charger_${t}_estimated_soc`,null),d=null!=c?c:h,p=this._chargerName(t),u=this._hass?.states[`binary_sensor.${this._objPrefix()}charger_${t}_connected`],g="on"===u?.state,f=s>50,_=f?this._t("charging"):g?this._t("connected"):this._t("idle"),m=this._val(`charger_${t}_commanded_current`,0),y=this._entityVal(`number.${this._objPrefix()}charger_${t}_minimum_current`,6),x=this._entityVal(`number.${this._objPrefix()}charger_${t}_ev_battery_capacity_kwh`,40),b=this._entityVal(`number.${this._objPrefix()}charger_${t}_ev_kwh_per_100km`,18),v=`select.${this._objPrefix()}charger_${t}_charge_mode`,w=this._stateAttrs(v),$=this._stateStr(v)||"min_plus_solar",k=w.options||["solar_only","min_plus_solar","always_max","off"],M={solar_only:this._t("charge_mode_solar_only"),solar_plus_cheap:this._t("charge_mode_solar_plus_cheap"),min_plus_solar:this._t("charge_mode_min_plus_solar"),always_max:this._t("charge_mode_always_max"),off:this._t("charge_mode_off")},S=Math.round(this._entityVal(`number.${this._objPrefix()}battery_buffer_soc`,70)),C=Math.round(this._entityVal(`number.${this._objPrefix()}battery_priority_soc`,30)),D=t=>(this._t(t)||"").replace(/\{buffer\}/g,S).replace(/\{priority\}/g,C),z=D(`charge_mode_hint_${$}_surplus`),E=D(`charge_mode_hint_${$}_overnight`),P=D(`charge_mode_hint_${$}_battery`),T=`select.${this._objPrefix()}charger_${t}_ev_target_type`,F=this._stateStr(T)||"kwh",A=this._stateAttrs(T).options||["kwh"],R="soc"===F,L=R?`number.${this._objPrefix()}charger_${t}_target_soc`:`number.${this._objPrefix()}charger_${t}_daily_ev_target`,I=R?`number.${this._objPrefix()}charger_${t}_target_soc_max`:`number.${this._objPrefix()}charger_${t}_daily_ev_target_max`,O=`time.${this._objPrefix()}charger_${t}_target_time`,N=this._stateStr(O),H=N?N.slice(0,5):"—",B=this._stateAttrs(`${this._prefix}charging_state`),W=!1===B.ev_deadline_reachable,V=B.ev_next_cheap_window;let U="";if(V)try{const t=new Date(V);isNaN(t)||(U=t.toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:this._hass?.config?.time_zone||void 0}))}catch(t){}const G="solar_plus_cheap"===$&&U,q=this._entityVal(L,R?80:10),K=R?Math.max(0,(q-d)/100*x):Math.max(0,q-n),X=b>0?Math.round(K/b*100):null,Z=A.length>1?j`<select class="ct-unit" .value=${F}
                    @click=${t=>t.stopPropagation()}
                    @change=${t=>this._selectOption(T,t.target.value)}>
                    ${A.map(t=>j`<option value=${t} ?selected=${t===F}>${"soc"===t?"%":"kWh"}</option>`)}
                </select>`:j`<span class="ct-unit-static">${R?"%":"kWh"}</span>`;return j`
            <div class="charger-section">
                <div class="charger-header">
                    <div class="charger-dot" style="background:${i}"></div>
                    <span class="charger-name">${p}</span>
                    <span class="charger-status" style="color:${f?i:""}">${_}${m>0?j` <span class="charger-set">(${Math.round(m)}&nbsp;A)</span>`:Y}</span>
                </div>

                <div class="charger-body">
                    <div class="charger-soc">
                        ${this._renderSocGauge(d)}
                        <span class="soc-label">SOC</span>
                    </div>

                    <div class="charger-metrics">
                        <div class="cm-row">
                            <span class="cm-label">${this._t("power")}</span>
                            <span class="cm-value" style="color:${f?i:""}">${pt(s)}</span>
                        </div>
                        <div class="cm-row">
                            <span class="cm-label">${this._t("today")}</span>
                            <span class="cm-value">${this._fmt(n,1)} kWh</span>
                        </div>
                        <div class="cm-row">
                            <span class="cm-label">${this._t("session")}</span>
                            <span class="cm-value">${this._fmt(o,1)} kWh</span>
                        </div>
                        <div class="cm-row">
                            <span class="cm-label">${this._t("solar_share")}</span>
                            <span class="cm-value" style="color:#ff9800">${this._fmt(l,0)}%</span>
                        </div>
                        <!-- (#440) "Charge Tonight" and "Nights Until Charge"
                             rows removed. The underlying skip-decision wiring
                             was removed alongside; charge mode is the sole
                             authority on whether to charge at night. -->
                    </div>
                </div>

                <div class="charge-target-group">
                    <div class="ct-title">
                        <ha-icon icon="mdi:target" style="--mdc-icon-size:14px;color:#8DC892"></ha-icon>
                        ${this._t("charge_target")}
                        ${null!=X&&X>0?j`<span class="ct-range">· +${X} km</span>`:Y}
                        <span class="ct-spacer"></span>
                        ${Z}
                    </div>
                    ${this._renderRangeSlider(L,I,R)}
                    <!-- #277 Phase B.2: one named Charge mode selector
                         replaces the legacy ev_grid_charging + nested
                         ev_tariff_mode toggles. Options come from the HA
                         entity itself (solar_plus_cheap is hidden when no
                         dynamic tariff is configured, per Q1). The hint
                         line under it explains what the selected mode
                         actually does — cuts the toggle-soup mystery the
                         #247 review flagged. -->
                    <div class="ct-row">
                        <span class="ct-label">${this._t("charge_mode")}</span>
                        <span class="ct-ctl">
                            <select class="ct-mode-select"
                                    .value=${$}
                                    @click=${t=>t.stopPropagation()}
                                    @change=${t=>this._selectOption(v,t.target.value)}>
                                ${k.map(t=>j`
                                    <option value=${t} ?selected=${t===$}>
                                        ${M[t]||t}
                                    </option>`)}
                            </select>
                        </span>
                    </div>
                    ${this._showHelp?j`
                    <div class="ct-subhint">
                        <div class="ct-hint-row">
                            <span class="ct-hint-label">${this._t("hint_label_surplus")}:</span>
                            <span class="ct-hint-text">${z}</span>
                        </div>
                        <div class="ct-hint-row">
                            <span class="ct-hint-label">${this._t("hint_label_overnight")}:</span>
                            <span class="ct-hint-text">${E}</span>
                        </div>
                        <div class="ct-hint-row">
                            <span class="ct-hint-label">${this._t("hint_label_battery")}:</span>
                            <span class="ct-hint-text">${P}</span>
                        </div>
                        ${G?j`
                            <div class="ct-hint-row ct-hint-extra">
                                <span class="ct-hint-label">${this._t("ev_next_cheap")}:</span>
                                <span class="ct-hint-text"><b style="color:#8DC892">${U}</b></span>
                            </div>
                        `:Y}
                    </div>
                    `:G?j`
                        <div class="ct-cheap-hint">
                            <span class="ct-hint-label">${this._t("ev_next_cheap")}:</span>
                            <b style="color:#8DC892">${U}</b>
                        </div>
                    `:Y}
                    <div class="ct-row clickable"
                        @click=${()=>this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:O}}))}>
                        <span class="ct-label">${this._t("ev_charge_by")}</span>
                        <span class="ct-ctl ct-time">
                            <ha-icon icon="mdi:clock-end" style="--mdc-icon-size:13px;color:#5BC8D8"></ha-icon>
                            ${H}
                        </span>
                    </div>
                    ${W?j`
                        <div class="ct-warn">
                            <ha-icon icon="mdi:clock-alert" style="--mdc-icon-size:14px;color:#f06292"></ha-icon>
                            <span>${this._t("ev_deadline_unreachable_short")}</span>
                        </div>
                    `:Y}
                    ${this._renderPlanStrip(t)}
                </div>

                <div class="charger-settings ${this._showHelp?"help-mode":""}">
                    ${""}
                    <div class="setting-cell">
                        <div
                            class="setting-item clickable"
                            @click=${()=>{const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:`number.${this._objPrefix()}charger_${t}_minimum_current`}});this.dispatchEvent(e)}}
                        >
                            <ha-icon icon="mdi:speedometer-slow" style="--mdc-icon-size:16px;color:#ff9800"></ha-icon>
                            <span class="setting-value">${this._fmt(y,0)}A</span>
                        </div>
                        ${this._showHelp?j`<div class="setting-help">${this._t("tile_help_min_amps")}</div>`:Y}
                    </div>
                    <div class="setting-cell">
                        <div
                            class="setting-item clickable"
                            @click=${()=>{const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:`number.${this._objPrefix()}charger_${t}_ev_battery_capacity_kwh`}});this.dispatchEvent(e)}}
                        >
                            <ha-icon icon="mdi:car-battery" style="--mdc-icon-size:16px;color:#8DC892"></ha-icon>
                            <span class="setting-value">${this._fmt(x,0)} kWh</span>
                        </div>
                        ${this._showHelp?j`<div class="setting-help">${this._t("tile_help_capacity")}</div>`:Y}
                    </div>
                    <div class="setting-cell">
                        <div
                            class="setting-item clickable"
                            @click=${()=>{const e=new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:`number.${this._objPrefix()}charger_${t}_ev_kwh_per_100km`}});this.dispatchEvent(e)}}
                        >
                            <ha-icon icon="mdi:map-marker-distance" style="--mdc-icon-size:16px;color:#5BC8D8"></ha-icon>
                            <span class="setting-value">${this._fmt(b,0)} kWh/100km</span>
                        </div>
                        ${this._showHelp?j`<div class="setting-help">${this._t("tile_help_consumption")}</div>`:Y}
                    </div>
                    <ha-icon
                        class="ev-help-toggle ${this._showHelp?"on":""}"
                        icon="${this._showHelp?"mdi:help-circle":"mdi:help-circle-outline"}"
                        title="${this._t("zone_help_toggle")}"
                        @click=${()=>this._toggleHelp()}
                        style="--mdc-icon-size:16px"
                    ></ha-icon>
                </div>
            </div>
        `}render(){if(!this._config||!this._hass)return Y;const t=this._binaryState("ev_connected"),e=this._chargers&&this._chargers.length?this._chargers.reduce((t,e)=>t+this._val(`charger_${e}_power`,0),0):this._val("ev_power",0),i=e>50;this._val("calculated_current",0),this._val("session_energy",0);const s=this._val("energy_ev_solar_percentage",0),r=this._val("session_cost",0),a=this._val("daily_ev_energy",0);this._valStr("charging_state");const o=ft(this._hass),n=i?"wrap state-charging":t?"wrap state-connected":"wrap state-disconnected",l=i?this._t("charging"):t?this._t("connected"):this._t("disconnected"),c=i?"status-value charging":t?"status-value connected":"status-value disconnected";return j`
            <svg class="glow-svg">
                <defs>
                    <filter id="ev-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feFlood flood-color="#8DC892" flood-opacity="0.3" result="color"/>
                        <feComposite in="color" in2="blur" operator="in" result="glow"/>
                        <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="ev-glow-soft" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="6" result="blur"/>
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                </defs>
            </svg>

            <ha-card>
                <div class="${n}">
                    <div class="hero">
                        <div class="ev-icon-area">
                            <svg viewBox="0 0 100 100">
                                <circle class="glow-ring" cx="50" cy="50" r="42" style="opacity:${i?"0.6":t?"0.25":"0.08"}"/>
                                <circle class="ring-bg" cx="50" cy="50" r="42"/>
                                <circle class="ring-fill" cx="50" cy="50" r="39"/>
                                <g class="charger-icon" transform="translate(50,46)">
                                    <rect x="-10" y="-16" width="20" height="26" rx="3"/>
                                    <rect x="-6.5" y="-11" width="13" height="10" rx="2"/>
                                    <path d="M-1.5,-1 L0,4 L1.5,-1"/>
                                    <line x1="0" y1="10" x2="0" y2="15"/>
                                    <circle class="indicator-dot" cx="0" cy="18" r="2" stroke="none"/>
                                </g>
                                <g class="lightning-bolt" transform="translate(50,42)" style="opacity:${i?"1":"0"}">
                                    <path d="M-2,-8 L-4,1 L-0.5,0 L-1,8 L4,-1 L0.5,0 L2,-8Z" stroke="none"/>
                                </g>
                            </svg>
                        </div>

                        ${this._chargers.length>=1?j`
                            <!-- #356: when at least one per-charger section
                                 will render below, the hero only shows a
                                 single status/power line. The per-charger
                                 section repeats today/session/solar-share/
                                 power for each charger, so duplicating them
                                 here as well produced the "4 tiles per
                                 charger" appearance the user reported. -->
                            <div class="metrics-col compact">
                                <div class="metric-row">
                                    <span class="metric-label">${this._t("status")}</span>
                                    <span class="${c}">${l}</span>
                                </div>
                                ${i?j`
                                    <div class="metric-row power-row">
                                        <span class="metric-label">${this._t("power")}</span>
                                        <span class="metric-value power-value">${pt(e)}</span>
                                    </div>
                                `:Y}
                            </div>
                        `:j`
                            <div class="metrics-col">
                                <div class="metric-row">
                                    <span class="metric-label">${this._t("status")}</span>
                                    <span class="${c}">${l}</span>
                                </div>
                                ${i?j`
                                    <div class="metric-row power-row">
                                        <span class="metric-label">${this._t("power")}</span>
                                        <span class="metric-value power-value">${pt(e)}</span>
                                    </div>
                                `:Y}
                                <div class="metric-row">
                                    <span class="metric-label">${this._t("today")}</span>
                                    <span class="metric-value">${this._fmt(a,1)} kWh</span>
                                </div>
                                <div class="metric-row">
                                    <span class="metric-label">${this._t("solar_share")}</span>
                                    <span class="metric-value solar-share-value">${this._fmt(s,0)}%</span>
                                </div>
                            </div>
                        `}
                    </div>

                    <!-- Session cost chip stays on for 0- and 1-charger
                         installs (M3 reviewer note): the global
                         ebi_session_cost sensor IS the single charger's
                         cost. Only hide for multi-charger setups where
                         the global is a fleet aggregate and per-charger
                         attribution lives in each section's metrics. -->
                    ${this._chargers.length>1?Y:j`
                        <div class="bottom-bar">
                            <div class="chip">
                                <span class="chip-label">${this._t("session_cost")}</span>
                                <span class="cost-chip-value">${this._fmt(r,2)} ${o}</span>
                            </div>
                        </div>
                    `}

                    ${this._chargers.length>=1?j`
                        <div class="charger-sections">
                            ${this._chargers.map((t,e)=>this._renderChargerSection(t,e))}
                        </div>
                    `:Y}
                </div>
            </ha-card>
        `}static get styles(){return a`
            :host { display: block; }
            .glow-svg { position: absolute; width: 0; height: 0; }

            .wrap {
                padding: 16px 20px;
                position: relative;
                background:
                    radial-gradient(ellipse 70% 60% at 50% 25%, rgba(141,200,146,0.06) 0%, transparent 100%),
                    radial-gradient(circle at 2px 2px, rgba(128,128,128,0.05) 0.7px, transparent 0.7px);
                background-size: 100% 100%, 50px 50px;
                font-family: 'Segoe UI','Roboto',sans-serif;
                color: var(--primary-text-color, #e0e0e0);
                min-height: 108px;
                overflow: hidden;
            }

            /* Hero layout */
            .hero {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            /* Icon area */
            .ev-icon-area {
                position: relative;
                width: 90px; height: 90px;
                flex-shrink: 0;
            }
            .ev-icon-area svg { width: 100%; height: 100%; }

            /* Glow ring */
            .glow-ring {
                fill: none;
                stroke: #8DC892;
                stroke-width: 6;
                filter: url(#ev-glow-soft);
                transition: opacity 0.6s ease;
            }
            .state-charging .glow-ring {
                animation: pulse-ring 2s ease-in-out infinite;
            }
            @keyframes pulse-ring {
                0%, 100% { stroke-width: 6; opacity: 0.5; }
                50% { stroke-width: 10; opacity: 0.7; }
            }

            .ring-bg {
                fill: none;
                stroke: rgba(141,200,146,0.12);
                stroke-width: 3;
            }
            .ring-fill {
                fill: rgba(141,200,146,0.07);
            }

            .charger-icon {
                stroke: #8DC892;
                fill: none;
                stroke-width: 1.8;
                stroke-linecap: round;
                stroke-linejoin: round;
                opacity: 0.7;
                transition: opacity 0.4s ease;
            }
            .state-disconnected .charger-icon { stroke: #666; opacity: 0.35; }
            .state-disconnected .ring-bg { stroke: rgba(100,100,100,0.12); }
            .state-disconnected .ring-fill { fill: rgba(100,100,100,0.05); }
            .state-disconnected .glow-ring { stroke: #666; }

            .lightning-bolt {
                fill: #8DC892;
                transition: opacity 0.4s ease;
                filter: url(#ev-glow);
            }
            .state-charging .lightning-bolt {
                animation: bolt-pulse 1.5s ease-in-out infinite;
            }
            @keyframes bolt-pulse {
                0%, 100% { opacity: 0.9; }
                50% { opacity: 0.5; }
            }

            .indicator-dot {
                fill: #666;
                opacity: 0.3;
                transition: fill 0.4s ease, opacity 0.4s ease;
            }
            .state-connected .indicator-dot { fill: #8DC892; opacity: 0.5; }
            .state-charging .indicator-dot {
                fill: #8DC892; opacity: 1;
                animation: dot-blink 1s ease-in-out infinite;
            }
            @keyframes dot-blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.3; }
            }

            /* Metrics column */
            .metrics-col {
                flex: 1; min-width: 0;
                display: flex;
                flex-direction: column;
                gap: 2px;
            }
            .metric-row {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                gap: 8px;            /* #523/#524 follow-up: keep label + value
                                        apart when the column shrink-wraps in
                                        the centered hero ("StatusDisconnected") */
                padding: 2px 0;
            }
            .metric-label {
                font-size: 11px;
                color: var(--secondary-text-color, #999);
                font-weight: 500;
            }
            .metric-value {
                font-size: 12px;
                font-weight: 600;
                font-variant-numeric: tabular-nums;
                color: var(--primary-text-color, #e0e0e0);
            }

            .status-value { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
            .status-value.charging { color: #8DC892; text-shadow: 0 0 8px rgba(141,200,146,0.4); }
            .status-value.connected { color: #8DC892; }
            .status-value.disconnected { color: var(--secondary-text-color, #999); }

            .power-row .metric-value {
                font-size: 16px;
                font-weight: 700;
                color: #8DC892;
                text-shadow: 0 0 6px rgba(141,200,146,0.3);
            }

            .solar-share-value { color: #ff9800 !important; }

            .strategy-value {
                font-size: 11px;
                color: #8DC892; opacity: 0.7;
                font-weight: 500;
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }

            /* Bottom bar */
            .bottom-bar {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-top: 10px;
                flex-wrap: wrap;
            }
            .chip {
                display: inline-flex; align-items: center; gap: 4px;
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 12px;
                padding: 3px 10px;
                font-size: 11px; font-weight: 500;
                color: var(--primary-text-color, #e0e0e0);
                font-variant-numeric: tabular-nums;
            }
            .chip-label { color: var(--secondary-text-color, #888); }
            .cost-chip-value { color: #f06292; }

            /* Per-charger sections */
            .charger-sections {
                margin-top: 16px;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }
            .charger-section {
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 12px;
                padding: 12px 14px;
            }
            .charger-header {
                display: flex; align-items: center; gap: 8px;
                margin-bottom: 10px;
            }
            .charger-dot {
                width: 8px; height: 8px;
                border-radius: 50%;
                flex-shrink: 0;
            }
            .charger-name {
                flex: 1; font-weight: 600; font-size: 0.95em;
                color: var(--primary-text-color, #e0e0e0);
            }
            .charger-status {
                font-size: 0.8em; font-weight: 500;
                text-transform: uppercase; letter-spacing: 0.05em;
                color: var(--secondary-text-color, #999);
            }
            .charger-set {
                font-weight: 400; opacity: 0.85;
                font-variant-numeric: tabular-nums;
            }
            .charger-body {
                display: flex; align-items: center; gap: 12px;
            }
            .charger-soc {
                flex-shrink: 0; width: 44px; text-align: center;
            }
            .soc-label {
                display: block;
                font-size: 10px; color: var(--secondary-text-color, #999);
                margin-top: 2px;
                text-transform: uppercase; letter-spacing: 0.05em;
            }
            .charger-metrics {
                flex: 1;
                display: flex; flex-direction: column; gap: 2px;
            }
            .cm-row {
                display: flex; justify-content: space-between; align-items: baseline;
                padding: 2px 0;
            }
            .cm-label { font-size: 11px; color: var(--secondary-text-color, #999); font-weight: 500; }
            .cm-value {
                font-size: 12px; font-weight: 600;
                color: var(--primary-text-color, #e0e0e0);
                font-variant-numeric: tabular-nums;
            }
            .charger-settings {
                display: flex; align-items: center; gap: 6px;
                margin-top: 8px; padding-top: 8px;
                border-top: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                flex-wrap: wrap;
            }
            /* Help mode: switch to a vertical list so each tile gets a
               one-line description below it. Compact when off. */
            .charger-settings.help-mode {
                flex-direction: column; align-items: stretch; gap: 4px;
            }
            .setting-cell { display: flex; align-items: center; gap: 6px; }
            .charger-settings.help-mode .setting-cell {
                flex-direction: column; align-items: flex-start; gap: 2px;
            }
            .setting-help {
                font-size: 11px;
                line-height: 1.3;
                color: var(--secondary-text-color, #888);
                opacity: 0.85;
                font-style: italic;
                padding-left: 22px;
            }
            .ev-help-toggle {
                cursor: pointer;
                color: var(--secondary-text-color, #999);
                opacity: 0.6;
                margin-left: auto;
                flex-shrink: 0;
                transition: opacity 0.15s, color 0.15s;
            }
            .ev-help-toggle:hover { opacity: 1; }
            .ev-help-toggle.on { color: #8DC892; opacity: 1; }
            .charger-settings.help-mode .ev-help-toggle { align-self: flex-end; }
            .setting-item {
                display: flex; align-items: center; gap: 3px;
                font-size: 11px; color: var(--secondary-text-color, #999);
            }
            .setting-item.clickable { cursor: pointer; }
            .setting-label { font-size: 11px; color: var(--secondary-text-color, #999); }
            .setting-value { font-size: 12px; font-weight: 600; color: var(--primary-text-color, #e0e0e0); }
            .setting-toggle {
                font-size: 11px; font-weight: 700;
                padding: 1px 6px;
                border-radius: 6px;
                cursor: pointer;
                user-select: none;
                transition: background 0.2s, color 0.2s;
            }
            .setting-toggle.on  { background: rgba(121,134,203,0.25); color: #7986CB; }
            .setting-toggle.off { background: rgba(100,100,100,0.15); color: #666; }
            .setting-toggle:hover { opacity: 0.8; }

            /* Charge Target group (#235) */
            .charge-target-group {
                margin-top: 8px;
                padding: 10px 12px;
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 10px;
                background: rgba(255,255,255,0.025);
            }
            .ct-title {
                font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;
                color: var(--secondary-text-color, #999);
                display: flex; align-items: center; gap: 5px;
                margin-bottom: 4px;
            }
            .ct-range { color: #5BC8D8; font-weight: 600; text-transform: none; letter-spacing: 0; }
            .ct-spacer { margin-left: auto; }
            /* Dual-handle charge-target range slider (#245) */
            .range-wrap { padding: 6px 8px 10px; }
            .range-labels {
                display: flex; justify-content: space-between;
                font-size: 12px; color: var(--primary-text-color, #e0e0e0);
                margin-bottom: 10px;
            }
            .range-labels b { font-variant-numeric: tabular-nums; }
            .range-track {
                position: relative; height: 6px; border-radius: 3px;
                background: rgba(255,255,255,0.14); margin: 6px 9px;
                touch-action: none;
            }
            .range-fill {
                position: absolute; top: 0; height: 100%; border-radius: 3px;
                background: linear-gradient(90deg, #8DC892, #ff9800);
            }
            .range-handle {
                position: absolute; top: 50%; width: 18px; height: 18px;
                border-radius: 50%; transform: translate(-50%, -50%);
                background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.5);
                cursor: grab; touch-action: none;
            }
            .range-handle:active { cursor: grabbing; }
            .range-handle-min { border: 3px solid #8DC892; }
            .range-handle-max { border: 3px solid #ff9800; }
            .ct-row {
                display: flex; align-items: center; min-height: 32px;
            }
            .ct-row + .ct-row { border-top: 1px solid rgba(255,255,255,0.06); }
            .ct-row.clickable { cursor: pointer; }
            /* Tariff is nested under "Overnight grid charging" — it refines WHEN
               grid charging happens, not WHETHER (#247 UX). */
            .ct-subrow { padding-left: 14px; border-left: 2px solid rgba(141,200,146,0.35); margin-left: 2px; }
            .ct-subrow .ct-label { color: var(--secondary-text-color, #b5b5b5); }
            .ct-subhint {
                padding: 4px 0 4px 16px; margin-left: 2px;
                border-left: 2px solid rgba(141,200,146,0.18);
                font-size: 11px; line-height: 1.35; color: var(--secondary-text-color, #999);
                display: flex; flex-direction: column; gap: 2px;
            }
            .ct-hint-row { display: flex; gap: 6px; align-items: baseline; }
            .ct-hint-label {
                color: var(--secondary-text-color, #b5b5b5);
                font-weight: 600; flex-shrink: 0;
                min-width: 64px; text-align: right;
            }
            .ct-hint-text { color: var(--secondary-text-color, #999); }
            .ct-hint-extra { padding-top: 2px; border-top: 1px dashed rgba(255,255,255,0.05); }
            /* Cheap-window timing kept visible when help is off — too
               useful to hide behind the (?). One small line. */
            .ct-cheap-hint {
                padding: 3px 0 0 16px; margin-left: 2px;
                border-left: 2px solid rgba(141,200,146,0.18);
                font-size: 11px; color: var(--secondary-text-color, #999);
                display: flex; gap: 6px; align-items: baseline;
            }
            .ct-cheap-hint .ct-hint-label {
                min-width: auto; text-align: left;
            }
            .ct-label { font-size: 12px; color: var(--primary-text-color, #e0e0e0); }
            .ct-ctl { margin-left: auto; display: flex; align-items: center; gap: 7px; }
            .ct-time {
                font-size: 12px; font-weight: 600; font-variant-numeric: tabular-nums;
                color: var(--primary-text-color, #e0e0e0);
            }
            .ct-warn {
                display: flex; align-items: center; gap: 6px;
                font-size: 12px; color: #f06292; padding: 5px 0 2px;
            }
            /* 12h EV plan strip (#282, readability pass #464) */
            .plan-strip {
                margin: 8px 0 2px; padding: 4px 0 2px;
                border-top: 1px dashed rgba(255,255,255,0.06);
            }
            .strip-title {
                display: flex; align-items: center; gap: 5px;
                font-size: 11px; font-weight: 600;
                color: var(--secondary-text-color, #aaa);
                letter-spacing: 0.3px; margin-bottom: 4px;
            }
            .strip-svg {
                width: 100%; height: 16px; display: block;
                border-radius: 3px; overflow: hidden;
            }
            .strip-axis {
                position: relative; height: 12px; margin-top: 2px;
                font-size: 10px; color: var(--secondary-text-color, #888);
            }
            .strip-axis .tick {
                position: absolute; transform: translateX(-50%);
                font-variant-numeric: tabular-nums; white-space: nowrap;
            }
            .strip-legend {
                display: flex; gap: 6px 11px; flex-wrap: wrap;
                font-size: 10.5px; color: var(--primary-text-color, #ddd);
                margin-top: 5px;
            }
            .strip-legend span {
                display: inline-flex; align-items: center; gap: 5px;
            }
            .strip-legend i {
                width: 11px; height: 11px; border-radius: 2px;
                display: inline-block; flex: none;
            }
            /* Tariff overlays render as a thin top line on the strip — mirror
               that shape in the legend so they read as the top line, not a
               full segment (#464). */
            .strip-legend i.line {
                height: 4px; border-radius: 1px;
            }
            .strip-help { margin-top: 6px; }
            /* #355 — split affordance shown only when the two range
               handles share a value. Sits on top of the stacked
               handles; tapping it drops Min by one step so the
               handles become individually grabbable again. */
            .range-split {
                position: absolute; top: 50%;
                transform: translate(-50%, -50%);
                width: 22px; height: 22px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                background: rgba(0,0,0,0.55);
                color: #fff;
                cursor: pointer;
                box-shadow: 0 1px 3px rgba(0,0,0,0.5);
                pointer-events: auto;
                z-index: 2;
            }
            .range-split:hover { background: rgba(0,0,0,0.75); }
            .ct-val {
                background: rgba(141,200,146,0.14); color: #8DC892;
                border: 1px solid rgba(141,200,146,0.35);
                border-radius: 8px; padding: 3px 11px; font-weight: 600;
                font-variant-numeric: tabular-nums; min-width: 42px; text-align: center;
            }
            .ct-val.clickable { cursor: pointer; }
            .ct-unit {
                appearance: none; -webkit-appearance: none;
                background-color: var(--secondary-background-color, rgba(255,255,255,0.07));
                /* explicit caret — appearance:none drops the native arrow, which made
                   this look like a static label rather than a kWh/% toggle (#245) */
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23bbbbbb' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 3px center;
                background-size: 14px;
                color: var(--primary-text-color, #e0e0e0);
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 8px; padding: 4px 20px 4px 8px;
                font-size: 12px; font-weight: 600; cursor: pointer;
            }
            .ct-unit-static {
                font-size: 12px; font-weight: 600;
                color: var(--secondary-text-color, #999); padding: 4px 2px;
            }
            /* #277 Phase B.2 — Charge mode selector. Wider than ct-unit
               (multi-word labels) and aligned right inside the row's
               .ct-ctl cell. Same caret + chrome as ct-unit so the two
               selectors visually rhyme. */
            .ct-mode-select {
                appearance: none; -webkit-appearance: none;
                background-color: var(--secondary-background-color, rgba(255,255,255,0.07));
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23bbbbbb' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 6px center;
                background-size: 14px;
                color: var(--primary-text-color, #e0e0e0);
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                border-radius: 8px;
                padding: 4px 24px 4px 10px;
                font-size: 12px; font-weight: 600;
                cursor: pointer;
                max-width: 200px;
            }
            .ct-sw {
                width: 38px; height: 22px; border-radius: 12px;
                position: relative; cursor: pointer; flex-shrink: 0;
                transition: background 0.18s;
            }
            .ct-sw.on { background: #8DC892; }
            .ct-sw.off { background: rgba(255,255,255,0.16); }
            .ct-knob {
                position: absolute; top: 2px; left: 2px;
                width: 18px; height: 18px; border-radius: 50%;
                background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.4);
                transition: left 0.18s;
            }
            .ct-sw.on .ct-knob { left: 18px; }

            @media (max-width: 400px) {
                /* Match the Battery tab exactly: stack the hero, keep the base
                   align-items:center so the metrics sit as a content-width block with
                   label-left / value-right rows (not stretched edge-to-edge). */
                .hero { flex-direction: column; gap: 12px; }
                .ev-icon-area { width: 80px; height: 80px; }
            }
        `}getCardSize(){return this._chargers.length>=1?3+2*this._chargers.length:3}static getStubConfig(){return{}}},{type:"eb-ev-status-card",name:"SEM EV Status",description:"Lumina-styled EV charging hero card with per-charger intelligence and settings"});const ae=["sensor.ebi_solar_power","sensor.ebi_battery_soc","sensor.ebi_autarky_rate","sensor.ebi_ev_power","sensor.ebi_energy_optimization_score","sensor.ebi_energy_tip","sensor.ebi_best_surplus_window","sensor.ebi_forecast_remaining_today_kwh","sensor.ebi_current_vs_peak_percentage","sensor.ebi_consecutive_peak_15min","sensor.ebi_target_peak_limit","sensor.ebi_daily_co2_avoided","sensor.ebi_lifetime_co2_avoided","sensor.ebi_forecast_source","switch.ebi_observer_mode"];bt("eb-home-status-card",class extends vt{static get watchedEntities(){return ae}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||"sensor.ebi_"}_val(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_valStr(t){const e=this._hass?.states[`${this._prefix}${t}`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?e.state:""}_switchOn(t){const e=this._frozenEntities[t];return e?"on"===e.value:"on"===this._hass?.states[t]?.state}_scoreColor(t){return t>=80?"#8DC892":t>=50?"#ff9800":"#f44336"}_peakColor(t){return t>90?"#f44336":t>70?"#ff9800":"#8DC892"}_peakStatusKey(t){return t>90?"peak_critical":t>70?"peak_warning":"peak_safe"}_openEntity(t){const e=`${this._prefix}${t}`;this._hass&&this._hass.states[e]&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_renderChip(t,e,i,s){const r=s&&this._hass?.states[`${this._prefix}${s}`];return j`
            <div class="chip ${r?"clickable":""}"
                 style=${r?"cursor:pointer":""}
                 @click=${r?()=>this._openEntity(s):null}
                 title=${r?`${this._prefix}${s}`:""}>
                <ha-icon icon="${t}" style="--mdc-icon-size:16px;color:${e}"></ha-icon>
                <span class="chip-val">${i}</span>
            </div>
        `}render(){if(!this._config||!this._hass)return Y;const t=this._val("solar_power"),e=this._val("battery_soc"),i=this._val("autarky_rate"),s=this._val("ev_power"),r=this._val("energy_optimization_score"),a=this._scoreColor(r),o=this._valStr("energy_tip"),n=this._valStr("best_surplus_window")||"—",l=this._val("forecast_remaining_today_kwh").toFixed(1),c=this._val("current_vs_peak_percentage"),h=this._peakColor(c),d=pt(this._val("consecutive_peak_15min")),p=pt(this._val("target_peak_limit"));this._switchOn(`switch.${this._objPrefix()}observer_mode`);const u=this._valStr("forecast_source"),g=u?this._forecastProviderLabel(u):"—",f=this._val("daily_co2_avoided").toFixed(2),_=this._val("lifetime_co2_avoided").toFixed(1);return j`
            <div class="wrap">

                <!-- 1. Status Chips -->
                <div class="chips-row">
                    ${this._renderChip("mdi:solar-power","#ff9800",pt(t),"solar_power")}
                    ${this._renderChip("mdi:battery","#4db6ac",`${e.toFixed(0)}%`,"battery_soc")}
                    ${this._renderChip("mdi:leaf","#8DC892",`${i.toFixed(0)}%`,"autarky_rate")}
                    ${this._renderChip("mdi:car-electric","#8DC892",s>0?pt(s):"—","ev_power")}
                    ${this._renderChip("mdi:speedometer",a,r.toFixed(0),"energy_optimization_score")}
                </div>

                <div class="divider"></div>

                <!-- 2. Smart Tip -->
                <div class="tip-section" style="opacity:${o?"1":"0"};pointer-events:${o?"auto":"none"}">
                    <ha-icon icon="mdi:lightbulb-on-outline"
                             style="--mdc-icon-size:20px;color:#ff9800"></ha-icon>
                    <div class="tip-content">
                        <span class="section-label">${this._t("smart_tip")}</span>
                        <span class="tip-primary">${o||""}</span>
                        <span class="tip-secondary">
                            ${this._t("best_window")}: ${n} &middot; ${this._t("surplus")}: ${l} kWh
                        </span>
                    </div>
                </div>
                <div class="divider" style="opacity:${o?"1":"0"}"></div>

                <!-- 3. Peak Load -->
                <div class="section-label">${this._t("peak_load")}</div>
                <div class="peak-row">
                    <div class="peak-icon-wrap">
                        <ha-icon icon="mdi:flash-alert"
                                 style="--mdc-icon-size:22px;color:#ff9800"></ha-icon>
                        <span class="peak-pct" style="color:${h}">${c.toFixed(0)}%</span>
                    </div>
                    <div class="peak-text-wrap">
                        <span class="peak-detail">${d} / ${p} (${c.toFixed(0)}%)</span>
                        <span class="peak-status-badge" style="color:${h};border-color:${h}">
                            ${this._t(this._peakStatusKey(c))}
                        </span>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- 4. Forecast Info -->
                <div class="section-label">${this._t("quick_controls")}</div>
                <div class="controls-row">
                    <div class="forecast-chip">
                        <ha-icon icon="mdi:weather-partly-cloudy"
                                 style="--mdc-icon-size:16px;color:#96CAEE"></ha-icon>
                        <span class="forecast-label">${this._t("forecast")}</span>
                        <span class="forecast-val">${g}</span>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- 5. Environmental Impact -->
                <div class="section-label">${this._t("environmental_impact")}</div>
                <div class="env-row">
                    <div class="env-chip">
                        <ha-icon icon="mdi:leaf"
                                 style="--mdc-icon-size:18px;color:#8DC892"></ha-icon>
                        <div class="env-chip-content">
                            <span class="env-chip-val">${f} kg</span>
                            <span class="env-chip-label">${this._t("co2_today")}</span>
                        </div>
                    </div>
                    <div class="env-chip">
                        <ha-icon icon="mdi:tree"
                                 style="--mdc-icon-size:18px;color:#8DC892"></ha-icon>
                        <div class="env-chip-content">
                            <span class="env-chip-val">${_} kg</span>
                            <span class="env-chip-label">${this._t("co2_lifetime")}</span>
                        </div>
                    </div>
                </div>

            </div>
        `}static get styles(){return a`
            :host { display: block; }

            .wrap {
                padding: 16px 20px;
                position: relative;
                font-family: 'Segoe UI','Roboto',sans-serif;
                color: var(--primary-text-color, #e0e0e0);
                background:
                    radial-gradient(ellipse 70% 60% at 50% 25%, rgba(91,200,216,0.06) 0%, transparent 100%),
                    radial-gradient(circle at 2px 2px, rgba(128,128,128,0.05) 0.7px, transparent 0.7px);
                background-size: 100% 100%, 50px 50px;
            }

            /* ── Section label ── */
            .section-label {
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                color: var(--secondary-text-color, #999);
                margin-bottom: 6px;
            }

            /* ── Divider ── */
            .divider {
                height: 1px;
                background: var(--divider-color, rgba(255,255,255,0.12));
                margin: 12px 0;
            }

            /* ─────────────────── 1. Chips ─────────────────── */
            .chips-row {
                display: flex;
                gap: 6px;
                overflow-x: auto;
                padding-bottom: 4px;
                scrollbar-width: none;
                -ms-overflow-style: none;
            }
            .chips-row::-webkit-scrollbar { display: none; }

            .chip {
                display: inline-flex; align-items: center; gap: 4px;
                padding: 4px 10px;
                border-radius: 12px;
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                white-space: nowrap;
                flex-shrink: 0;
                backdrop-filter: blur(16px) saturate(160%);
                -webkit-backdrop-filter: blur(16px) saturate(160%);
            }
            .chip-val {
                font-size: 12px;
                font-weight: 600;
                font-variant-numeric: tabular-nums;
            }

            /* ─────────────────── 2. Tip ─────────────────── */
            .tip-section {
                display: flex; gap: 10px; align-items: flex-start;
                padding: 10px 12px;
                border-radius: 12px;
                background: rgba(255,152,0,0.06);
                border: 1px solid rgba(255,152,0,0.20);
            }
            .tip-section ha-icon { flex-shrink: 0; margin-top: 1px; }
            .tip-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
            .tip-primary {
                font-size: 13px; font-weight: 500; line-height: 1.4;
            }
            .tip-secondary {
                font-size: 11px;
                color: var(--secondary-text-color, #999);
                line-height: 1.3;
            }

            /* ─────────────────── 3. Peak ─────────────────── */
            .peak-row {
                display: flex; align-items: center; gap: 10px;
            }
            .peak-icon-wrap {
                display: flex; align-items: center; gap: 6px;
                flex-shrink: 0;
            }
            .peak-pct {
                font-size: 22px; font-weight: 700;
                font-variant-numeric: tabular-nums;
                line-height: 1;
            }
            .peak-text-wrap {
                display: flex; flex-direction: column; gap: 2px;
                min-width: 0;
            }
            .peak-detail {
                font-size: 12px;
                color: var(--secondary-text-color, #999);
                white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            }
            .peak-status-badge {
                display: inline-block;
                font-size: 11px; font-weight: 600;
                text-transform: uppercase; letter-spacing: 0.4px;
                padding: 2px 7px;
                border-radius: 8px;
                border: 1px solid;
                align-self: flex-start;
            }

            /* ─────────────────── 4. Quick controls ─────────────────── */
            .controls-row {
                display: flex; gap: 12px; align-items: center;
                flex-wrap: wrap;
            }
            .observer-toggle {
                display: flex; align-items: center; gap: 8px;
                flex: 1; min-width: 120px;
            }
            .observer-toggle-label {
                font-size: 13px; font-weight: 500; flex: 1;
            }
            .toggle-track {
                position: relative;
                width: 42px; height: 24px;
                border-radius: 12px;
                background: rgba(255,255,255,0.15);
                cursor: pointer;
                transition: background 0.2s;
                flex-shrink: 0;
            }
            .toggle-track.on { background: var(--primary-color, #42a5f5); }
            .toggle-thumb {
                position: absolute;
                top: 2px; left: 2px;
                width: 20px; height: 20px;
                border-radius: 50%;
                background: white;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                transition: left 0.2s;
            }
            .toggle-track.on .toggle-thumb { left: 20px; }

            .forecast-chip {
                display: flex; align-items: center; gap: 6px;
                padding: 4px 10px;
                border-radius: 12px;
                border: 1px solid var(--divider-color, rgba(255,255,255,0.12));
                background: var(--secondary-background-color, rgba(255,255,255,0.06));
                flex-shrink: 0;
            }
            .forecast-label {
                font-size: 11px;
                color: var(--secondary-text-color, #999);
                font-weight: 500;
            }
            .forecast-val { font-size: 12px; font-weight: 600; }

            /* ─────────────────── 5. Environmental ─────────────────── */
            .env-row {
                display: flex; gap: 8px; flex-wrap: wrap;
            }
            .env-chip {
                display: flex; align-items: center; gap: 6px;
                padding: 6px 12px;
                border-radius: 12px;
                border: 1px solid rgba(141,200,146,0.25);
                background: rgba(141,200,146,0.06);
                flex: 1; min-width: 120px;
            }
            .env-chip ha-icon { flex-shrink: 0; }
            .env-chip-content { display: flex; flex-direction: column; gap: 0; }
            .env-chip-val {
                font-size: 13px; font-weight: 600;
                font-variant-numeric: tabular-nums;
            }
            .env-chip-label {
                font-size: 11px;
                color: var(--secondary-text-color, #999);
                text-transform: uppercase; letter-spacing: 0.3px;
            }

            @media (max-width: 400px) {
                .env-row { flex-direction: column; }
                .controls-row { flex-direction: column; align-items: flex-start; }
            }
        `}getCardSize(){return 5}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"custom:eb-home-status-card",name:"SEM Home Status Card",description:"Consolidated status panel for the SEM Home tab",preview:!1});const oe="sensor.ebi_tariff_current_import_rate",ne={negative:{color:"#4db6ac",key:"price_negative"},very_cheap:{color:"#8DC892",key:"very_cheap"},cheap:{color:"#8DC892",key:"cheap"},normal:{color:"#ff9800",key:"normal"},expensive:{color:"#f06292",key:"expensive"},very_expensive:{color:"#e53935",key:"very_expensive"}};bt("eb-price-card",class extends vt{constructor(){super(),this._boundVisibility=()=>{document.hidden||this.requestUpdate()}}connectedCallback(){super.connectedCallback(),document.addEventListener("visibilitychange",this._boundVisibility)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this._boundVisibility)}setConfig(t){super.setConfig(t),this._entity=t.entity||oe,this._compact=!!t.compact}set hass(t){this._hass=t;const e=t?.states[this._entity],i=e?.attributes||{},s=[e?.state,i.price_level,i.next_cheap_start,(i.upcoming||[]).length,this._lang].join("|"),r="function"==typeof semLocalize;(s!==this._lastKey||r&&!this._localizeReady)&&(this._lastKey=s,this._lang=t?.language,this._localizeReady=r,this.requestUpdate())}get hass(){return this._hass}_hm(t){if(!t)return null;const e=this._hass?.config?.time_zone||void 0;try{return new Date(t).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit",timeZone:e})}catch(t){return null}}_levelInfo(t){return ne[t]||{color:"#9e9e9e",key:"normal"}}render(){if(!this._hass||!this._config)return Y;const t=this._hass.states[this._entity];if(!t||"unavailable"===t.state||"unknown"===t.state)return j`<ha-card><div class="wrap empty">${this._t("current_electricity_price")}: —</div></ha-card>`;const e=t.attributes||{};if(!1===e.is_dynamic)return this.style.display="none",Y;this.style.display="";const i=parseFloat(t.state),s=e.currency||"",r=this._levelInfo(e.price_level),a=t=>null==t||isNaN(t)?"—":Number(t).toFixed(2),o=Array.isArray(e.upcoming)?e.upcoming:[],n=this._hm(e.next_cheap_start),l=this._hm(e.next_cheap_end);return this._compact?j`
                <ha-card>
                    <div class="chip-row">
                        <span class="chip-title">${this._t("current_electricity_price")}</span>
                        <span class="chip-price" style="color:${r.color}">${a(i)}</span>
                        <span class="chip-unit">${s}/kWh</span>
                        <span class="chip-badge" style="background:${r.color}22;color:${r.color};border-color:${r.color}55">
                            ${this._t(r.key)}
                        </span>
                        ${n?j`<span class="chip-next">${this._t("price_next_cheap")}: <b style="color:#8DC892">${n}</b></span>`:Y}
                    </div>
                </ha-card>
            `:j`
            <ha-card>
                <div class="wrap">
                    <div class="head">
                        <span class="title">${this._t("current_electricity_price")}</span>
                        ${e.provider&&"unknown"!==e.provider?j`<span class="prov">${e.provider}</span>`:Y}
                    </div>
                    <div class="now">
                        <span class="price" style="color:${r.color}">${a(i)}</span>
                        <span class="unit">${s}/kWh</span>
                        <span class="badge" style="background:${r.color}22;color:${r.color};border-color:${r.color}55">
                            ${this._t(r.key)}
                        </span>
                    </div>
                    <div class="summary">
                        <span>${this._t("today")}: <b>min ${a(e.today_min)}</b> · avg ${a(e.today_avg)} · <b>max ${a(e.today_max)}</b></span>
                        ${n?j`<span class="cheap">${this._t("price_next_cheap")}: <b>${n}${l?"–"+l:""}</b></span>`:Y}
                    </div>
                    ${o.length>=2?this._renderStrip(o):Y}
                </div>
            </ha-card>
        `}_renderStrip(t){const e=Date.now(),i=t.map(t=>({t:new Date(t.t).getTime(),price:t.price,level:t.level})).filter(t=>!isNaN(t.t)).sort((t,e)=>t.t-e.t).filter(t=>t.t>=e-36e5).slice(0,24);if(i.length<2)return Y;const s=i.map(t=>t.price),r=Math.min(...s),a=Math.max(...s)-r||1,o=i.length,n=(320-2*(o-1))/o,l=i.map((t,i)=>{const s=6+52*((t.price-r)/a),o=i*(n+2),l=64-s,c=this._levelInfo(t.level).color,h=t.t<=e&&e<t.t+36e5;return V`<rect x="${o}" y="${l}" width="${n}" height="${s}" rx="1.5"
                fill="${c}" opacity="${h?"1":"0.65"}"
                stroke="${h?"#fff":"none"}" stroke-width="${h?"1":"0"}"/>`}),c=i.map((t,e)=>{if(e%6!=0)return Y;const i=e*(n+2)+n/2,s=new Date(t.t).getHours();return V`<text x="${i}" y="${75}" text-anchor="middle"
                fill="var(--secondary-text-color,#999)" font-size="9">${String(s).padStart(2,"0")}</text>`});return j`
            <svg class="strip" viewBox="0 0 ${320} ${78}" width="100%" preserveAspectRatio="none">
                ${l}${c}
            </svg>
        `}getCardSize(){return 2}static getStubConfig(){return{entity:oe}}static get styles(){return a`
            ha-card { background: var(--ha-card-background, var(--card-background-color)); }
            .wrap { padding: 12px 14px; }
            .wrap.empty { color: var(--secondary-text-color,#999); }
            .head { display: flex; align-items: baseline; gap: 8px; }
            .title { font-size: 13px; font-weight: 600; color: var(--primary-text-color,#e0e0e0); }
            .prov { margin-left: auto; font-size: 12px; color: var(--secondary-text-color,#999); text-transform: capitalize; }
            .now { display: flex; align-items: baseline; gap: 8px; margin: 4px 0 6px; }
            .price { font-size: 30px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1; }
            .unit { font-size: 12px; color: var(--secondary-text-color,#999); }
            .badge { margin-left: auto; font-size: 12px; font-weight: 600; padding: 2px 9px;
                     border-radius: 10px; border: 1px solid; text-transform: capitalize; }
            .summary { display: flex; flex-wrap: wrap; gap: 4px 14px; font-size: 12px;
                       color: var(--secondary-text-color,#aaa); margin-bottom: 8px; }
            .summary b { color: var(--primary-text-color,#e0e0e0); font-variant-numeric: tabular-nums; }
            .summary .cheap b { color: #8DC892; }
            .strip { display: block; overflow: visible; }
            .static-note { font-size: 12px; color: var(--secondary-text-color,#999); padding-top: 2px; }
            /* Compact chip (#257, compact: true) — one row, glance-only. */
            .chip-row {
                display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
                padding: 8px 14px;
            }
            .chip-title { font-size: 12px; font-weight: 600; color: var(--primary-text-color,#e0e0e0); }
            .chip-price { font-size: 17px; font-weight: 700; font-variant-numeric: tabular-nums; line-height: 1; }
            .chip-unit { font-size: 12px; color: var(--secondary-text-color,#999); }
            .chip-badge { font-size: 11px; font-weight: 600; padding: 1px 8px;
                          border-radius: 9px; border: 1px solid; text-transform: capitalize; }
            .chip-next { margin-left: auto; font-size: 12px; color: var(--secondary-text-color,#aaa); }
            .chip-next b { font-variant-numeric: tabular-nums; }
        `}},{type:"custom:eb-price-card",name:"SEM Price Card",description:"Dynamic electricity price: current price, level, today range, next cheap window, and an hourly price strip (#257)",preview:!1});const le=[{id:"info",icon:"mdi:information-outline",color:"#96CAEE",titleKey:"system_info",subtitleFn:t=>{const e=t._val("diag_version")||"—",i=t._val("diag_grid_mode")||"—";return`v${e} · ${"combined"===i?t._t("grid_combined"):"split"===i?t._t("grid_split"):i}`}},{id:"health",icon:"mdi:heart-pulse",color:"#8DC892",titleKey:"health_overview",subtitleFn:t=>`${t._valNum("solar_power").toFixed(0)}W solar · SOC ${t._valNum("battery_soc").toFixed(0)}%`},{id:"diag",icon:"mdi:bug-outline",color:"#ff9800",titleKey:"diagnostics",subtitleFn:()=>""}],ce=[{key:"solar_power",icon:"mdi:solar-power",color:"#ff9800",suffix:"W"},{key:"grid_power",icon:"mdi:transmission-tower",color:"#488fc2",suffix:"W"},{key:"battery_soc",icon:"mdi:battery",color:"#4db6ac",suffix:"%"},{key:"forecast_today_kwh",icon:"mdi:weather-sunny",color:"#ff9800",suffix:"kWh"},{key:"tariff_current_import_rate",icon:"mdi:tag",color:"#96CAEE",suffix:""}],he=["sensor.ebi_diag_version","sensor.ebi_diag_grid_mode","sensor.ebi_diag_battery_capacity","sensor.ebi_diag_update_interval","sensor.ebi_diag_charger_count","sensor.ebi_diag_charger_control","sensor.ebi_diag_sensors_unavailable","sensor.ebi_diag_ed_config","sensor.ebi_solar_power","sensor.ebi_grid_power","sensor.ebi_battery_soc","sensor.ebi_ev_power","sensor.ebi_forecast_today_kwh","sensor.ebi_tariff_current_import_rate","switch.ebi_observer_mode","sensor.ebi_home_consumption_power","sensor.ebi_grid_import_power","sensor.ebi_grid_export_power","sensor.ebi_autarky_rate","sensor.ebi_self_consumption_rate","sensor.ebi_battery_power","sensor.ebi_night_charging_status","sensor.ebi_battery_status","sensor.ebi_grid_status","sensor.ebi_charging_state"];bt("eb-system-card",class extends vt{static get watchedEntities(){return he}constructor(){super(),this._collapsed={info:!1,health:!1,diag:!0},this._copyFeedback=""}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||"sensor.ebi_"}_val(t){const e=this._hass?.states[`${this._prefix}${t}`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?e.state:""}_valNum(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_switchOn(t){return"on"===this._hass?.states[`switch.${this._objPrefix()}${t}`]?.state}_available(t){const e=this._hass?.states[t];return!(!e||"unavailable"===e.state||"unknown"===e.state)}_toggleSection(t){this._collapsed={...this._collapsed,[t]:!this._collapsed[t]},this.requestUpdate()}_copyDiagnostics(){const t=this._val("diag_version")||"—",e=this._val("diag_grid_mode")||"—",i=this._val("diag_charger_count")||"—",s=this._val("diag_charger_control")||"—",r=this._valNum("diag_battery_capacity"),a=`SEM ${t} | Grid: ${e} | Chargers: ${i} (${s}) | Battery: ${r>0?r.toFixed(1):"—"}kWh | Unavailable: ${this._val("diag_sensors_unavailable")||"0"}`,o=this._hass?.states?.["sensor.ebi_diag_ed_config"]?.attributes?.energy_dashboard;let n;if(o){const t=t=>t||"—";n=`Solar:   pwr=${t(o.solar?.power)} [${t(o.solar?.power_source)}]  energy=${t(o.solar?.energy)}\nGrid:    pwr=${t(o.grid?.power)} [${t(o.grid?.power_source)}]  imp=${t(o.grid?.import_energy)}  exp=${t(o.grid?.export_energy)}\nBattery: pwr=${t(o.battery?.power)} [${t(o.battery?.power_source)}]  chg=${t(o.battery?.charge_energy)}  dis=${t(o.battery?.discharge_energy)}`}else n=`Config: ${this._val("diag_ed_config")||"—"}`;const l=`${a}\n${n}`;this._writeClipboard(l)}async _writeClipboard(t){const e=t=>{this._copyFeedback=this._t(t),this.requestUpdate(),setTimeout(()=>{this._copyFeedback="",this.requestUpdate()},2e3)};if(navigator?.clipboard?.writeText&&!1!==window.isSecureContext)try{return await navigator.clipboard.writeText(t),void e("copied")}catch(t){console.warn("[SEM System] modern clipboard API failed, falling back to execCommand",t)}try{const i=document.createElement("textarea");i.value=t,i.setAttribute("readonly",""),i.style.position="fixed",i.style.top="0",i.style.left="0",i.style.width="1px",i.style.height="1px",i.style.opacity="0",document.body.appendChild(i),i.focus(),i.select();const s=document.execCommand("copy");document.body.removeChild(i),s?e("copied"):(e("copy_failed"),console.error('[SEM System] execCommand("copy") returned false'))}catch(t){e("copy_failed"),console.error("[SEM System] legacy clipboard fallback threw",t)}}_renderSectionHeader(t,e){const i=this._collapsed[t.id],s=i?"rotate(-90deg)":"rotate(0deg)";return j`
            <div
                class="section-header"
                tabindex="0"
                role="button"
                aria-expanded="${!i}"
                @click=${()=>this._toggleSection(t.id)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._toggleSection(t.id))}}
            >
                <ha-icon icon="${t.icon}" style="--mdc-icon-size:20px;color:${t.color}"></ha-icon>
                <span class="section-title-text">${this._t(t.titleKey)}</span>
                <span class="section-subtitle">${t.subtitleFn(this)}</span>
                <ha-icon
                    class="chevron"
                    icon="mdi:chevron-down"
                    style="--mdc-icon-size:18px;transform:${s}"
                ></ha-icon>
            </div>
        `}_renderInfoSection(t){const e=this._valNum("diag_battery_capacity"),i=this._valNum("diag_update_interval"),s=this._val("diag_charger_count")||"—",r=this._val("diag_charger_control")||"",a=r?`${s} (${r})`:s;return j`
            <div class="info-row">
                <span class="info-row-label">${this._t("version")}</span>
                <span class="info-row-value">${this._val("diag_version")||"—"}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">${this._t("grid_mode")}</span>
                <span class="info-row-value">${(()=>{const t=this._val("diag_grid_mode")||"—";return"combined"===t?this._t("grid_combined"):"split"===t?this._t("grid_split"):t})()}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">${this._t("battery_capacity")}</span>
                <span class="info-row-value">${e>0?e.toFixed(1)+" kWh":"—"}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">${this._t("update_interval")}</span>
                <span class="info-row-value">${i>0?i.toFixed(0)+" s":"—"}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">${this._t("chargers")}</span>
                <span class="info-row-value">${a}</span>
            </div>
            <div class="info-row">
                <span class="info-row-label">${this._t("unavailable_sensors")}</span>
                <span class="info-row-value">${this._val("diag_sensors_unavailable")||"0"}</span>
            </div>
        `}_renderHealthSection(t){return j`
            <div class="health-chips">
                ${ce.map(t=>{const e=`${this._prefix}${t.key}`,i=this._available(e),s=this._hass?.states[e],r=s?s.state:"—";let a=t.suffix;if("tariff_current_import_rate"===t.key){const t=s?.attributes?.currency;a=t?` ${t}/kWh`:""}return j`
                        <div class="health-chip" style="background:${i?"rgba(141,200,146,0.12)":"rgba(244,67,54,0.12)"};border:1px solid ${i?"rgba(141,200,146,0.3)":"rgba(244,67,54,0.3)"}">
                            <ha-icon icon="${t.icon}" style="--mdc-icon-size:16px;color:${t.color}"></ha-icon>
                            <span class="chip-value">${i?`${r}${a}`:"—"}</span>
                        </div>
                    `})}
            </div>
        `}_renderToggle(t,e,i){const s="on"===this._hass?.states[t]?.state;return j`
            <div class="toggle-row">
                <span class="toggle-label">${this._t(e)}</span>
                <div
                    class="toggle-track ${s?"on":""}"
                    @click=${()=>this._toggleSwitch(t)}
                >
                    <div class="toggle-thumb"></div>
                </div>
            </div>
        `}_renderDiagBlock(t,e){return j`
            <div class="diag-block">
                <span class="diag-block-label">${this._t(t)}</span>
                <span class="diag-block-text">${e}</span>
            </div>
        `}_renderDiagSection(t){const e=`Solar ${this._valNum("solar_power").toFixed(0)}W · Grid ${this._valNum("grid_power").toFixed(0)}W · Battery ${this._valNum("battery_power").toFixed(0)}W · SOC ${this._valNum("battery_soc").toFixed(0)}% · EV ${this._valNum("ev_power").toFixed(0)}W`,i=`Home ${this._valNum("home_consumption_power").toFixed(0)}W · Import ${this._valNum("grid_import_power").toFixed(0)}W · Export ${this._valNum("grid_export_power").toFixed(0)}W · Autarky ${this._valNum("autarky_rate").toFixed(0)}% · Self ${this._valNum("self_consumption_rate").toFixed(0)}%`,s=this._val("charging_state")||"—",r=this._val("night_charging_status")||"—",a=this._val("battery_status")||"—",o=this._val("grid_status")||"—",n=`${s} · ${this._t("night")}: ${r} · ${this._t("battery")}: ${a} · ${this._t("grid")}: ${o}`;return j`
            ${this._renderDiagBlock("source_sensors",e)}
            ${this._renderDiagBlock("derived_values",i)}
            ${this._renderDiagBlock("mode_status",n)}
        `}_renderSection(t,e,i){const s=this._collapsed[t.id];return j`
            <div class="section">
                ${this._renderSectionHeader(t,i)}
                <div class="section-content ${s?"":"expanded"}">
                    <div class="section-body">
                        ${e(i)}
                    </div>
                </div>
            </div>
        `}render(){if(!this._config)return Y;const t=this._theme(),e=!1!==t.isDark,i=t.accent||"#42a5f5",s={info:t=>this._renderInfoSection(t),health:t=>this._renderHealthSection(t),diag:t=>this._renderDiagSection(t)};return j`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${_t(t,ht.inverter)};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }

                /* ── Sections ── */
                .section {
                    margin-bottom: 8px;
                    border-radius: 14px;
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    overflow: hidden;
                    transition: border-color 0.2s;
                }
                .section:hover { border-color: ${e?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)"}; }

                .section-header {
                    display: flex; align-items: center; gap: 8px;
                    padding: 12px 14px;
                    cursor: pointer;
                    user-select: none;
                    -webkit-user-select: none;
                    transition: background 0.15s;
                }
                .section-header:hover { background: ${t.surfaceHover}; }
                .section-title-text {
                    font-size: 14px; font-weight: 600;
                    white-space: nowrap;
                }
                .section-subtitle {
                    flex: 1;
                    font-size: 12px;
                    color: var(--secondary-text-color, ${t.textSec});
                    text-align: right;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 4px;
                }
                .chevron {
                    transition: transform 0.25s ease;
                    color: var(--secondary-text-color, ${t.textSec});
                    flex-shrink: 0;
                }

                /* ── Collapsible content ── */
                .section-content {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.2s ease;
                }
                .section-content.expanded {
                    max-height: 1000px;
                    opacity: 1;
                }
                .section-body {
                    padding: 0 14px 14px;
                }

                /* ── Info rows ── */
                .info-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 7px 0;
                    border-bottom: 1px solid ${t.surfaceBorder};
                }
                .info-row:last-child { border-bottom: none; }
                .info-row-label {
                    font-size: 13px; font-weight: 500;
                    color: var(--secondary-text-color, ${t.textSec});
                }
                .info-row-value {
                    font-size: 13px; font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }

                /* ── Health chips ── */
                .health-chips {
                    display: flex; flex-wrap: wrap; gap: 8px;
                    padding: 8px 0 4px;
                }
                .health-chip {
                    display: flex; align-items: center; gap: 6px;
                    padding: 6px 10px;
                    border-radius: 20px;
                    transition: background 0.2s, border-color 0.2s;
                }
                .chip-value {
                    font-size: 12px; font-weight: 600;
                    font-variant-numeric: tabular-nums;
                }

                /* ── Toggle ── */
                .toggle-group { padding-top: 2px; }
                .toggle-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 9px 0;
                    border-bottom: 1px solid ${t.surfaceBorder};
                }
                .toggle-row:last-child { border-bottom: none; }
                .toggle-label { font-size: 13px; font-weight: 500; }
                .toggle-track {
                    position: relative;
                    width: 42px; height: 24px;
                    border-radius: 12px;
                    background: ${e?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.18)"};
                    cursor: pointer;
                    transition: background 0.2s;
                    flex-shrink: 0;
                }
                .toggle-track.on { background: ${i}; }
                .toggle-thumb {
                    position: absolute;
                    top: 2px; left: 2px;
                    width: 20px; height: 20px;
                    border-radius: 50%;
                    background: white;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    transition: left 0.2s;
                }
                .toggle-track.on .toggle-thumb { left: 20px; }

                /* ── Diagnostics ── */
                .diag-block {
                    padding: 8px 0;
                    border-bottom: 1px solid ${t.surfaceBorder};
                }
                .diag-block:last-child { border-bottom: none; }
                .diag-block-label {
                    display: block;
                    font-size: 11px; font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    color: var(--secondary-text-color, ${t.textSec});
                    margin-bottom: 3px;
                }
                .diag-block-text {
                    display: block;
                    font-size: 12px; font-weight: 500;
                    line-height: 1.5;
                    word-break: break-word;
                    font-variant-numeric: tabular-nums;
                }

                /* ── Copy button ── */
                .copy-row {
                    margin-top: 10px;
                    display: flex; flex-direction: column; align-items: center; gap: 4px;
                }
                .copy-btn {
                    display: flex; align-items: center; gap: 6px;
                    padding: 8px 18px;
                    border-radius: 10px;
                    border: 1px solid ${t.surfaceBorder};
                    background: ${t.surface};
                    color: var(--primary-text-color, ${t.text});
                    font-size: 13px; font-weight: 600;
                    font-family: inherit;
                    cursor: pointer;
                    transition: background 0.15s, border-color 0.15s;
                }
                .copy-btn:hover { background: ${t.surfaceHover}; border-color: #96CAEE; }
                .copy-btn:active { background: ${e?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.08)"}; }
                .copy-feedback {
                    font-size: 11px;
                    color: #8DC892;
                    min-height: 16px;
                    transition: opacity 0.3s;
                    opacity: ${this._copyFeedback?"1":"0"};
                }

                @media (max-width: 480px) {
                    .health-chips { gap: 6px; }
                    .health-chip { padding: 5px 8px; }
                }
            </style>
            <div class="wrap">
                ${le.map(e=>this._renderSection(e,s[e.id],t))}
                <div class="copy-row">
                    <button class="copy-btn" @click=${()=>this._copyDiagnostics()}>
                        <ha-icon icon="mdi:content-copy" style="--mdc-icon-size:16px"></ha-icon>
                        ${this._t("copy_diagnostics")}
                    </button>
                    <span class="copy-feedback">${this._copyFeedback}</span>
                </div>
            </div>
        `}getCardSize(){return 8}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"custom:eb-system-card",name:"SEM System Card",description:"Consolidated system panel for Solar Energy Management",preview:!1});const de={now:{icon:"mdi:clock-outline",color:"#5BC8D8"},solar_peak:{icon:"mdi:weather-sunny",color:"#ff9800"},solar_end:{icon:"mdi:weather-sunset",color:"#ff9800"},cheap_start:{icon:"mdi:arrow-down-bold",color:"#8DC892"},cheap_end:{icon:"mdi:arrow-up-bold",color:"#ff9800"},expensive_start:{icon:"mdi:flash-alert",color:"#f06292"},expensive_end:{icon:"mdi:flash-off",color:"#8DC892"},night_open:{icon:"mdi:weather-night",color:"#8353d1"},night_end:{icon:"mdi:weather-sunset-up",color:"#ff9800"},ev_charge_start:{icon:"mdi:ev-station",color:"#8DC892"},ev_min_reached:{icon:"mdi:battery-charging-80",color:"#4db6ac"},ev_target_reached:{icon:"mdi:car-electric",color:"#8DC892"},ev_deadline:{icon:"mdi:clock-end",color:"#f06292"},ev_wait:{icon:"mdi:pause-circle",color:"#8353d1"},battery_full:{icon:"mdi:battery-charging-100",color:"#f06292"},battery_empty:{icon:"mdi:battery-low",color:"#4db6ac"}};bt("eb-today-plan-card",class extends vt{setConfig(t){super.setConfig(t),this._entity=t.entity||"sensor.ebi_charging_state"}set hass(t){this._hass=t;const e=(t?.states[this._entity]?.attributes||{}).today_plan||[],i=[e.length,e[0]?.when,e.at(-1)?.when,this._lang].join("|"),s="function"==typeof semLocalize;(i!==this._lastKey||s&&!this._localizeReady)&&(this._lastKey=i,this._lang=t?.language,this._localizeReady=s,this.requestUpdate())}get hass(){return this._hass}_hm(t){if(!t)return"—";try{const e=new Date(t),i=this._hass?.config?.time_zone||void 0,s=ut(t,i),r=t=>t.toLocaleDateString("en-CA",{timeZone:i}),a=r(e),o=new Date;if(a===r(o))return s;if(a===r(new Date(o.getTime()+864e5))){return`${this._t("tomorrow")||"Tomorrow"} ${s}`}return`${e.toLocaleDateString([],{weekday:"short",timeZone:i})} ${s}`}catch(t){return"—"}}_format(t,e){let i=this._t(t);if(!i||i===t)return null;for(const[t,s]of Object.entries(e||{}))i=i.replace(new RegExp(`\\{${t}\\}`,"g"),s);return i}render(){if(!this._hass||!this._config)return Y;const t=this._hass.states[this._entity],e=t?.attributes?.today_plan||[];return!Array.isArray(e)||e.length<=1?(this.style.display="none",Y):(this.style.display="",j`
            <ha-card>
                <div class="wrap">
                    <div class="head">
                        <ha-icon icon="mdi:calendar-clock" style="--mdc-icon-size:16px;color:#5BC8D8"></ha-icon>
                        <span class="title">${this._t("today_plan_title")}</span>
                    </div>
                    <ul class="rows">
                        ${e.map(t=>{const e=de[t.kind]||de.now,i=this._format(t.label,t.values)||t.label,s=t.detail?this._format(t.detail,t.values):null;return j`
                                <li class="row ${"now"===t.kind?"now":""}">
                                    <span class="time">${this._hm(t.when)}</span>
                                    <ha-icon icon="${e.icon}" style="--mdc-icon-size:14px;color:${e.color}"></ha-icon>
                                    <div class="text">
                                        <span class="label">${i}</span>
                                        ${s?j`<span class="detail">${s}</span>`:Y}
                                    </div>
                                </li>
                            `})}
                    </ul>
                </div>
            </ha-card>
        `)}static get styles(){return a`
            :host { display: block; }
            ha-card {
                background: var(--card-background-color, #1e232d);
                backdrop-filter: blur(16px) saturate(160%);
                -webkit-backdrop-filter: blur(16px) saturate(160%);
                border: 1px solid rgba(255,255,255,0.06);
                border-radius: 14px;
            }
            .wrap { padding: 12px 14px; }
            .head {
                display: flex; align-items: center; gap: 6px;
                margin-bottom: 8px;
                opacity: 0.85;
            }
            .title {
                font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase;
                color: var(--primary-text-color);
            }
            .rows { list-style: none; padding: 0; margin: 0; }
            .row {
                display: grid;
                grid-template-columns: 64px 18px 1fr;
                align-items: center; gap: 10px;
                padding: 5px 0;
                font-size: 13px;
                color: var(--primary-text-color);
                border-bottom: 1px dashed rgba(255,255,255,0.04);
            }
            .row:last-child { border-bottom: none; }
            .row.now {
                background: linear-gradient(90deg, rgba(91,200,216,0.10), transparent);
                margin-left: -4px; padding-left: 4px;
                border-radius: 4px;
            }
            .time {
                font-variant-numeric: tabular-nums;
                font-weight: 600;
                color: var(--secondary-text-color);
                font-size: 12px;
            }
            .text { display: flex; flex-direction: column; min-width: 0; }
            .label { font-weight: 500; line-height: 1.2; }
            .detail {
                font-size: 11px; opacity: 0.65; line-height: 1.2;
            }
        `}},{name:"SEM Today's Plan",description:"Forward-looking schedule combining tariff, solar, and EV"});const pe=2;class ue{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}class ge extends ue{constructor(t){if(super(t),this.it=Y,t.type!==pe)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===Y||null==t)return this._t=void 0,this.it=t;if(t===U)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.it)return this._t;this.it=t;const e=[t];return e.raw=e,this._t={_$litType$:this.constructor.resultType,strings:e,values:[]}}}ge.directiveName="unsafeHTML",ge.resultType=1;class fe extends ge{}fe.directiveName="unsafeSVG",fe.resultType=2;const _e=(t=>(...e)=>({_$litDirective$:t,values:e}))(fe),me={solar:{nameKey:"solar",color:"#ff9800"},grid:{nameKey:"grid",color_import:"#488fc2",color_export:"#8353d1"},battery:{nameKey:"battery",color:"#4db6ac"},home:{nameKey:"home",color:"#5BC8D8"},ev:{nameKey:"ev_charger",color:"#8DC892"},inverter:{nameKey:"inverter",color:"#96CAEE"}};bt("eb-flow-card",class extends vt{constructor(){super(),this._lastKey="",this._animFrames={},this._currentValues={},this._compact=!1,this._visible=!0,this._deviceConfigSig="",this._devicePositions=[],this._updateTimer=null,this._resizeObserver=null,this._intersectionObserver=null,this._resizeTimeout=null,this._mode="prefix",this._prefix="sensor.ebi_",this._entities=null}setConfig(t){if(this._config=t,t.entity_prefix)this._mode="prefix",this._prefix=t.entity_prefix;else{if(!t.entities)throw new Error('eb-flow-card requires either "entities" or "entity_prefix" config');this._mode="entities",this._entities=t.entities}this._showLabels=!1!==t.show_labels,this._showValues=!1!==t.show_values,this._showGlow=!1!==t.show_glow,this._showInverter=!1!==t.show_inverter,this.requestUpdate()}set hass(t){this._hass,this._hass=t;const e=t?.language;if(e!==this._lang)return this._lang=e,void this.requestUpdate();const i=mt(t,this._prefix);if(i!==this._lastPVKey)return this._lastPVKey=i,void this.requestUpdate();this._visible&&(clearTimeout(this._updateTimer),this._updateTimer=setTimeout(()=>this._updateFlowsImperative(),100))}get hass(){return this._hass}firstUpdated(){this._resizeTimeout=null,this._resizeObserver=new ResizeObserver(t=>{this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(()=>{for(const e of t){const t=e.contentRect.width<400;t!==this._compact&&(this._compact=t,this._lastKey="",this._deviceConfigSig="",this.requestUpdate())}},100)}),this._resizeObserver.observe(this),this._intersectionObserver=new IntersectionObserver(t=>{this._visible=t[0].isIntersecting;const e=this.renderRoot.querySelector("svg");e&&(e.style.animationPlayState=this._visible?"running":"paused")},{threshold:.01}),this._intersectionObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null),clearTimeout(this._updateTimer),clearTimeout(this._resizeTimeout);for(const t of Object.keys(this._animFrames))cancelAnimationFrame(this._animFrames[t]);this._animFrames={}}updated(){this._setupClickHandlers(),this._updateFlowsImperative()}static get styles(){return a`
            :host { display: block; }
            ha-card {
                overflow: hidden; padding: 0;
                background: var(--ha-card-background, var(--card-background-color, transparent)) !important;
                border-radius: var(--ha-card-border-radius, 12px);
            }
            svg { width: 100%; display: block; }
            .flow-group { transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1); }
            .glow-ring { transition: opacity 1s ease; }
            #soc-arc, #autarky-arc { transition: stroke-dashoffset 1.5s cubic-bezier(0.4,0,0.2,1), stroke 1s ease; }
            text { font-variant-numeric: tabular-nums; }
            @keyframes socPulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
            @keyframes socDrain { 0%,100%{opacity:0.75} 50%{opacity:0.4} }
            .clickable-node { cursor: pointer; pointer-events: bounding-box; }
            .clickable-node:hover { opacity: 0.85; }
            .device-clickable { cursor: pointer; }
            .device-clickable:hover { opacity: 0.85; }
        `}render(){if(!this._config)return Y;const t=this._getLayout(),e=t.solar,i=t.inverter,s=t.battery,r=t.grid,a=t.home,o=t.ev,n=(2*Math.PI*t.socR).toFixed(1),l=(2*Math.PI*t.autarkyR).toFixed(1),c=t.font.label,h=t.font.value,d=t.font.sub,p=t.font.homeVal,u="'Segoe UI','Roboto',sans-serif",g=this._getNodeColor("grid_import"),f=this._getNodeColor("grid_export"),_=this._getNodeColor("solar"),m=this._getNodeColor("battery"),y=this._getNodeColor("home"),x=this._getNodeColor("ev"),b=me.inverter.color,v=this._hasNode("solar"),w=this._hasNode("battery"),$=this._hasNode("grid"),k=this._hasNode("ev"),M=this._showInverter&&this._hasNode("inverter"),S=yt(this._hass,this._prefix);return j`
            <ha-card>
                <style>${xt}</style>
                ${S.length>=2?j`
                    <div class="pv-strings-row">
                        ${S.map(t=>j`
                            <div class="pv-chip"
                                 title="${t.entityId}"
                                 data-entity="${t.entityId}"
                                 @click=${()=>this._fireMoreInfo?.(t.entityId)}>
                                <span class="pv-chip-label">PV${t.slot.replace(/^pv/,"")}</span>
                                <span class="pv-chip-value">${(Math.abs(t.watts)/1e3).toFixed(2)} kW</span>
                            </div>
                        `)}
                    </div>
                `:Y}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="${t.vb}" style="background:transparent">
                    <defs>
                        <radialGradient id="bgGrad" cx="50%" cy="45%" r="60%">
                            <stop offset="0%" style="stop-color:var(--primary-text-color,#c8dcf0);stop-opacity:0.04"/>
                            <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
                        </radialGradient>
                        <pattern id="dotGrid" width="50" height="50" patternUnits="userSpaceOnUse">
                            <circle cx="25" cy="25" r="0.7" fill="var(--secondary-text-color,#808080)" opacity="0.12"/>
                        </pattern>
                        ${this._svgRaw(this._glowFilter("glowSolar",_,8))}
                        ${this._svgRaw(this._glowFilter("glowBattery",m,8))}
                        ${this._svgRaw(this._glowFilter("glowGridImport",g,8))}
                        ${this._svgRaw(this._glowFilter("glowGridExport",f,8))}
                        ${this._svgRaw(this._glowFilter("glowHome",y,10))}
                        ${this._svgRaw(this._glowFilter("glowEV",x,8))}
                        ${this._svgRaw(this._glowFilter("glowInverter",b,6))}
                        <path id="path-solar"   d="${t.paths.solar}"/>
                        <path id="path-home"    d="${t.paths.home}"/>
                        <path id="path-battery" d="${t.paths.battery}"/>
                        <path id="path-grid"    d="${t.paths.grid}"/>
                        <path id="path-ev"      d="${t.paths.ev}"/>
                    </defs>

                    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
                    <rect width="100%" height="90%"  fill="url(#dotGrid)"/>

                    ${this._svgRaw(v?this._track(t.paths.solar,_):"")}
                    ${this._svgRaw(v||M?this._track(t.paths.home,y):"")}
                    ${this._svgRaw(w?this._track(t.paths.battery,m):"")}
                    ${this._svgRaw($?`<path id="track-grid" d="${t.paths.grid}" fill="none" stroke="${g}" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.18"/>`:"")}
                    ${this._svgRaw(k?this._track(t.paths.ev,x):"")}

                    ${this._svgRaw(v?`<g id="flow-solar" class="flow-group" style="opacity:0" data-path-id="path-solar" data-path-d="${t.paths.solar}" data-color="${_}" data-count="2"></g>`:"")}
                    ${this._svgRaw(w?`<g id="flow-battery" class="flow-group" style="opacity:0" data-path-id="path-battery" data-path-d="${t.paths.battery}" data-color="${m}" data-count="3"></g>`:"")}
                    ${this._svgRaw($?`<g id="flow-grid" class="flow-group" style="opacity:0" data-path-id="path-grid" data-path-d="${t.paths.grid}" data-color="${g}" data-count="3"></g>`:"")}
                    ${this._svgRaw(v||M?`<g id="flow-home" class="flow-group" style="opacity:0" data-path-id="path-home" data-path-d="${t.paths.home}" data-color="${y}" data-count="2"></g>`:"")}
                    ${this._svgRaw(k?`<g id="flow-ev" class="flow-group" style="opacity:0" data-path-id="path-ev" data-path-d="${t.paths.ev}" data-color="${x}" data-count="3"></g>`:"")}

                    ${this._svgRaw(v?`\n                    <g id="node-solar" filter="url(#glowSolar)">\n                        ${this._glowRing(e,_)}\n                        <circle cx="${e.cx}" cy="${e.cy}" r="${e.r}" fill="${this._hexToRgba(_,.07)}" stroke="${_}" stroke-width="1.8"/>\n                        <g transform="translate(${e.cx},${e.cy-8})" stroke="${_}" fill="none" opacity="0.75">\n                            <rect x="-16" y="-12" width="32" height="24" rx="3" stroke-width="1.8"/>\n                            <line x1="-16" y1="0" x2="16" y2="0" stroke-width="1.2"/>\n                            <line x1="-5" y1="-12" x2="-5" y2="12" stroke-width="1.2"/>\n                            <line x1="5" y1="-12" x2="5" y2="12" stroke-width="1.2"/>\n                            <line x1="0" y1="12" x2="0" y2="17" stroke-width="1.5"/>\n                            <line x1="-7" y1="17" x2="7" y2="17" stroke-width="1.5"/>\n                        </g>\n                    </g>\n                    <text x="${e.cx}" y="${e.cy+e.r+18}" text-anchor="middle" font-family="${u}" font-size="${c}" font-weight="600" fill="${_}">${this._escSvg(this._getNodeName("solar"))}</text>\n                    <text id="val-solar" x="${e.cx}" y="${e.cy+e.r+18+.9*h}" text-anchor="middle" font-family="${u}" font-size="${h}" font-weight="700" fill="${_}">0 W</text>\n                    <text id="val-today-solar" x="${e.cx}" y="${e.cy+e.r+18+.9*h+d+4}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${_}" opacity="0.7"> </text>\n                    `:"")}

                    ${this._svgRaw(M?`\n                    <g id="node-inverter" filter="url(#glowInverter)">\n                        <circle cx="${i.cx}" cy="${i.cy}" r="${i.r}" fill="${this._hexToRgba(b,.07)}" stroke="${b}" stroke-width="1"/>\n                        <path d="M${i.cx-10},${i.cy} Q${i.cx-4},${i.cy-8} ${i.cx},${i.cy} Q${i.cx+4},${i.cy+8} ${i.cx+10},${i.cy}" fill="none" stroke="${b}" stroke-width="1.8" opacity="0.7"/>\n                    </g>\n                    <text id="val-inverter-status" x="${i.cx}" y="${i.cy+i.r+14}" text-anchor="middle" font-family="${u}" font-size="${this._compact?11:10}" fill="var(--secondary-text-color,#5a7a9a)" opacity="0.7"> </text>\n                    `:"")}

                    ${this._svgRaw(w?`\n                    <g id="node-battery" filter="url(#glowBattery)">\n                        ${this._glowRing(s,m)}\n                        <circle cx="${s.cx}" cy="${s.cy}" r="${s.r}" fill="${this._hexToRgba(m,.07)}" stroke="${m}" stroke-width="1.8"/>\n                        <circle cx="${s.cx}" cy="${s.cy}" r="${t.socR}" fill="none" stroke="${this._hexToRgba(m,.1)}" stroke-width="5"/>\n                        <circle id="soc-arc" cx="${s.cx}" cy="${s.cy}" r="${t.socR}" fill="none" stroke="${m}" stroke-width="5"\n                                stroke-dasharray="${n}" stroke-dashoffset="${n}"\n                                transform="rotate(-90 ${s.cx} ${s.cy})" stroke-linecap="round" opacity="0.75"/>\n                        <g transform="translate(${s.cx},${s.cy}) scale(0.8)" stroke="${m}" fill="none" opacity="0.7">\n                            <rect x="-8" y="-13" width="16" height="26" rx="3" stroke-width="1.8"/>\n                            <rect x="-3" y="-16" width="6" height="4" rx="1.5" fill="${m}" opacity="0.5" stroke="none"/>\n                        </g>\n                    </g>\n                    <text x="${s.cx}" y="${s.cy+s.r+18}" text-anchor="middle" font-family="${u}" font-size="${c}" font-weight="600" fill="${m}">${this._escSvg(this._getNodeName("battery"))}</text>\n                    <text id="val-battery-soc" x="${s.cx}" y="${s.cy+s.r+18+.9*h}" text-anchor="middle" font-family="${u}" font-size="${h}" font-weight="700" fill="${m}">0%</text>\n                    <text id="val-battery-power" x="${s.cx}" y="${s.cy+s.r+18+.9*h+c}" text-anchor="middle" font-family="${u}" font-size="${c}" font-weight="500" fill="${m}" opacity="0.7">0 W</text>\n                    <text id="label-battery-state" x="${s.cx}" y="${s.cy+s.r+18+.9*h+2*c}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${m}" opacity="0.7"></text>\n                    <text id="val-today-battery" x="${s.cx}" y="${s.cy+s.r+18+.9*h+2*c+d+4}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${m}" opacity="0.65"> </text>\n                    `:"")}

                    ${this._svgRaw($?`\n                    <g id="node-grid" filter="url(#glowGridImport)">\n                        ${this._glowRing(r,g)}\n                        <circle id="grid-circle" cx="${r.cx}" cy="${r.cy}" r="${r.r}" fill="${this._hexToRgba(g,.07)}" stroke="${g}" stroke-width="1.8"/>\n                        <g id="grid-icon" transform="translate(${r.cx},${r.cy})" stroke="${g}" fill="none" opacity="0.7" stroke-width="1.8" stroke-linecap="round">\n                            <line x1="0" y1="-16" x2="0" y2="14"/>\n                            <line x1="-10" y1="-8" x2="10" y2="-8"/>\n                            <line x1="-7" y1="-1" x2="7" y2="-1"/>\n                            <line x1="-10" y1="-8" x2="-5" y2="14"/>\n                            <line x1="10" y1="-8" x2="5" y2="14"/>\n                        </g>\n                    </g>\n                    <text x="${r.cx}" y="${r.cy+r.r+18}" text-anchor="middle" font-family="${u}" font-size="${c}" font-weight="600" fill="${g}">${this._escSvg(this._getNodeName("grid"))}</text>\n                    <text id="val-grid" x="${r.cx}" y="${r.cy+r.r+18+.9*h}" text-anchor="middle" font-family="${u}" font-size="${h}" font-weight="700" fill="${g}">0 W</text>\n                    <text id="label-grid" x="${r.cx}" y="${r.cy+r.r+18+.9*h+c}" text-anchor="middle" font-family="${u}" font-size="${d}" font-weight="500" fill="${g}" opacity="0.7">GRID</text>\n                    <text id="val-today-grid" x="${r.cx}" y="${r.cy+r.r+18+.9*h+c+d+4}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${g}" opacity="0.65"> </text>\n                    `:"")}

                    <g id="node-home" filter="url(#glowHome)">
                        ${this._svgRaw(this._glowRing(a,y,1.4))}
                        <circle cx="${a.cx}" cy="${a.cy}" r="${a.r}" fill="${this._hexToRgba(y,.06)}" stroke="${y}" stroke-width="2"/>
                        <circle cx="${a.cx}" cy="${a.cy}" r="${t.autarkyR}" fill="none" stroke="${this._hexToRgba(y,.08)}" stroke-width="4"/>
                        <circle id="autarky-arc" cx="${a.cx}" cy="${a.cy}" r="${t.autarkyR}" fill="none" stroke="#4CAF50" stroke-width="4"
                                stroke-dasharray="${l}" stroke-dashoffset="${l}"
                                transform="rotate(-90 ${a.cx} ${a.cy})" stroke-linecap="round" opacity="0"/>
                        <g transform="translate(${a.cx},${a.cy-5})" stroke="${y}" fill="none" opacity="0.6" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M-20,2 L0,-14 L20,2"/>
                            <rect x="-14" y="2" width="28" height="20" rx="2"/>
                            <rect x="-4" y="10" width="8" height="12"/>
                        </g>
                    </g>
                    <text x="${a.cx}" y="${a.cy+a.r+18}" text-anchor="middle" font-family="${u}" font-size="${c+1}" font-weight="600" fill="${y}">${this._escSvg(this._getNodeName("home"))}</text>
                    <text id="val-home" x="${a.cx}" y="${a.cy+a.r+18+.9*p}" text-anchor="middle" font-family="${u}" font-size="${p}" font-weight="700" fill="${y}">0 W</text>
                    <text id="val-autarky" x="${a.cx}" y="${a.cy+a.r+18+.9*p+d+4}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${y}" opacity="0.7">\u00A0</text>
                    <text id="val-today-home" x="${a.cx}" y="${a.cy+a.r+18+.9*p+2*(d+4)}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${y}" opacity="0.65">\u00A0</text>

                    ${this._svgRaw(k?`\n                    <g id="node-ev" filter="url(#glowEV)">\n                        ${this._glowRing(o,x)}\n                        <circle cx="${o.cx}" cy="${o.cy}" r="${o.r}" fill="${this._hexToRgba(x,.07)}" stroke="${x}" stroke-width="1.8"/>\n                        <g transform="translate(${o.cx},${o.cy})" stroke="${x}" fill="none" opacity="0.7" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">\n                            <rect x="-8" y="-13" width="16" height="22" rx="3"/>\n                            <rect x="-5" y="-9" width="10" height="8" rx="1.5"/>\n                            <path d="M-1,-1 L0,3 L1,-1"/>\n                            <line x1="0" y1="9" x2="0" y2="13"/>\n                            <circle cx="0" cy="15" r="1.5" fill="${x}" opacity="0.4" stroke="none"/>\n                        </g>\n                    </g>\n                    <text x="${o.cx}" y="${o.cy+o.r+18}" text-anchor="middle" font-family="${u}" font-size="${c}" font-weight="600" fill="${x}">${this._escSvg(this._getNodeName("ev"))}</text>\n                    <text id="val-ev" x="${o.cx}" y="${o.cy+o.r+18+.9*h}" text-anchor="middle" font-family="${u}" font-size="${h}" font-weight="700" fill="${x}">0 W</text>\n                    <text id="val-today-ev" x="${o.cx}" y="${o.cy+o.r+18+.9*h+d+4}" text-anchor="middle" font-family="${u}" font-size="${d}" fill="${x}" opacity="0.65"> </text>\n                    <text id="val-ev-subtitle" x="${o.cx}" y="${o.cy+o.r+18+.9*h+2*(d+4)}" text-anchor="middle" font-family="${u}" font-size="${d-1}" fill="${x}" opacity="0.6"></text>\n                    `:"")}

                    <g id="device-labels"></g>

                    <text x="${this._compact?470:960}" y="${this._compact?1050:770}" text-anchor="end"
                          font-family="${u}" font-size="10" font-weight="300" letter-spacing="2"
                          fill="var(--secondary-text-color,#808080)" opacity="0.15">SEM</text>
                </svg>
            </ha-card>
        `}_svgRaw(t){return t?_e(t):Y}_escSvg(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"):""}_updateFlowsImperative(){if(!this._hass)return;let t,e,i,s=this._getState("solar_power");if(this._entities?.solar?.reverse&&(s=-s),"entities"===this._mode&&(this._entities?.battery?.charge||this._entities?.battery?.discharge))t=this._getState("battery_charge_power")-this._getState("battery_discharge_power");else{let e=this._getState("battery_power");t=this._entities?.battery?.reverse?-e:e}if("entities"===this._mode&&this._entities?.grid?.entity){const t=this._getState("grid_power"),s=this._entities.grid.reverse;e=Math.max(0,s?-t:t),i=Math.max(0,s?t:-t)}else e=this._getState("grid_import_power"),i=this._getState("grid_export_power");let r=this._getState("ev_power");this._entities?.ev?.invert&&(r=-r);const a=this._getState("battery_soc"),o=this._getState("autarky_rate"),n=Math.max(0,t),l=Math.max(0,-t),c=this._getEntityId("home_consumption_power");let h;c&&this._hass?.states[c]?(h=this._getState("home_consumption_power"),this._entities?.home?.invert&&(h=-h)):h=Math.max(0,s+e+l-i-n-r);const d=this._getStateStr("daily_solar_energy"),p=this._getStateStr("daily_ev_energy"),u=this._getStateStr("daily_grid_import_energy"),g=this._getStateStr("daily_grid_export_energy"),f=this._getStateStr("daily_battery_energy"),_=this._getStateStr("daily_home_energy"),m={solar:s,battery:t,gridImport:e,gridExport:i,home:h,ev:r,soc:a,autarky:o,dailySolar:d,dailyEv:p,dailyGridImport:u,dailyGridExport:g,dailyBattery:f,dailyHome:_},y=JSON.stringify(m);if(this._lastKey===y)return;this._lastKey=y,this._animateValue("val-solar",s);const x=t>10?"▼ ":t<-10?"▲ ":"";this._animateValue("val-battery-power",Math.abs(t),800,t=>x+pt(t));const b=e>i,v=b?"↓ ":i>10?"↑ ":"";this._animateValue("val-grid",b?e:i,800,t=>v+pt(t)),this._animateValue("val-home",h),this._animateValue("val-ev",r);const w=this._getState("ev_charger_count");this._setText("val-ev-subtitle",w>1?`(${w} ${this._t("chargers")})`:""),this._animateValue("val-battery-soc",a,800,t=>`${t.toFixed(0)}%`);const $=this._getEntityId("autarky_rate");$&&this._animateValue("val-autarky",o,800,t=>`⚡ ${t.toFixed(0)}% self`),this._setText("val-inverter-status",this._getStateStr("charging_state"));const k=this._t("today");this._setText("val-today-solar",d?`${k} ${d} kWh`:""),this._setText("val-today-ev",p?`${k} ${p} kWh`:""),this._setText("val-today-battery",f?`${k} ${f} kWh`:""),this._setText("val-today-home",_?`${k} ${_} kWh`:"");const M=[];if(u&&M.push(`↓${u}`),g&&M.push(`↑${g}`),u&&g){const t=(parseFloat(u)-parseFloat(g)).toFixed(1);M.push(`Net ${t>0?"+":""}${t}`)}this._setText("val-today-grid",M.length?M.join(" ")+" kWh":"");const S=this._getLayout(),C=this.renderRoot.getElementById("soc-arc");if(C){const t=2*Math.PI*S.socR;C.style.strokeDashoffset=(t*(1-a/100)).toFixed(1),C.style.animation=n>10?"socPulse 2s ease-in-out infinite":l>10?"socDrain 2.5s ease-in-out infinite":"none"}const D=this.renderRoot.getElementById("autarky-arc");if(D&&$&&o>0){const t=2*Math.PI*S.autarkyR;D.style.strokeDashoffset=(t*(1-o/100)).toFixed(1),D.style.stroke=this._autarkyColor(o),D.style.opacity="0.75"}else D&&(D.style.opacity="0");const z=b?this._getNodeColor("grid_import"):i>10?this._getNodeColor("grid_export"):this._getNodeColor("grid_import");this._updateGridColor(z,b);const E=this.renderRoot.getElementById("label-grid");E&&(E.textContent=b?this._t("importing"):i>10?this._t("exporting"):this._t("grid"));const P=n>10?"#f06292":l>10?"#4db6ac":this._getNodeColor("battery"),T=this.renderRoot.getElementById("label-battery-state");T&&(T.textContent=n>10?this._t("charging"):l>10?this._t("discharging"):"");for(const t of["val-battery-soc","val-battery-power","label-battery-state","val-today-battery"]){const e=this.renderRoot.getElementById(t);e&&e.setAttribute("fill",P)}const F=this.renderRoot.getElementById("soc-arc");F&&(n>10||l>10)&&(F.style.stroke=P),this._updateFlow("flow-solar",s>10,!1,gt(s)),this._updateFlow("flow-battery",Math.abs(t)>10,t<0,gt(t),P),this._updateFlow("flow-grid",e>10||i>10,b,gt(e||i),z),this._updateFlow("flow-home",h>10,!1,gt(h)),this._updateFlow("flow-ev",r>10,!1,gt(r)),this._setGlowIntensity("node-solar",s,1e4),this._setGlowIntensity("node-battery",Math.abs(t),5e3),this._setGlowIntensity("node-grid",Math.max(e,i),1e4),this._setGlowIntensity("node-home",h,8e3),this._setGlowIntensity("node-ev",r,11e3),this._updateDeviceLabels()}_updateFlow(t,e,i,s,r){const a=this.renderRoot.getElementById(t);if(!a)return;if(a.style.opacity=e?"1":"0",!e)return void(a.dataset.sig="");const o=r||a.dataset.color;r&&(a.dataset.color=r);const n=a.dataset.pathId,l=a.dataset.pathD,c=parseInt(a.dataset.count,10)||2,h=`${i?"r":"f"}:${s.toFixed(1)}:${o}`;a.dataset.sig!==h&&(a.dataset.sig=h,a.innerHTML=this._flowEffects(l,n,o,c,s,i))}_flowEffects(t,e,i,s,r,a){const o=r.toFixed(1),n=a?' keyPoints="1;0" keyTimes="0;1"':"";let l=`<path d="${t}" fill="none" stroke="${i}" stroke-width="3"\n                     stroke-dasharray="12,20" opacity="0.5" stroke-linecap="round">\n                     <animate attributeName="stroke-dashoffset" from="0" to="${a?"32":"-32"}"\n                              dur="${o}s" repeatCount="indefinite"/>\n                   </path>`;for(let t=0;t<s;t++){const a=t/s*r;l+=`\n                <circle r="5" fill="${i}" opacity="0.12">\n                    <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="paced"${n} begin="-${a.toFixed(2)}s">\n                        <mpath href="#${e}"/>\n                    </animateMotion>\n                </circle>\n                <circle r="2.5" fill="${i}" opacity="0.9">\n                    <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="paced"${n} begin="-${a.toFixed(2)}s">\n                        <mpath href="#${e}"/>\n                    </animateMotion>\n                </circle>`}return l}_updateGridColor(t,e){const i=this.renderRoot.getElementById("node-grid");i&&i.setAttribute("filter",`url(#glowGrid${e?"Import":"Export"})`);const s=this.renderRoot.getElementById("grid-circle");s&&(s.setAttribute("stroke",t),s.setAttribute("fill",this._hexToRgba(t,.07)));const r=this.renderRoot.querySelector("#node-grid .glow-ring");r&&r.setAttribute("stroke",t);const a=this.renderRoot.getElementById("grid-icon");a&&a.setAttribute("stroke",t);for(const e of["val-grid","label-grid","val-today-grid"]){const i=this.renderRoot.getElementById(e);i&&i.setAttribute("fill",t)}const o=this.renderRoot.getElementById("track-grid");o&&o.setAttribute("stroke",t)}_updateDeviceLabels(){const t=this.renderRoot.getElementById("device-labels");if(!t)return;const e=this._getDeviceList(),i=e.map(([t,e],i)=>`${e.power_entity}:${e.name}:${e.color||dt[i%dt.length]}:${e.icon_override||""}:${e.daily_energy_entity||""}`).join("|");this._deviceConfigSig!==i&&(this._deviceConfigSig=i,this._buildDeviceDOM(t,e)),this._updateDeviceValues(e)}_getDeviceList(){let t=[];if("entities"===this._mode&&this._entities?.individual)t=this._entities.individual.map((t,e)=>[t.entity||`device_${e}`,{name:t.name||t.entity?.split(".").pop()||`Device ${e+1}`,power_entity:t.entity,device_type:t.device_type||"appliance",is_on:!1,current_power:0,color:t.color,icon_override:t.icon,daily_energy_entity:t.daily_energy}]);else if("prefix"===this._mode){const e=this._hass.states[`${this._prefix}controllable_devices_count`];e?.attributes?.devices&&(t=Object.entries(e.attributes.devices).filter(([,t])=>t.power_entity||t.current_power>0).sort((t,e)=>(t[1].priority||5)-(e[1].priority||5)))}return t.slice(0,6)}_buildDeviceDOM(t,e){if(!e.length)return t.innerHTML="",void(this._devicePositions=[]);const i="'Segoe UI','Roboto',sans-serif",s=this._getLayout(),r=s.home,a=this._compact,o=a?26:24,n=a?2:Math.min(e.length,3),l=a?30:60,c=((a?500:1e3)-2*l)/n,h=s.deviceY,d=a?18:20;let p="";this._devicePositions=[],e.forEach(([t,e],s)=>{let u=e.name||t;u.length>d&&(u=u.substring(0,d-1)+"…");const g=e.color||dt[s%dt.length],f=this._deviceIcon(e.device_type,e.name||t),_=s%n,m=Math.floor(s/n),y=l+_*c+c/2,x=h+m*(a?100:90);this._devicePositions.push({cx:y,cy:x,nodeR:o,color:g}),p+=`<path id="dev-conn-${s}" d="M${r.cx},${r.cy+r.r} C${r.cx},${r.cy+r.r+30} ${y},${x-40} ${y},${x-o}" fill="none" stroke="${g}" stroke-width="1.2" stroke-dasharray="3,5" opacity="0.1"/>`,p+=`<g id="dev-flow-${s}"></g>`,p+=`<path id="dev-path-${s}" d="M${r.cx},${r.cy+r.r} C${r.cx},${r.cy+r.r+30} ${y},${x-40} ${y},${x-o}" fill="none" stroke="none"/>`;const b=e.power_entity?` data-entity="${e.power_entity}"`:"";p+=`<g id="dev-group-${s}" class="device-clickable"${b} data-idx="${s}">`,p+=`<circle id="dev-circle-${s}" cx="${y}" cy="${x}" r="${o}" fill="rgba(128,128,128,0.03)" stroke="${g}" stroke-width="1.2" opacity="0.4"/>`,p+=`<g transform="translate(${y},${x})" stroke="${g}" fill="none" opacity="0.35" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${f}</g>`,p+=`<text x="${y}" y="${x+o+14}" text-anchor="middle" font-family="${i}" font-size="11" font-weight="500" fill="${g}" opacity="0.8">${this._escSvg(u)}</text>`,p+=`<text id="dev-val-${s}" x="${y}" y="${x+o+14+11+2}" text-anchor="middle" font-family="${i}" font-size="11" font-weight="600" fill="${g}" opacity="0.7">0 W</text>`,p+=`<text id="dev-daily-${s}" x="${y}" y="${x+o+14+26}" text-anchor="middle" font-family="${i}" font-size="11" fill="${g}" opacity="0.65"></text>`,p+="</g>"}),t.innerHTML=p,t.querySelectorAll(".device-clickable[data-entity]").forEach(t=>{const e=parseInt(t.dataset.idx);this._setupNodeActions(t,`device_${e}`,t.dataset.entity)}),e.forEach((t,e)=>{delete this._currentValues[`dev-val-${e}`]})}_updateDeviceValues(t){const e=this._getLayout().home;t.forEach(([t,i],s)=>{const r=i.power_entity?this._hass.states[i.power_entity]:null,a=r?parseFloat(r.state)||0:i.current_power||0,o=a>5,n=i.color||dt[s%dt.length],l=this._devicePositions[s];if(!l)return;if(this._animateValue(`dev-val-${s}`,a),i.daily_energy_entity){const t=this._hass.states[i.daily_energy_entity];this._setText(`dev-daily-${s}`,t?`${this._t("today")} ${t.state} kWh`:"")}const c=this.renderRoot.getElementById(`dev-conn-${s}`);c&&c.setAttribute("opacity",o?"0.3":"0.1");const h=this.renderRoot.getElementById(`dev-circle-${s}`);h&&(h.setAttribute("fill",`rgba(128,128,128,${o?.08:.03})`),h.setAttribute("opacity",o?"1":"0.4"));const d=this.renderRoot.getElementById(`dev-val-${s}`);d&&d.setAttribute("opacity",o?"1":"0.5");const p=this.renderRoot.getElementById(`dev-group-${s}`);if(p){const t=p.querySelector("g[transform]");t&&t.setAttribute("opacity",o?"0.7":"0.35")}const u=this.renderRoot.getElementById(`dev-flow-${s}`);if(u)if(a>5){const t=gt(a).toFixed(1);if(u.dataset.sig!==t){u.dataset.sig=t;const i=`M${e.cx},${e.cy+e.r} C${e.cx},${e.cy+e.r+30} ${l.cx},${l.cy-40} ${l.cx},${l.cy-l.nodeR}`;u.innerHTML=`\n                            <path d="${i}" fill="none" stroke="${n}" stroke-width="2" stroke-dasharray="8,16" opacity="0.4" stroke-linecap="round">\n                                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="${t}s" repeatCount="indefinite"/>\n                            </path>\n                            <circle r="2" fill="${n}" opacity="0.8">\n                                <animateMotion dur="${t}s" repeatCount="indefinite" calcMode="paced" begin="-${(.3*s).toFixed(1)}s">\n                                    <mpath href="#dev-path-${s}"/>\n                                </animateMotion>\n                            </circle>`}}else""!==u.dataset.sig&&(u.dataset.sig="",u.innerHTML="")})}_setupClickHandlers(){const t={"node-solar":"solar_power","val-solar":"solar_power","val-today-solar":"daily_solar_energy","node-battery":"battery_soc","val-battery-soc":"battery_soc","val-battery-power":"battery_power","label-battery-state":"battery_power","val-today-battery":"daily_battery_energy","node-grid":"grid_import_power","val-grid":"grid_import_power","label-grid":"grid_import_power","val-today-grid":"daily_grid_import_energy","node-home":"home_consumption_power","val-home":"home_consumption_power","val-autarky":"autarky_rate","val-today-home":"daily_home_energy","node-ev":"ev_power","val-ev":"ev_power","val-today-ev":"daily_ev_energy","val-inverter-status":"charging_state"};for(const[e,i]of Object.entries(t)){const t=this._getEntityId(i);if(!t)continue;const s=this.renderRoot.getElementById(e);s&&(s.setAttribute("data-entity",t),s.style.cursor="pointer")}const e=this.renderRoot.querySelector("svg");e&&!e._semClickBound&&(e._semClickBound=!0,e.addEventListener("click",t=>{let i=t.target;for(let t=0;t<5&&i&&i!==e;t++){const t=i.getAttribute?.("data-entity");if(t)return void this._fireMoreInfo(t);i=i.parentElement}}));const i=[{ids:["node-solar"],node:"solar",key:"solar_power"},{ids:["node-battery"],node:"battery",key:"battery_soc"},{ids:["node-grid"],node:"grid",key:"grid_import_power"},{ids:["node-home"],node:"home",key:"home_consumption_power"},{ids:["node-ev"],node:"ev",key:"ev_power"}];for(const{ids:t,node:e,key:s}of i){const i=this._getEntityId(s);if(i)for(const s of t){const t=this.renderRoot.getElementById(s);t&&!t._semActionsBound&&(t._semActionsBound=!0,t.classList.add("clickable-node"),this._setupNodeActions(t,e,i))}}}_setupNodeActions(t,e,i){let s=null,r=!1,a=0,o=null;t.style.cursor="pointer",t.addEventListener("pointerdown",()=>{r=!1,s=setTimeout(()=>{r=!0;const t=this._getActionConfig(e,"hold_action");"none"!==t.action&&this._handleAction(t,i)},500)}),t.addEventListener("pointerup",()=>clearTimeout(s)),t.addEventListener("pointercancel",()=>{clearTimeout(s),r=!1}),t.addEventListener("click",()=>{if(r)return void(r=!1);const t=this._getActionConfig(e,"double_tap_action");if(!t||"none"===t.action)return void this._handleAction(this._getActionConfig(e,"tap_action"),i);const s=Date.now();s-a<300?(clearTimeout(o),a=0,this._handleAction(t,i)):(a=s,o=setTimeout(()=>{a=0,this._handleAction(this._getActionConfig(e,"tap_action"),i)},300))})}_getActionConfig(t,e){const i=this._entities;if(!i)return{action:"tap_action"===e?"more-info":"none"};let s;if(t.startsWith("device_")){const e=parseInt(t.split("_")[1]);s=i.individual?.[e]}else{s={solar:i.solar,battery:i.battery,grid:i.grid,home:i.home,ev:i.ev||i.individual?.[0]}[t]}const r=s?.[e];return r?"string"==typeof r?{action:r}:r:{action:"tap_action"===e?"more-info":"none"}}_handleAction(t,e){switch(t||(t={action:"more-info"}),t.action){case"more-info":this._fireMoreInfo(t.entity||e);break;case"toggle":this._hass&&this._hass.callService("homeassistant","toggle",{entity_id:t.entity||e});break;case"navigate":t.navigation_path&&(window.history.pushState(null,"",t.navigation_path),window.dispatchEvent(new CustomEvent("location-changed")));break;case"call-service":if(t.service&&this._hass){const[e,i]=t.service.split(".");this._hass.callService(e,i,t.service_data||{})}break;case"url":t.url_path&&window.open(t.url_path,"_blank")}}_fireMoreInfo(t){t&&this.dispatchEvent(new CustomEvent("hass-more-info",{detail:{entityId:t},bubbles:!0,composed:!0}))}_setGlowIntensity(t,e,i){const s=this.renderRoot.querySelector(`#${t} .glow-ring`);if(!s)return;const r=Math.min(1,Math.abs(e)/i);s.style.opacity=(.15+.85*r).toFixed(2)}_animateValue(t,e,i=800,s=null){const r=this.renderRoot.getElementById(t);if(!r)return;this._animFrames[t]&&cancelAnimationFrame(this._animFrames[t]);const a=s||(t=>pt(t)),o=this._currentValues[t]||0;if(this._currentValues[t]=e,Math.abs(o-e)<.5)return void(r.textContent=a(e));const n=performance.now(),l=s=>{const c=Math.min(1,(s-n)/i),h=c<.5?2*c*c:1-Math.pow(-2*c+2,2)/2;r.textContent=a(o+(e-o)*h),c<1?this._animFrames[t]=requestAnimationFrame(l):delete this._animFrames[t]};this._animFrames[t]=requestAnimationFrame(l)}_setText(t,e){const i=this.renderRoot.getElementById(t);i&&(i.textContent=e)}_getState(t){if(!this._hass)return 0;const e="prefix"===this._mode?`${this._prefix}${t}`:this._resolveEntity(t);if(!e)return 0;const i=this._hass.states[e];if(!i)return 0;const s=parseFloat(i.state);return isNaN(s)?0:s}_getStateStr(t){if(!this._hass)return"";const e="prefix"===this._mode?`${this._prefix}${t}`:this._resolveEntity(t);if(!e)return"";const i=this._hass.states[e];return i?i.state:""}_getEntityId(t){return"prefix"===this._mode?`${this._prefix}${t}`:this._resolveEntity(t)}_resolveEntity(t){const e=this._entities;if(!e)return null;return{solar_power:e.solar?.entity,battery_power:e.battery?.entity,battery_charge_power:e.battery?.charge,battery_discharge_power:e.battery?.discharge,grid_power:e.grid?.entity,grid_import_power:e.grid?.consumption,grid_export_power:e.grid?.production,ev_power:e.ev?.entity||e.individual?.[0]?.entity,battery_soc:e.battery?.state_of_charge,home_consumption_power:e.home?.entity,charging_state:e.inverter?.entity,daily_solar_energy:e.solar?.daily_energy,daily_ev_energy:e.ev?.daily_energy||e.individual?.[0]?.daily_energy,daily_grid_import_energy:e.grid?.daily_import_energy,daily_grid_export_energy:e.grid?.daily_export_energy,daily_battery_energy:e.battery?.daily_energy,daily_home_energy:e.home?.daily_energy,autarky_rate:e.home?.autarky,ev_charger_count:e.ev?.charger_count||"sensor.ebi_ev_charger_count"}[t]||null}_hasNode(t){if("prefix"===this._mode)return!0;const e=this._entities;if(!e)return!1;return{solar:!!e.solar?.entity,battery:!!(e.battery?.entity||e.battery?.charge||e.battery?.discharge),grid:!(!e.grid?.consumption&&!e.grid?.entity),home:!0,ev:!(!e.ev?.entity&&!e.individual?.[0]?.entity),inverter:!!e.inverter?.entity||!!e.solar?.entity}[t]||!1}_getNodeColor(t){const e=this._entities,i={solar:me.solar.color,battery:me.battery.color,grid:me.grid.color_import,grid_import:me.grid.color_import,grid_export:me.grid.color_export,home:me.home.color,ev:me.ev.color,inverter:me.inverter.color};if(!e)return i[t]||"#888";return{solar:e.solar?.color,battery:e.battery?.color,grid:e.grid?.color_import,grid_import:e.grid?.color_import,grid_export:e.grid?.color_export,home:e.home?.color,ev:e.ev?.color||e.individual?.[0]?.color}[t]||i[t]||"#888"}_getNodeName(t){const e=this._entities,i=me[t]?.nameKey,s=i?this._t(i):t;if(!e)return s;return{solar:e.solar?.name,battery:e.battery?.name,grid:e.grid?.name,home:e.home?.name,ev:e.ev?.name||e.individual?.[0]?.name}[t]||s}_getLayout(){return this._compact?{vb:"0 0 500 1100",solar:{cx:250,cy:70,r:48},inverter:{cx:250,cy:225,r:20},battery:{cx:100,cy:340,r:48},grid:{cx:400,cy:340,r:48},home:{cx:250,cy:510,r:60},ev:{cx:100,cy:660,r:42},socR:33,autarkyR:48,paths:{solar:"M250,118 L250,205",home:"M250,245 L250,450",battery:"M230,230 C180,260 120,290 100,292",grid:"M270,230 C320,260 380,290 400,292",ev:"M230,240 C180,380 130,560 100,618"},font:{label:14,value:22,sub:12,homeVal:26},deviceY:810}:{vb:"0 0 1000 800",solar:{cx:500,cy:65,r:50},inverter:{cx:500,cy:210,r:20},battery:{cx:150,cy:270,r:50},grid:{cx:850,cy:270,r:50},home:{cx:500,cy:385,r:62},ev:{cx:150,cy:460,r:44},socR:40,autarkyR:50,paths:{solar:"M500,115 L500,190",home:"M500,230 L500,323",battery:"M480,215 C380,230 250,245 200,270",grid:"M520,215 C620,230 750,245 800,270",ev:"M480,225 C380,330 250,410 195,460"},font:{label:13,value:20,sub:11,homeVal:24},deviceY:590}}_glowFilter(t,e,i){return`<filter id="${t}" x="-30%" y="-30%" width="160%" height="160%">\n            <feGaussianBlur stdDeviation="${i}" result="blur"/>\n            <feFlood flood-color="${e}" flood-opacity="0.25"/>\n            <feComposite in2="blur" operator="in"/>\n            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>\n        </filter>`}_glowRing(t,e,i=1.2){const s=t.r+5;return`<circle class="glow-ring" cx="${t.cx}" cy="${t.cy}" r="${s}" fill="none" stroke="${e}" stroke-width="${i}" opacity="0.3">\n            <animate attributeName="r" values="${s};${s+5};${s}" dur="3s" repeatCount="indefinite"/>\n            <animate attributeName="opacity" values="0.3;0.12;0.3" dur="3s" repeatCount="indefinite"/>\n        </circle>`}_track(t,e){return`<path d="${t}" fill="none" stroke="${e}" stroke-width="1.5" stroke-dasharray="4,6" opacity="0.18"/>`}_hexToRgba(t,e){const i=t.match(/^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);return i?`rgba(${parseInt(i[1],16)},${parseInt(i[2],16)},${parseInt(i[3],16)},${e})`:`rgba(128,128,128,${e})`}_autarkyColor(t){if((t=Math.max(0,Math.min(100,t)))<=50){const e=t/50;return`rgb(220,${Math.round(50+150*e)},50)`}const e=(t-50)/50;return`rgb(${Math.round(220-170*e)},200,50)`}_deviceIcon(t,e){const i=(e||"").toLowerCase();return"ev_charger"===(t||"").toLowerCase()||i.includes("keba")||i.includes("charger")||i.includes("wallbox")?'<rect x="-6" y="-10" width="12" height="16" rx="2"/><path d="M-2,-4 L0,2 L2,-4"/><line x1="0" y1="6" x2="0" y2="10"/>':i.includes("heiz")||i.includes("heat")||i.includes("warm")||i.includes("boiler")?'<path d="M-4,-10 C-4,-4 4,-4 4,-10"/><path d="M-4,-3 C-4,3 4,3 4,-3"/><path d="M-4,4 C-4,10 4,10 4,4"/>':i.includes("wash")||i.includes("spül")||i.includes("geschirr")||i.includes("wasch")?'<circle r="10" fill="none"/><circle r="5" fill="none"/><circle r="1.5" fill="currentColor" opacity="0.3" stroke="none"/>':i.includes("dryer")||i.includes("trockn")?'<circle r="10" fill="none"/><path d="M-4,-4 C0,-8 0,8 4,4" fill="none"/>':i.includes("pool")||i.includes("pump")?'<circle r="8" fill="none"/><path d="M-6,0 L6,0 M0,-6 L0,6" opacity="0.5"/><path d="M-4,-4 L4,4 M4,-4 L-4,4"/>':i.includes("klima")||i.includes("ac")||i.includes("cool")||i.includes("air")?'<rect x="-10" y="-6" width="20" height="12" rx="2"/><path d="M-6,6 C-6,10 -2,10 -2,6" fill="none"/><path d="M2,6 C2,10 6,10 6,6" fill="none"/>':i.includes("light")||i.includes("licht")||i.includes("lamp")?'<path d="M-5,-10 C-8,-2 -3,4 -2,6 L2,6 C3,4 8,-2 5,-10 C2,-14 -2,-14 -5,-10Z" fill="none"/><line x1="-2" y1="8" x2="2" y2="8"/>':i.includes("shelly")||i.includes("plug")||i.includes("switch")||i.includes("steckdose")?'<rect x="-8" y="-10" width="16" height="20" rx="3"/><circle cx="-3" cy="-2" r="2" fill="none"/><circle cx="3" cy="-2" r="2" fill="none"/><line x1="0" y1="4" x2="0" y2="7"/>':'<path d="M-3,-10 L-3,0 L-6,0 L0,10 L0,0 L3,0 L-3,-10Z" fill="none"/>'}getCardSize(){return 8}static async getConfigElement(){return document.createElement("eb-flow-card-editor")}static getStubConfig(t){const e=t?Object.keys(t.states):[],i=t=>{for(const i of t){const t=e.find(t=>t.includes(i));if(t)return t}return null};return{entities:{solar:{entity:i(["solar_power","pv_power"])||"sensor.solar_power"},grid:{consumption:i(["grid_import","grid_consumption"])||"sensor.grid_import_power",production:i(["grid_export","grid_feed"])||"sensor.grid_export_power"},battery:{entity:i(["battery_power","batt_power"])||"sensor.battery_power",state_of_charge:i(["battery_soc","battery_level"])||"sensor.battery_soc"},home:{entity:i(["home_consumption","house_power"])||"sensor.home_consumption_power"}}}}},{type:"eb-flow-card",name:"SEM Flow Card",description:"Animated energy flow diagram — works with any HA entities"});const ye="sensor.ebi_",xe=["solar_power","battery_power","grid_import_power","grid_export_power","ev_power","battery_soc","battery_temperature","charging_state","home_consumption_power","daily_solar_energy","daily_battery_charge_energy","daily_battery_discharge_energy","daily_ev_energy","daily_home_energy","daily_grid_import_energy","daily_grid_export_energy","forecast_corrected_today","controllable_devices_count"];
/*!
 * @kurkle/color v0.3.4
 * https://github.com/kurkle/color#readme
 * (c) 2024 Jukka Kurkela
 * Released under the MIT License
 */
function be(t){return t+.5|0}bt("eb-system-diagram-card",class extends vt{static properties={_solarDisp:{state:!0},_battDisp:{state:!0},_homeDisp:{state:!0},_evDisp:{state:!0},_gridDisp:{state:!0},_gridDispMode:{state:!0},_sunTransform:{state:!0},_moonTransform:{state:!0},_sunPowerX:{state:!0},_sunPowerY:{state:!0},_sunPtX:{state:!0},_sunPtY:{state:!0}};static get watchedEntities(){return xe.map(t=>`${ye}${t}`)}constructor(){super(),this._prefix=ye,this._mode="prefix",this._entities=null,this._compact=!1,this._visible=!0,this._resizeObserver=null,this._intersectionObserver=null,this._resizeTimeout=null,this._counterRaf=null,this._targets=null,this._lastDiagKey="",this._sunSparkProps=null,this._sunSparkSig=""}setConfig(t){super.setConfig(t),t.entities&&!t.entity_prefix?(this._mode="entities",this._entities=t.entities):(this._mode="prefix",this._entities=null),this._prefix=t.entity_prefix||ye}_eid(t){if("entities"!==this._mode)return`${this._prefix}${t}`;const e=this._entities;if(!e)return null;return{solar_power:e.solar?.entity,battery_power:e.battery?.entity,battery_charge_power:e.battery?.charge,battery_discharge_power:e.battery?.discharge,grid_power:e.grid?.entity,grid_import_power:e.grid?.consumption,grid_export_power:e.grid?.production,ev_power:e.ev?.entity||e.individual?.[0]?.entity,battery_soc:e.battery?.state_of_charge,battery_temperature:e.battery?.temperature,home_consumption_power:e.home?.entity,charging_state:e.inverter?.entity,daily_solar_energy:e.solar?.daily_energy,daily_ev_energy:e.ev?.daily_energy||e.individual?.[0]?.daily_energy,daily_grid_import_energy:e.grid?.daily_import_energy,daily_grid_export_energy:e.grid?.daily_export_energy,daily_battery_charge_energy:e.battery?.daily_charge_energy,daily_battery_discharge_energy:e.battery?.daily_discharge_energy,daily_home_energy:e.home?.daily_energy,autarky_rate:e.home?.autarky,self_consumption_rate:e.home?.self_consumption,forecast_corrected_today:e.solar?.forecast_remaining,controllable_devices_count:e.devices?.count_entity}[t]||null}_flowSolar(){const t=this._val("solar_power");return this._entities?.solar?.reverse?-t:t}_flowBattery(){const t=this._entities;if(t?.battery?.charge||t?.battery?.discharge)return this._val("battery_charge_power")-this._val("battery_discharge_power");const e=this._val("battery_power");return t?.battery?.reverse?-e:e}_flowGridPair(){const t=this._entities;if("entities"===this._mode&&t?.grid?.entity){const e=this._state(t.grid.entity,0),i=t.grid.reverse;return{gridImport:Math.max(0,i?-e:e),gridExport:Math.max(0,i?e:-e)}}return{gridImport:this._val("grid_import_power"),gridExport:this._val("grid_export_power")}}_flowEv(){const t=this._val("ev_power");return this._entities?.ev?.invert?-t:t}_flowHome(t,e,i,s,r,a){const o=this._eid("home_consumption_power"),n=o?this._hass?.states[o]:null;if(n&&"unavailable"!==n.state&&"unknown"!==n.state){let t=this._state(o,0);return this._entities?.home?.invert&&(t=-t),Math.max(0,t)}return Math.max(0,t+e+r-i-s-a)}set hass(t){this._hass=t;const e=t?.language,i="function"==typeof semLocalize;let s=!1;if((e!==this._lang||i&&!this._localizeReady)&&(this._lang=e,this._localizeReady=i,s=!0),this._isFrozen()&&!s)return;const r=this._eid("solar_power"),a=r?t?.states[r]?.state:void 0;if(("unavailable"===a||"unknown"===a)&&!s)return;let o=xe.map(e=>{const i=this._eid(e);return i&&t?.states[i]?.state||""}).join(",")+"|"+e;o+="|"+mt(t,this._prefix),o+="|"+(t?.states[`binary_sensor.${this._objPrefix()}ev_connected`]?.state||""),o+="|"+(t?.states[`binary_sensor.${this._objPrefix()}ev_charging`]?.state||"");const n=t?.states["sun.sun"];if(o+="|"+(n?.attributes?.elevation??"")+":"+(n?.attributes?.next_rising||"")+":"+(n?.attributes?.next_setting||""),o===this._lastDiagKey&&!s)return;this._lastDiagKey=o;const l=this._flowSolar(),c=this._flowBattery(),h=Math.max(0,c),d=Math.max(0,-c),{gridImport:p,gridExport:u}=this._flowGridPair(),g=this._flowEv(),f=this._flowHome(l,p,u,h,d,g);this._targets={solar:l,batt:Math.abs(c),home:f,ev:g,grid:u>10?u:p>10?p:0,gridMode:u>10?"↑":p>10?"↓":null},this._startTickIfIdle(),this._scheduleUpdate()}get hass(){return this._hass}_val(t,e=0){const i=this._eid(t);return i?this._state(i,e):e}_valStr(t){const e=this._eid(t);return e?this._stateStr(e):""}_readWithHold(t,e,i){const s=this._eid(t),r=s?this._hass?.states[s]:void 0,a=r?.state,o=r&&"unavailable"!==a&&"unknown"!==a,n=Date.now(),l=e+"Ts",c=e.startsWith("this.")?e.slice(5):e,h=l.startsWith("this.")?l.slice(5):l;if(o){const t=parseFloat(a);if(!Number.isNaN(t))return this[c]=t,this[h]=n,{value:t,stale:!1}}return null!=this[c]&&n-(this[h]||0)<i?{value:this[c],stale:!1}:{value:0,stale:!0}}_startTickIfIdle(){if(this._counterRaf)return;const t=(t,e)=>{const i=t??0,s=e-i;return Math.abs(s)<.5?e:i+.18*s},e=()=>{if(!this._targets)return void(this._counterRaf=null);const i=this._targets,s=t(this._solarDisp,i.solar),r=t(this._battDisp,i.batt),a=t(this._homeDisp,i.home),o=t(this._evDisp,i.ev),n=t(this._gridDisp,i.grid),l=s===i.solar&&r===i.batt&&a===i.home&&o===i.ev&&n===i.grid&&this._gridDispMode===i.gridMode;this._solarDisp=s,this._battDisp=r,this._homeDisp=a,this._evDisp=o,this._gridDisp=n,this._gridDispMode=i.gridMode,this._counterRaf=l?null:requestAnimationFrame(e)};this._counterRaf=requestAnimationFrame(e)}firstUpdated(){this._resizeObserver=new ResizeObserver(t=>{this._resizeTimeout&&clearTimeout(this._resizeTimeout),this._resizeTimeout=setTimeout(()=>{for(const e of t){const t=e.contentRect.width<500;t!==this._compact&&(this._compact=t,this._sunSparkSig="",this._lastDiagKey="",this.requestUpdate())}},100)}),this._resizeObserver.observe(this),this._intersectionObserver=new IntersectionObserver(t=>{this._visible=t[0].isIntersecting;const e=this.renderRoot.querySelector("svg");e&&(e.style.animationPlayState=this._visible?"running":"paused")},{threshold:.01}),this._intersectionObserver.observe(this)}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver&&(this._resizeObserver.disconnect(),this._resizeObserver=null),this._intersectionObserver&&(this._intersectionObserver.disconnect(),this._intersectionObserver=null),clearTimeout(this._resizeTimeout),this._counterRaf&&(cancelAnimationFrame(this._counterRaf),this._counterRaf=null)}updated(t){if(super.updated(t),!this._hass)return;const e=this.renderRoot.querySelector("#sun-arc-path");if(!e)return;const i=this._getLayout(),s=this._computeSunPose();try{const t=e.getTotalLength(),r=e.getPointAtLength(s.pos*t),a=r.x-i.sunX,o=r.y-i.sunY,n=`translate(${a.toFixed(1)},${o.toFixed(1)}) translate(${i.sunX},${i.sunY}) scale(${s.scale.toFixed(2)}) translate(${(-i.sunX).toFixed(1)},${(-i.sunY).toFixed(1)})`,l=s.isNight?`translate(${a.toFixed(1)},${o.toFixed(1)})`:"",c=r.x.toFixed(1),h=(r.y+i.sunR*s.scale+16).toFixed(1),d=+r.x.toFixed(1),p=+r.y.toFixed(1);if(this._sunTransform===n&&this._moonTransform===l&&this._sunPowerX===c&&this._sunPowerY===h&&this._sunPtX===d&&this._sunPtY===p)return;this._sunTransform=n,this._moonTransform=l,this._sunPowerX=c,this._sunPowerY=h,this._sunPtX=d,this._sunPtY=p}catch(t){}}_computeSunPose(){const t=this._hass?.states["sun.sun"],e=(t&&parseFloat(t.attributes?.elevation)||-90)<0,i=this._val("solar_power"),s=t?.attributes;let r=.5;if(s){const t=s.next_rising?new Date(s.next_rising).getTime():0,i=s.next_setting?new Date(s.next_setting).getTime():0,a=Date.now();if(!e&&t&&i){const e=t-864e5,s=i-e;s>0&&(r=(a-e)/s)}else r=t&&a<t?0:1;r=Math.max(.06,Math.min(.94,r))}return{pos:r,scale:e?.7:.7+.6*Math.min(1,i/1e4),isNight:e,solar:i}}static get styles(){return a`
            :host { display: block; }
            ha-card { overflow: hidden; padding: 0; background: transparent !important; }
            svg { width: 100%; display: block; }
            .flow-group { transition: opacity 0.8s cubic-bezier(0.4,0,0.2,1); }
            .clickable { cursor: pointer; pointer-events: bounding-box; }
            .clickable:hover { filter: brightness(1.2); }
            text { font-variant-numeric: tabular-nums; }
            @media (prefers-reduced-motion: reduce) {
                .flow-group { transition: none; }
                animate, animateMotion { display: none; }
            }
        `}render(){if(!this._config)return Y;const t=this._getLayout(),e=this._compact,i="'Segoe UI','Roboto',sans-serif",s=t.font.label,r=t.font.value,a=t.font.sub,o=this._flowSolar(),{gridImport:n,gridExport:l}=this._flowGridPair(),c=this._flowEv();let h,d;this._entities?.battery?.charge||this._entities?.battery?.discharge?(h=this._flowBattery(),d=!1):(({value:h,stale:d}=this._readWithHold("battery_power","this._lastBattPower",6e4)),this._entities?.battery?.reverse&&(h=-h));const{value:p,stale:u}=this._readWithHold("battery_soc","this._lastBattSoc",6e4),g=d||u,f=Math.max(0,h),_=Math.max(0,-h),m=this._flowHome(o,n,l,f,_,c),y=this._computeSunPose(),{isNight:x}=y,b=x?.3:.85,v=o>50?Math.min(1,.3+o/5e3):0,w=this._hass?.states["sun.sun"]?.attributes,$=this._hass?.config?.time_zone||void 0,k=w?.next_rising?ut(w.next_rising,$):"",M=w?.next_setting?ut(w.next_setting,$):"",S=t.B.r/50,C=64*S,D=C-12*S,z=t.B.cy-C/2+8*S,E=Math.max(0,Math.min(D,D*(p/100))),P=z+D-E,T=f>10?"#f06292":"url(#battFillGrad)",F=f>10,A=l>n?"#8353d1":"#488fc2",R=l>10&&l>n?this._t("exporting"):n>10?this._t("importing"):"",L=l>10&&l>n?"#8353d1":"#488fc2",I=f>10?"#f06292":"#4db6ac",O=f>10?this._t("charging"):_>10?this._t("discharging"):"",N=f>10?"#f06292":"#4db6ac",H="on"===this._hass?.states[`binary_sensor.${this._objPrefix()}ev_connected`]?.state;let B="",W="#8DC892";"on"===this._hass?.states[`binary_sensor.${this._objPrefix()}ev_charging`]?.state||c>10?(B=this._t("charging"),W="#8DC892"):H&&(B=this._t("connected")||"Verbunden",W="rgba(141,200,146,0.6)");const V=this._t("today"),U=`${V} ${this._valStr("daily_solar_energy")} kWh`,G=this._val("forecast_corrected_today"),q=G>0?`☀ ${G.toFixed(0)} kWh ${this._t("forecast")||"Forecast"}`:"",K=`${V} ${this._valStr("daily_ev_energy")} kWh`,X=`${V} ${this._val("daily_home_energy").toFixed(1)} kWh`,Z=`+${this._val("daily_battery_charge_energy").toFixed(1)} / -${this._val("daily_battery_discharge_energy").toFixed(1)} kWh`,Q=`↓${this._val("daily_grid_import_energy").toFixed(1)} / ↑${this._val("daily_grid_export_energy").toFixed(1)} kWh`,J=this._val("battery_temperature"),tt=J>0?`${J.toFixed(0)}°C`:"",et=this._valStr("charging_state"),it=e?22:30,st=et.length>it?et.substring(0,it-1)+"…":et,rt=[];for(const t of["solar_power","battery_power","grid_import_power","grid_export_power","ev_power","battery_soc"]){const e=this._eid(t);if(!e){"prefix"===this._mode&&rt.push(t);continue}const i=this._hass?.states[e];i&&"unavailable"!==i.state&&"unknown"!==i.state||rt.push(t)}const at=pt(this._solarDisp??0),ot=(f>10?"↑ ":_>10?"↓ ":"")+pt(this._battDisp??0),nt=pt(this._homeDisp??0),lt=pt(this._evDisp??0),ct=this._gridDispMode?`${this._gridDispMode} ${pt(this._gridDisp??0)}`:pt(0),ht="↑"===this._gridDispMode?"#8353d1":"#488fc2",dt=yt(this._hass,this._prefix),ft=o>10,_t=Math.abs(h)>10,mt=h<0,bt=f>10?"#f06292":"#4db6ac",vt=n>10||l>10,wt=n>l,$t=l>n?"#8353d1":"#488fc2",kt=m>10,Mt=c>10;return j`
            <ha-card>
                <style>${xt}</style>
                ${dt.length>=2?j`
                    <div class="pv-strings-row">
                        ${dt.map(t=>j`
                            <div class="pv-chip"
                                 title="${t.entityId}"
                                 data-entity="${t.entityId}"
                                 @click=${()=>this._fireMoreInfo?.(t.entityId)}>
                                <span class="pv-chip-label">PV${t.slot.replace(/^pv/,"")}</span>
                                <span class="pv-chip-value">${(Math.abs(t.watts)/1e3).toFixed(2)} kW</span>
                            </div>
                        `)}
                    </div>
                `:Y}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="${t.vb}"
                     style="background:transparent;overflow:hidden"
                     role="img" aria-label="Solar energy system power flow diagram">
                    <defs>
                        <radialGradient id="bgGrad" cx="50%" cy="40%" r="65%">
                            <stop offset="0%" stop-color="rgba(150,202,238,0.06)"/>
                            <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
                        </radialGradient>
                        <pattern id="dotGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <circle cx="20" cy="20" r="0.6" fill="rgba(128,128,128,0.07)"/>
                        </pattern>

                        ${this._glowFilter("glowSolar","#ff9800",10)}
                        ${this._glowFilter("glowBattery","#4db6ac",8)}
                        ${this._glowFilter("glowGrid","#488fc2",8)}
                        ${this._glowFilter("glowHome","#5BC8D8",12)}
                        ${this._glowFilter("glowEV","#8DC892",8)}
                        ${this._glowFilter("glowInverter","#96CAEE",6)}
                        ${this._glowFilter("glowSun","#FCD170",14)}

                        <linearGradient id="panelBlue" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#1565C0" stop-opacity="0.9"/>
                            <stop offset="50%" stop-color="#1976D2" stop-opacity="0.8"/>
                            <stop offset="100%" stop-color="#0D47A1" stop-opacity="0.95"/>
                        </linearGradient>
                        <linearGradient id="panelBlue2" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#1E88E5" stop-opacity="0.85"/>
                            <stop offset="100%" stop-color="#1565C0" stop-opacity="0.9"/>
                        </linearGradient>
                        <linearGradient id="panelReflect" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="rgba(255,255,255,0.18)"/>
                            <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
                        </linearGradient>

                        <linearGradient id="battBody" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#1a2e2c"/>
                            <stop offset="100%" stop-color="#1f3835"/>
                        </linearGradient>
                        <linearGradient id="battFillGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                            <stop offset="0%" stop-color="#4db6ac"/>
                            <stop offset="100%" stop-color="#80cbc4"/>
                        </linearGradient>

                        <linearGradient id="roofGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#c62828"/>
                            <stop offset="100%" stop-color="#b71c1c"/>
                        </linearGradient>
                        <linearGradient id="wallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#37474F"/>
                            <stop offset="100%" stop-color="#263238"/>
                        </linearGradient>
                        <radialGradient id="windowGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#FFF9C4" stop-opacity="0.9"/>
                            <stop offset="100%" stop-color="#F9A825" stop-opacity="0.3"/>
                        </radialGradient>

                        <linearGradient id="poleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#5c7a9b"/>
                            <stop offset="50%" stop-color="#6d8fad"/>
                            <stop offset="100%" stop-color="#5c7a9b"/>
                        </linearGradient>

                        <linearGradient id="invGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#1a2740"/>
                            <stop offset="100%" stop-color="#0f1820"/>
                        </linearGradient>

                        <linearGradient id="carGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#2e5a3c"/>
                            <stop offset="100%" stop-color="#1b3b27"/>
                        </linearGradient>

                        <radialGradient id="sunGradInner" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stop-color="#FFF9C4"/>
                            <stop offset="60%" stop-color="#FCD170"/>
                            <stop offset="100%" stop-color="#F7941E"/>
                        </radialGradient>

                        <path id="path-solar"   d="${t.paths.solar}"/>
                        <path id="path-home"    d="${t.paths.home}"/>
                        <path id="path-battery" d="${t.paths.battery}"/>
                        <path id="path-grid"    d="${t.paths.grid}"/>
                        <path id="path-ev"      d="${t.paths.ev}"/>

                        ${null!=this._sunPtX&&o>50?this._sparkWavePath(t):Y}
                    </defs>

                    <rect width="100%" height="100%" fill="url(#bgGrad)"/>
                    <rect width="100%" height="100%" fill="url(#dotGrid)"/>

                    <!-- Sun arc group -->
                    <g>
                        <path id="sun-arc-path" d="${t.sunArc}" fill="none" stroke="rgba(252,209,112,0.12)"
                              stroke-width="2" stroke-dasharray="4,8"/>
                        <text x="${t.sunRisingX}" y="${t.sunLabelY}"
                              text-anchor="middle" font-family="${i}" font-size="${a}"
                              fill="#FCD170" opacity="0.45">${k}</text>
                        <text x="${t.sunSettingX}" y="${t.sunLabelY}"
                              text-anchor="middle" font-family="${i}" font-size="${a}"
                              fill="#FCD170" opacity="0.45">${M}</text>

                        <g filter="url(#glowSun)" style="opacity:${b}"
                           transform="${this._sunTransform??""}">
                            <circle cx="${t.sunX}" cy="${t.sunY}" r="${t.sunR+6}"
                                    fill="rgba(252,209,112,0.15)"/>
                            ${this._sunRays(t.sunX,t.sunY,t.sunR)}
                            <circle cx="${t.sunX}" cy="${t.sunY}" r="${t.sunR}"
                                    fill="url(#sunGradInner)"/>
                            <ellipse cx="${t.sunX-.25*t.sunR}" cy="${t.sunY-.28*t.sunR}"
                                     rx="${.35*t.sunR}" ry="${.22*t.sunR}"
                                     fill="rgba(255,255,255,0.35)"/>
                        </g>

                        <g style="display:${x?"block":"none"}"
                           transform="${this._moonTransform??""}">
                            <circle cx="${t.sunX}" cy="${t.sunY}" r="${t.sunR}" fill="#1a2540"/>
                            <circle cx="${t.sunX+.38*t.sunR}" cy="${t.sunY-.22*t.sunR}"
                                    r="${.78*t.sunR}" fill="#0d1a30"/>
                            <circle cx="${t.sunX}" cy="${t.sunY}" r="${t.sunR}"
                                    fill="none" stroke="rgba(200,220,255,0.5)" stroke-width="1"/>
                        </g>

                        <g style="display:${x?"block":"none"}" fill="rgba(200,220,255,0.6)">
                            <circle cx="${t.starX[0]}" cy="${t.starY[0]}" r="1.2"/>
                            <circle cx="${t.starX[1]}" cy="${t.starY[1]}" r="0.9"/>
                            <circle cx="${t.starX[2]}" cy="${t.starY[2]}" r="1.4"/>
                            <circle cx="${t.starX[3]}" cy="${t.starY[3]}" r="0.8"/>
                            <circle cx="${t.starX[4]}" cy="${t.starY[4]}" r="1.1"/>
                        </g>

                        <text x="${this._sunPowerX??t.sunX}" y="${this._sunPowerY??t.sunY+t.sunR+14}"
                              text-anchor="middle" font-family="${i}" font-size="${a}"
                              fill="#FCD170" opacity="0.7" font-weight="600">${o>10?pt(o):""}</text>

                        <g style="opacity:${v}">
                            ${null!=this._sunPtX&&o>50?this._renderSunSpark(o):Y}
                        </g>
                    </g>

                    <!-- Static dashed flow tracks -->
                    <path d="${t.paths.solar}"   fill="none" stroke="#ff9800" stroke-width="2"
                          stroke-dasharray="5,7" opacity="0.22"/>
                    <path d="${t.paths.home}"    fill="none" stroke="#5BC8D8" stroke-width="2"
                          stroke-dasharray="5,7" opacity="0.22"/>
                    <path d="${t.paths.battery}" fill="none" stroke="#4db6ac" stroke-width="2"
                          stroke-dasharray="5,7" opacity="0.22"/>
                    <path d="${t.paths.grid}"    fill="none" stroke="#488fc2" stroke-width="2"
                          stroke-dasharray="5,7" opacity="0.22"/>
                    <path d="${t.paths.ev}"      fill="none" stroke="#8DC892" stroke-width="2"
                          stroke-dasharray="5,7" opacity="0.22"/>

                    <!-- Flow animation groups -->
                    <g class="flow-group" style="opacity:${ft?1:0}">
                        ${this._renderFlow(!1,"#ff9800",gt(o),"path-solar",t.paths.solar,2)}
                    </g>
                    <g class="flow-group" style="opacity:${_t?1:0}">
                        ${this._renderFlow(mt,bt,gt(h),"path-battery",t.paths.battery,3)}
                    </g>
                    <g class="flow-group" style="opacity:${vt?1:0}">
                        ${this._renderFlow(wt,$t,gt(n||l),"path-grid",t.paths.grid,3)}
                    </g>
                    <g class="flow-group" style="opacity:${kt?1:0}">
                        ${this._renderFlow(!1,"#5BC8D8",gt(m),"path-home",t.paths.home,2)}
                    </g>
                    <g class="flow-group" style="opacity:${Mt?1:0}">
                        ${this._renderFlow(!1,"#8DC892",gt(c),"path-ev",t.paths.ev,3)}
                    </g>

                    <!-- Solar panel -->
                    <g filter="url(#glowSolar)" class="clickable" @click=${()=>this._showMoreInfo("solar_power")}>
                        ${this._illustrationSolarPanel(t.S.cx,t.S.cy,t.S.r)}
                    </g>
                    <text x="${t.S.cx}" y="${t.S.labelY}" text-anchor="middle"
                          font-family="${i}" font-size="${s}" font-weight="700"
                          fill="#ff9800" letter-spacing="0.5">${this._t("solar")}</text>
                    <text x="${t.S.cx}" y="${t.S.labelY+1.1*r}" class="clickable"
                          @click=${()=>this._showMoreInfo("solar_power")}
                          text-anchor="middle" font-family="${i}" font-size="${r}"
                          font-weight="800" fill="#ff9800">${at}</text>
                    <text x="${t.S.cx}" y="${t.S.labelY+1.1*r+a+3}" class="clickable"
                          @click=${()=>this._showMoreInfo("daily_solar_energy")}
                          text-anchor="middle" font-family="${i}" font-size="${a+1}"
                          fill="#ff9800" opacity="0.6" font-weight="600">${U}</text>
                    <text x="${t.S.cx}" y="${t.S.labelY+1.1*r+2*(a+3)}" class="clickable"
                          @click=${()=>this._showMoreInfo("forecast_corrected_today")}
                          text-anchor="middle" font-family="${i}" font-size="${a}"
                          fill="#ff9800" opacity="0.4" font-weight="500">${q}</text>

                    <!-- Inverter -->
                    <g filter="url(#glowInverter)">
                        ${this._illustrationInverter(t.I.cx,t.I.cy,t.I.r)}
                    </g>
                    <text x="${t.I.cx}" y="${t.I.cy+t.I.r+14}"
                          text-anchor="middle" font-family="${i}" font-size="${a}"
                          fill="#96CAEE" opacity="0.6" font-weight="600">${tt}</text>
                    <text x="${t.I.cx}" y="${t.I.cy+t.I.r+14+a+2}"
                          text-anchor="middle" font-family="${i}" font-size="${a-1}"
                          fill="#96CAEE" opacity="0.35">${st}</text>

                    <!-- Battery — group opacity fades to 0.35 if both
                         battery_soc and battery_power have been
                         unavailable for >60 s (Huawei modbus hard
                         dropout). Brief flickers (<60 s) are absorbed
                         by '_readWithHold' upstream so the user
                         doesn't see a visual emergency. (NEVER put
                         backticks inside this lit template: they
                         terminate the template literal and the whole
                         card renders blank, #488.) -->
                    <g filter="url(#glowBattery)" class="clickable"
                       opacity="${g?.35:1}"
                       @click=${()=>this._showMoreInfo("battery_soc")}>
                        ${this._illustrationBattery(t.B.cx,t.B.cy,t.B.r,E,P,T,F,p)}
                    </g>
                    <text x="${t.B.cx}" y="${t.B.labelY}" text-anchor="middle"
                          font-family="${i}" font-size="${s}" font-weight="700"
                          fill="#4db6ac" letter-spacing="0.5">${this._t("battery")}</text>
                    <text x="${t.B.cx}" y="${t.B.labelY+1*r}" class="clickable"
                          @click=${()=>this._showMoreInfo("battery_power")}
                          text-anchor="middle" font-family="${i}" font-size="${r}"
                          font-weight="800" fill="${I}"
                          opacity="${g?.4:1}">${g?"— W":ot}</text>
                    <text x="${t.B.cx}" y="${t.B.labelY+1*r+s}"
                          text-anchor="middle" font-family="${i}" font-size="${s}"
                          fill="${N}" opacity="0.6">${g?this._t("sensor_unavailable"):O}</text>
                    <text x="${t.B.cx}" y="${t.B.labelY+1*r+s+a+2}" class="clickable"
                          @click=${()=>this._showMoreInfo("daily_battery_charge_energy")}
                          text-anchor="middle" font-family="${i}" font-size="${a+1}"
                          fill="#4db6ac" opacity="0.6" font-weight="600">${Z}</text>

                    <!-- Grid -->
                    <g filter="url(#glowGrid)" class="clickable" @click=${()=>this._showMoreInfo("grid_import_power")}>
                        ${this._illustrationGrid(t.G.cx,t.G.cy,t.G.r)}
                    </g>
                    <text x="${t.G.cx}" y="${t.G.labelY}" text-anchor="middle"
                          font-family="${i}" font-size="${s}" font-weight="700"
                          fill="${A}" letter-spacing="0.5">${this._t("grid")}</text>
                    <text x="${t.G.cx}" y="${t.G.labelY+r}" class="clickable"
                          @click=${()=>this._showMoreInfo("grid_power")}
                          text-anchor="middle" font-family="${i}" font-size="${r}"
                          font-weight="800" fill="${ht}">${ct}</text>
                    <text x="${t.G.cx}" y="${t.G.labelY+r+s+1}"
                          text-anchor="middle" font-family="${i}" font-size="${s}"
                          fill="${L}" opacity="0.6">${R}</text>
                    <text x="${t.G.cx}" y="${t.G.labelY+r+s+a+4}" class="clickable"
                          @click=${()=>this._showMoreInfo("daily_grid_import_energy")}
                          text-anchor="middle" font-family="${i}" font-size="${a+1}"
                          fill="#488fc2" opacity="0.6" font-weight="600">${Q}</text>

                    <!-- House -->
                    <g filter="url(#glowHome)" class="clickable" @click=${()=>this._showMoreInfo("home_consumption_power")}>
                        ${this._illustrationHouse(t.H.cx,t.H.cy,t.H.r)}
                    </g>
                    <text x="${t.H.cx}" y="${t.H.labelY}" text-anchor="middle"
                          font-family="${i}" font-size="${s}" font-weight="700"
                          fill="#5BC8D8" letter-spacing="0.5">${this._t("home")}</text>
                    <text x="${t.H.cx}" y="${t.H.labelY+1.1*r}" class="clickable"
                          @click=${()=>this._showMoreInfo("home_consumption_power")}
                          text-anchor="middle" font-family="${i}" font-size="${r}"
                          font-weight="800" fill="#5BC8D8">${nt}</text>
                    <text x="${t.H.cx}" y="${t.H.labelY+1.1*r+a+3}" class="clickable"
                          @click=${()=>this._showMoreInfo("daily_home_energy")}
                          text-anchor="middle" font-family="${i}" font-size="${a+1}"
                          fill="#5BC8D8" opacity="0.6" font-weight="600">${X}</text>

                    <!-- EV -->
                    <g filter="url(#glowEV)" class="clickable" @click=${()=>this._showMoreInfo("ev_power")}>
                        ${this._illustrationEV(t.E.cx,t.E.cy,t.E.r)}
                    </g>
                    <text x="${t.E.cx}" y="${t.E.labelY}" text-anchor="middle"
                          font-family="${i}" font-size="${s}" font-weight="700"
                          fill="#8DC892" letter-spacing="0.5">${this._t("ev_charging")}</text>
                    <text x="${t.E.cx}" y="${t.E.labelY+1*r}" class="clickable"
                          @click=${()=>this._showMoreInfo("ev_power")}
                          text-anchor="middle" font-family="${i}" font-size="${r}"
                          font-weight="800" fill="#8DC892">${lt}</text>
                    <text x="${t.E.cx}" y="${t.E.labelY+1*r+s}"
                          text-anchor="middle" font-family="${i}" font-size="${s}"
                          fill="${W}" opacity="0.6">${B}</text>
                    <text x="${t.E.cx}" y="${t.E.labelY+1*r+s+a+2}" class="clickable"
                          @click=${()=>this._showMoreInfo("daily_ev_energy")}
                          text-anchor="middle" font-family="${i}" font-size="${a+1}"
                          fill="#8DC892" opacity="0.6" font-weight="600">${K}</text>

                    <!-- Device strip (desktop only) -->
                    ${e?Y:this._renderDeviceStrip(t.H)}

                    <!-- Entity status indicator -->
                    ${rt.length>0?j`
                        <foreignObject x="${e?8:10}" y="${t.statusY}" width="220" height="22">
                            <div xmlns="http://www.w3.org/1999/xhtml"
                                 style="font-family:'Segoe UI','Roboto',sans-serif;font-size:11px;color:#ef5350;opacity:0.75;white-space:nowrap">⚠ ${rt.length} ${this._t("sensor_unavailable")}</div>
                        </foreignObject>
                    `:Y}

                    <text x="${t.wmX}" y="${t.wmY}" text-anchor="end"
                          font-family="${i}" font-size="9" font-weight="300"
                          letter-spacing="2.5" fill="rgba(255,255,255,0.06)">SEM</text>
                </svg>
            </ha-card>
        `}_illustrationSolarPanel(t,e,i){const s=i/50,r=86*s,a=58*s,o=t-r/2,n=e-a/2-4*s,l=r/3,c=a/2,h=6*s,d=12*s;return V`
            <circle cx="${t}" cy="${e}" r="${i+4}" fill="none"
                    stroke="#ff9800" stroke-width="1.2" opacity="0.25"/>

            <line x1="${o+h}" y1="${n+a}" x2="${o+h-4*s}" y2="${n+a+d}"
                  stroke="#ff9800" stroke-width="${2*s}" stroke-linecap="round" opacity="0.7"/>
            <line x1="${o+r-h}" y1="${n+a}" x2="${o+r-h+4*s}" y2="${n+a+d}"
                  stroke="#ff9800" stroke-width="${2*s}" stroke-linecap="round" opacity="0.7"/>
            <line x1="${o+r/2}" y1="${n+a}" x2="${o+r/2}" y2="${n+a+.8*d}"
                  stroke="#ff9800" stroke-width="${1.5*s}" stroke-linecap="round" opacity="0.5"/>
            <line x1="${o+h-6*s}" y1="${n+a+d}"
                  x2="${o+r-h+6*s}" y2="${n+a+d}"
                  stroke="#ff9800" stroke-width="${2.5*s}" stroke-linecap="round" opacity="0.6"/>

            <line x1="${o}" y1="${n+.52*a}" x2="${o+r}" y2="${n+.52*a}"
                  stroke="#ff9800" stroke-width="${2*s}" opacity="0.5"/>
            <line x1="${o}" y1="${n}" x2="${o+r}" y2="${n}"
                  stroke="#ff9800" stroke-width="${2*s}" opacity="0.5"/>

            <rect x="${o}"        y="${n}"      width="${l}" height="${c}" fill="url(#panelBlue)"  rx="${1*s}"/>
            <rect x="${o+l}"   y="${n}"      width="${l}" height="${c}" fill="url(#panelBlue2)" rx="${1*s}"/>
            <rect x="${o+2*l}" y="${n}"      width="${l}" height="${c}" fill="url(#panelBlue)"  rx="${1*s}"/>
            <rect x="${o}"        y="${n+c}" width="${l}" height="${c}" fill="url(#panelBlue2)" rx="${1*s}"/>
            <rect x="${o+l}"   y="${n+c}" width="${l}" height="${c}" fill="url(#panelBlue)"  rx="${1*s}"/>
            <rect x="${o+2*l}" y="${n+c}" width="${l}" height="${c}" fill="url(#panelBlue2)" rx="${1*s}"/>

            <line x1="${o+l}"   y1="${n}" x2="${o+l}"   y2="${n+a}" stroke="rgba(0,0,0,0.4)" stroke-width="${1.5*s}"/>
            <line x1="${o+2*l}" y1="${n}" x2="${o+2*l}" y2="${n+a}" stroke="rgba(0,0,0,0.4)" stroke-width="${1.5*s}"/>
            <line x1="${o}" y1="${n+c}" x2="${o+r}" y2="${n+c}" stroke="rgba(0,0,0,0.4)" stroke-width="${1.5*s}"/>
            ${[0,1,2].map(t=>V`
                <line x1="${o+t*l+l/3}"   y1="${n}" x2="${o+t*l+l/3}"   y2="${n+a}" stroke="rgba(0,0,0,0.2)" stroke-width="${.7*s}"/>
                <line x1="${o+t*l+2*l/3}" y1="${n}" x2="${o+t*l+2*l/3}" y2="${n+a}" stroke="rgba(0,0,0,0.2)" stroke-width="${.7*s}"/>
            `)}
            <line x1="${o}" y1="${n+c/3}"   x2="${o+r}" y2="${n+c/3}"   stroke="rgba(0,0,0,0.18)" stroke-width="${.7*s}"/>
            <line x1="${o}" y1="${n+2*c/3}" x2="${o+r}" y2="${n+2*c/3}" stroke="rgba(0,0,0,0.18)" stroke-width="${.7*s}"/>

            <rect x="${o}" y="${n}" width="${r}" height="${a}"
                  fill="none" stroke="#ff9800" stroke-width="${2*s}" rx="${1.5*s}" opacity="0.8"/>

            <rect x="${o}" y="${n}" width="${r}" height="${.45*a}"
                  fill="url(#panelReflect)" rx="${1.5*s}" opacity="0.5"/>

            <circle cx="${t}" cy="${n+a+d+3*s}" r="${3*s}"
                    fill="#ff9800" opacity="0.6"/>
        `}_sunRays(t,e,i){const s=[];for(let r=0;r<8;r++){const a=45*r*Math.PI/180,o=i+3,n=i+.7*i,l=.18,c=a-l,h=a+l,d=t+Math.cos(c)*o,p=e+Math.sin(c)*o,u=t+Math.cos(a)*n,g=e+Math.sin(a)*n,f=t+Math.cos(h)*o,_=e+Math.sin(h)*o;s.push(V`<polygon points="${d},${p} ${u},${g} ${f},${_}"
                                    fill="#FCD170" opacity="0.85"/>`)}return s}_illustrationInverter(t,e,i){const s=i/20,r=38*s,a=28*s,o=t-r/2,n=e-a/2;return V`
            <rect x="${o}" y="${n}" width="${r}" height="${a}" rx="${4*s}"
                  fill="url(#invGrad)" stroke="#96CAEE" stroke-width="${1.5*s}" opacity="0.9"/>
            ${[0,1,2].map(t=>V`
                <line x1="${o+4*s+5*t*s}" y1="${n+3*s}" x2="${o+4*s+5*t*s}" y2="${n+7*s}"
                      stroke="#96CAEE" stroke-width="${1*s}" stroke-linecap="round" opacity="0.4"/>
            `)}
            <text x="${t-8*s}" y="${e+2*s}" font-family="'Segoe UI',sans-serif"
                  font-size="${7*s}" fill="#96CAEE" opacity="0.8" text-anchor="middle">DC</text>
            <path d="M${t-1*s},${e-4*s} L${t-3*s},${e+1*s} L${t},${e+1*s}
                     L${t},${e+5*s} L${t+2*s},${e} L${t-1*s},${e}"
                  fill="#FCD170" opacity="0.85"/>
            <text x="${t+8*s}" y="${e+2*s}" font-family="'Segoe UI',sans-serif"
                  font-size="${7*s}" fill="#96CAEE" opacity="0.8" text-anchor="middle">AC</text>
            <circle cx="${o+r-5*s}" cy="${n+4*s}" r="${2.5*s}"
                    fill="#69f0ae" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2.5s" repeatCount="indefinite"/>
            </circle>
            <rect x="${t-3*s}" y="${n+a}" width="${6*s}" height="${3*s}" rx="${1*s}"
                  fill="#96CAEE" opacity="0.4"/>
        `}_illustrationBattery(t,e,i,s,r,a,o,n){const l=i/50,c=40*l,h=64*l,d=t-c/2,p=e-h/2,u=8*l,g=16*l,f=c-8*l,_=h-12*l,m=d+4*l,y=p+8*l;return V`
            <circle cx="${t}" cy="${e}" r="${i+4}" fill="none"
                    stroke="#4db6ac" stroke-width="1.2" opacity="0.25"/>

            <rect x="${t-g/2}" y="${p-u}" width="${g}" height="${u}"
                  rx="${3*l}" fill="#2a4a47" stroke="#4db6ac" stroke-width="${1.5*l}" opacity="0.85"/>
            <line x1="${t-g/4}" y1="${p-u/2}"
                  x2="${t+g/4}" y2="${p-u/2}"
                  stroke="#4db6ac" stroke-width="${2*l}" stroke-linecap="round" opacity="0.8"/>
            <line x1="${t}" y1="${p-.75*u}" x2="${t}" y2="${p-.25*u}"
                  stroke="#4db6ac" stroke-width="${2*l}" stroke-linecap="round" opacity="0.8"/>

            <rect x="${d}" y="${p}" width="${c}" height="${h}" rx="${5*l}"
                  fill="url(#battBody)" stroke="#4db6ac" stroke-width="${2*l}" opacity="0.95"/>

            <rect x="${m}" y="${y}" width="${f}" height="${_}"
                  rx="${3*l}" fill="rgba(0,0,0,0.4)"/>

            <rect x="${m}" y="${r.toFixed(1)}"
                  width="${f}" height="${s.toFixed(1)}"
                  rx="${3*l}" fill="${a}" opacity="0.85"/>

            ${[1,2,3,4].map(t=>V`
                <line x1="${m}" y1="${y+_*t/5}"
                      x2="${m+f}" y2="${y+_*t/5}"
                      stroke="rgba(0,0,0,0.35)" stroke-width="${1.2*l}"/>
            `)}

            <text x="${t}" y="${o?e+15*l:e+4*l}"
                  text-anchor="middle" font-family="'Segoe UI','Roboto',sans-serif"
                  font-size="${14*l}" font-weight="900" fill="#fff"
                  stroke="rgba(0,0,0,0.6)" stroke-width="${1.5*l}" paint-order="stroke">${n.toFixed(0)}%</text>

            ${o?V`
                <g>
                    <path d="M${t-4*l},${e-9*l-8*l} L${t-7*l},${e-9*l+2*l} L${t-1*l},${e-9*l+2*l}
                             L${t-1*l},${e-9*l+10*l} L${t+6*l},${e-9*l-2*l} L${t+1*l},${e-9*l-2*l} Z"
                          fill="#FCD170" opacity="0.95"/>
                </g>
            `:Y}

            <rect x="${t-10*l}" y="${p+h-5*l}" width="${20*l}" height="${5*l}"
                  rx="${2*l}" fill="#4db6ac" opacity="0.25"/>
        `}_illustrationHouse(t,e,i){const s=i/62,r=80*s,a=52*s,o=t-r/2,n=e-a/2+8*s,l=n-38*s,c=t+18*s,h=l+8*s,d=10*s,p=18*s,u=16*s,g=14*s,f=n+12*s,_=o+10*s,m=o+r-10*s-u,y=14*s,x=24*s,b=t-y/2,v=n+a-x;return V`
            <circle cx="${t}" cy="${e}" r="${i+4}" fill="none"
                    stroke="#5BC8D8" stroke-width="1.2" opacity="0.25"/>

            <rect x="${c}" y="${h-p}" width="${d}" height="${p}"
                  rx="${2*s}" fill="#455A64" stroke="#546E7A" stroke-width="${1.2*s}"/>
            <circle cx="${c+d/2}" cy="${h-p-5*s}" r="${3*s}"
                    fill="rgba(150,160,170,0.3)"/>
            <circle cx="${c+d/2+2*s}" cy="${h-p-10*s}" r="${2.5*s}"
                    fill="rgba(150,160,170,0.2)"/>

            <polygon points="${o},${n} ${o+r},${n} ${t},${l}"
                     fill="url(#roofGrad)" stroke="#c62828" stroke-width="${1.5*s}"
                     stroke-linejoin="round"/>
            <line x1="${t-18*s}" y1="${l+10*s}" x2="${t+18*s}" y2="${l+10*s}"
                  stroke="rgba(255,255,255,0.12)" stroke-width="${1*s}"/>
            <line x1="${o-3*s}" y1="${n}" x2="${o+r+3*s}" y2="${n}"
                  stroke="#7f1010" stroke-width="${3*s}" opacity="0.5"/>

            <rect x="${o}" y="${n}" width="${r}" height="${a}"
                  rx="${2*s}" fill="url(#wallGrad)"
                  stroke="#546E7A" stroke-width="${1.5*s}"/>

            <rect x="${_-2*s}" y="${f-2*s}" width="${u+4*s}" height="${g+4*s}"
                  rx="${2*s}" fill="#2d3c45" stroke="#5BC8D8" stroke-width="${1.2*s}" opacity="0.9"/>
            <rect x="${_}" y="${f}" width="${u}" height="${g}"
                  rx="${1.5*s}" fill="url(#windowGlow)" opacity="0.85"/>
            <line x1="${_+u/2}" y1="${f}" x2="${_+u/2}" y2="${f+g}"
                  stroke="rgba(50,50,60,0.6)" stroke-width="${1.2*s}"/>
            <line x1="${_}" y1="${f+g/2}" x2="${_+u}" y2="${f+g/2}"
                  stroke="rgba(50,50,60,0.6)" stroke-width="${1.2*s}"/>

            <rect x="${m-2*s}" y="${f-2*s}" width="${u+4*s}" height="${g+4*s}"
                  rx="${2*s}" fill="#2d3c45" stroke="#5BC8D8" stroke-width="${1.2*s}" opacity="0.9"/>
            <rect x="${m}" y="${f}" width="${u}" height="${g}"
                  rx="${1.5*s}" fill="url(#windowGlow)" opacity="0.85"/>
            <line x1="${m+u/2}" y1="${f}" x2="${m+u/2}" y2="${f+g}"
                  stroke="rgba(50,50,60,0.6)" stroke-width="${1.2*s}"/>
            <line x1="${m}" y1="${f+g/2}" x2="${m+u}" y2="${f+g/2}"
                  stroke="rgba(50,50,60,0.6)" stroke-width="${1.2*s}"/>

            <rect x="${b}" y="${v}" width="${y}" height="${x}"
                  rx="${2*s}" fill="#506C7F" stroke="#5BC8D8" stroke-width="${1.2*s}" opacity="0.9"/>
            <rect x="${b+.15*y}" y="${v+4*s}"
                  width="${.7*y}" height="${.35*x}"
                  rx="${1.5*s}" fill="url(#windowGlow)" opacity="0.6"/>
            <circle cx="${b+.75*y}" cy="${v+.62*x}" r="${1.5*s}"
                    fill="#FCD170" opacity="0.8"/>

            <line x1="${o+2*s}" y1="${n+4*s}" x2="${o+2*s}" y2="${n+a-2*s}"
                  stroke="rgba(255,255,255,0.06)" stroke-width="${1.5*s}"/>
        `}_illustrationGrid(t,e,i){const s=i/50,r=72*s,a=4*s,o=e-r/2+4*s,n=o+.22*r,l=o+.42*r,c=44*s,h=32*s,d=3*s;return V`
            <circle cx="${t}" cy="${e}" r="${i+4}" fill="none"
                    stroke="#488fc2" stroke-width="1.2" opacity="0.25"/>

            <polygon points="${t-a/2},${o+r}
                             ${t+a/2},${o+r}
                             ${t+.35*a},${o}
                             ${t-.35*a},${o}"
                     fill="url(#poleGrad)" stroke="#5c7a9b" stroke-width="${1*s}"/>

            <rect x="${t-8*s}" y="${o+r-4*s}"
                  width="${16*s}" height="${4*s}" rx="${2*s}"
                  fill="#5c7a9b" opacity="0.6"/>

            <rect x="${t-c/2}" y="${n-3*s}" width="${c}" height="${5*s}"
                  rx="${2*s}" fill="url(#poleGrad)" stroke="#5c7a9b" stroke-width="${.8*s}"/>
            <line x1="${t}" y1="${n+2*s}"
                  x2="${t-.4*c}" y2="${n+14*s}"
                  stroke="#5c7a9b" stroke-width="${2*s}" opacity="0.5"/>
            <line x1="${t}" y1="${n+2*s}"
                  x2="${t+.4*c}" y2="${n+14*s}"
                  stroke="#5c7a9b" stroke-width="${2*s}" opacity="0.5"/>

            <rect x="${t-h/2}" y="${l-3*s}" width="${h}" height="${5*s}"
                  rx="${2*s}" fill="url(#poleGrad)" stroke="#5c7a9b" stroke-width="${.8*s}"/>

            <circle cx="${t-c/2}" cy="${n}" r="${d}"
                    fill="#838bc5" stroke="#488fc2" stroke-width="${1*s}"/>
            <circle cx="${t+c/2}" cy="${n}" r="${d}"
                    fill="#838bc5" stroke="#488fc2" stroke-width="${1*s}"/>
            <circle cx="${t-h/2}" cy="${l}" r="${d}"
                    fill="#838bc5" stroke="#488fc2" stroke-width="${1*s}"/>
            <circle cx="${t+h/2}" cy="${l}" r="${d}"
                    fill="#838bc5" stroke="#488fc2" stroke-width="${1*s}"/>

            <path d="M${t-c/2},${n}
                     Q${t-.7*c},${n+18*s} ${t-.95*c-15*s},${n+12*s}"
                  fill="none" stroke="#488fc2" stroke-width="${1.5*s}" opacity="0.6"/>
            <path d="M${t+c/2},${n}
                     Q${t+.7*c},${n+18*s} ${t+.95*c+15*s},${n+12*s}"
                  fill="none" stroke="#488fc2" stroke-width="${1.5*s}" opacity="0.6"/>

            <path d="M${t-h/2},${l}
                     Q${t-.65*h},${l+14*s} ${t-.9*h-12*s},${l+9*s}"
                  fill="none" stroke="#488fc2" stroke-width="${1.2*s}" opacity="0.5"/>
            <path d="M${t+h/2},${l}
                     Q${t+.65*h},${l+14*s} ${t+.9*h+12*s},${l+9*s}"
                  fill="none" stroke="#488fc2" stroke-width="${1.2*s}" opacity="0.5"/>

            <path d="M${t-3*s},${l+8*s} L${t-5*s},${l+14*s}
                     L${t},${l+14*s} L${t},${l+20*s}
                     L${t+4*s},${l+11*s} L${t},${l+11*s} Z"
                  fill="#FCD170" opacity="0.6"/>
        `}_illustrationEV(t,e,i){const s=i/44,r=22*s,a=36*s,o=t-28*s,n=e-a/2,l=e+4*s,c=52*s,h=22*s,d=t+18*s-c/2,p=6*s;return V`
            <circle cx="${t}" cy="${e}" r="${i+4}" fill="none"
                    stroke="#8DC892" stroke-width="1.2" opacity="0.25"/>

            <rect x="${o}" y="${n}" width="${r}" height="${a}"
                  rx="${4*s}" fill="#1a2e22" stroke="#8DC892" stroke-width="${1.8*s}" opacity="0.95"/>
            <rect x="${o+3*s}" y="${n+4*s}" width="${r-6*s}" height="${10*s}"
                  rx="${2*s}" fill="#0a1a12" stroke="#8DC892" stroke-width="${.8*s}" opacity="0.8"/>
            <text x="${o+r/2}" y="${n+4*s+8*s}"
                  font-family="'Courier New',monospace" font-size="${5.5*s}"
                  fill="#8DC892" text-anchor="middle" opacity="0.8">AC</text>
            <path d="M${o+r/2-3*s},${n+18*s}
                     L${o+r/2-5*s},${n+25*s}
                     L${o+r/2},${n+25*s}
                     L${o+r/2},${n+32*s}
                     L${o+r/2+4*s},${n+22*s}
                     L${o+r/2},${n+22*s} Z"
                  fill="#FCD170" opacity="0.9"/>
            <circle cx="${o+r-5*s}" cy="${n+5*s}" r="${2.2*s}"
                    fill="#8DC892" opacity="0.9">
                <animate attributeName="opacity" values="0.9;0.3;0.9" dur="1.8s" repeatCount="indefinite"/>
            </circle>
            <path d="M${o+r},${n+.55*a}
                     C${o+r+10*s},${n+.55*a}
                       ${d-10*s},${l}
                       ${d},${l}"
                  fill="none" stroke="#8DC892" stroke-width="${2.5*s}"
                  stroke-linecap="round" opacity="0.7"/>
            <circle cx="${d}" cy="${l}" r="${3*s}"
                    fill="#8DC892" opacity="0.85"/>

            <rect x="${d+5*s}" y="${l}" width="${c-10*s}" height="${h/2}"
                  rx="${3*s}" fill="url(#carGrad)" stroke="#8DC892" stroke-width="${1.5*s}"/>
            <path d="M${d+12*s},${l}
                     L${d+10*s},${l-.7*h}
                     L${d+20*s},${l-.85*h}
                     L${d+c-18*s},${l-.85*h}
                     L${d+c-10*s},${l-.7*h}
                     L${d+c-8*s},${l} Z"
                  fill="url(#carGrad)" stroke="#8DC892" stroke-width="${1.5*s}"/>
            <path d="M${d+13*s},${l-2*s}
                     L${d+11*s},${l-.62*h}
                     L${d+22*s},${l-.78*h}
                     L${d+24*s},${l-2*s} Z"
                  fill="rgba(100,200,200,0.22)" stroke="rgba(100,200,200,0.4)" stroke-width="${.8*s}"/>
            <path d="M${d+c-14*s},${l-2*s}
                     L${d+c-22*s},${l-2*s}
                     L${d+c-20*s},${l-.78*h}
                     L${d+c-12*s},${l-.62*h} Z"
                  fill="rgba(100,200,200,0.22)" stroke="rgba(100,200,200,0.4)" stroke-width="${.8*s}"/>
            <circle cx="${d+14*s}" cy="${l+h/2-1*s}" r="${p}"
                    fill="#1a2525" stroke="#8DC892" stroke-width="${2*s}"/>
            <circle cx="${d+14*s}" cy="${l+h/2-1*s}" r="${.4*p}"
                    fill="#8DC892" opacity="0.5"/>
            <circle cx="${d+c-14*s}" cy="${l+h/2-1*s}" r="${p}"
                    fill="#1a2525" stroke="#8DC892" stroke-width="${2*s}"/>
            <circle cx="${d+c-14*s}" cy="${l+h/2-1*s}" r="${.4*p}"
                    fill="#8DC892" opacity="0.5"/>
            <ellipse cx="${d+c-7*s}" cy="${l+h/2-6*s}"
                     rx="${4*s}" ry="${2.5*s}"
                     fill="#FFF9C4" opacity="0.6"/>
        `}_renderFlow(t,e,i,s,r,a){const o=i.toFixed(1),n=String(t?28:-28),l=t?{kp:"1;0",kt:"0;1"}:null,c=[];for(let t=0;t<a;t++){const r=`-${(t/a*i).toFixed(2)}s`;c.push(V`
                <circle r="5" fill="${e}" opacity="0.12">
                    <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="paced"
                                   keyPoints=${l?l.kp:Y}
                                   keyTimes=${l?l.kt:Y}
                                   begin="${r}">
                        <mpath href="#${s}"/>
                    </animateMotion>
                </circle>
                <circle r="2.5" fill="${e}" opacity="0.95">
                    <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="paced"
                                   keyPoints=${l?l.kp:Y}
                                   keyTimes=${l?l.kt:Y}
                                   begin="${r}">
                        <mpath href="#${s}"/>
                    </animateMotion>
                </circle>
                <circle r="1" fill="rgba(255,255,255,0.9)" opacity="0.85">
                    <animateMotion dur="${o}s" repeatCount="indefinite" calcMode="paced"
                                   keyPoints=${l?l.kp:Y}
                                   keyTimes=${l?l.kt:Y}
                                   begin="${r}">
                        <mpath href="#${s}"/>
                    </animateMotion>
                </circle>
            `)}return V`
            <path d="${r}" fill="none" stroke="${e}" stroke-width="5"
                  stroke-dasharray="8,${20}" opacity="0.2" stroke-linecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="${n}"
                         dur="${o}s" repeatCount="indefinite"/>
            </path>
            <path d="${r}" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="1.2"
                  stroke-dasharray="6,${22}" opacity="0.45" stroke-linecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="${n}"
                         dur="${o}s" repeatCount="indefinite"/>
            </path>
            <path d="${r}" fill="none" stroke="${e}" stroke-width="2.5"
                  stroke-dasharray="8,${20}" opacity="0.65" stroke-linecap="round">
                <animate attributeName="stroke-dashoffset" from="0" to="${n}"
                         dur="${o}s" repeatCount="indefinite"/>
            </path>
            ${c}
        `}_sparkWavePath(t){const e=this._sunPtX,i=this._sunPtY,s=t.S.cx-e,r=t.S.cy-t.S.r-i,a=Math.sqrt(s*s+r*r),o=Math.max(2,Math.round(a/30)),n=this._val("solar_power"),l=6+Math.min(8,n/1e3),c=Math.atan2(r,s),h=-Math.sin(c),d=Math.cos(c),p=8*o;let u=`M${e.toFixed(1)},${i.toFixed(1)}`;for(let t=1;t<=p;t++){const a=t/p,n=e+s*a,c=i+r*a,g=Math.sin(a*o*Math.PI*2)*l;u+=` L${(n+h*g).toFixed(1)},${(c+d*g).toFixed(1)}`}return V`<path id="spark-wave" d="${u}" fill="none"
                         stroke="rgba(255,200,60,0.12)" stroke-width="2.5" stroke-linecap="round"
                         filter="url(#glowSun)"/>`}_renderSunSpark(t){const e=12-7*Math.min(1,t/1e4),i=3+Math.floor(Math.min(3,t/3e3)),s=`${e.toFixed(0)}:${i}`;if(this._sunSparkSig!==s){this._sunSparkSig=s,this._sunSparkProps=[];for(let t=0;t<i;t++)this._sunSparkProps.push({kind:t%2==0?"gold":"white",r:1.5+2*Math.random(),opacity:.4+.5*Math.random(),dur:e*(.7+.6*Math.random()),delay:Math.random()*e})}return this._sunSparkProps.map(t=>"gold"===t.kind?V`
            <circle r="${t.r.toFixed(1)}" fill="rgba(255,220,60,${t.opacity.toFixed(2)})" filter="url(#glowSun)">
                <animateMotion dur="${t.dur.toFixed(1)}s" repeatCount="indefinite" calcMode="paced"
                               begin="-${t.delay.toFixed(1)}s">
                    <mpath href="#spark-wave"/>
                </animateMotion>
            </circle>
        `:V`
            <circle r="${(.6*t.r).toFixed(1)}" fill="rgba(255,255,230,${t.opacity.toFixed(2)})">
                <animateMotion dur="${t.dur.toFixed(1)}s" repeatCount="indefinite" calcMode="paced"
                               begin="-${t.delay.toFixed(1)}s">
                    <mpath href="#spark-wave"/>
                </animateMotion>
            </circle>
        `)}_renderDeviceStrip(t){const e=this._eid("controllable_devices_count"),i=e?this._hass?.states[e]:void 0;if(!i?.attributes?.devices)return Y;const s=Object.entries(i.attributes.devices).filter(([,t])=>"ev_charger"!==t.device_type).map(([t,e])=>{const i=e.power_entity?this._hass.states[e.power_entity]:null,s=i?parseFloat(i.state)||0:e.current_power||0;return{id:t,...e,power:s}}).sort((t,e)=>e.power-t.power).slice(0,3);if(!s.length)return Y;const r="'Segoe UI','Roboto',sans-serif",a=dt;return s.map((e,i)=>{let s=(e.name||e.id).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");s.length>22&&(s=s.substring(0,21)+"…");const o=a[i%a.length],n=e.is_on||e.power>5,l=310+50*i,c=540,h=`M${t.cx+t.r},${t.cy+10+8*i} C${t.cx+t.r+40},${t.cy+30+15*i} 510,${l-10} 524,${l}`,d=e.power>5?V`
                <path id="dev-path-${i}" d="${h}" fill="none" stroke="none"/>
                <circle r="1.5" fill="${o}" opacity="0.8">
                    <animateMotion dur="${gt(e.power).toFixed(1)}s" repeatCount="indefinite" calcMode="paced">
                        <mpath href="#dev-path-${i}"/>
                    </animateMotion>
                </circle>
            `:Y;return V`
                <path d="${h}" fill="none" stroke="${o}" stroke-width="1"
                      stroke-dasharray="3,5" opacity="${n?.3:.1}"/>
                ${d}
                <circle cx="${c}" cy="${l}" r="${14}" fill="rgba(128,128,128,${n?.06:.02})"
                        stroke="${o}" stroke-width="0.8" opacity="${n?.7:.3}"/>
                <g transform="translate(${c},${l}) scale(0.7)" stroke="${o}" fill="none"
                   opacity="${n?.6:.25}" stroke-width="1.3" stroke-linecap="round">
                    ${this._deviceIcon(e.device_type,e.name||e.id)}
                </g>
                <text x="${560}" y="${l-2}" font-family="${r}" font-size="10"
                      font-weight="500" fill="${o}" opacity="0.7">${s}</text>
                <text x="${560}" y="${l+11}" font-family="${r}" font-size="10"
                      font-weight="700" fill="${o}" opacity="${n?.9:.4}">${pt(e.power)}</text>
            `})}_glowFilter(t,e,i){return V`<filter id="${t}" x="-35%" y="-35%" width="170%" height="170%">
            <feGaussianBlur stdDeviation="${i}" result="blur"/>
            <feFlood flood-color="${e}" flood-opacity="0.28"/>
            <feComposite in2="blur" operator="in"/>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>`}_showMoreInfo(t){const e=this._eid(t);e&&this.dispatchEvent(new CustomEvent("hass-more-info",{bubbles:!0,composed:!0,detail:{entityId:e}}))}_getLayout(){return this._compact?{vb:"0 0 400 680",S:{cx:200,cy:100,r:44,labelY:154},I:{cx:200,cy:232,r:20},B:{cx:100,cy:360,r:44,labelY:414},G:{cx:300,cy:360,r:44,labelY:414},H:{cx:200,cy:540,r:48,labelY:598},E:{cx:84,cy:555,r:34,labelY:598},paths:{solar:"M200,144 L200,212",battery:"M188,242 C155,278 120,315 100,316",grid:"M212,242 C245,278 280,315 300,316",home:"M200,252 C200,390 200,460 200,492",ev:"M200,252 C200,400 140,490 84,521"},sunArc:"M30,68 Q200,6 370,68",sunX:200,sunY:20,sunR:12,sunRisingX:40,sunSettingX:360,sunLabelY:76,starX:[60,120,280,330,180],starY:[20,12,18,24,8],font:{label:11,value:15,sub:10},statusY:660,wmX:390,wmY:676}:{vb:"0 0 700 510",S:{cx:85,cy:140,r:48,labelY:200},I:{cx:220,cy:200,r:20},E:{cx:150,cy:390,r:42,labelY:442},B:{cx:340,cy:390,r:48,labelY:448},H:{cx:400,cy:230,r:52,labelY:292},G:{cx:570,cy:140,r:46,labelY:198},paths:{solar:"M118,148 C158,165 192,188 208,200",home:"M242,198 C300,200 350,210 360,218",battery:"M228,215 C260,280 320,340 338,342",grid:"M232,188 C320,130 450,110 524,130",ev:"M210,215 C180,275 162,330 150,348"},sunArc:"M20,52 Q330,2 640,52",sunX:330,sunY:12,sunR:12,sunRisingX:28,sunSettingX:632,sunLabelY:60,starX:[100,200,450,550,330],starY:[20,12,15,28,8],font:{label:11,value:16,sub:10},statusY:495,wmX:690,wmY:506}}_deviceIcon(t,e){const i=(e||"").toLowerCase();return"ev_charger"===(t||"").toLowerCase()||i.includes("keba")||i.includes("charger")||i.includes("wallbox")?V`<rect x="-5" y="-9" width="10" height="14" rx="2"/>
                       <path d="M-1.5,-3.5 L0,1.5 L1.5,-3.5"/>
                       <line x1="0" y1="5" x2="0" y2="9"/>`:i.includes("heiz")||i.includes("heat")||i.includes("warm")||i.includes("boiler")?V`<path d="M-3,-9 C-3,-3 3,-3 3,-9"/>
                       <path d="M-3,-2 C-3,4 3,4 3,-2"/>
                       <path d="M-3,5 C-3,9 3,9 3,5"/>`:i.includes("wash")||i.includes("spül")||i.includes("geschirr")||i.includes("wasch")?V`<circle r="9"/><circle r="4.5"/><circle r="1.3" fill="currentColor" opacity="0.3" stroke="none"/>`:i.includes("pool")||i.includes("pump")?V`<circle r="7"/><path d="M-5,0 L5,0 M0,-5 L0,5" opacity="0.5"/>`:i.includes("klima")||i.includes("ac")||i.includes("cool")||i.includes("air")?V`<rect x="-9" y="-5" width="18" height="10" rx="2"/>
                       <path d="M-5,5 C-5,9 -2,9 -2,5" fill="none"/>
                       <path d="M2,5 C2,9 5,9 5,5" fill="none"/>`:i.includes("light")||i.includes("licht")||i.includes("lamp")?V`<path d="M-4,-9 C-7,-2 -2,3 -1.5,5 L1.5,5 C2,3 7,-2 4,-9 C2,-12 -2,-12 -4,-9Z"/>
                       <line x1="-1.5" y1="6" x2="1.5" y2="6"/>`:V`<path d="M-2.5,-9 L-2.5,0 L-5,0 L0,9 L0,0 L2.5,0 L-2.5,-9Z"/>`}getCardSize(){return 7}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"eb-system-diagram-card",name:"SEM System Diagram",description:"Power flow visualization with inline SVG illustrations for each energy component"});const ve=(t,e,i)=>Math.max(Math.min(t,i),e);function we(t){return ve(be(2.55*t),0,255)}function $e(t){return ve(be(255*t),0,255)}function ke(t){return ve(be(t/2.55)/100,0,1)}function Me(t){return ve(be(100*t),0,100)}const Se={0:0,1:1,2:2,3:3,4:4,5:5,6:6,7:7,8:8,9:9,A:10,B:11,C:12,D:13,E:14,F:15,a:10,b:11,c:12,d:13,e:14,f:15},Ce=[..."0123456789ABCDEF"],De=t=>Ce[15&t],ze=t=>Ce[(240&t)>>4]+Ce[15&t],Ee=t=>(240&t)>>4==(15&t);function Pe(t){var e=(t=>Ee(t.r)&&Ee(t.g)&&Ee(t.b)&&Ee(t.a))(t)?De:ze;return t?"#"+e(t.r)+e(t.g)+e(t.b)+((t,e)=>t<255?e(t):"")(t.a,e):void 0}const Te=/^(hsla?|hwb|hsv)\(\s*([-+.e\d]+)(?:deg)?[\s,]+([-+.e\d]+)%[\s,]+([-+.e\d]+)%(?:[\s,]+([-+.e\d]+)(%)?)?\s*\)$/;function Fe(t,e,i){const s=e*Math.min(i,1-i),r=(e,r=(e+t/30)%12)=>i-s*Math.max(Math.min(r-3,9-r,1),-1);return[r(0),r(8),r(4)]}function Ae(t,e,i){const s=(s,r=(s+t/60)%6)=>i-i*e*Math.max(Math.min(r,4-r,1),0);return[s(5),s(3),s(1)]}function Re(t,e,i){const s=Fe(t,1,.5);let r;for(e+i>1&&(r=1/(e+i),e*=r,i*=r),r=0;r<3;r++)s[r]*=1-e-i,s[r]+=e;return s}function Le(t){const e=t.r/255,i=t.g/255,s=t.b/255,r=Math.max(e,i,s),a=Math.min(e,i,s),o=(r+a)/2;let n,l,c;return r!==a&&(c=r-a,l=o>.5?c/(2-r-a):c/(r+a),n=function(t,e,i,s,r){return t===r?(e-i)/s+(e<i?6:0):e===r?(i-t)/s+2:(t-e)/s+4}(e,i,s,c,r),n=60*n+.5),[0|n,l||0,o]}function Ie(t,e,i,s){return(Array.isArray(e)?t(e[0],e[1],e[2]):t(e,i,s)).map($e)}function Oe(t,e,i){return Ie(Fe,t,e,i)}function Ne(t){return(t%360+360)%360}function He(t){const e=Te.exec(t);let i,s=255;if(!e)return;e[5]!==i&&(s=e[6]?we(+e[5]):$e(+e[5]));const r=Ne(+e[2]),a=+e[3]/100,o=+e[4]/100;return i="hwb"===e[1]?function(t,e,i){return Ie(Re,t,e,i)}(r,a,o):"hsv"===e[1]?function(t,e,i){return Ie(Ae,t,e,i)}(r,a,o):Oe(r,a,o),{r:i[0],g:i[1],b:i[2],a:s}}const Be={x:"dark",Z:"light",Y:"re",X:"blu",W:"gr",V:"medium",U:"slate",A:"ee",T:"ol",S:"or",B:"ra",C:"lateg",D:"ights",R:"in",Q:"turquois",E:"hi",P:"ro",O:"al",N:"le",M:"de",L:"yello",F:"en",K:"ch",G:"arks",H:"ea",I:"ightg",J:"wh"},We={OiceXe:"f0f8ff",antiquewEte:"faebd7",aqua:"ffff",aquamarRe:"7fffd4",azuY:"f0ffff",beige:"f5f5dc",bisque:"ffe4c4",black:"0",blanKedOmond:"ffebcd",Xe:"ff",XeviTet:"8a2be2",bPwn:"a52a2a",burlywood:"deb887",caMtXe:"5f9ea0",KartYuse:"7fff00",KocTate:"d2691e",cSO:"ff7f50",cSnflowerXe:"6495ed",cSnsilk:"fff8dc",crimson:"dc143c",cyan:"ffff",xXe:"8b",xcyan:"8b8b",xgTMnPd:"b8860b",xWay:"a9a9a9",xgYF:"6400",xgYy:"a9a9a9",xkhaki:"bdb76b",xmagFta:"8b008b",xTivegYF:"556b2f",xSange:"ff8c00",xScEd:"9932cc",xYd:"8b0000",xsOmon:"e9967a",xsHgYF:"8fbc8f",xUXe:"483d8b",xUWay:"2f4f4f",xUgYy:"2f4f4f",xQe:"ced1",xviTet:"9400d3",dAppRk:"ff1493",dApskyXe:"bfff",dimWay:"696969",dimgYy:"696969",dodgerXe:"1e90ff",fiYbrick:"b22222",flSOwEte:"fffaf0",foYstWAn:"228b22",fuKsia:"ff00ff",gaRsbSo:"dcdcdc",ghostwEte:"f8f8ff",gTd:"ffd700",gTMnPd:"daa520",Way:"808080",gYF:"8000",gYFLw:"adff2f",gYy:"808080",honeyMw:"f0fff0",hotpRk:"ff69b4",RdianYd:"cd5c5c",Rdigo:"4b0082",ivSy:"fffff0",khaki:"f0e68c",lavFMr:"e6e6fa",lavFMrXsh:"fff0f5",lawngYF:"7cfc00",NmoncEffon:"fffacd",ZXe:"add8e6",ZcSO:"f08080",Zcyan:"e0ffff",ZgTMnPdLw:"fafad2",ZWay:"d3d3d3",ZgYF:"90ee90",ZgYy:"d3d3d3",ZpRk:"ffb6c1",ZsOmon:"ffa07a",ZsHgYF:"20b2aa",ZskyXe:"87cefa",ZUWay:"778899",ZUgYy:"778899",ZstAlXe:"b0c4de",ZLw:"ffffe0",lime:"ff00",limegYF:"32cd32",lRF:"faf0e6",magFta:"ff00ff",maPon:"800000",VaquamarRe:"66cdaa",VXe:"cd",VScEd:"ba55d3",VpurpN:"9370db",VsHgYF:"3cb371",VUXe:"7b68ee",VsprRggYF:"fa9a",VQe:"48d1cc",VviTetYd:"c71585",midnightXe:"191970",mRtcYam:"f5fffa",mistyPse:"ffe4e1",moccasR:"ffe4b5",navajowEte:"ffdead",navy:"80",Tdlace:"fdf5e6",Tive:"808000",TivedBb:"6b8e23",Sange:"ffa500",SangeYd:"ff4500",ScEd:"da70d6",pOegTMnPd:"eee8aa",pOegYF:"98fb98",pOeQe:"afeeee",pOeviTetYd:"db7093",papayawEp:"ffefd5",pHKpuff:"ffdab9",peru:"cd853f",pRk:"ffc0cb",plum:"dda0dd",powMrXe:"b0e0e6",purpN:"800080",YbeccapurpN:"663399",Yd:"ff0000",Psybrown:"bc8f8f",PyOXe:"4169e1",saddNbPwn:"8b4513",sOmon:"fa8072",sandybPwn:"f4a460",sHgYF:"2e8b57",sHshell:"fff5ee",siFna:"a0522d",silver:"c0c0c0",skyXe:"87ceeb",UXe:"6a5acd",UWay:"708090",UgYy:"708090",snow:"fffafa",sprRggYF:"ff7f",stAlXe:"4682b4",tan:"d2b48c",teO:"8080",tEstN:"d8bfd8",tomato:"ff6347",Qe:"40e0d0",viTet:"ee82ee",JHt:"f5deb3",wEte:"ffffff",wEtesmoke:"f5f5f5",Lw:"ffff00",LwgYF:"9acd32"};let je;function Ve(t){je||(je=function(){const t={},e=Object.keys(We),i=Object.keys(Be);let s,r,a,o,n;for(s=0;s<e.length;s++){for(o=n=e[s],r=0;r<i.length;r++)a=i[r],n=n.replace(a,Be[a]);a=parseInt(We[o],16),t[n]=[a>>16&255,a>>8&255,255&a]}return t}(),je.transparent=[0,0,0,0]);const e=je[t.toLowerCase()];return e&&{r:e[0],g:e[1],b:e[2],a:4===e.length?e[3]:255}}const Ue=/^rgba?\(\s*([-+.\d]+)(%)?[\s,]+([-+.e\d]+)(%)?[\s,]+([-+.e\d]+)(%)?(?:[\s,/]+([-+.e\d]+)(%)?)?\s*\)$/;const Ye=t=>t<=.0031308?12.92*t:1.055*Math.pow(t,1/2.4)-.055,Ge=t=>t<=.04045?t/12.92:Math.pow((t+.055)/1.055,2.4);function qe(t,e,i){if(t){let s=Le(t);s[e]=Math.max(0,Math.min(s[e]+s[e]*i,0===e?360:1)),s=Oe(s),t.r=s[0],t.g=s[1],t.b=s[2]}}function Ke(t,e){return t?Object.assign(e||{},t):t}function Xe(t){var e={r:0,g:0,b:0,a:255};return Array.isArray(t)?t.length>=3&&(e={r:t[0],g:t[1],b:t[2],a:255},t.length>3&&(e.a=$e(t[3]))):(e=Ke(t,{r:0,g:0,b:0,a:1})).a=$e(e.a),e}function Ze(t){return"r"===t.charAt(0)?function(t){const e=Ue.exec(t);let i,s,r,a=255;if(e){if(e[7]!==i){const t=+e[7];a=e[8]?we(t):ve(255*t,0,255)}return i=+e[1],s=+e[3],r=+e[5],i=255&(e[2]?we(i):ve(i,0,255)),s=255&(e[4]?we(s):ve(s,0,255)),r=255&(e[6]?we(r):ve(r,0,255)),{r:i,g:s,b:r,a:a}}}(t):He(t)}class Qe{constructor(t){if(t instanceof Qe)return t;const e=typeof t;let i;var s,r,a;"object"===e?i=Xe(t):"string"===e&&(a=(s=t).length,"#"===s[0]&&(4===a||5===a?r={r:255&17*Se[s[1]],g:255&17*Se[s[2]],b:255&17*Se[s[3]],a:5===a?17*Se[s[4]]:255}:7!==a&&9!==a||(r={r:Se[s[1]]<<4|Se[s[2]],g:Se[s[3]]<<4|Se[s[4]],b:Se[s[5]]<<4|Se[s[6]],a:9===a?Se[s[7]]<<4|Se[s[8]]:255})),i=r||Ve(t)||Ze(t)),this._rgb=i,this._valid=!!i}get valid(){return this._valid}get rgb(){var t=Ke(this._rgb);return t&&(t.a=ke(t.a)),t}set rgb(t){this._rgb=Xe(t)}rgbString(){return this._valid?function(t){return t&&(t.a<255?`rgba(${t.r}, ${t.g}, ${t.b}, ${ke(t.a)})`:`rgb(${t.r}, ${t.g}, ${t.b})`)}(this._rgb):void 0}hexString(){return this._valid?Pe(this._rgb):void 0}hslString(){return this._valid?function(t){if(!t)return;const e=Le(t),i=e[0],s=Me(e[1]),r=Me(e[2]);return t.a<255?`hsla(${i}, ${s}%, ${r}%, ${ke(t.a)})`:`hsl(${i}, ${s}%, ${r}%)`}(this._rgb):void 0}mix(t,e){if(t){const i=this.rgb,s=t.rgb;let r;const a=e===r?.5:e,o=2*a-1,n=i.a-s.a,l=((o*n===-1?o:(o+n)/(1+o*n))+1)/2;r=1-l,i.r=255&l*i.r+r*s.r+.5,i.g=255&l*i.g+r*s.g+.5,i.b=255&l*i.b+r*s.b+.5,i.a=a*i.a+(1-a)*s.a,this.rgb=i}return this}interpolate(t,e){return t&&(this._rgb=function(t,e,i){const s=Ge(ke(t.r)),r=Ge(ke(t.g)),a=Ge(ke(t.b));return{r:$e(Ye(s+i*(Ge(ke(e.r))-s))),g:$e(Ye(r+i*(Ge(ke(e.g))-r))),b:$e(Ye(a+i*(Ge(ke(e.b))-a))),a:t.a+i*(e.a-t.a)}}(this._rgb,t._rgb,e)),this}clone(){return new Qe(this.rgb)}alpha(t){return this._rgb.a=$e(t),this}clearer(t){return this._rgb.a*=1-t,this}greyscale(){const t=this._rgb,e=be(.3*t.r+.59*t.g+.11*t.b);return t.r=t.g=t.b=e,this}opaquer(t){return this._rgb.a*=1+t,this}negate(){const t=this._rgb;return t.r=255-t.r,t.g=255-t.g,t.b=255-t.b,this}lighten(t){return qe(this._rgb,2,t),this}darken(t){return qe(this._rgb,2,-t),this}saturate(t){return qe(this._rgb,1,t),this}desaturate(t){return qe(this._rgb,1,-t),this}rotate(t){return function(t,e){var i=Le(t);i[0]=Ne(i[0]+e),i=Oe(i),t.r=i[0],t.g=i[1],t.b=i[2]}(this._rgb,t),this}}
/*!
 * Chart.js v4.4.7
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */function Je(){}const ti=(()=>{let t=0;return()=>t++})();function ei(t){return null==t}function ii(t){if(Array.isArray&&Array.isArray(t))return!0;const e=Object.prototype.toString.call(t);return"[object"===e.slice(0,7)&&"Array]"===e.slice(-6)}function si(t){return null!==t&&"[object Object]"===Object.prototype.toString.call(t)}function ri(t){return("number"==typeof t||t instanceof Number)&&isFinite(+t)}function ai(t,e){return ri(t)?t:e}function oi(t,e){return void 0===t?e:t}const ni=(t,e)=>"string"==typeof t&&t.endsWith("%")?parseFloat(t)/100*e:+t;function li(t,e,i){if(t&&"function"==typeof t.call)return t.apply(i,e)}function ci(t,e,i,s){let r,a,o;if(ii(t))for(a=t.length,r=0;r<a;r++)e.call(i,t[r],r);else if(si(t))for(o=Object.keys(t),a=o.length,r=0;r<a;r++)e.call(i,t[o[r]],o[r])}function hi(t,e){let i,s,r,a;if(!t||!e||t.length!==e.length)return!1;for(i=0,s=t.length;i<s;++i)if(r=t[i],a=e[i],r.datasetIndex!==a.datasetIndex||r.index!==a.index)return!1;return!0}function di(t){if(ii(t))return t.map(di);if(si(t)){const e=Object.create(null),i=Object.keys(t),s=i.length;let r=0;for(;r<s;++r)e[i[r]]=di(t[i[r]]);return e}return t}function pi(t){return-1===["__proto__","prototype","constructor"].indexOf(t)}function ui(t,e,i,s){if(!pi(t))return;const r=e[t],a=i[t];si(r)&&si(a)?gi(r,a,s):e[t]=di(a)}function gi(t,e,i){const s=ii(e)?e:[e],r=s.length;if(!si(t))return t;const a=(i=i||{}).merger||ui;let o;for(let e=0;e<r;++e){if(o=s[e],!si(o))continue;const r=Object.keys(o);for(let e=0,s=r.length;e<s;++e)a(r[e],t,o,i)}return t}function fi(t,e){return gi(t,e,{merger:_i})}function _i(t,e,i){if(!pi(t))return;const s=e[t],r=i[t];si(s)&&si(r)?fi(s,r):Object.prototype.hasOwnProperty.call(e,t)||(e[t]=di(r))}const mi={"":t=>t,x:t=>t.x,y:t=>t.y};function yi(t,e){const i=mi[e]||(mi[e]=function(t){const e=function(t){const e=t.split("."),i=[];let s="";for(const t of e)s+=t,s.endsWith("\\")?s=s.slice(0,-1)+".":(i.push(s),s="");return i}(t);return t=>{for(const i of e){if(""===i)break;t=t&&t[i]}return t}}(e));return i(t)}function xi(t){return t.charAt(0).toUpperCase()+t.slice(1)}const bi=t=>void 0!==t,vi=t=>"function"==typeof t,wi=(t,e)=>{if(t.size!==e.size)return!1;for(const i of t)if(!e.has(i))return!1;return!0};const $i=Math.PI,ki=2*$i,Mi=ki+$i,Si=Number.POSITIVE_INFINITY,Ci=$i/180,Di=$i/2,zi=$i/4,Ei=2*$i/3,Pi=Math.log10,Ti=Math.sign;function Fi(t,e,i){return Math.abs(t-e)<i}function Ai(t){const e=Math.round(t);t=Fi(t,e,t/1e3)?e:t;const i=Math.pow(10,Math.floor(Pi(t))),s=t/i;return(s<=1?1:s<=2?2:s<=5?5:10)*i}function Ri(t){return!isNaN(parseFloat(t))&&isFinite(t)}function Li(t,e,i){let s,r,a;for(s=0,r=t.length;s<r;s++)a=t[s][i],isNaN(a)||(e.min=Math.min(e.min,a),e.max=Math.max(e.max,a))}function Ii(t){return t*($i/180)}function Oi(t){return t*(180/$i)}function Ni(t){if(!ri(t))return;let e=1,i=0;for(;Math.round(t*e)/e!==t;)e*=10,i++;return i}function Hi(t,e){const i=e.x-t.x,s=e.y-t.y,r=Math.sqrt(i*i+s*s);let a=Math.atan2(s,i);return a<-.5*$i&&(a+=ki),{angle:a,distance:r}}function Bi(t,e){return Math.sqrt(Math.pow(e.x-t.x,2)+Math.pow(e.y-t.y,2))}function Wi(t,e){return(t-e+Mi)%ki-$i}function ji(t){return(t%ki+ki)%ki}function Vi(t,e,i,s){const r=ji(t),a=ji(e),o=ji(i),n=ji(a-r),l=ji(o-r),c=ji(r-a),h=ji(r-o);return r===a||r===o||s&&a===o||n>l&&c<h}function Ui(t,e,i){return Math.max(e,Math.min(i,t))}function Yi(t,e,i,s=1e-6){return t>=Math.min(e,i)-s&&t<=Math.max(e,i)+s}function Gi(t,e,i){i=i||(i=>t[i]<e);let s,r=t.length-1,a=0;for(;r-a>1;)s=a+r>>1,i(s)?a=s:r=s;return{lo:a,hi:r}}const qi=(t,e,i,s)=>Gi(t,i,s?s=>{const r=t[s][e];return r<i||r===i&&t[s+1][e]===i}:s=>t[s][e]<i),Ki=(t,e,i)=>Gi(t,i,s=>t[s][e]>=i);const Xi=["push","pop","shift","splice","unshift"];function Zi(t,e){const i=t._chartjs;if(!i)return;const s=i.listeners,r=s.indexOf(e);-1!==r&&s.splice(r,1),s.length>0||(Xi.forEach(e=>{delete t[e]}),delete t._chartjs)}function Qi(t){const e=new Set(t);return e.size===t.length?t:Array.from(e)}const Ji="undefined"==typeof window?function(t){return t()}:window.requestAnimationFrame;function ts(t,e){let i=[],s=!1;return function(...r){i=r,s||(s=!0,Ji.call(window,()=>{s=!1,t.apply(e,i)}))}}const es=t=>"start"===t?"left":"end"===t?"right":"center",is=(t,e,i)=>"start"===t?e:"end"===t?i:(e+i)/2;function ss(t,e,i){const s=e.length;let r=0,a=s;if(t._sorted){const{iScale:o,_parsed:n}=t,l=o.axis,{min:c,max:h,minDefined:d,maxDefined:p}=o.getUserBounds();d&&(r=Ui(Math.min(qi(n,l,c).lo,i?s:qi(e,l,o.getPixelForValue(c)).lo),0,s-1)),a=p?Ui(Math.max(qi(n,o.axis,h,!0).hi+1,i?0:qi(e,l,o.getPixelForValue(h),!0).hi+1),r,s)-r:s-r}return{start:r,count:a}}function rs(t){const{xScale:e,yScale:i,_scaleRanges:s}=t,r={xmin:e.min,xmax:e.max,ymin:i.min,ymax:i.max};if(!s)return t._scaleRanges=r,!0;const a=s.xmin!==e.min||s.xmax!==e.max||s.ymin!==i.min||s.ymax!==i.max;return Object.assign(s,r),a}const as=t=>0===t||1===t,os=(t,e,i)=>-Math.pow(2,10*(t-=1))*Math.sin((t-e)*ki/i),ns=(t,e,i)=>Math.pow(2,-10*t)*Math.sin((t-e)*ki/i)+1,ls={linear:t=>t,easeInQuad:t=>t*t,easeOutQuad:t=>-t*(t-2),easeInOutQuad:t=>(t/=.5)<1?.5*t*t:-.5*(--t*(t-2)-1),easeInCubic:t=>t*t*t,easeOutCubic:t=>(t-=1)*t*t+1,easeInOutCubic:t=>(t/=.5)<1?.5*t*t*t:.5*((t-=2)*t*t+2),easeInQuart:t=>t*t*t*t,easeOutQuart:t=>-((t-=1)*t*t*t-1),easeInOutQuart:t=>(t/=.5)<1?.5*t*t*t*t:-.5*((t-=2)*t*t*t-2),easeInQuint:t=>t*t*t*t*t,easeOutQuint:t=>(t-=1)*t*t*t*t+1,easeInOutQuint:t=>(t/=.5)<1?.5*t*t*t*t*t:.5*((t-=2)*t*t*t*t+2),easeInSine:t=>1-Math.cos(t*Di),easeOutSine:t=>Math.sin(t*Di),easeInOutSine:t=>-.5*(Math.cos($i*t)-1),easeInExpo:t=>0===t?0:Math.pow(2,10*(t-1)),easeOutExpo:t=>1===t?1:1-Math.pow(2,-10*t),easeInOutExpo:t=>as(t)?t:t<.5?.5*Math.pow(2,10*(2*t-1)):.5*(2-Math.pow(2,-10*(2*t-1))),easeInCirc:t=>t>=1?t:-(Math.sqrt(1-t*t)-1),easeOutCirc:t=>Math.sqrt(1-(t-=1)*t),easeInOutCirc:t=>(t/=.5)<1?-.5*(Math.sqrt(1-t*t)-1):.5*(Math.sqrt(1-(t-=2)*t)+1),easeInElastic:t=>as(t)?t:os(t,.075,.3),easeOutElastic:t=>as(t)?t:ns(t,.075,.3),easeInOutElastic(t){const e=.1125;return as(t)?t:t<.5?.5*os(2*t,e,.45):.5+.5*ns(2*t-1,e,.45)},easeInBack(t){const e=1.70158;return t*t*((e+1)*t-e)},easeOutBack(t){const e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},easeInOutBack(t){let e=1.70158;return(t/=.5)<1?t*t*((1+(e*=1.525))*t-e)*.5:.5*((t-=2)*t*((1+(e*=1.525))*t+e)+2)},easeInBounce:t=>1-ls.easeOutBounce(1-t),easeOutBounce(t){const e=7.5625,i=2.75;return t<1/i?e*t*t:t<2/i?e*(t-=1.5/i)*t+.75:t<2.5/i?e*(t-=2.25/i)*t+.9375:e*(t-=2.625/i)*t+.984375},easeInOutBounce:t=>t<.5?.5*ls.easeInBounce(2*t):.5*ls.easeOutBounce(2*t-1)+.5};function cs(t){if(t&&"object"==typeof t){const e=t.toString();return"[object CanvasPattern]"===e||"[object CanvasGradient]"===e}return!1}function hs(t){return cs(t)?t:new Qe(t)}function ds(t){return cs(t)?t:new Qe(t).saturate(.5).darken(.1).hexString()}const ps=["x","y","borderWidth","radius","tension"],us=["color","borderColor","backgroundColor"];const gs=new Map;function fs(t,e,i){return function(t,e){e=e||{};const i=t+JSON.stringify(e);let s=gs.get(i);return s||(s=new Intl.NumberFormat(t,e),gs.set(i,s)),s}(e,i).format(t)}const _s={values:t=>ii(t)?t:""+t,numeric(t,e,i){if(0===t)return"0";const s=this.chart.options.locale;let r,a=t;if(i.length>1){const e=Math.max(Math.abs(i[0].value),Math.abs(i[i.length-1].value));(e<1e-4||e>1e15)&&(r="scientific"),a=function(t,e){let i=e.length>3?e[2].value-e[1].value:e[1].value-e[0].value;Math.abs(i)>=1&&t!==Math.floor(t)&&(i=t-Math.floor(t));return i}(t,i)}const o=Pi(Math.abs(a)),n=isNaN(o)?1:Math.max(Math.min(-1*Math.floor(o),20),0),l={notation:r,minimumFractionDigits:n,maximumFractionDigits:n};return Object.assign(l,this.options.ticks.format),fs(t,s,l)},logarithmic(t,e,i){if(0===t)return"0";const s=i[e].significand||t/Math.pow(10,Math.floor(Pi(t)));return[1,2,3,5,10,15].includes(s)||e>.8*i.length?_s.numeric.call(this,t,e,i):""}};var ms={formatters:_s};const ys=Object.create(null),xs=Object.create(null);function bs(t,e){if(!e)return t;const i=e.split(".");for(let e=0,s=i.length;e<s;++e){const s=i[e];t=t[s]||(t[s]=Object.create(null))}return t}function vs(t,e,i){return"string"==typeof e?gi(bs(t,e),i):gi(bs(t,""),e)}class ws{constructor(t,e){this.animation=void 0,this.backgroundColor="rgba(0,0,0,0.1)",this.borderColor="rgba(0,0,0,0.1)",this.color="#666",this.datasets={},this.devicePixelRatio=t=>t.chart.platform.getDevicePixelRatio(),this.elements={},this.events=["mousemove","mouseout","click","touchstart","touchmove"],this.font={family:"'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",size:12,style:"normal",lineHeight:1.2,weight:null},this.hover={},this.hoverBackgroundColor=(t,e)=>ds(e.backgroundColor),this.hoverBorderColor=(t,e)=>ds(e.borderColor),this.hoverColor=(t,e)=>ds(e.color),this.indexAxis="x",this.interaction={mode:"nearest",intersect:!0,includeInvisible:!1},this.maintainAspectRatio=!0,this.onHover=null,this.onClick=null,this.parsing=!0,this.plugins={},this.responsive=!0,this.scale=void 0,this.scales={},this.showLine=!0,this.drawActiveElementsOnTop=!0,this.describe(t),this.apply(e)}set(t,e){return vs(this,t,e)}get(t){return bs(this,t)}describe(t,e){return vs(xs,t,e)}override(t,e){return vs(ys,t,e)}route(t,e,i,s){const r=bs(this,t),a=bs(this,i),o="_"+e;Object.defineProperties(r,{[o]:{value:r[e],writable:!0},[e]:{enumerable:!0,get(){const t=this[o],e=a[s];return si(t)?Object.assign({},e,t):oi(t,e)},set(t){this[o]=t}}})}apply(t){t.forEach(t=>t(this))}}var $s=new ws({_scriptable:t=>!t.startsWith("on"),_indexable:t=>"events"!==t,hover:{_fallback:"interaction"},interaction:{_scriptable:!1,_indexable:!1}},[function(t){t.set("animation",{delay:void 0,duration:1e3,easing:"easeOutQuart",fn:void 0,from:void 0,loop:void 0,to:void 0,type:void 0}),t.describe("animation",{_fallback:!1,_indexable:!1,_scriptable:t=>"onProgress"!==t&&"onComplete"!==t&&"fn"!==t}),t.set("animations",{colors:{type:"color",properties:us},numbers:{type:"number",properties:ps}}),t.describe("animations",{_fallback:"animation"}),t.set("transitions",{active:{animation:{duration:400}},resize:{animation:{duration:0}},show:{animations:{colors:{from:"transparent"},visible:{type:"boolean",duration:0}}},hide:{animations:{colors:{to:"transparent"},visible:{type:"boolean",easing:"linear",fn:t=>0|t}}}})},function(t){t.set("layout",{autoPadding:!0,padding:{top:0,right:0,bottom:0,left:0}})},function(t){t.set("scale",{display:!0,offset:!1,reverse:!1,beginAtZero:!1,bounds:"ticks",clip:!0,grace:0,grid:{display:!0,lineWidth:1,drawOnChartArea:!0,drawTicks:!0,tickLength:8,tickWidth:(t,e)=>e.lineWidth,tickColor:(t,e)=>e.color,offset:!1},border:{display:!0,dash:[],dashOffset:0,width:1},title:{display:!1,text:"",padding:{top:4,bottom:4}},ticks:{minRotation:0,maxRotation:50,mirror:!1,textStrokeWidth:0,textStrokeColor:"",padding:3,display:!0,autoSkip:!0,autoSkipPadding:3,labelOffset:0,callback:ms.formatters.values,minor:{},major:{},align:"center",crossAlign:"near",showLabelBackdrop:!1,backdropColor:"rgba(255, 255, 255, 0.75)",backdropPadding:2}}),t.route("scale.ticks","color","","color"),t.route("scale.grid","color","","borderColor"),t.route("scale.border","color","","borderColor"),t.route("scale.title","color","","color"),t.describe("scale",{_fallback:!1,_scriptable:t=>!t.startsWith("before")&&!t.startsWith("after")&&"callback"!==t&&"parser"!==t,_indexable:t=>"borderDash"!==t&&"tickBorderDash"!==t&&"dash"!==t}),t.describe("scales",{_fallback:"scale"}),t.describe("scale.ticks",{_scriptable:t=>"backdropPadding"!==t&&"callback"!==t,_indexable:t=>"backdropPadding"!==t})}]);function ks(t,e,i,s,r){let a=e[r];return a||(a=e[r]=t.measureText(r).width,i.push(r)),a>s&&(s=a),s}function Ms(t,e,i,s){let r=(s=s||{}).data=s.data||{},a=s.garbageCollect=s.garbageCollect||[];s.font!==e&&(r=s.data={},a=s.garbageCollect=[],s.font=e),t.save(),t.font=e;let o=0;const n=i.length;let l,c,h,d,p;for(l=0;l<n;l++)if(d=i[l],null==d||ii(d)){if(ii(d))for(c=0,h=d.length;c<h;c++)p=d[c],null==p||ii(p)||(o=ks(t,r,a,o,p))}else o=ks(t,r,a,o,d);t.restore();const u=a.length/2;if(u>i.length){for(l=0;l<u;l++)delete r[a[l]];a.splice(0,u)}return o}function Ss(t,e,i){const s=t.currentDevicePixelRatio,r=0!==i?Math.max(i/2,.5):0;return Math.round((e-r)*s)/s+r}function Cs(t,e){(e||t)&&((e=e||t.getContext("2d")).save(),e.resetTransform(),e.clearRect(0,0,t.width,t.height),e.restore())}function Ds(t,e,i,s){zs(t,e,i,s,null)}function zs(t,e,i,s,r){let a,o,n,l,c,h,d,p;const u=e.pointStyle,g=e.rotation,f=e.radius;let _=(g||0)*Ci;if(u&&"object"==typeof u&&(a=u.toString(),"[object HTMLImageElement]"===a||"[object HTMLCanvasElement]"===a))return t.save(),t.translate(i,s),t.rotate(_),t.drawImage(u,-u.width/2,-u.height/2,u.width,u.height),void t.restore();if(!(isNaN(f)||f<=0)){switch(t.beginPath(),u){default:r?t.ellipse(i,s,r/2,f,0,0,ki):t.arc(i,s,f,0,ki),t.closePath();break;case"triangle":h=r?r/2:f,t.moveTo(i+Math.sin(_)*h,s-Math.cos(_)*f),_+=Ei,t.lineTo(i+Math.sin(_)*h,s-Math.cos(_)*f),_+=Ei,t.lineTo(i+Math.sin(_)*h,s-Math.cos(_)*f),t.closePath();break;case"rectRounded":c=.516*f,l=f-c,o=Math.cos(_+zi)*l,d=Math.cos(_+zi)*(r?r/2-c:l),n=Math.sin(_+zi)*l,p=Math.sin(_+zi)*(r?r/2-c:l),t.arc(i-d,s-n,c,_-$i,_-Di),t.arc(i+p,s-o,c,_-Di,_),t.arc(i+d,s+n,c,_,_+Di),t.arc(i-p,s+o,c,_+Di,_+$i),t.closePath();break;case"rect":if(!g){l=Math.SQRT1_2*f,h=r?r/2:l,t.rect(i-h,s-l,2*h,2*l);break}_+=zi;case"rectRot":d=Math.cos(_)*(r?r/2:f),o=Math.cos(_)*f,n=Math.sin(_)*f,p=Math.sin(_)*(r?r/2:f),t.moveTo(i-d,s-n),t.lineTo(i+p,s-o),t.lineTo(i+d,s+n),t.lineTo(i-p,s+o),t.closePath();break;case"crossRot":_+=zi;case"cross":d=Math.cos(_)*(r?r/2:f),o=Math.cos(_)*f,n=Math.sin(_)*f,p=Math.sin(_)*(r?r/2:f),t.moveTo(i-d,s-n),t.lineTo(i+d,s+n),t.moveTo(i+p,s-o),t.lineTo(i-p,s+o);break;case"star":d=Math.cos(_)*(r?r/2:f),o=Math.cos(_)*f,n=Math.sin(_)*f,p=Math.sin(_)*(r?r/2:f),t.moveTo(i-d,s-n),t.lineTo(i+d,s+n),t.moveTo(i+p,s-o),t.lineTo(i-p,s+o),_+=zi,d=Math.cos(_)*(r?r/2:f),o=Math.cos(_)*f,n=Math.sin(_)*f,p=Math.sin(_)*(r?r/2:f),t.moveTo(i-d,s-n),t.lineTo(i+d,s+n),t.moveTo(i+p,s-o),t.lineTo(i-p,s+o);break;case"line":o=r?r/2:Math.cos(_)*f,n=Math.sin(_)*f,t.moveTo(i-o,s-n),t.lineTo(i+o,s+n);break;case"dash":t.moveTo(i,s),t.lineTo(i+Math.cos(_)*(r?r/2:f),s+Math.sin(_)*f);break;case!1:t.closePath()}t.fill(),e.borderWidth>0&&t.stroke()}}function Es(t,e,i){return i=i||.5,!e||t&&t.x>e.left-i&&t.x<e.right+i&&t.y>e.top-i&&t.y<e.bottom+i}function Ps(t,e){t.save(),t.beginPath(),t.rect(e.left,e.top,e.right-e.left,e.bottom-e.top),t.clip()}function Ts(t){t.restore()}function Fs(t,e,i,s,r){if(!e)return t.lineTo(i.x,i.y);if("middle"===r){const s=(e.x+i.x)/2;t.lineTo(s,e.y),t.lineTo(s,i.y)}else"after"===r!=!!s?t.lineTo(e.x,i.y):t.lineTo(i.x,e.y);t.lineTo(i.x,i.y)}function As(t,e,i,s){if(!e)return t.lineTo(i.x,i.y);t.bezierCurveTo(s?e.cp1x:e.cp2x,s?e.cp1y:e.cp2y,s?i.cp2x:i.cp1x,s?i.cp2y:i.cp1y,i.x,i.y)}function Rs(t,e,i,s,r){if(r.strikethrough||r.underline){const a=t.measureText(s),o=e-a.actualBoundingBoxLeft,n=e+a.actualBoundingBoxRight,l=i-a.actualBoundingBoxAscent,c=i+a.actualBoundingBoxDescent,h=r.strikethrough?(l+c)/2:c;t.strokeStyle=t.fillStyle,t.beginPath(),t.lineWidth=r.decorationWidth||2,t.moveTo(o,h),t.lineTo(n,h),t.stroke()}}function Ls(t,e){const i=t.fillStyle;t.fillStyle=e.color,t.fillRect(e.left,e.top,e.width,e.height),t.fillStyle=i}function Is(t,e,i,s,r,a={}){const o=ii(e)?e:[e],n=a.strokeWidth>0&&""!==a.strokeColor;let l,c;for(t.save(),t.font=r.string,function(t,e){e.translation&&t.translate(e.translation[0],e.translation[1]),ei(e.rotation)||t.rotate(e.rotation),e.color&&(t.fillStyle=e.color),e.textAlign&&(t.textAlign=e.textAlign),e.textBaseline&&(t.textBaseline=e.textBaseline)}(t,a),l=0;l<o.length;++l)c=o[l],a.backdrop&&Ls(t,a.backdrop),n&&(a.strokeColor&&(t.strokeStyle=a.strokeColor),ei(a.strokeWidth)||(t.lineWidth=a.strokeWidth),t.strokeText(c,i,s,a.maxWidth)),t.fillText(c,i,s,a.maxWidth),Rs(t,i,s,c,a),s+=Number(r.lineHeight);t.restore()}function Os(t,e){const{x:i,y:s,w:r,h:a,radius:o}=e;t.arc(i+o.topLeft,s+o.topLeft,o.topLeft,1.5*$i,$i,!0),t.lineTo(i,s+a-o.bottomLeft),t.arc(i+o.bottomLeft,s+a-o.bottomLeft,o.bottomLeft,$i,Di,!0),t.lineTo(i+r-o.bottomRight,s+a),t.arc(i+r-o.bottomRight,s+a-o.bottomRight,o.bottomRight,Di,0,!0),t.lineTo(i+r,s+o.topRight),t.arc(i+r-o.topRight,s+o.topRight,o.topRight,0,-Di,!0),t.lineTo(i+o.topLeft,s)}const Ns=/^(normal|(\d+(?:\.\d+)?)(px|em|%)?)$/,Hs=/^(normal|italic|initial|inherit|unset|(oblique( -?[0-9]?[0-9]deg)?))$/;function Bs(t,e){const i=(""+t).match(Ns);if(!i||"normal"===i[1])return 1.2*e;switch(t=+i[2],i[3]){case"px":return t;case"%":t/=100}return e*t}const Ws=t=>+t||0;function js(t,e){const i={},s=si(e),r=s?Object.keys(e):e,a=si(t)?s?i=>oi(t[i],t[e[i]]):e=>t[e]:()=>t;for(const t of r)i[t]=Ws(a(t));return i}function Vs(t){return js(t,{top:"y",right:"x",bottom:"y",left:"x"})}function Us(t){return js(t,["topLeft","topRight","bottomLeft","bottomRight"])}function Ys(t){const e=Vs(t);return e.width=e.left+e.right,e.height=e.top+e.bottom,e}function Gs(t,e){t=t||{},e=e||$s.font;let i=oi(t.size,e.size);"string"==typeof i&&(i=parseInt(i,10));let s=oi(t.style,e.style);s&&!(""+s).match(Hs)&&(console.warn('Invalid font style specified: "'+s+'"'),s=void 0);const r={family:oi(t.family,e.family),lineHeight:Bs(oi(t.lineHeight,e.lineHeight),i),size:i,style:s,weight:oi(t.weight,e.weight),string:""};return r.string=function(t){return!t||ei(t.size)||ei(t.family)?null:(t.style?t.style+" ":"")+(t.weight?t.weight+" ":"")+t.size+"px "+t.family}(r),r}function qs(t,e,i,s){let r,a,o;for(r=0,a=t.length;r<a;++r)if(o=t[r],void 0!==o&&void 0!==o)return o}function Ks(t,e){return Object.assign(Object.create(t),e)}function Xs(t,e=[""],i,s,r=()=>t[0]){const a=i||t;void 0===s&&(s=nr("_fallback",t));const o={[Symbol.toStringTag]:"Object",_cacheable:!0,_scopes:t,_rootScopes:a,_fallback:s,_getTarget:r,override:i=>Xs([i,...t],e,a,s)};return new Proxy(o,{deleteProperty:(e,i)=>(delete e[i],delete e._keys,delete t[0][i],!0),get:(i,s)=>er(i,s,()=>function(t,e,i,s){let r;for(const a of e)if(r=nr(Js(a,t),i),void 0!==r)return tr(t,r)?ar(i,s,t,r):r}(s,e,t,i)),getOwnPropertyDescriptor:(t,e)=>Reflect.getOwnPropertyDescriptor(t._scopes[0],e),getPrototypeOf:()=>Reflect.getPrototypeOf(t[0]),has:(t,e)=>lr(t).includes(e),ownKeys:t=>lr(t),set(t,e,i){const s=t._storage||(t._storage=r());return t[e]=s[e]=i,delete t._keys,!0}})}function Zs(t,e,i,s){const r={_cacheable:!1,_proxy:t,_context:e,_subProxy:i,_stack:new Set,_descriptors:Qs(t,s),setContext:e=>Zs(t,e,i,s),override:r=>Zs(t.override(r),e,i,s)};return new Proxy(r,{deleteProperty:(e,i)=>(delete e[i],delete t[i],!0),get:(t,e,i)=>er(t,e,()=>function(t,e,i){const{_proxy:s,_context:r,_subProxy:a,_descriptors:o}=t;let n=s[e];vi(n)&&o.isScriptable(e)&&(n=function(t,e,i,s){const{_proxy:r,_context:a,_subProxy:o,_stack:n}=i;if(n.has(t))throw new Error("Recursion detected: "+Array.from(n).join("->")+"->"+t);n.add(t);let l=e(a,o||s);n.delete(t),tr(t,l)&&(l=ar(r._scopes,r,t,l));return l}(e,n,t,i));ii(n)&&n.length&&(n=function(t,e,i,s){const{_proxy:r,_context:a,_subProxy:o,_descriptors:n}=i;if(void 0!==a.index&&s(t))return e[a.index%e.length];if(si(e[0])){const i=e,s=r._scopes.filter(t=>t!==i);e=[];for(const l of i){const i=ar(s,r,t,l);e.push(Zs(i,a,o&&o[t],n))}}return e}(e,n,t,o.isIndexable));tr(e,n)&&(n=Zs(n,r,a&&a[e],o));return n}(t,e,i)),getOwnPropertyDescriptor:(e,i)=>e._descriptors.allKeys?Reflect.has(t,i)?{enumerable:!0,configurable:!0}:void 0:Reflect.getOwnPropertyDescriptor(t,i),getPrototypeOf:()=>Reflect.getPrototypeOf(t),has:(e,i)=>Reflect.has(t,i),ownKeys:()=>Reflect.ownKeys(t),set:(e,i,s)=>(t[i]=s,delete e[i],!0)})}function Qs(t,e={scriptable:!0,indexable:!0}){const{_scriptable:i=e.scriptable,_indexable:s=e.indexable,_allKeys:r=e.allKeys}=t;return{allKeys:r,scriptable:i,indexable:s,isScriptable:vi(i)?i:()=>i,isIndexable:vi(s)?s:()=>s}}const Js=(t,e)=>t?t+xi(e):e,tr=(t,e)=>si(e)&&"adapters"!==t&&(null===Object.getPrototypeOf(e)||e.constructor===Object);function er(t,e,i){if(Object.prototype.hasOwnProperty.call(t,e)||"constructor"===e)return t[e];const s=i();return t[e]=s,s}function ir(t,e,i){return vi(t)?t(e,i):t}const sr=(t,e)=>!0===t?e:"string"==typeof t?yi(e,t):void 0;function rr(t,e,i,s,r){for(const a of e){const e=sr(i,a);if(e){t.add(e);const a=ir(e._fallback,i,r);if(void 0!==a&&a!==i&&a!==s)return a}else if(!1===e&&void 0!==s&&i!==s)return null}return!1}function ar(t,e,i,s){const r=e._rootScopes,a=ir(e._fallback,i,s),o=[...t,...r],n=new Set;n.add(s);let l=or(n,o,i,a||i,s);return null!==l&&((void 0===a||a===i||(l=or(n,o,a,l,s),null!==l))&&Xs(Array.from(n),[""],r,a,()=>function(t,e,i){const s=t._getTarget();e in s||(s[e]={});const r=s[e];if(ii(r)&&si(i))return i;return r||{}}(e,i,s)))}function or(t,e,i,s,r){for(;i;)i=rr(t,e,i,s,r);return i}function nr(t,e){for(const i of e){if(!i)continue;const e=i[t];if(void 0!==e)return e}}function lr(t){let e=t._keys;return e||(e=t._keys=function(t){const e=new Set;for(const i of t)for(const t of Object.keys(i).filter(t=>!t.startsWith("_")))e.add(t);return Array.from(e)}(t._scopes)),e}function cr(t,e,i,s){const{iScale:r}=t,{key:a="r"}=this._parsing,o=new Array(s);let n,l,c,h;for(n=0,l=s;n<l;++n)c=n+i,h=e[c],o[n]={r:r.parse(yi(h,a),c)};return o}const hr=Number.EPSILON||1e-14,dr=(t,e)=>e<t.length&&!t[e].skip&&t[e],pr=t=>"x"===t?"y":"x";function ur(t,e,i,s){const r=t.skip?e:t,a=e,o=i.skip?e:i,n=Bi(a,r),l=Bi(o,a);let c=n/(n+l),h=l/(n+l);c=isNaN(c)?0:c,h=isNaN(h)?0:h;const d=s*c,p=s*h;return{previous:{x:a.x-d*(o.x-r.x),y:a.y-d*(o.y-r.y)},next:{x:a.x+p*(o.x-r.x),y:a.y+p*(o.y-r.y)}}}function gr(t,e="x"){const i=pr(e),s=t.length,r=Array(s).fill(0),a=Array(s);let o,n,l,c=dr(t,0);for(o=0;o<s;++o)if(n=l,l=c,c=dr(t,o+1),l){if(c){const t=c[e]-l[e];r[o]=0!==t?(c[i]-l[i])/t:0}a[o]=n?c?Ti(r[o-1])!==Ti(r[o])?0:(r[o-1]+r[o])/2:r[o-1]:r[o]}!function(t,e,i){const s=t.length;let r,a,o,n,l,c=dr(t,0);for(let h=0;h<s-1;++h)l=c,c=dr(t,h+1),l&&c&&(Fi(e[h],0,hr)?i[h]=i[h+1]=0:(r=i[h]/e[h],a=i[h+1]/e[h],n=Math.pow(r,2)+Math.pow(a,2),n<=9||(o=3/Math.sqrt(n),i[h]=r*o*e[h],i[h+1]=a*o*e[h])))}(t,r,a),function(t,e,i="x"){const s=pr(i),r=t.length;let a,o,n,l=dr(t,0);for(let c=0;c<r;++c){if(o=n,n=l,l=dr(t,c+1),!n)continue;const r=n[i],h=n[s];o&&(a=(r-o[i])/3,n[`cp1${i}`]=r-a,n[`cp1${s}`]=h-a*e[c]),l&&(a=(l[i]-r)/3,n[`cp2${i}`]=r+a,n[`cp2${s}`]=h+a*e[c])}}(t,a,e)}function fr(t,e,i){return Math.max(Math.min(t,i),e)}function _r(t,e,i,s,r){let a,o,n,l;if(e.spanGaps&&(t=t.filter(t=>!t.skip)),"monotone"===e.cubicInterpolationMode)gr(t,r);else{let i=s?t[t.length-1]:t[0];for(a=0,o=t.length;a<o;++a)n=t[a],l=ur(i,n,t[Math.min(a+1,o-(s?0:1))%o],e.tension),n.cp1x=l.previous.x,n.cp1y=l.previous.y,n.cp2x=l.next.x,n.cp2y=l.next.y,i=n}e.capBezierPoints&&function(t,e){let i,s,r,a,o,n=Es(t[0],e);for(i=0,s=t.length;i<s;++i)o=a,a=n,n=i<s-1&&Es(t[i+1],e),a&&(r=t[i],o&&(r.cp1x=fr(r.cp1x,e.left,e.right),r.cp1y=fr(r.cp1y,e.top,e.bottom)),n&&(r.cp2x=fr(r.cp2x,e.left,e.right),r.cp2y=fr(r.cp2y,e.top,e.bottom)))}(t,i)}function mr(){return"undefined"!=typeof window&&"undefined"!=typeof document}function yr(t){let e=t.parentNode;return e&&"[object ShadowRoot]"===e.toString()&&(e=e.host),e}function xr(t,e,i){let s;return"string"==typeof t?(s=parseInt(t,10),-1!==t.indexOf("%")&&(s=s/100*e.parentNode[i])):s=t,s}const br=t=>t.ownerDocument.defaultView.getComputedStyle(t,null);const vr=["top","right","bottom","left"];function wr(t,e,i){const s={};i=i?"-"+i:"";for(let r=0;r<4;r++){const a=vr[r];s[a]=parseFloat(t[e+"-"+a+i])||0}return s.width=s.left+s.right,s.height=s.top+s.bottom,s}function $r(t,e){if("native"in t)return t;const{canvas:i,currentDevicePixelRatio:s}=e,r=br(i),a="border-box"===r.boxSizing,o=wr(r,"padding"),n=wr(r,"border","width"),{x:l,y:c,box:h}=function(t,e){const i=t.touches,s=i&&i.length?i[0]:t,{offsetX:r,offsetY:a}=s;let o,n,l=!1;if(((t,e,i)=>(t>0||e>0)&&(!i||!i.shadowRoot))(r,a,t.target))o=r,n=a;else{const t=e.getBoundingClientRect();o=s.clientX-t.left,n=s.clientY-t.top,l=!0}return{x:o,y:n,box:l}}(t,i),d=o.left+(h&&n.left),p=o.top+(h&&n.top);let{width:u,height:g}=e;return a&&(u-=o.width+n.width,g-=o.height+n.height),{x:Math.round((l-d)/u*i.width/s),y:Math.round((c-p)/g*i.height/s)}}const kr=t=>Math.round(10*t)/10;function Mr(t,e,i,s){const r=br(t),a=wr(r,"margin"),o=xr(r.maxWidth,t,"clientWidth")||Si,n=xr(r.maxHeight,t,"clientHeight")||Si,l=function(t,e,i){let s,r;if(void 0===e||void 0===i){const a=t&&yr(t);if(a){const t=a.getBoundingClientRect(),o=br(a),n=wr(o,"border","width"),l=wr(o,"padding");e=t.width-l.width-n.width,i=t.height-l.height-n.height,s=xr(o.maxWidth,a,"clientWidth"),r=xr(o.maxHeight,a,"clientHeight")}else e=t.clientWidth,i=t.clientHeight}return{width:e,height:i,maxWidth:s||Si,maxHeight:r||Si}}(t,e,i);let{width:c,height:h}=l;if("content-box"===r.boxSizing){const t=wr(r,"border","width"),e=wr(r,"padding");c-=e.width+t.width,h-=e.height+t.height}c=Math.max(0,c-a.width),h=Math.max(0,s?c/s:h-a.height),c=kr(Math.min(c,o,l.maxWidth)),h=kr(Math.min(h,n,l.maxHeight)),c&&!h&&(h=kr(c/2));return(void 0!==e||void 0!==i)&&s&&l.height&&h>l.height&&(h=l.height,c=kr(Math.floor(h*s))),{width:c,height:h}}function Sr(t,e,i){const s=e||1,r=Math.floor(t.height*s),a=Math.floor(t.width*s);t.height=Math.floor(t.height),t.width=Math.floor(t.width);const o=t.canvas;return o.style&&(i||!o.style.height&&!o.style.width)&&(o.style.height=`${t.height}px`,o.style.width=`${t.width}px`),(t.currentDevicePixelRatio!==s||o.height!==r||o.width!==a)&&(t.currentDevicePixelRatio=s,o.height=r,o.width=a,t.ctx.setTransform(s,0,0,s,0,0),!0)}const Cr=function(){let t=!1;try{const e={get passive(){return t=!0,!1}};mr()&&(window.addEventListener("test",null,e),window.removeEventListener("test",null,e))}catch(t){}return t}();function Dr(t,e){const i=function(t,e){return br(t).getPropertyValue(e)}(t,e),s=i&&i.match(/^(\d+)(\.\d+)?px$/);return s?+s[1]:void 0}function zr(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:t.y+i*(e.y-t.y)}}function Er(t,e,i,s){return{x:t.x+i*(e.x-t.x),y:"middle"===s?i<.5?t.y:e.y:"after"===s?i<1?t.y:e.y:i>0?e.y:t.y}}function Pr(t,e,i,s){const r={x:t.cp2x,y:t.cp2y},a={x:e.cp1x,y:e.cp1y},o=zr(t,r,i),n=zr(r,a,i),l=zr(a,e,i),c=zr(o,n,i),h=zr(n,l,i);return zr(c,h,i)}function Tr(t,e,i){return t?function(t,e){return{x:i=>t+t+e-i,setWidth(t){e=t},textAlign:t=>"center"===t?t:"right"===t?"left":"right",xPlus:(t,e)=>t-e,leftForLtr:(t,e)=>t-e}}(e,i):{x:t=>t,setWidth(t){},textAlign:t=>t,xPlus:(t,e)=>t+e,leftForLtr:(t,e)=>t}}function Fr(t,e){let i,s;"ltr"!==e&&"rtl"!==e||(i=t.canvas.style,s=[i.getPropertyValue("direction"),i.getPropertyPriority("direction")],i.setProperty("direction",e,"important"),t.prevTextDirection=s)}function Ar(t,e){void 0!==e&&(delete t.prevTextDirection,t.canvas.style.setProperty("direction",e[0],e[1]))}function Rr(t){return"angle"===t?{between:Vi,compare:Wi,normalize:ji}:{between:Yi,compare:(t,e)=>t-e,normalize:t=>t}}function Lr({start:t,end:e,count:i,loop:s,style:r}){return{start:t%i,end:e%i,loop:s&&(e-t+1)%i==0,style:r}}function Ir(t,e,i){if(!i)return[t];const{property:s,start:r,end:a}=i,o=e.length,{compare:n,between:l,normalize:c}=Rr(s),{start:h,end:d,loop:p,style:u}=function(t,e,i){const{property:s,start:r,end:a}=i,{between:o,normalize:n}=Rr(s),l=e.length;let c,h,{start:d,end:p,loop:u}=t;if(u){for(d+=l,p+=l,c=0,h=l;c<h&&o(n(e[d%l][s]),r,a);++c)d--,p--;d%=l,p%=l}return p<d&&(p+=l),{start:d,end:p,loop:u,style:t.style}}(t,e,i),g=[];let f,_,m,y=!1,x=null;const b=()=>y||l(r,m,f)&&0!==n(r,m),v=()=>!y||0===n(a,f)||l(a,m,f);for(let t=h,i=h;t<=d;++t)_=e[t%o],_.skip||(f=c(_[s]),f!==m&&(y=l(f,r,a),null===x&&b()&&(x=0===n(f,r)?t:i),null!==x&&v()&&(g.push(Lr({start:x,end:t,loop:p,count:o,style:u})),x=null),i=t,m=f));return null!==x&&g.push(Lr({start:x,end:d,loop:p,count:o,style:u})),g}function Or(t,e){const i=[],s=t.segments;for(let r=0;r<s.length;r++){const a=Ir(s[r],t.points,e);a.length&&i.push(...a)}return i}function Nr(t,e,i,s){return s&&s.setContext&&i?function(t,e,i,s){const r=t._chart.getContext(),a=Hr(t.options),{_datasetIndex:o,options:{spanGaps:n}}=t,l=i.length,c=[];let h=a,d=e[0].start,p=d;function u(t,e,s,r){const a=n?-1:1;if(t!==e){for(t+=l;i[t%l].skip;)t-=a;for(;i[e%l].skip;)e+=a;t%l!==e%l&&(c.push({start:t%l,end:e%l,loop:s,style:r}),h=r,d=e%l)}}for(const t of e){d=n?d:t.start;let e,a=i[d%l];for(p=d+1;p<=t.end;p++){const n=i[p%l];e=Hr(s.setContext(Ks(r,{type:"segment",p0:a,p1:n,p0DataIndex:(p-1)%l,p1DataIndex:p%l,datasetIndex:o}))),Br(e,h)&&u(d,p-1,t.loop,h),a=n,h=e}d<p-1&&u(d,p-1,t.loop,h)}return c}(t,e,i,s):e}function Hr(t){return{backgroundColor:t.backgroundColor,borderCapStyle:t.borderCapStyle,borderDash:t.borderDash,borderDashOffset:t.borderDashOffset,borderJoinStyle:t.borderJoinStyle,borderWidth:t.borderWidth,borderColor:t.borderColor}}function Br(t,e){if(!e)return!1;const i=[],s=function(t,e){return cs(e)?(i.includes(e)||i.push(e),i.indexOf(e)):e};return JSON.stringify(t,s)!==JSON.stringify(e,s)}
/*!
 * Chart.js v4.4.7
 * https://www.chartjs.org
 * (c) 2024 Chart.js Contributors
 * Released under the MIT License
 */class Wr{constructor(){this._request=null,this._charts=new Map,this._running=!1,this._lastDate=void 0}_notify(t,e,i,s){const r=e.listeners[s],a=e.duration;r.forEach(s=>s({chart:t,initial:e.initial,numSteps:a,currentStep:Math.min(i-e.start,a)}))}_refresh(){this._request||(this._running=!0,this._request=Ji.call(window,()=>{this._update(),this._request=null,this._running&&this._refresh()}))}_update(t=Date.now()){let e=0;this._charts.forEach((i,s)=>{if(!i.running||!i.items.length)return;const r=i.items;let a,o=r.length-1,n=!1;for(;o>=0;--o)a=r[o],a._active?(a._total>i.duration&&(i.duration=a._total),a.tick(t),n=!0):(r[o]=r[r.length-1],r.pop());n&&(s.draw(),this._notify(s,i,t,"progress")),r.length||(i.running=!1,this._notify(s,i,t,"complete"),i.initial=!1),e+=r.length}),this._lastDate=t,0===e&&(this._running=!1)}_getAnims(t){const e=this._charts;let i=e.get(t);return i||(i={running:!1,initial:!0,items:[],listeners:{complete:[],progress:[]}},e.set(t,i)),i}listen(t,e,i){this._getAnims(t).listeners[e].push(i)}add(t,e){e&&e.length&&this._getAnims(t).items.push(...e)}has(t){return this._getAnims(t).items.length>0}start(t){const e=this._charts.get(t);e&&(e.running=!0,e.start=Date.now(),e.duration=e.items.reduce((t,e)=>Math.max(t,e._duration),0),this._refresh())}running(t){if(!this._running)return!1;const e=this._charts.get(t);return!!(e&&e.running&&e.items.length)}stop(t){const e=this._charts.get(t);if(!e||!e.items.length)return;const i=e.items;let s=i.length-1;for(;s>=0;--s)i[s].cancel();e.items=[],this._notify(t,e,Date.now(),"complete")}remove(t){return this._charts.delete(t)}}var jr=new Wr;const Vr="transparent",Ur={boolean:(t,e,i)=>i>.5?e:t,color(t,e,i){const s=hs(t||Vr),r=s.valid&&hs(e||Vr);return r&&r.valid?r.mix(s,i).hexString():e},number:(t,e,i)=>t+(e-t)*i};class Yr{constructor(t,e,i,s){const r=e[i];s=qs([t.to,s,r,t.from]);const a=qs([t.from,r,s]);this._active=!0,this._fn=t.fn||Ur[t.type||typeof a],this._easing=ls[t.easing]||ls.linear,this._start=Math.floor(Date.now()+(t.delay||0)),this._duration=this._total=Math.floor(t.duration),this._loop=!!t.loop,this._target=e,this._prop=i,this._from=a,this._to=s,this._promises=void 0}active(){return this._active}update(t,e,i){if(this._active){this._notify(!1);const s=this._target[this._prop],r=i-this._start,a=this._duration-r;this._start=i,this._duration=Math.floor(Math.max(a,t.duration)),this._total+=r,this._loop=!!t.loop,this._to=qs([t.to,e,s,t.from]),this._from=qs([t.from,s,e])}}cancel(){this._active&&(this.tick(Date.now()),this._active=!1,this._notify(!1))}tick(t){const e=t-this._start,i=this._duration,s=this._prop,r=this._from,a=this._loop,o=this._to;let n;if(this._active=r!==o&&(a||e<i),!this._active)return this._target[s]=o,void this._notify(!0);e<0?this._target[s]=r:(n=e/i%2,n=a&&n>1?2-n:n,n=this._easing(Math.min(1,Math.max(0,n))),this._target[s]=this._fn(r,o,n))}wait(){const t=this._promises||(this._promises=[]);return new Promise((e,i)=>{t.push({res:e,rej:i})})}_notify(t){const e=t?"res":"rej",i=this._promises||[];for(let t=0;t<i.length;t++)i[t][e]()}}class Gr{constructor(t,e){this._chart=t,this._properties=new Map,this.configure(e)}configure(t){if(!si(t))return;const e=Object.keys($s.animation),i=this._properties;Object.getOwnPropertyNames(t).forEach(s=>{const r=t[s];if(!si(r))return;const a={};for(const t of e)a[t]=r[t];(ii(r.properties)&&r.properties||[s]).forEach(t=>{t!==s&&i.has(t)||i.set(t,a)})})}_animateOptions(t,e){const i=e.options,s=function(t,e){if(!e)return;let i=t.options;if(!i)return void(t.options=e);i.$shared&&(t.options=i=Object.assign({},i,{$shared:!1,$animations:{}}));return i}(t,i);if(!s)return[];const r=this._createAnimations(s,i);return i.$shared&&function(t,e){const i=[],s=Object.keys(e);for(let e=0;e<s.length;e++){const r=t[s[e]];r&&r.active()&&i.push(r.wait())}return Promise.all(i)}(t.options.$animations,i).then(()=>{t.options=i},()=>{}),r}_createAnimations(t,e){const i=this._properties,s=[],r=t.$animations||(t.$animations={}),a=Object.keys(e),o=Date.now();let n;for(n=a.length-1;n>=0;--n){const l=a[n];if("$"===l.charAt(0))continue;if("options"===l){s.push(...this._animateOptions(t,e));continue}const c=e[l];let h=r[l];const d=i.get(l);if(h){if(d&&h.active()){h.update(d,c,o);continue}h.cancel()}d&&d.duration?(r[l]=h=new Yr(d,t,l,c),s.push(h)):t[l]=c}return s}update(t,e){if(0===this._properties.size)return void Object.assign(t,e);const i=this._createAnimations(t,e);return i.length?(jr.add(this._chart,i),!0):void 0}}function qr(t,e){const i=t&&t.options||{},s=i.reverse,r=void 0===i.min?e:0,a=void 0===i.max?e:0;return{start:s?a:r,end:s?r:a}}function Kr(t,e){const i=[],s=t._getSortedDatasetMetas(e);let r,a;for(r=0,a=s.length;r<a;++r)i.push(s[r].index);return i}function Xr(t,e,i,s={}){const r=t.keys,a="single"===s.mode;let o,n,l,c;if(null===e)return;let h=!1;for(o=0,n=r.length;o<n;++o){if(l=+r[o],l===i){if(h=!0,s.all)continue;break}c=t.values[l],ri(c)&&(a||0===e||Ti(e)===Ti(c))&&(e+=c)}return h||s.all?e:0}function Zr(t,e){const i=t&&t.options.stacked;return i||void 0===i&&void 0!==e.stack}function Qr(t,e,i){const s=t[e]||(t[e]={});return s[i]||(s[i]={})}function Jr(t,e,i,s){for(const r of e.getMatchingVisibleMetas(s).reverse()){const e=t[r.index];if(i&&e>0||!i&&e<0)return r.index}return null}function ta(t,e){const{chart:i,_cachedMeta:s}=t,r=i._stacks||(i._stacks={}),{iScale:a,vScale:o,index:n}=s,l=a.axis,c=o.axis,h=function(t,e,i){return`${t.id}.${e.id}.${i.stack||i.type}`}(a,o,s),d=e.length;let p;for(let t=0;t<d;++t){const i=e[t],{[l]:a,[c]:d}=i;p=(i._stacks||(i._stacks={}))[c]=Qr(r,h,a),p[n]=d,p._top=Jr(p,o,!0,s.type),p._bottom=Jr(p,o,!1,s.type);(p._visualValues||(p._visualValues={}))[n]=d}}function ea(t,e){const i=t.scales;return Object.keys(i).filter(t=>i[t].axis===e).shift()}function ia(t,e){const i=t.controller.index,s=t.vScale&&t.vScale.axis;if(s){e=e||t._parsed;for(const t of e){const e=t._stacks;if(!e||void 0===e[s]||void 0===e[s][i])return;delete e[s][i],void 0!==e[s]._visualValues&&void 0!==e[s]._visualValues[i]&&delete e[s]._visualValues[i]}}}const sa=t=>"reset"===t||"none"===t,ra=(t,e)=>e?t:Object.assign({},t);class aa{static defaults={};static datasetElementType=null;static dataElementType=null;constructor(t,e){this.chart=t,this._ctx=t.ctx,this.index=e,this._cachedDataOpts={},this._cachedMeta=this.getMeta(),this._type=this._cachedMeta.type,this.options=void 0,this._parsing=!1,this._data=void 0,this._objectData=void 0,this._sharedOptions=void 0,this._drawStart=void 0,this._drawCount=void 0,this.enableOptionSharing=!1,this.supportsDecimation=!1,this.$context=void 0,this._syncList=[],this.datasetElementType=new.target.datasetElementType,this.dataElementType=new.target.dataElementType,this.initialize()}initialize(){const t=this._cachedMeta;this.configure(),this.linkScales(),t._stacked=Zr(t.vScale,t),this.addElements(),this.options.fill&&!this.chart.isPluginEnabled("filler")&&console.warn("Tried to use the 'fill' option without the 'Filler' plugin enabled. Please import and register the 'Filler' plugin and make sure it is not disabled in the options")}updateIndex(t){this.index!==t&&ia(this._cachedMeta),this.index=t}linkScales(){const t=this.chart,e=this._cachedMeta,i=this.getDataset(),s=(t,e,i,s)=>"x"===t?e:"r"===t?s:i,r=e.xAxisID=oi(i.xAxisID,ea(t,"x")),a=e.yAxisID=oi(i.yAxisID,ea(t,"y")),o=e.rAxisID=oi(i.rAxisID,ea(t,"r")),n=e.indexAxis,l=e.iAxisID=s(n,r,a,o),c=e.vAxisID=s(n,a,r,o);e.xScale=this.getScaleForId(r),e.yScale=this.getScaleForId(a),e.rScale=this.getScaleForId(o),e.iScale=this.getScaleForId(l),e.vScale=this.getScaleForId(c)}getDataset(){return this.chart.data.datasets[this.index]}getMeta(){return this.chart.getDatasetMeta(this.index)}getScaleForId(t){return this.chart.scales[t]}_getOtherScale(t){const e=this._cachedMeta;return t===e.iScale?e.vScale:e.iScale}reset(){this._update("reset")}_destroy(){const t=this._cachedMeta;this._data&&Zi(this._data,this),t._stacked&&ia(t)}_dataCheck(){const t=this.getDataset(),e=t.data||(t.data=[]),i=this._data;if(si(e)){const t=this._cachedMeta;this._data=function(t,e){const{iScale:i,vScale:s}=e,r="x"===i.axis?"x":"y",a="x"===s.axis?"x":"y",o=Object.keys(t),n=new Array(o.length);let l,c,h;for(l=0,c=o.length;l<c;++l)h=o[l],n[l]={[r]:h,[a]:t[h]};return n}(e,t)}else if(i!==e){if(i){Zi(i,this);const t=this._cachedMeta;ia(t),t._parsed=[]}e&&Object.isExtensible(e)&&(r=this,(s=e)._chartjs?s._chartjs.listeners.push(r):(Object.defineProperty(s,"_chartjs",{configurable:!0,enumerable:!1,value:{listeners:[r]}}),Xi.forEach(t=>{const e="_onData"+xi(t),i=s[t];Object.defineProperty(s,t,{configurable:!0,enumerable:!1,value(...t){const r=i.apply(this,t);return s._chartjs.listeners.forEach(i=>{"function"==typeof i[e]&&i[e](...t)}),r}})}))),this._syncList=[],this._data=e}var s,r}addElements(){const t=this._cachedMeta;this._dataCheck(),this.datasetElementType&&(t.dataset=new this.datasetElementType)}buildOrUpdateElements(t){const e=this._cachedMeta,i=this.getDataset();let s=!1;this._dataCheck();const r=e._stacked;e._stacked=Zr(e.vScale,e),e.stack!==i.stack&&(s=!0,ia(e),e.stack=i.stack),this._resyncElements(t),(s||r!==e._stacked)&&(ta(this,e._parsed),e._stacked=Zr(e.vScale,e))}configure(){const t=this.chart.config,e=t.datasetScopeKeys(this._type),i=t.getOptionScopes(this.getDataset(),e,!0);this.options=t.createResolver(i,this.getContext()),this._parsing=this.options.parsing,this._cachedDataOpts={}}parse(t,e){const{_cachedMeta:i,_data:s}=this,{iScale:r,_stacked:a}=i,o=r.axis;let n,l,c,h=0===t&&e===s.length||i._sorted,d=t>0&&i._parsed[t-1];if(!1===this._parsing)i._parsed=s,i._sorted=!0,c=s;else{c=ii(s[t])?this.parseArrayData(i,s,t,e):si(s[t])?this.parseObjectData(i,s,t,e):this.parsePrimitiveData(i,s,t,e);const r=()=>null===l[o]||d&&l[o]<d[o];for(n=0;n<e;++n)i._parsed[n+t]=l=c[n],h&&(r()&&(h=!1),d=l);i._sorted=h}a&&ta(this,c)}parsePrimitiveData(t,e,i,s){const{iScale:r,vScale:a}=t,o=r.axis,n=a.axis,l=r.getLabels(),c=r===a,h=new Array(s);let d,p,u;for(d=0,p=s;d<p;++d)u=d+i,h[d]={[o]:c||r.parse(l[u],u),[n]:a.parse(e[u],u)};return h}parseArrayData(t,e,i,s){const{xScale:r,yScale:a}=t,o=new Array(s);let n,l,c,h;for(n=0,l=s;n<l;++n)c=n+i,h=e[c],o[n]={x:r.parse(h[0],c),y:a.parse(h[1],c)};return o}parseObjectData(t,e,i,s){const{xScale:r,yScale:a}=t,{xAxisKey:o="x",yAxisKey:n="y"}=this._parsing,l=new Array(s);let c,h,d,p;for(c=0,h=s;c<h;++c)d=c+i,p=e[d],l[c]={x:r.parse(yi(p,o),d),y:a.parse(yi(p,n),d)};return l}getParsed(t){return this._cachedMeta._parsed[t]}getDataElement(t){return this._cachedMeta.data[t]}applyStack(t,e,i){const s=this.chart,r=this._cachedMeta,a=e[t.axis];return Xr({keys:Kr(s,!0),values:e._stacks[t.axis]._visualValues},a,r.index,{mode:i})}updateRangeFromParsed(t,e,i,s){const r=i[e.axis];let a=null===r?NaN:r;const o=s&&i._stacks[e.axis];s&&o&&(s.values=o,a=Xr(s,r,this._cachedMeta.index)),t.min=Math.min(t.min,a),t.max=Math.max(t.max,a)}getMinMax(t,e){const i=this._cachedMeta,s=i._parsed,r=i._sorted&&t===i.iScale,a=s.length,o=this._getOtherScale(t),n=((t,e,i)=>t&&!e.hidden&&e._stacked&&{keys:Kr(i,!0),values:null})(e,i,this.chart),l={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY},{min:c,max:h}=function(t){const{min:e,max:i,minDefined:s,maxDefined:r}=t.getUserBounds();return{min:s?e:Number.NEGATIVE_INFINITY,max:r?i:Number.POSITIVE_INFINITY}}(o);let d,p;function u(){p=s[d];const e=p[o.axis];return!ri(p[t.axis])||c>e||h<e}for(d=0;d<a&&(u()||(this.updateRangeFromParsed(l,t,p,n),!r));++d);if(r)for(d=a-1;d>=0;--d)if(!u()){this.updateRangeFromParsed(l,t,p,n);break}return l}getAllParsedValues(t){const e=this._cachedMeta._parsed,i=[];let s,r,a;for(s=0,r=e.length;s<r;++s)a=e[s][t.axis],ri(a)&&i.push(a);return i}getMaxOverflow(){return!1}getLabelAndValue(t){const e=this._cachedMeta,i=e.iScale,s=e.vScale,r=this.getParsed(t);return{label:i?""+i.getLabelForValue(r[i.axis]):"",value:s?""+s.getLabelForValue(r[s.axis]):""}}_update(t){const e=this._cachedMeta;this.update(t||"default"),e._clip=function(t){let e,i,s,r;return si(t)?(e=t.top,i=t.right,s=t.bottom,r=t.left):e=i=s=r=t,{top:e,right:i,bottom:s,left:r,disabled:!1===t}}(oi(this.options.clip,function(t,e,i){if(!1===i)return!1;const s=qr(t,i),r=qr(e,i);return{top:r.end,right:s.end,bottom:r.start,left:s.start}}(e.xScale,e.yScale,this.getMaxOverflow())))}update(t){}draw(){const t=this._ctx,e=this.chart,i=this._cachedMeta,s=i.data||[],r=e.chartArea,a=[],o=this._drawStart||0,n=this._drawCount||s.length-o,l=this.options.drawActiveElementsOnTop;let c;for(i.dataset&&i.dataset.draw(t,r,o,n),c=o;c<o+n;++c){const e=s[c];e.hidden||(e.active&&l?a.push(e):e.draw(t,r))}for(c=0;c<a.length;++c)a[c].draw(t,r)}getStyle(t,e){const i=e?"active":"default";return void 0===t&&this._cachedMeta.dataset?this.resolveDatasetElementOptions(i):this.resolveDataElementOptions(t||0,i)}getContext(t,e,i){const s=this.getDataset();let r;if(t>=0&&t<this._cachedMeta.data.length){const e=this._cachedMeta.data[t];r=e.$context||(e.$context=function(t,e,i){return Ks(t,{active:!1,dataIndex:e,parsed:void 0,raw:void 0,element:i,index:e,mode:"default",type:"data"})}(this.getContext(),t,e)),r.parsed=this.getParsed(t),r.raw=s.data[t],r.index=r.dataIndex=t}else r=this.$context||(this.$context=function(t,e){return Ks(t,{active:!1,dataset:void 0,datasetIndex:e,index:e,mode:"default",type:"dataset"})}(this.chart.getContext(),this.index)),r.dataset=s,r.index=r.datasetIndex=this.index;return r.active=!!e,r.mode=i,r}resolveDatasetElementOptions(t){return this._resolveElementOptions(this.datasetElementType.id,t)}resolveDataElementOptions(t,e){return this._resolveElementOptions(this.dataElementType.id,e,t)}_resolveElementOptions(t,e="default",i){const s="active"===e,r=this._cachedDataOpts,a=t+"-"+e,o=r[a],n=this.enableOptionSharing&&bi(i);if(o)return ra(o,n);const l=this.chart.config,c=l.datasetElementScopeKeys(this._type,t),h=s?[`${t}Hover`,"hover",t,""]:[t,""],d=l.getOptionScopes(this.getDataset(),c),p=Object.keys($s.elements[t]),u=l.resolveNamedOptions(d,p,()=>this.getContext(i,s,e),h);return u.$shared&&(u.$shared=n,r[a]=Object.freeze(ra(u,n))),u}_resolveAnimations(t,e,i){const s=this.chart,r=this._cachedDataOpts,a=`animation-${e}`,o=r[a];if(o)return o;let n;if(!1!==s.options.animation){const s=this.chart.config,r=s.datasetAnimationScopeKeys(this._type,e),a=s.getOptionScopes(this.getDataset(),r);n=s.createResolver(a,this.getContext(t,i,e))}const l=new Gr(s,n&&n.animations);return n&&n._cacheable&&(r[a]=Object.freeze(l)),l}getSharedOptions(t){if(t.$shared)return this._sharedOptions||(this._sharedOptions=Object.assign({},t))}includeOptions(t,e){return!e||sa(t)||this.chart._animationsDisabled}_getSharedOptions(t,e){const i=this.resolveDataElementOptions(t,e),s=this._sharedOptions,r=this.getSharedOptions(i),a=this.includeOptions(e,r)||r!==s;return this.updateSharedOptions(r,e,i),{sharedOptions:r,includeOptions:a}}updateElement(t,e,i,s){sa(s)?Object.assign(t,i):this._resolveAnimations(e,s).update(t,i)}updateSharedOptions(t,e,i){t&&!sa(e)&&this._resolveAnimations(void 0,e).update(t,i)}_setStyle(t,e,i,s){t.active=s;const r=this.getStyle(e,s);this._resolveAnimations(e,i,s).update(t,{options:!s&&this.getSharedOptions(r)||r})}removeHoverStyle(t,e,i){this._setStyle(t,i,"active",!1)}setHoverStyle(t,e,i){this._setStyle(t,i,"active",!0)}_removeDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!1)}_setDatasetHoverStyle(){const t=this._cachedMeta.dataset;t&&this._setStyle(t,void 0,"active",!0)}_resyncElements(t){const e=this._data,i=this._cachedMeta.data;for(const[t,e,i]of this._syncList)this[t](e,i);this._syncList=[];const s=i.length,r=e.length,a=Math.min(r,s);a&&this.parse(0,a),r>s?this._insertElements(s,r-s,t):r<s&&this._removeElements(r,s-r)}_insertElements(t,e,i=!0){const s=this._cachedMeta,r=s.data,a=t+e;let o;const n=t=>{for(t.length+=e,o=t.length-1;o>=a;o--)t[o]=t[o-e]};for(n(r),o=t;o<a;++o)r[o]=new this.dataElementType;this._parsing&&n(s._parsed),this.parse(t,e),i&&this.updateElements(r,t,e,"reset")}updateElements(t,e,i,s){}_removeElements(t,e){const i=this._cachedMeta;if(this._parsing){const s=i._parsed.splice(t,e);i._stacked&&ia(i,s)}i.data.splice(t,e)}_sync(t){if(this._parsing)this._syncList.push(t);else{const[e,i,s]=t;this[e](i,s)}this.chart._dataChanges.push([this.index,...t])}_onDataPush(){const t=arguments.length;this._sync(["_insertElements",this.getDataset().data.length-t,t])}_onDataPop(){this._sync(["_removeElements",this._cachedMeta.data.length-1,1])}_onDataShift(){this._sync(["_removeElements",0,1])}_onDataSplice(t,e){e&&this._sync(["_removeElements",t,e]);const i=arguments.length-2;i&&this._sync(["_insertElements",t,i])}_onDataUnshift(){this._sync(["_insertElements",0,arguments.length])}}function oa(t){const e=t.iScale,i=function(t,e){if(!t._cache.$bar){const i=t.getMatchingVisibleMetas(e);let s=[];for(let e=0,r=i.length;e<r;e++)s=s.concat(i[e].controller.getAllParsedValues(t));t._cache.$bar=Qi(s.sort((t,e)=>t-e))}return t._cache.$bar}(e,t.type);let s,r,a,o,n=e._length;const l=()=>{32767!==a&&-32768!==a&&(bi(o)&&(n=Math.min(n,Math.abs(a-o)||n)),o=a)};for(s=0,r=i.length;s<r;++s)a=e.getPixelForValue(i[s]),l();for(o=void 0,s=0,r=e.ticks.length;s<r;++s)a=e.getPixelForTick(s),l();return n}function na(t,e,i,s){return ii(t)?function(t,e,i,s){const r=i.parse(t[0],s),a=i.parse(t[1],s),o=Math.min(r,a),n=Math.max(r,a);let l=o,c=n;Math.abs(o)>Math.abs(n)&&(l=n,c=o),e[i.axis]=c,e._custom={barStart:l,barEnd:c,start:r,end:a,min:o,max:n}}(t,e,i,s):e[i.axis]=i.parse(t,s),e}function la(t,e,i,s){const r=t.iScale,a=t.vScale,o=r.getLabels(),n=r===a,l=[];let c,h,d,p;for(c=i,h=i+s;c<h;++c)p=e[c],d={},d[r.axis]=n||r.parse(o[c],c),l.push(na(p,d,a,c));return l}function ca(t){return t&&void 0!==t.barStart&&void 0!==t.barEnd}function ha(t,e,i,s){let r=e.borderSkipped;const a={};if(!r)return void(t.borderSkipped=a);if(!0===r)return void(t.borderSkipped={top:!0,right:!0,bottom:!0,left:!0});const{start:o,end:n,reverse:l,top:c,bottom:h}=function(t){let e,i,s,r,a;return t.horizontal?(e=t.base>t.x,i="left",s="right"):(e=t.base<t.y,i="bottom",s="top"),e?(r="end",a="start"):(r="start",a="end"),{start:i,end:s,reverse:e,top:r,bottom:a}}(t);"middle"===r&&i&&(t.enableBorderRadius=!0,(i._top||0)===s?r=c:(i._bottom||0)===s?r=h:(a[da(h,o,n,l)]=!0,r=c)),a[da(r,o,n,l)]=!0,t.borderSkipped=a}function da(t,e,i,s){var r,a,o;return s?(o=i,t=pa(t=(r=t)===(a=e)?o:r===o?a:r,i,e)):t=pa(t,e,i),t}function pa(t,e,i){return"start"===t?e:"end"===t?i:t}function ua(t,{inflateAmount:e},i){t.inflateAmount="auto"===e?1===i?.33:0:e}class ga extends aa{static id="doughnut";static defaults={datasetElementType:!1,dataElementType:"arc",animation:{animateRotate:!0,animateScale:!1},animations:{numbers:{type:"number",properties:["circumference","endAngle","innerRadius","outerRadius","startAngle","x","y","offset","borderWidth","spacing"]}},cutout:"50%",rotation:0,circumference:360,radius:"100%",spacing:0,indexAxis:"r"};static descriptors={_scriptable:t=>"spacing"!==t,_indexable:t=>"spacing"!==t&&!t.startsWith("borderDash")&&!t.startsWith("hoverBorderDash")};static overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map((e,r)=>{const a=t.getDatasetMeta(0).controller.getStyle(r);return{text:e,fillStyle:a.backgroundColor,strokeStyle:a.borderColor,fontColor:s,lineWidth:a.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(r),index:r}})}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}}};constructor(t,e){super(t,e),this.enableOptionSharing=!0,this.innerRadius=void 0,this.outerRadius=void 0,this.offsetX=void 0,this.offsetY=void 0}linkScales(){}parse(t,e){const i=this.getDataset().data,s=this._cachedMeta;if(!1===this._parsing)s._parsed=i;else{let r,a,o=t=>+i[t];if(si(i[t])){const{key:t="value"}=this._parsing;o=e=>+yi(i[e],t)}for(r=t,a=t+e;r<a;++r)s._parsed[r]=o(r)}}_getRotation(){return Ii(this.options.rotation-90)}_getCircumference(){return Ii(this.options.circumference)}_getRotationExtents(){let t=ki,e=-ki;for(let i=0;i<this.chart.data.datasets.length;++i)if(this.chart.isDatasetVisible(i)&&this.chart.getDatasetMeta(i).type===this._type){const s=this.chart.getDatasetMeta(i).controller,r=s._getRotation(),a=s._getCircumference();t=Math.min(t,r),e=Math.max(e,r+a)}return{rotation:t,circumference:e-t}}update(t){const e=this.chart,{chartArea:i}=e,s=this._cachedMeta,r=s.data,a=this.getMaxBorderWidth()+this.getMaxOffset(r)+this.options.spacing,o=Math.max((Math.min(i.width,i.height)-a)/2,0),n=Math.min((l=this.options.cutout,c=o,"string"==typeof l&&l.endsWith("%")?parseFloat(l)/100:+l/c),1);var l,c;const h=this._getRingWeight(this.index),{circumference:d,rotation:p}=this._getRotationExtents(),{ratioX:u,ratioY:g,offsetX:f,offsetY:_}=function(t,e,i){let s=1,r=1,a=0,o=0;if(e<ki){const n=t,l=n+e,c=Math.cos(n),h=Math.sin(n),d=Math.cos(l),p=Math.sin(l),u=(t,e,s)=>Vi(t,n,l,!0)?1:Math.max(e,e*i,s,s*i),g=(t,e,s)=>Vi(t,n,l,!0)?-1:Math.min(e,e*i,s,s*i),f=u(0,c,d),_=u(Di,h,p),m=g($i,c,d),y=g($i+Di,h,p);s=(f-m)/2,r=(_-y)/2,a=-(f+m)/2,o=-(_+y)/2}return{ratioX:s,ratioY:r,offsetX:a,offsetY:o}}(p,d,n),m=(i.width-a)/u,y=(i.height-a)/g,x=Math.max(Math.min(m,y)/2,0),b=ni(this.options.radius,x),v=(b-Math.max(b*n,0))/this._getVisibleDatasetWeightTotal();this.offsetX=f*b,this.offsetY=_*b,s.total=this.calculateTotal(),this.outerRadius=b-v*this._getRingWeightOffset(this.index),this.innerRadius=Math.max(this.outerRadius-v*h,0),this.updateElements(r,0,r.length,t)}_circumference(t,e){const i=this.options,s=this._cachedMeta,r=this._getCircumference();return e&&i.animation.animateRotate||!this.chart.getDataVisibility(t)||null===s._parsed[t]||s.data[t].hidden?0:this.calculateCircumference(s._parsed[t]*r/ki)}updateElements(t,e,i,s){const r="reset"===s,a=this.chart,o=a.chartArea,n=a.options.animation,l=(o.left+o.right)/2,c=(o.top+o.bottom)/2,h=r&&n.animateScale,d=h?0:this.innerRadius,p=h?0:this.outerRadius,{sharedOptions:u,includeOptions:g}=this._getSharedOptions(e,s);let f,_=this._getRotation();for(f=0;f<e;++f)_+=this._circumference(f,r);for(f=e;f<e+i;++f){const e=this._circumference(f,r),i=t[f],a={x:l+this.offsetX,y:c+this.offsetY,startAngle:_,endAngle:_+e,circumference:e,outerRadius:p,innerRadius:d};g&&(a.options=u||this.resolveDataElementOptions(f,i.active?"active":s)),_+=e,this.updateElement(i,f,a,s)}}calculateTotal(){const t=this._cachedMeta,e=t.data;let i,s=0;for(i=0;i<e.length;i++){const r=t._parsed[i];null===r||isNaN(r)||!this.chart.getDataVisibility(i)||e[i].hidden||(s+=Math.abs(r))}return s}calculateCircumference(t){const e=this._cachedMeta.total;return e>0&&!isNaN(t)?ki*(Math.abs(t)/e):0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=fs(e._parsed[t],i.options.locale);return{label:s[t]||"",value:r}}getMaxBorderWidth(t){let e=0;const i=this.chart;let s,r,a,o,n;if(!t)for(s=0,r=i.data.datasets.length;s<r;++s)if(i.isDatasetVisible(s)){a=i.getDatasetMeta(s),t=a.data,o=a.controller;break}if(!t)return 0;for(s=0,r=t.length;s<r;++s)n=o.resolveDataElementOptions(s),"inner"!==n.borderAlign&&(e=Math.max(e,n.borderWidth||0,n.hoverBorderWidth||0));return e}getMaxOffset(t){let e=0;for(let i=0,s=t.length;i<s;++i){const t=this.resolveDataElementOptions(i);e=Math.max(e,t.offset||0,t.hoverOffset||0)}return e}_getRingWeightOffset(t){let e=0;for(let i=0;i<t;++i)this.chart.isDatasetVisible(i)&&(e+=this._getRingWeight(i));return e}_getRingWeight(t){return Math.max(oi(this.chart.data.datasets[t].weight,1),0)}_getVisibleDatasetWeightTotal(){return this._getRingWeightOffset(this.chart.data.datasets.length)||1}}class fa extends aa{static id="polarArea";static defaults={dataElementType:"arc",animation:{animateRotate:!0,animateScale:!0},animations:{numbers:{type:"number",properties:["x","y","startAngle","endAngle","innerRadius","outerRadius"]}},indexAxis:"r",startAngle:0};static overrides={aspectRatio:1,plugins:{legend:{labels:{generateLabels(t){const e=t.data;if(e.labels.length&&e.datasets.length){const{labels:{pointStyle:i,color:s}}=t.legend.options;return e.labels.map((e,r)=>{const a=t.getDatasetMeta(0).controller.getStyle(r);return{text:e,fillStyle:a.backgroundColor,strokeStyle:a.borderColor,fontColor:s,lineWidth:a.borderWidth,pointStyle:i,hidden:!t.getDataVisibility(r),index:r}})}return[]}},onClick(t,e,i){i.chart.toggleDataVisibility(e.index),i.chart.update()}}},scales:{r:{type:"radialLinear",angleLines:{display:!1},beginAtZero:!0,grid:{circular:!0},pointLabels:{display:!1},startAngle:0}}};constructor(t,e){super(t,e),this.innerRadius=void 0,this.outerRadius=void 0}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart,s=i.data.labels||[],r=fs(e._parsed[t].r,i.options.locale);return{label:s[t]||"",value:r}}parseObjectData(t,e,i,s){return cr.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta.data;this._updateRadius(),this.updateElements(e,0,e.length,t)}getMinMax(){const t=this._cachedMeta,e={min:Number.POSITIVE_INFINITY,max:Number.NEGATIVE_INFINITY};return t.data.forEach((t,i)=>{const s=this.getParsed(i).r;!isNaN(s)&&this.chart.getDataVisibility(i)&&(s<e.min&&(e.min=s),s>e.max&&(e.max=s))}),e}_updateRadius(){const t=this.chart,e=t.chartArea,i=t.options,s=Math.min(e.right-e.left,e.bottom-e.top),r=Math.max(s/2,0),a=(r-Math.max(i.cutoutPercentage?r/100*i.cutoutPercentage:1,0))/t.getVisibleDatasetCount();this.outerRadius=r-a*this.index,this.innerRadius=this.outerRadius-a}updateElements(t,e,i,s){const r="reset"===s,a=this.chart,o=a.options.animation,n=this._cachedMeta.rScale,l=n.xCenter,c=n.yCenter,h=n.getIndexAngle(0)-.5*$i;let d,p=h;const u=360/this.countVisibleElements();for(d=0;d<e;++d)p+=this._computeAngle(d,s,u);for(d=e;d<e+i;d++){const e=t[d];let i=p,g=p+this._computeAngle(d,s,u),f=a.getDataVisibility(d)?n.getDistanceFromCenterForValue(this.getParsed(d).r):0;p=g,r&&(o.animateScale&&(f=0),o.animateRotate&&(i=g=h));const _={x:l,y:c,innerRadius:0,outerRadius:f,startAngle:i,endAngle:g,options:this.resolveDataElementOptions(d,e.active?"active":s)};this.updateElement(e,d,_,s)}}countVisibleElements(){const t=this._cachedMeta;let e=0;return t.data.forEach((t,i)=>{!isNaN(this.getParsed(i).r)&&this.chart.getDataVisibility(i)&&e++}),e}_computeAngle(t,e,i){return this.chart.getDataVisibility(t)?Ii(this.resolveDataElementOptions(t,e).angle||i):0}}var _a=Object.freeze({__proto__:null,BarController:class extends aa{static id="bar";static defaults={datasetElementType:!1,dataElementType:"bar",categoryPercentage:.8,barPercentage:.9,grouped:!0,animations:{numbers:{type:"number",properties:["x","y","base","width","height"]}}};static overrides={scales:{_index_:{type:"category",offset:!0,grid:{offset:!0}},_value_:{type:"linear",beginAtZero:!0}}};parsePrimitiveData(t,e,i,s){return la(t,e,i,s)}parseArrayData(t,e,i,s){return la(t,e,i,s)}parseObjectData(t,e,i,s){const{iScale:r,vScale:a}=t,{xAxisKey:o="x",yAxisKey:n="y"}=this._parsing,l="x"===r.axis?o:n,c="x"===a.axis?o:n,h=[];let d,p,u,g;for(d=i,p=i+s;d<p;++d)g=e[d],u={},u[r.axis]=r.parse(yi(g,l),d),h.push(na(yi(g,c),u,a,d));return h}updateRangeFromParsed(t,e,i,s){super.updateRangeFromParsed(t,e,i,s);const r=i._custom;r&&e===this._cachedMeta.vScale&&(t.min=Math.min(t.min,r.min),t.max=Math.max(t.max,r.max))}getMaxOverflow(){return 0}getLabelAndValue(t){const e=this._cachedMeta,{iScale:i,vScale:s}=e,r=this.getParsed(t),a=r._custom,o=ca(a)?"["+a.start+", "+a.end+"]":""+s.getLabelForValue(r[s.axis]);return{label:""+i.getLabelForValue(r[i.axis]),value:o}}initialize(){this.enableOptionSharing=!0,super.initialize();this._cachedMeta.stack=this.getDataset().stack}update(t){const e=this._cachedMeta;this.updateElements(e.data,0,e.data.length,t)}updateElements(t,e,i,s){const r="reset"===s,{index:a,_cachedMeta:{vScale:o}}=this,n=o.getBasePixel(),l=o.isHorizontal(),c=this._getRuler(),{sharedOptions:h,includeOptions:d}=this._getSharedOptions(e,s);for(let p=e;p<e+i;p++){const e=this.getParsed(p),i=r||ei(e[o.axis])?{base:n,head:n}:this._calculateBarValuePixels(p),u=this._calculateBarIndexPixels(p,c),g=(e._stacks||{})[o.axis],f={horizontal:l,base:i.base,enableBorderRadius:!g||ca(e._custom)||a===g._top||a===g._bottom,x:l?i.head:u.center,y:l?u.center:i.head,height:l?u.size:Math.abs(i.size),width:l?Math.abs(i.size):u.size};d&&(f.options=h||this.resolveDataElementOptions(p,t[p].active?"active":s));const _=f.options||t[p].options;ha(f,_,g,a),ua(f,_,c.ratio),this.updateElement(t[p],p,f,s)}}_getStacks(t,e){const{iScale:i}=this._cachedMeta,s=i.getMatchingVisibleMetas(this._type).filter(t=>t.controller.options.grouped),r=i.options.stacked,a=[],o=this._cachedMeta.controller.getParsed(e),n=o&&o[i.axis],l=t=>{const e=t._parsed.find(t=>t[i.axis]===n),s=e&&e[t.vScale.axis];if(ei(s)||isNaN(s))return!0};for(const i of s)if((void 0===e||!l(i))&&((!1===r||-1===a.indexOf(i.stack)||void 0===r&&void 0===i.stack)&&a.push(i.stack),i.index===t))break;return a.length||a.push(void 0),a}_getStackCount(t){return this._getStacks(void 0,t).length}_getStackIndex(t,e,i){const s=this._getStacks(t,i),r=void 0!==e?s.indexOf(e):-1;return-1===r?s.length-1:r}_getRuler(){const t=this.options,e=this._cachedMeta,i=e.iScale,s=[];let r,a;for(r=0,a=e.data.length;r<a;++r)s.push(i.getPixelForValue(this.getParsed(r)[i.axis],r));const o=t.barThickness;return{min:o||oa(e),pixels:s,start:i._startPixel,end:i._endPixel,stackCount:this._getStackCount(),scale:i,grouped:t.grouped,ratio:o?1:t.categoryPercentage*t.barPercentage}}_calculateBarValuePixels(t){const{_cachedMeta:{vScale:e,_stacked:i,index:s},options:{base:r,minBarLength:a}}=this,o=r||0,n=this.getParsed(t),l=n._custom,c=ca(l);let h,d,p=n[e.axis],u=0,g=i?this.applyStack(e,n,i):p;g!==p&&(u=g-p,g=p),c&&(p=l.barStart,g=l.barEnd-l.barStart,0!==p&&Ti(p)!==Ti(l.barEnd)&&(u=0),u+=p);const f=ei(r)||c?u:r;let _=e.getPixelForValue(f);if(h=this.chart.getDataVisibility(t)?e.getPixelForValue(u+g):_,d=h-_,Math.abs(d)<a){d=function(t,e,i){return 0!==t?Ti(t):(e.isHorizontal()?1:-1)*(e.min>=i?1:-1)}(d,e,o)*a,p===o&&(_-=d/2);const t=e.getPixelForDecimal(0),r=e.getPixelForDecimal(1),l=Math.min(t,r),u=Math.max(t,r);_=Math.max(Math.min(_,u),l),h=_+d,i&&!c&&(n._stacks[e.axis]._visualValues[s]=e.getValueForPixel(h)-e.getValueForPixel(_))}if(_===e.getPixelForValue(o)){const t=Ti(d)*e.getLineWidthForValue(o)/2;_+=t,d-=t}return{size:d,base:_,head:h,center:h+d/2}}_calculateBarIndexPixels(t,e){const i=e.scale,s=this.options,r=s.skipNull,a=oi(s.maxBarThickness,1/0);let o,n;if(e.grouped){const i=r?this._getStackCount(t):e.stackCount,l="flex"===s.barThickness?function(t,e,i,s){const r=e.pixels,a=r[t];let o=t>0?r[t-1]:null,n=t<r.length-1?r[t+1]:null;const l=i.categoryPercentage;null===o&&(o=a-(null===n?e.end-e.start:n-a)),null===n&&(n=a+a-o);const c=a-(a-Math.min(o,n))/2*l;return{chunk:Math.abs(n-o)/2*l/s,ratio:i.barPercentage,start:c}}(t,e,s,i):function(t,e,i,s){const r=i.barThickness;let a,o;return ei(r)?(a=e.min*i.categoryPercentage,o=i.barPercentage):(a=r*s,o=1),{chunk:a/s,ratio:o,start:e.pixels[t]-a/2}}(t,e,s,i),c=this._getStackIndex(this.index,this._cachedMeta.stack,r?t:void 0);o=l.start+l.chunk*c+l.chunk/2,n=Math.min(a,l.chunk*l.ratio)}else o=i.getPixelForValue(this.getParsed(t)[i.axis],t),n=Math.min(a,e.min*e.ratio);return{base:o-n/2,head:o+n/2,center:o,size:n}}draw(){const t=this._cachedMeta,e=t.vScale,i=t.data,s=i.length;let r=0;for(;r<s;++r)null===this.getParsed(r)[e.axis]||i[r].hidden||i[r].draw(this._ctx)}},BubbleController:class extends aa{static id="bubble";static defaults={datasetElementType:!1,dataElementType:"point",animations:{numbers:{type:"number",properties:["x","y","borderWidth","radius"]}}};static overrides={scales:{x:{type:"linear"},y:{type:"linear"}}};initialize(){this.enableOptionSharing=!0,super.initialize()}parsePrimitiveData(t,e,i,s){const r=super.parsePrimitiveData(t,e,i,s);for(let t=0;t<r.length;t++)r[t]._custom=this.resolveDataElementOptions(t+i).radius;return r}parseArrayData(t,e,i,s){const r=super.parseArrayData(t,e,i,s);for(let t=0;t<r.length;t++){const s=e[i+t];r[t]._custom=oi(s[2],this.resolveDataElementOptions(t+i).radius)}return r}parseObjectData(t,e,i,s){const r=super.parseObjectData(t,e,i,s);for(let t=0;t<r.length;t++){const s=e[i+t];r[t]._custom=oi(s&&s.r&&+s.r,this.resolveDataElementOptions(t+i).radius)}return r}getMaxOverflow(){const t=this._cachedMeta.data;let e=0;for(let i=t.length-1;i>=0;--i)e=Math.max(e,t[i].size(this.resolveDataElementOptions(i))/2);return e>0&&e}getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,a=this.getParsed(t),o=s.getLabelForValue(a.x),n=r.getLabelForValue(a.y),l=a._custom;return{label:i[t]||"",value:"("+o+", "+n+(l?", "+l:"")+")"}}update(t){const e=this._cachedMeta.data;this.updateElements(e,0,e.length,t)}updateElements(t,e,i,s){const r="reset"===s,{iScale:a,vScale:o}=this._cachedMeta,{sharedOptions:n,includeOptions:l}=this._getSharedOptions(e,s),c=a.axis,h=o.axis;for(let d=e;d<e+i;d++){const e=t[d],i=!r&&this.getParsed(d),p={},u=p[c]=r?a.getPixelForDecimal(.5):a.getPixelForValue(i[c]),g=p[h]=r?o.getBasePixel():o.getPixelForValue(i[h]);p.skip=isNaN(u)||isNaN(g),l&&(p.options=n||this.resolveDataElementOptions(d,e.active?"active":s),r&&(p.options.radius=0)),this.updateElement(e,d,p,s)}}resolveDataElementOptions(t,e){const i=this.getParsed(t);let s=super.resolveDataElementOptions(t,e);s.$shared&&(s=Object.assign({},s,{$shared:!1}));const r=s.radius;return"active"!==e&&(s.radius=0),s.radius+=oi(i&&i._custom,r),s}},DoughnutController:ga,LineController:class extends aa{static id="line";static defaults={datasetElementType:"line",dataElementType:"point",showLine:!0,spanGaps:!1};static overrides={scales:{_index_:{type:"category"},_value_:{type:"linear"}}};initialize(){this.enableOptionSharing=!0,this.supportsDecimation=!0,super.initialize()}update(t){const e=this._cachedMeta,{dataset:i,data:s=[],_dataset:r}=e,a=this.chart._animationsDisabled;let{start:o,count:n}=ss(e,s,a);this._drawStart=o,this._drawCount=n,rs(e)&&(o=0,n=s.length),i._chart=this.chart,i._datasetIndex=this.index,i._decimated=!!r._decimated,i.points=s;const l=this.resolveDatasetElementOptions(t);this.options.showLine||(l.borderWidth=0),l.segment=this.options.segment,this.updateElement(i,void 0,{animated:!a,options:l},t),this.updateElements(s,o,n,t)}updateElements(t,e,i,s){const r="reset"===s,{iScale:a,vScale:o,_stacked:n,_dataset:l}=this._cachedMeta,{sharedOptions:c,includeOptions:h}=this._getSharedOptions(e,s),d=a.axis,p=o.axis,{spanGaps:u,segment:g}=this.options,f=Ri(u)?u:Number.POSITIVE_INFINITY,_=this.chart._animationsDisabled||r||"none"===s,m=e+i,y=t.length;let x=e>0&&this.getParsed(e-1);for(let i=0;i<y;++i){const u=t[i],y=_?u:{};if(i<e||i>=m){y.skip=!0;continue}const b=this.getParsed(i),v=ei(b[p]),w=y[d]=a.getPixelForValue(b[d],i),$=y[p]=r||v?o.getBasePixel():o.getPixelForValue(n?this.applyStack(o,b,n):b[p],i);y.skip=isNaN(w)||isNaN($)||v,y.stop=i>0&&Math.abs(b[d]-x[d])>f,g&&(y.parsed=b,y.raw=l.data[i]),h&&(y.options=c||this.resolveDataElementOptions(i,u.active?"active":s)),_||this.updateElement(u,i,y,s),x=b}}getMaxOverflow(){const t=this._cachedMeta,e=t.dataset,i=e.options&&e.options.borderWidth||0,s=t.data||[];if(!s.length)return i;const r=s[0].size(this.resolveDataElementOptions(0)),a=s[s.length-1].size(this.resolveDataElementOptions(s.length-1));return Math.max(i,r,a)/2}draw(){const t=this._cachedMeta;t.dataset.updateControlPoints(this.chart.chartArea,t.iScale.axis),super.draw()}},PieController:class extends ga{static id="pie";static defaults={cutout:0,rotation:0,circumference:360,radius:"100%"}},PolarAreaController:fa,RadarController:class extends aa{static id="radar";static defaults={datasetElementType:"line",dataElementType:"point",indexAxis:"r",showLine:!0,elements:{line:{fill:"start"}}};static overrides={aspectRatio:1,scales:{r:{type:"radialLinear"}}};getLabelAndValue(t){const e=this._cachedMeta.vScale,i=this.getParsed(t);return{label:e.getLabels()[t],value:""+e.getLabelForValue(i[e.axis])}}parseObjectData(t,e,i,s){return cr.bind(this)(t,e,i,s)}update(t){const e=this._cachedMeta,i=e.dataset,s=e.data||[],r=e.iScale.getLabels();if(i.points=s,"resize"!==t){const e=this.resolveDatasetElementOptions(t);this.options.showLine||(e.borderWidth=0);const a={_loop:!0,_fullLoop:r.length===s.length,options:e};this.updateElement(i,void 0,a,t)}this.updateElements(s,0,s.length,t)}updateElements(t,e,i,s){const r=this._cachedMeta.rScale,a="reset"===s;for(let o=e;o<e+i;o++){const e=t[o],i=this.resolveDataElementOptions(o,e.active?"active":s),n=r.getPointPositionForValue(o,this.getParsed(o).r),l=a?r.xCenter:n.x,c=a?r.yCenter:n.y,h={x:l,y:c,angle:n.angle,skip:isNaN(l)||isNaN(c),options:i};this.updateElement(e,o,h,s)}}},ScatterController:class extends aa{static id="scatter";static defaults={datasetElementType:!1,dataElementType:"point",showLine:!1,fill:!1};static overrides={interaction:{mode:"point"},scales:{x:{type:"linear"},y:{type:"linear"}}};getLabelAndValue(t){const e=this._cachedMeta,i=this.chart.data.labels||[],{xScale:s,yScale:r}=e,a=this.getParsed(t),o=s.getLabelForValue(a.x),n=r.getLabelForValue(a.y);return{label:i[t]||"",value:"("+o+", "+n+")"}}update(t){const e=this._cachedMeta,{data:i=[]}=e,s=this.chart._animationsDisabled;let{start:r,count:a}=ss(e,i,s);if(this._drawStart=r,this._drawCount=a,rs(e)&&(r=0,a=i.length),this.options.showLine){this.datasetElementType||this.addElements();const{dataset:r,_dataset:a}=e;r._chart=this.chart,r._datasetIndex=this.index,r._decimated=!!a._decimated,r.points=i;const o=this.resolveDatasetElementOptions(t);o.segment=this.options.segment,this.updateElement(r,void 0,{animated:!s,options:o},t)}else this.datasetElementType&&(delete e.dataset,this.datasetElementType=!1);this.updateElements(i,r,a,t)}addElements(){const{showLine:t}=this.options;!this.datasetElementType&&t&&(this.datasetElementType=this.chart.registry.getElement("line")),super.addElements()}updateElements(t,e,i,s){const r="reset"===s,{iScale:a,vScale:o,_stacked:n,_dataset:l}=this._cachedMeta,c=this.resolveDataElementOptions(e,s),h=this.getSharedOptions(c),d=this.includeOptions(s,h),p=a.axis,u=o.axis,{spanGaps:g,segment:f}=this.options,_=Ri(g)?g:Number.POSITIVE_INFINITY,m=this.chart._animationsDisabled||r||"none"===s;let y=e>0&&this.getParsed(e-1);for(let c=e;c<e+i;++c){const e=t[c],i=this.getParsed(c),g=m?e:{},x=ei(i[u]),b=g[p]=a.getPixelForValue(i[p],c),v=g[u]=r||x?o.getBasePixel():o.getPixelForValue(n?this.applyStack(o,i,n):i[u],c);g.skip=isNaN(b)||isNaN(v)||x,g.stop=c>0&&Math.abs(i[p]-y[p])>_,f&&(g.parsed=i,g.raw=l.data[c]),d&&(g.options=h||this.resolveDataElementOptions(c,e.active?"active":s)),m||this.updateElement(e,c,g,s),y=i}this.updateSharedOptions(h,s,c)}getMaxOverflow(){const t=this._cachedMeta,e=t.data||[];if(!this.options.showLine){let t=0;for(let i=e.length-1;i>=0;--i)t=Math.max(t,e[i].size(this.resolveDataElementOptions(i))/2);return t>0&&t}const i=t.dataset,s=i.options&&i.options.borderWidth||0;if(!e.length)return s;const r=e[0].size(this.resolveDataElementOptions(0)),a=e[e.length-1].size(this.resolveDataElementOptions(e.length-1));return Math.max(s,r,a)/2}}});function ma(){throw new Error("This method is not implemented: Check that a complete date adapter is provided.")}class ya{static override(t){Object.assign(ya.prototype,t)}options;constructor(t){this.options=t||{}}init(){}formats(){return ma()}parse(){return ma()}format(){return ma()}add(){return ma()}diff(){return ma()}startOf(){return ma()}endOf(){return ma()}}var xa={_date:ya};function ba(t,e,i,s){const{controller:r,data:a,_sorted:o}=t,n=r._cachedMeta.iScale;if(n&&e===n.axis&&"r"!==e&&o&&a.length){const t=n._reversePixels?Ki:qi;if(!s)return t(a,e,i);if(r._sharedOptions){const s=a[0],r="function"==typeof s.getRange&&s.getRange(e);if(r){const s=t(a,e,i-r),o=t(a,e,i+r);return{lo:s.lo,hi:o.hi}}}}return{lo:0,hi:a.length-1}}function va(t,e,i,s,r){const a=t.getSortedVisibleDatasetMetas(),o=i[e];for(let t=0,i=a.length;t<i;++t){const{index:i,data:n}=a[t],{lo:l,hi:c}=ba(a[t],e,o,r);for(let t=l;t<=c;++t){const e=n[t];e.skip||s(e,i,t)}}}function wa(t,e,i,s,r){const a=[];if(!r&&!t.isPointInArea(e))return a;return va(t,i,e,function(i,o,n){(r||Es(i,t.chartArea,0))&&i.inRange(e.x,e.y,s)&&a.push({element:i,datasetIndex:o,index:n})},!0),a}function $a(t,e,i,s,r,a){let o=[];const n=function(t){const e=-1!==t.indexOf("x"),i=-1!==t.indexOf("y");return function(t,s){const r=e?Math.abs(t.x-s.x):0,a=i?Math.abs(t.y-s.y):0;return Math.sqrt(Math.pow(r,2)+Math.pow(a,2))}}(i);let l=Number.POSITIVE_INFINITY;return va(t,i,e,function(i,c,h){const d=i.inRange(e.x,e.y,r);if(s&&!d)return;const p=i.getCenterPoint(r);if(!(!!a||t.isPointInArea(p))&&!d)return;const u=n(e,p);u<l?(o=[{element:i,datasetIndex:c,index:h}],l=u):u===l&&o.push({element:i,datasetIndex:c,index:h})}),o}function ka(t,e,i,s,r,a){return a||t.isPointInArea(e)?"r"!==i||s?$a(t,e,i,s,r,a):function(t,e,i,s){let r=[];return va(t,i,e,function(t,i,a){const{startAngle:o,endAngle:n}=t.getProps(["startAngle","endAngle"],s),{angle:l}=Hi(t,{x:e.x,y:e.y});Vi(l,o,n)&&r.push({element:t,datasetIndex:i,index:a})}),r}(t,e,i,r):[]}function Ma(t,e,i,s,r){const a=[],o="x"===i?"inXRange":"inYRange";let n=!1;return va(t,i,e,(t,s,l)=>{t[o]&&t[o](e[i],r)&&(a.push({element:t,datasetIndex:s,index:l}),n=n||t.inRange(e.x,e.y,r))}),s&&!n?[]:a}var Sa={modes:{index(t,e,i,s){const r=$r(e,t),a=i.axis||"x",o=i.includeInvisible||!1,n=i.intersect?wa(t,r,a,s,o):ka(t,r,a,!1,s,o),l=[];return n.length?(t.getSortedVisibleDatasetMetas().forEach(t=>{const e=n[0].index,i=t.data[e];i&&!i.skip&&l.push({element:i,datasetIndex:t.index,index:e})}),l):[]},dataset(t,e,i,s){const r=$r(e,t),a=i.axis||"xy",o=i.includeInvisible||!1;let n=i.intersect?wa(t,r,a,s,o):ka(t,r,a,!1,s,o);if(n.length>0){const e=n[0].datasetIndex,i=t.getDatasetMeta(e).data;n=[];for(let t=0;t<i.length;++t)n.push({element:i[t],datasetIndex:e,index:t})}return n},point:(t,e,i,s)=>wa(t,$r(e,t),i.axis||"xy",s,i.includeInvisible||!1),nearest(t,e,i,s){const r=$r(e,t),a=i.axis||"xy",o=i.includeInvisible||!1;return ka(t,r,a,i.intersect,s,o)},x:(t,e,i,s)=>Ma(t,$r(e,t),"x",i.intersect,s),y:(t,e,i,s)=>Ma(t,$r(e,t),"y",i.intersect,s)}};const Ca=["left","top","right","bottom"];function Da(t,e){return t.filter(t=>t.pos===e)}function za(t,e){return t.filter(t=>-1===Ca.indexOf(t.pos)&&t.box.axis===e)}function Ea(t,e){return t.sort((t,i)=>{const s=e?i:t,r=e?t:i;return s.weight===r.weight?s.index-r.index:s.weight-r.weight})}function Pa(t,e){const i=function(t){const e={};for(const i of t){const{stack:t,pos:s,stackWeight:r}=i;if(!t||!Ca.includes(s))continue;const a=e[t]||(e[t]={count:0,placed:0,weight:0,size:0});a.count++,a.weight+=r}return e}(t),{vBoxMaxWidth:s,hBoxMaxHeight:r}=e;let a,o,n;for(a=0,o=t.length;a<o;++a){n=t[a];const{fullSize:o}=n.box,l=i[n.stack],c=l&&n.stackWeight/l.weight;n.horizontal?(n.width=c?c*s:o&&e.availableWidth,n.height=r):(n.width=s,n.height=c?c*r:o&&e.availableHeight)}return i}function Ta(t,e,i,s){return Math.max(t[i],e[i])+Math.max(t[s],e[s])}function Fa(t,e){t.top=Math.max(t.top,e.top),t.left=Math.max(t.left,e.left),t.bottom=Math.max(t.bottom,e.bottom),t.right=Math.max(t.right,e.right)}function Aa(t,e,i,s){const{pos:r,box:a}=i,o=t.maxPadding;if(!si(r)){i.size&&(t[r]-=i.size);const e=s[i.stack]||{size:0,count:1};e.size=Math.max(e.size,i.horizontal?a.height:a.width),i.size=e.size/e.count,t[r]+=i.size}a.getPadding&&Fa(o,a.getPadding());const n=Math.max(0,e.outerWidth-Ta(o,t,"left","right")),l=Math.max(0,e.outerHeight-Ta(o,t,"top","bottom")),c=n!==t.w,h=l!==t.h;return t.w=n,t.h=l,i.horizontal?{same:c,other:h}:{same:h,other:c}}function Ra(t,e){const i=e.maxPadding;function s(t){const s={left:0,top:0,right:0,bottom:0};return t.forEach(t=>{s[t]=Math.max(e[t],i[t])}),s}return s(t?["left","right"]:["top","bottom"])}function La(t,e,i,s){const r=[];let a,o,n,l,c,h;for(a=0,o=t.length,c=0;a<o;++a){n=t[a],l=n.box,l.update(n.width||e.w,n.height||e.h,Ra(n.horizontal,e));const{same:o,other:d}=Aa(e,i,n,s);c|=o&&r.length,h=h||d,l.fullSize||r.push(n)}return c&&La(r,e,i,s)||h}function Ia(t,e,i,s,r){t.top=i,t.left=e,t.right=e+s,t.bottom=i+r,t.width=s,t.height=r}function Oa(t,e,i,s){const r=i.padding;let{x:a,y:o}=e;for(const n of t){const t=n.box,l=s[n.stack]||{placed:0,weight:1},c=n.stackWeight/l.weight||1;if(n.horizontal){const s=e.w*c,a=l.size||t.height;bi(l.start)&&(o=l.start),t.fullSize?Ia(t,r.left,o,i.outerWidth-r.right-r.left,a):Ia(t,e.left+l.placed,o,s,a),l.start=o,l.placed+=s,o=t.bottom}else{const s=e.h*c,o=l.size||t.width;bi(l.start)&&(a=l.start),t.fullSize?Ia(t,a,r.top,o,i.outerHeight-r.bottom-r.top):Ia(t,a,e.top+l.placed,o,s),l.start=a,l.placed+=s,a=t.right}}e.x=a,e.y=o}var Na={addBox(t,e){t.boxes||(t.boxes=[]),e.fullSize=e.fullSize||!1,e.position=e.position||"top",e.weight=e.weight||0,e._layers=e._layers||function(){return[{z:0,draw(t){e.draw(t)}}]},t.boxes.push(e)},removeBox(t,e){const i=t.boxes?t.boxes.indexOf(e):-1;-1!==i&&t.boxes.splice(i,1)},configure(t,e,i){e.fullSize=i.fullSize,e.position=i.position,e.weight=i.weight},update(t,e,i,s){if(!t)return;const r=Ys(t.options.layout.padding),a=Math.max(e-r.width,0),o=Math.max(i-r.height,0),n=function(t){const e=function(t){const e=[];let i,s,r,a,o,n;for(i=0,s=(t||[]).length;i<s;++i)r=t[i],({position:a,options:{stack:o,stackWeight:n=1}}=r),e.push({index:i,box:r,pos:a,horizontal:r.isHorizontal(),weight:r.weight,stack:o&&a+o,stackWeight:n});return e}(t),i=Ea(e.filter(t=>t.box.fullSize),!0),s=Ea(Da(e,"left"),!0),r=Ea(Da(e,"right")),a=Ea(Da(e,"top"),!0),o=Ea(Da(e,"bottom")),n=za(e,"x"),l=za(e,"y");return{fullSize:i,leftAndTop:s.concat(a),rightAndBottom:r.concat(l).concat(o).concat(n),chartArea:Da(e,"chartArea"),vertical:s.concat(r).concat(l),horizontal:a.concat(o).concat(n)}}(t.boxes),l=n.vertical,c=n.horizontal;ci(t.boxes,t=>{"function"==typeof t.beforeLayout&&t.beforeLayout()});const h=l.reduce((t,e)=>e.box.options&&!1===e.box.options.display?t:t+1,0)||1,d=Object.freeze({outerWidth:e,outerHeight:i,padding:r,availableWidth:a,availableHeight:o,vBoxMaxWidth:a/2/h,hBoxMaxHeight:o/2}),p=Object.assign({},r);Fa(p,Ys(s));const u=Object.assign({maxPadding:p,w:a,h:o,x:r.left,y:r.top},r),g=Pa(l.concat(c),d);La(n.fullSize,u,d,g),La(l,u,d,g),La(c,u,d,g)&&La(l,u,d,g),function(t){const e=t.maxPadding;function i(i){const s=Math.max(e[i]-t[i],0);return t[i]+=s,s}t.y+=i("top"),t.x+=i("left"),i("right"),i("bottom")}(u),Oa(n.leftAndTop,u,d,g),u.x+=u.w,u.y+=u.h,Oa(n.rightAndBottom,u,d,g),t.chartArea={left:u.left,top:u.top,right:u.left+u.w,bottom:u.top+u.h,height:u.h,width:u.w},ci(n.chartArea,e=>{const i=e.box;Object.assign(i,t.chartArea),i.update(u.w,u.h,{left:0,top:0,right:0,bottom:0})})}};class Ha{acquireContext(t,e){}releaseContext(t){return!1}addEventListener(t,e,i){}removeEventListener(t,e,i){}getDevicePixelRatio(){return 1}getMaximumSize(t,e,i,s){return e=Math.max(0,e||t.width),i=i||t.height,{width:e,height:Math.max(0,s?Math.floor(e/s):i)}}isAttached(t){return!0}updateConfig(t){}}class Ba extends Ha{acquireContext(t){return t&&t.getContext&&t.getContext("2d")||null}updateConfig(t){t.options.animation=!1}}const Wa="$chartjs",ja={touchstart:"mousedown",touchmove:"mousemove",touchend:"mouseup",pointerenter:"mouseenter",pointerdown:"mousedown",pointermove:"mousemove",pointerup:"mouseup",pointerleave:"mouseout",pointerout:"mouseout"},Va=t=>null===t||""===t;const Ua=!!Cr&&{passive:!0};function Ya(t,e,i){t&&t.canvas&&t.canvas.removeEventListener(e,i,Ua)}function Ga(t,e){for(const i of t)if(i===e||i.contains(e))return!0}function qa(t,e,i){const s=t.canvas,r=new MutationObserver(t=>{let e=!1;for(const i of t)e=e||Ga(i.addedNodes,s),e=e&&!Ga(i.removedNodes,s);e&&i()});return r.observe(document,{childList:!0,subtree:!0}),r}function Ka(t,e,i){const s=t.canvas,r=new MutationObserver(t=>{let e=!1;for(const i of t)e=e||Ga(i.removedNodes,s),e=e&&!Ga(i.addedNodes,s);e&&i()});return r.observe(document,{childList:!0,subtree:!0}),r}const Xa=new Map;let Za=0;function Qa(){const t=window.devicePixelRatio;t!==Za&&(Za=t,Xa.forEach((e,i)=>{i.currentDevicePixelRatio!==t&&e()}))}function Ja(t,e,i){const s=t.canvas,r=s&&yr(s);if(!r)return;const a=ts((t,e)=>{const s=r.clientWidth;i(t,e),s<r.clientWidth&&i()},window),o=new ResizeObserver(t=>{const e=t[0],i=e.contentRect.width,s=e.contentRect.height;0===i&&0===s||a(i,s)});return o.observe(r),function(t,e){Xa.size||window.addEventListener("resize",Qa),Xa.set(t,e)}(t,a),o}function to(t,e,i){i&&i.disconnect(),"resize"===e&&function(t){Xa.delete(t),Xa.size||window.removeEventListener("resize",Qa)}(t)}function eo(t,e,i){const s=t.canvas,r=ts(e=>{null!==t.ctx&&i(function(t,e){const i=ja[t.type]||t.type,{x:s,y:r}=$r(t,e);return{type:i,chart:e,native:t,x:void 0!==s?s:null,y:void 0!==r?r:null}}(e,t))},t);return function(t,e,i){t&&t.addEventListener(e,i,Ua)}(s,e,r),r}class io extends Ha{acquireContext(t,e){const i=t&&t.getContext&&t.getContext("2d");return i&&i.canvas===t?(function(t,e){const i=t.style,s=t.getAttribute("height"),r=t.getAttribute("width");if(t[Wa]={initial:{height:s,width:r,style:{display:i.display,height:i.height,width:i.width}}},i.display=i.display||"block",i.boxSizing=i.boxSizing||"border-box",Va(r)){const e=Dr(t,"width");void 0!==e&&(t.width=e)}if(Va(s))if(""===t.style.height)t.height=t.width/(e||2);else{const e=Dr(t,"height");void 0!==e&&(t.height=e)}}(t,e),i):null}releaseContext(t){const e=t.canvas;if(!e[Wa])return!1;const i=e[Wa].initial;["height","width"].forEach(t=>{const s=i[t];ei(s)?e.removeAttribute(t):e.setAttribute(t,s)});const s=i.style||{};return Object.keys(s).forEach(t=>{e.style[t]=s[t]}),e.width=e.width,delete e[Wa],!0}addEventListener(t,e,i){this.removeEventListener(t,e);const s=t.$proxies||(t.$proxies={}),r={attach:qa,detach:Ka,resize:Ja}[e]||eo;s[e]=r(t,e,i)}removeEventListener(t,e){const i=t.$proxies||(t.$proxies={}),s=i[e];if(!s)return;({attach:to,detach:to,resize:to}[e]||Ya)(t,e,s),i[e]=void 0}getDevicePixelRatio(){return window.devicePixelRatio}getMaximumSize(t,e,i,s){return Mr(t,e,i,s)}isAttached(t){const e=t&&yr(t);return!(!e||!e.isConnected)}}class so{static defaults={};static defaultRoutes=void 0;x;y;active=!1;options;$animations;tooltipPosition(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}hasValue(){return Ri(this.x)&&Ri(this.y)}getProps(t,e){const i=this.$animations;if(!e||!i)return this;const s={};return t.forEach(t=>{s[t]=i[t]&&i[t].active()?i[t]._to:this[t]}),s}}function ro(t,e){const i=t.options.ticks,s=function(t){const e=t.options.offset,i=t._tickSize(),s=t._length/i+(e?0:1),r=t._maxLength/i;return Math.floor(Math.min(s,r))}(t),r=Math.min(i.maxTicksLimit||s,s),a=i.major.enabled?function(t){const e=[];let i,s;for(i=0,s=t.length;i<s;i++)t[i].major&&e.push(i);return e}(e):[],o=a.length,n=a[0],l=a[o-1],c=[];if(o>r)return function(t,e,i,s){let r,a=0,o=i[0];for(s=Math.ceil(s),r=0;r<t.length;r++)r===o&&(e.push(t[r]),a++,o=i[a*s])}(e,c,a,o/r),c;const h=function(t,e,i){const s=function(t){const e=t.length;let i,s;if(e<2)return!1;for(s=t[0],i=1;i<e;++i)if(t[i]-t[i-1]!==s)return!1;return s}(t),r=e.length/i;if(!s)return Math.max(r,1);const a=function(t){const e=[],i=Math.sqrt(t);let s;for(s=1;s<i;s++)t%s===0&&(e.push(s),e.push(t/s));return i===(0|i)&&e.push(i),e.sort((t,e)=>t-e).pop(),e}(s);for(let t=0,e=a.length-1;t<e;t++){const e=a[t];if(e>r)return e}return Math.max(r,1)}(a,e,r);if(o>0){let t,i;const s=o>1?Math.round((l-n)/(o-1)):null;for(ao(e,c,h,ei(s)?0:n-s,n),t=0,i=o-1;t<i;t++)ao(e,c,h,a[t],a[t+1]);return ao(e,c,h,l,ei(s)?e.length:l+s),c}return ao(e,c,h),c}function ao(t,e,i,s,r){const a=oi(s,0),o=Math.min(oi(r,t.length),t.length);let n,l,c,h=0;for(i=Math.ceil(i),r&&(n=r-s,i=n/Math.floor(n/i)),c=a;c<0;)h++,c=Math.round(a+h*i);for(l=Math.max(a,0);l<o;l++)l===c&&(e.push(t[l]),h++,c=Math.round(a+h*i))}const oo=(t,e,i)=>"top"===e||"left"===e?t[e]+i:t[e]-i,no=(t,e)=>Math.min(e||t,t);function lo(t,e){const i=[],s=t.length/e,r=t.length;let a=0;for(;a<r;a+=s)i.push(t[Math.floor(a)]);return i}function co(t,e,i){const s=t.ticks.length,r=Math.min(e,s-1),a=t._startPixel,o=t._endPixel,n=1e-6;let l,c=t.getPixelForTick(r);if(!(i&&(l=1===s?Math.max(c-a,o-c):0===e?(t.getPixelForTick(1)-c)/2:(c-t.getPixelForTick(r-1))/2,c+=r<e?l:-l,c<a-n||c>o+n)))return c}function ho(t){return t.drawTicks?t.tickLength:0}function po(t,e){if(!t.display)return 0;const i=Gs(t.font,e),s=Ys(t.padding);return(ii(t.text)?t.text.length:1)*i.lineHeight+s.height}function uo(t,e,i){let s=es(t);return(i&&"right"!==e||!i&&"right"===e)&&(s=(t=>"left"===t?"right":"right"===t?"left":t)(s)),s}class go extends so{constructor(t){super(),this.id=t.id,this.type=t.type,this.options=void 0,this.ctx=t.ctx,this.chart=t.chart,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this._margins={left:0,right:0,top:0,bottom:0},this.maxWidth=void 0,this.maxHeight=void 0,this.paddingTop=void 0,this.paddingBottom=void 0,this.paddingLeft=void 0,this.paddingRight=void 0,this.axis=void 0,this.labelRotation=void 0,this.min=void 0,this.max=void 0,this._range=void 0,this.ticks=[],this._gridLineItems=null,this._labelItems=null,this._labelSizes=null,this._length=0,this._maxLength=0,this._longestTextCache={},this._startPixel=void 0,this._endPixel=void 0,this._reversePixels=!1,this._userMax=void 0,this._userMin=void 0,this._suggestedMax=void 0,this._suggestedMin=void 0,this._ticksLength=0,this._borderValue=0,this._cache={},this._dataLimitsCached=!1,this.$context=void 0}init(t){this.options=t.setContext(this.getContext()),this.axis=t.axis,this._userMin=this.parse(t.min),this._userMax=this.parse(t.max),this._suggestedMin=this.parse(t.suggestedMin),this._suggestedMax=this.parse(t.suggestedMax)}parse(t,e){return t}getUserBounds(){let{_userMin:t,_userMax:e,_suggestedMin:i,_suggestedMax:s}=this;return t=ai(t,Number.POSITIVE_INFINITY),e=ai(e,Number.NEGATIVE_INFINITY),i=ai(i,Number.POSITIVE_INFINITY),s=ai(s,Number.NEGATIVE_INFINITY),{min:ai(t,i),max:ai(e,s),minDefined:ri(t),maxDefined:ri(e)}}getMinMax(t){let e,{min:i,max:s,minDefined:r,maxDefined:a}=this.getUserBounds();if(r&&a)return{min:i,max:s};const o=this.getMatchingVisibleMetas();for(let n=0,l=o.length;n<l;++n)e=o[n].controller.getMinMax(this,t),r||(i=Math.min(i,e.min)),a||(s=Math.max(s,e.max));return i=a&&i>s?s:i,s=r&&i>s?i:s,{min:ai(i,ai(s,i)),max:ai(s,ai(i,s))}}getPadding(){return{left:this.paddingLeft||0,top:this.paddingTop||0,right:this.paddingRight||0,bottom:this.paddingBottom||0}}getTicks(){return this.ticks}getLabels(){const t=this.chart.data;return this.options.labels||(this.isHorizontal()?t.xLabels:t.yLabels)||t.labels||[]}getLabelItems(t=this.chart.chartArea){return this._labelItems||(this._labelItems=this._computeLabelItems(t))}beforeLayout(){this._cache={},this._dataLimitsCached=!1}beforeUpdate(){li(this.options.beforeUpdate,[this])}update(t,e,i){const{beginAtZero:s,grace:r,ticks:a}=this.options,o=a.sampleSize;this.beforeUpdate(),this.maxWidth=t,this.maxHeight=e,this._margins=i=Object.assign({left:0,right:0,top:0,bottom:0},i),this.ticks=null,this._labelSizes=null,this._gridLineItems=null,this._labelItems=null,this.beforeSetDimensions(),this.setDimensions(),this.afterSetDimensions(),this._maxLength=this.isHorizontal()?this.width+i.left+i.right:this.height+i.top+i.bottom,this._dataLimitsCached||(this.beforeDataLimits(),this.determineDataLimits(),this.afterDataLimits(),this._range=function(t,e,i){const{min:s,max:r}=t,a=ni(e,(r-s)/2),o=(t,e)=>i&&0===t?0:t+e;return{min:o(s,-Math.abs(a)),max:o(r,a)}}(this,r,s),this._dataLimitsCached=!0),this.beforeBuildTicks(),this.ticks=this.buildTicks()||[],this.afterBuildTicks();const n=o<this.ticks.length;this._convertTicksToLabels(n?lo(this.ticks,o):this.ticks),this.configure(),this.beforeCalculateLabelRotation(),this.calculateLabelRotation(),this.afterCalculateLabelRotation(),a.display&&(a.autoSkip||"auto"===a.source)&&(this.ticks=ro(this,this.ticks),this._labelSizes=null,this.afterAutoSkip()),n&&this._convertTicksToLabels(this.ticks),this.beforeFit(),this.fit(),this.afterFit(),this.afterUpdate()}configure(){let t,e,i=this.options.reverse;this.isHorizontal()?(t=this.left,e=this.right):(t=this.top,e=this.bottom,i=!i),this._startPixel=t,this._endPixel=e,this._reversePixels=i,this._length=e-t,this._alignToPixels=this.options.alignToPixels}afterUpdate(){li(this.options.afterUpdate,[this])}beforeSetDimensions(){li(this.options.beforeSetDimensions,[this])}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=0,this.right=this.width):(this.height=this.maxHeight,this.top=0,this.bottom=this.height),this.paddingLeft=0,this.paddingTop=0,this.paddingRight=0,this.paddingBottom=0}afterSetDimensions(){li(this.options.afterSetDimensions,[this])}_callHooks(t){this.chart.notifyPlugins(t,this.getContext()),li(this.options[t],[this])}beforeDataLimits(){this._callHooks("beforeDataLimits")}determineDataLimits(){}afterDataLimits(){this._callHooks("afterDataLimits")}beforeBuildTicks(){this._callHooks("beforeBuildTicks")}buildTicks(){return[]}afterBuildTicks(){this._callHooks("afterBuildTicks")}beforeTickToLabelConversion(){li(this.options.beforeTickToLabelConversion,[this])}generateTickLabels(t){const e=this.options.ticks;let i,s,r;for(i=0,s=t.length;i<s;i++)r=t[i],r.label=li(e.callback,[r.value,i,t],this)}afterTickToLabelConversion(){li(this.options.afterTickToLabelConversion,[this])}beforeCalculateLabelRotation(){li(this.options.beforeCalculateLabelRotation,[this])}calculateLabelRotation(){const t=this.options,e=t.ticks,i=no(this.ticks.length,t.ticks.maxTicksLimit),s=e.minRotation||0,r=e.maxRotation;let a,o,n,l=s;if(!this._isVisible()||!e.display||s>=r||i<=1||!this.isHorizontal())return void(this.labelRotation=s);const c=this._getLabelSizes(),h=c.widest.width,d=c.highest.height,p=Ui(this.chart.width-h,0,this.maxWidth);a=t.offset?this.maxWidth/i:p/(i-1),h+6>a&&(a=p/(i-(t.offset?.5:1)),o=this.maxHeight-ho(t.grid)-e.padding-po(t.title,this.chart.options.font),n=Math.sqrt(h*h+d*d),l=Oi(Math.min(Math.asin(Ui((c.highest.height+6)/a,-1,1)),Math.asin(Ui(o/n,-1,1))-Math.asin(Ui(d/n,-1,1)))),l=Math.max(s,Math.min(r,l))),this.labelRotation=l}afterCalculateLabelRotation(){li(this.options.afterCalculateLabelRotation,[this])}afterAutoSkip(){}beforeFit(){li(this.options.beforeFit,[this])}fit(){const t={width:0,height:0},{chart:e,options:{ticks:i,title:s,grid:r}}=this,a=this._isVisible(),o=this.isHorizontal();if(a){const a=po(s,e.options.font);if(o?(t.width=this.maxWidth,t.height=ho(r)+a):(t.height=this.maxHeight,t.width=ho(r)+a),i.display&&this.ticks.length){const{first:e,last:s,widest:r,highest:a}=this._getLabelSizes(),n=2*i.padding,l=Ii(this.labelRotation),c=Math.cos(l),h=Math.sin(l);if(o){const e=i.mirror?0:h*r.width+c*a.height;t.height=Math.min(this.maxHeight,t.height+e+n)}else{const e=i.mirror?0:c*r.width+h*a.height;t.width=Math.min(this.maxWidth,t.width+e+n)}this._calculatePadding(e,s,h,c)}}this._handleMargins(),o?(this.width=this._length=e.width-this._margins.left-this._margins.right,this.height=t.height):(this.width=t.width,this.height=this._length=e.height-this._margins.top-this._margins.bottom)}_calculatePadding(t,e,i,s){const{ticks:{align:r,padding:a},position:o}=this.options,n=0!==this.labelRotation,l="top"!==o&&"x"===this.axis;if(this.isHorizontal()){const o=this.getPixelForTick(0)-this.left,c=this.right-this.getPixelForTick(this.ticks.length-1);let h=0,d=0;n?l?(h=s*t.width,d=i*e.height):(h=i*t.height,d=s*e.width):"start"===r?d=e.width:"end"===r?h=t.width:"inner"!==r&&(h=t.width/2,d=e.width/2),this.paddingLeft=Math.max((h-o+a)*this.width/(this.width-o),0),this.paddingRight=Math.max((d-c+a)*this.width/(this.width-c),0)}else{let i=e.height/2,s=t.height/2;"start"===r?(i=0,s=t.height):"end"===r&&(i=e.height,s=0),this.paddingTop=i+a,this.paddingBottom=s+a}}_handleMargins(){this._margins&&(this._margins.left=Math.max(this.paddingLeft,this._margins.left),this._margins.top=Math.max(this.paddingTop,this._margins.top),this._margins.right=Math.max(this.paddingRight,this._margins.right),this._margins.bottom=Math.max(this.paddingBottom,this._margins.bottom))}afterFit(){li(this.options.afterFit,[this])}isHorizontal(){const{axis:t,position:e}=this.options;return"top"===e||"bottom"===e||"x"===t}isFullSize(){return this.options.fullSize}_convertTicksToLabels(t){let e,i;for(this.beforeTickToLabelConversion(),this.generateTickLabels(t),e=0,i=t.length;e<i;e++)ei(t[e].label)&&(t.splice(e,1),i--,e--);this.afterTickToLabelConversion()}_getLabelSizes(){let t=this._labelSizes;if(!t){const e=this.options.ticks.sampleSize;let i=this.ticks;e<i.length&&(i=lo(i,e)),this._labelSizes=t=this._computeLabelSizes(i,i.length,this.options.ticks.maxTicksLimit)}return t}_computeLabelSizes(t,e,i){const{ctx:s,_longestTextCache:r}=this,a=[],o=[],n=Math.floor(e/no(e,i));let l,c,h,d,p,u,g,f,_,m,y,x=0,b=0;for(l=0;l<e;l+=n){if(d=t[l].label,p=this._resolveTickFontOptions(l),s.font=u=p.string,g=r[u]=r[u]||{data:{},gc:[]},f=p.lineHeight,_=m=0,ei(d)||ii(d)){if(ii(d))for(c=0,h=d.length;c<h;++c)y=d[c],ei(y)||ii(y)||(_=ks(s,g.data,g.gc,_,y),m+=f)}else _=ks(s,g.data,g.gc,_,d),m=f;a.push(_),o.push(m),x=Math.max(_,x),b=Math.max(m,b)}!function(t,e){ci(t,t=>{const i=t.gc,s=i.length/2;let r;if(s>e){for(r=0;r<s;++r)delete t.data[i[r]];i.splice(0,s)}})}(r,e);const v=a.indexOf(x),w=o.indexOf(b),$=t=>({width:a[t]||0,height:o[t]||0});return{first:$(0),last:$(e-1),widest:$(v),highest:$(w),widths:a,heights:o}}getLabelForValue(t){return t}getPixelForValue(t,e){return NaN}getValueForPixel(t){}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getPixelForDecimal(t){this._reversePixels&&(t=1-t);const e=this._startPixel+t*this._length;return Ui(this._alignToPixels?Ss(this.chart,e,0):e,-32768,32767)}getDecimalForPixel(t){const e=(t-this._startPixel)/this._length;return this._reversePixels?1-e:e}getBasePixel(){return this.getPixelForValue(this.getBaseValue())}getBaseValue(){const{min:t,max:e}=this;return t<0&&e<0?e:t>0&&e>0?t:0}getContext(t){const e=this.ticks||[];if(t>=0&&t<e.length){const i=e[t];return i.$context||(i.$context=function(t,e,i){return Ks(t,{tick:i,index:e,type:"tick"})}(this.getContext(),t,i))}return this.$context||(this.$context=Ks(this.chart.getContext(),{scale:this,type:"scale"}))}_tickSize(){const t=this.options.ticks,e=Ii(this.labelRotation),i=Math.abs(Math.cos(e)),s=Math.abs(Math.sin(e)),r=this._getLabelSizes(),a=t.autoSkipPadding||0,o=r?r.widest.width+a:0,n=r?r.highest.height+a:0;return this.isHorizontal()?n*i>o*s?o/i:n/s:n*s<o*i?n/i:o/s}_isVisible(){const t=this.options.display;return"auto"!==t?!!t:this.getMatchingVisibleMetas().length>0}_computeGridLineItems(t){const e=this.axis,i=this.chart,s=this.options,{grid:r,position:a,border:o}=s,n=r.offset,l=this.isHorizontal(),c=this.ticks.length+(n?1:0),h=ho(r),d=[],p=o.setContext(this.getContext()),u=p.display?p.width:0,g=u/2,f=function(t){return Ss(i,t,u)};let _,m,y,x,b,v,w,$,k,M,S,C;if("top"===a)_=f(this.bottom),v=this.bottom-h,$=_-g,M=f(t.top)+g,C=t.bottom;else if("bottom"===a)_=f(this.top),M=t.top,C=f(t.bottom)-g,v=_+g,$=this.top+h;else if("left"===a)_=f(this.right),b=this.right-h,w=_-g,k=f(t.left)+g,S=t.right;else if("right"===a)_=f(this.left),k=t.left,S=f(t.right)-g,b=_+g,w=this.left+h;else if("x"===e){if("center"===a)_=f((t.top+t.bottom)/2+.5);else if(si(a)){const t=Object.keys(a)[0],e=a[t];_=f(this.chart.scales[t].getPixelForValue(e))}M=t.top,C=t.bottom,v=_+g,$=v+h}else if("y"===e){if("center"===a)_=f((t.left+t.right)/2);else if(si(a)){const t=Object.keys(a)[0],e=a[t];_=f(this.chart.scales[t].getPixelForValue(e))}b=_-g,w=b-h,k=t.left,S=t.right}const D=oi(s.ticks.maxTicksLimit,c),z=Math.max(1,Math.ceil(c/D));for(m=0;m<c;m+=z){const t=this.getContext(m),e=r.setContext(t),s=o.setContext(t),a=e.lineWidth,c=e.color,h=s.dash||[],p=s.dashOffset,u=e.tickWidth,g=e.tickColor,f=e.tickBorderDash||[],_=e.tickBorderDashOffset;y=co(this,m,n),void 0!==y&&(x=Ss(i,y,a),l?b=w=k=S=x:v=$=M=C=x,d.push({tx1:b,ty1:v,tx2:w,ty2:$,x1:k,y1:M,x2:S,y2:C,width:a,color:c,borderDash:h,borderDashOffset:p,tickWidth:u,tickColor:g,tickBorderDash:f,tickBorderDashOffset:_}))}return this._ticksLength=c,this._borderValue=_,d}_computeLabelItems(t){const e=this.axis,i=this.options,{position:s,ticks:r}=i,a=this.isHorizontal(),o=this.ticks,{align:n,crossAlign:l,padding:c,mirror:h}=r,d=ho(i.grid),p=d+c,u=h?-c:p,g=-Ii(this.labelRotation),f=[];let _,m,y,x,b,v,w,$,k,M,S,C,D="middle";if("top"===s)v=this.bottom-u,w=this._getXAxisLabelAlignment();else if("bottom"===s)v=this.top+u,w=this._getXAxisLabelAlignment();else if("left"===s){const t=this._getYAxisLabelAlignment(d);w=t.textAlign,b=t.x}else if("right"===s){const t=this._getYAxisLabelAlignment(d);w=t.textAlign,b=t.x}else if("x"===e){if("center"===s)v=(t.top+t.bottom)/2+p;else if(si(s)){const t=Object.keys(s)[0],e=s[t];v=this.chart.scales[t].getPixelForValue(e)+p}w=this._getXAxisLabelAlignment()}else if("y"===e){if("center"===s)b=(t.left+t.right)/2-p;else if(si(s)){const t=Object.keys(s)[0],e=s[t];b=this.chart.scales[t].getPixelForValue(e)}w=this._getYAxisLabelAlignment(d).textAlign}"y"===e&&("start"===n?D="top":"end"===n&&(D="bottom"));const z=this._getLabelSizes();for(_=0,m=o.length;_<m;++_){y=o[_],x=y.label;const t=r.setContext(this.getContext(_));$=this.getPixelForTick(_)+r.labelOffset,k=this._resolveTickFontOptions(_),M=k.lineHeight,S=ii(x)?x.length:1;const e=S/2,i=t.color,n=t.textStrokeColor,c=t.textStrokeWidth;let d,p=w;if(a?(b=$,"inner"===w&&(p=_===m-1?this.options.reverse?"left":"right":0===_?this.options.reverse?"right":"left":"center"),C="top"===s?"near"===l||0!==g?-S*M+M/2:"center"===l?-z.highest.height/2-e*M+M:-z.highest.height+M/2:"near"===l||0!==g?M/2:"center"===l?z.highest.height/2-e*M:z.highest.height-S*M,h&&(C*=-1),0===g||t.showLabelBackdrop||(b+=M/2*Math.sin(g))):(v=$,C=(1-S)*M/2),t.showLabelBackdrop){const e=Ys(t.backdropPadding),i=z.heights[_],s=z.widths[_];let r=C-e.top,a=0-e.left;switch(D){case"middle":r-=i/2;break;case"bottom":r-=i}switch(w){case"center":a-=s/2;break;case"right":a-=s;break;case"inner":_===m-1?a-=s:_>0&&(a-=s/2)}d={left:a,top:r,width:s+e.width,height:i+e.height,color:t.backdropColor}}f.push({label:x,font:k,textOffset:C,options:{rotation:g,color:i,strokeColor:n,strokeWidth:c,textAlign:p,textBaseline:D,translation:[b,v],backdrop:d}})}return f}_getXAxisLabelAlignment(){const{position:t,ticks:e}=this.options;if(-Ii(this.labelRotation))return"top"===t?"left":"right";let i="center";return"start"===e.align?i="left":"end"===e.align?i="right":"inner"===e.align&&(i="inner"),i}_getYAxisLabelAlignment(t){const{position:e,ticks:{crossAlign:i,mirror:s,padding:r}}=this.options,a=t+r,o=this._getLabelSizes().widest.width;let n,l;return"left"===e?s?(l=this.right+r,"near"===i?n="left":"center"===i?(n="center",l+=o/2):(n="right",l+=o)):(l=this.right-a,"near"===i?n="right":"center"===i?(n="center",l-=o/2):(n="left",l=this.left)):"right"===e?s?(l=this.left+r,"near"===i?n="right":"center"===i?(n="center",l-=o/2):(n="left",l-=o)):(l=this.left+a,"near"===i?n="left":"center"===i?(n="center",l+=o/2):(n="right",l=this.right)):n="right",{textAlign:n,x:l}}_computeLabelArea(){if(this.options.ticks.mirror)return;const t=this.chart,e=this.options.position;return"left"===e||"right"===e?{top:0,left:this.left,bottom:t.height,right:this.right}:"top"===e||"bottom"===e?{top:this.top,left:0,bottom:this.bottom,right:t.width}:void 0}drawBackground(){const{ctx:t,options:{backgroundColor:e},left:i,top:s,width:r,height:a}=this;e&&(t.save(),t.fillStyle=e,t.fillRect(i,s,r,a),t.restore())}getLineWidthForValue(t){const e=this.options.grid;if(!this._isVisible()||!e.display)return 0;const i=this.ticks.findIndex(e=>e.value===t);if(i>=0){return e.setContext(this.getContext(i)).lineWidth}return 0}drawGrid(t){const e=this.options.grid,i=this.ctx,s=this._gridLineItems||(this._gridLineItems=this._computeGridLineItems(t));let r,a;const o=(t,e,s)=>{s.width&&s.color&&(i.save(),i.lineWidth=s.width,i.strokeStyle=s.color,i.setLineDash(s.borderDash||[]),i.lineDashOffset=s.borderDashOffset,i.beginPath(),i.moveTo(t.x,t.y),i.lineTo(e.x,e.y),i.stroke(),i.restore())};if(e.display)for(r=0,a=s.length;r<a;++r){const t=s[r];e.drawOnChartArea&&o({x:t.x1,y:t.y1},{x:t.x2,y:t.y2},t),e.drawTicks&&o({x:t.tx1,y:t.ty1},{x:t.tx2,y:t.ty2},{color:t.tickColor,width:t.tickWidth,borderDash:t.tickBorderDash,borderDashOffset:t.tickBorderDashOffset})}}drawBorder(){const{chart:t,ctx:e,options:{border:i,grid:s}}=this,r=i.setContext(this.getContext()),a=i.display?r.width:0;if(!a)return;const o=s.setContext(this.getContext(0)).lineWidth,n=this._borderValue;let l,c,h,d;this.isHorizontal()?(l=Ss(t,this.left,a)-a/2,c=Ss(t,this.right,o)+o/2,h=d=n):(h=Ss(t,this.top,a)-a/2,d=Ss(t,this.bottom,o)+o/2,l=c=n),e.save(),e.lineWidth=r.width,e.strokeStyle=r.color,e.beginPath(),e.moveTo(l,h),e.lineTo(c,d),e.stroke(),e.restore()}drawLabels(t){if(!this.options.ticks.display)return;const e=this.ctx,i=this._computeLabelArea();i&&Ps(e,i);const s=this.getLabelItems(t);for(const t of s){const i=t.options,s=t.font;Is(e,t.label,0,t.textOffset,s,i)}i&&Ts(e)}drawTitle(){const{ctx:t,options:{position:e,title:i,reverse:s}}=this;if(!i.display)return;const r=Gs(i.font),a=Ys(i.padding),o=i.align;let n=r.lineHeight/2;"bottom"===e||"center"===e||si(e)?(n+=a.bottom,ii(i.text)&&(n+=r.lineHeight*(i.text.length-1))):n+=a.top;const{titleX:l,titleY:c,maxWidth:h,rotation:d}=function(t,e,i,s){const{top:r,left:a,bottom:o,right:n,chart:l}=t,{chartArea:c,scales:h}=l;let d,p,u,g=0;const f=o-r,_=n-a;if(t.isHorizontal()){if(p=is(s,a,n),si(i)){const t=Object.keys(i)[0],s=i[t];u=h[t].getPixelForValue(s)+f-e}else u="center"===i?(c.bottom+c.top)/2+f-e:oo(t,i,e);d=n-a}else{if(si(i)){const t=Object.keys(i)[0],s=i[t];p=h[t].getPixelForValue(s)-_+e}else p="center"===i?(c.left+c.right)/2-_+e:oo(t,i,e);u=is(s,o,r),g="left"===i?-Di:Di}return{titleX:p,titleY:u,maxWidth:d,rotation:g}}(this,n,e,o);Is(t,i.text,0,0,r,{color:i.color,maxWidth:h,rotation:d,textAlign:uo(o,e,s),textBaseline:"middle",translation:[l,c]})}draw(t){this._isVisible()&&(this.drawBackground(),this.drawGrid(t),this.drawBorder(),this.drawTitle(),this.drawLabels(t))}_layers(){const t=this.options,e=t.ticks&&t.ticks.z||0,i=oi(t.grid&&t.grid.z,-1),s=oi(t.border&&t.border.z,0);return this._isVisible()&&this.draw===go.prototype.draw?[{z:i,draw:t=>{this.drawBackground(),this.drawGrid(t),this.drawTitle()}},{z:s,draw:()=>{this.drawBorder()}},{z:e,draw:t=>{this.drawLabels(t)}}]:[{z:e,draw:t=>{this.draw(t)}}]}getMatchingVisibleMetas(t){const e=this.chart.getSortedVisibleDatasetMetas(),i=this.axis+"AxisID",s=[];let r,a;for(r=0,a=e.length;r<a;++r){const a=e[r];a[i]!==this.id||t&&a.type!==t||s.push(a)}return s}_resolveTickFontOptions(t){return Gs(this.options.ticks.setContext(this.getContext(t)).font)}_maxDigits(){const t=this._resolveTickFontOptions(0).lineHeight;return(this.isHorizontal()?this.width:this.height)/t}}class fo{constructor(t,e,i){this.type=t,this.scope=e,this.override=i,this.items=Object.create(null)}isForType(t){return Object.prototype.isPrototypeOf.call(this.type.prototype,t.prototype)}register(t){const e=Object.getPrototypeOf(t);let i;(function(t){return"id"in t&&"defaults"in t})(e)&&(i=this.register(e));const s=this.items,r=t.id,a=this.scope+"."+r;if(!r)throw new Error("class does not have id: "+t);return r in s||(s[r]=t,function(t,e,i){const s=gi(Object.create(null),[i?$s.get(i):{},$s.get(e),t.defaults]);$s.set(e,s),t.defaultRoutes&&function(t,e){Object.keys(e).forEach(i=>{const s=i.split("."),r=s.pop(),a=[t].concat(s).join("."),o=e[i].split("."),n=o.pop(),l=o.join(".");$s.route(a,r,l,n)})}(e,t.defaultRoutes);t.descriptors&&$s.describe(e,t.descriptors)}(t,a,i),this.override&&$s.override(t.id,t.overrides)),a}get(t){return this.items[t]}unregister(t){const e=this.items,i=t.id,s=this.scope;i in e&&delete e[i],s&&i in $s[s]&&(delete $s[s][i],this.override&&delete ys[i])}}class _o{constructor(){this.controllers=new fo(aa,"datasets",!0),this.elements=new fo(so,"elements"),this.plugins=new fo(Object,"plugins"),this.scales=new fo(go,"scales"),this._typedRegistries=[this.controllers,this.scales,this.elements]}add(...t){this._each("register",t)}remove(...t){this._each("unregister",t)}addControllers(...t){this._each("register",t,this.controllers)}addElements(...t){this._each("register",t,this.elements)}addPlugins(...t){this._each("register",t,this.plugins)}addScales(...t){this._each("register",t,this.scales)}getController(t){return this._get(t,this.controllers,"controller")}getElement(t){return this._get(t,this.elements,"element")}getPlugin(t){return this._get(t,this.plugins,"plugin")}getScale(t){return this._get(t,this.scales,"scale")}removeControllers(...t){this._each("unregister",t,this.controllers)}removeElements(...t){this._each("unregister",t,this.elements)}removePlugins(...t){this._each("unregister",t,this.plugins)}removeScales(...t){this._each("unregister",t,this.scales)}_each(t,e,i){[...e].forEach(e=>{const s=i||this._getRegistryForType(e);i||s.isForType(e)||s===this.plugins&&e.id?this._exec(t,s,e):ci(e,e=>{const s=i||this._getRegistryForType(e);this._exec(t,s,e)})})}_exec(t,e,i){const s=xi(t);li(i["before"+s],[],i),e[t](i),li(i["after"+s],[],i)}_getRegistryForType(t){for(let e=0;e<this._typedRegistries.length;e++){const i=this._typedRegistries[e];if(i.isForType(t))return i}return this.plugins}_get(t,e,i){const s=e.get(t);if(void 0===s)throw new Error('"'+t+'" is not a registered '+i+".");return s}}var mo=new _o;class yo{constructor(){this._init=[]}notify(t,e,i,s){"beforeInit"===e&&(this._init=this._createDescriptors(t,!0),this._notify(this._init,t,"install"));const r=s?this._descriptors(t).filter(s):this._descriptors(t),a=this._notify(r,t,e,i);return"afterDestroy"===e&&(this._notify(r,t,"stop"),this._notify(this._init,t,"uninstall")),a}_notify(t,e,i,s){s=s||{};for(const r of t){const t=r.plugin;if(!1===li(t[i],[e,s,r.options],t)&&s.cancelable)return!1}return!0}invalidate(){ei(this._cache)||(this._oldCache=this._cache,this._cache=void 0)}_descriptors(t){if(this._cache)return this._cache;const e=this._cache=this._createDescriptors(t);return this._notifyStateChanges(t),e}_createDescriptors(t,e){const i=t&&t.config,s=oi(i.options&&i.options.plugins,{}),r=function(t){const e={},i=[],s=Object.keys(mo.plugins.items);for(let t=0;t<s.length;t++)i.push(mo.getPlugin(s[t]));const r=t.plugins||[];for(let t=0;t<r.length;t++){const s=r[t];-1===i.indexOf(s)&&(i.push(s),e[s.id]=!0)}return{plugins:i,localIds:e}}(i);return!1!==s||e?function(t,{plugins:e,localIds:i},s,r){const a=[],o=t.getContext();for(const n of e){const e=n.id,l=xo(s[e],r);null!==l&&a.push({plugin:n,options:bo(t.config,{plugin:n,local:i[e]},l,o)})}return a}(t,r,s,e):[]}_notifyStateChanges(t){const e=this._oldCache||[],i=this._cache,s=(t,e)=>t.filter(t=>!e.some(e=>t.plugin.id===e.plugin.id));this._notify(s(e,i),t,"stop"),this._notify(s(i,e),t,"start")}}function xo(t,e){return e||!1!==t?!0===t?{}:t:null}function bo(t,{plugin:e,local:i},s,r){const a=t.pluginScopeKeys(e),o=t.getOptionScopes(s,a);return i&&e.defaults&&o.push(e.defaults),t.createResolver(o,r,[""],{scriptable:!1,indexable:!1,allKeys:!0})}function vo(t,e){const i=$s.datasets[t]||{};return((e.datasets||{})[t]||{}).indexAxis||e.indexAxis||i.indexAxis||"x"}function wo(t){if("x"===t||"y"===t||"r"===t)return t}function $o(t){return"top"===t||"bottom"===t?"x":"left"===t||"right"===t?"y":void 0}function ko(t,...e){if(wo(t))return t;for(const i of e){const e=i.axis||$o(i.position)||t.length>1&&wo(t[0].toLowerCase());if(e)return e}throw new Error(`Cannot determine type of '${t}' axis. Please provide 'axis' or 'position' option.`)}function Mo(t,e,i){if(i[e+"AxisID"]===t)return{axis:e}}function So(t,e){const i=ys[t.type]||{scales:{}},s=e.scales||{},r=vo(t.type,e),a=Object.create(null);return Object.keys(s).forEach(e=>{const o=s[e];if(!si(o))return console.error(`Invalid scale configuration for scale: ${e}`);if(o._proxy)return console.warn(`Ignoring resolver passed as options for scale: ${e}`);const n=ko(e,o,function(t,e){if(e.data&&e.data.datasets){const i=e.data.datasets.filter(e=>e.xAxisID===t||e.yAxisID===t);if(i.length)return Mo(t,"x",i[0])||Mo(t,"y",i[0])}return{}}(e,t),$s.scales[o.type]),l=function(t,e){return t===e?"_index_":"_value_"}(n,r),c=i.scales||{};a[e]=fi(Object.create(null),[{axis:n},o,c[n],c[l]])}),t.data.datasets.forEach(i=>{const r=i.type||t.type,o=i.indexAxis||vo(r,e),n=(ys[r]||{}).scales||{};Object.keys(n).forEach(t=>{const e=function(t,e){let i=t;return"_index_"===t?i=e:"_value_"===t&&(i="x"===e?"y":"x"),i}(t,o),r=i[e+"AxisID"]||e;a[r]=a[r]||Object.create(null),fi(a[r],[{axis:e},s[r],n[t]])})}),Object.keys(a).forEach(t=>{const e=a[t];fi(e,[$s.scales[e.type],$s.scale])}),a}function Co(t){const e=t.options||(t.options={});e.plugins=oi(e.plugins,{}),e.scales=So(t,e)}function Do(t){return(t=t||{}).datasets=t.datasets||[],t.labels=t.labels||[],t}const zo=new Map,Eo=new Set;function Po(t,e){let i=zo.get(t);return i||(i=e(),zo.set(t,i),Eo.add(i)),i}const To=(t,e,i)=>{const s=yi(e,i);void 0!==s&&t.add(s)};class Fo{constructor(t){this._config=function(t){return(t=t||{}).data=Do(t.data),Co(t),t}(t),this._scopeCache=new Map,this._resolverCache=new Map}get platform(){return this._config.platform}get type(){return this._config.type}set type(t){this._config.type=t}get data(){return this._config.data}set data(t){this._config.data=Do(t)}get options(){return this._config.options}set options(t){this._config.options=t}get plugins(){return this._config.plugins}update(){const t=this._config;this.clearCache(),Co(t)}clearCache(){this._scopeCache.clear(),this._resolverCache.clear()}datasetScopeKeys(t){return Po(t,()=>[[`datasets.${t}`,""]])}datasetAnimationScopeKeys(t,e){return Po(`${t}.transition.${e}`,()=>[[`datasets.${t}.transitions.${e}`,`transitions.${e}`],[`datasets.${t}`,""]])}datasetElementScopeKeys(t,e){return Po(`${t}-${e}`,()=>[[`datasets.${t}.elements.${e}`,`datasets.${t}`,`elements.${e}`,""]])}pluginScopeKeys(t){const e=t.id;return Po(`${this.type}-plugin-${e}`,()=>[[`plugins.${e}`,...t.additionalOptionScopes||[]]])}_cachedScopes(t,e){const i=this._scopeCache;let s=i.get(t);return s&&!e||(s=new Map,i.set(t,s)),s}getOptionScopes(t,e,i){const{options:s,type:r}=this,a=this._cachedScopes(t,i),o=a.get(e);if(o)return o;const n=new Set;e.forEach(e=>{t&&(n.add(t),e.forEach(e=>To(n,t,e))),e.forEach(t=>To(n,s,t)),e.forEach(t=>To(n,ys[r]||{},t)),e.forEach(t=>To(n,$s,t)),e.forEach(t=>To(n,xs,t))});const l=Array.from(n);return 0===l.length&&l.push(Object.create(null)),Eo.has(e)&&a.set(e,l),l}chartOptionScopes(){const{options:t,type:e}=this;return[t,ys[e]||{},$s.datasets[e]||{},{type:e},$s,xs]}resolveNamedOptions(t,e,i,s=[""]){const r={$shared:!0},{resolver:a,subPrefixes:o}=Ao(this._resolverCache,t,s);let n=a;if(function(t,e){const{isScriptable:i,isIndexable:s}=Qs(t);for(const r of e){const e=i(r),a=s(r),o=(a||e)&&t[r];if(e&&(vi(o)||Ro(o))||a&&ii(o))return!0}return!1}(a,e)){r.$shared=!1;n=Zs(a,i=vi(i)?i():i,this.createResolver(t,i,o))}for(const t of e)r[t]=n[t];return r}createResolver(t,e,i=[""],s){const{resolver:r}=Ao(this._resolverCache,t,i);return si(e)?Zs(r,e,void 0,s):r}}function Ao(t,e,i){let s=t.get(e);s||(s=new Map,t.set(e,s));const r=i.join();let a=s.get(r);if(!a){a={resolver:Xs(e,i),subPrefixes:i.filter(t=>!t.toLowerCase().includes("hover"))},s.set(r,a)}return a}const Ro=t=>si(t)&&Object.getOwnPropertyNames(t).some(e=>vi(t[e]));const Lo=["top","bottom","left","right","chartArea"];function Io(t,e){return"top"===t||"bottom"===t||-1===Lo.indexOf(t)&&"x"===e}function Oo(t,e){return function(i,s){return i[t]===s[t]?i[e]-s[e]:i[t]-s[t]}}function No(t){const e=t.chart,i=e.options.animation;e.notifyPlugins("afterRender"),li(i&&i.onComplete,[t],e)}function Ho(t){const e=t.chart,i=e.options.animation;li(i&&i.onProgress,[t],e)}function Bo(t){return mr()&&"string"==typeof t?t=document.getElementById(t):t&&t.length&&(t=t[0]),t&&t.canvas&&(t=t.canvas),t}const Wo={},jo=t=>{const e=Bo(t);return Object.values(Wo).filter(t=>t.canvas===e).pop()};function Vo(t,e,i){const s=Object.keys(t);for(const r of s){const s=+r;if(s>=e){const a=t[r];delete t[r],(i>0||s>e)&&(t[s+i]=a)}}}function Uo(t,e,i){return t.options.clip?t[i]:e[i]}class Yo{static defaults=$s;static instances=Wo;static overrides=ys;static registry=mo;static version="4.4.7";static getChart=jo;static register(...t){mo.add(...t),Go()}static unregister(...t){mo.remove(...t),Go()}constructor(t,e){const i=this.config=new Fo(e),s=Bo(t),r=jo(s);if(r)throw new Error("Canvas is already in use. Chart with ID '"+r.id+"' must be destroyed before the canvas with ID '"+r.canvas.id+"' can be reused.");const a=i.createResolver(i.chartOptionScopes(),this.getContext());this.platform=new(i.platform||function(t){return!mr()||"undefined"!=typeof OffscreenCanvas&&t instanceof OffscreenCanvas?Ba:io}(s)),this.platform.updateConfig(i);const o=this.platform.acquireContext(s,a.aspectRatio),n=o&&o.canvas,l=n&&n.height,c=n&&n.width;this.id=ti(),this.ctx=o,this.canvas=n,this.width=c,this.height=l,this._options=a,this._aspectRatio=this.aspectRatio,this._layers=[],this._metasets=[],this._stacks=void 0,this.boxes=[],this.currentDevicePixelRatio=void 0,this.chartArea=void 0,this._active=[],this._lastEvent=void 0,this._listeners={},this._responsiveListeners=void 0,this._sortedMetasets=[],this.scales={},this._plugins=new yo,this.$proxies={},this._hiddenIndices={},this.attached=!1,this._animationsDisabled=void 0,this.$context=void 0,this._doResize=function(t,e){let i;return function(...s){return e?(clearTimeout(i),i=setTimeout(t,e,s)):t.apply(this,s),e}}(t=>this.update(t),a.resizeDelay||0),this._dataChanges=[],Wo[this.id]=this,o&&n?(jr.listen(this,"complete",No),jr.listen(this,"progress",Ho),this._initialize(),this.attached&&this.update()):console.error("Failed to create chart: can't acquire context from the given item")}get aspectRatio(){const{options:{aspectRatio:t,maintainAspectRatio:e},width:i,height:s,_aspectRatio:r}=this;return ei(t)?e&&r?r:s?i/s:null:t}get data(){return this.config.data}set data(t){this.config.data=t}get options(){return this._options}set options(t){this.config.options=t}get registry(){return mo}_initialize(){return this.notifyPlugins("beforeInit"),this.options.responsive?this.resize():Sr(this,this.options.devicePixelRatio),this.bindEvents(),this.notifyPlugins("afterInit"),this}clear(){return Cs(this.canvas,this.ctx),this}stop(){return jr.stop(this),this}resize(t,e){jr.running(this)?this._resizeBeforeDraw={width:t,height:e}:this._resize(t,e)}_resize(t,e){const i=this.options,s=this.canvas,r=i.maintainAspectRatio&&this.aspectRatio,a=this.platform.getMaximumSize(s,t,e,r),o=i.devicePixelRatio||this.platform.getDevicePixelRatio(),n=this.width?"resize":"attach";this.width=a.width,this.height=a.height,this._aspectRatio=this.aspectRatio,Sr(this,o,!0)&&(this.notifyPlugins("resize",{size:a}),li(i.onResize,[this,a],this),this.attached&&this._doResize(n)&&this.render())}ensureScalesHaveIDs(){ci(this.options.scales||{},(t,e)=>{t.id=e})}buildOrUpdateScales(){const t=this.options,e=t.scales,i=this.scales,s=Object.keys(i).reduce((t,e)=>(t[e]=!1,t),{});let r=[];e&&(r=r.concat(Object.keys(e).map(t=>{const i=e[t],s=ko(t,i),r="r"===s,a="x"===s;return{options:i,dposition:r?"chartArea":a?"bottom":"left",dtype:r?"radialLinear":a?"category":"linear"}}))),ci(r,e=>{const r=e.options,a=r.id,o=ko(a,r),n=oi(r.type,e.dtype);void 0!==r.position&&Io(r.position,o)===Io(e.dposition)||(r.position=e.dposition),s[a]=!0;let l=null;if(a in i&&i[a].type===n)l=i[a];else{l=new(mo.getScale(n))({id:a,type:n,ctx:this.ctx,chart:this}),i[l.id]=l}l.init(r,t)}),ci(s,(t,e)=>{t||delete i[e]}),ci(i,t=>{Na.configure(this,t,t.options),Na.addBox(this,t)})}_updateMetasets(){const t=this._metasets,e=this.data.datasets.length,i=t.length;if(t.sort((t,e)=>t.index-e.index),i>e){for(let t=e;t<i;++t)this._destroyDatasetMeta(t);t.splice(e,i-e)}this._sortedMetasets=t.slice(0).sort(Oo("order","index"))}_removeUnreferencedMetasets(){const{_metasets:t,data:{datasets:e}}=this;t.length>e.length&&delete this._stacks,t.forEach((t,i)=>{0===e.filter(e=>e===t._dataset).length&&this._destroyDatasetMeta(i)})}buildOrUpdateControllers(){const t=[],e=this.data.datasets;let i,s;for(this._removeUnreferencedMetasets(),i=0,s=e.length;i<s;i++){const s=e[i];let r=this.getDatasetMeta(i);const a=s.type||this.config.type;if(r.type&&r.type!==a&&(this._destroyDatasetMeta(i),r=this.getDatasetMeta(i)),r.type=a,r.indexAxis=s.indexAxis||vo(a,this.options),r.order=s.order||0,r.index=i,r.label=""+s.label,r.visible=this.isDatasetVisible(i),r.controller)r.controller.updateIndex(i),r.controller.linkScales();else{const e=mo.getController(a),{datasetElementType:s,dataElementType:o}=$s.datasets[a];Object.assign(e,{dataElementType:mo.getElement(o),datasetElementType:s&&mo.getElement(s)}),r.controller=new e(this,i),t.push(r.controller)}}return this._updateMetasets(),t}_resetElements(){ci(this.data.datasets,(t,e)=>{this.getDatasetMeta(e).controller.reset()},this)}reset(){this._resetElements(),this.notifyPlugins("reset")}update(t){const e=this.config;e.update();const i=this._options=e.createResolver(e.chartOptionScopes(),this.getContext()),s=this._animationsDisabled=!i.animation;if(this._updateScales(),this._checkEventBindings(),this._updateHiddenIndices(),this._plugins.invalidate(),!1===this.notifyPlugins("beforeUpdate",{mode:t,cancelable:!0}))return;const r=this.buildOrUpdateControllers();this.notifyPlugins("beforeElementsUpdate");let a=0;for(let t=0,e=this.data.datasets.length;t<e;t++){const{controller:e}=this.getDatasetMeta(t),i=!s&&-1===r.indexOf(e);e.buildOrUpdateElements(i),a=Math.max(+e.getMaxOverflow(),a)}a=this._minPadding=i.layout.autoPadding?a:0,this._updateLayout(a),s||ci(r,t=>{t.reset()}),this._updateDatasets(t),this.notifyPlugins("afterUpdate",{mode:t}),this._layers.sort(Oo("z","_idx"));const{_active:o,_lastEvent:n}=this;n?this._eventHandler(n,!0):o.length&&this._updateHoverStyles(o,o,!0),this.render()}_updateScales(){ci(this.scales,t=>{Na.removeBox(this,t)}),this.ensureScalesHaveIDs(),this.buildOrUpdateScales()}_checkEventBindings(){const t=this.options,e=new Set(Object.keys(this._listeners)),i=new Set(t.events);wi(e,i)&&!!this._responsiveListeners===t.responsive||(this.unbindEvents(),this.bindEvents())}_updateHiddenIndices(){const{_hiddenIndices:t}=this,e=this._getUniformDataChanges()||[];for(const{method:i,start:s,count:r}of e){Vo(t,s,"_removeElements"===i?-r:r)}}_getUniformDataChanges(){const t=this._dataChanges;if(!t||!t.length)return;this._dataChanges=[];const e=this.data.datasets.length,i=e=>new Set(t.filter(t=>t[0]===e).map((t,e)=>e+","+t.splice(1).join(","))),s=i(0);for(let t=1;t<e;t++)if(!wi(s,i(t)))return;return Array.from(s).map(t=>t.split(",")).map(t=>({method:t[1],start:+t[2],count:+t[3]}))}_updateLayout(t){if(!1===this.notifyPlugins("beforeLayout",{cancelable:!0}))return;Na.update(this,this.width,this.height,t);const e=this.chartArea,i=e.width<=0||e.height<=0;this._layers=[],ci(this.boxes,t=>{i&&"chartArea"===t.position||(t.configure&&t.configure(),this._layers.push(...t._layers()))},this),this._layers.forEach((t,e)=>{t._idx=e}),this.notifyPlugins("afterLayout")}_updateDatasets(t){if(!1!==this.notifyPlugins("beforeDatasetsUpdate",{mode:t,cancelable:!0})){for(let t=0,e=this.data.datasets.length;t<e;++t)this.getDatasetMeta(t).controller.configure();for(let e=0,i=this.data.datasets.length;e<i;++e)this._updateDataset(e,vi(t)?t({datasetIndex:e}):t);this.notifyPlugins("afterDatasetsUpdate",{mode:t})}}_updateDataset(t,e){const i=this.getDatasetMeta(t),s={meta:i,index:t,mode:e,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetUpdate",s)&&(i.controller._update(e),s.cancelable=!1,this.notifyPlugins("afterDatasetUpdate",s))}render(){!1!==this.notifyPlugins("beforeRender",{cancelable:!0})&&(jr.has(this)?this.attached&&!jr.running(this)&&jr.start(this):(this.draw(),No({chart:this})))}draw(){let t;if(this._resizeBeforeDraw){const{width:t,height:e}=this._resizeBeforeDraw;this._resizeBeforeDraw=null,this._resize(t,e)}if(this.clear(),this.width<=0||this.height<=0)return;if(!1===this.notifyPlugins("beforeDraw",{cancelable:!0}))return;const e=this._layers;for(t=0;t<e.length&&e[t].z<=0;++t)e[t].draw(this.chartArea);for(this._drawDatasets();t<e.length;++t)e[t].draw(this.chartArea);this.notifyPlugins("afterDraw")}_getSortedDatasetMetas(t){const e=this._sortedMetasets,i=[];let s,r;for(s=0,r=e.length;s<r;++s){const r=e[s];t&&!r.visible||i.push(r)}return i}getSortedVisibleDatasetMetas(){return this._getSortedDatasetMetas(!0)}_drawDatasets(){if(!1===this.notifyPlugins("beforeDatasetsDraw",{cancelable:!0}))return;const t=this.getSortedVisibleDatasetMetas();for(let e=t.length-1;e>=0;--e)this._drawDataset(t[e]);this.notifyPlugins("afterDatasetsDraw")}_drawDataset(t){const e=this.ctx,i=t._clip,s=!i.disabled,r=function(t,e){const{xScale:i,yScale:s}=t;return i&&s?{left:Uo(i,e,"left"),right:Uo(i,e,"right"),top:Uo(s,e,"top"),bottom:Uo(s,e,"bottom")}:e}(t,this.chartArea),a={meta:t,index:t.index,cancelable:!0};!1!==this.notifyPlugins("beforeDatasetDraw",a)&&(s&&Ps(e,{left:!1===i.left?0:r.left-i.left,right:!1===i.right?this.width:r.right+i.right,top:!1===i.top?0:r.top-i.top,bottom:!1===i.bottom?this.height:r.bottom+i.bottom}),t.controller.draw(),s&&Ts(e),a.cancelable=!1,this.notifyPlugins("afterDatasetDraw",a))}isPointInArea(t){return Es(t,this.chartArea,this._minPadding)}getElementsAtEventForMode(t,e,i,s){const r=Sa.modes[e];return"function"==typeof r?r(this,t,i,s):[]}getDatasetMeta(t){const e=this.data.datasets[t],i=this._metasets;let s=i.filter(t=>t&&t._dataset===e).pop();return s||(s={type:null,data:[],dataset:null,controller:null,hidden:null,xAxisID:null,yAxisID:null,order:e&&e.order||0,index:t,_dataset:e,_parsed:[],_sorted:!1},i.push(s)),s}getContext(){return this.$context||(this.$context=Ks(null,{chart:this,type:"chart"}))}getVisibleDatasetCount(){return this.getSortedVisibleDatasetMetas().length}isDatasetVisible(t){const e=this.data.datasets[t];if(!e)return!1;const i=this.getDatasetMeta(t);return"boolean"==typeof i.hidden?!i.hidden:!e.hidden}setDatasetVisibility(t,e){this.getDatasetMeta(t).hidden=!e}toggleDataVisibility(t){this._hiddenIndices[t]=!this._hiddenIndices[t]}getDataVisibility(t){return!this._hiddenIndices[t]}_updateVisibility(t,e,i){const s=i?"show":"hide",r=this.getDatasetMeta(t),a=r.controller._resolveAnimations(void 0,s);bi(e)?(r.data[e].hidden=!i,this.update()):(this.setDatasetVisibility(t,i),a.update(r,{visible:i}),this.update(e=>e.datasetIndex===t?s:void 0))}hide(t,e){this._updateVisibility(t,e,!1)}show(t,e){this._updateVisibility(t,e,!0)}_destroyDatasetMeta(t){const e=this._metasets[t];e&&e.controller&&e.controller._destroy(),delete this._metasets[t]}_stop(){let t,e;for(this.stop(),jr.remove(this),t=0,e=this.data.datasets.length;t<e;++t)this._destroyDatasetMeta(t)}destroy(){this.notifyPlugins("beforeDestroy");const{canvas:t,ctx:e}=this;this._stop(),this.config.clearCache(),t&&(this.unbindEvents(),Cs(t,e),this.platform.releaseContext(e),this.canvas=null,this.ctx=null),delete Wo[this.id],this.notifyPlugins("afterDestroy")}toBase64Image(...t){return this.canvas.toDataURL(...t)}bindEvents(){this.bindUserEvents(),this.options.responsive?this.bindResponsiveEvents():this.attached=!0}bindUserEvents(){const t=this._listeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(t,e,i)=>{t.offsetX=e,t.offsetY=i,this._eventHandler(t)};ci(this.options.events,t=>i(t,s))}bindResponsiveEvents(){this._responsiveListeners||(this._responsiveListeners={});const t=this._responsiveListeners,e=this.platform,i=(i,s)=>{e.addEventListener(this,i,s),t[i]=s},s=(i,s)=>{t[i]&&(e.removeEventListener(this,i,s),delete t[i])},r=(t,e)=>{this.canvas&&this.resize(t,e)};let a;const o=()=>{s("attach",o),this.attached=!0,this.resize(),i("resize",r),i("detach",a)};a=()=>{this.attached=!1,s("resize",r),this._stop(),this._resize(0,0),i("attach",o)},e.isAttached(this.canvas)?o():a()}unbindEvents(){ci(this._listeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._listeners={},ci(this._responsiveListeners,(t,e)=>{this.platform.removeEventListener(this,e,t)}),this._responsiveListeners=void 0}updateHoverStyle(t,e,i){const s=i?"set":"remove";let r,a,o,n;for("dataset"===e&&(r=this.getDatasetMeta(t[0].datasetIndex),r.controller["_"+s+"DatasetHoverStyle"]()),o=0,n=t.length;o<n;++o){a=t[o];const e=a&&this.getDatasetMeta(a.datasetIndex).controller;e&&e[s+"HoverStyle"](a.element,a.datasetIndex,a.index)}}getActiveElements(){return this._active||[]}setActiveElements(t){const e=this._active||[],i=t.map(({datasetIndex:t,index:e})=>{const i=this.getDatasetMeta(t);if(!i)throw new Error("No dataset found at index "+t);return{datasetIndex:t,element:i.data[e],index:e}});!hi(i,e)&&(this._active=i,this._lastEvent=null,this._updateHoverStyles(i,e))}notifyPlugins(t,e,i){return this._plugins.notify(this,t,e,i)}isPluginEnabled(t){return 1===this._plugins._cache.filter(e=>e.plugin.id===t).length}_updateHoverStyles(t,e,i){const s=this.options.hover,r=(t,e)=>t.filter(t=>!e.some(e=>t.datasetIndex===e.datasetIndex&&t.index===e.index)),a=r(e,t),o=i?t:r(t,e);a.length&&this.updateHoverStyle(a,s.mode,!1),o.length&&s.mode&&this.updateHoverStyle(o,s.mode,!0)}_eventHandler(t,e){const i={event:t,replay:e,cancelable:!0,inChartArea:this.isPointInArea(t)},s=e=>(e.options.events||this.options.events).includes(t.native.type);if(!1===this.notifyPlugins("beforeEvent",i,s))return;const r=this._handleEvent(t,e,i.inChartArea);return i.cancelable=!1,this.notifyPlugins("afterEvent",i,s),(r||i.changed)&&this.render(),this}_handleEvent(t,e,i){const{_active:s=[],options:r}=this,a=e,o=this._getActiveElements(t,s,i,a),n=function(t){return"mouseup"===t.type||"click"===t.type||"contextmenu"===t.type}(t),l=function(t,e,i,s){return i&&"mouseout"!==t.type?s?e:t:null}(t,this._lastEvent,i,n);i&&(this._lastEvent=null,li(r.onHover,[t,o,this],this),n&&li(r.onClick,[t,o,this],this));const c=!hi(o,s);return(c||e)&&(this._active=o,this._updateHoverStyles(o,s,e)),this._lastEvent=l,c}_getActiveElements(t,e,i,s){if("mouseout"===t.type)return[];if(!i)return e;const r=this.options.hover;return this.getElementsAtEventForMode(t,r.mode,r,s)}}function Go(){return ci(Yo.instances,t=>t._plugins.invalidate())}function qo(t,e,i,s){const r=js(t.options.borderRadius,["outerStart","outerEnd","innerStart","innerEnd"]);const a=(i-e)/2,o=Math.min(a,s*e/2),n=t=>{const e=(i-Math.min(a,t))*s/2;return Ui(t,0,Math.min(a,e))};return{outerStart:n(r.outerStart),outerEnd:n(r.outerEnd),innerStart:Ui(r.innerStart,0,o),innerEnd:Ui(r.innerEnd,0,o)}}function Ko(t,e,i,s){return{x:i+t*Math.cos(e),y:s+t*Math.sin(e)}}function Xo(t,e,i,s,r,a){const{x:o,y:n,startAngle:l,pixelMargin:c,innerRadius:h}=e,d=Math.max(e.outerRadius+s+i-c,0),p=h>0?h+s+i+c:0;let u=0;const g=r-l;if(s){const t=((h>0?h-s:0)+(d>0?d-s:0))/2;u=(g-(0!==t?g*t/(t+s):g))/2}const f=(g-Math.max(.001,g*d-i/$i)/d)/2,_=l+f+u,m=r-f-u,{outerStart:y,outerEnd:x,innerStart:b,innerEnd:v}=qo(e,p,d,m-_),w=d-y,$=d-x,k=_+y/w,M=m-x/$,S=p+b,C=p+v,D=_+b/S,z=m-v/C;if(t.beginPath(),a){const e=(k+M)/2;if(t.arc(o,n,d,k,e),t.arc(o,n,d,e,M),x>0){const e=Ko($,M,o,n);t.arc(e.x,e.y,x,M,m+Di)}const i=Ko(C,m,o,n);if(t.lineTo(i.x,i.y),v>0){const e=Ko(C,z,o,n);t.arc(e.x,e.y,v,m+Di,z+Math.PI)}const s=(m-v/p+(_+b/p))/2;if(t.arc(o,n,p,m-v/p,s,!0),t.arc(o,n,p,s,_+b/p,!0),b>0){const e=Ko(S,D,o,n);t.arc(e.x,e.y,b,D+Math.PI,_-Di)}const r=Ko(w,_,o,n);if(t.lineTo(r.x,r.y),y>0){const e=Ko(w,k,o,n);t.arc(e.x,e.y,y,_-Di,k)}}else{t.moveTo(o,n);const e=Math.cos(k)*d+o,i=Math.sin(k)*d+n;t.lineTo(e,i);const s=Math.cos(M)*d+o,r=Math.sin(M)*d+n;t.lineTo(s,r)}t.closePath()}function Zo(t,e,i,s,r){const{fullCircles:a,startAngle:o,circumference:n,options:l}=e,{borderWidth:c,borderJoinStyle:h,borderDash:d,borderDashOffset:p}=l,u="inner"===l.borderAlign;if(!c)return;t.setLineDash(d||[]),t.lineDashOffset=p,u?(t.lineWidth=2*c,t.lineJoin=h||"round"):(t.lineWidth=c,t.lineJoin=h||"bevel");let g=e.endAngle;if(a){Xo(t,e,i,s,g,r);for(let e=0;e<a;++e)t.stroke();isNaN(n)||(g=o+(n%ki||ki))}u&&function(t,e,i){const{startAngle:s,pixelMargin:r,x:a,y:o,outerRadius:n,innerRadius:l}=e;let c=r/n;t.beginPath(),t.arc(a,o,n,s-c,i+c),l>r?(c=r/l,t.arc(a,o,l,i+c,s-c,!0)):t.arc(a,o,r,i+Di,s-Di),t.closePath(),t.clip()}(t,e,g),a||(Xo(t,e,i,s,g,r),t.stroke())}function Qo(t,e,i=e){t.lineCap=oi(i.borderCapStyle,e.borderCapStyle),t.setLineDash(oi(i.borderDash,e.borderDash)),t.lineDashOffset=oi(i.borderDashOffset,e.borderDashOffset),t.lineJoin=oi(i.borderJoinStyle,e.borderJoinStyle),t.lineWidth=oi(i.borderWidth,e.borderWidth),t.strokeStyle=oi(i.borderColor,e.borderColor)}function Jo(t,e,i){t.lineTo(i.x,i.y)}function tn(t,e,i={}){const s=t.length,{start:r=0,end:a=s-1}=i,{start:o,end:n}=e,l=Math.max(r,o),c=Math.min(a,n),h=r<o&&a<o||r>n&&a>n;return{count:s,start:l,loop:e.loop,ilen:c<l&&!h?s+c-l:c-l}}function en(t,e,i,s){const{points:r,options:a}=e,{count:o,start:n,loop:l,ilen:c}=tn(r,i,s),h=function(t){return t.stepped?Fs:t.tension||"monotone"===t.cubicInterpolationMode?As:Jo}(a);let d,p,u,{move:g=!0,reverse:f}=s||{};for(d=0;d<=c;++d)p=r[(n+(f?c-d:d))%o],p.skip||(g?(t.moveTo(p.x,p.y),g=!1):h(t,u,p,f,a.stepped),u=p);return l&&(p=r[(n+(f?c:0))%o],h(t,u,p,f,a.stepped)),!!l}function sn(t,e,i,s){const r=e.points,{count:a,start:o,ilen:n}=tn(r,i,s),{move:l=!0,reverse:c}=s||{};let h,d,p,u,g,f,_=0,m=0;const y=t=>(o+(c?n-t:t))%a,x=()=>{u!==g&&(t.lineTo(_,g),t.lineTo(_,u),t.lineTo(_,f))};for(l&&(d=r[y(0)],t.moveTo(d.x,d.y)),h=0;h<=n;++h){if(d=r[y(h)],d.skip)continue;const e=d.x,i=d.y,s=0|e;s===p?(i<u?u=i:i>g&&(g=i),_=(m*_+e)/++m):(x(),t.lineTo(e,i),p=s,m=0,u=g=i),f=i}x()}function rn(t){const e=t.options,i=e.borderDash&&e.borderDash.length;return!(t._decimated||t._loop||e.tension||"monotone"===e.cubicInterpolationMode||e.stepped||i)?sn:en}const an="function"==typeof Path2D;function on(t,e,i,s){an&&!e.options.segment?function(t,e,i,s){let r=e._path;r||(r=e._path=new Path2D,e.path(r,i,s)&&r.closePath()),Qo(t,e.options),t.stroke(r)}(t,e,i,s):function(t,e,i,s){const{segments:r,options:a}=e,o=rn(e);for(const n of r)Qo(t,a,n.style),t.beginPath(),o(t,e,n,{start:i,end:i+s-1})&&t.closePath(),t.stroke()}(t,e,i,s)}class nn extends so{static id="line";static defaults={borderCapStyle:"butt",borderDash:[],borderDashOffset:0,borderJoinStyle:"miter",borderWidth:3,capBezierPoints:!0,cubicInterpolationMode:"default",fill:!1,spanGaps:!1,stepped:!1,tension:0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};static descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t&&"fill"!==t};constructor(t){super(),this.animated=!0,this.options=void 0,this._chart=void 0,this._loop=void 0,this._fullLoop=void 0,this._path=void 0,this._points=void 0,this._segments=void 0,this._decimated=!1,this._pointsUpdated=!1,this._datasetIndex=void 0,t&&Object.assign(this,t)}updateControlPoints(t,e){const i=this.options;if((i.tension||"monotone"===i.cubicInterpolationMode)&&!i.stepped&&!this._pointsUpdated){const s=i.spanGaps?this._loop:this._fullLoop;_r(this._points,i,t,s,e),this._pointsUpdated=!0}}set points(t){this._points=t,delete this._segments,delete this._path,this._pointsUpdated=!1}get points(){return this._points}get segments(){return this._segments||(this._segments=function(t,e){const i=t.points,s=t.options.spanGaps,r=i.length;if(!r)return[];const a=!!t._loop,{start:o,end:n}=function(t,e,i,s){let r=0,a=e-1;if(i&&!s)for(;r<e&&!t[r].skip;)r++;for(;r<e&&t[r].skip;)r++;for(r%=e,i&&(a+=r);a>r&&t[a%e].skip;)a--;return a%=e,{start:r,end:a}}(i,r,a,s);return Nr(t,!0===s?[{start:o,end:n,loop:a}]:function(t,e,i,s){const r=t.length,a=[];let o,n=e,l=t[e];for(o=e+1;o<=i;++o){const i=t[o%r];i.skip||i.stop?l.skip||(s=!1,a.push({start:e%r,end:(o-1)%r,loop:s}),e=n=i.stop?o:null):(n=o,l.skip&&(e=o)),l=i}return null!==n&&a.push({start:e%r,end:n%r,loop:s}),a}(i,o,n<o?n+r:n,!!t._fullLoop&&0===o&&n===r-1),i,e)}(this,this.options.segment))}first(){const t=this.segments,e=this.points;return t.length&&e[t[0].start]}last(){const t=this.segments,e=this.points,i=t.length;return i&&e[t[i-1].end]}interpolate(t,e){const i=this.options,s=t[e],r=this.points,a=Or(this,{property:e,start:s,end:s});if(!a.length)return;const o=[],n=function(t){return t.stepped?Er:t.tension||"monotone"===t.cubicInterpolationMode?Pr:zr}(i);let l,c;for(l=0,c=a.length;l<c;++l){const{start:c,end:h}=a[l],d=r[c],p=r[h];if(d===p){o.push(d);continue}const u=n(d,p,Math.abs((s-d[e])/(p[e]-d[e])),i.stepped);u[e]=t[e],o.push(u)}return 1===o.length?o[0]:o}pathSegment(t,e,i){return rn(this)(t,this,e,i)}path(t,e,i){const s=this.segments,r=rn(this);let a=this._loop;e=e||0,i=i||this.points.length-e;for(const o of s)a&=r(t,this,o,{start:e,end:e+i-1});return!!a}draw(t,e,i,s){const r=this.options||{};(this.points||[]).length&&r.borderWidth&&(t.save(),on(t,this,i,s),t.restore()),this.animated&&(this._pointsUpdated=!1,this._path=void 0)}}function ln(t,e,i,s){const r=t.options,{[i]:a}=t.getProps([i],s);return Math.abs(e-a)<r.radius+r.hitRadius}function cn(t,e){const{x:i,y:s,base:r,width:a,height:o}=t.getProps(["x","y","base","width","height"],e);let n,l,c,h,d;return t.horizontal?(d=o/2,n=Math.min(i,r),l=Math.max(i,r),c=s-d,h=s+d):(d=a/2,n=i-d,l=i+d,c=Math.min(s,r),h=Math.max(s,r)),{left:n,top:c,right:l,bottom:h}}function hn(t,e,i,s){return t?0:Ui(e,i,s)}function dn(t){const e=cn(t),i=e.right-e.left,s=e.bottom-e.top,r=function(t,e,i){const s=t.options.borderWidth,r=t.borderSkipped,a=Vs(s);return{t:hn(r.top,a.top,0,i),r:hn(r.right,a.right,0,e),b:hn(r.bottom,a.bottom,0,i),l:hn(r.left,a.left,0,e)}}(t,i/2,s/2),a=function(t,e,i){const{enableBorderRadius:s}=t.getProps(["enableBorderRadius"]),r=t.options.borderRadius,a=Us(r),o=Math.min(e,i),n=t.borderSkipped,l=s||si(r);return{topLeft:hn(!l||n.top||n.left,a.topLeft,0,o),topRight:hn(!l||n.top||n.right,a.topRight,0,o),bottomLeft:hn(!l||n.bottom||n.left,a.bottomLeft,0,o),bottomRight:hn(!l||n.bottom||n.right,a.bottomRight,0,o)}}(t,i/2,s/2);return{outer:{x:e.left,y:e.top,w:i,h:s,radius:a},inner:{x:e.left+r.l,y:e.top+r.t,w:i-r.l-r.r,h:s-r.t-r.b,radius:{topLeft:Math.max(0,a.topLeft-Math.max(r.t,r.l)),topRight:Math.max(0,a.topRight-Math.max(r.t,r.r)),bottomLeft:Math.max(0,a.bottomLeft-Math.max(r.b,r.l)),bottomRight:Math.max(0,a.bottomRight-Math.max(r.b,r.r))}}}}function pn(t,e,i,s){const r=null===e,a=null===i,o=t&&!(r&&a)&&cn(t,s);return o&&(r||Yi(e,o.left,o.right))&&(a||Yi(i,o.top,o.bottom))}function un(t,e){t.rect(e.x,e.y,e.w,e.h)}function gn(t,e,i={}){const s=t.x!==i.x?-e:0,r=t.y!==i.y?-e:0,a=(t.x+t.w!==i.x+i.w?e:0)-s,o=(t.y+t.h!==i.y+i.h?e:0)-r;return{x:t.x+s,y:t.y+r,w:t.w+a,h:t.h+o,radius:t.radius}}var fn=Object.freeze({__proto__:null,ArcElement:class extends so{static id="arc";static defaults={borderAlign:"center",borderColor:"#fff",borderDash:[],borderDashOffset:0,borderJoinStyle:void 0,borderRadius:0,borderWidth:2,offset:0,spacing:0,angle:void 0,circular:!0};static defaultRoutes={backgroundColor:"backgroundColor"};static descriptors={_scriptable:!0,_indexable:t=>"borderDash"!==t};circumference;endAngle;fullCircles;innerRadius;outerRadius;pixelMargin;startAngle;constructor(t){super(),this.options=void 0,this.circumference=void 0,this.startAngle=void 0,this.endAngle=void 0,this.innerRadius=void 0,this.outerRadius=void 0,this.pixelMargin=0,this.fullCircles=0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.getProps(["x","y"],i),{angle:r,distance:a}=Hi(s,{x:t,y:e}),{startAngle:o,endAngle:n,innerRadius:l,outerRadius:c,circumference:h}=this.getProps(["startAngle","endAngle","innerRadius","outerRadius","circumference"],i),d=(this.options.spacing+this.options.borderWidth)/2,p=oi(h,n-o),u=Vi(r,o,n)&&o!==n,g=p>=ki||u,f=Yi(a,l+d,c+d);return g&&f}getCenterPoint(t){const{x:e,y:i,startAngle:s,endAngle:r,innerRadius:a,outerRadius:o}=this.getProps(["x","y","startAngle","endAngle","innerRadius","outerRadius"],t),{offset:n,spacing:l}=this.options,c=(s+r)/2,h=(a+o+l+n)/2;return{x:e+Math.cos(c)*h,y:i+Math.sin(c)*h}}tooltipPosition(t){return this.getCenterPoint(t)}draw(t){const{options:e,circumference:i}=this,s=(e.offset||0)/4,r=(e.spacing||0)/2,a=e.circular;if(this.pixelMargin="inner"===e.borderAlign?.33:0,this.fullCircles=i>ki?Math.floor(i/ki):0,0===i||this.innerRadius<0||this.outerRadius<0)return;t.save();const o=(this.startAngle+this.endAngle)/2;t.translate(Math.cos(o)*s,Math.sin(o)*s);const n=s*(1-Math.sin(Math.min($i,i||0)));t.fillStyle=e.backgroundColor,t.strokeStyle=e.borderColor,function(t,e,i,s,r){const{fullCircles:a,startAngle:o,circumference:n}=e;let l=e.endAngle;if(a){Xo(t,e,i,s,l,r);for(let e=0;e<a;++e)t.fill();isNaN(n)||(l=o+(n%ki||ki))}Xo(t,e,i,s,l,r),t.fill()}(t,this,n,r,a),Zo(t,this,n,r,a),t.restore()}},BarElement:class extends so{static id="bar";static defaults={borderSkipped:"start",borderWidth:0,borderRadius:0,inflateAmount:"auto",pointStyle:void 0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};constructor(t){super(),this.options=void 0,this.horizontal=void 0,this.base=void 0,this.width=void 0,this.height=void 0,this.inflateAmount=void 0,t&&Object.assign(this,t)}draw(t){const{inflateAmount:e,options:{borderColor:i,backgroundColor:s}}=this,{inner:r,outer:a}=dn(this),o=(n=a.radius).topLeft||n.topRight||n.bottomLeft||n.bottomRight?Os:un;var n;t.save(),a.w===r.w&&a.h===r.h||(t.beginPath(),o(t,gn(a,e,r)),t.clip(),o(t,gn(r,-e,a)),t.fillStyle=i,t.fill("evenodd")),t.beginPath(),o(t,gn(r,e)),t.fillStyle=s,t.fill(),t.restore()}inRange(t,e,i){return pn(this,t,e,i)}inXRange(t,e){return pn(this,t,null,e)}inYRange(t,e){return pn(this,null,t,e)}getCenterPoint(t){const{x:e,y:i,base:s,horizontal:r}=this.getProps(["x","y","base","horizontal"],t);return{x:r?(e+s)/2:e,y:r?i:(i+s)/2}}getRange(t){return"x"===t?this.width/2:this.height/2}},LineElement:nn,PointElement:class extends so{static id="point";parsed;skip;stop;static defaults={borderWidth:1,hitRadius:1,hoverBorderWidth:1,hoverRadius:4,pointStyle:"circle",radius:3,rotation:0};static defaultRoutes={backgroundColor:"backgroundColor",borderColor:"borderColor"};constructor(t){super(),this.options=void 0,this.parsed=void 0,this.skip=void 0,this.stop=void 0,t&&Object.assign(this,t)}inRange(t,e,i){const s=this.options,{x:r,y:a}=this.getProps(["x","y"],i);return Math.pow(t-r,2)+Math.pow(e-a,2)<Math.pow(s.hitRadius+s.radius,2)}inXRange(t,e){return ln(this,t,"x",e)}inYRange(t,e){return ln(this,t,"y",e)}getCenterPoint(t){const{x:e,y:i}=this.getProps(["x","y"],t);return{x:e,y:i}}size(t){let e=(t=t||this.options||{}).radius||0;e=Math.max(e,e&&t.hoverRadius||0);return 2*(e+(e&&t.borderWidth||0))}draw(t,e){const i=this.options;this.skip||i.radius<.1||!Es(this,e,this.size(i)/2)||(t.strokeStyle=i.borderColor,t.lineWidth=i.borderWidth,t.fillStyle=i.backgroundColor,Ds(t,i,this.x,this.y))}getRange(){const t=this.options||{};return t.radius+t.hitRadius}}});const _n=["rgb(54, 162, 235)","rgb(255, 99, 132)","rgb(255, 159, 64)","rgb(255, 205, 86)","rgb(75, 192, 192)","rgb(153, 102, 255)","rgb(201, 203, 207)"],mn=_n.map(t=>t.replace("rgb(","rgba(").replace(")",", 0.5)"));function yn(t){return _n[t%_n.length]}function xn(t){return mn[t%mn.length]}function bn(t){let e=0;return(i,s)=>{const r=t.getDatasetMeta(s).controller;r instanceof ga?e=function(t,e){return t.backgroundColor=t.data.map(()=>yn(e++)),e}(i,e):r instanceof fa?e=function(t,e){return t.backgroundColor=t.data.map(()=>xn(e++)),e}(i,e):r&&(e=function(t,e){return t.borderColor=yn(e),t.backgroundColor=xn(e),++e}(i,e))}}function vn(t){let e;for(e in t)if(t[e].borderColor||t[e].backgroundColor)return!0;return!1}var wn={id:"colors",defaults:{enabled:!0,forceOverride:!1},beforeLayout(t,e,i){if(!i.enabled)return;const{data:{datasets:s},options:r}=t.config,{elements:a}=r,o=vn(s)||(n=r)&&(n.borderColor||n.backgroundColor)||a&&vn(a)||"rgba(0,0,0,0.1)"!==$s.borderColor||"rgba(0,0,0,0.1)"!==$s.backgroundColor;var n;if(!i.forceOverride&&o)return;const l=bn(t);s.forEach(l)}};function $n(t){if(t._decimated){const e=t._data;delete t._decimated,delete t._data,Object.defineProperty(t,"data",{configurable:!0,enumerable:!0,writable:!0,value:e})}}function kn(t){t.data.datasets.forEach(t=>{$n(t)})}var Mn={id:"decimation",defaults:{algorithm:"min-max",enabled:!1},beforeElementsUpdate:(t,e,i)=>{if(!i.enabled)return void kn(t);const s=t.width;t.data.datasets.forEach((e,r)=>{const{_data:a,indexAxis:o}=e,n=t.getDatasetMeta(r),l=a||e.data;if("y"===qs([o,t.options.indexAxis]))return;if(!n.controller.supportsDecimation)return;const c=t.scales[n.xAxisID];if("linear"!==c.type&&"time"!==c.type)return;if(t.options.parsing)return;let{start:h,count:d}=function(t,e){const i=e.length;let s,r=0;const{iScale:a}=t,{min:o,max:n,minDefined:l,maxDefined:c}=a.getUserBounds();return l&&(r=Ui(qi(e,a.axis,o).lo,0,i-1)),s=c?Ui(qi(e,a.axis,n).hi+1,r,i)-r:i-r,{start:r,count:s}}(n,l);if(d<=(i.threshold||4*s))return void $n(e);let p;switch(ei(a)&&(e._data=l,delete e.data,Object.defineProperty(e,"data",{configurable:!0,enumerable:!0,get:function(){return this._decimated},set:function(t){this._data=t}})),i.algorithm){case"lttb":p=function(t,e,i,s,r){const a=r.samples||s;if(a>=i)return t.slice(e,e+i);const o=[],n=(i-2)/(a-2);let l=0;const c=e+i-1;let h,d,p,u,g,f=e;for(o[l++]=t[f],h=0;h<a-2;h++){let s,r=0,a=0;const c=Math.floor((h+1)*n)+1+e,_=Math.min(Math.floor((h+2)*n)+1,i)+e,m=_-c;for(s=c;s<_;s++)r+=t[s].x,a+=t[s].y;r/=m,a/=m;const y=Math.floor(h*n)+1+e,x=Math.min(Math.floor((h+1)*n)+1,i)+e,{x:b,y:v}=t[f];for(p=u=-1,s=y;s<x;s++)u=.5*Math.abs((b-r)*(t[s].y-v)-(b-t[s].x)*(a-v)),u>p&&(p=u,d=t[s],g=s);o[l++]=d,f=g}return o[l++]=t[c],o}(l,h,d,s,i);break;case"min-max":p=function(t,e,i,s){let r,a,o,n,l,c,h,d,p,u,g=0,f=0;const _=[],m=e+i-1,y=t[e].x,x=t[m].x-y;for(r=e;r<e+i;++r){a=t[r],o=(a.x-y)/x*s,n=a.y;const e=0|o;if(e===l)n<p?(p=n,c=r):n>u&&(u=n,h=r),g=(f*g+a.x)/++f;else{const i=r-1;if(!ei(c)&&!ei(h)){const e=Math.min(c,h),s=Math.max(c,h);e!==d&&e!==i&&_.push({...t[e],x:g}),s!==d&&s!==i&&_.push({...t[s],x:g})}r>0&&i!==d&&_.push(t[i]),_.push(a),l=e,f=0,p=u=n,c=h=d=r}}return _}(l,h,d,s);break;default:throw new Error(`Unsupported decimation algorithm '${i.algorithm}'`)}e._decimated=p})},destroy(t){kn(t)}};function Sn(t,e,i,s){if(s)return;let r=e[t],a=i[t];return"angle"===t&&(r=ji(r),a=ji(a)),{property:t,start:r,end:a}}function Cn(t,e,i){for(;e>t;e--){const t=i[e];if(!isNaN(t.x)&&!isNaN(t.y))break}return e}function Dn(t,e,i,s){return t&&e?s(t[i],e[i]):t?t[i]:e?e[i]:0}function zn(t,e){let i=[],s=!1;return ii(t)?(s=!0,i=t):i=function(t,e){const{x:i=null,y:s=null}=t||{},r=e.points,a=[];return e.segments.forEach(({start:t,end:e})=>{e=Cn(t,e,r);const o=r[t],n=r[e];null!==s?(a.push({x:o.x,y:s}),a.push({x:n.x,y:s})):null!==i&&(a.push({x:i,y:o.y}),a.push({x:i,y:n.y}))}),a}(t,e),i.length?new nn({points:i,options:{tension:0},_loop:s,_fullLoop:s}):null}function En(t){return t&&!1!==t.fill}function Pn(t,e,i){let s=t[e].fill;const r=[e];let a;if(!i)return s;for(;!1!==s&&-1===r.indexOf(s);){if(!ri(s))return s;if(a=t[s],!a)return!1;if(a.visible)return s;r.push(s),s=a.fill}return!1}function Tn(t,e,i){const s=function(t){const e=t.options,i=e.fill;let s=oi(i&&i.target,i);void 0===s&&(s=!!e.backgroundColor);if(!1===s||null===s)return!1;if(!0===s)return"origin";return s}(t);if(si(s))return!isNaN(s.value)&&s;let r=parseFloat(s);return ri(r)&&Math.floor(r)===r?function(t,e,i,s){"-"!==t&&"+"!==t||(i=e+i);if(i===e||i<0||i>=s)return!1;return i}(s[0],e,r,i):["origin","start","end","stack","shape"].indexOf(s)>=0&&s}function Fn(t,e,i){const s=[];for(let r=0;r<i.length;r++){const a=i[r],{first:o,last:n,point:l}=An(a,e,"x");if(!(!l||o&&n))if(o)s.unshift(l);else if(t.push(l),!n)break}t.push(...s)}function An(t,e,i){const s=t.interpolate(e,i);if(!s)return{};const r=s[i],a=t.segments,o=t.points;let n=!1,l=!1;for(let t=0;t<a.length;t++){const e=a[t],s=o[e.start][i],c=o[e.end][i];if(Yi(r,s,c)){n=r===s,l=r===c;break}}return{first:n,last:l,point:s}}class Rn{constructor(t){this.x=t.x,this.y=t.y,this.radius=t.radius}pathSegment(t,e,i){const{x:s,y:r,radius:a}=this;return e=e||{start:0,end:ki},t.arc(s,r,a,e.end,e.start,!0),!i.bounds}interpolate(t){const{x:e,y:i,radius:s}=this,r=t.angle;return{x:e+Math.cos(r)*s,y:i+Math.sin(r)*s,angle:r}}}function Ln(t){const{chart:e,fill:i,line:s}=t;if(ri(i))return function(t,e){const i=t.getDatasetMeta(e),s=i&&t.isDatasetVisible(e);return s?i.dataset:null}(e,i);if("stack"===i)return function(t){const{scale:e,index:i,line:s}=t,r=[],a=s.segments,o=s.points,n=function(t,e){const i=[],s=t.getMatchingVisibleMetas("line");for(let t=0;t<s.length;t++){const r=s[t];if(r.index===e)break;r.hidden||i.unshift(r.dataset)}return i}(e,i);n.push(zn({x:null,y:e.bottom},s));for(let t=0;t<a.length;t++){const e=a[t];for(let t=e.start;t<=e.end;t++)Fn(r,o[t],n)}return new nn({points:r,options:{}})}(t);if("shape"===i)return!0;const r=function(t){const e=t.scale||{};if(e.getPointPositionForValue)return function(t){const{scale:e,fill:i}=t,s=e.options,r=e.getLabels().length,a=s.reverse?e.max:e.min,o=function(t,e,i){let s;return s="start"===t?i:"end"===t?e.options.reverse?e.min:e.max:si(t)?t.value:e.getBaseValue(),s}(i,e,a),n=[];if(s.grid.circular){const t=e.getPointPositionForValue(0,a);return new Rn({x:t.x,y:t.y,radius:e.getDistanceFromCenterForValue(o)})}for(let t=0;t<r;++t)n.push(e.getPointPositionForValue(t,o));return n}(t);return function(t){const{scale:e={},fill:i}=t,s=function(t,e){let i=null;return"start"===t?i=e.bottom:"end"===t?i=e.top:si(t)?i=e.getPixelForValue(t.value):e.getBasePixel&&(i=e.getBasePixel()),i}(i,e);if(ri(s)){const t=e.isHorizontal();return{x:t?s:null,y:t?null:s}}return null}(t)}(t);return r instanceof Rn?r:zn(r,s)}function In(t,e,i){const s=Ln(e),{line:r,scale:a,axis:o}=e,n=r.options,l=n.fill,c=n.backgroundColor,{above:h=c,below:d=c}=l||{};s&&r.points.length&&(Ps(t,i),function(t,e){const{line:i,target:s,above:r,below:a,area:o,scale:n}=e,l=i._loop?"angle":e.axis;t.save(),"x"===l&&a!==r&&(On(t,s,o.top),Nn(t,{line:i,target:s,color:r,scale:n,property:l}),t.restore(),t.save(),On(t,s,o.bottom));Nn(t,{line:i,target:s,color:a,scale:n,property:l}),t.restore()}(t,{line:r,target:s,above:h,below:d,area:i,scale:a,axis:o}),Ts(t))}function On(t,e,i){const{segments:s,points:r}=e;let a=!0,o=!1;t.beginPath();for(const n of s){const{start:s,end:l}=n,c=r[s],h=r[Cn(s,l,r)];a?(t.moveTo(c.x,c.y),a=!1):(t.lineTo(c.x,i),t.lineTo(c.x,c.y)),o=!!e.pathSegment(t,n,{move:o}),o?t.closePath():t.lineTo(h.x,i)}t.lineTo(e.first().x,i),t.closePath(),t.clip()}function Nn(t,e){const{line:i,target:s,property:r,color:a,scale:o}=e,n=function(t,e,i){const s=t.segments,r=t.points,a=e.points,o=[];for(const t of s){let{start:s,end:n}=t;n=Cn(s,n,r);const l=Sn(i,r[s],r[n],t.loop);if(!e.segments){o.push({source:t,target:l,start:r[s],end:r[n]});continue}const c=Or(e,l);for(const e of c){const s=Sn(i,a[e.start],a[e.end],e.loop),n=Ir(t,r,s);for(const t of n)o.push({source:t,target:e,start:{[i]:Dn(l,s,"start",Math.max)},end:{[i]:Dn(l,s,"end",Math.min)}})}}return o}(i,s,r);for(const{source:e,target:l,start:c,end:h}of n){const{style:{backgroundColor:n=a}={}}=e,d=!0!==s;t.save(),t.fillStyle=n,Hn(t,o,d&&Sn(r,c,h)),t.beginPath();const p=!!i.pathSegment(t,e);let u;if(d){p?t.closePath():Bn(t,s,h,r);const e=!!s.pathSegment(t,l,{move:p,reverse:!0});u=p&&e,u||Bn(t,s,c,r)}t.closePath(),t.fill(u?"evenodd":"nonzero"),t.restore()}}function Hn(t,e,i){const{top:s,bottom:r}=e.chart.chartArea,{property:a,start:o,end:n}=i||{};"x"===a&&(t.beginPath(),t.rect(o,s,n-o,r-s),t.clip())}function Bn(t,e,i,s){const r=e.interpolate(i,s);r&&t.lineTo(r.x,r.y)}var Wn={id:"filler",afterDatasetsUpdate(t,e,i){const s=(t.data.datasets||[]).length,r=[];let a,o,n,l;for(o=0;o<s;++o)a=t.getDatasetMeta(o),n=a.dataset,l=null,n&&n.options&&n instanceof nn&&(l={visible:t.isDatasetVisible(o),index:o,fill:Tn(n,o,s),chart:t,axis:a.controller.options.indexAxis,scale:a.vScale,line:n}),a.$filler=l,r.push(l);for(o=0;o<s;++o)l=r[o],l&&!1!==l.fill&&(l.fill=Pn(r,o,i.propagate))},beforeDraw(t,e,i){const s="beforeDraw"===i.drawTime,r=t.getSortedVisibleDatasetMetas(),a=t.chartArea;for(let e=r.length-1;e>=0;--e){const i=r[e].$filler;i&&(i.line.updateControlPoints(a,i.axis),s&&i.fill&&In(t.ctx,i,a))}},beforeDatasetsDraw(t,e,i){if("beforeDatasetsDraw"!==i.drawTime)return;const s=t.getSortedVisibleDatasetMetas();for(let e=s.length-1;e>=0;--e){const i=s[e].$filler;En(i)&&In(t.ctx,i,t.chartArea)}},beforeDatasetDraw(t,e,i){const s=e.meta.$filler;En(s)&&"beforeDatasetDraw"===i.drawTime&&In(t.ctx,s,t.chartArea)},defaults:{propagate:!0,drawTime:"beforeDatasetDraw"}};const jn=(t,e)=>{let{boxHeight:i=e,boxWidth:s=e}=t;return t.usePointStyle&&(i=Math.min(i,e),s=t.pointStyleWidth||Math.min(s,e)),{boxWidth:s,boxHeight:i,itemHeight:Math.max(e,i)}};class Vn extends so{constructor(t){super(),this._added=!1,this.legendHitBoxes=[],this._hoveredItem=null,this.doughnutMode=!1,this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this.legendItems=void 0,this.columnSizes=void 0,this.lineWidths=void 0,this.maxHeight=void 0,this.maxWidth=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.height=void 0,this.width=void 0,this._margins=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e,i){this.maxWidth=t,this.maxHeight=e,this._margins=i,this.setDimensions(),this.buildLabels(),this.fit()}setDimensions(){this.isHorizontal()?(this.width=this.maxWidth,this.left=this._margins.left,this.right=this.width):(this.height=this.maxHeight,this.top=this._margins.top,this.bottom=this.height)}buildLabels(){const t=this.options.labels||{};let e=li(t.generateLabels,[this.chart],this)||[];t.filter&&(e=e.filter(e=>t.filter(e,this.chart.data))),t.sort&&(e=e.sort((e,i)=>t.sort(e,i,this.chart.data))),this.options.reverse&&e.reverse(),this.legendItems=e}fit(){const{options:t,ctx:e}=this;if(!t.display)return void(this.width=this.height=0);const i=t.labels,s=Gs(i.font),r=s.size,a=this._computeTitleHeight(),{boxWidth:o,itemHeight:n}=jn(i,r);let l,c;e.font=s.string,this.isHorizontal()?(l=this.maxWidth,c=this._fitRows(a,r,o,n)+10):(c=this.maxHeight,l=this._fitCols(a,s,o,n)+10),this.width=Math.min(l,t.maxWidth||this.maxWidth),this.height=Math.min(c,t.maxHeight||this.maxHeight)}_fitRows(t,e,i,s){const{ctx:r,maxWidth:a,options:{labels:{padding:o}}}=this,n=this.legendHitBoxes=[],l=this.lineWidths=[0],c=s+o;let h=t;r.textAlign="left",r.textBaseline="middle";let d=-1,p=-c;return this.legendItems.forEach((t,u)=>{const g=i+e/2+r.measureText(t.text).width;(0===u||l[l.length-1]+g+2*o>a)&&(h+=c,l[l.length-(u>0?0:1)]=0,p+=c,d++),n[u]={left:0,top:p,row:d,width:g,height:s},l[l.length-1]+=g+o}),h}_fitCols(t,e,i,s){const{ctx:r,maxHeight:a,options:{labels:{padding:o}}}=this,n=this.legendHitBoxes=[],l=this.columnSizes=[],c=a-t;let h=o,d=0,p=0,u=0,g=0;return this.legendItems.forEach((t,a)=>{const{itemWidth:f,itemHeight:_}=function(t,e,i,s,r){const a=function(t,e,i,s){let r=t.text;r&&"string"!=typeof r&&(r=r.reduce((t,e)=>t.length>e.length?t:e));return e+i.size/2+s.measureText(r).width}(s,t,e,i),o=function(t,e,i){let s=t;"string"!=typeof e.text&&(s=Un(e,i));return s}(r,s,e.lineHeight);return{itemWidth:a,itemHeight:o}}(i,e,r,t,s);a>0&&p+_+2*o>c&&(h+=d+o,l.push({width:d,height:p}),u+=d+o,g++,d=p=0),n[a]={left:u,top:p,col:g,width:f,height:_},d=Math.max(d,f),p+=_+o}),h+=d,l.push({width:d,height:p}),h}adjustHitBoxes(){if(!this.options.display)return;const t=this._computeTitleHeight(),{legendHitBoxes:e,options:{align:i,labels:{padding:s},rtl:r}}=this,a=Tr(r,this.left,this.width);if(this.isHorizontal()){let r=0,o=is(i,this.left+s,this.right-this.lineWidths[r]);for(const n of e)r!==n.row&&(r=n.row,o=is(i,this.left+s,this.right-this.lineWidths[r])),n.top+=this.top+t+s,n.left=a.leftForLtr(a.x(o),n.width),o+=n.width+s}else{let r=0,o=is(i,this.top+t+s,this.bottom-this.columnSizes[r].height);for(const n of e)n.col!==r&&(r=n.col,o=is(i,this.top+t+s,this.bottom-this.columnSizes[r].height)),n.top=o,n.left+=this.left+s,n.left=a.leftForLtr(a.x(n.left),n.width),o+=n.height+s}}isHorizontal(){return"top"===this.options.position||"bottom"===this.options.position}draw(){if(this.options.display){const t=this.ctx;Ps(t,this),this._draw(),Ts(t)}}_draw(){const{options:t,columnSizes:e,lineWidths:i,ctx:s}=this,{align:r,labels:a}=t,o=$s.color,n=Tr(t.rtl,this.left,this.width),l=Gs(a.font),{padding:c}=a,h=l.size,d=h/2;let p;this.drawTitle(),s.textAlign=n.textAlign("left"),s.textBaseline="middle",s.lineWidth=.5,s.font=l.string;const{boxWidth:u,boxHeight:g,itemHeight:f}=jn(a,h),_=this.isHorizontal(),m=this._computeTitleHeight();p=_?{x:is(r,this.left+c,this.right-i[0]),y:this.top+c+m,line:0}:{x:this.left+c,y:is(r,this.top+m+c,this.bottom-e[0].height),line:0},Fr(this.ctx,t.textDirection);const y=f+c;this.legendItems.forEach((x,b)=>{s.strokeStyle=x.fontColor,s.fillStyle=x.fontColor;const v=s.measureText(x.text).width,w=n.textAlign(x.textAlign||(x.textAlign=a.textAlign)),$=u+d+v;let k=p.x,M=p.y;n.setWidth(this.width),_?b>0&&k+$+c>this.right&&(M=p.y+=y,p.line++,k=p.x=is(r,this.left+c,this.right-i[p.line])):b>0&&M+y>this.bottom&&(k=p.x=k+e[p.line].width+c,p.line++,M=p.y=is(r,this.top+m+c,this.bottom-e[p.line].height));if(function(t,e,i){if(isNaN(u)||u<=0||isNaN(g)||g<0)return;s.save();const r=oi(i.lineWidth,1);if(s.fillStyle=oi(i.fillStyle,o),s.lineCap=oi(i.lineCap,"butt"),s.lineDashOffset=oi(i.lineDashOffset,0),s.lineJoin=oi(i.lineJoin,"miter"),s.lineWidth=r,s.strokeStyle=oi(i.strokeStyle,o),s.setLineDash(oi(i.lineDash,[])),a.usePointStyle){const o={radius:g*Math.SQRT2/2,pointStyle:i.pointStyle,rotation:i.rotation,borderWidth:r},l=n.xPlus(t,u/2);zs(s,o,l,e+d,a.pointStyleWidth&&u)}else{const a=e+Math.max((h-g)/2,0),o=n.leftForLtr(t,u),l=Us(i.borderRadius);s.beginPath(),Object.values(l).some(t=>0!==t)?Os(s,{x:o,y:a,w:u,h:g,radius:l}):s.rect(o,a,u,g),s.fill(),0!==r&&s.stroke()}s.restore()}(n.x(k),M,x),k=((t,e,i,s)=>t===(s?"left":"right")?i:"center"===t?(e+i)/2:e)(w,k+u+d,_?k+$:this.right,t.rtl),function(t,e,i){Is(s,i.text,t,e+f/2,l,{strikethrough:i.hidden,textAlign:n.textAlign(i.textAlign)})}(n.x(k),M,x),_)p.x+=$+c;else if("string"!=typeof x.text){const t=l.lineHeight;p.y+=Un(x,t)+c}else p.y+=y}),Ar(this.ctx,t.textDirection)}drawTitle(){const t=this.options,e=t.title,i=Gs(e.font),s=Ys(e.padding);if(!e.display)return;const r=Tr(t.rtl,this.left,this.width),a=this.ctx,o=e.position,n=i.size/2,l=s.top+n;let c,h=this.left,d=this.width;if(this.isHorizontal())d=Math.max(...this.lineWidths),c=this.top+l,h=is(t.align,h,this.right-d);else{const e=this.columnSizes.reduce((t,e)=>Math.max(t,e.height),0);c=l+is(t.align,this.top,this.bottom-e-t.labels.padding-this._computeTitleHeight())}const p=is(o,h,h+d);a.textAlign=r.textAlign(es(o)),a.textBaseline="middle",a.strokeStyle=e.color,a.fillStyle=e.color,a.font=i.string,Is(a,e.text,p,c,i)}_computeTitleHeight(){const t=this.options.title,e=Gs(t.font),i=Ys(t.padding);return t.display?e.lineHeight+i.height:0}_getLegendItemAt(t,e){let i,s,r;if(Yi(t,this.left,this.right)&&Yi(e,this.top,this.bottom))for(r=this.legendHitBoxes,i=0;i<r.length;++i)if(s=r[i],Yi(t,s.left,s.left+s.width)&&Yi(e,s.top,s.top+s.height))return this.legendItems[i];return null}handleEvent(t){const e=this.options;if(!function(t,e){if(("mousemove"===t||"mouseout"===t)&&(e.onHover||e.onLeave))return!0;if(e.onClick&&("click"===t||"mouseup"===t))return!0;return!1}(t.type,e))return;const i=this._getLegendItemAt(t.x,t.y);if("mousemove"===t.type||"mouseout"===t.type){const s=this._hoveredItem,r=((t,e)=>null!==t&&null!==e&&t.datasetIndex===e.datasetIndex&&t.index===e.index)(s,i);s&&!r&&li(e.onLeave,[t,s,this],this),this._hoveredItem=i,i&&!r&&li(e.onHover,[t,i,this],this)}else i&&li(e.onClick,[t,i,this],this)}}function Un(t,e){return e*(t.text?t.text.length:0)}var Yn={id:"legend",_element:Vn,start(t,e,i){const s=t.legend=new Vn({ctx:t.ctx,options:i,chart:t});Na.configure(t,s,i),Na.addBox(t,s)},stop(t){Na.removeBox(t,t.legend),delete t.legend},beforeUpdate(t,e,i){const s=t.legend;Na.configure(t,s,i),s.options=i},afterUpdate(t){const e=t.legend;e.buildLabels(),e.adjustHitBoxes()},afterEvent(t,e){e.replay||t.legend.handleEvent(e.event)},defaults:{display:!0,position:"top",align:"center",fullSize:!0,reverse:!1,weight:1e3,onClick(t,e,i){const s=e.datasetIndex,r=i.chart;r.isDatasetVisible(s)?(r.hide(s),e.hidden=!0):(r.show(s),e.hidden=!1)},onHover:null,onLeave:null,labels:{color:t=>t.chart.options.color,boxWidth:40,padding:10,generateLabels(t){const e=t.data.datasets,{labels:{usePointStyle:i,pointStyle:s,textAlign:r,color:a,useBorderRadius:o,borderRadius:n}}=t.legend.options;return t._getSortedDatasetMetas().map(t=>{const l=t.controller.getStyle(i?0:void 0),c=Ys(l.borderWidth);return{text:e[t.index].label,fillStyle:l.backgroundColor,fontColor:a,hidden:!t.visible,lineCap:l.borderCapStyle,lineDash:l.borderDash,lineDashOffset:l.borderDashOffset,lineJoin:l.borderJoinStyle,lineWidth:(c.width+c.height)/4,strokeStyle:l.borderColor,pointStyle:s||l.pointStyle,rotation:l.rotation,textAlign:r||l.textAlign,borderRadius:o&&(n||l.borderRadius),datasetIndex:t.index}},this)}},title:{color:t=>t.chart.options.color,display:!1,position:"center",text:""}},descriptors:{_scriptable:t=>!t.startsWith("on"),labels:{_scriptable:t=>!["generateLabels","filter","sort"].includes(t)}}};class Gn extends so{constructor(t){super(),this.chart=t.chart,this.options=t.options,this.ctx=t.ctx,this._padding=void 0,this.top=void 0,this.bottom=void 0,this.left=void 0,this.right=void 0,this.width=void 0,this.height=void 0,this.position=void 0,this.weight=void 0,this.fullSize=void 0}update(t,e){const i=this.options;if(this.left=0,this.top=0,!i.display)return void(this.width=this.height=this.right=this.bottom=0);this.width=this.right=t,this.height=this.bottom=e;const s=ii(i.text)?i.text.length:1;this._padding=Ys(i.padding);const r=s*Gs(i.font).lineHeight+this._padding.height;this.isHorizontal()?this.height=r:this.width=r}isHorizontal(){const t=this.options.position;return"top"===t||"bottom"===t}_drawArgs(t){const{top:e,left:i,bottom:s,right:r,options:a}=this,o=a.align;let n,l,c,h=0;return this.isHorizontal()?(l=is(o,i,r),c=e+t,n=r-i):("left"===a.position?(l=i+t,c=is(o,s,e),h=-.5*$i):(l=r-t,c=is(o,e,s),h=.5*$i),n=s-e),{titleX:l,titleY:c,maxWidth:n,rotation:h}}draw(){const t=this.ctx,e=this.options;if(!e.display)return;const i=Gs(e.font),s=i.lineHeight/2+this._padding.top,{titleX:r,titleY:a,maxWidth:o,rotation:n}=this._drawArgs(s);Is(t,e.text,0,0,i,{color:e.color,maxWidth:o,rotation:n,textAlign:es(e.align),textBaseline:"middle",translation:[r,a]})}}var qn={id:"title",_element:Gn,start(t,e,i){!function(t,e){const i=new Gn({ctx:t.ctx,options:e,chart:t});Na.configure(t,i,e),Na.addBox(t,i),t.titleBlock=i}(t,i)},stop(t){const e=t.titleBlock;Na.removeBox(t,e),delete t.titleBlock},beforeUpdate(t,e,i){const s=t.titleBlock;Na.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"bold"},fullSize:!0,padding:10,position:"top",text:"",weight:2e3},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Kn=new WeakMap;var Xn={id:"subtitle",start(t,e,i){const s=new Gn({ctx:t.ctx,options:i,chart:t});Na.configure(t,s,i),Na.addBox(t,s),Kn.set(t,s)},stop(t){Na.removeBox(t,Kn.get(t)),Kn.delete(t)},beforeUpdate(t,e,i){const s=Kn.get(t);Na.configure(t,s,i),s.options=i},defaults:{align:"center",display:!1,font:{weight:"normal"},fullSize:!0,padding:0,position:"top",text:"",weight:1500},defaultRoutes:{color:"color"},descriptors:{_scriptable:!0,_indexable:!1}};const Zn={average(t){if(!t.length)return!1;let e,i,s=new Set,r=0,a=0;for(e=0,i=t.length;e<i;++e){const i=t[e].element;if(i&&i.hasValue()){const t=i.tooltipPosition();s.add(t.x),r+=t.y,++a}}if(0===a||0===s.size)return!1;const o=[...s].reduce((t,e)=>t+e)/s.size;return{x:o,y:r/a}},nearest(t,e){if(!t.length)return!1;let i,s,r,a=e.x,o=e.y,n=Number.POSITIVE_INFINITY;for(i=0,s=t.length;i<s;++i){const s=t[i].element;if(s&&s.hasValue()){const t=Bi(e,s.getCenterPoint());t<n&&(n=t,r=s)}}if(r){const t=r.tooltipPosition();a=t.x,o=t.y}return{x:a,y:o}}};function Qn(t,e){return e&&(ii(e)?Array.prototype.push.apply(t,e):t.push(e)),t}function Jn(t){return("string"==typeof t||t instanceof String)&&t.indexOf("\n")>-1?t.split("\n"):t}function tl(t,e){const{element:i,datasetIndex:s,index:r}=e,a=t.getDatasetMeta(s).controller,{label:o,value:n}=a.getLabelAndValue(r);return{chart:t,label:o,parsed:a.getParsed(r),raw:t.data.datasets[s].data[r],formattedValue:n,dataset:a.getDataset(),dataIndex:r,datasetIndex:s,element:i}}function el(t,e){const i=t.chart.ctx,{body:s,footer:r,title:a}=t,{boxWidth:o,boxHeight:n}=e,l=Gs(e.bodyFont),c=Gs(e.titleFont),h=Gs(e.footerFont),d=a.length,p=r.length,u=s.length,g=Ys(e.padding);let f=g.height,_=0,m=s.reduce((t,e)=>t+e.before.length+e.lines.length+e.after.length,0);if(m+=t.beforeBody.length+t.afterBody.length,d&&(f+=d*c.lineHeight+(d-1)*e.titleSpacing+e.titleMarginBottom),m){f+=u*(e.displayColors?Math.max(n,l.lineHeight):l.lineHeight)+(m-u)*l.lineHeight+(m-1)*e.bodySpacing}p&&(f+=e.footerMarginTop+p*h.lineHeight+(p-1)*e.footerSpacing);let y=0;const x=function(t){_=Math.max(_,i.measureText(t).width+y)};return i.save(),i.font=c.string,ci(t.title,x),i.font=l.string,ci(t.beforeBody.concat(t.afterBody),x),y=e.displayColors?o+2+e.boxPadding:0,ci(s,t=>{ci(t.before,x),ci(t.lines,x),ci(t.after,x)}),y=0,i.font=h.string,ci(t.footer,x),i.restore(),_+=g.width,{width:_,height:f}}function il(t,e,i,s){const{x:r,width:a}=i,{width:o,chartArea:{left:n,right:l}}=t;let c="center";return"center"===s?c=r<=(n+l)/2?"left":"right":r<=a/2?c="left":r>=o-a/2&&(c="right"),function(t,e,i,s){const{x:r,width:a}=s,o=i.caretSize+i.caretPadding;return"left"===t&&r+a+o>e.width||"right"===t&&r-a-o<0||void 0}(c,t,e,i)&&(c="center"),c}function sl(t,e,i){const s=i.yAlign||e.yAlign||function(t,e){const{y:i,height:s}=e;return i<s/2?"top":i>t.height-s/2?"bottom":"center"}(t,i);return{xAlign:i.xAlign||e.xAlign||il(t,e,i,s),yAlign:s}}function rl(t,e,i,s){const{caretSize:r,caretPadding:a,cornerRadius:o}=t,{xAlign:n,yAlign:l}=i,c=r+a,{topLeft:h,topRight:d,bottomLeft:p,bottomRight:u}=Us(o);let g=function(t,e){let{x:i,width:s}=t;return"right"===e?i-=s:"center"===e&&(i-=s/2),i}(e,n);const f=function(t,e,i){let{y:s,height:r}=t;return"top"===e?s+=i:s-="bottom"===e?r+i:r/2,s}(e,l,c);return"center"===l?"left"===n?g+=c:"right"===n&&(g-=c):"left"===n?g-=Math.max(h,p)+r:"right"===n&&(g+=Math.max(d,u)+r),{x:Ui(g,0,s.width-e.width),y:Ui(f,0,s.height-e.height)}}function al(t,e,i){const s=Ys(i.padding);return"center"===e?t.x+t.width/2:"right"===e?t.x+t.width-s.right:t.x+s.left}function ol(t){return Qn([],Jn(t))}function nl(t,e){const i=e&&e.dataset&&e.dataset.tooltip&&e.dataset.tooltip.callbacks;return i?t.override(i):t}const ll={beforeTitle:Je,title(t){if(t.length>0){const e=t[0],i=e.chart.data.labels,s=i?i.length:0;if(this&&this.options&&"dataset"===this.options.mode)return e.dataset.label||"";if(e.label)return e.label;if(s>0&&e.dataIndex<s)return i[e.dataIndex]}return""},afterTitle:Je,beforeBody:Je,beforeLabel:Je,label(t){if(this&&this.options&&"dataset"===this.options.mode)return t.label+": "+t.formattedValue||t.formattedValue;let e=t.dataset.label||"";e&&(e+=": ");const i=t.formattedValue;return ei(i)||(e+=i),e},labelColor(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{borderColor:e.borderColor,backgroundColor:e.backgroundColor,borderWidth:e.borderWidth,borderDash:e.borderDash,borderDashOffset:e.borderDashOffset,borderRadius:0}},labelTextColor(){return this.options.bodyColor},labelPointStyle(t){const e=t.chart.getDatasetMeta(t.datasetIndex).controller.getStyle(t.dataIndex);return{pointStyle:e.pointStyle,rotation:e.rotation}},afterLabel:Je,afterBody:Je,beforeFooter:Je,footer:Je,afterFooter:Je};function cl(t,e,i,s){const r=t[e].call(i,s);return void 0===r?ll[e].call(i,s):r}class hl extends so{static positioners=Zn;constructor(t){super(),this.opacity=0,this._active=[],this._eventPosition=void 0,this._size=void 0,this._cachedAnimations=void 0,this._tooltipItems=[],this.$animations=void 0,this.$context=void 0,this.chart=t.chart,this.options=t.options,this.dataPoints=void 0,this.title=void 0,this.beforeBody=void 0,this.body=void 0,this.afterBody=void 0,this.footer=void 0,this.xAlign=void 0,this.yAlign=void 0,this.x=void 0,this.y=void 0,this.height=void 0,this.width=void 0,this.caretX=void 0,this.caretY=void 0,this.labelColors=void 0,this.labelPointStyles=void 0,this.labelTextColors=void 0}initialize(t){this.options=t,this._cachedAnimations=void 0,this.$context=void 0}_resolveAnimations(){const t=this._cachedAnimations;if(t)return t;const e=this.chart,i=this.options.setContext(this.getContext()),s=i.enabled&&e.options.animation&&i.animations,r=new Gr(this.chart,s);return s._cacheable&&(this._cachedAnimations=Object.freeze(r)),r}getContext(){return this.$context||(this.$context=(t=this.chart.getContext(),e=this,i=this._tooltipItems,Ks(t,{tooltip:e,tooltipItems:i,type:"tooltip"})));var t,e,i}getTitle(t,e){const{callbacks:i}=e,s=cl(i,"beforeTitle",this,t),r=cl(i,"title",this,t),a=cl(i,"afterTitle",this,t);let o=[];return o=Qn(o,Jn(s)),o=Qn(o,Jn(r)),o=Qn(o,Jn(a)),o}getBeforeBody(t,e){return ol(cl(e.callbacks,"beforeBody",this,t))}getBody(t,e){const{callbacks:i}=e,s=[];return ci(t,t=>{const e={before:[],lines:[],after:[]},r=nl(i,t);Qn(e.before,Jn(cl(r,"beforeLabel",this,t))),Qn(e.lines,cl(r,"label",this,t)),Qn(e.after,Jn(cl(r,"afterLabel",this,t))),s.push(e)}),s}getAfterBody(t,e){return ol(cl(e.callbacks,"afterBody",this,t))}getFooter(t,e){const{callbacks:i}=e,s=cl(i,"beforeFooter",this,t),r=cl(i,"footer",this,t),a=cl(i,"afterFooter",this,t);let o=[];return o=Qn(o,Jn(s)),o=Qn(o,Jn(r)),o=Qn(o,Jn(a)),o}_createItems(t){const e=this._active,i=this.chart.data,s=[],r=[],a=[];let o,n,l=[];for(o=0,n=e.length;o<n;++o)l.push(tl(this.chart,e[o]));return t.filter&&(l=l.filter((e,s,r)=>t.filter(e,s,r,i))),t.itemSort&&(l=l.sort((e,s)=>t.itemSort(e,s,i))),ci(l,e=>{const i=nl(t.callbacks,e);s.push(cl(i,"labelColor",this,e)),r.push(cl(i,"labelPointStyle",this,e)),a.push(cl(i,"labelTextColor",this,e))}),this.labelColors=s,this.labelPointStyles=r,this.labelTextColors=a,this.dataPoints=l,l}update(t,e){const i=this.options.setContext(this.getContext()),s=this._active;let r,a=[];if(s.length){const t=Zn[i.position].call(this,s,this._eventPosition);a=this._createItems(i),this.title=this.getTitle(a,i),this.beforeBody=this.getBeforeBody(a,i),this.body=this.getBody(a,i),this.afterBody=this.getAfterBody(a,i),this.footer=this.getFooter(a,i);const e=this._size=el(this,i),o=Object.assign({},t,e),n=sl(this.chart,i,o),l=rl(i,o,n,this.chart);this.xAlign=n.xAlign,this.yAlign=n.yAlign,r={opacity:1,x:l.x,y:l.y,width:e.width,height:e.height,caretX:t.x,caretY:t.y}}else 0!==this.opacity&&(r={opacity:0});this._tooltipItems=a,this.$context=void 0,r&&this._resolveAnimations().update(this,r),t&&i.external&&i.external.call(this,{chart:this.chart,tooltip:this,replay:e})}drawCaret(t,e,i,s){const r=this.getCaretPosition(t,i,s);e.lineTo(r.x1,r.y1),e.lineTo(r.x2,r.y2),e.lineTo(r.x3,r.y3)}getCaretPosition(t,e,i){const{xAlign:s,yAlign:r}=this,{caretSize:a,cornerRadius:o}=i,{topLeft:n,topRight:l,bottomLeft:c,bottomRight:h}=Us(o),{x:d,y:p}=t,{width:u,height:g}=e;let f,_,m,y,x,b;return"center"===r?(x=p+g/2,"left"===s?(f=d,_=f-a,y=x+a,b=x-a):(f=d+u,_=f+a,y=x-a,b=x+a),m=f):(_="left"===s?d+Math.max(n,c)+a:"right"===s?d+u-Math.max(l,h)-a:this.caretX,"top"===r?(y=p,x=y-a,f=_-a,m=_+a):(y=p+g,x=y+a,f=_+a,m=_-a),b=y),{x1:f,x2:_,x3:m,y1:y,y2:x,y3:b}}drawTitle(t,e,i){const s=this.title,r=s.length;let a,o,n;if(r){const l=Tr(i.rtl,this.x,this.width);for(t.x=al(this,i.titleAlign,i),e.textAlign=l.textAlign(i.titleAlign),e.textBaseline="middle",a=Gs(i.titleFont),o=i.titleSpacing,e.fillStyle=i.titleColor,e.font=a.string,n=0;n<r;++n)e.fillText(s[n],l.x(t.x),t.y+a.lineHeight/2),t.y+=a.lineHeight+o,n+1===r&&(t.y+=i.titleMarginBottom-o)}}_drawColorBox(t,e,i,s,r){const a=this.labelColors[i],o=this.labelPointStyles[i],{boxHeight:n,boxWidth:l}=r,c=Gs(r.bodyFont),h=al(this,"left",r),d=s.x(h),p=n<c.lineHeight?(c.lineHeight-n)/2:0,u=e.y+p;if(r.usePointStyle){const e={radius:Math.min(l,n)/2,pointStyle:o.pointStyle,rotation:o.rotation,borderWidth:1},i=s.leftForLtr(d,l)+l/2,c=u+n/2;t.strokeStyle=r.multiKeyBackground,t.fillStyle=r.multiKeyBackground,Ds(t,e,i,c),t.strokeStyle=a.borderColor,t.fillStyle=a.backgroundColor,Ds(t,e,i,c)}else{t.lineWidth=si(a.borderWidth)?Math.max(...Object.values(a.borderWidth)):a.borderWidth||1,t.strokeStyle=a.borderColor,t.setLineDash(a.borderDash||[]),t.lineDashOffset=a.borderDashOffset||0;const e=s.leftForLtr(d,l),i=s.leftForLtr(s.xPlus(d,1),l-2),o=Us(a.borderRadius);Object.values(o).some(t=>0!==t)?(t.beginPath(),t.fillStyle=r.multiKeyBackground,Os(t,{x:e,y:u,w:l,h:n,radius:o}),t.fill(),t.stroke(),t.fillStyle=a.backgroundColor,t.beginPath(),Os(t,{x:i,y:u+1,w:l-2,h:n-2,radius:o}),t.fill()):(t.fillStyle=r.multiKeyBackground,t.fillRect(e,u,l,n),t.strokeRect(e,u,l,n),t.fillStyle=a.backgroundColor,t.fillRect(i,u+1,l-2,n-2))}t.fillStyle=this.labelTextColors[i]}drawBody(t,e,i){const{body:s}=this,{bodySpacing:r,bodyAlign:a,displayColors:o,boxHeight:n,boxWidth:l,boxPadding:c}=i,h=Gs(i.bodyFont);let d=h.lineHeight,p=0;const u=Tr(i.rtl,this.x,this.width),g=function(i){e.fillText(i,u.x(t.x+p),t.y+d/2),t.y+=d+r},f=u.textAlign(a);let _,m,y,x,b,v,w;for(e.textAlign=a,e.textBaseline="middle",e.font=h.string,t.x=al(this,f,i),e.fillStyle=i.bodyColor,ci(this.beforeBody,g),p=o&&"right"!==f?"center"===a?l/2+c:l+2+c:0,x=0,v=s.length;x<v;++x){for(_=s[x],m=this.labelTextColors[x],e.fillStyle=m,ci(_.before,g),y=_.lines,o&&y.length&&(this._drawColorBox(e,t,x,u,i),d=Math.max(h.lineHeight,n)),b=0,w=y.length;b<w;++b)g(y[b]),d=h.lineHeight;ci(_.after,g)}p=0,d=h.lineHeight,ci(this.afterBody,g),t.y-=r}drawFooter(t,e,i){const s=this.footer,r=s.length;let a,o;if(r){const n=Tr(i.rtl,this.x,this.width);for(t.x=al(this,i.footerAlign,i),t.y+=i.footerMarginTop,e.textAlign=n.textAlign(i.footerAlign),e.textBaseline="middle",a=Gs(i.footerFont),e.fillStyle=i.footerColor,e.font=a.string,o=0;o<r;++o)e.fillText(s[o],n.x(t.x),t.y+a.lineHeight/2),t.y+=a.lineHeight+i.footerSpacing}}drawBackground(t,e,i,s){const{xAlign:r,yAlign:a}=this,{x:o,y:n}=t,{width:l,height:c}=i,{topLeft:h,topRight:d,bottomLeft:p,bottomRight:u}=Us(s.cornerRadius);e.fillStyle=s.backgroundColor,e.strokeStyle=s.borderColor,e.lineWidth=s.borderWidth,e.beginPath(),e.moveTo(o+h,n),"top"===a&&this.drawCaret(t,e,i,s),e.lineTo(o+l-d,n),e.quadraticCurveTo(o+l,n,o+l,n+d),"center"===a&&"right"===r&&this.drawCaret(t,e,i,s),e.lineTo(o+l,n+c-u),e.quadraticCurveTo(o+l,n+c,o+l-u,n+c),"bottom"===a&&this.drawCaret(t,e,i,s),e.lineTo(o+p,n+c),e.quadraticCurveTo(o,n+c,o,n+c-p),"center"===a&&"left"===r&&this.drawCaret(t,e,i,s),e.lineTo(o,n+h),e.quadraticCurveTo(o,n,o+h,n),e.closePath(),e.fill(),s.borderWidth>0&&e.stroke()}_updateAnimationTarget(t){const e=this.chart,i=this.$animations,s=i&&i.x,r=i&&i.y;if(s||r){const i=Zn[t.position].call(this,this._active,this._eventPosition);if(!i)return;const a=this._size=el(this,t),o=Object.assign({},i,this._size),n=sl(e,t,o),l=rl(t,o,n,e);s._to===l.x&&r._to===l.y||(this.xAlign=n.xAlign,this.yAlign=n.yAlign,this.width=a.width,this.height=a.height,this.caretX=i.x,this.caretY=i.y,this._resolveAnimations().update(this,l))}}_willRender(){return!!this.opacity}draw(t){const e=this.options.setContext(this.getContext());let i=this.opacity;if(!i)return;this._updateAnimationTarget(e);const s={width:this.width,height:this.height},r={x:this.x,y:this.y};i=Math.abs(i)<.001?0:i;const a=Ys(e.padding),o=this.title.length||this.beforeBody.length||this.body.length||this.afterBody.length||this.footer.length;e.enabled&&o&&(t.save(),t.globalAlpha=i,this.drawBackground(r,t,s,e),Fr(t,e.textDirection),r.y+=a.top,this.drawTitle(r,t,e),this.drawBody(r,t,e),this.drawFooter(r,t,e),Ar(t,e.textDirection),t.restore())}getActiveElements(){return this._active||[]}setActiveElements(t,e){const i=this._active,s=t.map(({datasetIndex:t,index:e})=>{const i=this.chart.getDatasetMeta(t);if(!i)throw new Error("Cannot find a dataset at index "+t);return{datasetIndex:t,element:i.data[e],index:e}}),r=!hi(i,s),a=this._positionChanged(s,e);(r||a)&&(this._active=s,this._eventPosition=e,this._ignoreReplayEvents=!0,this.update(!0))}handleEvent(t,e,i=!0){if(e&&this._ignoreReplayEvents)return!1;this._ignoreReplayEvents=!1;const s=this.options,r=this._active||[],a=this._getActiveElements(t,r,e,i),o=this._positionChanged(a,t),n=e||!hi(a,r)||o;return n&&(this._active=a,(s.enabled||s.external)&&(this._eventPosition={x:t.x,y:t.y},this.update(!0,e))),n}_getActiveElements(t,e,i,s){const r=this.options;if("mouseout"===t.type)return[];if(!s)return e.filter(t=>this.chart.data.datasets[t.datasetIndex]&&void 0!==this.chart.getDatasetMeta(t.datasetIndex).controller.getParsed(t.index));const a=this.chart.getElementsAtEventForMode(t,r.mode,r,i);return r.reverse&&a.reverse(),a}_positionChanged(t,e){const{caretX:i,caretY:s,options:r}=this,a=Zn[r.position].call(this,t,e);return!1!==a&&(i!==a.x||s!==a.y)}}var dl={id:"tooltip",_element:hl,positioners:Zn,afterInit(t,e,i){i&&(t.tooltip=new hl({chart:t,options:i}))},beforeUpdate(t,e,i){t.tooltip&&t.tooltip.initialize(i)},reset(t,e,i){t.tooltip&&t.tooltip.initialize(i)},afterDraw(t){const e=t.tooltip;if(e&&e._willRender()){const i={tooltip:e};if(!1===t.notifyPlugins("beforeTooltipDraw",{...i,cancelable:!0}))return;e.draw(t.ctx),t.notifyPlugins("afterTooltipDraw",i)}},afterEvent(t,e){if(t.tooltip){const i=e.replay;t.tooltip.handleEvent(e.event,i,e.inChartArea)&&(e.changed=!0)}},defaults:{enabled:!0,external:null,position:"average",backgroundColor:"rgba(0,0,0,0.8)",titleColor:"#fff",titleFont:{weight:"bold"},titleSpacing:2,titleMarginBottom:6,titleAlign:"left",bodyColor:"#fff",bodySpacing:2,bodyFont:{},bodyAlign:"left",footerColor:"#fff",footerSpacing:2,footerMarginTop:6,footerFont:{weight:"bold"},footerAlign:"left",padding:6,caretPadding:2,caretSize:5,cornerRadius:6,boxHeight:(t,e)=>e.bodyFont.size,boxWidth:(t,e)=>e.bodyFont.size,multiKeyBackground:"#fff",displayColors:!0,boxPadding:0,borderColor:"rgba(0,0,0,0)",borderWidth:0,animation:{duration:400,easing:"easeOutQuart"},animations:{numbers:{type:"number",properties:["x","y","width","height","caretX","caretY"]},opacity:{easing:"linear",duration:200}},callbacks:ll},defaultRoutes:{bodyFont:"font",footerFont:"font",titleFont:"font"},descriptors:{_scriptable:t=>"filter"!==t&&"itemSort"!==t&&"external"!==t,_indexable:!1,callbacks:{_scriptable:!1,_indexable:!1},animation:{_fallback:!1},animations:{_fallback:"animation"}},additionalOptionScopes:["interaction"]},pl=Object.freeze({__proto__:null,Colors:wn,Decimation:Mn,Filler:Wn,Legend:Yn,SubTitle:Xn,Title:qn,Tooltip:dl});function ul(t,e,i,s){const r=t.indexOf(e);if(-1===r)return((t,e,i,s)=>("string"==typeof e?(i=t.push(e)-1,s.unshift({index:i,label:e})):isNaN(e)&&(i=null),i))(t,e,i,s);return r!==t.lastIndexOf(e)?i:r}function gl(t){const e=this.getLabels();return t>=0&&t<e.length?e[t]:t}function fl(t,e){const i=[],{bounds:s,step:r,min:a,max:o,precision:n,count:l,maxTicks:c,maxDigits:h,includeBounds:d}=t,p=r||1,u=c-1,{min:g,max:f}=e,_=!ei(a),m=!ei(o),y=!ei(l),x=(f-g)/(h+1);let b,v,w,$,k=Ai((f-g)/u/p)*p;if(k<1e-14&&!_&&!m)return[{value:g},{value:f}];$=Math.ceil(f/k)-Math.floor(g/k),$>u&&(k=Ai($*k/u/p)*p),ei(n)||(b=Math.pow(10,n),k=Math.ceil(k*b)/b),"ticks"===s?(v=Math.floor(g/k)*k,w=Math.ceil(f/k)*k):(v=g,w=f),_&&m&&r&&function(t,e){const i=Math.round(t);return i-e<=t&&i+e>=t}((o-a)/r,k/1e3)?($=Math.round(Math.min((o-a)/k,c)),k=(o-a)/$,v=a,w=o):y?(v=_?a:v,w=m?o:w,$=l-1,k=(w-v)/$):($=(w-v)/k,$=Fi($,Math.round($),k/1e3)?Math.round($):Math.ceil($));const M=Math.max(Ni(k),Ni(v));b=Math.pow(10,ei(n)?M:n),v=Math.round(v*b)/b,w=Math.round(w*b)/b;let S=0;for(_&&(d&&v!==a?(i.push({value:a}),v<a&&S++,Fi(Math.round((v+S*k)*b)/b,a,_l(a,x,t))&&S++):v<a&&S++);S<$;++S){const t=Math.round((v+S*k)*b)/b;if(m&&t>o)break;i.push({value:t})}return m&&d&&w!==o?i.length&&Fi(i[i.length-1].value,o,_l(o,x,t))?i[i.length-1].value=o:i.push({value:o}):m&&w!==o||i.push({value:w}),i}function _l(t,e,{horizontal:i,minRotation:s}){const r=Ii(s),a=(i?Math.sin(r):Math.cos(r))||.001,o=.75*e*(""+t).length;return Math.min(e/a,o)}class ml extends go{constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._endValue=void 0,this._valueRange=0}parse(t,e){return ei(t)||("number"==typeof t||t instanceof Number)&&!isFinite(+t)?null:+t}handleTickRangeOptions(){const{beginAtZero:t}=this.options,{minDefined:e,maxDefined:i}=this.getUserBounds();let{min:s,max:r}=this;const a=t=>s=e?s:t,o=t=>r=i?r:t;if(t){const t=Ti(s),e=Ti(r);t<0&&e<0?o(0):t>0&&e>0&&a(0)}if(s===r){let e=0===r?1:Math.abs(.05*r);o(r+e),t||a(s-e)}this.min=s,this.max=r}getTickLimit(){const t=this.options.ticks;let e,{maxTicksLimit:i,stepSize:s}=t;return s?(e=Math.ceil(this.max/s)-Math.floor(this.min/s)+1,e>1e3&&(console.warn(`scales.${this.id}.ticks.stepSize: ${s} would result generating up to ${e} ticks. Limiting to 1000.`),e=1e3)):(e=this.computeTickLimit(),i=i||11),i&&(e=Math.min(i,e)),e}computeTickLimit(){return Number.POSITIVE_INFINITY}buildTicks(){const t=this.options,e=t.ticks;let i=this.getTickLimit();i=Math.max(2,i);const s=fl({maxTicks:i,bounds:t.bounds,min:t.min,max:t.max,precision:e.precision,step:e.stepSize,count:e.count,maxDigits:this._maxDigits(),horizontal:this.isHorizontal(),minRotation:e.minRotation||0,includeBounds:!1!==e.includeBounds},this._range||this);return"ticks"===t.bounds&&Li(s,this,"value"),t.reverse?(s.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),s}configure(){const t=this.ticks;let e=this.min,i=this.max;if(super.configure(),this.options.offset&&t.length){const s=(i-e)/Math.max(t.length-1,1)/2;e-=s,i+=s}this._startValue=e,this._endValue=i,this._valueRange=i-e}getLabelForValue(t){return fs(t,this.chart.options.locale,this.options.ticks.format)}}class yl extends ml{static id="linear";static defaults={ticks:{callback:ms.formatters.numeric}};determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=ri(t)?t:0,this.max=ri(e)?e:1,this.handleTickRangeOptions()}computeTickLimit(){const t=this.isHorizontal(),e=t?this.width:this.height,i=Ii(this.options.ticks.minRotation),s=(t?Math.sin(i):Math.cos(i))||.001,r=this._resolveTickFontOptions(0);return Math.ceil(e/Math.min(40,r.lineHeight/s))}getPixelForValue(t){return null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getValueForPixel(t){return this._startValue+this.getDecimalForPixel(t)*this._valueRange}}const xl=t=>Math.floor(Pi(t)),bl=(t,e)=>Math.pow(10,xl(t)+e);function vl(t){return 1===t/Math.pow(10,xl(t))}function wl(t,e,i){const s=Math.pow(10,i),r=Math.floor(t/s);return Math.ceil(e/s)-r}function $l(t,{min:e,max:i}){e=ai(t.min,e);const s=[],r=xl(e);let a=function(t,e){let i=xl(e-t);for(;wl(t,e,i)>10;)i++;for(;wl(t,e,i)<10;)i--;return Math.min(i,xl(t))}(e,i),o=a<0?Math.pow(10,Math.abs(a)):1;const n=Math.pow(10,a),l=r>a?Math.pow(10,r):0,c=Math.round((e-l)*o)/o,h=Math.floor((e-l)/n/10)*n*10;let d=Math.floor((c-h)/Math.pow(10,a)),p=ai(t.min,Math.round((l+h+d*Math.pow(10,a))*o)/o);for(;p<i;)s.push({value:p,major:vl(p),significand:d}),d>=10?d=d<15?15:20:d++,d>=20&&(a++,d=2,o=a>=0?1:o),p=Math.round((l+h+d*Math.pow(10,a))*o)/o;const u=ai(t.max,p);return s.push({value:u,major:vl(u),significand:d}),s}class kl extends go{static id="logarithmic";static defaults={ticks:{callback:ms.formatters.logarithmic,major:{enabled:!0}}};constructor(t){super(t),this.start=void 0,this.end=void 0,this._startValue=void 0,this._valueRange=0}parse(t,e){const i=ml.prototype.parse.apply(this,[t,e]);if(0!==i)return ri(i)&&i>0?i:null;this._zero=!0}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!0);this.min=ri(t)?Math.max(0,t):null,this.max=ri(e)?Math.max(0,e):null,this.options.beginAtZero&&(this._zero=!0),this._zero&&this.min!==this._suggestedMin&&!ri(this._userMin)&&(this.min=t===bl(this.min,0)?bl(this.min,-1):bl(this.min,0)),this.handleTickRangeOptions()}handleTickRangeOptions(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let i=this.min,s=this.max;const r=e=>i=t?i:e,a=t=>s=e?s:t;i===s&&(i<=0?(r(1),a(10)):(r(bl(i,-1)),a(bl(s,1)))),i<=0&&r(bl(s,-1)),s<=0&&a(bl(i,1)),this.min=i,this.max=s}buildTicks(){const t=this.options,e=$l({min:this._userMin,max:this._userMax},this);return"ticks"===t.bounds&&Li(e,this,"value"),t.reverse?(e.reverse(),this.start=this.max,this.end=this.min):(this.start=this.min,this.end=this.max),e}getLabelForValue(t){return void 0===t?"0":fs(t,this.chart.options.locale,this.options.ticks.format)}configure(){const t=this.min;super.configure(),this._startValue=Pi(t),this._valueRange=Pi(this.max)-Pi(t)}getPixelForValue(t){return void 0!==t&&0!==t||(t=this.min),null===t||isNaN(t)?NaN:this.getPixelForDecimal(t===this.min?0:(Pi(t)-this._startValue)/this._valueRange)}getValueForPixel(t){const e=this.getDecimalForPixel(t);return Math.pow(10,this._startValue+e*this._valueRange)}}function Ml(t){const e=t.ticks;if(e.display&&t.display){const t=Ys(e.backdropPadding);return oi(e.font&&e.font.size,$s.font.size)+t.height}return 0}function Sl(t,e,i){return i=ii(i)?i:[i],{w:Ms(t,e.string,i),h:i.length*e.lineHeight}}function Cl(t,e,i,s,r){return t===s||t===r?{start:e-i/2,end:e+i/2}:t<s||t>r?{start:e-i,end:e}:{start:e,end:e+i}}function Dl(t){const e={l:t.left+t._padding.left,r:t.right-t._padding.right,t:t.top+t._padding.top,b:t.bottom-t._padding.bottom},i=Object.assign({},e),s=[],r=[],a=t._pointLabels.length,o=t.options.pointLabels,n=o.centerPointLabels?$i/a:0;for(let l=0;l<a;l++){const a=o.setContext(t.getPointLabelContext(l));r[l]=a.padding;const c=t.getPointPosition(l,t.drawingArea+r[l],n),h=Gs(a.font),d=Sl(t.ctx,h,t._pointLabels[l]);s[l]=d;const p=ji(t.getIndexAngle(l)+n),u=Math.round(Oi(p));zl(i,e,p,Cl(u,c.x,d.w,0,180),Cl(u,c.y,d.h,90,270))}t.setCenterPoint(e.l-i.l,i.r-e.r,e.t-i.t,i.b-e.b),t._pointLabelItems=function(t,e,i){const s=[],r=t._pointLabels.length,a=t.options,{centerPointLabels:o,display:n}=a.pointLabels,l={extra:Ml(a)/2,additionalAngle:o?$i/r:0};let c;for(let a=0;a<r;a++){l.padding=i[a],l.size=e[a];const r=El(t,a,l);s.push(r),"auto"===n&&(r.visible=Pl(r,c),r.visible&&(c=r))}return s}(t,s,r)}function zl(t,e,i,s,r){const a=Math.abs(Math.sin(i)),o=Math.abs(Math.cos(i));let n=0,l=0;s.start<e.l?(n=(e.l-s.start)/a,t.l=Math.min(t.l,e.l-n)):s.end>e.r&&(n=(s.end-e.r)/a,t.r=Math.max(t.r,e.r+n)),r.start<e.t?(l=(e.t-r.start)/o,t.t=Math.min(t.t,e.t-l)):r.end>e.b&&(l=(r.end-e.b)/o,t.b=Math.max(t.b,e.b+l))}function El(t,e,i){const s=t.drawingArea,{extra:r,additionalAngle:a,padding:o,size:n}=i,l=t.getPointPosition(e,s+r+o,a),c=Math.round(Oi(ji(l.angle+Di))),h=function(t,e,i){90===i||270===i?t-=e/2:(i>270||i<90)&&(t-=e);return t}(l.y,n.h,c),d=function(t){if(0===t||180===t)return"center";if(t<180)return"left";return"right"}(c),p=function(t,e,i){"right"===i?t-=e:"center"===i&&(t-=e/2);return t}(l.x,n.w,d);return{visible:!0,x:l.x,y:h,textAlign:d,left:p,top:h,right:p+n.w,bottom:h+n.h}}function Pl(t,e){if(!e)return!0;const{left:i,top:s,right:r,bottom:a}=t;return!(Es({x:i,y:s},e)||Es({x:i,y:a},e)||Es({x:r,y:s},e)||Es({x:r,y:a},e))}function Tl(t,e,i){const{left:s,top:r,right:a,bottom:o}=i,{backdropColor:n}=e;if(!ei(n)){const i=Us(e.borderRadius),l=Ys(e.backdropPadding);t.fillStyle=n;const c=s-l.left,h=r-l.top,d=a-s+l.width,p=o-r+l.height;Object.values(i).some(t=>0!==t)?(t.beginPath(),Os(t,{x:c,y:h,w:d,h:p,radius:i}),t.fill()):t.fillRect(c,h,d,p)}}function Fl(t,e,i,s){const{ctx:r}=t;if(i)r.arc(t.xCenter,t.yCenter,e,0,ki);else{let i=t.getPointPosition(0,e);r.moveTo(i.x,i.y);for(let a=1;a<s;a++)i=t.getPointPosition(a,e),r.lineTo(i.x,i.y)}}class Al extends ml{static id="radialLinear";static defaults={display:!0,animate:!0,position:"chartArea",angleLines:{display:!0,lineWidth:1,borderDash:[],borderDashOffset:0},grid:{circular:!1},startAngle:0,ticks:{showLabelBackdrop:!0,callback:ms.formatters.numeric},pointLabels:{backdropColor:void 0,backdropPadding:2,display:!0,font:{size:10},callback:t=>t,padding:5,centerPointLabels:!1}};static defaultRoutes={"angleLines.color":"borderColor","pointLabels.color":"color","ticks.color":"color"};static descriptors={angleLines:{_fallback:"grid"}};constructor(t){super(t),this.xCenter=void 0,this.yCenter=void 0,this.drawingArea=void 0,this._pointLabels=[],this._pointLabelItems=[]}setDimensions(){const t=this._padding=Ys(Ml(this.options)/2),e=this.width=this.maxWidth-t.width,i=this.height=this.maxHeight-t.height;this.xCenter=Math.floor(this.left+e/2+t.left),this.yCenter=Math.floor(this.top+i/2+t.top),this.drawingArea=Math.floor(Math.min(e,i)/2)}determineDataLimits(){const{min:t,max:e}=this.getMinMax(!1);this.min=ri(t)&&!isNaN(t)?t:0,this.max=ri(e)&&!isNaN(e)?e:0,this.handleTickRangeOptions()}computeTickLimit(){return Math.ceil(this.drawingArea/Ml(this.options))}generateTickLabels(t){ml.prototype.generateTickLabels.call(this,t),this._pointLabels=this.getLabels().map((t,e)=>{const i=li(this.options.pointLabels.callback,[t,e],this);return i||0===i?i:""}).filter((t,e)=>this.chart.getDataVisibility(e))}fit(){const t=this.options;t.display&&t.pointLabels.display?Dl(this):this.setCenterPoint(0,0,0,0)}setCenterPoint(t,e,i,s){this.xCenter+=Math.floor((t-e)/2),this.yCenter+=Math.floor((i-s)/2),this.drawingArea-=Math.min(this.drawingArea/2,Math.max(t,e,i,s))}getIndexAngle(t){return ji(t*(ki/(this._pointLabels.length||1))+Ii(this.options.startAngle||0))}getDistanceFromCenterForValue(t){if(ei(t))return NaN;const e=this.drawingArea/(this.max-this.min);return this.options.reverse?(this.max-t)*e:(t-this.min)*e}getValueForDistanceFromCenter(t){if(ei(t))return NaN;const e=t/(this.drawingArea/(this.max-this.min));return this.options.reverse?this.max-e:this.min+e}getPointLabelContext(t){const e=this._pointLabels||[];if(t>=0&&t<e.length){const i=e[t];return function(t,e,i){return Ks(t,{label:i,index:e,type:"pointLabel"})}(this.getContext(),t,i)}}getPointPosition(t,e,i=0){const s=this.getIndexAngle(t)-Di+i;return{x:Math.cos(s)*e+this.xCenter,y:Math.sin(s)*e+this.yCenter,angle:s}}getPointPositionForValue(t,e){return this.getPointPosition(t,this.getDistanceFromCenterForValue(e))}getBasePosition(t){return this.getPointPositionForValue(t||0,this.getBaseValue())}getPointLabelPosition(t){const{left:e,top:i,right:s,bottom:r}=this._pointLabelItems[t];return{left:e,top:i,right:s,bottom:r}}drawBackground(){const{backgroundColor:t,grid:{circular:e}}=this.options;if(t){const i=this.ctx;i.save(),i.beginPath(),Fl(this,this.getDistanceFromCenterForValue(this._endValue),e,this._pointLabels.length),i.closePath(),i.fillStyle=t,i.fill(),i.restore()}}drawGrid(){const t=this.ctx,e=this.options,{angleLines:i,grid:s,border:r}=e,a=this._pointLabels.length;let o,n,l;if(e.pointLabels.display&&function(t,e){const{ctx:i,options:{pointLabels:s}}=t;for(let r=e-1;r>=0;r--){const e=t._pointLabelItems[r];if(!e.visible)continue;const a=s.setContext(t.getPointLabelContext(r));Tl(i,a,e);const o=Gs(a.font),{x:n,y:l,textAlign:c}=e;Is(i,t._pointLabels[r],n,l+o.lineHeight/2,o,{color:a.color,textAlign:c,textBaseline:"middle"})}}(this,a),s.display&&this.ticks.forEach((t,e)=>{if(0!==e||0===e&&this.min<0){n=this.getDistanceFromCenterForValue(t.value);const i=this.getContext(e),o=s.setContext(i),l=r.setContext(i);!function(t,e,i,s,r){const a=t.ctx,o=e.circular,{color:n,lineWidth:l}=e;!o&&!s||!n||!l||i<0||(a.save(),a.strokeStyle=n,a.lineWidth=l,a.setLineDash(r.dash||[]),a.lineDashOffset=r.dashOffset,a.beginPath(),Fl(t,i,o,s),a.closePath(),a.stroke(),a.restore())}(this,o,n,a,l)}}),i.display){for(t.save(),o=a-1;o>=0;o--){const s=i.setContext(this.getPointLabelContext(o)),{color:r,lineWidth:a}=s;a&&r&&(t.lineWidth=a,t.strokeStyle=r,t.setLineDash(s.borderDash),t.lineDashOffset=s.borderDashOffset,n=this.getDistanceFromCenterForValue(e.reverse?this.min:this.max),l=this.getPointPosition(o,n),t.beginPath(),t.moveTo(this.xCenter,this.yCenter),t.lineTo(l.x,l.y),t.stroke())}t.restore()}}drawBorder(){}drawLabels(){const t=this.ctx,e=this.options,i=e.ticks;if(!i.display)return;const s=this.getIndexAngle(0);let r,a;t.save(),t.translate(this.xCenter,this.yCenter),t.rotate(s),t.textAlign="center",t.textBaseline="middle",this.ticks.forEach((s,o)=>{if(0===o&&this.min>=0&&!e.reverse)return;const n=i.setContext(this.getContext(o)),l=Gs(n.font);if(r=this.getDistanceFromCenterForValue(this.ticks[o].value),n.showLabelBackdrop){t.font=l.string,a=t.measureText(s.label).width,t.fillStyle=n.backdropColor;const e=Ys(n.backdropPadding);t.fillRect(-a/2-e.left,-r-l.size/2-e.top,a+e.width,l.size+e.height)}Is(t,s.label,0,-r,l,{color:n.color,strokeColor:n.textStrokeColor,strokeWidth:n.textStrokeWidth})}),t.restore()}drawTitle(){}}const Rl={millisecond:{common:!0,size:1,steps:1e3},second:{common:!0,size:1e3,steps:60},minute:{common:!0,size:6e4,steps:60},hour:{common:!0,size:36e5,steps:24},day:{common:!0,size:864e5,steps:30},week:{common:!1,size:6048e5,steps:4},month:{common:!0,size:2628e6,steps:12},quarter:{common:!1,size:7884e6,steps:4},year:{common:!0,size:3154e7}},Ll=Object.keys(Rl);function Il(t,e){return t-e}function Ol(t,e){if(ei(e))return null;const i=t._adapter,{parser:s,round:r,isoWeekday:a}=t._parseOpts;let o=e;return"function"==typeof s&&(o=s(o)),ri(o)||(o="string"==typeof s?i.parse(o,s):i.parse(o)),null===o?null:(r&&(o="week"!==r||!Ri(a)&&!0!==a?i.startOf(o,r):i.startOf(o,"isoWeek",a)),+o)}function Nl(t,e,i,s){const r=Ll.length;for(let a=Ll.indexOf(t);a<r-1;++a){const t=Rl[Ll[a]],r=t.steps?t.steps:Number.MAX_SAFE_INTEGER;if(t.common&&Math.ceil((i-e)/(r*t.size))<=s)return Ll[a]}return Ll[r-1]}function Hl(t,e,i){if(i){if(i.length){const{lo:s,hi:r}=Gi(i,e);t[i[s]>=e?i[s]:i[r]]=!0}}else t[e]=!0}function Bl(t,e,i){const s=[],r={},a=e.length;let o,n;for(o=0;o<a;++o)n=e[o],r[n]=o,s.push({value:n,major:!1});return 0!==a&&i?function(t,e,i,s){const r=t._adapter,a=+r.startOf(e[0].value,s),o=e[e.length-1].value;let n,l;for(n=a;n<=o;n=+r.add(n,1,s))l=i[n],l>=0&&(e[l].major=!0);return e}(t,s,r,i):s}class Wl extends go{static id="time";static defaults={bounds:"data",adapters:{},time:{parser:!1,unit:!1,round:!1,isoWeekday:!1,minUnit:"millisecond",displayFormats:{}},ticks:{source:"auto",callback:!1,major:{enabled:!1}}};constructor(t){super(t),this._cache={data:[],labels:[],all:[]},this._unit="day",this._majorUnit=void 0,this._offsets={},this._normalized=!1,this._parseOpts=void 0}init(t,e={}){const i=t.time||(t.time={}),s=this._adapter=new xa._date(t.adapters.date);s.init(e),fi(i.displayFormats,s.formats()),this._parseOpts={parser:i.parser,round:i.round,isoWeekday:i.isoWeekday},super.init(t),this._normalized=e.normalized}parse(t,e){return void 0===t?null:Ol(this,t)}beforeLayout(){super.beforeLayout(),this._cache={data:[],labels:[],all:[]}}determineDataLimits(){const t=this.options,e=this._adapter,i=t.time.unit||"day";let{min:s,max:r,minDefined:a,maxDefined:o}=this.getUserBounds();function n(t){a||isNaN(t.min)||(s=Math.min(s,t.min)),o||isNaN(t.max)||(r=Math.max(r,t.max))}a&&o||(n(this._getLabelBounds()),"ticks"===t.bounds&&"labels"===t.ticks.source||n(this.getMinMax(!1))),s=ri(s)&&!isNaN(s)?s:+e.startOf(Date.now(),i),r=ri(r)&&!isNaN(r)?r:+e.endOf(Date.now(),i)+1,this.min=Math.min(s,r-1),this.max=Math.max(s+1,r)}_getLabelBounds(){const t=this.getLabelTimestamps();let e=Number.POSITIVE_INFINITY,i=Number.NEGATIVE_INFINITY;return t.length&&(e=t[0],i=t[t.length-1]),{min:e,max:i}}buildTicks(){const t=this.options,e=t.time,i=t.ticks,s="labels"===i.source?this.getLabelTimestamps():this._generate();"ticks"===t.bounds&&s.length&&(this.min=this._userMin||s[0],this.max=this._userMax||s[s.length-1]);const r=this.min,a=function(t,e,i){let s=0,r=t.length;for(;s<r&&t[s]<e;)s++;for(;r>s&&t[r-1]>i;)r--;return s>0||r<t.length?t.slice(s,r):t}(s,r,this.max);return this._unit=e.unit||(i.autoSkip?Nl(e.minUnit,this.min,this.max,this._getLabelCapacity(r)):function(t,e,i,s,r){for(let a=Ll.length-1;a>=Ll.indexOf(i);a--){const i=Ll[a];if(Rl[i].common&&t._adapter.diff(r,s,i)>=e-1)return i}return Ll[i?Ll.indexOf(i):0]}(this,a.length,e.minUnit,this.min,this.max)),this._majorUnit=i.major.enabled&&"year"!==this._unit?function(t){for(let e=Ll.indexOf(t)+1,i=Ll.length;e<i;++e)if(Rl[Ll[e]].common)return Ll[e]}(this._unit):void 0,this.initOffsets(s),t.reverse&&a.reverse(),Bl(this,a,this._majorUnit)}afterAutoSkip(){this.options.offsetAfterAutoskip&&this.initOffsets(this.ticks.map(t=>+t.value))}initOffsets(t=[]){let e,i,s=0,r=0;this.options.offset&&t.length&&(e=this.getDecimalForValue(t[0]),s=1===t.length?1-e:(this.getDecimalForValue(t[1])-e)/2,i=this.getDecimalForValue(t[t.length-1]),r=1===t.length?i:(i-this.getDecimalForValue(t[t.length-2]))/2);const a=t.length<3?.5:.25;s=Ui(s,0,a),r=Ui(r,0,a),this._offsets={start:s,end:r,factor:1/(s+1+r)}}_generate(){const t=this._adapter,e=this.min,i=this.max,s=this.options,r=s.time,a=r.unit||Nl(r.minUnit,e,i,this._getLabelCapacity(e)),o=oi(s.ticks.stepSize,1),n="week"===a&&r.isoWeekday,l=Ri(n)||!0===n,c={};let h,d,p=e;if(l&&(p=+t.startOf(p,"isoWeek",n)),p=+t.startOf(p,l?"day":a),t.diff(i,e,a)>1e5*o)throw new Error(e+" and "+i+" are too far apart with stepSize of "+o+" "+a);const u="data"===s.ticks.source&&this.getDataTimestamps();for(h=p,d=0;h<i;h=+t.add(h,o,a),d++)Hl(c,h,u);return h!==i&&"ticks"!==s.bounds&&1!==d||Hl(c,h,u),Object.keys(c).sort(Il).map(t=>+t)}getLabelForValue(t){const e=this._adapter,i=this.options.time;return i.tooltipFormat?e.format(t,i.tooltipFormat):e.format(t,i.displayFormats.datetime)}format(t,e){const i=this.options.time.displayFormats,s=this._unit,r=e||i[s];return this._adapter.format(t,r)}_tickFormatFunction(t,e,i,s){const r=this.options,a=r.ticks.callback;if(a)return li(a,[t,e,i],this);const o=r.time.displayFormats,n=this._unit,l=this._majorUnit,c=n&&o[n],h=l&&o[l],d=i[e],p=l&&h&&d&&d.major;return this._adapter.format(t,s||(p?h:c))}generateTickLabels(t){let e,i,s;for(e=0,i=t.length;e<i;++e)s=t[e],s.label=this._tickFormatFunction(s.value,e,t)}getDecimalForValue(t){return null===t?NaN:(t-this.min)/(this.max-this.min)}getPixelForValue(t){const e=this._offsets,i=this.getDecimalForValue(t);return this.getPixelForDecimal((e.start+i)*e.factor)}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return this.min+i*(this.max-this.min)}_getLabelSize(t){const e=this.options.ticks,i=this.ctx.measureText(t).width,s=Ii(this.isHorizontal()?e.maxRotation:e.minRotation),r=Math.cos(s),a=Math.sin(s),o=this._resolveTickFontOptions(0).size;return{w:i*r+o*a,h:i*a+o*r}}_getLabelCapacity(t){const e=this.options.time,i=e.displayFormats,s=i[e.unit]||i.millisecond,r=this._tickFormatFunction(t,0,Bl(this,[t],this._majorUnit),s),a=this._getLabelSize(r),o=Math.floor(this.isHorizontal()?this.width/a.w:this.height/a.h)-1;return o>0?o:1}getDataTimestamps(){let t,e,i=this._cache.data||[];if(i.length)return i;const s=this.getMatchingVisibleMetas();if(this._normalized&&s.length)return this._cache.data=s[0].controller.getAllParsedValues(this);for(t=0,e=s.length;t<e;++t)i=i.concat(s[t].controller.getAllParsedValues(this));return this._cache.data=this.normalize(i)}getLabelTimestamps(){const t=this._cache.labels||[];let e,i;if(t.length)return t;const s=this.getLabels();for(e=0,i=s.length;e<i;++e)t.push(Ol(this,s[e]));return this._cache.labels=this._normalized?t:this.normalize(t)}normalize(t){return Qi(t.sort(Il))}}function jl(t,e,i){let s,r,a,o,n=0,l=t.length-1;i?(e>=t[n].pos&&e<=t[l].pos&&({lo:n,hi:l}=qi(t,"pos",e)),({pos:s,time:a}=t[n]),({pos:r,time:o}=t[l])):(e>=t[n].time&&e<=t[l].time&&({lo:n,hi:l}=qi(t,"time",e)),({time:s,pos:a}=t[n]),({time:r,pos:o}=t[l]));const c=r-s;return c?a+(o-a)*(e-s)/c:a}var Vl=Object.freeze({__proto__:null,CategoryScale:class extends go{static id="category";static defaults={ticks:{callback:gl}};constructor(t){super(t),this._startValue=void 0,this._valueRange=0,this._addedLabels=[]}init(t){const e=this._addedLabels;if(e.length){const t=this.getLabels();for(const{index:i,label:s}of e)t[i]===s&&t.splice(i,1);this._addedLabels=[]}super.init(t)}parse(t,e){if(ei(t))return null;const i=this.getLabels();return((t,e)=>null===t?null:Ui(Math.round(t),0,e))(e=isFinite(e)&&i[e]===t?e:ul(i,t,oi(e,t),this._addedLabels),i.length-1)}determineDataLimits(){const{minDefined:t,maxDefined:e}=this.getUserBounds();let{min:i,max:s}=this.getMinMax(!0);"ticks"===this.options.bounds&&(t||(i=0),e||(s=this.getLabels().length-1)),this.min=i,this.max=s}buildTicks(){const t=this.min,e=this.max,i=this.options.offset,s=[];let r=this.getLabels();r=0===t&&e===r.length-1?r:r.slice(t,e+1),this._valueRange=Math.max(r.length-(i?0:1),1),this._startValue=this.min-(i?.5:0);for(let i=t;i<=e;i++)s.push({value:i});return s}getLabelForValue(t){return gl.call(this,t)}configure(){super.configure(),this.isHorizontal()||(this._reversePixels=!this._reversePixels)}getPixelForValue(t){return"number"!=typeof t&&(t=this.parse(t)),null===t?NaN:this.getPixelForDecimal((t-this._startValue)/this._valueRange)}getPixelForTick(t){const e=this.ticks;return t<0||t>e.length-1?null:this.getPixelForValue(e[t].value)}getValueForPixel(t){return Math.round(this._startValue+this.getDecimalForPixel(t)*this._valueRange)}getBasePixel(){return this.bottom}},LinearScale:yl,LogarithmicScale:kl,RadialLinearScale:Al,TimeScale:Wl,TimeSeriesScale:class extends Wl{static id="timeseries";static defaults=Wl.defaults;constructor(t){super(t),this._table=[],this._minPos=void 0,this._tableRange=void 0}initOffsets(){const t=this._getTimestampsForTable(),e=this._table=this.buildLookupTable(t);this._minPos=jl(e,this.min),this._tableRange=jl(e,this.max)-this._minPos,super.initOffsets(t)}buildLookupTable(t){const{min:e,max:i}=this,s=[],r=[];let a,o,n,l,c;for(a=0,o=t.length;a<o;++a)l=t[a],l>=e&&l<=i&&s.push(l);if(s.length<2)return[{time:e,pos:0},{time:i,pos:1}];for(a=0,o=s.length;a<o;++a)c=s[a+1],n=s[a-1],l=s[a],Math.round((c+n)/2)!==l&&r.push({time:l,pos:a/(o-1)});return r}_generate(){const t=this.min,e=this.max;let i=super.getDataTimestamps();return i.includes(t)&&i.length||i.splice(0,0,t),i.includes(e)&&1!==i.length||i.push(e),i.sort((t,e)=>t-e)}_getTimestampsForTable(){let t=this._cache.all||[];if(t.length)return t;const e=this.getDataTimestamps(),i=this.getLabelTimestamps();return t=e.length&&i.length?this.normalize(e.concat(i)):e.length?e:i,t=this._cache.all=t,t}getDecimalForValue(t){return(jl(this._table,t)-this._minPos)/this._tableRange}getValueForPixel(t){const e=this._offsets,i=this.getDecimalForPixel(t)/e.factor-e.end;return jl(this._table,i*this._tableRange+this._minPos,!0)}}});const Ul=[_a,fn,pl,Vl];function Yl(t){const e=Object.prototype.toString.call(t);return t instanceof Date||"object"==typeof t&&"[object Date]"===e?new t.constructor(+t):"number"==typeof t||"[object Number]"===e||"string"==typeof t||"[object String]"===e?new Date(t):new Date(NaN)}function Gl(t,e){return t instanceof Date?new t.constructor(e):new Date(e)}function ql(t,e){const i=Yl(t);return isNaN(e)?Gl(t,NaN):e?(i.setDate(i.getDate()+e),i):i}function Kl(t,e){const i=Yl(t);if(isNaN(e))return Gl(t,NaN);if(!e)return i;const s=i.getDate(),r=Gl(t,i.getTime());r.setMonth(i.getMonth()+e+1,0);return s>=r.getDate()?r:(i.setFullYear(r.getFullYear(),r.getMonth(),s),i)}function Xl(t,e){return Gl(t,+Yl(t)+e)}const Zl=6048e5,Ql=6e4,Jl=36e5;let tc={};function ec(){return tc}function ic(t,e){const i=ec(),s=e?.weekStartsOn??e?.locale?.options?.weekStartsOn??i.weekStartsOn??i.locale?.options?.weekStartsOn??0,r=Yl(t),a=r.getDay(),o=(a<s?7:0)+a-s;return r.setDate(r.getDate()-o),r.setHours(0,0,0,0),r}function sc(t){return ic(t,{weekStartsOn:1})}function rc(t){const e=Yl(t),i=e.getFullYear(),s=Gl(t,0);s.setFullYear(i+1,0,4),s.setHours(0,0,0,0);const r=sc(s),a=Gl(t,0);a.setFullYear(i,0,4),a.setHours(0,0,0,0);const o=sc(a);return e.getTime()>=r.getTime()?i+1:e.getTime()>=o.getTime()?i:i-1}function ac(t){const e=Yl(t);return e.setHours(0,0,0,0),e}function oc(t){const e=Yl(t),i=new Date(Date.UTC(e.getFullYear(),e.getMonth(),e.getDate(),e.getHours(),e.getMinutes(),e.getSeconds(),e.getMilliseconds()));return i.setUTCFullYear(e.getFullYear()),+t-+i}function nc(t,e){const i=ac(t),s=ac(e),r=+i-oc(i),a=+s-oc(s);return Math.round((r-a)/864e5)}function lc(t,e){const i=Yl(t),s=Yl(e),r=i.getTime()-s.getTime();return r<0?-1:r>0?1:r}function cc(t){if(!(e=t,e instanceof Date||"object"==typeof e&&"[object Date]"===Object.prototype.toString.call(e)||"number"==typeof t))return!1;var e;const i=Yl(t);return!isNaN(Number(i))}function hc(t,e){const i=Yl(t),s=Yl(e),r=dc(i,s),a=Math.abs(nc(i,s));i.setDate(i.getDate()-r*a);const o=r*(a-Number(dc(i,s)===-r));return 0===o?0:o}function dc(t,e){const i=t.getFullYear()-e.getFullYear()||t.getMonth()-e.getMonth()||t.getDate()-e.getDate()||t.getHours()-e.getHours()||t.getMinutes()-e.getMinutes()||t.getSeconds()-e.getSeconds()||t.getMilliseconds()-e.getMilliseconds();return i<0?-1:i>0?1:i}function pc(t){return e=>{const i=(t?Math[t]:Math.trunc)(e);return 0===i?0:i}}function uc(t,e){return+Yl(t)-+Yl(e)}function gc(t){const e=Yl(t);return e.setHours(23,59,59,999),e}function fc(t){const e=Yl(t),i=e.getMonth();return e.setFullYear(e.getFullYear(),i+1,0),e.setHours(23,59,59,999),e}function _c(t,e){const i=Yl(t),s=Yl(e),r=lc(i,s),a=Math.abs(function(t,e){const i=Yl(t),s=Yl(e);return 12*(i.getFullYear()-s.getFullYear())+(i.getMonth()-s.getMonth())}(i,s));let o;if(a<1)o=0;else{1===i.getMonth()&&i.getDate()>27&&i.setDate(30),i.setMonth(i.getMonth()-r*a);let e=lc(i,s)===-r;(function(t){const e=Yl(t);return+gc(e)===+fc(e)})(Yl(t))&&1===a&&1===lc(t,s)&&(e=!1),o=r*(a-Number(e))}return 0===o?0:o}function mc(t,e){const i=Yl(t),s=Yl(e),r=lc(i,s),a=Math.abs(function(t,e){const i=Yl(t),s=Yl(e);return i.getFullYear()-s.getFullYear()}(i,s));i.setFullYear(1584),s.setFullYear(1584);const o=r*(a-+(lc(i,s)===-r));return 0===o?0:o}function yc(t){const e=Yl(t),i=Gl(t,0);return i.setFullYear(e.getFullYear(),0,1),i.setHours(0,0,0,0),i}const xc={lessThanXSeconds:{one:"less than a second",other:"less than {{count}} seconds"},xSeconds:{one:"1 second",other:"{{count}} seconds"},halfAMinute:"half a minute",lessThanXMinutes:{one:"less than a minute",other:"less than {{count}} minutes"},xMinutes:{one:"1 minute",other:"{{count}} minutes"},aboutXHours:{one:"about 1 hour",other:"about {{count}} hours"},xHours:{one:"1 hour",other:"{{count}} hours"},xDays:{one:"1 day",other:"{{count}} days"},aboutXWeeks:{one:"about 1 week",other:"about {{count}} weeks"},xWeeks:{one:"1 week",other:"{{count}} weeks"},aboutXMonths:{one:"about 1 month",other:"about {{count}} months"},xMonths:{one:"1 month",other:"{{count}} months"},aboutXYears:{one:"about 1 year",other:"about {{count}} years"},xYears:{one:"1 year",other:"{{count}} years"},overXYears:{one:"over 1 year",other:"over {{count}} years"},almostXYears:{one:"almost 1 year",other:"almost {{count}} years"}};function bc(t){return(e={})=>{const i=e.width?String(e.width):t.defaultWidth;return t.formats[i]||t.formats[t.defaultWidth]}}const vc={date:bc({formats:{full:"EEEE, MMMM do, y",long:"MMMM do, y",medium:"MMM d, y",short:"MM/dd/yyyy"},defaultWidth:"full"}),time:bc({formats:{full:"h:mm:ss a zzzz",long:"h:mm:ss a z",medium:"h:mm:ss a",short:"h:mm a"},defaultWidth:"full"}),dateTime:bc({formats:{full:"{{date}} 'at' {{time}}",long:"{{date}} 'at' {{time}}",medium:"{{date}}, {{time}}",short:"{{date}}, {{time}}"},defaultWidth:"full"})},wc={lastWeek:"'last' eeee 'at' p",yesterday:"'yesterday at' p",today:"'today at' p",tomorrow:"'tomorrow at' p",nextWeek:"eeee 'at' p",other:"P"};function $c(t){return(e,i)=>{let s;if("formatting"===(i?.context?String(i.context):"standalone")&&t.formattingValues){const e=t.defaultFormattingWidth||t.defaultWidth,r=i?.width?String(i.width):e;s=t.formattingValues[r]||t.formattingValues[e]}else{const e=t.defaultWidth,r=i?.width?String(i.width):t.defaultWidth;s=t.values[r]||t.values[e]}return s[t.argumentCallback?t.argumentCallback(e):e]}}const kc={ordinalNumber:(t,e)=>{const i=Number(t),s=i%100;if(s>20||s<10)switch(s%10){case 1:return i+"st";case 2:return i+"nd";case 3:return i+"rd"}return i+"th"},era:$c({values:{narrow:["B","A"],abbreviated:["BC","AD"],wide:["Before Christ","Anno Domini"]},defaultWidth:"wide"}),quarter:$c({values:{narrow:["1","2","3","4"],abbreviated:["Q1","Q2","Q3","Q4"],wide:["1st quarter","2nd quarter","3rd quarter","4th quarter"]},defaultWidth:"wide",argumentCallback:t=>t-1}),month:$c({values:{narrow:["J","F","M","A","M","J","J","A","S","O","N","D"],abbreviated:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],wide:["January","February","March","April","May","June","July","August","September","October","November","December"]},defaultWidth:"wide"}),day:$c({values:{narrow:["S","M","T","W","T","F","S"],short:["Su","Mo","Tu","We","Th","Fr","Sa"],abbreviated:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],wide:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]},defaultWidth:"wide"}),dayPeriod:$c({values:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"morning",afternoon:"afternoon",evening:"evening",night:"night"}},defaultWidth:"wide",formattingValues:{narrow:{am:"a",pm:"p",midnight:"mi",noon:"n",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},abbreviated:{am:"AM",pm:"PM",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"},wide:{am:"a.m.",pm:"p.m.",midnight:"midnight",noon:"noon",morning:"in the morning",afternoon:"in the afternoon",evening:"in the evening",night:"at night"}},defaultFormattingWidth:"wide"})};function Mc(t){return(e,i={})=>{const s=i.width,r=s&&t.matchPatterns[s]||t.matchPatterns[t.defaultMatchWidth],a=e.match(r);if(!a)return null;const o=a[0],n=s&&t.parsePatterns[s]||t.parsePatterns[t.defaultParseWidth],l=Array.isArray(n)?function(t,e){for(let i=0;i<t.length;i++)if(e(t[i]))return i;return}(n,t=>t.test(o)):function(t,e){for(const i in t)if(Object.prototype.hasOwnProperty.call(t,i)&&e(t[i]))return i;return}(n,t=>t.test(o));let c;c=t.valueCallback?t.valueCallback(l):l,c=i.valueCallback?i.valueCallback(c):c;return{value:c,rest:e.slice(o.length)}}}const Sc={ordinalNumber:(Cc={matchPattern:/^(\d+)(th|st|nd|rd)?/i,parsePattern:/\d+/i,valueCallback:t=>parseInt(t,10)},(t,e={})=>{const i=t.match(Cc.matchPattern);if(!i)return null;const s=i[0],r=t.match(Cc.parsePattern);if(!r)return null;let a=Cc.valueCallback?Cc.valueCallback(r[0]):r[0];return a=e.valueCallback?e.valueCallback(a):a,{value:a,rest:t.slice(s.length)}}),era:Mc({matchPatterns:{narrow:/^(b|a)/i,abbreviated:/^(b\.?\s?c\.?|b\.?\s?c\.?\s?e\.?|a\.?\s?d\.?|c\.?\s?e\.?)/i,wide:/^(before christ|before common era|anno domini|common era)/i},defaultMatchWidth:"wide",parsePatterns:{any:[/^b/i,/^(a|c)/i]},defaultParseWidth:"any"}),quarter:Mc({matchPatterns:{narrow:/^[1234]/i,abbreviated:/^q[1234]/i,wide:/^[1234](th|st|nd|rd)? quarter/i},defaultMatchWidth:"wide",parsePatterns:{any:[/1/i,/2/i,/3/i,/4/i]},defaultParseWidth:"any",valueCallback:t=>t+1}),month:Mc({matchPatterns:{narrow:/^[jfmasond]/i,abbreviated:/^(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i,wide:/^(january|february|march|april|may|june|july|august|september|october|november|december)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^j/i,/^f/i,/^m/i,/^a/i,/^m/i,/^j/i,/^j/i,/^a/i,/^s/i,/^o/i,/^n/i,/^d/i],any:[/^ja/i,/^f/i,/^mar/i,/^ap/i,/^may/i,/^jun/i,/^jul/i,/^au/i,/^s/i,/^o/i,/^n/i,/^d/i]},defaultParseWidth:"any"}),day:Mc({matchPatterns:{narrow:/^[smtwf]/i,short:/^(su|mo|tu|we|th|fr|sa)/i,abbreviated:/^(sun|mon|tue|wed|thu|fri|sat)/i,wide:/^(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/i},defaultMatchWidth:"wide",parsePatterns:{narrow:[/^s/i,/^m/i,/^t/i,/^w/i,/^t/i,/^f/i,/^s/i],any:[/^su/i,/^m/i,/^tu/i,/^w/i,/^th/i,/^f/i,/^sa/i]},defaultParseWidth:"any"}),dayPeriod:Mc({matchPatterns:{narrow:/^(a|p|mi|n|(in the|at) (morning|afternoon|evening|night))/i,any:/^([ap]\.?\s?m\.?|midnight|noon|(in the|at) (morning|afternoon|evening|night))/i},defaultMatchWidth:"any",parsePatterns:{any:{am:/^a/i,pm:/^p/i,midnight:/^mi/i,noon:/^no/i,morning:/morning/i,afternoon:/afternoon/i,evening:/evening/i,night:/night/i}},defaultParseWidth:"any"})};var Cc;const Dc={code:"en-US",formatDistance:(t,e,i)=>{let s;const r=xc[t];return s="string"==typeof r?r:1===e?r.one:r.other.replace("{{count}}",e.toString()),i?.addSuffix?i.comparison&&i.comparison>0?"in "+s:s+" ago":s},formatLong:vc,formatRelative:(t,e,i,s)=>wc[t],localize:kc,match:Sc,options:{weekStartsOn:0,firstWeekContainsDate:1}};function zc(t){const e=Yl(t),i=+sc(e)-+function(t){const e=rc(t),i=Gl(t,0);return i.setFullYear(e,0,4),i.setHours(0,0,0,0),sc(i)}(e);return Math.round(i/Zl)+1}function Ec(t,e){const i=Yl(t),s=i.getFullYear(),r=ec(),a=e?.firstWeekContainsDate??e?.locale?.options?.firstWeekContainsDate??r.firstWeekContainsDate??r.locale?.options?.firstWeekContainsDate??1,o=Gl(t,0);o.setFullYear(s+1,0,a),o.setHours(0,0,0,0);const n=ic(o,e),l=Gl(t,0);l.setFullYear(s,0,a),l.setHours(0,0,0,0);const c=ic(l,e);return i.getTime()>=n.getTime()?s+1:i.getTime()>=c.getTime()?s:s-1}function Pc(t,e){const i=Yl(t),s=+ic(i,e)-+function(t,e){const i=ec(),s=e?.firstWeekContainsDate??e?.locale?.options?.firstWeekContainsDate??i.firstWeekContainsDate??i.locale?.options?.firstWeekContainsDate??1,r=Ec(t,e),a=Gl(t,0);return a.setFullYear(r,0,s),a.setHours(0,0,0,0),ic(a,e)}(i,e);return Math.round(s/Zl)+1}function Tc(t,e){return(t<0?"-":"")+Math.abs(t).toString().padStart(e,"0")}const Fc={y(t,e){const i=t.getFullYear(),s=i>0?i:1-i;return Tc("yy"===e?s%100:s,e.length)},M(t,e){const i=t.getMonth();return"M"===e?String(i+1):Tc(i+1,2)},d:(t,e)=>Tc(t.getDate(),e.length),a(t,e){const i=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return i.toUpperCase();case"aaa":return i;case"aaaaa":return i[0];default:return"am"===i?"a.m.":"p.m."}},h:(t,e)=>Tc(t.getHours()%12||12,e.length),H:(t,e)=>Tc(t.getHours(),e.length),m:(t,e)=>Tc(t.getMinutes(),e.length),s:(t,e)=>Tc(t.getSeconds(),e.length),S(t,e){const i=e.length,s=t.getMilliseconds();return Tc(Math.trunc(s*Math.pow(10,i-3)),e.length)}},Ac="midnight",Rc="noon",Lc="morning",Ic="afternoon",Oc="evening",Nc="night",Hc={G:function(t,e,i){const s=t.getFullYear()>0?1:0;switch(e){case"G":case"GG":case"GGG":return i.era(s,{width:"abbreviated"});case"GGGGG":return i.era(s,{width:"narrow"});default:return i.era(s,{width:"wide"})}},y:function(t,e,i){if("yo"===e){const e=t.getFullYear(),s=e>0?e:1-e;return i.ordinalNumber(s,{unit:"year"})}return Fc.y(t,e)},Y:function(t,e,i,s){const r=Ec(t,s),a=r>0?r:1-r;if("YY"===e){return Tc(a%100,2)}return"Yo"===e?i.ordinalNumber(a,{unit:"year"}):Tc(a,e.length)},R:function(t,e){return Tc(rc(t),e.length)},u:function(t,e){return Tc(t.getFullYear(),e.length)},Q:function(t,e,i){const s=Math.ceil((t.getMonth()+1)/3);switch(e){case"Q":return String(s);case"QQ":return Tc(s,2);case"Qo":return i.ordinalNumber(s,{unit:"quarter"});case"QQQ":return i.quarter(s,{width:"abbreviated",context:"formatting"});case"QQQQQ":return i.quarter(s,{width:"narrow",context:"formatting"});default:return i.quarter(s,{width:"wide",context:"formatting"})}},q:function(t,e,i){const s=Math.ceil((t.getMonth()+1)/3);switch(e){case"q":return String(s);case"qq":return Tc(s,2);case"qo":return i.ordinalNumber(s,{unit:"quarter"});case"qqq":return i.quarter(s,{width:"abbreviated",context:"standalone"});case"qqqqq":return i.quarter(s,{width:"narrow",context:"standalone"});default:return i.quarter(s,{width:"wide",context:"standalone"})}},M:function(t,e,i){const s=t.getMonth();switch(e){case"M":case"MM":return Fc.M(t,e);case"Mo":return i.ordinalNumber(s+1,{unit:"month"});case"MMM":return i.month(s,{width:"abbreviated",context:"formatting"});case"MMMMM":return i.month(s,{width:"narrow",context:"formatting"});default:return i.month(s,{width:"wide",context:"formatting"})}},L:function(t,e,i){const s=t.getMonth();switch(e){case"L":return String(s+1);case"LL":return Tc(s+1,2);case"Lo":return i.ordinalNumber(s+1,{unit:"month"});case"LLL":return i.month(s,{width:"abbreviated",context:"standalone"});case"LLLLL":return i.month(s,{width:"narrow",context:"standalone"});default:return i.month(s,{width:"wide",context:"standalone"})}},w:function(t,e,i,s){const r=Pc(t,s);return"wo"===e?i.ordinalNumber(r,{unit:"week"}):Tc(r,e.length)},I:function(t,e,i){const s=zc(t);return"Io"===e?i.ordinalNumber(s,{unit:"week"}):Tc(s,e.length)},d:function(t,e,i){return"do"===e?i.ordinalNumber(t.getDate(),{unit:"date"}):Fc.d(t,e)},D:function(t,e,i){const s=function(t){const e=Yl(t);return nc(e,yc(e))+1}(t);return"Do"===e?i.ordinalNumber(s,{unit:"dayOfYear"}):Tc(s,e.length)},E:function(t,e,i){const s=t.getDay();switch(e){case"E":case"EE":case"EEE":return i.day(s,{width:"abbreviated",context:"formatting"});case"EEEEE":return i.day(s,{width:"narrow",context:"formatting"});case"EEEEEE":return i.day(s,{width:"short",context:"formatting"});default:return i.day(s,{width:"wide",context:"formatting"})}},e:function(t,e,i,s){const r=t.getDay(),a=(r-s.weekStartsOn+8)%7||7;switch(e){case"e":return String(a);case"ee":return Tc(a,2);case"eo":return i.ordinalNumber(a,{unit:"day"});case"eee":return i.day(r,{width:"abbreviated",context:"formatting"});case"eeeee":return i.day(r,{width:"narrow",context:"formatting"});case"eeeeee":return i.day(r,{width:"short",context:"formatting"});default:return i.day(r,{width:"wide",context:"formatting"})}},c:function(t,e,i,s){const r=t.getDay(),a=(r-s.weekStartsOn+8)%7||7;switch(e){case"c":return String(a);case"cc":return Tc(a,e.length);case"co":return i.ordinalNumber(a,{unit:"day"});case"ccc":return i.day(r,{width:"abbreviated",context:"standalone"});case"ccccc":return i.day(r,{width:"narrow",context:"standalone"});case"cccccc":return i.day(r,{width:"short",context:"standalone"});default:return i.day(r,{width:"wide",context:"standalone"})}},i:function(t,e,i){const s=t.getDay(),r=0===s?7:s;switch(e){case"i":return String(r);case"ii":return Tc(r,e.length);case"io":return i.ordinalNumber(r,{unit:"day"});case"iii":return i.day(s,{width:"abbreviated",context:"formatting"});case"iiiii":return i.day(s,{width:"narrow",context:"formatting"});case"iiiiii":return i.day(s,{width:"short",context:"formatting"});default:return i.day(s,{width:"wide",context:"formatting"})}},a:function(t,e,i){const s=t.getHours()/12>=1?"pm":"am";switch(e){case"a":case"aa":return i.dayPeriod(s,{width:"abbreviated",context:"formatting"});case"aaa":return i.dayPeriod(s,{width:"abbreviated",context:"formatting"}).toLowerCase();case"aaaaa":return i.dayPeriod(s,{width:"narrow",context:"formatting"});default:return i.dayPeriod(s,{width:"wide",context:"formatting"})}},b:function(t,e,i){const s=t.getHours();let r;switch(r=12===s?Rc:0===s?Ac:s/12>=1?"pm":"am",e){case"b":case"bb":return i.dayPeriod(r,{width:"abbreviated",context:"formatting"});case"bbb":return i.dayPeriod(r,{width:"abbreviated",context:"formatting"}).toLowerCase();case"bbbbb":return i.dayPeriod(r,{width:"narrow",context:"formatting"});default:return i.dayPeriod(r,{width:"wide",context:"formatting"})}},B:function(t,e,i){const s=t.getHours();let r;switch(r=s>=17?Oc:s>=12?Ic:s>=4?Lc:Nc,e){case"B":case"BB":case"BBB":return i.dayPeriod(r,{width:"abbreviated",context:"formatting"});case"BBBBB":return i.dayPeriod(r,{width:"narrow",context:"formatting"});default:return i.dayPeriod(r,{width:"wide",context:"formatting"})}},h:function(t,e,i){if("ho"===e){let e=t.getHours()%12;return 0===e&&(e=12),i.ordinalNumber(e,{unit:"hour"})}return Fc.h(t,e)},H:function(t,e,i){return"Ho"===e?i.ordinalNumber(t.getHours(),{unit:"hour"}):Fc.H(t,e)},K:function(t,e,i){const s=t.getHours()%12;return"Ko"===e?i.ordinalNumber(s,{unit:"hour"}):Tc(s,e.length)},k:function(t,e,i){let s=t.getHours();return 0===s&&(s=24),"ko"===e?i.ordinalNumber(s,{unit:"hour"}):Tc(s,e.length)},m:function(t,e,i){return"mo"===e?i.ordinalNumber(t.getMinutes(),{unit:"minute"}):Fc.m(t,e)},s:function(t,e,i){return"so"===e?i.ordinalNumber(t.getSeconds(),{unit:"second"}):Fc.s(t,e)},S:function(t,e){return Fc.S(t,e)},X:function(t,e,i){const s=t.getTimezoneOffset();if(0===s)return"Z";switch(e){case"X":return Wc(s);case"XXXX":case"XX":return jc(s);default:return jc(s,":")}},x:function(t,e,i){const s=t.getTimezoneOffset();switch(e){case"x":return Wc(s);case"xxxx":case"xx":return jc(s);default:return jc(s,":")}},O:function(t,e,i){const s=t.getTimezoneOffset();switch(e){case"O":case"OO":case"OOO":return"GMT"+Bc(s,":");default:return"GMT"+jc(s,":")}},z:function(t,e,i){const s=t.getTimezoneOffset();switch(e){case"z":case"zz":case"zzz":return"GMT"+Bc(s,":");default:return"GMT"+jc(s,":")}},t:function(t,e,i){return Tc(Math.trunc(t.getTime()/1e3),e.length)},T:function(t,e,i){return Tc(t.getTime(),e.length)}};function Bc(t,e=""){const i=t>0?"-":"+",s=Math.abs(t),r=Math.trunc(s/60),a=s%60;return 0===a?i+String(r):i+String(r)+e+Tc(a,2)}function Wc(t,e){if(t%60==0){return(t>0?"-":"+")+Tc(Math.abs(t)/60,2)}return jc(t,e)}function jc(t,e=""){const i=t>0?"-":"+",s=Math.abs(t);return i+Tc(Math.trunc(s/60),2)+e+Tc(s%60,2)}const Vc=(t,e)=>{switch(t){case"P":return e.date({width:"short"});case"PP":return e.date({width:"medium"});case"PPP":return e.date({width:"long"});default:return e.date({width:"full"})}},Uc=(t,e)=>{switch(t){case"p":return e.time({width:"short"});case"pp":return e.time({width:"medium"});case"ppp":return e.time({width:"long"});default:return e.time({width:"full"})}},Yc={p:Uc,P:(t,e)=>{const i=t.match(/(P+)(p+)?/)||[],s=i[1],r=i[2];if(!r)return Vc(t,e);let a;switch(s){case"P":a=e.dateTime({width:"short"});break;case"PP":a=e.dateTime({width:"medium"});break;case"PPP":a=e.dateTime({width:"long"});break;default:a=e.dateTime({width:"full"})}return a.replace("{{date}}",Vc(s,e)).replace("{{time}}",Uc(r,e))}},Gc=/^D+$/,qc=/^Y+$/,Kc=["D","DD","YY","YYYY"];function Xc(t){return Gc.test(t)}function Zc(t){return qc.test(t)}function Qc(t,e,i){const s=function(t,e,i){const s="Y"===t[0]?"years":"days of the month";return`Use \`${t.toLowerCase()}\` instead of \`${t}\` (in \`${e}\`) for formatting ${s} to the input \`${i}\`; see: https://github.com/date-fns/date-fns/blob/master/docs/unicodeTokens.md`}(t,e,i);if(console.warn(s),Kc.includes(t))throw new RangeError(s)}const Jc=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,th=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,eh=/^'([^]*?)'?$/,ih=/''/g,sh=/[a-zA-Z]/;function rh(t){const e=t.match(eh);return e?e[1].replace(ih,"'"):t}class ah{subPriority=0;validate(t,e){return!0}}class oh extends ah{constructor(t,e,i,s,r){super(),this.value=t,this.validateValue=e,this.setValue=i,this.priority=s,r&&(this.subPriority=r)}validate(t,e){return this.validateValue(t,this.value,e)}set(t,e,i){return this.setValue(t,e,this.value,i)}}class nh extends ah{priority=10;subPriority=-1;set(t,e){return e.timestampIsSet?t:Gl(t,function(t,e){const i=e instanceof Date?Gl(e,0):new e(0);return i.setFullYear(t.getFullYear(),t.getMonth(),t.getDate()),i.setHours(t.getHours(),t.getMinutes(),t.getSeconds(),t.getMilliseconds()),i}(t,Date))}}class lh{run(t,e,i,s){const r=this.parse(t,e,i,s);return r?{setter:new oh(r.value,this.validate,this.set,this.priority,this.subPriority),rest:r.rest}:null}validate(t,e,i){return!0}}const ch=/^(1[0-2]|0?\d)/,hh=/^(3[0-1]|[0-2]?\d)/,dh=/^(36[0-6]|3[0-5]\d|[0-2]?\d?\d)/,ph=/^(5[0-3]|[0-4]?\d)/,uh=/^(2[0-3]|[0-1]?\d)/,gh=/^(2[0-4]|[0-1]?\d)/,fh=/^(1[0-1]|0?\d)/,_h=/^(1[0-2]|0?\d)/,mh=/^[0-5]?\d/,yh=/^[0-5]?\d/,xh=/^\d/,bh=/^\d{1,2}/,vh=/^\d{1,3}/,wh=/^\d{1,4}/,$h=/^-?\d+/,kh=/^-?\d/,Mh=/^-?\d{1,2}/,Sh=/^-?\d{1,3}/,Ch=/^-?\d{1,4}/,Dh=/^([+-])(\d{2})(\d{2})?|Z/,zh=/^([+-])(\d{2})(\d{2})|Z/,Eh=/^([+-])(\d{2})(\d{2})((\d{2}))?|Z/,Ph=/^([+-])(\d{2}):(\d{2})|Z/,Th=/^([+-])(\d{2}):(\d{2})(:(\d{2}))?|Z/;function Fh(t,e){return t?{value:e(t.value),rest:t.rest}:t}function Ah(t,e){const i=e.match(t);return i?{value:parseInt(i[0],10),rest:e.slice(i[0].length)}:null}function Rh(t,e){const i=e.match(t);if(!i)return null;if("Z"===i[0])return{value:0,rest:e.slice(1)};const s="+"===i[1]?1:-1,r=i[2]?parseInt(i[2],10):0,a=i[3]?parseInt(i[3],10):0,o=i[5]?parseInt(i[5],10):0;return{value:s*(r*Jl+a*Ql+1e3*o),rest:e.slice(i[0].length)}}function Lh(t){return Ah($h,t)}function Ih(t,e){switch(t){case 1:return Ah(xh,e);case 2:return Ah(bh,e);case 3:return Ah(vh,e);case 4:return Ah(wh,e);default:return Ah(new RegExp("^\\d{1,"+t+"}"),e)}}function Oh(t,e){switch(t){case 1:return Ah(kh,e);case 2:return Ah(Mh,e);case 3:return Ah(Sh,e);case 4:return Ah(Ch,e);default:return Ah(new RegExp("^-?\\d{1,"+t+"}"),e)}}function Nh(t){switch(t){case"morning":return 4;case"evening":return 17;case"pm":case"noon":case"afternoon":return 12;default:return 0}}function Hh(t,e){const i=e>0,s=i?e:1-e;let r;if(s<=50)r=t||100;else{const e=s+50;r=t+100*Math.trunc(e/100)-(t>=e%100?100:0)}return i?r:1-r}function Bh(t){return t%400==0||t%4==0&&t%100!=0}const Wh=[31,28,31,30,31,30,31,31,30,31,30,31],jh=[31,29,31,30,31,30,31,31,30,31,30,31];function Vh(t,e,i){const s=ec(),r=i?.weekStartsOn??i?.locale?.options?.weekStartsOn??s.weekStartsOn??s.locale?.options?.weekStartsOn??0,a=Yl(t),o=a.getDay(),n=7-r;return ql(a,e<0||e>6?e-(o+n)%7:((e%7+7)%7+n)%7-(o+n)%7)}function Uh(t,e){const i=Yl(t),s=function(t){let e=Yl(t).getDay();return 0===e&&(e=7),e}(i);return ql(i,e-s)}const Yh={G:new class extends lh{priority=140;parse(t,e,i){switch(e){case"G":case"GG":case"GGG":return i.era(t,{width:"abbreviated"})||i.era(t,{width:"narrow"});case"GGGGG":return i.era(t,{width:"narrow"});default:return i.era(t,{width:"wide"})||i.era(t,{width:"abbreviated"})||i.era(t,{width:"narrow"})}}set(t,e,i){return e.era=i,t.setFullYear(i,0,1),t.setHours(0,0,0,0),t}incompatibleTokens=["R","u","t","T"]},y:new class extends lh{priority=130;incompatibleTokens=["Y","R","u","w","I","i","e","c","t","T"];parse(t,e,i){const s=t=>({year:t,isTwoDigitYear:"yy"===e});switch(e){case"y":return Fh(Ih(4,t),s);case"yo":return Fh(i.ordinalNumber(t,{unit:"year"}),s);default:return Fh(Ih(e.length,t),s)}}validate(t,e){return e.isTwoDigitYear||e.year>0}set(t,e,i){const s=t.getFullYear();if(i.isTwoDigitYear){const e=Hh(i.year,s);return t.setFullYear(e,0,1),t.setHours(0,0,0,0),t}const r="era"in e&&1!==e.era?1-i.year:i.year;return t.setFullYear(r,0,1),t.setHours(0,0,0,0),t}},Y:new class extends lh{priority=130;parse(t,e,i){const s=t=>({year:t,isTwoDigitYear:"YY"===e});switch(e){case"Y":return Fh(Ih(4,t),s);case"Yo":return Fh(i.ordinalNumber(t,{unit:"year"}),s);default:return Fh(Ih(e.length,t),s)}}validate(t,e){return e.isTwoDigitYear||e.year>0}set(t,e,i,s){const r=Ec(t,s);if(i.isTwoDigitYear){const e=Hh(i.year,r);return t.setFullYear(e,0,s.firstWeekContainsDate),t.setHours(0,0,0,0),ic(t,s)}const a="era"in e&&1!==e.era?1-i.year:i.year;return t.setFullYear(a,0,s.firstWeekContainsDate),t.setHours(0,0,0,0),ic(t,s)}incompatibleTokens=["y","R","u","Q","q","M","L","I","d","D","i","t","T"]},R:new class extends lh{priority=130;parse(t,e){return Oh("R"===e?4:e.length,t)}set(t,e,i){const s=Gl(t,0);return s.setFullYear(i,0,4),s.setHours(0,0,0,0),sc(s)}incompatibleTokens=["G","y","Y","u","Q","q","M","L","w","d","D","e","c","t","T"]},u:new class extends lh{priority=130;parse(t,e){return Oh("u"===e?4:e.length,t)}set(t,e,i){return t.setFullYear(i,0,1),t.setHours(0,0,0,0),t}incompatibleTokens=["G","y","Y","R","w","I","i","e","c","t","T"]},Q:new class extends lh{priority=120;parse(t,e,i){switch(e){case"Q":case"QQ":return Ih(e.length,t);case"Qo":return i.ordinalNumber(t,{unit:"quarter"});case"QQQ":return i.quarter(t,{width:"abbreviated",context:"formatting"})||i.quarter(t,{width:"narrow",context:"formatting"});case"QQQQQ":return i.quarter(t,{width:"narrow",context:"formatting"});default:return i.quarter(t,{width:"wide",context:"formatting"})||i.quarter(t,{width:"abbreviated",context:"formatting"})||i.quarter(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=1&&e<=4}set(t,e,i){return t.setMonth(3*(i-1),1),t.setHours(0,0,0,0),t}incompatibleTokens=["Y","R","q","M","L","w","I","d","D","i","e","c","t","T"]},q:new class extends lh{priority=120;parse(t,e,i){switch(e){case"q":case"qq":return Ih(e.length,t);case"qo":return i.ordinalNumber(t,{unit:"quarter"});case"qqq":return i.quarter(t,{width:"abbreviated",context:"standalone"})||i.quarter(t,{width:"narrow",context:"standalone"});case"qqqqq":return i.quarter(t,{width:"narrow",context:"standalone"});default:return i.quarter(t,{width:"wide",context:"standalone"})||i.quarter(t,{width:"abbreviated",context:"standalone"})||i.quarter(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=1&&e<=4}set(t,e,i){return t.setMonth(3*(i-1),1),t.setHours(0,0,0,0),t}incompatibleTokens=["Y","R","Q","M","L","w","I","d","D","i","e","c","t","T"]},M:new class extends lh{incompatibleTokens=["Y","R","q","Q","L","w","I","D","i","e","c","t","T"];priority=110;parse(t,e,i){const s=t=>t-1;switch(e){case"M":return Fh(Ah(ch,t),s);case"MM":return Fh(Ih(2,t),s);case"Mo":return Fh(i.ordinalNumber(t,{unit:"month"}),s);case"MMM":return i.month(t,{width:"abbreviated",context:"formatting"})||i.month(t,{width:"narrow",context:"formatting"});case"MMMMM":return i.month(t,{width:"narrow",context:"formatting"});default:return i.month(t,{width:"wide",context:"formatting"})||i.month(t,{width:"abbreviated",context:"formatting"})||i.month(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=11}set(t,e,i){return t.setMonth(i,1),t.setHours(0,0,0,0),t}},L:new class extends lh{priority=110;parse(t,e,i){const s=t=>t-1;switch(e){case"L":return Fh(Ah(ch,t),s);case"LL":return Fh(Ih(2,t),s);case"Lo":return Fh(i.ordinalNumber(t,{unit:"month"}),s);case"LLL":return i.month(t,{width:"abbreviated",context:"standalone"})||i.month(t,{width:"narrow",context:"standalone"});case"LLLLL":return i.month(t,{width:"narrow",context:"standalone"});default:return i.month(t,{width:"wide",context:"standalone"})||i.month(t,{width:"abbreviated",context:"standalone"})||i.month(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=0&&e<=11}set(t,e,i){return t.setMonth(i,1),t.setHours(0,0,0,0),t}incompatibleTokens=["Y","R","q","Q","M","w","I","D","i","e","c","t","T"]},w:new class extends lh{priority=100;parse(t,e,i){switch(e){case"w":return Ah(ph,t);case"wo":return i.ordinalNumber(t,{unit:"week"});default:return Ih(e.length,t)}}validate(t,e){return e>=1&&e<=53}set(t,e,i,s){return ic(function(t,e,i){const s=Yl(t),r=Pc(s,i)-e;return s.setDate(s.getDate()-7*r),s}(t,i,s),s)}incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","i","t","T"]},I:new class extends lh{priority=100;parse(t,e,i){switch(e){case"I":return Ah(ph,t);case"Io":return i.ordinalNumber(t,{unit:"week"});default:return Ih(e.length,t)}}validate(t,e){return e>=1&&e<=53}set(t,e,i){return sc(function(t,e){const i=Yl(t),s=zc(i)-e;return i.setDate(i.getDate()-7*s),i}(t,i))}incompatibleTokens=["y","Y","u","q","Q","M","L","w","d","D","e","c","t","T"]},d:new class extends lh{priority=90;subPriority=1;parse(t,e,i){switch(e){case"d":return Ah(hh,t);case"do":return i.ordinalNumber(t,{unit:"date"});default:return Ih(e.length,t)}}validate(t,e){const i=Bh(t.getFullYear()),s=t.getMonth();return i?e>=1&&e<=jh[s]:e>=1&&e<=Wh[s]}set(t,e,i){return t.setDate(i),t.setHours(0,0,0,0),t}incompatibleTokens=["Y","R","q","Q","w","I","D","i","e","c","t","T"]},D:new class extends lh{priority=90;subpriority=1;parse(t,e,i){switch(e){case"D":case"DD":return Ah(dh,t);case"Do":return i.ordinalNumber(t,{unit:"date"});default:return Ih(e.length,t)}}validate(t,e){return Bh(t.getFullYear())?e>=1&&e<=366:e>=1&&e<=365}set(t,e,i){return t.setMonth(0,i),t.setHours(0,0,0,0),t}incompatibleTokens=["Y","R","q","Q","M","L","w","I","d","E","i","e","c","t","T"]},E:new class extends lh{priority=90;parse(t,e,i){switch(e){case"E":case"EE":case"EEE":return i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"});case"EEEEE":return i.day(t,{width:"narrow",context:"formatting"});case"EEEEEE":return i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"});default:return i.day(t,{width:"wide",context:"formatting"})||i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=6}set(t,e,i,s){return(t=Vh(t,i,s)).setHours(0,0,0,0),t}incompatibleTokens=["D","i","e","c","t","T"]},e:new class extends lh{priority=90;parse(t,e,i,s){const r=t=>{const e=7*Math.floor((t-1)/7);return(t+s.weekStartsOn+6)%7+e};switch(e){case"e":case"ee":return Fh(Ih(e.length,t),r);case"eo":return Fh(i.ordinalNumber(t,{unit:"day"}),r);case"eee":return i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"});case"eeeee":return i.day(t,{width:"narrow",context:"formatting"});case"eeeeee":return i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"});default:return i.day(t,{width:"wide",context:"formatting"})||i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"})}}validate(t,e){return e>=0&&e<=6}set(t,e,i,s){return(t=Vh(t,i,s)).setHours(0,0,0,0),t}incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","E","i","c","t","T"]},c:new class extends lh{priority=90;parse(t,e,i,s){const r=t=>{const e=7*Math.floor((t-1)/7);return(t+s.weekStartsOn+6)%7+e};switch(e){case"c":case"cc":return Fh(Ih(e.length,t),r);case"co":return Fh(i.ordinalNumber(t,{unit:"day"}),r);case"ccc":return i.day(t,{width:"abbreviated",context:"standalone"})||i.day(t,{width:"short",context:"standalone"})||i.day(t,{width:"narrow",context:"standalone"});case"ccccc":return i.day(t,{width:"narrow",context:"standalone"});case"cccccc":return i.day(t,{width:"short",context:"standalone"})||i.day(t,{width:"narrow",context:"standalone"});default:return i.day(t,{width:"wide",context:"standalone"})||i.day(t,{width:"abbreviated",context:"standalone"})||i.day(t,{width:"short",context:"standalone"})||i.day(t,{width:"narrow",context:"standalone"})}}validate(t,e){return e>=0&&e<=6}set(t,e,i,s){return(t=Vh(t,i,s)).setHours(0,0,0,0),t}incompatibleTokens=["y","R","u","q","Q","M","L","I","d","D","E","i","e","t","T"]},i:new class extends lh{priority=90;parse(t,e,i){const s=t=>0===t?7:t;switch(e){case"i":case"ii":return Ih(e.length,t);case"io":return i.ordinalNumber(t,{unit:"day"});case"iii":return Fh(i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"}),s);case"iiiii":return Fh(i.day(t,{width:"narrow",context:"formatting"}),s);case"iiiiii":return Fh(i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"}),s);default:return Fh(i.day(t,{width:"wide",context:"formatting"})||i.day(t,{width:"abbreviated",context:"formatting"})||i.day(t,{width:"short",context:"formatting"})||i.day(t,{width:"narrow",context:"formatting"}),s)}}validate(t,e){return e>=1&&e<=7}set(t,e,i){return(t=Uh(t,i)).setHours(0,0,0,0),t}incompatibleTokens=["y","Y","u","q","Q","M","L","w","d","D","E","e","c","t","T"]},a:new class extends lh{priority=80;parse(t,e,i){switch(e){case"a":case"aa":case"aaa":return i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"});case"aaaaa":return i.dayPeriod(t,{width:"narrow",context:"formatting"});default:return i.dayPeriod(t,{width:"wide",context:"formatting"})||i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,i){return t.setHours(Nh(i),0,0,0),t}incompatibleTokens=["b","B","H","k","t","T"]},b:new class extends lh{priority=80;parse(t,e,i){switch(e){case"b":case"bb":case"bbb":return i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"});case"bbbbb":return i.dayPeriod(t,{width:"narrow",context:"formatting"});default:return i.dayPeriod(t,{width:"wide",context:"formatting"})||i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,i){return t.setHours(Nh(i),0,0,0),t}incompatibleTokens=["a","B","H","k","t","T"]},B:new class extends lh{priority=80;parse(t,e,i){switch(e){case"B":case"BB":case"BBB":return i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"});case"BBBBB":return i.dayPeriod(t,{width:"narrow",context:"formatting"});default:return i.dayPeriod(t,{width:"wide",context:"formatting"})||i.dayPeriod(t,{width:"abbreviated",context:"formatting"})||i.dayPeriod(t,{width:"narrow",context:"formatting"})}}set(t,e,i){return t.setHours(Nh(i),0,0,0),t}incompatibleTokens=["a","b","t","T"]},h:new class extends lh{priority=70;parse(t,e,i){switch(e){case"h":return Ah(_h,t);case"ho":return i.ordinalNumber(t,{unit:"hour"});default:return Ih(e.length,t)}}validate(t,e){return e>=1&&e<=12}set(t,e,i){const s=t.getHours()>=12;return s&&i<12?t.setHours(i+12,0,0,0):s||12!==i?t.setHours(i,0,0,0):t.setHours(0,0,0,0),t}incompatibleTokens=["H","K","k","t","T"]},H:new class extends lh{priority=70;parse(t,e,i){switch(e){case"H":return Ah(uh,t);case"Ho":return i.ordinalNumber(t,{unit:"hour"});default:return Ih(e.length,t)}}validate(t,e){return e>=0&&e<=23}set(t,e,i){return t.setHours(i,0,0,0),t}incompatibleTokens=["a","b","h","K","k","t","T"]},K:new class extends lh{priority=70;parse(t,e,i){switch(e){case"K":return Ah(fh,t);case"Ko":return i.ordinalNumber(t,{unit:"hour"});default:return Ih(e.length,t)}}validate(t,e){return e>=0&&e<=11}set(t,e,i){return t.getHours()>=12&&i<12?t.setHours(i+12,0,0,0):t.setHours(i,0,0,0),t}incompatibleTokens=["h","H","k","t","T"]},k:new class extends lh{priority=70;parse(t,e,i){switch(e){case"k":return Ah(gh,t);case"ko":return i.ordinalNumber(t,{unit:"hour"});default:return Ih(e.length,t)}}validate(t,e){return e>=1&&e<=24}set(t,e,i){const s=i<=24?i%24:i;return t.setHours(s,0,0,0),t}incompatibleTokens=["a","b","h","H","K","t","T"]},m:new class extends lh{priority=60;parse(t,e,i){switch(e){case"m":return Ah(mh,t);case"mo":return i.ordinalNumber(t,{unit:"minute"});default:return Ih(e.length,t)}}validate(t,e){return e>=0&&e<=59}set(t,e,i){return t.setMinutes(i,0,0),t}incompatibleTokens=["t","T"]},s:new class extends lh{priority=50;parse(t,e,i){switch(e){case"s":return Ah(yh,t);case"so":return i.ordinalNumber(t,{unit:"second"});default:return Ih(e.length,t)}}validate(t,e){return e>=0&&e<=59}set(t,e,i){return t.setSeconds(i,0),t}incompatibleTokens=["t","T"]},S:new class extends lh{priority=30;parse(t,e){return Fh(Ih(e.length,t),t=>Math.trunc(t*Math.pow(10,3-e.length)))}set(t,e,i){return t.setMilliseconds(i),t}incompatibleTokens=["t","T"]},X:new class extends lh{priority=10;parse(t,e){switch(e){case"X":return Rh(Dh,t);case"XX":return Rh(zh,t);case"XXXX":return Rh(Eh,t);case"XXXXX":return Rh(Th,t);default:return Rh(Ph,t)}}set(t,e,i){return e.timestampIsSet?t:Gl(t,t.getTime()-oc(t)-i)}incompatibleTokens=["t","T","x"]},x:new class extends lh{priority=10;parse(t,e){switch(e){case"x":return Rh(Dh,t);case"xx":return Rh(zh,t);case"xxxx":return Rh(Eh,t);case"xxxxx":return Rh(Th,t);default:return Rh(Ph,t)}}set(t,e,i){return e.timestampIsSet?t:Gl(t,t.getTime()-oc(t)-i)}incompatibleTokens=["t","T","X"]},t:new class extends lh{priority=40;parse(t){return Lh(t)}set(t,e,i){return[Gl(t,1e3*i),{timestampIsSet:!0}]}incompatibleTokens="*"},T:new class extends lh{priority=20;parse(t){return Lh(t)}set(t,e,i){return[Gl(t,i),{timestampIsSet:!0}]}incompatibleTokens="*"}},Gh=/[yYQqMLwIdDecihHKkms]o|(\w)\1*|''|'(''|[^'])+('|$)|./g,qh=/P+p+|P+|p+|''|'(''|[^'])+('|$)|./g,Kh=/^'([^]*?)'?$/,Xh=/''/g,Zh=/\S/,Qh=/[a-zA-Z]/;function Jh(t,e,i,s){const r=Object.assign({},ec()),a=s?.locale??r.locale??Dc,o=s?.firstWeekContainsDate??s?.locale?.options?.firstWeekContainsDate??r.firstWeekContainsDate??r.locale?.options?.firstWeekContainsDate??1,n=s?.weekStartsOn??s?.locale?.options?.weekStartsOn??r.weekStartsOn??r.locale?.options?.weekStartsOn??0;if(""===e)return""===t?Yl(i):Gl(i,NaN);const l={firstWeekContainsDate:o,weekStartsOn:n,locale:a},c=[new nh],h=e.match(qh).map(t=>{const e=t[0];if(e in Yc){return(0,Yc[e])(t,a.formatLong)}return t}).join("").match(Gh),d=[];for(let r of h){!s?.useAdditionalWeekYearTokens&&Zc(r)&&Qc(r,e,t),!s?.useAdditionalDayOfYearTokens&&Xc(r)&&Qc(r,e,t);const o=r[0],n=Yh[o];if(n){const{incompatibleTokens:e}=n;if(Array.isArray(e)){const t=d.find(t=>e.includes(t.token)||t.token===o);if(t)throw new RangeError(`The format string mustn't contain \`${t.fullToken}\` and \`${r}\` at the same time`)}else if("*"===n.incompatibleTokens&&d.length>0)throw new RangeError(`The format string mustn't contain \`${r}\` and any other token at the same time`);d.push({token:o,fullToken:r});const s=n.run(t,r,a.match,l);if(!s)return Gl(i,NaN);c.push(s.setter),t=s.rest}else{if(o.match(Qh))throw new RangeError("Format string contains an unescaped latin alphabet character `"+o+"`");if("''"===r?r="'":"'"===o&&(r=td(r)),0!==t.indexOf(r))return Gl(i,NaN);t=t.slice(r.length)}}if(t.length>0&&Zh.test(t))return Gl(i,NaN);const p=c.map(t=>t.priority).sort((t,e)=>e-t).filter((t,e,i)=>i.indexOf(t)===e).map(t=>c.filter(e=>e.priority===t).sort((t,e)=>e.subPriority-t.subPriority)).map(t=>t[0]);let u=Yl(i);if(isNaN(u.getTime()))return Gl(i,NaN);const g={};for(const t of p){if(!t.validate(u,l))return Gl(i,NaN);const e=t.set(u,g,l);Array.isArray(e)?(u=e[0],Object.assign(g,e[1])):u=e}return Gl(i,u)}function td(t){return t.match(Kh)[1].replace(Xh,"'")}function ed(t,e){const i=e?.additionalDigits??2,s=function(t){const e={},i=t.split(id.dateTimeDelimiter);let s;if(i.length>2)return e;/:/.test(i[0])?s=i[0]:(e.date=i[0],s=i[1],id.timeZoneDelimiter.test(e.date)&&(e.date=t.split(id.timeZoneDelimiter)[0],s=t.substr(e.date.length,t.length)));if(s){const t=id.timezone.exec(s);t?(e.time=s.replace(t[1],""),e.timezone=t[1]):e.time=s}return e}(t);let r;if(s.date){const t=function(t,e){const i=new RegExp("^(?:(\\d{4}|[+-]\\d{"+(4+e)+"})|(\\d{2}|[+-]\\d{"+(2+e)+"})$)"),s=t.match(i);if(!s)return{year:NaN,restDateString:""};const r=s[1]?parseInt(s[1]):null,a=s[2]?parseInt(s[2]):null;return{year:null===a?r:100*a,restDateString:t.slice((s[1]||s[2]).length)}}(s.date,i);r=function(t,e){if(null===e)return new Date(NaN);const i=t.match(sd);if(!i)return new Date(NaN);const s=!!i[4],r=od(i[1]),a=od(i[2])-1,o=od(i[3]),n=od(i[4]),l=od(i[5])-1;if(s)return function(t,e,i){return e>=1&&e<=53&&i>=0&&i<=6}(0,n,l)?function(t,e,i){const s=new Date(0);s.setUTCFullYear(t,0,4);const r=s.getUTCDay()||7,a=7*(e-1)+i+1-r;return s.setUTCDate(s.getUTCDate()+a),s}(e,n,l):new Date(NaN);{const t=new Date(0);return function(t,e,i){return e>=0&&e<=11&&i>=1&&i<=(ld[e]||(cd(t)?29:28))}(e,a,o)&&function(t,e){return e>=1&&e<=(cd(t)?366:365)}(e,r)?(t.setUTCFullYear(e,a,Math.max(r,o)),t):new Date(NaN)}}(t.restDateString,t.year)}if(!r||isNaN(r.getTime()))return new Date(NaN);const a=r.getTime();let o,n=0;if(s.time&&(n=function(t){const e=t.match(rd);if(!e)return NaN;const i=nd(e[1]),s=nd(e[2]),r=nd(e[3]);if(!function(t,e,i){if(24===t)return 0===e&&0===i;return i>=0&&i<60&&e>=0&&e<60&&t>=0&&t<25}(i,s,r))return NaN;return i*Jl+s*Ql+1e3*r}(s.time),isNaN(n)))return new Date(NaN);if(!s.timezone){const t=new Date(a+n),e=new Date(0);return e.setFullYear(t.getUTCFullYear(),t.getUTCMonth(),t.getUTCDate()),e.setHours(t.getUTCHours(),t.getUTCMinutes(),t.getUTCSeconds(),t.getUTCMilliseconds()),e}return o=function(t){if("Z"===t)return 0;const e=t.match(ad);if(!e)return 0;const i="+"===e[1]?-1:1,s=parseInt(e[2]),r=e[3]&&parseInt(e[3])||0;if(!function(t,e){return e>=0&&e<=59}
/*!
 * chartjs-adapter-date-fns v3.0.0
 * https://www.chartjs.org
 * (c) 2022 chartjs-adapter-date-fns Contributors
 * Released under the MIT license
 */(0,r))return NaN;return i*(s*Jl+r*Ql)}(s.timezone),isNaN(o)?new Date(NaN):new Date(a+n+o)}const id={dateTimeDelimiter:/[T ]/,timeZoneDelimiter:/[Z ]/i,timezone:/([Z+-].*)$/},sd=/^-?(?:(\d{3})|(\d{2})(?:-?(\d{2}))?|W(\d{2})(?:-?(\d{1}))?|)$/,rd=/^(\d{2}(?:[.,]\d*)?)(?::?(\d{2}(?:[.,]\d*)?))?(?::?(\d{2}(?:[.,]\d*)?))?$/,ad=/^([+-])(\d{2})(?::?(\d{2}))?$/;function od(t){return t?parseInt(t):1}function nd(t){return t&&parseFloat(t.replace(",","."))||0}const ld=[31,null,31,30,31,30,31,31,30,31,30,31];function cd(t){return t%400==0||t%4==0&&t%100!=0}const hd={datetime:"MMM d, yyyy, h:mm:ss aaaa",millisecond:"h:mm:ss.SSS aaaa",second:"h:mm:ss aaaa",minute:"h:mm aaaa",hour:"ha",day:"MMM d",week:"PP",month:"MMM yyyy",quarter:"qqq - yyyy",year:"yyyy"};function dd(){return Promise.resolve(Yo)}xa._date.override({_id:"date-fns",formats:function(){return hd},parse:function(t,e){if(null==t)return null;const i=typeof t;return"number"===i||t instanceof Date?t=Yl(t):"string"===i&&(t="string"==typeof e?Jh(t,e,new Date,this.options):ed(t,this.options)),cc(t)?t.getTime():null},format:function(t,e){return function(t,e,i){const s=ec(),r=i?.locale??s.locale??Dc,a=i?.firstWeekContainsDate??i?.locale?.options?.firstWeekContainsDate??s.firstWeekContainsDate??s.locale?.options?.firstWeekContainsDate??1,o=i?.weekStartsOn??i?.locale?.options?.weekStartsOn??s.weekStartsOn??s.locale?.options?.weekStartsOn??0,n=Yl(t);if(!cc(n))throw new RangeError("Invalid time value");let l=e.match(th).map(t=>{const e=t[0];return"p"===e||"P"===e?(0,Yc[e])(t,r.formatLong):t}).join("").match(Jc).map(t=>{if("''"===t)return{isToken:!1,value:"'"};const e=t[0];if("'"===e)return{isToken:!1,value:rh(t)};if(Hc[e])return{isToken:!0,value:t};if(e.match(sh))throw new RangeError("Format string contains an unescaped latin alphabet character `"+e+"`");return{isToken:!1,value:t}});r.localize.preprocessor&&(l=r.localize.preprocessor(n,l));const c={firstWeekContainsDate:a,weekStartsOn:o,locale:r};return l.map(s=>{if(!s.isToken)return s.value;const a=s.value;return(!i?.useAdditionalWeekYearTokens&&Zc(a)||!i?.useAdditionalDayOfYearTokens&&Xc(a))&&Qc(a,e,String(t)),(0,Hc[a[0]])(n,a,r.localize,c)}).join("")}(t,e,this.options)},add:function(t,e,i){switch(i){case"millisecond":return Xl(t,e);case"second":return function(t,e){return Xl(t,1e3*e)}(t,e);case"minute":return function(t,e){return Xl(t,e*Ql)}(t,e);case"hour":return function(t,e){return Xl(t,e*Jl)}(t,e);case"day":return ql(t,e);case"week":return function(t,e){return ql(t,7*e)}(t,e);case"month":return Kl(t,e);case"quarter":return function(t,e){return Kl(t,3*e)}(t,e);case"year":return function(t,e){return Kl(t,12*e)}(t,e);default:return t}},diff:function(t,e,i){switch(i){case"millisecond":return uc(t,e);case"second":return function(t,e,i){const s=uc(t,e)/1e3;return pc(i?.roundingMethod)(s)}(t,e);case"minute":return function(t,e,i){const s=uc(t,e)/Ql;return pc(i?.roundingMethod)(s)}(t,e);case"hour":return function(t,e,i){const s=uc(t,e)/Jl;return pc(i?.roundingMethod)(s)}(t,e);case"day":return hc(t,e);case"week":return function(t,e,i){const s=hc(t,e)/7;return pc(i?.roundingMethod)(s)}(t,e);case"month":return _c(t,e);case"quarter":return function(t,e,i){const s=_c(t,e)/3;return pc(i?.roundingMethod)(s)}(t,e);case"year":return mc(t,e);default:return 0}},startOf:function(t,e,i){switch(e){case"second":return function(t){const e=Yl(t);return e.setMilliseconds(0),e}(t);case"minute":return function(t){const e=Yl(t);return e.setSeconds(0,0),e}(t);case"hour":return function(t){const e=Yl(t);return e.setMinutes(0,0,0),e}(t);case"day":return ac(t);case"week":return ic(t);case"isoWeek":return ic(t,{weekStartsOn:+i});case"month":return function(t){const e=Yl(t);return e.setDate(1),e.setHours(0,0,0,0),e}(t);case"quarter":return function(t){const e=Yl(t),i=e.getMonth(),s=i-i%3;return e.setMonth(s,1),e.setHours(0,0,0,0),e}(t);case"year":return yc(t);default:return t}},endOf:function(t,e){switch(e){case"second":return function(t){const e=Yl(t);return e.setMilliseconds(999),e}(t);case"minute":return function(t){const e=Yl(t);return e.setSeconds(59,999),e}(t);case"hour":return function(t){const e=Yl(t);return e.setMinutes(59,59,999),e}(t);case"day":return gc(t);case"week":return function(t){const e=ec(),i=e.weekStartsOn??e.locale?.options?.weekStartsOn??0,s=Yl(t),r=s.getDay(),a=6+(r<i?-7:0)-(r-i);return s.setDate(s.getDate()+a),s.setHours(23,59,59,999),s}(t);case"month":return fc(t);case"quarter":return function(t){const e=Yl(t),i=e.getMonth(),s=i-i%3+3;return e.setMonth(s,0),e.setHours(23,59,59,999),e}(t);case"year":return function(t){const e=Yl(t),i=e.getFullYear();return e.setFullYear(i+1,0,0),e.setHours(23,59,59,999),e}(t);default:return t}}}),Yo.register(...Ul);const pd=ht||{solar:"#ff9800",gridImport:"#488fc2",gridExport:"#8353d1",batteryOut:"#4db6ac",home:"#5BC8D8",ev:"#8DC892"},ud={costs:{title:"energy_costs",y_label:"_currency_",stacked:!1,daily:[{suffix:"daily_costs",name:"Import",color:pd.gridImport,type:"bar"},{suffix:"daily_export_revenue",name:"export",color:pd.gridExport,type:"bar"},{suffix:"daily_net_cost",name:"net",color:pd.solar,type:"line"}],monthly:[{suffix:"monthly_costs",name:"Import",color:pd.gridImport,type:"bar"},{suffix:"monthly_export_revenue",name:"export",color:pd.gridExport,type:"bar"},{suffix:"monthly_net_cost",name:"net",color:pd.solar,type:"line"}]},savings:{title:"energy_savings",y_label:"_currency_",stacked:!0,daily:[{suffix:"daily_savings",name:"solar_savings",color:pd.solar,type:"area"},{suffix:"daily_battery_savings",name:"battery_savings",color:pd.batteryOut,type:"area"}],monthly:[{suffix:"monthly_savings",name:"solar_savings",color:pd.solar,type:"area"},{suffix:"monthly_battery_savings",name:"battery_savings",color:pd.batteryOut,type:"area"}]},energy:{title:"energy_balance",y_label:"kWh",stacked:!1,defaultPeriod:"7d",daily:[{suffix:"daily_solar_energy",name:"solar",color:pd.solar,type:"bar"},{suffix:"daily_home_energy",name:"home",color:pd.home,type:"bar"},{suffix:"daily_grid_import_energy",name:"grid_import",color:pd.gridImport,type:"bar"},{suffix:"daily_grid_export_energy",name:"grid_export",color:pd.gridExport,type:"bar"}],monthly:[{suffix:"monthly_solar_energy",name:"solar",color:pd.solar,type:"bar"},{suffix:"monthly_home_energy",name:"home",color:pd.home,type:"bar"},{suffix:"monthly_grid_import_energy",name:"grid_import",color:pd.gridImport,type:"bar"},{suffix:"monthly_grid_export_energy",name:"grid_export",color:pd.gridExport,type:"bar"}]},power:{title:"power_flow",y_label:"W",stacked:!1,hourly:[{suffix:"solar_power",name:"solar",color:pd.solar,type:"area"},{suffix:"home_consumption_power",name:"home",color:pd.home,type:"area"},{suffix:"grid_power",name:"grid",color:pd.gridImport,type:"area"}]},battery:{title:"battery",y_label:"W",y2_label:"%",stacked:!1,hourly:[{suffix:"battery_power",name:"power",color:pd.batteryOut,type:"area"},{suffix:"battery_soc",name:"soc",color:"#ff9800",type:"line",y_axis:1}]},ev:{title:"ev_charging",y_label:"W",stacked:!0,defaultPeriod:"today",y_min:0,y_suggested_max:2e3,hourly:[{suffix:"flow_solar_to_ev_power",name:"solar",color:pd.solar,type:"area"},{suffix:"flow_battery_to_ev_power",name:"battery",color:pd.batteryOut,type:"area"},{suffix:"flow_grid_to_ev_power",name:"grid",color:pd.gridImport,type:"area"}],daily:[{suffix:"daily_ev_energy",name:"ev_energy",color:pd.ev,type:"bar"}],monthly:[{suffix:"monthly_ev_energy",name:"ev_energy",color:pd.ev,type:"bar"}]}};bt("eb-chart-card",class extends vt{constructor(){super(),this._chart=null,this._period=null,this._fetchTimer=null,this._cachedChartTheme=null,this._boundPeriodHandler=t=>this._onPeriodChange(t.detail),this._prefix="sensor.ebi_",this._preset=null,this._emptyMsg=""}setConfig(t){if(!t.preset&&!t.series)throw new Error("eb-chart-card requires either preset or series config");this._config=t,this._prefix=t.entity_prefix||"sensor.ebi_",this._preset=t.preset?ud[t.preset]:null,this.requestUpdate()}set hass(t){this._hass=t;const e=t?.language;if(e!==this._lang)return this._lang=e,void this.requestUpdate();this._period||this._setDefaultPeriod()}get hass(){return this._hass}connectedCallback(){super.connectedCallback(),document.addEventListener("eb-period-change",this._boundPeriodHandler),this._rollInterval=setInterval(()=>this._rollRelativePeriod(),3e5),this._boundVisibility=()=>{document.hidden||this._rollRelativePeriod()},document.addEventListener("visibilitychange",this._boundVisibility)}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("eb-period-change",this._boundPeriodHandler),this._boundVisibility&&document.removeEventListener("visibilitychange",this._boundVisibility),clearInterval(this._rollInterval),this._chart&&(this._chart.destroy(),this._chart=null),clearTimeout(this._fetchTimer)}_rollRelativePeriod(){if(!this._period||!this._hass)return;const t=this._config?.default_period||this._preset?.defaultPeriod,e="24h"===t?"24h":"7d"===t?"7d":"today"===t?"today":"week";this._period.key===e&&this._setDefaultPeriod()}firstUpdated(){this._period||this._setDefaultPeriod()}static get styles(){return a`
            :host { display: block; }
            .eb-chart-wrap {
                padding: 16px;
                min-height: 280px;
                position: relative;
            }
            .chart-header { margin-bottom: 12px; }
            .chart-title {
                font-size: 15px; font-weight: 600;
                color: var(--primary-text-color, #e0e0e0);
                font-family: 'Segoe UI','Roboto',sans-serif;
                letter-spacing: 0.3px;
                font-variant-numeric: tabular-nums;
            }
            .chart-subtitle {
                font-size: 12px;
                color: var(--secondary-text-color, #757575);
                margin-top: 2px;
                font-family: 'Segoe UI','Roboto',sans-serif;
                font-variant-numeric: tabular-nums;
            }
            .chart-container {
                position: relative;
                height: 250px;
                filter: drop-shadow(0 0 1px rgba(200,220,240,0.10));
            }
            canvas { width: 100% !important; height: 100% !important; }
            .empty-msg {
                position: absolute;
                inset: 0;
                display: none;
                align-items: center;
                justify-content: center;
                color: var(--secondary-text-color, #616161);
                font-size: 13px;
                font-family: 'Segoe UI','Roboto',sans-serif;
            }
            .empty-msg.visible { display: flex; }
        `}render(){const t=this._preset||{},e=this._config?.title?this._t(this._config.title):this._t(t.title||"SEM Chart"),i=this._period?.labelKey?this._t(this._period.labelKey):"";return j`
            <ha-card>
                <div class="eb-chart-wrap">
                    <div class="chart-header">
                        <div class="chart-title">${e}</div>
                        <div class="chart-subtitle">${i}</div>
                    </div>
                    <div class="chart-container">
                        <canvas style="display:${this._emptyMsg?"none":"block"}"></canvas>
                        <div class="empty-msg ${this._emptyMsg?"visible":""}">${this._emptyMsg}</div>
                    </div>
                </div>
            </ha-card>
        `}_startOfDayInHaTz(t){return function(t,e){if(!e)return new Date(t.getFullYear(),t.getMonth(),t.getDate());try{const i=new Intl.DateTimeFormat("en-US",{timeZone:e,year:"numeric",month:"2-digit",day:"2-digit"}),s=Object.fromEntries(i.formatToParts(t).map(t=>[t.type,t.value])),r=new Date(Number(s.year),Number(s.month)-1,Number(s.day),0,0,0,0),a=new Intl.DateTimeFormat("en-US",{timeZone:e,hour:"2-digit",minute:"2-digit",hour12:!1}).formatToParts(r),o=Number(a.find(t=>"hour"===t.type).value),n=Number(a.find(t=>"minute"===t.type).value),l=(60*o+n)%1440,c=0===l?0:l<=720?-l:1440-l;return new Date(r.getTime()+60*c*1e3)}catch(e){return new Date(t.getFullYear(),t.getMonth(),t.getDate())}}(t,this._hass?.config?.time_zone)}_setDefaultPeriod(){const t=new Date,e=this._preset,i=this._config?.default_period||e&&e.defaultPeriod,s="today"===i;if(s||"24h"===i||e&&e.hourly&&!e.daily){const e=s?this._startOfDayInHaTz(t):new Date(t.getTime()-864e5),i=s?"period_today":"last_24h",r=s?"today":"24h";this._onPeriodChange({start:e,end:t,granularity:"hour",labelKey:i,key:r})}else if("7d"===i){const e=this._startOfDayInHaTz(t);e.setDate(e.getDate()-6),this._onPeriodChange({start:e,end:t,granularity:"day",labelKey:"last_7_days",key:"7d"})}else{const e=t.getDay()||7,i=this._startOfDayInHaTz(t);i.setDate(i.getDate()-(e-1)),this._onPeriodChange({start:i,end:t,granularity:"day",labelKey:"period_this_week",key:"week"})}}_onPeriodChange(t){this._period={...t,labelKey:t.labelKey||{today:"period_today",yesterday:"period_yesterday",week:"period_this_week",month:"period_this_month",year:"period_this_year","24h":"last_24h","7d":"last_7_days"}[t.key]},this.requestUpdate(),clearTimeout(this._fetchTimer),this._fetchTimer=setTimeout(()=>this._fetchAndRender(),150)}_resolveSeries(){if(this._config?.series)return this._config.series.map(t=>({entity:t.entity,name:t.name||t.entity,color:t.color||"#42A5F5",type:t.type||"bar",y_axis:t.y_axis||0}));const t=this._preset;if(!t)return[];const e=this._period?.granularity||"day";if(this._config?.per_charger&&"ev"===this._config?.preset&&"hour"===e)return this._discoverPerChargerSeries();return("hour"===e&&t.hourly?t.hourly:"month"===e&&t.monthly?t.monthly:t.daily||t.hourly||[]).map(t=>({entity:`${this._prefix}${t.suffix}`,name:this._t(t.name),color:t.color,type:t.type,y_axis:t.y_axis||0}))}_discoverPerChargerSeries(){const t=this._hass?.states||{},e=["#8DC892","#64B5F6","#FFB74D","#BA68C8","#4DB6AC","#F06292","#A1887F","#7986CB"],i=/^sensor\.ebi_charger_(.+)_power$/,s=[];for(const e of Object.keys(t)){const r=e.match(i);if(!r)continue;const a=r[1],o=t[e]?.attributes?.friendly_name?.replace(/^SEM\s+/i,"").replace(/\s+Power$/i,"")||a.replace(/_/g," ");s.push({id:a,eid:e,friendly:o})}return s.sort((t,e)=>t.id.localeCompare(e.id)),s.map((t,i)=>({entity:t.eid,name:t.friendly,color:e[i%e.length],type:"area",y_axis:0}))}async _fetchAndRender(){if(!this._hass||!this._period)return;const t=this._resolveSeries();if(!t.length)return;const{start:e,end:i,granularity:s}=this._period;let r;try{r=await this._fetchStatistics(t,e.toISOString(),i.toISOString(),s)}catch(t){return console.debug("eb-chart-card: fetch error",t),void this._showEmpty(this._t("data_unavailable"))}r&&!r.every(t=>!t.data.length)?(this._hideEmpty(),await this.updateComplete,await this._renderChart(r,t)):this._showEmpty(this._t("no_data_for_period"))}async _fetchStatistics(t,e,i,s){const r=t.map(t=>t.entity),a="month"===s?"month":"hour"===s?"hour":"day";let o;try{o=await this._hass.callWS({type:"recorder/statistics_during_period",start_time:e,end_time:i,statistic_ids:r,period:a,types:["state","mean","max"]})}catch{o=await this._hass.callWS({type:"history/statistics_during_period",start_time:e,end_time:i,statistic_ids:r,period:a})}const n=(this._config?.stacked??this._preset?.stacked??!1)&&"hour"===a;return t.map(t=>({data:(o[t.entity]||[]).map(t=>({x:new Date(t.start),y:n?t.mean??t.state??0:t.max??t.state??t.mean??0}))}))}async _renderChart(t,e){const i=await dd(),s=this.renderRoot.querySelector("canvas");if(!s)return;const r=this._theme(),a=this._preset||{},o=this._config?.stacked??a.stacked??!1;let n=this._config?.y_label||a.y_label||"";"_currency_"===n&&(n=ft(this._hass));const l=a.y2_label||"",c=e.some(t=>1===t.y_axis),h=this._period?.granularity||"day",d=s.getContext("2d"),p=e.map((e,i)=>{const s="area"===e.type,r="bar"===e.type;return{label:e.name,data:t[i].data,backgroundColor:r?e.color+"CC":s?e.color+"30":"transparent",borderColor:e.color,borderWidth:r?0:2,fill:!!s&&(o&&i>0?"-1":"origin"),type:r?"bar":"line",tension:.4,pointRadius:0,pointHitRadius:10,pointHoverRadius:4,pointHoverBorderWidth:2,pointHoverBackgroundColor:e.color,pointHoverBorderColor:"#fff",yAxisID:1===e.y_axis?"y1":"y",order:r?2:1,borderRadius:r?4:0,barPercentage:.7}}),u="hour"===h?"hour":"month"===h?"month":"day",g={id:"crosshair",afterDraw(t){if(t.tooltip?._active?.length){const e=t.tooltip._active[0].element.x,i=t.scales.y,s=t.ctx;s.save(),s.beginPath(),s.moveTo(e,i.top),s.lineTo(e,i.bottom),s.lineWidth=1,s.strokeStyle="rgba(255,255,255,0.15)",s.stroke(),s.restore()}}},f={type:"bar",data:{datasets:p},plugins:[g,{id:"gradientFill",beforeDatasetsDraw(t){const i=t.ctx;t.data.datasets.forEach((s,r)=>{if("area"!==e[r]?.type)return;if(t.getDatasetMeta(r).hidden)return;const a=t.scales[s.yAxisID||"y"];if(!a)return;const o=i.createLinearGradient(0,a.top,0,a.bottom);o.addColorStop(0,s.borderColor+"60"),o.addColorStop(.6,s.borderColor+"18"),o.addColorStop(1,s.borderColor+"02"),s.backgroundColor=o})}}],options:{responsive:!0,maintainAspectRatio:!1,animation:{duration:300,easing:"easeOutQuart"},interaction:{mode:"index",intersect:!1},plugins:{legend:{display:!0,position:"bottom",labels:{color:r.textSec||"#9e9e9e",font:{size:11,weight:"500",family:"'Segoe UI','Roboto',sans-serif"},boxWidth:12,boxHeight:12,borderRadius:3,useBorderRadius:!0,padding:14,generateLabels:t=>i.defaults.plugins.legend.labels.generateLabels(t).map((e,i)=>{const s=t.data.datasets[i];if(!s)return e;const r=s.data[s.data.length-1],a=r?.y??0,o="y1"===s.yAxisID?"%":n||"",l=Math.abs(a),c=l>=1e3?(a/1e3).toFixed(1)+"k":l<10?a.toFixed(1):a.toFixed(0);return e.text=`${e.text}: ${c} ${o}`,e})}},tooltip:{backgroundColor:r.tooltipBg||"rgba(15,18,25,0.94)",titleColor:r.tooltipText||"#e0e0e0",titleFont:{family:"'Segoe UI','Roboto',sans-serif",weight:"600",size:12},bodyColor:r.textSec||"#b0b0b0",bodyFont:{family:"'Segoe UI','Roboto',sans-serif",size:11},borderColor:r.tooltipBorder||"rgba(255,255,255,0.08)",borderWidth:1,cornerRadius:10,padding:{top:10,bottom:10,left:14,right:14},bodySpacing:6,displayColors:!0,boxPadding:4,callbacks:{title:t=>{if(!t||!t.length)return"";const e=new Date(t[0].parsed.x);if(isNaN(e))return"";const i=this._hass?.language||"en",s=this._hass?.config?.time_zone||void 0;try{return"hour"===h?e.toLocaleTimeString(i,{hour:"2-digit",minute:"2-digit",timeZone:s}):"month"===h?e.toLocaleDateString(i,{month:"short",year:"numeric",timeZone:s}):e.toLocaleDateString(i,{day:"numeric",month:"short",timeZone:s})}catch(t){return"hour"===h?e.toLocaleTimeString(i):e.toLocaleDateString(i)}},label:t=>{const e=t.parsed.y,i="y1"===t.dataset.yAxisID?"%":n,s=Math.abs(e),r=s>=1e3?(e/1e3).toFixed(1)+"k":s<10?e.toFixed(2):e.toFixed(1);return` ${t.dataset.label}: ${r} ${i}`}}}},scales:{x:{type:"time",min:this._period.start.toISOString(),max:this._period.end.toISOString(),time:{unit:u,tooltipFormat:"hour"===h?"HH:mm":"month"===h?"MMM yyyy":"dd MMM",displayFormats:{hour:"HH:mm",day:"dd MMM",month:"MMM"}},grid:{color:"rgba(255,255,255,0.02)",drawBorder:!1,drawTicks:!1},ticks:{color:r.textSec||"#757575",font:{size:10,family:"'Segoe UI','Roboto',sans-serif"},maxRotation:0,padding:6,callback:(t,e,i)=>{const s=i[e];if(!s)return t;const r=new Date(s.value);if(isNaN(r))return t;const a=this._hass?.language||"en",o=this._hass?.config?.time_zone||void 0;try{return"hour"===u?r.toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit",timeZone:o}):"month"===u?r.toLocaleDateString(a,{month:"short",timeZone:o}):r.toLocaleDateString(a,{day:"numeric",month:"short",timeZone:o})}catch(t){return"hour"===u?r.toLocaleTimeString(a,{hour:"2-digit",minute:"2-digit"}):r.toLocaleDateString(a,{day:"numeric",month:"short"})}}},stacked:o},y:{position:"left",grid:{color:"rgba(255,255,255,0.04)",drawBorder:!1,drawTicks:!1},ticks:{color:r.textSec||"#757575",font:{size:10,family:"'Segoe UI','Roboto',sans-serif"},padding:8,callback:t=>{const e=Math.abs(t);return e>=1e3?(t/1e3).toFixed(1)+"k":e<.01&&e>0?"":t%1==0?t:t.toFixed(1)}},title:{display:!!n,text:n,color:r.textSec||"#757575",font:{size:11,family:"'Segoe UI','Roboto',sans-serif"}},stacked:o,beginAtZero:"W"!==n||0===this._preset?.y_min,...null!=this._preset?.y_min?{min:this._preset.y_min}:{},...null!=this._preset?.y_suggested_max?{suggestedMax:this._preset.y_suggested_max}:{}}}}};c&&(f.options.scales.y1={position:"right",grid:{drawOnChartArea:!1,drawTicks:!1},ticks:{color:"#ff9800",font:{size:10},padding:8,callback:t=>t+"%"},title:{display:!!l,text:l,color:"#ff9800",font:{size:11}},min:0,max:100}),this._chart&&(this._chart.destroy(),this._chart=null),this._chart=new i(d,f)}_showEmpty(t){this._emptyMsg=t,this.requestUpdate()}_hideEmpty(){this._emptyMsg&&(this._emptyMsg="",this.requestUpdate())}getCardSize(){return 5}static getStubConfig(){return{preset:"costs"}}},{type:"eb-chart-card",name:"SEM Chart",description:"Period-reactive chart with glassmorphism styling and built-in presets"});const gd=[{id:"surplus",icon:"mdi:solar-power",color:"#ff9800",titleKey:"surplus_control",subtitleFn:t=>{const e=t._valNum("surplus_active_devices").toFixed(0),i=t._valNum("surplus_total_devices").toFixed(0),s=t._valNum("surplus_allocated_w").toFixed(0);return`${e}/${i} ${t._t("devices")} · ${s}W`}},{id:"battery",icon:"mdi:battery-medium",color:"#4db6ac",titleKey:"battery_management",subtitleFn:t=>{const e=t._valNum("battery_soc").toFixed(0),i=t._val("battery_status")||"";return`SOC ${e}% · ${i?t._t(i.toLowerCase()):"—"}`}},{id:"tariff",icon:"mdi:cash-multiple",color:"#96CAEE",titleKey:"tariff_pricing",subtitleFn:t=>{const e=t._val("tariff_provider")||"—",i=t._val("tariff_price_level")||"";return i?`${e} · ${t._t(i.toLowerCase())}`:e}},{id:"peak",icon:"mdi:flash-alert",color:"#ff9800",titleKey:"peak_load_management",subtitleFn:t=>{const e=pt(t._valNum("consecutive_peak_15min")),i=pt(t._valNum("monthly_consecutive_peak"));return`${t._t("peak")} ${e} · ${t._t("monthly_peak")} ${i}`}}],fd=["sensor.ebi_surplus_active_devices","sensor.ebi_surplus_total_devices","sensor.ebi_surplus_allocated_w","sensor.ebi_surplus_total_w","sensor.ebi_surplus_distributable_w","sensor.ebi_surplus_unallocated_w","sensor.ebi_battery_soc","sensor.ebi_battery_status","sensor.ebi_diag_battery_capacity","number.ebi_legionella_target_temp","binary_sensor.ebi_heat_pump_registered","sensor.ebi_heat_pump_sg_ready_state","sensor.ebi_heat_pump_mode","binary_sensor.ebi_heat_pump_solar_boost","sensor.ebi_tariff_provider","sensor.ebi_tariff_price_level","sensor.ebi_tariff_current_import_rate","sensor.ebi_consecutive_peak_15min","sensor.ebi_monthly_consecutive_peak","sensor.ebi_current_vs_peak_percentage","sensor.ebi_load_management_status","sensor.ebi_load_management_recommendation","sensor.ebi_peak_margin","sensor.ebi_available_load_reduction","sensor.ebi_controllable_devices_count","switch.ebi_observer_mode"];bt("eb-control-card",class extends vt{static get watchedEntities(){return fd}static get properties(){return{...super.properties}}constructor(){super(),this._collapsed={surplus:!0,battery:!1,hotwater:!0,heatpump:!0,tariff:!1,peak:!0}}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||"sensor.ebi_"}_val(t){const e=this._hass?.states[`${this._prefix}${t}`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?e.state:""}_valNum(t,e=0){const i=this._hass?.states[`${this._prefix}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_numVal(t,e=0){const i=this._hass?.states[`number.${this._objPrefix()}${t}`];return i&&"unavailable"!==i.state&&"unknown"!==i.state?parseFloat(i.state)??e:e}_switchOn(t){return"on"===this._hass?.states[`switch.${this._objPrefix()}${t}`]?.state}_bin(t){return"on"===this._hass?.states[`binary_sensor.${this._objPrefix()}${t}`]?.state}_toggleSection(t){this._collapsed={...this._collapsed,[t]:!this._collapsed[t]},this.requestUpdate()}_renderStepper(t,e,i,s){const r=this._hass?.states[t];if(!r)return Y;const a=this._frozenEntities[t],o=a?a.value:parseFloat(r.state)||0,n=parseFloat(r.attributes.step)||1,l=r.attributes.unit_of_measurement||"",c=n<1?1:0,h=o.toFixed(c)+(l?" "+l:"");return j`
            <div class="stepper-cell">
                <div class="stepper-row">
                    <span class="stepper-label">${this._t(e)}</span>
                    <div class="stepper-controls">
                        <button
                            class="stepper-minus" aria-label="Decrease"
                            @click=${()=>this._stepNumber(t,-1)}
                            @pointerdown=${()=>this._startHold(t,-1)}
                            @pointerup=${()=>this._stopHold(t)}
                            @pointerleave=${()=>this._stopHold(t)}
                        >−</button>
                        <span class="stepper-value">${h}</span>
                        <button
                            class="stepper-plus" aria-label="Increase"
                            @click=${()=>this._stepNumber(t,1)}
                            @pointerdown=${()=>this._startHold(t,1)}
                            @pointerup=${()=>this._stopHold(t)}
                            @pointerleave=${()=>this._stopHold(t)}
                        >+</button>
                    </div>
                </div>
                ${this._showHelp&&s?j`<div class="setting-help-text">${this._t(s)}</div>`:Y}
            </div>
        `}_renderSelect(t,e,i){const s=this._hass?.states[t];if(!s)return Y;const r=this._frozenEntities[t],a=r?r.value:s.state,o=s.attributes.options||[];return j`
            <div class="ctrl-row">
                <span class="ctrl-label">${this._t(e)}</span>
                <select
                    class="eb-select"
                    .value=${a}
                    @change=${e=>this._selectOption(t,e.target.value)}
                >
                    ${o.map(t=>j`<option value="${t}" ?selected=${t===a}>${t}</option>`)}
                </select>
            </div>
        `}_renderSurplusSection(t){const e=this._valNum("surplus_total_w").toFixed(0),i=this._valNum("surplus_distributable_w").toFixed(0),s=this._valNum("surplus_allocated_w").toFixed(0),r=this._valNum("surplus_unallocated_w").toFixed(0);return j`
            <div class="info-tiles">
                <div class="info-tile">
                    <ha-icon icon="mdi:solar-power" style="--mdc-icon-size:18px;color:#ff9800"></ha-icon>
                    <div class="info-tile-content">
                        <span class="info-tile-label">${this._t("surplus_available")}</span>
                        <span class="info-tile-values">
                            <span>${e}W</span>
                            <span class="info-tile-sep">·</span>
                            <span>${i}W</span>
                        </span>
                    </div>
                </div>
                <div class="info-tile">
                    <ha-icon icon="mdi:chart-pie" style="--mdc-icon-size:18px;color:#8DC892"></ha-icon>
                    <div class="info-tile-content">
                        <span class="info-tile-label">${this._t("surplus_allocation")}</span>
                        <span class="info-tile-values">
                            <span>${s}W</span>
                            <span class="info-tile-sep">·</span>
                            <span>${r}W</span>
                        </span>
                    </div>
                </div>
            </div>
        `}_renderBatterySection(t){const e=this._valNum("diag_battery_capacity"),i=e>0?e.toFixed(1)+" kWh":"—",s=this._val("diag_grid_sign")||"—";return j`
            <div class="readonly-row">
                <span class="ctrl-label">${this._t("capacity_kwh")}</span>
                <span class="readonly-value">${i}</span>
            </div>
            <div class="readonly-row">
                <span class="ctrl-label">${this._t("grid_sign")}</span>
                <span class="readonly-value">${s}</span>
            </div>
        `}_renderHeatPumpSection(t){if(!this._bin("heat_pump_registered"))return j`<div class="info-box-text" style="opacity:0.6">
                ${this._t("heat_pump_not_configured")}
            </div>`;const e=this._val("heat_pump_sg_ready_state"),i=this._val("heat_pump_mode")||"—",s=this._switchOn("heat_pump_solar_boost")?"#ff9800":"#4db6ac";return j`
            <div class="readonly-row">
                <ha-icon icon="mdi:heat-pump-outline" style="--mdc-icon-size:18px;color:${s}"></ha-icon>
                <span class="ctrl-label" style="flex:1">${this._t("heat_pump_mode")}</span>
                <span class="readonly-value">${this._t(i.toLowerCase())||i}</span>
            </div>
            <div class="readonly-row">
                <ha-icon icon="mdi:transmission-tower" style="--mdc-icon-size:18px;color:${s}"></ha-icon>
                <span class="ctrl-label" style="flex:1">${this._t("heat_pump_sg_ready_state")}</span>
                <span class="readonly-value">${e}</span>
            </div>
        `}_renderHotWaterSection(t){return j`
            ${this._renderStepper(`number.${this._objPrefix()}legionella_target_temp`,"legionella_target",t)}
            <div class="info-box">
                <ha-icon icon="mdi:shield-alert" style="--mdc-icon-size:16px;color:#ff9800"></ha-icon>
                <div>
                    <div class="info-box-title">${this._t("legionella_prevention")}</div>
                    <div class="info-box-text">
                        DE (DVGW W 551): ≥ 60°C · CH (SIA 385/1): ≥ 60°C · AT (ÖNORM B 5019): 60°C / 70°C 3 min
                    </div>
                </div>
            </div>
        `}_renderTariffSection(t){const e=this._hass?.states[`${this._prefix}tariff_current_import_rate`],i=e?e.state:"—",s=e?.attributes?.unit_of_measurement||"";return j`
            <div class="readonly-row tariff-rate-row">
                <ha-icon icon="mdi:flash" style="--mdc-icon-size:18px;color:#ff9800"></ha-icon>
                <span class="ctrl-label" style="flex:1">${this._t("current_electricity_price")}</span>
                <span class="readonly-value tariff-rate-value">${i} ${s}</span>
            </div>
        `}_renderPeakSection(t){const e=this._valNum("current_vs_peak_percentage"),i=e>90?"#f44336":e>70?"#ff9800":"#8DC892",s=this._valNum("controllable_devices_count").toFixed(0),r=this._valNum("available_load_reduction");return j`
            <div class="peak-hero">
                <span class="peak-pct" style="color:${i}">${e.toFixed(0)}%</span>
                <span class="peak-of-limit">${this._t("of_limit")}</span>
            </div>
            <div class="peak-detail">
                <span class="peak-status">${(()=>{const t=this._val("load_management_status");return t?this._t(t):"—"})()}</span>
                <span class="peak-sep">·</span>
                <span class="peak-rec">${(()=>{const t=this._val("load_management_recommendation");return t?this._t(t):""})()}</span>
            </div>
            <div class="info-tiles">
                <div class="info-tile">
                    <ha-icon icon="mdi:shield-check" style="--mdc-icon-size:18px;color:#8DC892"></ha-icon>
                    <div class="info-tile-content">
                        <span class="info-tile-label">${this._t("peak_margin")}</span>
                        <span class="info-tile-value">${pt(this._valNum("peak_margin"))}</span>
                    </div>
                </div>
                <div class="info-tile">
                    <ha-icon icon="mdi:power-plug-off" style="--mdc-icon-size:18px;color:#ff9800"></ha-icon>
                    <div class="info-tile-content">
                        <span class="info-tile-label">${this._t("sheddable")}</span>
                        <span class="info-tile-value">${pt(r)} · ${s} ${this._t("devices")}</span>
                    </div>
                </div>
            </div>
        `}_renderSectionHeader(t,e){const i=this._collapsed[t.id],s=i?"rotate(-90deg)":"rotate(0deg)";return j`
            <div
                class="section-header"
                tabindex="0"
                role="button"
                aria-expanded="${!i}"
                @click=${()=>this._toggleSection(t.id)}
                @keydown=${e=>{"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this._toggleSection(t.id))}}
            >
                <ha-icon icon="${t.icon}" style="--mdc-icon-size:20px;color:${t.color}"></ha-icon>
                <span class="section-title-text">${this._t(t.titleKey)}</span>
                <span class="section-subtitle">${t.subtitleFn(this)}</span>
                <ha-icon
                    class="chevron"
                    icon="mdi:chevron-down"
                    style="--mdc-icon-size:18px;transform:${s}"
                ></ha-icon>
            </div>
        `}_renderSection(t,e,i){const s=this._collapsed[t.id];return j`
            <div class="section ${s?"":"expanded"}"
                 style="--section-accent: ${t.color}">
                ${this._renderSectionHeader(t,i)}
                <div class="section-content ${s?"":"expanded"}">
                    <div class="section-body">
                        ${e(i)}
                    </div>
                </div>
            </div>
        `}render(){if(!this._config)return Y;const t=this._theme(),e=!1!==t.isDark,i=t.accent||"#42a5f5",s=this._switchOn("observer_mode"),r={surplus:t=>this._renderSurplusSection(t),battery:t=>this._renderBatterySection(t),hotwater:t=>this._renderHotWaterSection(t),heatpump:t=>this._renderHeatPumpSection(t),tariff:t=>this._renderTariffSection(t),peak:t=>this._renderPeakSection(t)};return j`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px;
                    position: relative;
                    background:
                        radial-gradient(ellipse 70% 60% at 50% 25%, rgba(150,202,238,0.06) 0%, transparent 100%),
                        radial-gradient(circle at 2px 2px, ${t.dotColor} 0.7px, transparent 0.7px);
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }

                /* ── Observer warning ── */
                .observer-warning {
                    display: flex; align-items: center; gap: 10px;
                    border-radius: 12px;
                    background: radial-gradient(ellipse 60% 50% at 50% 40%, rgba(244,67,54,0.12) 0%, transparent 100%);
                    border: 1px solid rgba(244,67,54,0.35);
                    color: #f44336;
                    font-size: 13px; font-weight: 500;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.2s ease, margin-bottom 0.3s ease, padding 0.3s ease;
                    max-height: ${s?"60px":"0"};
                    opacity: ${s?"1":"0"};
                    margin-bottom: ${s?"12px":"0"};
                    padding: ${s?"12px 16px":"0 16px"};
                }

                /* ── Sections (polish: color accent + EV-card-matching typography) ── */
                .section {
                    margin-bottom: 10px;
                    border-radius: 14px;
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    overflow: hidden;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    position: relative;
                }
                /* When expanded: subtle color-coded accent stripe matching the
                   section icon's color, plus a soft glow that ties the card
                   together with the EV card's hint-row aesthetic. */
                .section.expanded {
                    border-color: color-mix(in srgb, var(--section-accent) 40%, ${t.surfaceBorder});
                    box-shadow: inset 3px 0 0 0 var(--section-accent);
                }
                .section:hover { border-color: ${e?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)"}; }

                .section-header {
                    display: flex; align-items: center; gap: 10px;
                    padding: 13px 14px;
                    cursor: pointer;
                    user-select: none;
                    -webkit-user-select: none;
                    transition: background 0.15s;
                }
                .section-header:hover { background: ${t.surfaceHover}; }
                .section.expanded .section-header {
                    background: color-mix(in srgb, var(--section-accent) 6%, transparent);
                }
                .section-title-text {
                    font-size: 15px; font-weight: 600;
                    white-space: nowrap;
                    letter-spacing: 0.1px;
                }
                .section-subtitle {
                    flex: 1;
                    font-size: 13px;
                    color: var(--secondary-text-color, ${t.textSec});
                    text-align: right;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    margin-right: 4px;
                }
                .chevron {
                    transition: transform 0.25s ease;
                    color: var(--secondary-text-color, ${t.textSec});
                    flex-shrink: 0;
                }

                /* ── Collapsible content ── */
                .section-content {
                    max-height: 0;
                    opacity: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.2s ease;
                }
                .section-content.expanded {
                    max-height: 1000px;
                    opacity: 1;
                }
                .section-body { padding: 0 14px 14px; }

                .stepper-cell { display: flex; flex-direction: column; }

                /* ── Select ── */
                .ctrl-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 8px 0;
                    border-bottom: 1px solid ${t.surfaceBorder};
                    margin-bottom: 4px;
                }
                .ctrl-label { font-size: 14px; font-weight: 500; }
                .eb-select {
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    border-radius: 8px;
                    color: var(--primary-text-color, ${t.text});
                    padding: 6px 10px;
                    font-size: 14px;
                    font-family: inherit;
                    cursor: pointer;
                    min-width: 120px;
                    outline: none;
                }
                .eb-select:focus { border-color: ${i}; }
                .eb-select option {
                    background: ${e?"#1e232d":"#fff"};
                    color: ${e?"#e0e0e0":"#333"};
                }

                /* ── Number stepper ── */
                .stepper-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 7px 0;
                }
                .stepper-label {
                    font-size: 14px; font-weight: 500;
                    flex: 1; min-width: 0;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .stepper-controls { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
                .stepper-minus, .stepper-plus {
                    width: 30px; height: 30px;
                    border-radius: 8px;
                    border: 1px solid ${t.surfaceBorder};
                    background: ${t.surface};
                    color: var(--primary-text-color, ${t.text});
                    font-size: 16px; font-weight: 600;
                    cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s, border-color 0.15s;
                    user-select: none; -webkit-user-select: none;
                    touch-action: manipulation;
                    padding: 0; line-height: 1;
                }
                .stepper-minus:hover, .stepper-plus:hover {
                    background: ${t.surfaceHover};
                    border-color: ${i};
                }
                .stepper-minus:active, .stepper-plus:active {
                    background: ${e?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.08)"};
                }
                .stepper-value {
                    font-size: 14px; font-weight: 600;
                    min-width: 60px; text-align: center;
                    font-variant-numeric: tabular-nums;
                }
                .stepper-pair {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0 16px;
                }
                @media (max-width: 480px) { .stepper-pair { grid-template-columns: 1fr; } }

                /* ── Read-only row ── */
                .readonly-row {
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 7px 0;
                }
                .readonly-value {
                    font-size: 14px; font-weight: 600;
                    font-variant-numeric: tabular-nums;
                    color: var(--secondary-text-color, ${t.textSec});
                }
                .tariff-rate-row {
                    gap: 8px;
                    border-bottom: 1px solid ${t.surfaceBorder};
                    margin-bottom: 8px; padding-bottom: 10px;
                }
                .tariff-rate-value { font-size: 15px; font-weight: 700; color: ${t.text}; }

                /* ── Info tiles (surplus, peak) ── */
                .info-tiles {
                    display: grid; grid-template-columns: 1fr 1fr;
                    gap: 8px; margin: 8px 0;
                }
                .info-tile {
                    display: flex; align-items: flex-start; gap: 8px;
                    padding: 10px; border-radius: 10px;
                    background: ${e?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.02)"};
                    border: 1px solid ${t.surfaceBorder};
                }
                .info-tile ha-icon { margin-top: 1px; flex-shrink: 0; }
                .info-tile-content { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
                .info-tile-label {
                    font-size: 11px; font-weight: 500; text-transform: uppercase;
                    color: var(--secondary-text-color, ${t.textSec});
                    letter-spacing: 0.3px;
                }
                .info-tile-values { font-size: 13px; font-weight: 600; display: flex; gap: 4px; flex-wrap: wrap; }
                .info-tile-value { font-size: 13px; font-weight: 600; }
                .info-tile-sep { color: var(--secondary-text-color, ${t.textSec}); }
                @media (max-width: 480px) { .info-tiles { grid-template-columns: 1fr; } }

                /* ── Info box (legionella) ── */
                .info-box {
                    display: flex; gap: 8px;
                    padding: 10px 12px; border-radius: 10px;
                    background: ${e?"rgba(255,152,0,0.06)":"rgba(255,152,0,0.05)"};
                    border: 1px solid rgba(255,152,0,0.2);
                    margin-top: 8px;
                }
                .info-box ha-icon { flex-shrink: 0; margin-top: 1px; }
                .info-box-title { font-size: 12px; font-weight: 600; margin-bottom: 2px; }
                .info-box-text {
                    font-size: 11px; line-height: 1.4;
                    color: var(--secondary-text-color, ${t.textSec});
                }

                /* ── Peak hero ── */
                .peak-hero {
                    display: flex; align-items: baseline; justify-content: center;
                    gap: 6px; padding: 4px 0;
                }
                .peak-pct { font-size: 28px; font-weight: 700; font-variant-numeric: tabular-nums; }
                .peak-of-limit {
                    font-size: 12px; font-weight: 500;
                    color: var(--secondary-text-color, ${t.textSec});
                    text-transform: uppercase;
                }
                .peak-detail {
                    text-align: center; padding: 0 0 8px;
                    font-size: 12px;
                    color: var(--secondary-text-color, ${t.textSec});
                }
                .peak-sep { margin: 0 4px; }
            </style>
            <div class="wrap">
                <div class="observer-warning">
                    <ha-icon icon="mdi:eye-outline" style="--mdc-icon-size:20px;color:#f44336"></ha-icon>
                    <span>${this._t("observer_mode_active")} — ${this._t("observer_mode_readonly")}</span>
                </div>
                ${gd.map(e=>this._renderSection(e,r[e.id],t))}
            </div>
        `}getCardSize(){return 12}static getStubConfig(){return{entity_prefix:"sensor.ebi_"}}},{type:"custom:eb-control-card",name:"SEM Control Card",description:"Consolidated control panel for Solar Energy Management",preview:!1});class _d extends lt{static get properties(){return{hass:{type:Object},entryId:{type:String,attribute:"entry-id"},optionKey:{type:String,attribute:"option-key"},chargerIndex:{type:Number,attribute:"charger-index"},chargerKey:{type:String,attribute:"charger-key"},domain:{type:String},includeDeviceClass:{type:String,attribute:"include-device-class"},label:{type:String},_saving:{state:!0},_error:{state:!0}}}constructor(){super(),this.entryId="",this.optionKey="",this.chargerIndex=-1,this.chargerKey="",this.domain="",this.includeDeviceClass="",this.label="",this._saving=!1,this._error=""}static get styles(){return a`
            :host { display: block; padding: 6px 0; }
            .picker-row { display: flex; align-items: center; gap: 8px; }
            .picker-label {
                font-size: 14px; font-weight: 500;
                color: var(--primary-text-color);
                min-width: 140px; flex-shrink: 0;
            }
            ha-entity-picker { flex: 1; min-width: 0; }
            .status {
                font-size: 11px; color: var(--secondary-text-color);
                margin-top: 3px;
            }
            .status.error { color: var(--error-color, #d33); }
            .status.ok { color: var(--success-color, #8DC892); }
        `}_entry(){return this.hass&&this.entryId&&(this.hass.config_entries||[]).find(t=>t.entry_id===this.entryId)||null}_currentValue(){const t=this._entry();if(!t||!t.options)return"";if(this.chargerKey&&this.chargerIndex>=0){const e=t.options.ev_chargers||[];return e[this.chargerIndex]?.[this.chargerKey]||""}return t.options[this.optionKey]||""}async _onChange(t){const e=t.detail?.value||"",i=this._entry();if(!i)return void(this._error="config entry not found");let s;if(this._saving=!0,this._error="",this.chargerKey&&this.chargerIndex>=0){const t=(i.options?.ev_chargers||[]).map(t=>({...t}));t[this.chargerIndex]||(t[this.chargerIndex]={}),t[this.chargerIndex][this.chargerKey]=e,s={...i.options,ev_chargers:t}}else s={...i.options,[this.optionKey]:e};try{await this.hass.callWS({type:"config_entries/update",entry_id:this.entryId,options:s}),this._saving=!1}catch(t){this._saving=!1,this._error=t?.message||String(t),console.error("[eb-entity-picker] save failed",t)}}render(){if(!this.hass)return Y;const t=this._currentValue();return this.domain&&this.domain,this.includeDeviceClass&&this.includeDeviceClass,j`
            <div class="picker-row">
                ${this.label?j`<span class="picker-label">${this.label}</span>`:Y}
                <ha-entity-picker
                    .hass=${this.hass}
                    .value=${t}
                    .includeDomains=${this.domain?[this.domain]:void 0}
                    .includeDeviceClasses=${this.includeDeviceClass?[this.includeDeviceClass]:void 0}
                    .allowCustomEntity=${!1}
                    @value-changed=${this._onChange}>
                </ha-entity-picker>
            </div>
            ${this._error?j`<div class="status error">⚠ ${this._error}</div>`:this._saving?j`<div class="status">saving…</div>`:Y}
        `}}customElements.get("eb-entity-picker")||customElements.define("eb-entity-picker",_d);const md=[{suffix:"take",labelKey:"take_pct",helpKey:"config_help_take"},{suffix:"hysteresis",labelKey:"hysteresis",helpKey:"config_help_hysteresis"},{suffix:"charge_floor_w",labelKey:"charge_floor_w",helpKey:"config_help_charge_floor"}],yd=[{suffix:"sunny_min_soc",labelKey:"sunny_min_soc",helpKey:"config_help_sunny_min_soc"},{suffix:"no_sun_min_soc",labelKey:"no_sun_min_soc",helpKey:"config_help_no_sun_min_soc"}],xd={take_pct:"Take %",sunny_min_soc:"Sunny min SoC",no_sun_min_soc:"No-sun min SoC",hysteresis:"Hysteresis",charge_floor_w:"Charge floor",observer_mode:"Observer mode",peak_limit_w:"Peak limit",current_import_rate:"Import rate",current_export_rate:"Export rate",config_section_system:"System",config_help_observer_mode:"On = dry-run: the chain computes and logs but never actuates.",config_help_peak_limit:"Grid peak guard — the dispatcher sheds load above this limit.",config_help_take:"Share of the available surplus/deficit this cell takes.",config_help_sunny_min_soc:"Target minimum SoC when solar is expected.",config_help_no_sun_min_soc:"Target minimum SoC without expected solar.",config_help_hysteresis:"SoC deadband before the cell switches behavior.",config_help_charge_floor:"Minimum charge power once the cell charges at all."},bd={solar:{icon:"mdi:solar-power",color:"#ff9800"},house:{icon:"mdi:home-lightning-bolt",color:"#ff4444"},car_charger:{icon:"mdi:ev-station",color:"#8DC892"},house_battery:{icon:"mdi:battery-medium",color:"#4db6ac"},grid:{icon:"mdi:transmission-tower",color:"#488fc2"}};bt("eb-config-card",class extends vt{static get properties(){return{...super.properties,_showHelp:{state:!0}}}constructor(){super(),this._collapsed={system:!1},this._showHelp=!1,this._cells=[],this._pools=[]}setConfig(t){super.setConfig(t),this._prefix=t.entity_prefix||"sensor.ebi_",this._cells=Array.isArray(t.cells)?t.cells.filter(t=>t&&t.id):[],this._pools=Array.isArray(t.pools)?t.pools.filter(t=>t&&t.id):[];for(const t of[...this._pools,...this._cells])t.id in this._collapsed||(this._collapsed[t.id]=!0);const e=this._objPrefix(),i=[`switch.${e}observer_mode`,`number.${e}peak_limit_w`,`${this._prefix}tariff_current_import_rate`,`${this._prefix}tariff_current_export_rate`];for(const t of this._pools)for(const s of yd)i.push(`number.${e}${t.id}_${s.suffix}`);for(const t of this._cells)for(const s of md)i.push(`number.${e}${t.id}_${s.suffix}`);this._watchedIds=i}_label(t){const e=this._t(t);return e&&e!==t?e:xd[t]||t}_cellName(t){return String(t.id).replace(/_/g," ").toUpperCase()}_toggleHelp(){this._showHelp=!this._showHelp}_toggleSection(t){this._collapsed={...this._collapsed,[t]:!this._collapsed[t]},this.requestUpdate()}_systemSubtitle(){const t=this._hass?.states[`switch.${this._objPrefix()}observer_mode`],e=this._hass?.states[`number.${this._objPrefix()}peak_limit_w`],i=[];return t&&i.push(`${this._label("observer_mode")} ${"on"===t.state?"ON":"off"}`),e&&"unavailable"!==e.state&&"unknown"!==e.state&&i.push(`${(parseFloat(e.state)||0).toFixed(0)} W`),i.join(" · ")}_cellSubtitle(t){const e=this._hass?.states[`number.${this._objPrefix()}${t.id}_take`];return e&&"unavailable"!==e.state&&"unknown"!==e.state?`${this._label("take_pct")} ${(parseFloat(e.state)||0).toFixed(0)}%`:""}_poolSubtitle(t){return Array.isArray(t.members)?t.members.join(" + "):""}_renderReadonlyRow(t,e,i){return j`
            <div class="stepper-cell">
                <div class="readonly-row">
                    <span class="ctrl-label">${this._label(t)}</span>
                    <span class="readonly-value">${e}</span>
                </div>
                ${this._showHelp&&i?j`<div class="setting-help-text">${this._label(i)}</div>`:Y}
            </div>
        `}_renderParamRow(t,e,i,s){const r=this._hass?.states[t];if(!r)return this._renderReadonlyRow(e,"—",s);const a=this._frozenEntities[t],o=a?a.value:parseFloat(r.state)||0,n=parseFloat(r.attributes.step)||1,l=r.attributes.unit_of_measurement||"",c=n<1?1:0,h=o.toFixed(c)+(l?" "+l:"");return j`
            <div class="stepper-cell">
                <div class="stepper-row">
                    <span class="stepper-label">${this._label(e)}</span>
                    <div class="stepper-controls">
                        <button
                            class="stepper-minus" aria-label="Decrease"
                            @click=${()=>this._stepNumber(t,-1)}
                            @pointerdown=${()=>this._startHold(t,-1)}
                            @pointerup=${()=>this._stopHold(t)}
                            @pointerleave=${()=>this._stopHold(t)}
                        >−</button>
                        <span class="stepper-value">${h}</span>
                        <button
                            class="stepper-plus" aria-label="Increase"
                            @click=${()=>this._stepNumber(t,1)}
                            @pointerdown=${()=>this._startHold(t,1)}
                            @pointerup=${()=>this._stopHold(t)}
                            @pointerleave=${()=>this._stopHold(t)}
                        >+</button>
                    </div>
                </div>
                ${this._showHelp&&s?j`<div class="setting-help-text">${this._label(s)}</div>`:Y}
            </div>
        `}_renderToggleRow(t,e,i,s){const r=this._hass?.states[t];if(!r)return this._renderReadonlyRow(e,"—",s);const a=this._frozenEntities[t],o=a?"on"===a.value:"on"===r.state;return j`
            <div class="stepper-cell">
                <div class="toggle-row">
                    <span class="toggle-label">${this._label(e)}</span>
                    <div class="toggle-track ${o?"on":""}" @click=${()=>this._toggleSwitch(t)}>
                        <div class="toggle-thumb"></div>
                    </div>
                </div>
                ${this._showHelp&&s?j`<div class="setting-help-text">${this._label(s)}</div>`:Y}
            </div>
        `}_renderRateRow(t,e){const i=this._hass?.states[`${this._prefix}${t}`],s=i&&"unavailable"!==i.state&&"unknown"!==i.state,r=i?.attributes?.unit_of_measurement||"",a=s?`${i.state}${r?" "+r:""}`:"—";return this._renderReadonlyRow(e,a)}_sections(){const t=[{id:"system",kind:"system",icon:"mdi:tune",color:"#8DC892",title:this._label("config_section_system"),subtitleFn:()=>this._systemSubtitle()}];for(const e of this._pools)t.push({id:e.id,kind:"pool",icon:"mdi:battery-heart-variant",color:"#4db6ac",title:this._cellName(e),subtitleFn:()=>this._poolSubtitle(e)});for(const e of this._cells){const i=bd[e.type]||{icon:"mdi:tune-variant",color:"#96CAEE"};t.push({id:e.id,kind:"cell",icon:i.icon,color:i.color,title:this._cellName(e),subtitleFn:()=>this._cellSubtitle(e)})}return t}_renderSystemSection(t){const e=this._objPrefix();return j`
            ${this._renderToggleRow(`switch.${e}observer_mode`,"observer_mode",t,"config_help_observer_mode")}
            ${this._renderParamRow(`number.${e}peak_limit_w`,"peak_limit_w",t,"config_help_peak_limit")}
            ${this._renderRateRow("tariff_current_import_rate","current_import_rate")}
            ${this._renderRateRow("tariff_current_export_rate","current_export_rate")}
        `}_renderCellSection(t,e){const i=this._objPrefix();return j`
            ${md.map(s=>this._renderParamRow(`number.${i}${t.id}_${s.suffix}`,s.labelKey,e,s.helpKey))}
        `}_renderPoolSection(t,e){const i=this._objPrefix();return j`
            ${yd.map(s=>this._renderParamRow(`number.${i}${t.id}_${s.suffix}`,s.labelKey,e,s.helpKey))}
        `}_renderSectionHeader(t,e){const i=this._collapsed[t.id]?"rotate(-90deg)":"rotate(0deg)",s=t.subtitleFn();return j`
            <div class="section-header" @click=${()=>this._toggleSection(t.id)}>
                <div class="section-dot" style="background:${t.color}"></div>
                <ha-icon icon="${t.icon}" style="--mdc-icon-size:20px;color:${t.color}"></ha-icon>
                <span class="section-title-text">${t.title}</span>
                <span class="section-subtitle" style="color:${s?t.color:""}">${s}</span>
                <ha-icon class="chevron" icon="mdi:chevron-down"
                         style="--mdc-icon-size:18px;transform:${i}"></ha-icon>
            </div>
        `}_renderSection(t,e,i){const s=this._collapsed[t.id];return j`
            <div class="section ${s?"":"expanded"}"
                 style="--section-accent: ${t.color}">
                ${this._renderSectionHeader(t,i)}
                <div class="section-content ${s?"":"expanded"}">
                    <div class="section-body">
                        ${e}
                    </div>
                </div>
            </div>
        `}render(){if(!this._config)return Y;const t=this._theme(),e=!1!==t.isDark,i=t.accent||"#42a5f5",s=this._sections();return j`
            <style>
                :host { display: block; contain: layout style paint; }
                .wrap {
                    padding: 16px 20px;
                    position: relative;
                    background: ${_t(t,"#8DC892")};
                    background-size: 100% 100%, 50px 50px;
                    font-family: 'Segoe UI','Roboto',sans-serif;
                    color: var(--primary-text-color, ${t.text});
                }
                .card-help-bar {
                    display: flex; justify-content: flex-end;
                    margin: -4px 0 6px;
                }
                .help-toggle {
                    cursor: pointer;
                    color: var(--secondary-text-color, ${t.textSec});
                    opacity: 0.6;
                    flex-shrink: 0;
                    transition: opacity 0.15s, color 0.15s;
                    user-select: none;
                    padding: 4px;
                    border-radius: 50%;
                }
                .help-toggle:hover { opacity: 1; }
                .help-toggle.on { color: ${i}; opacity: 1; }

                /* ── Sections: same surface shape as the battery card's
                       per-battery sections so the Config tab reads like
                       the Battery tab. ── */
                .section {
                    margin-bottom: 12px;
                    border-radius: 12px;
                    background: ${t.surface};
                    border: 1px solid ${t.surfaceBorder};
                    overflow: hidden;
                    transition: border-color 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.2s;
                    position: relative;
                }
                .section.expanded {
                    border-color: color-mix(in srgb, var(--section-accent) 40%, ${t.surfaceBorder});
                    box-shadow: inset 3px 0 0 0 var(--section-accent);
                }
                .section:hover { border-color: ${e?"rgba(255,255,255,0.18)":"rgba(0,0,0,0.12)"}; }
                .section-header {
                    display: flex; align-items: center; gap: 8px;
                    padding: 12px 14px; cursor: pointer; user-select: none;
                    transition: background 0.15s;
                }
                .section.expanded .section-header {
                    background: color-mix(in srgb, var(--section-accent) 6%, transparent);
                }
                .section-dot {
                    width: 8px; height: 8px;
                    border-radius: 50%;
                    flex-shrink: 0;
                }
                .section-title-text {
                    font-size: 0.95em; font-weight: 600; white-space: nowrap;
                    color: var(--primary-text-color, ${t.text});
                }
                .section-subtitle {
                    flex: 1; font-size: 0.75em; font-weight: 500;
                    text-transform: uppercase; letter-spacing: 0.05em;
                    color: var(--secondary-text-color, ${t.textSec});
                    text-align: right; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis; margin-right: 4px;
                }
                .chevron { transition: transform 0.25s ease; color: var(--secondary-text-color, ${t.textSec}); }
                .section-content {
                    max-height: 0; opacity: 0; overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.2s ease;
                }
                .section-content.expanded { max-height: 2000px; opacity: 1; }
                .section-body { padding: 0 14px 14px; }

                /* Inline edit primitives (same look as Control card) */
                .ctrl-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
                .ctrl-label { font-size: 14px; font-weight: 500; }
                .stepper-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; }
                .stepper-label {
                    font-size: 14px; font-weight: 500; flex: 1; min-width: 0;
                    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
                }
                .stepper-controls { display: flex; align-items: center; gap: 2px; flex-shrink: 0; }
                .stepper-minus, .stepper-plus {
                    width: 30px; height: 30px; border-radius: 8px;
                    border: 1px solid ${t.surfaceBorder};
                    background: ${t.surface}; color: var(--primary-text-color, ${t.text});
                    font-size: 16px; font-weight: 600; cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: background 0.15s, border-color 0.15s; user-select: none;
                    touch-action: manipulation;
                    padding: 0; line-height: 1;
                }
                .stepper-minus:hover, .stepper-plus:hover { background: ${t.surfaceHover}; border-color: ${i}; }
                .stepper-value {
                    font-size: 14px; font-weight: 600; min-width: 60px; text-align: center;
                    font-variant-numeric: tabular-nums;
                }
                .readonly-row { display: flex; align-items: center; justify-content: space-between; padding: 7px 0; }
                .readonly-row .ctrl-label { font-size: 12px; color: var(--secondary-text-color, ${t.textSec}); font-weight: 500; }
                .readonly-value {
                    font-size: 13px; font-weight: 600; font-variant-numeric: tabular-nums;
                    color: var(--primary-text-color, ${t.text});
                }
                .toggle-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
                .toggle-label { font-size: 14px; font-weight: 500; }
                .toggle-track {
                    position: relative; width: 42px; height: 24px;
                    border-radius: 12px;
                    background: ${e?"rgba(255,255,255,0.15)":"rgba(0,0,0,0.18)"};
                    cursor: pointer; transition: background 0.2s; flex-shrink: 0;
                }
                .toggle-track.on { background: ${i}; }
                .toggle-thumb {
                    position: absolute; top: 2px; left: 2px;
                    width: 20px; height: 20px; border-radius: 50%;
                    background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
                    transition: left 0.2s;
                }
                .toggle-track.on .toggle-thumb { left: 20px; }

                .stepper-cell { display: flex; flex-direction: column; }
                .setting-help-text {
                    font-size: 11px; line-height: 1.35;
                    color: var(--secondary-text-color, ${t.textSec});
                    opacity: 0.75; padding: 2px 4px 6px 0; margin-top: -4px;
                    font-style: italic;
                }
            </style>
            <ha-card>
                <div class="wrap">
                    <div class="card-help-bar">
                        <ha-icon
                            class="help-toggle ${this._showHelp?"on":""}"
                            icon="${this._showHelp?"mdi:help-circle":"mdi:help-circle-outline"}"
                            title="${this._t("zone_help_toggle")}"
                            @click=${()=>this._toggleHelp()}
                            style="--mdc-icon-size:18px"
                        ></ha-icon>
                    </div>
                    ${s.map(e=>this._renderSection(e,"system"===e.kind?this._renderSystemSection(t):"pool"===e.kind?this._renderPoolSection(this._pools.find(t=>t.id===e.id),t):this._renderCellSection(this._cells.find(t=>t.id===e.id),t),t))}
                </div>
            </ha-card>
        `}getCardSize(){return 8}static getStubConfig(){return{entity_prefix:"sensor.ebi_",cells:[],pools:[]}}},{type:"custom:eb-config-card",name:"EB Configuration Card",description:"In-dashboard Energy Balancer parameter surface (observer mode, peak limit, per-cell tuning)",preview:!1});const vd="eb-config-tab-introduced-v1";bt("eb-onboarding-banner",class extends vt{static get watchedEntities(){return[]}static get properties(){return{...super.properties,_dismissed:{state:!0}}}constructor(){super(),this._dismissed=this._isDismissed()}setConfig(t){super.setConfig(t),this._configPath=t.config_tab_path||"/config"}_isDismissed(){try{return"1"===localStorage.getItem(vd)}catch(t){return!1}}_dismiss(){try{localStorage.setItem(vd,"1")}catch(t){}this._dismissed=!0}_openConfig(){const t=window.location.pathname.split("/").filter(Boolean);if(t.length>=2){const e="/"+t.slice(0,-1).join("/");window.history.pushState(null,"",`${e}/config`)}else window.history.pushState(null,"",this._configPath);window.dispatchEvent(new Event("location-changed",{composed:!0})),this._dismiss()}render(){if(this._dismissed)return Y;if(!this._config)return Y;const t=this._theme(),e="#8DC892";return j`
            <style>
                :host { display: block; }
                .banner {
                    display: flex; align-items: center; gap: 12px;
                    padding: 14px 16px; border-radius: 14px; margin-bottom: 12px;
                    background:
                        linear-gradient(135deg, ${e}22 0%, ${e}0B 100%),
                        ${t.surface};
                    border: 1px solid ${e}55;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
                    color: var(--primary-text-color, ${t.text});
                    font-family: 'Segoe UI','Roboto',sans-serif;
                }
                .icon {
                    --mdc-icon-size: 28px;
                    color: ${e};
                    flex-shrink: 0;
                }
                .text { flex: 1; min-width: 0; }
                .title {
                    font-size: 14px; font-weight: 700; letter-spacing: 0.2px;
                    margin-bottom: 2px;
                }
                .body {
                    font-size: 12px; line-height: 1.4;
                    color: var(--secondary-text-color, ${t.textSec});
                }
                .actions { display: flex; gap: 6px; flex-shrink: 0; }
                button {
                    padding: 7px 14px; border-radius: 9px;
                    font-size: 12px; font-weight: 600; font-family: inherit;
                    cursor: pointer; border: 1px solid transparent;
                    transition: background 0.15s, border-color 0.15s, transform 0.05s;
                }
                button:active { transform: scale(0.97); }
                .open {
                    background: ${e}; color: #1a1d24;
                }
                .open:hover { background: color-mix(in srgb, ${e} 88%, white); }
                .dismiss {
                    background: transparent; color: var(--secondary-text-color, ${t.textSec});
                    border-color: ${t.surfaceBorder};
                }
                .dismiss:hover { background: ${t.surfaceHover}; }
                @media (max-width: 500px) {
                    .banner { flex-wrap: wrap; }
                    .text { flex: 1 1 100%; order: 1; }
                    .icon { order: 0; }
                    .actions { flex: 1 1 100%; order: 2; justify-content: flex-end; }
                }
            </style>
            <div class="banner">
                <ha-icon class="icon" icon="mdi:cog-sync-outline"></ha-icon>
                <div class="text">
                    <div class="title">${this._t("onboarding_banner_title")}</div>
                    <div class="body">${this._t("onboarding_banner_body")}</div>
                </div>
                <div class="actions">
                    <button class="open" @click=${()=>this._openConfig()}>
                        ${this._t("onboarding_banner_open")}
                    </button>
                    <button class="dismiss" @click=${()=>this._dismiss()}>
                        ${this._t("onboarding_banner_dismiss")}
                    </button>
                </div>
            </div>
        `}getCardSize(){return 1}static getStubConfig(){return{}}},{type:"custom:eb-onboarding-banner",name:"SEM Onboarding Banner",description:"One-time welcome banner pointing existing users to the new Configuration tab",preview:!1});class wd extends HTMLElement{static async generate(t,e){try{return{views:(await e.callWS({type:"energy_balancer/dashboard"})).views||[]}}catch(t){return{views:[{title:"Energy Balancer",cards:[{type:"markdown",content:"## Energy Balancer dashboard unavailable\n\nThe integration did not return its dashboard: `"+(t&&(t.message||t.code)||String(t))+"`.\n\nCheck that Energy Balancer is set up and running under *Settings → Devices & services*."}]}]}}}}customElements.get("ll-strategy-dashboard-energy-balancer")||customElements.define("ll-strategy-dashboard-energy-balancer",wd),console.info("%c SEM Cards %c Lit Bundle ","color: #4db6ac; font-weight: bold; background: #1e232d; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #ff9800; background: #1e232d; padding: 2px 6px; border-radius: 0 4px 4px 0;");
