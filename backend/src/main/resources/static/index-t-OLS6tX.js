(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))i(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const d of n.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&i(d)}).observe(document,{childList:!0,subtree:!0});function a(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(l){if(l.ep)return;l.ep=!0;const n=a(l);fetch(l.href,n)}})();const U=typeof window<"u"&&window.location.hostname?window.location.hostname:"localhost",F=`http://${U}:8080/api/v1`,k=F,c={getToken(){return localStorage.getItem("esign_token")},setToken(e){localStorage.setItem("esign_token",e)},clearToken(){localStorage.removeItem("esign_token"),localStorage.removeItem("esign_user")},getUser(){const e=localStorage.getItem("esign_user");return e?JSON.parse(e):null},setUser(e){localStorage.setItem("esign_user",JSON.stringify(e))},async request(e,t={}){var p;const a=`${k}${e}`,i=t.headers||{},l=this.getToken();l&&!e.startsWith("/auth/")&&(i.Authorization=`Bearer ${l}`),!(t.body instanceof FormData)&&!i["Content-Type"]&&(i["Content-Type"]="application/json");const n={...t,headers:i},d=await fetch(a,n);if(d.status===401&&!e.startsWith("/auth/"))throw this.clearToken(),window.location.hash="#/login",new Error("Session expired. Please log in again.");if((p=d.headers.get("content-type"))!=null&&p.includes("application/pdf"))return d.blob();const m=await d.json().catch(()=>({}));if(!d.ok){const f=m.message||m.error||`Request failed with status ${d.status}`;throw new Error(f)}return m},login(e,t){return this.request("/auth/login",{method:"POST",body:JSON.stringify({email:e,password:t})})},register(e){return this.request("/auth/register",{method:"POST",body:JSON.stringify(e)})},sendRegistrationOtp(e){return this.request("/auth/send-registration-otp",{method:"POST",body:JSON.stringify({email:e})})},verifyRegistrationOtp(e,t){return this.request("/auth/verify-registration-otp",{method:"POST",body:JSON.stringify({email:e,otpCode:t})})},getMe(){return this.request("/auth/me")},getDashboardStats(){return this.request("/dashboard/stats")},getDocuments(e="ALL"){const t=e&&e!=="ALL"?`?status=${e}`:"";return this.request(`/documents${t}`)},getDocument(e){return this.request(`/documents/${e}`)},uploadDocument(e){return this.request("/documents",{method:"POST",body:e})},cancelDocument(e){return this.request(`/documents/${e}/cancel`,{method:"POST"})},downloadDocumentUrl(e,t=!0){const a=this.getToken(),i=a?`&token=${encodeURIComponent(a)}`:"";return`${k}/documents/${e}/download?sealed=${t}${i}`},async downloadDocument(e,t=!0,a="document.pdf"){const i=this.getToken(),l=`${k}/documents/${e}/download?sealed=${t}`,n={};i&&(n.Authorization=`Bearer ${i}`);const d=await fetch(l,{headers:n});if(!d.ok){const $=await d.json().catch(()=>({}));throw new Error($.message||$.error||`Download failed: HTTP ${d.status}`)}let m=a;const p=d.headers.get("Content-Disposition");if(p){const S=/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(p);S!=null&&S[1]&&(m=S[1].replace(/['"]/g,"").trim())}const f=await d.blob(),h=window.URL.createObjectURL(f),v=document.createElement("a");v.href=h,v.download=m,document.body.appendChild(v),v.click(),v.remove(),setTimeout(()=>window.URL.revokeObjectURL(h),1e4)},createSigningRequest(e){return this.request("/signing/requests",{method:"POST",body:JSON.stringify(e)})},resendSigningInvite(e){return this.request(`/signing/invites/${e}/resend`,{method:"POST"})},getSigningContext(e){return this.request(`/signing/context/${e}`)},requestOtp(e){return this.request(`/signing/otp/${e}`,{method:"POST"})},verifyOtp(e,t){return this.request(`/signing/verify-otp/${e}`,{method:"POST",body:JSON.stringify({otpCode:t})})},requestAadhaarOtp(e,t){return this.request(`/signing/aadhaar-otp/${e}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t})})},verifyAadhaarOtp(e,t,a){return this.request(`/signing/verify-aadhaar-otp/${e}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t,otpCode:a})})},submitSignature(e,t){return this.request(`/signing/submit/${e}`,{method:"POST",body:JSON.stringify(t)})},declineSignature(e,t){return this.request(`/signing/decline/${e}`,{method:"POST",body:JSON.stringify({reason:t})})},getSigningPreviewUrl(e){return`${k}/signing/preview/${e}`},verifyHash(e){return this.request(`/verify/${encodeURIComponent(e)}`)},verifyFile(e){const t=new FormData;return t.append("file",e),this.request("/verify/upload",{method:"POST",body:t})},getAdminUsers(){return this.request("/admin/users")},toggleUserStatus(e){return this.request(`/admin/users/${e}/toggle-status`,{method:"POST"})},getAdminAuditLogs(e=0,t=30){return this.request(`/admin/audit-logs?page=${e}&size=${t}`)},getAdminDocuments(e=0,t=20){return this.request(`/admin/documents?page=${e}&size=${t}`)}},B={en:{brand:"SignEase",home:"Home",dashboard:"Dashboard",documents:"Documents",upload:"Upload & Sign",send:"Send for Signature",verify:"Verify Document",admin:"Admin",signIn:"Sign In",createAccount:"Create Account",signOut:"Sign Out",language:"Language / भाषा",heroBadge:"✨ Simple & Secure Digital Signatures",heroTitle:"Sign & Send Documents in Minutes",heroSubtitle:"The easiest, fastest way to sign contracts and agreements online. Safe, legally valid, and works directly on your phone or computer.",btnStartFree:"Start Free Trial",btnSenderDashboard:"My Dashboard",btnVerifyDoc:"Verify a Document",howItWorks:"3 Simple Steps to Sign Any Document",step1Title:"1. Upload PDF",step1Desc:"Choose any contract, agreement, or form from your device.",step2Title:"2. Add Signers",step2Desc:"Enter the email address of people who need to sign.",step3Title:"3. Sign & Download",step3Desc:"Sign with your finger or type your name, and download the finished PDF.",whyChooseUs:"Why People Love SignEase",feature1Title:"Zero Complicated Setup",feature1Desc:"No software installation needed. Signers open the link on mobile or PC and sign in seconds.",feature2Title:"100% Legally Valid",feature2Desc:"Full completion certificates with tamper-evident audit logs recognized under the IT Act.",feature3Title:"Instant Email Delivery",feature3Desc:"Verification OTPs and invitation links arrive instantly in your inbox.",welcomeBack:"Welcome back,",dashboardSub:"Here is what is happening with your documents today.",totalDocs:"Total Documents",pendingDocs:"Waiting for Signatures",completedDocs:"Completed Documents",draftDocs:"Draft Documents",btnNewDoc:"➕ Upload & Send Document",recentDocsTitle:"Recent Documents",viewAll:"View All",colDoc:"Document",colStatus:"Status",colDate:"Date",colActions:"Actions",noDocsFound:'No documents yet. Click "Upload & Send Document" to get started.',uploadTitle:"Upload New Document",uploadSub:"Choose a PDF file to sign or send to others.",clickToUpload:"Click to choose a PDF or drag & drop here",docTitleLabel:"Document Title",docTitlePlaceholder:"e.g. Rent Agreement, Job Offer Letter",docDescLabel:"Notes or Message (Optional)",btnUploadNext:"Upload & Next",cancel:"Cancel",sendTitle:"Configure & Send Invites",sendSub:"Enter the signers who need to execute this document.",signerNumber:"Signer",fullName:"Full Name",emailAddress:"Email Address",phoneOptional:"Mobile (+91)",btnAddSigner:"➕ Add Another Signer",btnSendInvites:"🚀 Dispatch Signing Invites",dispatchedSuccess:"Agreement Dispatched Successfully! Email invites sent.",regTitle:"Create Your Account",regSub:"Verify your email with a 6-digit OTP to get started",firstName:"First Name",lastName:"Last Name",orgName:"Company or Business Name",emailInput:"Work Email Address",btnGetOtp:"Get OTP",otpLabel:"Enter 6-Digit Email OTP",btnVerifyOtp:"Verify Code",otpDispatchedMsg:"6-digit verification code sent to your email inbox.",password:"Password",btnCreateAccount:"Create Free Account",alreadyRegistered:"Already have an account?",signInHere:"Sign in here",loginTitle:"Welcome Back",loginSub:"Sign in to access your documents and signed contracts",dontHaveAccount:"Don't have an account?",signUpHere:"Create free account",signerWelcome:"Review & Sign Document",requestedBy:"Requested by",tabDraw:"✍️ Draw Signature",tabType:"⌨️ Type Name",btnClear:"Clear",btnCompleteSigning:"✅ Complete & Sign Document",otpNotice:"A 6-digit OTP passcode will be sent to your email to verify your identity.",verifyTitle:"Verify Any Signed Document",verifySub:"Check if a document is authentic and has not been altered after signing.",pasteHashLabel:"Paste SHA-256 Hash or Document ID",btnVerifyNow:"Verify Authenticity",footerNote:"SignEase — Simple, fast and legally valid electronic document signing."},hi:{brand:"SignEase",home:"होम",dashboard:"डैशबोर्ड",documents:"दस्तावेज़",upload:"अपलोड और साइन",send:"हस्ताक्षर के लिए भेजें",verify:"सत्यापित करें",admin:"एडमिन",signIn:"साइन इन",createAccount:"खाता बनाएं",signOut:"लॉग आउट",language:"भाषा / Language",heroBadge:"✨ सरल और सुरक्षित डिजिटल हस्ताक्षर",heroTitle:"दस्तावेज़ मिनटों में साइन करें और भेजें",heroSubtitle:"ऑनलाइन अनुबंध और दस्तावेज़ साइन करने का सबसे आसान, तेज़ और सुरक्षित तरीका। किसी भी मोबाइल या कंप्यूटर पर तुरंत काम करता है।",btnStartFree:"निःशुल्क शुरू करें",btnSenderDashboard:"मेरा डैशबोर्ड",btnVerifyDoc:"दस्तावेज़ सत्यापित करें",howItWorks:"दस्तावेज़ साइन करने के 3 आसान चरण",step1Title:"1. पीडीएफ अपलोड करें",step1Desc:"अपने फोन या कंप्यूटर से कोई भी अनुबंध, समझौता या फॉर्म चुनें।",step2Title:"2. हस्ताक्षरकर्ता जोड़ें",step2Desc:"जिन लोगों को हस्ताक्षर करना है, उनका ईमेल दर्ज करें।",step3Title:"3. साइन करें और डाउनलोड करें",step3Desc:"उंगली से बनाकर या नाम लिखकर साइन करें और तैयार पीडीएफ डाउनलोड करें।",whyChooseUs:"लोग SignEase को क्यों पसंद करते हैं",feature1Title:"कोई जटिल सेटअप नहीं",feature1Desc:"कोई ऐप या सॉफ्टवेयर इंस्टॉल करने की ज़रूरत नहीं। लिंक खोलें और मोबाइल पर तुरंत साइन करें।",feature2Title:"100% कानूनी रूप से मान्य",feature2Desc:"भारतीय आईटी अधिनियम के तहत मान्य संपूर्ण समापन प्रमाणपत्र और छेड़छाड़-रहित ऑडिट रिकॉर्ड।",feature3Title:"तुरंत ईमेल डिलीवरी",feature3Desc:"सत्यापन ओटीपी और हस्ताक्षर आमंत्रण लिंक तुरंत ईमेल इनबॉक्स में पहुंचते हैं।",welcomeBack:"नमस्ते,",dashboardSub:"आज आपके दस्तावेज़ों की वर्तमान स्थिति:",totalDocs:"कुल दस्तावेज़",pendingDocs:"हस्ताक्षर की प्रतीक्षा",completedDocs:"पूरे हो चुके दस्तावेज़",draftDocs:"ड्राफ्ट दस्तावेज़",btnNewDoc:"➕ नया दस्तावेज़ भेजें",recentDocsTitle:"हाल के दस्तावेज़",viewAll:"सभी देखें",colDoc:"दस्तावेज़",colStatus:"स्थिति",colDate:"तारीख",colActions:"कार्रवाई",noDocsFound:'अभी तक कोई दस्तावेज़ नहीं है। शुरू करने के लिए "नया दस्तावेज़ भेजें" पर क्लिक करें।',uploadTitle:"नया दस्तावेज़ अपलोड करें",uploadSub:"साइन करने या दूसरों को भेजने के लिए पीडीएफ फाइल चुनें।",clickToUpload:"पीडीएफ चुनने के लिए क्लिक करें या यहाँ खींचकर लाएं",docTitleLabel:"दस्तावेज़ का नाम",docTitlePlaceholder:"उदा. किराया समझौता, नियुक्ति पत्र, अनुबंध",docDescLabel:"विवरण या संदेश (वैकल्पिक)",btnUploadNext:"अपलोड करें और आगे बढ़ें",cancel:"रद्द करें",sendTitle:"हस्ताक्षरकर्ताओं को आमंत्रण भेजें",sendSub:"उन लोगों का नाम और ईमेल दर्ज करें जिन्हें साइन करना है।",signerNumber:"हस्ताक्षरकर्ता",fullName:"पूरा नाम",emailAddress:"ईमेल पता",phoneOptional:"मोबाइल (+91)",btnAddSigner:"➕ एक और हस्ताक्षरकर्ता जोड़ें",btnSendInvites:"🚀 ईमेल आमंत्रण भेजें",dispatchedSuccess:"दस्तावेज़ सफलतापूर्वक भेज दिया गया! ईमेल पर आमंत्रण पहुंच गया है।",regTitle:"नया खाता बनाएं",regSub:"शुरू करने के लिए अपना विवरण भरें और 6-अंकों का ओटीपी सत्यापित करें",firstName:"पहला नाम",lastName:"अंतिम नाम",orgName:"कंपनी या व्यवसाय का नाम",emailInput:"ईमेल पता",btnGetOtp:"ओटीपी पाएं",otpLabel:"6-अंकों का ईमेल ओटीपी दर्ज करें",btnVerifyOtp:"ओटीपी जांचें",otpDispatchedMsg:"6-अंकों का सत्यापन कोड आपके ईमेल इनबॉक्स में भेज दिया गया है।",password:"पासवर्ड",btnCreateAccount:"खाता बनाएं",alreadyRegistered:"पहले से पंजीकृत हैं?",signInHere:"यहाँ साइन इन करें",loginTitle:"वापसी पर स्वागत है",loginSub:"अपने दस्तावेज़ों और अनुबंधों तक पहुँचने के लिए साइन इन करें",dontHaveAccount:"खाता नहीं है?",signUpHere:"निःशुल्क खाता बनाएं",signerWelcome:"दस्तावेज़ देखें और हस्ताक्षर करें",requestedBy:"अनुरोधकर्ता",tabDraw:"✍️ उंगली से साइन बनाएं",tabType:"⌨️ नाम लिखकर साइन करें",btnClear:"मिटाएं",btnCompleteSigning:"✅ हस्ताक्षर पूरा करें",otpNotice:"आपकी पहचान सत्यापित करने के लिए आपके ईमेल पर 6-अंकों का ओटीपी भेजा जाएगा।",verifyTitle:"हस्ताक्षरित दस्तावेज़ की जांच करें",verifySub:"जांचें कि हस्ताक्षरित दस्तावेज़ असली है और इसमें कोई छेड़छाड़ नहीं की गई है।",pasteHashLabel:"SHA-256 हैश कोड या दस्तावेज़ आईडी दर्ज करें",btnVerifyNow:"सत्यापित करें",footerNote:"SignEase — सरल, तेज़ और कानूनी रूप से मान्य इलेक्ट्रॉनिक हस्ताक्षर।"},mr:{brand:"SignEase",home:"मुख्यपृष्ठ",dashboard:"डॅशबोर्ड",documents:"कागदपत्रे",upload:"अपलोड आणि स्वाक्षरी",send:"स्वाक्षरीसाठी पाठवा",verify:"पडताळणी करा",admin:"प्रशासक",signIn:"साइन इन",createAccount:"खाते तयार करा",signOut:"बाहेर पडा",language:"भाषा",heroTitle:"कागदपत्रे मिनिटांत स्वाक्षरी करा आणि पाठवा",heroSubtitle:"ऑनलाइन कागदपत्रांवर स्वाक्षरी करण्याचा सर्वात सोपा आणि सुरक्षित मार्ग.",btnStartFree:"विनामूल्य सुरू करा",btnSenderDashboard:"डॅशबोर्ड उघडा",btnVerifyDoc:"कागदपत्र पडताळा",welcomeBack:"स्वागत आहे,",totalDocs:"एकूण कागदपत्रे",pendingDocs:"प्रलंबित स्वाक्षऱ्या",completedDocs:"पूर्ण झालेली कागदपत्रे"},gu:{brand:"SignEase",home:"હોમ",dashboard:"ડેશબોર્ડ",documents:"દસ્તાવેજો",upload:"અપલોડ અને સહી",send:"સહી માટે મોકલો",verify:"ચકાસો",admin:"એડમિન",signIn:"સાઇન ઇન",createAccount:"ખાતું બનાવો",signOut:"બહાર નીકળો",language:"ભાષા",heroTitle:"દસ્તાવેજો મિનિટોમાં સહી કરો અને મોકલો",heroSubtitle:"ઓનલાઇન દસ્તાવેજો પર સહી કરવાનો સૌથી સરળ અને સુરક્ષિત રસ્તો.",btnStartFree:"મફત શરૂ કરો",btnSenderDashboard:"ડેશબોર્ડ ખોલો",btnVerifyDoc:"દસ્તાવેજ ચકાસો",welcomeBack:"સ્વાગત છે,",totalDocs:"કુલ દસ્તાવેજો",pendingDocs:"બાકી સહીઓ",completedDocs:"પૂર્ણ થયેલા દસ્તાવેજો"}};let P=localStorage.getItem("signease_lang")||"en";function x(){return P}function j(e){P=e,localStorage.setItem("signease_lang",e)}function s(e){return(B[P]||B.en)[e]||B.en[e]||e}const b={user:c.getUser(),route:window.location.hash||"#/"};window.changeAppLanguage=function(e){j(e),typeof setGoogleLang=="function"&&setGoogleLang(e),H()};window.addEventListener("hashchange",()=>{b.route=window.location.hash||"#/",H()});function u(e,t="success"){const a=document.getElementById("toast-alert");a&&a.remove();const i=document.createElement("div");i.id="toast-alert",i.className=`alert alert-${t} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`,i.style.zIndex="9999",i.style.minWidth="320px",i.innerHTML=`
        <div class="d-flex align-items-center">
            <i class="fa-solid fa-${t==="success"?"circle-check":t==="info"?"circle-info":"triangle-exclamation"} me-2 fs-5"></i>
            <div>${e}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `,document.body.appendChild(i),setTimeout(()=>i.remove(),4e3)}window.downloadDoc=async function(e,t=!0,a="document.pdf"){try{u("Preparing download...","info"),await c.downloadDocument(e,t,a),u("Document downloaded successfully!","success")}catch(i){u("Download failed: "+i.message,"danger")}};window.copySignerLink=function(e,t){t&&t.preventDefault();const a=`${window.location.origin}/#/sign/${e}`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(a).then(()=>{u("Direct signing link copied to clipboard!")}).catch(()=>{prompt("Copy direct signing link:",a)}):prompt("Copy direct signing link:",a)};window.resendInvite=async function(e,t){if(t){t.preventDefault();const a=t.currentTarget,i=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const l=await c.resendSigningInvite(e);u(l.message||"Signing invite has been resent successfully to Gmail!"),a.innerHTML='<i class="fa-solid fa-check text-success me-1"></i> Dispatched!',setTimeout(()=>{a.disabled=!1,a.innerHTML=i},4e3)}catch(l){a.disabled=!1,a.innerHTML=i,u(l.message,"danger")}}};async function H(){const e=document.getElementById("app"),t=b.route.replace(/^#\/?/,"").split("?")[0],a=new URLSearchParams(b.route.split("?")[1]||"");if(t.startsWith("sign/")){const m=t.replace("sign/","");Z(e,m);return}const i=`
        <div class="dropdown me-2">
            <button class="btn btn-outline-secondary btn-sm dropdown-toggle d-flex align-items-center" type="button" data-bs-toggle="dropdown" id="langSelectorBtn">
                <i class="fa-solid fa-globe me-1 text-primary"></i>
                <span class="fw-medium">${x()==="hi"?"🇮🇳 हिन्दी":x()==="mr"?"🇮🇳 मराठी":x()==="gu"?"🇮🇳 ગુજરાતી":"🌐 Language / भाषा"}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                <li><h6 class="dropdown-header">Select Language / भाषा चुनें</h6></li>
                <li><a class="dropdown-item notranslate ${x()==="en"?"fw-bold active":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('en')">🇬🇧 English</a></li>
                <li><a class="dropdown-item notranslate ${x()==="hi"?"fw-bold active":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('hi')">🇮🇳 हिन्दी (Hindi)</a></li>
                <li><a class="dropdown-item notranslate ${x()==="mr"?"fw-bold active":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('mr')">🇮🇳 मराठी (Marathi)</a></li>
                <li><a class="dropdown-item notranslate ${x()==="gu"?"fw-bold active":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('gu')">🇮🇳 ગુજરાતી (Gujarati)</a></li>
                <li><hr class="dropdown-divider"></li>
                <li class="dropdown-header small text-muted">More Languages / अन्य भाषाएं:</li>
                <li class="px-3 py-1"><div id="google_translate_element"></div></li>
            </ul>
        </div>
    `;let l=`
        <nav class="navbar navbar-expand-lg bg-white border-bottom sticky-top py-2 shadow-sm">
            <div class="container-fluid px-lg-4">
                <a class="navbar-brand d-flex align-items-center" href="#/">
                    <i class="fa-solid fa-file-signature text-primary fs-4 me-2"></i>
                    <span class="fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                </a>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navContent">
                    ${b.user?`
                        <ul class="navbar-nav me-auto ms-3">
                            <li class="nav-item"><a class="nav-link ${t==="dashboard"?"active text-primary fw-semibold":""}" href="#/dashboard"><i class="fa-solid fa-chart-pie me-1"></i> ${s("dashboard")}</a></li>
                            <li class="nav-item"><a class="nav-link ${t==="documents"?"active text-primary fw-semibold":""}" href="#/documents"><i class="fa-regular fa-folder me-1"></i> ${s("documents")}</a></li>
                            <li class="nav-item"><a class="nav-link ${t==="upload"?"active text-primary fw-semibold":""}" href="#/upload"><i class="fa-solid fa-cloud-arrow-up me-1"></i> ${s("upload")}</a></li>
                            <li class="nav-item"><a class="nav-link ${t==="send"?"active text-primary fw-semibold":""}" href="#/send"><i class="fa-solid fa-paper-plane me-1"></i> ${s("send")}</a></li>
                            <li class="nav-item"><a class="nav-link text-success fw-medium ${t==="verify"?"active":""}" href="#/verify"><i class="fa-solid fa-shield-halved me-1"></i> ${s("verify")}</a></li>
                            ${b.user.role==="ADMIN"?`<li class="nav-item"><a class="nav-link text-danger fw-medium ${t==="admin"?"active":""}" href="#/admin"><i class="fa-solid fa-shield me-1"></i> ${s("admin")}</a></li>`:""}
                        </ul>
                        <div class="d-flex align-items-center gap-2 ms-auto">
                            ${i}
                            <div class="text-end d-none d-sm-block me-2">
                                <div class="fw-bold small">${b.user.fullName}</div>
                                <div class="text-muted" style="font-size: 0.72rem;">${b.user.organization||"Enterprise"}</div>
                            </div>
                            <button id="logoutBtn" class="btn btn-sm btn-outline-danger" title="${s("signOut")}"><i class="fa-solid fa-arrow-right-from-bracket me-1"></i> ${s("signOut")}</button>
                        </div>
                    `:`
                        <ul class="navbar-nav ms-auto align-items-center gap-2">
                            ${i}
                            <li class="nav-item"><a class="nav-link text-success fw-medium" href="#/verify"><i class="fa-solid fa-shield-halved me-1"></i> ${s("verify")}</a></li>
                            <li class="nav-item"><a class="btn btn-outline-primary btn-sm px-3" href="#/login">${s("signIn")}</a></li>
                            <li class="nav-item"><a class="btn btn-primary btn-sm px-3" href="#/register">${s("createAccount")}</a></li>
                        </ul>
                    `}
                </div>
            </div>
        </nav>
        <main class="flex-grow-1" id="page-content"></main>
        <footer class="py-3 mt-auto bg-white border-top">
            <div class="container-fluid px-lg-4 d-flex flex-wrap justify-content-between align-items-center text-muted small">
                <div><strong>SignEase</strong> &copy; 2026. ${s("footerNote")}</div>
                <div class="d-flex align-items-center gap-3">
                    <span><i class="fa-solid fa-shield-check text-success me-1"></i> 100% Safe</span>
                    <a href="#/verify" class="text-decoration-none text-primary fw-medium"><i class="fa-solid fa-magnifying-glass me-1"></i> ${s("verify")}</a>
                </div>
            </div>
        </footer>
    `;e.innerHTML=l;const n=document.getElementById("logoutBtn");n&&n.addEventListener("click",()=>{c.clearToken(),b.user=null,u("Signed out successfully."),window.location.hash="#/login"});const d=document.getElementById("page-content");if(!b.user&&!["","/","login","register","verify"].includes(t)){u("Please sign in first to access this page.","warning"),window.location.hash="#/login";return}if(t===""||t==="/")b.user?window.location.hash="#/dashboard":V(d);else if(t==="login")_(d);else if(t==="register")G(d);else if(t==="dashboard")z(d);else if(t==="documents")W(d,a.get("status")||"ALL");else if(t.startsWith("documents/")){const m=t.replace("documents/","");Y(d,m)}else t==="upload"?J(d):t==="send"?K(d,a.get("documentId")):t==="verify"?X(d,a.get("hash")):t==="admin"?O(d):d.innerHTML='<div class="container py-5 text-center"><h4>Page not found</h4><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>'}function V(e){e.innerHTML=`
        <section class="hero-section text-center py-5">
            <div class="container px-4 py-3">
                <div class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-3">
                    ${s("heroBadge")}
                </div>
                <h1 class="display-5 fw-bold mb-3" style="letter-spacing: -0.5px;">
                    ${s("heroTitle")}
                </h1>
                <p class="lead mb-4 mx-auto text-muted" style="max-width: 680px; font-size: 1.15rem;">
                    ${s("heroSubtitle")}
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
                    <a href="#/register" class="btn btn-primary btn-lg px-4 shadow-sm">
                        <i class="fa-solid fa-pen-nib me-2"></i> ${s("btnStartFree")}
                    </a>
                    <a href="#/login" class="btn btn-outline-secondary btn-lg px-4">
                        <i class="fa-solid fa-right-to-bracket me-2"></i> ${s("btnSenderDashboard")}
                    </a>
                    <a href="#/verify" class="btn btn-outline-success btn-lg px-4">
                        <i class="fa-solid fa-shield-halved me-2"></i> ${s("btnVerifyDoc")}
                    </a>
                </div>

                <!-- 3 Simple Ordinary Steps -->
                <div class="text-center mb-4">
                    <h5 class="fw-bold text-muted text-uppercase small">${s("howItWorks")}</h5>
                </div>
                <div class="row g-4 justify-content-center text-start" style="max-width: 900px; margin: 0 auto;">
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-file-arrow-up"></i></div>
                            <h6 class="fw-bold mb-2">${s("step1Title")}</h6>
                            <p class="text-muted small mb-0">${s("step1Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-user-plus"></i></div>
                            <h6 class="fw-bold mb-2">${s("step2Title")}</h6>
                            <p class="text-muted small mb-0">${s("step2Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-file-circle-check"></i></div>
                            <h6 class="fw-bold mb-2">${s("step3Title")}</h6>
                            <p class="text-muted small mb-0">${s("step3Desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Clean, Ordinary Feature Highlights -->
        <section class="py-5 bg-white border-bottom">
            <div class="container px-4" style="max-width: 900px;">
                <div class="text-center mb-4">
                    <h4 class="fw-bold">${s("whyChooseUs")}</h4>
                </div>
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-light h-100">
                            <i class="fa-solid fa-mobile-screen text-primary fs-3 mb-2"></i>
                            <h6 class="fw-bold">${s("feature1Title")}</h6>
                            <p class="text-muted small mb-0">${s("feature1Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-light h-100">
                            <i class="fa-solid fa-stamp text-success fs-3 mb-2"></i>
                            <h6 class="fw-bold">${s("feature2Title")}</h6>
                            <p class="text-muted small mb-0">${s("feature2Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 bg-light h-100">
                            <i class="fa-solid fa-envelope-circle-check text-warning fs-3 mb-2"></i>
                            <h6 class="fw-bold">${s("feature3Title")}</h6>
                            <p class="text-muted small mb-0">${s("feature3Desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `}function _(e){e.innerHTML=`
        <div class="d-flex align-items-center justify-content-center py-5">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="max-width: 440px; width: 100%; border-radius: 12px;">
                <div class="text-center mb-4">
                    <a href="#/" class="text-decoration-none d-inline-flex align-items-center mb-2">
                        <i class="fa-solid fa-file-signature text-primary fs-2 me-2"></i>
                        <span class="fs-3 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                    </a>
                    <h5 class="fw-bold mb-1">${s("loginTitle")}</h5>
                    <p class="text-muted small">${s("loginSub")}</p>
                </div>

                <form id="loginForm">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">${s("emailAddress")}</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="name@company.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">${s("password")}</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 py-2 fw-semibold mb-3">${s("signIn")}</button>
                </form>

                <div class="p-3 bg-light rounded-3 border mb-3">
                    <div class="small fw-bold text-muted mb-2 text-uppercase" style="font-size: 0.72rem;">Quick 1-Click Demo Logins</div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-outline-dark flex-fill" id="fillAdminBtn">
                            <i class="fa-solid fa-user-shield me-1"></i> Admin
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-primary flex-fill" id="fillSenderBtn">
                            <i class="fa-solid fa-user-pen me-1"></i> Sender
                        </button>
                    </div>
                </div>

                <div class="text-center text-muted small">
                    ${s("dontHaveAccount")} <a href="#/register" class="fw-semibold text-primary text-decoration-none">${s("signUpHere")}</a>
                </div>
            </div>
        </div>
    `,document.getElementById("fillAdminBtn").onclick=()=>{document.getElementById("loginEmail").value="admin@esign.com",document.getElementById("loginPassword").value="admin123"},document.getElementById("fillSenderBtn").onclick=()=>{document.getElementById("loginEmail").value="demo@esign.com",document.getElementById("loginPassword").value="password123"},document.getElementById("loginForm").onsubmit=async t=>{t.preventDefault();const a=document.getElementById("loginEmail").value.trim(),i=document.getElementById("loginPassword").value;try{const l=await c.login(a,i);c.setToken(l.token),c.setUser(l),b.user=l,u("Welcome back, "+l.fullName+"!"),window.location.hash="#/dashboard"}catch(l){u(l.message,"danger")}}}function G(e){let t=!1,a=!1;c.clearToken(),e.innerHTML=`
        <div class="d-flex align-items-center justify-content-center py-5">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="max-width: 520px; width: 100%; border-radius: 12px;">
                <div class="text-center mb-4">
                    <a href="#/" class="text-decoration-none d-inline-flex align-items-center mb-2">
                        <i class="fa-solid fa-file-signature text-primary fs-2 me-2"></i>
                        <span class="fs-3 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                    </a>
                    <h5 class="fw-bold mb-1">${s("regTitle")}</h5>
                    <p class="text-muted small">${s("regSub")}</p>
                </div>

                <form id="regForm">
                    <div class="row g-2 mb-3">
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold">${s("firstName")} *</label>
                            <input type="text" id="regFirst" class="form-control" placeholder="Rajesh" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold">${s("lastName")} *</label>
                            <input type="text" id="regLast" class="form-control" placeholder="Sharma" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">${s("orgName")} *</label>
                        <input type="text" id="regOrg" class="form-control" placeholder="Acme Enterprises" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold">${s("emailAddress")} *</label>
                        <div class="input-group">
                            <span class="input-group-text bg-light text-muted border-end-0"><i class="fa-regular fa-envelope"></i></span>
                            <input type="email" id="regEmail" class="form-control border-start-0" placeholder="name@domain.com" required>
                            <button type="button" class="btn btn-primary fw-semibold px-3" id="sendEmailOtpBtn">
                                <i class="fa-solid fa-paper-plane me-1"></i> ${s("btnGetOtp")}
                            </button>
                        </div>
                        <div class="form-text small text-muted">${s("otpDispatchedMsg")}</div>
                        <div id="regEmailAlert" class="small mt-1"></div>
                    </div>

                    <!-- Email OTP Verification Box -->
                    <div id="emailOtpSection" class="p-3 mb-3 bg-light rounded-3 border">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label small fw-bold text-primary mb-0">
                                <i class="fa-solid fa-shield-halved me-1"></i> ${s("otpLabel")} *
                            </label>
                            <span id="regEmailVerifiedBadge" class="badge bg-success-subtle text-success d-none">
                                <i class="fa-solid fa-circle-check me-1"></i> Verified
                            </span>
                        </div>
                        <div class="row g-2 mb-2">
                            <div class="col-7">
                                <input type="text" id="regOtpCode" class="form-control font-monospace text-center fs-5 fw-bold" placeholder="------" maxlength="6" required>
                            </div>
                            <div class="col-5">
                                <button type="button" class="btn btn-outline-success w-100 fw-semibold" id="verifyEmailOtpBtn">
                                    <i class="fa-solid fa-check me-1"></i> ${s("btnVerifyOtp")}
                                </button>
                            </div>
                        </div>
                        <div id="regOtpAlert" class="small text-muted">Click <strong>${s("btnGetOtp")}</strong> to receive your code.</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-semibold">${s("password")} *</label>
                        <input type="password" id="regPass" class="form-control" placeholder="••••••••" minlength="6" required>
                    </div>

                    <button type="submit" id="submitRegBtn" class="btn btn-primary w-100 py-2 fw-semibold mb-3">
                        <i class="fa-solid fa-user-plus me-1"></i> ${s("btnCreateAccount")}
                    </button>
                </form>

                <div class="text-center text-muted small">
                    ${s("alreadyRegistered")} <a href="#/login" class="fw-semibold text-primary text-decoration-none">${s("signInHere")}</a>
                </div>
            </div>
        </div>
    `;const i=async()=>{const l=document.getElementById("regEmail").value.trim();if(!l||!l.includes("@"))return alert("Please enter a valid work email address first."),!1;const n=document.getElementById("sendEmailOtpBtn");n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const d=await c.sendRegistrationOtp(l);t=!0,document.getElementById("regEmailAlert").innerHTML=`
                <span class="text-success fw-medium">
                    <i class="fa-solid fa-envelope-circle-check me-1"></i> ${d.message||s("otpDispatchedMsg")}
                </span>
            `,u(s("otpDispatchedMsg"));let m=60;n.innerHTML=`Resend (${m}s)`;const p=setInterval(()=>{m--,m<=0?(clearInterval(p),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):n.innerHTML=`Resend (${m}s)`},1e3);return!0}catch(d){return n.disabled=!1,n.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> '+s("btnGetOtp"),document.getElementById("regEmailAlert").innerHTML=`<span class="text-danger fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${d.message}</span>`,!1}};document.getElementById("sendEmailOtpBtn").onclick=i,document.getElementById("verifyEmailOtpBtn").onclick=async()=>{const l=document.getElementById("regEmail").value.trim(),n=document.getElementById("regOtpCode").value.trim();if(n.length!==6){alert("Please enter the 6-digit OTP code sent to your email.");return}try{await c.verifyRegistrationOtp(l,n),a=!0,document.getElementById("emailOtpSection").className="p-3 mb-3 bg-success-subtle border border-success rounded-3",document.getElementById("regEmailVerifiedBadge").classList.remove("d-none"),document.getElementById("regOtpAlert").innerHTML='<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Email Verified!</span>',document.getElementById("sendEmailOtpBtn").style.display="none",document.getElementById("regEmail").readOnly=!0,u("Email verified successfully!")}catch(d){document.getElementById("regOtpAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${d.message}</span>`}},document.getElementById("regForm").onsubmit=async l=>{l.preventDefault();const n=document.getElementById("regEmail").value.trim(),d=document.getElementById("regOtpCode").value.trim();if(!d||d.length!==6){alert('Please click "Get OTP" and enter the 6-digit verification code sent to your email.'),document.getElementById("regOtpCode").focus();return}const m=document.getElementById("submitRegBtn");m.disabled=!0,m.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Creating Account...';try{const p={firstName:document.getElementById("regFirst").value.trim(),lastName:document.getElementById("regLast").value.trim(),organizationName:document.getElementById("regOrg").value.trim(),email:n,password:document.getElementById("regPass").value,otpCode:d},f=await c.register(p);c.setToken(f.token),c.setUser(f),b.user=f,u("Account created successfully!"),window.location.hash="#/dashboard"}catch(p){m.disabled=!1,m.innerHTML='<i class="fa-solid fa-user-plus me-1"></i> '+s("btnCreateAccount"),u(p.message,"danger")}}}async function z(e){e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading dashboard...</div></div>';try{const t=await c.getDashboardStats();e.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
                    <div>
                        <h4 class="fw-bold mb-1">${s("welcomeBack")} ${b.user.fullName||"User"}! 👋</h4>
                        <p class="text-muted small mb-0">${s("dashboardSub")}</p>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="#/verify" class="btn btn-outline-success btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> ${s("verify")}</a>
                        <a href="#/upload" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-cloud-arrow-up me-1"></i> ${s("btnNewDoc")}</a>
                    </div>
                </div>

                <!-- 3 Simple KPI Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="text-muted small fw-semibold">${s("totalDocs")}</span>
                                <i class="fa-solid fa-file text-primary fs-5"></i>
                            </div>
                            <h3 class="fw-bold mb-0">${t.totalDocuments}</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="text-muted small fw-semibold">${s("pendingDocs")}</span>
                                <i class="fa-solid fa-hourglass-half text-warning fs-5"></i>
                            </div>
                            <h3 class="fw-bold mb-0 text-warning">${t.pendingSignatures}</h3>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="stat-card">
                            <div class="d-flex align-items-center justify-content-between mb-2">
                                <span class="text-muted small fw-semibold">${s("completedDocs")}</span>
                                <i class="fa-solid fa-circle-check text-success fs-5"></i>
                            </div>
                            <h3 class="fw-bold mb-0 text-success">${t.completedDocuments}</h3>
                        </div>
                    </div>
                </div>

                <!-- Recent Documents Table -->
                <div class="card border-0 shadow-sm bg-white">
                    <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
                        <span class="fw-bold"><i class="fa-solid fa-folder-open text-primary me-2"></i> ${s("recentDocsTitle")}</span>
                        <a href="#/documents" class="small text-primary fw-semibold text-decoration-none">${s("viewAll")} <i class="fa-solid fa-arrow-right ms-1"></i></a>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">${s("colDoc")}</th>
                                    <th>${s("colStatus")}</th>
                                    <th>${s("colDate")}</th>
                                    <th class="text-end pe-3">${s("colActions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${t.recentDocuments&&t.recentDocuments.length>0?t.recentDocuments.map(a=>`
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold text-truncate" style="max-width: 280px;">
                                                <a href="#/documents/${a.id}" class="text-decoration-none text-dark">${a.title}</a>
                                            </div>
                                            <div class="small text-muted">${a.pages||1} pgs • ${a.fileName}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${a.status}">${a.status}</span></td>
                                        <td class="small text-muted">${new Date(a.createdAt).toLocaleDateString()}</td>
                                        <td class="text-end pe-3">
                                            <a href="#/documents/${a.id}" class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-eye me-1"></i> View</a>
                                        </td>
                                    </tr>
                                `).join(""):`<tr><td colspan="4" class="text-center py-4 text-muted">${s("noDocsFound")}</td></tr>`}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}catch(t){u(t.message,"danger")}}async function W(e,t="ALL"){e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const a=await c.getDocuments(t);e.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="fw-bold mb-1"><i class="fa-regular fa-folder-open text-primary me-2"></i> Documents Registry</h4>
                        <p class="text-muted small mb-0">View all uploaded agreements, tracking signatures, and sealed files.</p>
                    </div>
                    <a href="#/upload" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload PDF</a>
                </div>

                <!-- Filter Pills -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <ul class="nav nav-pills gap-1">
                        ${["ALL","DRAFT","SENT","IN_PROGRESS","COMPLETED","CANCELLED"].map(i=>`
                            <li class="nav-item">
                                <a class="nav-link py-1 px-3 small fw-semibold ${t===i?"active bg-primary":"text-muted"}" href="#/documents?status=${i}">${i}</a>
                            </li>
                        `).join("")}
                    </ul>
                </div>

                <div class="card border-0 bg-white shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Document Title</th>
                                    <th>Status</th>
                                    <th>Pages / Size</th>
                                    <th>Date</th>
                                    <th>SHA-256 Fingerprint</th>
                                    <th class="text-end pe-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${a.length>0?a.map(i=>`
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold"><a href="#/documents/${i.id}" class="text-decoration-none text-dark">${i.title}</a></div>
                                            <div class="small text-muted">${i.fileName}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${i.status}">${i.status}</span></td>
                                        <td class="small text-muted">${i.pageCount} pgs • ${Math.round((i.fileSize||0)/1024)} KB</td>
                                        <td class="small text-muted">${new Date(i.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}</td>
                                        <td>
                                            ${i.finalHash?`
                                                <span class="badge bg-success-subtle text-success font-monospace" title="${i.finalHash}">
                                                    <i class="fa-solid fa-shield-halved me-1"></i> ${i.finalHash.substring(0,10)}...
                                                </span>
                                            `:`<span class="small font-monospace text-muted">${i.originalHash?i.originalHash.substring(0,10)+"...":"-"}</span>`}
                                        </td>
                                        <td class="text-end pe-3">
                                            <div class="btn-group btn-group-sm">
                                                <a href="#/documents/${i.id}" class="btn btn-outline-secondary">Inspect</a>
                                                ${i.status==="DRAFT"?`<a href="#/send?documentId=${i.id}" class="btn btn-outline-primary">Send</a>`:""}
                                                <button type="button" onclick="window.downloadDoc('${i.id}', true, 'SEALED_${i.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-outline-success" title="Download Document"><i class="fa-solid fa-download"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join(""):'<tr><td colspan="6" class="text-center py-5 text-muted">No documents found matching this filter.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}catch(a){u(a.message,"danger")}}async function Y(e,t){e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const a=await c.getDocument(t);e.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge rounded-pill px-3 py-1 badge-status-${a.status} fw-bold">${a.status}</span>
                            ${a.sequentialSigning?'<span class="badge bg-secondary-subtle text-secondary small">Sequential Routing</span>':""}
                        </div>
                        <h3 class="fw-bold mb-1">${a.title}</h3>
                        <div class="text-muted small">Uploaded by <strong>${a.ownerName}</strong> on ${new Date(a.createdAt).toLocaleString("en-IN")}</div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        ${a.status==="DRAFT"?`<a href="#/send?documentId=${a.id}" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-paper-plane me-1"></i> Send for Signature</a>`:""}
                        ${a.finalHash?`<button type="button" onclick="window.downloadDoc('${a.id}', true, 'SEALED_${a.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-success btn-sm px-3"><i class="fa-solid fa-file-shield me-1"></i> Download Sealed PDF</button>`:""}
                        <button type="button" onclick="window.downloadDoc('${a.id}', false, 'ORIGINAL_${a.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-outline-secondary btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Original PDF</button>
                        ${a.finalHash?`<a href="#/verify?hash=${a.finalHash}" class="btn btn-outline-primary btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> Verify on Ledger</a>`:""}
                    </div>
                </div>

                <!-- Cryptographic Hashes Card -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Original Pre-Execution SHA-256</div>
                            <div class="hash-box">${a.originalHash||"N/A"}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Final Sealed SHA-256 Fingerprint</div>
                            <div class="hash-box text-success fw-bold">${a.finalHash||"Pending completion of all signatories"}</div>
                        </div>
                    </div>
                </div>

                <!-- Signatories Table -->
                <div class="card border-0 bg-white mb-4 shadow-sm">
                    <div class="card-header bg-white py-3 fw-bold"><i class="fa-solid fa-users text-primary me-2"></i> Signatories Execution Progress</div>
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Order</th>
                                    <th>Signer Name &amp; Email</th>
                                    <th>Status</th>
                                    <th>OTP Identity</th>
                                    <th>Signed At</th>
                                    <th class="text-end pe-3">Actions &amp; Signing Access</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${a.signers&&a.signers.length>0?a.signers.map(i=>`
                                    <tr>
                                        <td class="ps-3 fw-bold text-muted">#${i.signOrder}</td>
                                        <td>
                                            <div class="fw-bold">${i.name}</div>
                                            <div class="small text-muted">${i.email}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${i.status}">${i.status}</span></td>
                                        <td>${i.otpVerified?'<span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> Verified</span>':'<span class="badge bg-light text-muted">Pending</span>'}</td>
                                        <td class="small text-muted">${i.signedAt?new Date(i.signedAt).toLocaleString("en-IN"):"-"}</td>
                                        <td class="text-end pe-3">
                                            ${i.status!=="SIGNED"?`
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="window.copySignerLink('${i.signingToken}', event)" title="Copy direct signing link">
                                                        <i class="fa-regular fa-copy me-1"></i> Copy Link
                                                    </button>
                                                    <button type="button" class="btn btn-outline-primary" onclick="window.resendInvite('${i.id}', event)" title="Resend email invite via Gmail">
                                                        <i class="fa-solid fa-paper-plane me-1"></i> Resend Email
                                                    </button>
                                                    <a href="#/sign/${i.signingToken}" target="_blank" class="btn btn-primary" title="Open signing portal">
                                                        <i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open
                                                    </a>
                                                </div>
                                            `:'<span class="badge bg-success-subtle text-success fs-6"><i class="fa-solid fa-circle-check me-1"></i> Executed</span>'}
                                        </td>
                                    </tr>
                                `).join(""):'<tr><td colspan="6" class="text-center py-4 text-muted">No signers configured. Click "Send for Signature" to configure.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Chained Audit Log Table (FR-09) -->
                <div class="card border-0 bg-white shadow-sm">
                    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                        <span class="fw-bold"><i class="fa-solid fa-link text-primary me-2"></i> Chained Immutable Audit Trail</span>
                        <span class="badge bg-success-subtle text-success small">FR-09 Compliant</span>
                    </div>
                    <div class="table-responsive">
                        <table class="table table-sm table-hover align-middle mb-0 font-monospace" style="font-size: 0.8rem;">
                            <thead class="table-light text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">Timestamp (IST)</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                    <th>IP Address</th>
                                    <th>Previous Hash</th>
                                    <th class="pe-3">Current Hash</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${a.auditLogs&&a.auditLogs.length>0?a.auditLogs.map(i=>`
                                    <tr>
                                        <td class="ps-3 text-nowrap text-muted">${new Date(i.timestamp).toLocaleString("en-IN")}</td>
                                        <td><span class="badge bg-light text-dark">${i.action}</span></td>
                                        <td class="text-break" style="font-family: sans-serif; max-width: 300px;">${i.details}</td>
                                        <td class="text-muted">${i.ipAddress}</td>
                                        <td class="text-muted">${i.prevHash?i.prevHash.substring(0,10)+"...":"-"}</td>
                                        <td class="pe-3 text-success fw-bold">${i.currentHash?i.currentHash.substring(0,10)+"...":"-"}</td>
                                    </tr>
                                `).join(""):'<tr><td colspan="6" class="text-center py-3 text-muted">No audit events recorded yet.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}catch(a){u(a.message,"danger")}}function J(e){e.innerHTML=`
        <div class="container py-5" style="max-width: 680px;">
            <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="border-radius: 12px;">
                <div class="mb-4 text-center">
                    <h4 class="fw-bold mb-1"><i class="fa-solid fa-cloud-arrow-up text-primary me-2"></i> ${s("uploadTitle")}</h4>
                    <p class="text-muted small">${s("uploadSub")}</p>
                </div>

                <form id="uploadForm">
                    <div class="mb-4">
                        <div class="upload-dropzone p-4" id="dropzoneBox" onclick="document.getElementById('fileInput').click()">
                            <i class="fa-solid fa-file-pdf text-primary fs-1 mb-2"></i>
                            <h6 class="fw-bold mb-1" id="dropLabel">${s("clickToUpload")}</h6>
                            <p class="text-muted small mb-0">PDF up to 25 MB</p>
                        </div>
                        <input type="file" id="fileInput" accept="application/pdf" class="d-none">
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold small">${s("docTitleLabel")} *</label>
                        <input type="text" id="docTitle" class="form-control" placeholder="${s("docTitlePlaceholder")}" required>
                    </div>

                    <div class="mb-3">
                        <label class="form-label fw-semibold small">${s("docDescLabel")}</label>
                        <textarea id="docDesc" class="form-control" rows="2" placeholder="Notes for your reference..."></textarea>
                    </div>

                    <div class="d-flex justify-content-between pt-3 border-top mt-4">
                        <a href="#/documents" class="btn btn-outline-secondary">${s("cancel")}</a>
                        <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-arrow-right me-1"></i> ${s("btnUploadNext")}</button>
                    </div>
                </form>
            </div>
        </div>
    `;const t=document.getElementById("fileInput"),a=document.getElementById("dropzoneBox");t.onchange=()=>{t.files[0]&&(document.getElementById("dropLabel").innerHTML=`<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> ${t.files[0].name}</span>`)},a&&(["dragenter","dragover"].forEach(i=>{a.addEventListener(i,l=>{l.preventDefault(),a.style.borderColor="#2563eb",a.style.background="#eff6ff"})}),["dragleave","drop"].forEach(i=>{a.addEventListener(i,l=>{l.preventDefault(),a.style.borderColor="#cbd5e1",a.style.background="#f8fafc"})}),a.addEventListener("drop",i=>{i.dataTransfer.files&&i.dataTransfer.files.length>0&&(t.files=i.dataTransfer.files,t.dispatchEvent(new Event("change")))})),document.getElementById("uploadForm").onsubmit=async i=>{i.preventDefault();const l=new FormData,n=document.getElementById("docTitle").value.trim()||"Agreement";l.append("title",n),l.append("description",document.getElementById("docDesc").value.trim()),l.append("sequentialSigning",!1),t.files[0]&&l.append("file",t.files[0]);try{const d=await c.uploadDocument(l);u("Document uploaded successfully!"),window.location.hash=`#/send?documentId=${d.id}`}catch(d){u(d.message,"danger")}}}async function K(e,t){e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const a=await c.getDocuments("DRAFT");e.innerHTML=`
            <div class="container py-4" style="max-width: 760px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white" style="border-radius: 12px;">
                    <div class="mb-4">
                        <h4 class="fw-bold mb-1"><i class="fa-solid fa-paper-plane text-primary me-2"></i> ${s("sendTitle")}</h4>
                        <p class="text-muted small">${s("sendSub")}</p>
                    </div>

                    <form id="sendForm">
                        <div class="mb-3">
                            <label class="form-label fw-semibold small">${s("colDoc")}</label>
                            <select id="targetDoc" class="form-select" required>
                                ${a.map(l=>`<option value="${l.id}" ${l.id===t?"selected":""}>${l.title} (${l.fileName})</option>`).join("")}
                            </select>
                        </div>

                        <div class="mb-3">
                            <label class="form-label fw-semibold small">Email Subject</label>
                            <input type="text" id="reqTitle" class="form-control" value="Please Review and Sign Document" required>
                        </div>

                        <!-- Dynamic Signers -->
                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <label class="form-label fw-bold mb-0">${s("signerNumber")}</label>
                                <button type="button" class="btn btn-outline-primary btn-sm" id="addSignerBtn">
                                    ${s("btnAddSigner")}
                                </button>
                            </div>
                            <div id="signersList">
                                <div class="p-3 bg-light rounded-3 border mb-2 signer-row">
                                    <div class="row g-2">
                                        <div class="col-md-5"><input type="text" class="form-control form-control-sm signer-name" placeholder="${s("fullName")} *" required></div>
                                        <div class="col-md-5"><input type="email" class="form-control form-control-sm signer-email" placeholder="${s("emailAddress")} *" required></div>
                                        <div class="col-md-2"><input type="tel" class="form-control form-control-sm signer-phone" placeholder="Mobile"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between pt-3 border-top">
                            <a href="#/documents" class="btn btn-outline-secondary">${s("cancel")}</a>
                            <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-paper-plane me-1"></i> ${s("btnSendInvites")}</button>
                        </div>
                    </form>
                </div>
            </div>
        `;let i=1;document.getElementById("addSignerBtn").onclick=()=>{i++;const l=document.getElementById("signersList"),n=document.createElement("div");n.className="p-3 bg-light rounded-3 border mb-2 signer-row",n.innerHTML=`
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-secondary">${s("signerNumber")} #${i}</span>
                    <button type="button" class="btn btn-link text-danger p-0 small text-decoration-none" onclick="this.closest('.signer-row').remove()">
                        <i class="fa-solid fa-trash me-1"></i> Remove
                    </button>
                </div>
                <div class="row g-2">
                    <div class="col-md-5"><input type="text" class="form-control form-control-sm signer-name" placeholder="${s("fullName")} *" required></div>
                    <div class="col-md-5"><input type="email" class="form-control form-control-sm signer-email" placeholder="${s("emailAddress")} *" required></div>
                    <div class="col-md-2"><input type="tel" class="form-control form-control-sm signer-phone" placeholder="Mobile"></div>
                </div>
            `,l.appendChild(n)},document.getElementById("sendForm").onsubmit=async l=>{l.preventDefault();const n=[];document.querySelectorAll(".signer-row").forEach((p,f)=>{n.push({name:p.querySelector(".signer-name").value.trim(),email:p.querySelector(".signer-email").value.trim(),phone:p.querySelector(".signer-phone").value.trim(),order:f+1})});const m={documentId:document.getElementById("targetDoc").value,title:document.getElementById("reqTitle").value.trim(),message:"",dueDate:null,sequentialSigning:!1,signers:n};try{const p=await c.createSigningRequest(m);let f="";p.signers&&p.signers.length>0&&(f=p.signers.map(h=>`
• ${h.name} (${h.email}):
  ${window.location.origin}/#/sign/${h.token}`).join(`
`)),alert("✅ "+s("dispatchedSuccess")+(f?`

Direct Signing Links (Copy to share):
`+f:"")),u(s("dispatchedSuccess")),window.location.hash=`#/documents/${m.documentId}`}catch(p){u(p.message,"danger")}}}catch(a){u(a.message,"danger")}}async function Z(e,t){e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading signing context...</div></div>';try{let N=function(){const o=n.getBoundingClientRect();n.width=o.width*2,n.height=180*2,d.scale(2,2),d.strokeStyle=p,d.lineWidth=2.5,d.lineCap="round",d.lineJoin="round"},T=function(o){const r=n.getBoundingClientRect();return o.touches&&o.touches.length>0?{x:o.touches[0].clientX-r.left,y:o.touches[0].clientY-r.top}:{x:o.clientX-r.left,y:o.clientY-r.top}};var a=N,i=T;const l=await c.getSigningContext(t);if(l.signerStatus==="SIGNED"){e.innerHTML=`
                <div class="d-flex align-items-center justify-content-center py-5">
                    <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 540px; border-radius: 16px;">
                        <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
                        <h4 class="fw-bold mb-2">Already Executed</h4>
                        <p class="text-muted small mb-4">You have already completed electronic signing for this document on ${new Date(l.signedAt).toLocaleString("en-IN")}.</p>
                        <a href="#/verify?hash=${l.finalHash||""}" class="btn btn-outline-primary btn-sm">Public Ledger Verification</a>
                    </div>
                </div>
            `;return}e.innerHTML=`
            <div class="container py-4" style="max-width: 860px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-file-signature text-primary fs-3 me-2"></i>
                        <span class="fs-4 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                        <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill small">${s("signerWelcome")}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fa-solid fa-globe me-1"></i> ${x()==="hi"?"🇮🇳 हिन्दी":x()==="mr"?"🇮🇳 मराठी":x()==="gu"?"🇮🇳 ગુજરાતી":"🌐 Language"}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('en')">🇬🇧 English</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('hi')">🇮🇳 हिन्दी (Hindi)</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('mr')">🇮🇳 मराठी (Marathi)</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('gu')">🇮🇳 ગુજરાતી (Gujarati)</a></li>
                            </ul>
                        </div>
                        <div class="small text-muted d-none d-sm-block">${s("requestedBy")} <strong>${l.senderName}</strong></div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm bg-white p-4 p-md-5 mb-4">
                    <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-warning-subtle text-warning fw-bold mb-1">Awaiting Signature</span>
                            <h4 class="fw-bold mb-1">${l.documentTitle}</h4>
                            <div class="text-muted small">Signer: <strong>${l.signerName}</strong> (${l.signerEmail})</div>
                        </div>
                        <a href="${c.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open PDF</a>
                    </div>

                    <!-- In-Browser Document Preview -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-regular fa-file-pdf text-danger me-1"></i> Document Review</label>
                        <div class="rounded-3 border overflow-hidden" style="height: 380px; background: #e2e8f0;">
                            <iframe src="${c.getSigningPreviewUrl(t)}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                    </div>

                    <!-- STEP 1: OTP Identity Check (FR-07) -->
                    <div class="p-3 mb-4 rounded-3 border ${l.otpVerified?"bg-success-subtle border-success":"bg-light"}" id="otpContainer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small text-uppercase"><i class="fa-solid fa-shield-halved text-primary me-1"></i> Step 1: Identity Verification (OTP)</span>
                                <div class="small text-muted" id="otpText">${l.otpVerified?'<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP':s("otpNotice")}</div>
                            </div>
                            ${l.otpVerified?"":`<button type="button" class="btn btn-sm btn-primary" id="getOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> ${s("btnGetOtp")}</button>`}
                        </div>

                        <div id="otpInputArea" class="mt-3 pt-3 border-top" style="display: none;">
                            <div class="row g-2 align-items-center">
                                <div class="col-sm-5"><input type="text" id="signerOtp" class="form-control text-center fw-bold fs-6 font-monospace" placeholder="6-digit code" maxlength="6"></div>
                                <div class="col-sm-4"><button type="button" class="btn btn-sm btn-success w-100 fw-semibold" id="verifyOtpBtn">${s("btnVerifyOtp")}</button></div>
                            </div>
                            <div id="otpMsg" class="small mt-2"></div>
                        </div>
                    </div>

                    <!-- STEP 2: Signature Input (FR-06) -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-solid fa-pen-nib text-primary me-1"></i> Step 2: Adopt Signature</label>

                        <ul class="nav nav-tabs nav-fill mb-3" id="sigModeTab">
                            <li class="nav-item"><button class="nav-link active fw-semibold" data-mode="DRAWN" type="button"><i class="fa-solid fa-paintbrush me-1"></i> ${s("tabDraw")}</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold" data-mode="TYPED" type="button"><i class="fa-solid fa-keyboard me-1"></i> ${s("tabType")}</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold" data-mode="UPLOADED" type="button"><i class="fa-solid fa-arrow-up-from-bracket me-1"></i> Upload</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold text-primary" data-mode="AADHAAR_ESIGN" type="button"><i class="fa-solid fa-id-card me-1"></i> Aadhaar e-Sign <span class="badge bg-warning text-dark small ms-1">UIDAI</span></button></li>
                        </ul>

                        <div id="paneDrawn">
                            <div class="sig-canvas-container mb-2">
                                <canvas id="signCanvas"></canvas>
                            </div>
                            <div class="d-flex justify-content-between">
                                <div class="btn-group btn-group-sm">
                                    <button type="button" class="btn btn-outline-dark active" id="penBlack">Black</button>
                                    <button type="button" class="btn btn-outline-primary" id="penBlue">Blue</button>
                                </div>
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="clearCanvasBtn"><i class="fa-solid fa-rotate-left me-1"></i> ${s("btnClear")}</button>
                            </div>
                        </div>

                        <div id="paneTyped" style="display: none;">
                            <input type="text" id="typedInput" class="form-control mb-3" value="${l.signerName}" placeholder="Type legal name...">
                            <div class="row g-2">
                                <div class="col-6"><div class="typed-sig-preview selected" id="styleOpt1"><div class="font-great-vibes" id="typePrev1">${l.signerName}</div><div class="small text-muted mt-2">Style 1</div></div></div>
                                <div class="col-6"><div class="typed-sig-preview" id="styleOpt2"><div class="font-dancing-script" id="typePrev2">${l.signerName}</div><div class="small text-muted mt-2">Style 2</div></div></div>
                            </div>
                        </div>

                        <div id="paneUploaded" style="display: none;" class="p-4 border rounded-3 text-center bg-light">
                            <i class="fa-regular fa-image text-muted fs-1 mb-2"></i>
                            <p class="small text-muted mb-2">Upload a clean scanned photo or PNG of your handwritten signature</p>
                            <input type="file" id="sigUploadInput" accept="image/*" class="form-control form-control-sm w-auto mx-auto">
                            <div id="upPreviewBox" class="mt-3" style="display: none;"><img id="upPreviewImg" style="max-height: 80px; border: 1px solid #cbd5e1; border-radius: 4px; padding: 4px;"></div>
                        </div>

                        <div id="paneAadhaar" style="display: none;" class="p-4 border rounded-3 bg-light">
                            <div class="d-flex align-items-center mb-2">
                                <span class="badge bg-warning text-dark px-2 py-1 me-2 fw-bold">UIDAI e-KYC</span>
                                <h6 class="fw-bold mb-0 text-primary">Aadhaar e-Sign Verification (Section 3A, IT Act 2000)</h6>
                            </div>
                            <p class="small text-muted mb-3">Authenticate identity directly with your 12-digit Aadhaar number using a One-Time Passcode (OTP).</p>
                            <div id="spaAadhaarForm">
                                <div class="row g-2 mb-3">
                                    <div class="col-md-7">
                                        <label class="form-label small fw-semibold">12-Digit Aadhaar Number</label>
                                        <input type="text" id="spaAadhaarInput" class="form-control font-monospace" placeholder="e.g. 5489 1234 5678" maxlength="14">
                                    </div>
                                    <div class="col-md-5 d-flex align-items-end">
                                        <button type="button" class="btn btn-primary w-100 fw-semibold" id="spaSendAadhaarOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP</button>
                                    </div>
                                </div>
                                <div id="spaAadhaarOtpRow" style="display: none;" class="pt-3 border-top">
                                    <label class="form-label small fw-semibold">Enter 6-Digit UIDAI OTP Code</label>
                                    <div class="row g-2">
                                        <div class="col-md-7"><input type="text" id="spaAadhaarOtpCode" class="form-control font-monospace text-center fs-5 fw-bold" placeholder="------" maxlength="6"></div>
                                        <div class="col-md-5"><button type="button" class="btn btn-success w-100 fw-semibold" id="spaVerifyAadhaarOtpBtn"><i class="fa-solid fa-check-double me-1"></i> Verify Aadhaar</button></div>
                                    </div>
                                    <div id="spaAadhaarAlert" class="small mt-2"></div>
                                </div>
                            </div>
                            <div id="spaAadhaarSuccess" style="display: none;" class="p-3 bg-white border border-success rounded-3 text-center">
                                <i class="fa-solid fa-circle-check text-success fs-2 mb-2"></i>
                                <h6 class="fw-bold text-success mb-1">Aadhaar Identity Authenticated</h6>
                                <div class="small text-muted mb-3" id="spaAadhaarDetails"></div>
                                <img id="spaAadhaarStampImg" style="max-width: 100%; border: 1px solid #cbd5e1; border-radius: 6px;">
                            </div>
                        </div>
                    </div>

                    <!-- STEP 3: Legal Consent Checkbox (IT Act 2000 Sec 10A) -->
                    <div class="p-3 mb-4 bg-light rounded-3 border">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="legalConsent" required>
                            <label class="form-check-label small" for="legalConsent">
                                <strong>Legal Declaration:</strong> I hereby declare that I am <strong>${l.signerName}</strong>, and I agree to be bound by the terms set forth herein. I acknowledge that my electronic signature constitutes a legally valid contract execution under <strong>Section 10A of the Information Technology Act, 2000</strong> and the Indian Contract Act, 1872.
                            </label>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-outline-danger btn-sm" id="declineBtn"><i class="fa-solid fa-xmark me-1"></i> Decline</button>
                        <button type="button" class="btn btn-success btn-lg px-4 fw-bold shadow" id="executeBtn"><i class="fa-solid fa-signature me-2"></i> ${s("btnCompleteSigning")}</button>
                    </div>
                </div>
            </div>
        `;const n=document.getElementById("signCanvas"),d=n.getContext("2d");let m="DRAWN",p="#0f172a",f=!1,h=0,v=0,$=!1,S="",L=1;N(),n.onmousedown=o=>{f=!0,$=!0;const r=T(o);h=r.x,v=r.y},n.onmousemove=o=>{if(!f)return;const r=T(o);d.strokeStyle=p,d.beginPath(),d.moveTo(h,v),d.lineTo(r.x,r.y),d.stroke(),h=r.x,v=r.y},n.onmouseup=()=>f=!1,n.onmouseleave=()=>f=!1,n.ontouchstart=o=>{f=!0,$=!0;const r=T(o);h=r.x,v=r.y},n.ontouchmove=o=>{if(!f)return;o.preventDefault();const r=T(o);d.strokeStyle=p,d.beginPath(),d.moveTo(h,v),d.lineTo(r.x,r.y),d.stroke(),h=r.x,v=r.y},n.ontouchend=()=>f=!1,document.getElementById("clearCanvasBtn").onclick=()=>{d.clearRect(0,0,n.width,n.height),$=!1},document.getElementById("penBlack").onclick=function(){p="#0f172a",this.classList.add("active"),document.getElementById("penBlue").classList.remove("active")},document.getElementById("penBlue").onclick=function(){p="#1e40af",this.classList.add("active"),document.getElementById("penBlack").classList.remove("active")},document.querySelectorAll("#sigModeTab button").forEach(o=>{o.onclick=()=>{document.querySelectorAll("#sigModeTab button").forEach(r=>r.classList.remove("active")),o.classList.add("active"),m=o.dataset.mode,document.getElementById("paneDrawn").style.display=m==="DRAWN"?"block":"none",document.getElementById("paneTyped").style.display=m==="TYPED"?"block":"none",document.getElementById("paneUploaded").style.display=m==="UPLOADED"?"block":"none",document.getElementById("paneAadhaar").style.display=m==="AADHAAR_ESIGN"?"block":"none"}});const A=document.getElementById("typedInput");A.oninput=()=>{document.getElementById("typePrev1").textContent=A.value||"Name",document.getElementById("typePrev2").textContent=A.value||"Name"},document.getElementById("styleOpt1").onclick=()=>{L=1,document.getElementById("styleOpt1").classList.add("selected"),document.getElementById("styleOpt2").classList.remove("selected")},document.getElementById("styleOpt2").onclick=()=>{L=2,document.getElementById("styleOpt2").classList.add("selected"),document.getElementById("styleOpt1").classList.remove("selected")},document.getElementById("sigUploadInput").onchange=function(){if(this.files[0]){const o=new FileReader;o.onload=r=>{S=r.target.result,document.getElementById("upPreviewImg").src=S,document.getElementById("upPreviewBox").style.display="block"},o.readAsDataURL(this.files[0])}};const y=document.getElementById("getOtpBtn");let I=null;y&&(y.onclick=async()=>{if(!y.disabled){y.disabled=!0,y.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';try{const o=await c.requestOtp(t);document.getElementById("otpInputArea").style.display="block",document.getElementById("otpMsg").innerHTML=`<span class="text-success"><i class="fa-solid fa-envelope-circle-check me-1"></i> ${o.message||"OTP sent to your email."}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your inbox or spam folder. Valid for 10 minutes.</small></span>`;let r=60;y.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${r}s)`,I&&clearInterval(I),I=setInterval(()=>{r--,r<=0?(clearInterval(I),y.disabled=!1,y.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP Code'):y.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${r}s)`},1e3)}catch(o){y.disabled=!1,y.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code',u(o.message,"danger")}}}),document.getElementById("verifyOtpBtn").onclick=async()=>{const o=document.getElementById("signerOtp").value.trim();if(!o){alert("Enter 6-digit code");return}try{await c.verifyOtp(t,o),document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Code!',document.getElementById("otpInputArea").style.display="none"}catch(r){document.getElementById("otpMsg").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${r.message}</span>`}},document.getElementById("declineBtn").onclick=async()=>{const o=prompt("Please specify reason for declining:");o&&(await c.declineSignature(t,o),u("Document declined."),window.location.reload())};let C=!1,M="";const R=document.getElementById("spaAadhaarInput");R&&(R.oninput=function(){let o=this.value.replace(/\D/g,"");o.length>12&&(o=o.substring(0,12));let r="";for(let g=0;g<o.length;g++)g>0&&g%4===0&&(r+=" "),r+=o[g];this.value=r});const w=document.getElementById("spaSendAadhaarOtpBtn");let E=null;w&&(w.onclick=async()=>{if(w.disabled)return;const o=document.getElementById("spaAadhaarInput").value.replace(/\D/g,"");if(o.length!==12||o.startsWith("0")||o.startsWith("1")){alert("Please enter a valid 12-digit Aadhaar number (cannot start with 0 or 1).");return}try{w.disabled=!0,w.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Requesting OTP...';const r=await c.requestAadhaarOtp(t,o);document.getElementById("spaAadhaarOtpRow").style.display="block",document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${r.message||"Aadhaar OTP dispatched to linked mobile & email."}</span>`;let g=60;w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${g}s)`,E&&clearInterval(E),E=setInterval(()=>{g--,g<=0?(clearInterval(E),w.disabled=!1,w.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${g}s)`},1e3)}catch(r){w.disabled=!1,w.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP',document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${r.message}</span>`}});const q=document.getElementById("spaVerifyAadhaarOtpBtn");q&&(q.onclick=async()=>{const o=document.getElementById("spaAadhaarInput").value.replace(/\D/g,""),r=document.getElementById("spaAadhaarOtpCode").value.trim();if(r.length!==6){alert("Please enter 6-digit Aadhaar OTP code.");return}try{const g=await c.verifyAadhaarOtp(t,o,r);C=!0,M=g.signatureData,document.getElementById("spaAadhaarForm").style.display="none",document.getElementById("spaAadhaarSuccess").style.display="block",document.getElementById("spaAadhaarDetails").innerHTML=`<strong>UID:</strong> ${g.maskedAadhaar} &bull; <strong>Txn:</strong> ${g.txnId}`,document.getElementById("spaAadhaarStampImg").src=g.signatureData,document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via UIDAI Aadhaar e-KYC!',document.getElementById("otpInputArea").style.display="none",document.getElementById("legalConsent").checked=!0,u("Aadhaar identity verified successfully!")}catch(g){document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${g.message}</span>`}}),document.getElementById("executeBtn").onclick=async()=>{if(!document.getElementById("legalConsent").checked){alert("You must accept the legal consent agreement under IT Act 2000.");return}let o="";if(m==="DRAWN"){if(!$){alert("Please draw your signature.");return}o=n.toDataURL("image/png")}else if(m==="TYPED"){const r=A.value.trim();if(!r){alert("Enter your legal name.");return}const g=document.createElement("canvas");g.width=400,g.height=100;const D=g.getContext("2d");D.fillStyle="#ffffff",D.fillRect(0,0,400,100),D.fillStyle="#0f172a",D.font=L===1?'48px "Great Vibes", cursive':'44px "Dancing Script", cursive',D.textAlign="center",D.textBaseline="middle",D.fillText(r,200,50),o=g.toDataURL("image/png")}else if(m==="UPLOADED"){if(!S){alert("Please upload signature image.");return}o=S}else if(m==="AADHAAR_ESIGN"){if(!C){alert("Please enter your 12-digit Aadhaar number and verify with OTP before executing.");return}o=M}try{await c.submitSignature(t,{signatureData:o,signatureType:m,typedName:A.value.trim(),consentAccepted:!0}),e.innerHTML=`
                    <div class="d-flex align-items-center justify-content-center py-5">
                        <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 580px; border-radius: 16px;">
                            <div class="rounded-circle bg-success-subtle text-success mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; font-size: 2rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 class="fw-bold mb-2">Signature Recorded &amp; Sealed!</h3>
                            <p class="text-muted mb-4">Thank you, <strong>${l.signerName}</strong>. Your electronic signature has been cryptographically sealed under Section 10A of the IT Act 2000.</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="${c.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-file-pdf me-1"></i> View Executed PDF</a>
                                <a href="#/verify" class="btn btn-primary btn-sm"><i class="fa-solid fa-shield-halved me-1"></i> Public Ledger Verification</a>
                            </div>
                        </div>
                    </div>
                `}catch(r){u(r.message,"danger")}}}catch(l){e.innerHTML=`<div class="container py-5 text-center"><h4>Invalid or expired signing link</h4><p class="text-muted small">${l.message}</p><a href="#/" class="btn btn-primary">Go to Home</a></div>`}}async function X(e,t=""){e.innerHTML=`
        <div class="container py-5" style="max-width: 860px;">
            <div class="text-center mb-4">
                <div class="badge bg-success-subtle text-success fw-bold px-3 py-1 rounded-pill mb-2">
                    <i class="fa-solid fa-shield-halved me-1"></i> ${s("verifyTitle")}
                </div>
                <h3 class="fw-bold">${s("verifyTitle")}</h3>
                <p class="text-muted small mx-auto" style="max-width: 620px;">
                    ${s("verifySub")}
                </p>
            </div>

            <div class="card border-0 shadow-sm bg-white p-4 mb-4">
                <form id="verifyForm">
                    <div class="input-group">
                        <input type="text" id="verifyHashInput" class="form-control" placeholder="${s("pasteHashLabel")}..." value="${t||""}" required>
                        <button type="submit" class="btn btn-primary px-4 fw-semibold"><i class="fa-solid fa-magnifying-glass me-1"></i> ${s("btnVerifyNow")}</button>
                    </div>
                </form>
            </div>

            <div id="verifyResultArea"></div>
        </div>
    `;const a=document.getElementById("verifyResultArea");async function i(l){a.innerHTML='<div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin fs-3 text-primary"></i></div>';try{const n=await c.verifyHash(l);a.innerHTML=`
                <div class="card border-0 shadow-sm p-4 mb-4 ${n.verified?"bg-success-subtle border border-success":"bg-danger-subtle border border-danger"}">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-${n.verified?"circle-check text-success":"circle-xmark text-danger"} fs-1 me-3"></i>
                        <div>
                            <h5 class="fw-bold mb-1 ${n.verified?"text-success":"text-danger"}">${n.verified?"CRYPTOGRAPHICALLY VERIFIED &amp; AUTHENTIC":"VERIFICATION FAILED"}</h5>
                            <p class="mb-0 small">${n.statusMessage}</p>
                        </div>
                    </div>
                </div>

                ${n.verified?`
                    <div class="card border-0 shadow-sm bg-white p-4 mb-4">
                        <h5 class="fw-bold mb-1">${n.title}</h5>
                        <div class="text-muted small mb-3">Issued by <strong>${n.senderName}</strong> (${n.organizationName})</div>

                        <div class="row g-3 mb-4">
                            <div class="col-md-6">
                                <div class="small fw-bold text-muted text-uppercase mb-1">Final Sealed SHA-256 Hash</div>
                                <div class="hash-box text-success fw-bold">${n.finalHash||"Pending"}</div>
                            </div>
                            <div class="col-md-6">
                                <div class="small fw-bold text-muted text-uppercase mb-1">Original Draft SHA-256 Hash</div>
                                <div class="hash-box text-muted">${n.originalHash||"N/A"}</div>
                            </div>
                        </div>

                        <h6 class="fw-bold text-primary mb-2">Verified Signatories</h6>
                        <div class="table-responsive mb-4">
                            <table class="table table-sm table-hover align-middle">
                                <thead class="table-light small text-muted text-uppercase">
                                    <tr><th>Signer</th><th>OTP</th><th>Mode</th><th>Timestamp (IST)</th><th>IP</th></tr>
                                </thead>
                                <tbody>
                                    ${n.signers&&n.signers.length>0?n.signers.map(d=>`
                                        <tr>
                                            <td><div class="fw-bold">${d.name}</div><div class="small text-muted">${d.email}</div></td>
                                            <td>${d.otpVerified?'<span class="badge bg-success-subtle text-success">Passed</span>':'<span class="badge bg-light text-muted">Pending</span>'}</td>
                                            <td><span class="badge bg-light text-dark">${d.signatureType}</span></td>
                                            <td class="small">${d.signedAt?new Date(d.signedAt).toLocaleString("en-IN"):"-"}</td>
                                            <td class="font-monospace small text-muted">${d.ipAddress}</td>
                                        </tr>
                                    `).join(""):'<tr><td colspan="5" class="text-center py-2 text-muted">No signatures executed yet.</td></tr>'}
                                </tbody>
                            </table>
                        </div>

                        <h6 class="fw-bold text-primary mb-2">Chained Audit Ledger</h6>
                        <div class="table-responsive">
                            <table class="table table-sm table-hover align-middle font-monospace" style="font-size: 0.78rem;">
                                <thead class="table-light text-muted text-uppercase">
                                    <tr><th>Time</th><th>Action</th><th>Details</th><th>Block Hash</th></tr>
                                </thead>
                                <tbody>
                                    ${n.auditEvents&&n.auditEvents.length>0?n.auditEvents.map(d=>`
                                        <tr>
                                            <td class="text-nowrap text-muted">${new Date(d.timestamp).toLocaleTimeString("en-IN")}</td>
                                            <td><span class="badge bg-light text-dark">${d.action}</span></td>
                                            <td style="font-family: sans-serif;">${d.details}</td>
                                            <td class="text-success fw-bold">${d.currentHash?d.currentHash.substring(0,10)+"...":"-"}</td>
                                        </tr>
                                    `).join(""):'<tr><td colspan="4" class="text-center py-2 text-muted">No audit events recorded.</td></tr>'}
                                </tbody>
                            </table>
                        </div>
                    </div>
                `:""}
            `}catch(n){a.innerHTML=`<div class="alert alert-danger">${n.message}</div>`}}t&&i(t),document.getElementById("verifyForm").onsubmit=l=>{l.preventDefault();const n=document.getElementById("verifyHashInput").value.trim();n&&i(n)}}async function O(e){var t,a,i;if(((t=b.user)==null?void 0:t.role)!=="ADMIN"){e.innerHTML=`
            <div class="container py-5 text-center" style="max-width: 540px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white text-center">
                    <i class="fa-solid fa-lock text-danger fs-1 mb-3"></i>
                    <h4 class="fw-bold mb-2">Administrator Access Required</h4>
                    <p class="text-muted small mb-4">
                        You are currently signed in as <strong>${((a=b.user)==null?void 0:a.fullName)||"User"}</strong> (Role: ${((i=b.user)==null?void 0:i.role)||"SIGNER"}).
                        Only accounts with the <strong>ADMIN</strong> role can access user administration and system audit ledgers.
                    </p>
                    <div class="d-flex justify-content-center gap-2">
                        <button id="switchAdminBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-shield me-1"></i> Log in as Admin (admin@esign.com)</button>
                        <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        `,document.getElementById("switchAdminBtn").onclick=async()=>{try{const l=await c.login("admin@esign.com","admin123");c.setToken(l.token),c.setUser(l),b.user=l,u("Switched to Administrator session!"),O(e)}catch(l){u(l.message,"danger")}};return}e.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const l=await c.getAdminUsers();e.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h4 class="fw-bold mb-1"><i class="fa-solid fa-users-gear text-danger me-2"></i> User Administration</h4>
                        <p class="text-muted small mb-0">Manage users, organizations, access privileges, and activation states.</p>
                    </div>
                </div>

                <div class="card border-0 bg-white shadow-sm">
                    <div class="table-responsive">
                        <table class="table table-hover align-middle mb-0">
                            <thead class="table-light small text-muted text-uppercase">
                                <tr>
                                    <th class="ps-3">User</th>
                                    <th>Organization</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                    <th class="text-end pe-3">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${l.map(n=>`
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold">${n.fullName}</div>
                                            <div class="small text-muted">${n.email}</div>
                                        </td>
                                        <td class="small">${n.organization}</td>
                                        <td><span class="badge ${n.role==="ADMIN"?"bg-danger-subtle text-danger":"bg-primary-subtle text-primary"}">${n.role}</span></td>
                                        <td><span class="badge ${n.enabled?"bg-success-subtle text-success":"bg-secondary-subtle text-secondary"}">${n.enabled?"Active":"Disabled"}</span></td>
                                        <td class="small text-muted">${new Date(n.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td class="text-end pe-3">
                                            <button class="btn btn-sm btn-outline-secondary toggle-btn" data-id="${n.id}">${n.enabled?"Disable":"Enable"}</button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,document.querySelectorAll(".toggle-btn").forEach(n=>{n.onclick=async()=>{await c.toggleUserStatus(n.dataset.id),u("User status updated"),O(e)}})}catch(l){u(l.message,"danger")}}H();
