(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{101:function(e,t,a){e.exports=a.p+"static/media/macrometa-white-transparent.f541fb5a.png"},102:function(e,t,a){e.exports=a.p+"static/media/circle_spinner.25ef2804.gif"},117:function(e,t,a){e.exports=a(288)},122:function(e,t,a){},124:function(e,t,a){},288:function(e,t,a){"use strict";a.r(t);var n=a(1),s=a.n(n),o=a(17),r=a.n(o),i=(a(122),a(35)),l=a(34),c=a(98),d=a(99),u=a(115),m=a(100),h=a(116),p=a(15),f=a(19),E=a.n(f),g=a(101),b=a.n(g),v=a(102),y=a.n(v),k=a(22),S=a.n(k),O=a(24),x=a.n(O),w=a(109),N=a.n(w),j=a(111),C=a.n(j),M=a(18),T=a.n(M),F=a(110),D=a.n(F),R=a(66),P=a.n(R),U=a(33),A=a.n(U),I=a(112),_=a.n(I),H=a(113),W=a.n(H),z=a(48),J=a.n(z),L=a(50),q=a.n(L),V=a(47),B=a.n(V),G=a(105),K=a.n(G),Y=a(49),$=a.n(Y),Q=a(108),X=a.n(Q),Z=a(106),ee=a.n(Z),te=a(107),ae=a.n(te),ne={global:"gdn.paas.macrometa.io",Fremont:"gdn-us-west.paas.macrometa.io",London:"gdn-eu-west.paas.macrometa.io",Mumbai:"gdn-ap-west.paas.macrometa.io",Singapore:"gdn-ap-south.paas.macrometa.io",Tokyo:"gdn-ap-northeast.paas.macrometa.io",Sydney:"gdn-ap-sydney.paas.macrometa.io"},se=a(114),oe=a(103),re=a.n(oe),ie=function(e,t){return t.reduce(function(t,a){return e===a._key?t:[].concat(Object(se.a)(t),[a])},[])},le=function(e,t){var a=e._key,n=re.a.cloneDeep(t),s=t.findIndex(function(e){return e._key===a});return-1===s?n.push(e):n[s]=e,n},ce=function(e,t,a){return"wss://api-".concat(e,"/_ws/ws/v2/consumer/persistent/").concat(t,"/c8local.").concat(a,"/addresses/").concat(Math.floor(Math.random()*Math.floor(99999)))},de=function(e,t,a){return"wss://api-".concat(e,"/_ws/ws/v2/producer/persistent/").concat(t,"/c8local.").concat(a,"/addresses")},ue=function(e,t,a){return"https://api-".concat(e,"/_tenant/").concat(t,"/_fabric/").concat(a,"/cursor")},me=function(e){return Object.keys(e).reduce(function(t,a){var n={label:a.split("_").reduce(function(e,t){return e+t.toUpperCase()+" "},""),value:e[a]};return t.push(n),t},[])},he=(a(124),function(e){function t(e){var a;return Object(c.a)(this,t),(a=Object(u.a)(this,Object(m.a)(t).call(this,e))).handleFormChange=function(e){return function(t){a.setState(Object(l.a)({},e,t.target.value))}},a.state={shouldShowModal:!1,showSnackbar:!1,isEdit:!1,snackbarText:"",firstName:"",lastName:"",emailAddress:"",firstNameHasError:!1,lastNameHasError:!1,emailAddressHasError:!1,data:[],isLoading:!0,lastEditElem:null,selectedRegionUrl:"",selectedRegionName:"",regionModal:!1,availableRegions:me(ne),baseUrl:"",wsUrl:"",producerUrl:"",loginModal:!0,email:"xxxx@macrometa.io",fabric:"_system",password:"xxxx",wsotp:""},a.onFabPress=a.onFabPress.bind(Object(p.a)(Object(p.a)(a))),a.getOtp=a.getOtp.bind(Object(p.a)(Object(p.a)(a))),a.handleFormChange=a.handleFormChange.bind(Object(p.a)(Object(p.a)(a))),a.onSavePressed=a.onSavePressed.bind(Object(p.a)(Object(p.a)(a))),a.resetModalData=a.resetModalData.bind(Object(p.a)(Object(p.a)(a))),a.fetchData=a.fetchData.bind(Object(p.a)(Object(p.a)(a))),a.onTextInputFocus=a.onTextInputFocus.bind(Object(p.a)(Object(p.a)(a))),a.onSocketMessageReceived=a.onSocketMessageReceived.bind(Object(p.a)(Object(p.a)(a))),a.connection=void 0,a.producer=void 0,a.jwtToken=void 0,a.tenant=void 0,a}return Object(h.a)(t,e),Object(d.a)(t,[{key:"componentWillUnmount",value:function(){this.connection.close(),this.producer.close()}},{key:"login",value:function(){var e=this,t=this.state,a=t.email,n=t.password,s=t.selectedRegionUrl,o=this,r={email:a,password:n},i="https://api-".concat(s,"/_open/auth");E.a.ajax({url:i,method:"POST",data:JSON.stringify(r),dataType:"json",success:function(t){var a=t.jwt,n=t.tenant;e.jwtToken=a,e.tenant=n,e.setState({regionModal:!1,baseUrl:ue(s,e.tenant,e.state.fabric),wsUrl:ce(s,e.tenant,e.state.fabric),producerUrl:de(s,e.tenant,e.state.fabric)},function(){e.ajaxSetup(),e.initWebSocket();var t=e.createCollection();E.a.when(t).done(function(e){o.sleep(3e4),o.fetchData()}),e.fetchData()})},error:function(){return e.handleSnackbar("Auth failed.")}})}},{key:"getOtp",value:function(){var e="https://api-".concat(this.state.selectedRegionUrl,"/apid/otp");return E.a.ajax({type:"POST",contentType:"text/plain",processData:!1,cache:!1,url:e})}},{key:"createCollection",value:function(){var e=this,t=!1,a="https://api-".concat(this.state.selectedRegionUrl,"/_tenant/").concat(this.tenant,"/_fabric/").concat(this.state.fabric,"/collection");return E.a.ajax({type:"GET",contentType:"text/plain",processData:!1,cache:!1,url:a,success:function(a){for(var n=a.result,s=0;s<n.length;s++){if("addresses"===n[s].name){t=!0,console.log("Collection exists");break}t=!1}!1===t&&e.collection()}})}},{key:"sleep",value:function(e,t){return new Promise(function(){return setTimeout(t,e)})}},{key:"collection",value:function(){var e="https://api-".concat(this.state.selectedRegionUrl,"/_tenant/").concat(this.tenant,"/_fabric/").concat(this.state.fabric,"/collection");E.a.ajax({type:"POST",contentType:"text/plain",processData:!1,cache:!1,url:e,data:JSON.stringify({name:"addresses"}),success:function(e){console.log("Collection Created")}})}},{key:"ajaxSetup",value:function(){E.a.ajaxSetup({headers:{Authorization:"bearer ".concat(this.jwtToken)}})}},{key:"initWebSocket",value:function(){var e=this;this.getOtp().then(function(t){var a=t.otp,n=e.state.wsUrl;e.connection=new WebSocket("".concat(n,"?otp=").concat(a)),e.connection.onmessage=e.onSocketMessageReceived,e.connection.onopen=function(){return console.log("WS connection established")},e.connection.onerror=function(){return console.log("Failed to establish WS connection")},e.connection.onclose=function(){return console.log("Closing WS connection")}}),this.getOtp().then(function(t){var a=t.otp,n=e.state.producerUrl;e.producer=new WebSocket("".concat(n,"?otp=").concat(a)),e.producer.onopen=function(){setInterval(function(){e.producer.send(JSON.stringify({payload:"noop"}))},3e4)}})}},{key:"deleteData",value:function(e){this.setState({data:ie(e,this.state.data)})}},{key:"addOrUpdateData",value:function(e){this.setState({data:le(e,this.state.data)})}},{key:"onSocketMessageReceived",value:function(e){var t=JSON.parse(e.data),a={messageId:t.messageId};if(this.connection.send(JSON.stringify(a)),"noop"!==t.payload){var n=JSON.parse(atob(t.payload));n._delete?this.deleteData(n._key):this.addOrUpdateData(n)}}},{key:"fetchData",value:function(e){var t=this,a=this.state.baseUrl;this.setState({isLoading:!0},function(){E.a.ajax({type:"POST",contentType:"text/plain",processData:!1,cache:!1,url:a,data:JSON.stringify({query:"FOR entry IN addresses RETURN entry"}),success:function(e){t.state.shouldShowModal||t.resetModalData(),t.setState({isLoading:!1,data:e.result})},error:function(a){e&&t.resetModalData(),t.setState({isLoading:!1}),t.handleSnackbar("Could not fetch data"),console.log("Error:",a)}})})}},{key:"onFabPress",value:function(){this.setState({shouldShowModal:!0})}},{key:"resetModalData",value:function(){this.setState({lastEditElem:void 0,shouldShowModal:!1,isEdit:!1,firstName:"",lastName:"",emailAddress:"",firstNameHasError:!1,lastNameHasError:!1,emailAddressHasError:!1})}},{key:"validate",value:function(){var e=this.state,t=e.firstName,a=e.lastName,n=e.emailAddress,s={};return this.state.isEdit?this.state.lastEditElem.email.trim()||(s.emailAddressHasError=!0):(t.trim()||(s.firstNameHasError=!0),a.trim()||(s.lastNameHasError=!0),n.trim()||(s.emailAddressHasError=!0)),s}},{key:"onSavePressed",value:function(){var e=this,t=this.state.baseUrl,a=this.validate();if(0===Object.keys(a).length){var n="Contact details added successfully",s="Contact details could not be added",o=this.state,r=o.firstName,l=o.lastName,c=o.emailAddress,d=o.isEdit,u='INSERT { "firstname":"'.concat(r,'", "lastname":"').concat(l,'", "email":"').concat(c,'" } INTO addresses');if(d){var m=this.state.lastEditElem,h=m._key,p=m.firstname,f=m.lastname,g=m.email;u='UPDATE "'.concat(h,'" WITH { firstname:"').concat(p,'", lastname:"').concat(f,'", email:"').concat(g,'" } IN addresses'),n="Contact details updated successfully",s="Contact details could not be updated"}E.a.ajax({type:"POST",contentType:"text/plain",processData:!1,cache:!1,url:t,data:JSON.stringify({query:u}),success:function(){e.handleSnackbar(n),e.resetModalData()},error:function(t){e.handleSnackbar(s),e.resetModalData(),console.log("Error:",t)}})}else this.setState(Object(i.a)({},a))}},{key:"onTextInputFocus",value:function(e){this.state["".concat(e,"HasError")]&&this.setState(Object(l.a)({},"".concat(e,"HasError"),!1))}},{key:"onEditPressed",value:function(e){e&&this.setState({shouldShowModal:!0,isEdit:!0,lastEditElem:e})}},{key:"onRemovePressed",value:function(e){var t=this,a=this.state.baseUrl;e&&this.setState({lastEditElem:e},function(){E.a.ajax({type:"POST",contentType:"text/plain",processData:!1,cache:!1,url:a,data:JSON.stringify({query:'REMOVE "'.concat(e._key,'" IN addresses')}),success:function(){t.handleSnackbar("Contact details removed successfully"),t.resetModalData()},error:function(e){t.handleSnackbar("Contact details could not be removed"),t.resetModalData(),console.log("Error:",e)}})})}},{key:"handleSnackbar",value:function(e){var t=this;this.setState({showSnackbar:!0,snackbarText:e},function(){setTimeout(function(){t.setState({showSnackbar:!1,snackbarText:""})},2e3)})}},{key:"renderDialogContent",value:function(){var e=this,t=this.state.lastEditElem||{},a=t.firstname,n=t.lastname,o=t.email;return s.a.createElement(B.a,null,s.a.createElement(K.a,null,this.state.isEdit?"Fill in the fields to be updated.":"Provide all the details to add a new contact."),s.a.createElement(x.a,{onFocus:function(){return e.onTextInputFocus("firstName")},required:!this.state.isEdit,error:this.state.firstNameHasError,style:{display:"block"},label:"First Name",value:this.state.isEdit?a:this.state.firstName,onChange:function(t){if(e.state.isEdit){var a=Object(i.a)({},e.state.lastEditElem);a.firstname=t.target.value,e.setState({lastEditElem:a})}else e.handleFormChange("firstName")(t)},margin:"normal"}),s.a.createElement(x.a,{onFocus:function(){return e.onTextInputFocus("lastName")},required:!this.state.isEdit,error:this.state.lastNameHasError,style:{display:"block"},label:"Last Name",value:this.state.isEdit?n:this.state.lastName,onChange:function(t){if(e.state.isEdit){var a=Object(i.a)({},e.state.lastEditElem);a.lastname=t.target.value,e.setState({lastEditElem:a})}else e.handleFormChange("lastName")(t)},margin:"normal"}),s.a.createElement(x.a,{onFocus:function(){return e.onTextInputFocus("emailAddress")},required:!0,error:this.state.emailAddressHasError,style:{display:"block"},label:"Email",value:this.state.isEdit?o:this.state.emailAddress,onChange:function(t){if(e.state.isEdit){var a=Object(i.a)({},e.state.lastEditElem);a.email=t.target.value,e.setState({lastEditElem:a})}else e.handleFormChange("emailAddress")(t)},margin:"normal"}))}},{key:"renderRegionModal",value:function(){var e=this,t=this.state,a=t.regionModal,n=t.availableRegions,o=t.selectedRegionUrl;return s.a.createElement(J.a,{fullWidth:!0,open:a},s.a.createElement($.a,{id:"form-dialog-title"},"Select Region:"),s.a.createElement(B.a,null,s.a.createElement(ee.a,{onChange:function(t){var a=t.target.value,s=n.find(function(e){return e.value===a}).label;e.setState({selectedRegionUrl:a,selectedRegionName:s})},value:o},n.map(function(e){return s.a.createElement(ae.a,{key:e.label,value:e.value,control:s.a.createElement(X.a,null),label:e.label})}))),s.a.createElement(q.a,null,s.a.createElement(S.a,{disabled:!o,onClick:function(){return e.login()},size:"small",variant:"text",color:"primary"},s.a.createElement("span",{className:"actions"},"CONFIRM"))))}},{key:"renderLoginModal",value:function(){var e=this,t=this.state.loginModal;return s.a.createElement(J.a,{fullWidth:!0,open:t},s.a.createElement($.a,{id:"form-dialog-title"},"Please login to your Macrometa account:"),s.a.createElement(B.a,null,s.a.createElement(x.a,{onFocus:function(){return e.onTextInputFocus("email")},style:{display:"block"},label:"Email",defaultValue:this.state.email,onChange:function(t){var a=t.target.value;e.setState({email:a})},margin:"normal"}),s.a.createElement(x.a,{onFocus:function(){return e.onTextInputFocus("fabric")},style:{display:"block"},label:"Fabric ",defaultValue:this.state.fabric,onChange:function(t){var a=t.target.value;e.setState({fabric:a})},margin:"normal"}),s.a.createElement(x.a,{type:"password",onFocus:function(){return e.onTextInputFocus("password")},style:{display:"block"},label:"Password ",defaultValue:this.state.password,onChange:function(t){var a=t.target.value;e.setState({password:a})},margin:"normal"})),s.a.createElement(q.a,null,s.a.createElement(S.a,{onClick:function(){return e.setState({loginModal:!1,regionModal:!0})},size:"small",variant:"text",color:"primary"},s.a.createElement("span",{className:"actions"},"CONFIRM"))))}},{key:"render",value:function(){var e=this,t=this.state,a=t.data,n=t.selectedRegionName;return s.a.createElement("div",{className:"App"},s.a.createElement("header",{className:"App-header"},s.a.createElement("img",{src:b.a,alt:"logo",style:{height:"100px"}}),s.a.createElement("h1",{className:"App-title"},"Address book is connected to ",n)),this.renderLoginModal(),this.renderRegionModal(),s.a.createElement(A.a,null,s.a.createElement(N.a,null,s.a.createElement(D.a,null,s.a.createElement(P.a,null,s.a.createElement(T.a,null,"KEY"),s.a.createElement(T.a,null,"First Name"),s.a.createElement(T.a,null,"Last Name"),s.a.createElement(T.a,null,"Email"),s.a.createElement(T.a,{style:{paddingLeft:"40px"}},"Actions"))),s.a.createElement(C.a,null,a.map(function(t){return s.a.createElement(P.a,{key:t._key},s.a.createElement(T.a,{component:"th",scope:"row"},t._key),s.a.createElement(T.a,null,t.firstname),s.a.createElement(T.a,null,t.lastname),s.a.createElement(T.a,null,t.email),s.a.createElement(T.a,null,s.a.createElement("div",null,s.a.createElement(S.a,{onClick:function(){e.onEditPressed(t)},size:"small",variant:"text",color:"primary"},s.a.createElement("span",{style:{fontSize:"10px"}},"Edit")),s.a.createElement(S.a,{onClick:function(){e.onRemovePressed(t)},size:"small",variant:"text",color:"secondary"},s.a.createElement("span",{style:{fontSize:"10px"}},"Remove")))))})))),s.a.createElement(_.a,{onClick:this.onFabPress,style:{position:"fixed",bottom:"70px",right:"70px"},size:"large",color:"primary"},s.a.createElement("span",{style:{fontSize:"30px"}},"+")),s.a.createElement(J.a,{onClose:this.resetModalData,open:this.state.shouldShowModal},s.a.createElement($.a,{id:"form-dialog-title"},this.state.isEdit?"Edit contact details":"Add contact details"),this.renderDialogContent(),s.a.createElement(q.a,null,s.a.createElement(S.a,{onClick:function(){e.onSavePressed()},size:"small",variant:"text",color:"primary"},s.a.createElement("span",{className:"actions"},this.state.isEdit?"UPDATE":"SAVE")),s.a.createElement(S.a,{onClick:this.resetModalData,size:"small",variant:"text",color:"secondary"},s.a.createElement("span",{className:"actions"},"DISCARD")))),s.a.createElement(W.a,{open:this.state.showSnackbar,onClose:this.handleClose,ContentProps:{"aria-describedby":"message-id"},message:s.a.createElement("span",{id:"message-id"},this.state.snackbarText)}),this.state.isLoading&&s.a.createElement("img",{src:y.a,alt:"logo",className:"spinner"}))}}]),t}(n.Component));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));r.a.render(s.a.createElement(he,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then(function(e){e.unregister()})}},[[117,1,2]]]);
//# sourceMappingURL=main.79acd565.chunk.js.map