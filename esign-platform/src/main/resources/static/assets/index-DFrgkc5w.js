(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))d(l);new MutationObserver(l=>{for(const n of l)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&d(a)}).observe(document,{childList:!0,subtree:!0});function i(l){const n={};return l.integrity&&(n.integrity=l.integrity),l.referrerPolicy&&(n.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?n.credentials="include":l.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function d(l){if(l.ep)return;l.ep=!0;const n=i(l);fetch(l.href,n)}})();const V=typeof window<"u"&&window.location.hostname?window.location.hostname:"localhost",q=`http://${V}:8080/api/v1`,O=q,p={getToken(){return localStorage.getItem("esign_token")},setToken(t){localStorage.setItem("esign_token",t)},clearToken(){localStorage.removeItem("esign_token"),localStorage.removeItem("esign_user")},getUser(){const t=localStorage.getItem("esign_user");return t?JSON.parse(t):null},setUser(t){localStorage.setItem("esign_user",JSON.stringify(t))},async request(t,s={}){var g;const i=`${O}${t}`,d=s.headers||{},l=this.getToken();l&&!t.startsWith("/auth/")&&(d.Authorization=`Bearer ${l}`),!(s.body instanceof FormData)&&!d["Content-Type"]&&(d["Content-Type"]="application/json");const n={...s,headers:d},a=await fetch(i,n);if(a.status===401&&!t.startsWith("/auth/"))throw this.clearToken(),window.location.hash="#/login",new Error("Session expired. Please log in again.");if((g=a.headers.get("content-type"))!=null&&g.includes("application/pdf"))return a.blob();const c=await a.json().catch(()=>({}));if(!a.ok){const m=c.message||c.error||`Request failed with status ${a.status}`;throw new Error(m)}return c},login(t,s){return this.request("/auth/login",{method:"POST",body:JSON.stringify({email:t,password:s})})},register(t){return this.request("/auth/register",{method:"POST",body:JSON.stringify(t)})},sendRegistrationOtp(t){return this.request("/auth/send-registration-otp",{method:"POST",body:JSON.stringify({email:t})})},verifyRegistrationOtp(t,s){return this.request("/auth/verify-registration-otp",{method:"POST",body:JSON.stringify({email:t,otpCode:s})})},getMe(){return this.request("/auth/me")},getDashboardStats(){return this.request("/dashboard/stats")},getDocuments(t="ALL"){const s=t&&t!=="ALL"?`?status=${t}`:"";return this.request(`/documents${s}`)},getDocument(t){return this.request(`/documents/${t}`)},uploadDocument(t){return this.request("/documents",{method:"POST",body:t})},cancelDocument(t){return this.request(`/documents/${t}/cancel`,{method:"POST"})},downloadDocumentUrl(t,s=!0){const i=this.getToken(),d=i?`&token=${encodeURIComponent(i)}`:"";return`${O}/documents/${t}/download?sealed=${s}${d}`},async downloadDocument(t,s=!0,i="document.pdf"){const d=this.getToken(),l=`${O}/documents/${t}/download?sealed=${s}`,n={};d&&(n.Authorization=`Bearer ${d}`);const a=await fetch(l,{headers:n});if(!a.ok){const b=await a.json().catch(()=>({}));throw new Error(b.message||b.error||`Download failed: HTTP ${a.status}`)}let c=i;const g=a.headers.get("Content-Disposition");if(g){const S=/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(g);S!=null&&S[1]&&(c=S[1].replace(/['"]/g,"").trim())}const m=await a.blob(),u=window.URL.createObjectURL(m),h=document.createElement("a");h.href=u,h.download=c,document.body.appendChild(h),h.click(),h.remove(),setTimeout(()=>window.URL.revokeObjectURL(u),1e4)},createSigningRequest(t){return this.request("/signing/requests",{method:"POST",body:JSON.stringify(t)})},resendSigningInvite(t){return this.request(`/signing/invites/${t}/resend`,{method:"POST"})},getSigningContext(t){return this.request(`/signing/context/${t}`)},requestOtp(t){return this.request(`/signing/otp/${t}`,{method:"POST"})},verifyOtp(t,s){return this.request(`/signing/verify-otp/${t}`,{method:"POST",body:JSON.stringify({otpCode:s})})},requestAadhaarOtp(t,s){return this.request(`/signing/aadhaar-otp/${t}`,{method:"POST",body:JSON.stringify({aadhaarNumber:s})})},verifyAadhaarOtp(t,s,i){return this.request(`/signing/verify-aadhaar-otp/${t}`,{method:"POST",body:JSON.stringify({aadhaarNumber:s,otpCode:i})})},submitSignature(t,s){return this.request(`/signing/submit/${t}`,{method:"POST",body:JSON.stringify(s)})},declineSignature(t,s){return this.request(`/signing/decline/${t}`,{method:"POST",body:JSON.stringify({reason:s})})},getSigningPreviewUrl(t){return`${O}/signing/preview/${t}`},verifyHash(t){return this.request(`/verify/${encodeURIComponent(t)}`)},verifyFile(t){const s=new FormData;return s.append("file",t),this.request("/verify/upload",{method:"POST",body:s})},getAdminUsers(){return this.request("/admin/users")},toggleUserStatus(t){return this.request(`/admin/users/${t}/toggle-status`,{method:"POST"})},getAdminAuditLogs(t=0,s=30){return this.request(`/admin/audit-logs?page=${t}&size=${s}`)},getAdminDocuments(t=0,s=20){return this.request(`/admin/documents?page=${t}&size=${s}`)}},I={en:{brand:"SignEase",home:"Home",dashboard:"Dashboard",documents:"Documents",upload:"Upload & Sign",send:"Send for Signature",verify:"Verify Document",admin:"Admin",signIn:"Sign In",createAccount:"Create Account",signOut:"Sign Out",language:"Language / भाषा",newEnvelope:"+ New Envelope",newAgreement:"+ New Agreement",exportCsv:"Export CSV",darkModeToggle:"Dark / Light Mode",heroBadge:"✨ Simple & Secure Digital Signatures",heroTitle:"Sign & Send Documents in Minutes",heroSubtitle:"The easiest and fastest way to sign contracts and forms online. Safe, legally valid, and works directly on your phone or computer.",btnStartFree:"Start Free",btnSenderDashboard:"My Dashboard",btnVerifyDoc:"Verify a Document",howItWorks:"3 Easy Steps to Sign Any Document",step1Title:"1. Upload PDF",step1Desc:"Choose any agreement, form, or contract from your device.",step2Title:"2. Add Signers",step2Desc:"Enter the names and email addresses of people who need to sign.",step3Title:"3. Sign & Download",step3Desc:"Sign with your finger or type your name, and download the finished PDF.",whyChooseUs:"Why People Love SignEase",feature1Title:"Zero Complicated Setup",feature1Desc:"No app or software to install. Signers open the link on mobile or computer and sign in seconds.",feature2Title:"100% Legally Valid",feature2Desc:"Official completion certificates with legal proof recognized under the IT Act.",feature3Title:"Instant Email Delivery",feature3Desc:"Verification OTPs and invitation links arrive instantly in your inbox.",greeting:"Good morning,",compliancetag:"AADHAAR ESIGN READY",attentionSub:"documents waiting for your signature",vaultSynced:"System Online",totalDocs:"TOTAL DOCUMENTS",pendingDocs:"WAITING FOR YOUR SIGNATURE",completedDocs:"COMPLETED & ARCHIVED",actionNeeded:"Action needed",thisWeekGrowth:"+2 this week",rateDone:"64% completed",searchPlaceholder:"Search by title, signer name, or ID...",filterAll:"All",filterRequiresMe:"Needs My Signature",filterCompleted:"Completed",uploadAndSign:"➕ Upload & Sign",colDocName:"DOCUMENT NAME",colSignersStatus:"SIGNERS & STATUS",colLastUpdated:"LAST UPDATED",colAction:"ACTION",signNow:"Sign Now",remind:"Remind",download:"Download",showingAgreements:"Showing agreements",viewVaultLink:"View all documents →",legalValidityGuaranteed:"100% Legally Valid",legalValidityDesc:"Signatures made on SignEase comply with Section 5 of the Information Technology Act (2000).",auditTrailGuide:"Audit Certificate Guide ↗",docRegistryTitle:"Documents",docRegistrySub:"Manage and track your signed agreements and forms.",activeEnvelopes:"ACTIVE DOCUMENTS",needsAction:"WAITING FOR YOU",awaitingSigners:"WAITING FOR OTHERS",verificationAudit:"VERIFIED",urgentReview:"Action needed",externalParties:"Waiting on signers",itActCompliant:"Legally Valid",filterWaitingOthers:"Waiting on Others",reviewAndSign:"Review & Sign",downloadPdf:"Download PDF",continueEdit:"Continue Edit",hsmActive:"Protected with Bank-Grade Security",hsmDesc:"Each signed document has tamper-evident security with an official certificate of completion.",viewCryptoCert:"View Certificate →",workflowDispatch:"SEND FOR SIGNATURE",sendDocForSignature:"Send Document for Signature",sendDocDesc:"Upload your PDF, add who needs to sign, and send it for signing in seconds.",step1Upload:"1 Upload File",pdfFormatUpTo:"PDF UP TO 25 MB",dropPdfHere:"Drop your PDF here, or",browseFiles:"Browse files",encryptedTransit:"Safe & Private • Max size 25MB",readyToTag:"Ready",step2Signers:"2 Add Signers",orderType:"SIGNING ORDER",signersNotice:"Signers will receive a secure email link to sign. No account or password required for signers.",signerName:"NAME",emailAddress:"EMAIL ADDRESS",role:"ACTION",needsToSign:"Needs to sign",receivesCopy:"Receives a copy",addAnotherRecipient:"➕ Add another recipient",tamperProofAudit:"Automatic Audit Trail",tamperProofDesc:"Records date, time, and signatures for full legal proof.",sendReminder48h:"Send email reminder after 48h",cancel:"Cancel",saveAsDraft:"Save as Draft",sendForSignature:"Send for Signature ▶",trustLedger:"VERIFY DOCUMENT",verifyAuthenticity:"Check Document Authenticity",verifyDocSubtitle:"Check if a signed document is genuine, legally valid, and unchanged.",auditorNodeOnline:"System Status: Online",tabEnterHash:"Enter Document Code / ID",tabUploadFile:"Upload Signed File",checksumLabel:"Document Code, Hash, or ID",pasteBtn:"Paste",verifyDocumentBtn:"Verify Document",verifyHelperNotice:"We verify document authenticity securely without exposing its private contents.",verifiedAuthenticTitle:"Document Verified & Authentic",legallyBinding:"Legally Binding",verifiedSub:"The signatures and document match the original official record.",downloadAuditCertificate:"Download Audit Certificate (PDF)",metaDocTitle:"DOCUMENT NAME",metaSignaturesVerified:"SIGNATURES",metaTimestampAuth:"DATE & TIME",originalMatch:"Original Match",sealedEndToEnd:"Legally Protected & Sealed",itActTitle:"Information Technology Act (IT Act 2000)",itActDesc:"Signatures on SignEase are 100% legally enforceable in Indian courts under the IT Act.",zkpTitle:"100% Private & Confidential",zkpDesc:"Your document content remains private and is never shared or made public.",regTitle:"Create Your Account",regSub:"Verify your email with a 6-digit OTP to get started",firstName:"First Name",lastName:"Last Name",orgName:"Company or Business Name",emailInput:"Work Email Address",btnGetOtp:"Get OTP",otpLabel:"Enter 6-Digit Email OTP",btnVerifyOtp:"Verify Code",otpDispatchedMsg:"6-digit verification code sent to your email inbox.",password:"Password",btnCreateAccount:"Create Free Account",alreadyRegistered:"Already have an account?",signInHere:"Sign in here",loginTitle:"Welcome Back",loginSub:"Sign in to access your documents and signed contracts",dontHaveAccount:"Don't have an account?",signUpHere:"Create free account",signerWelcome:"Review & Sign Document",requestedBy:"Requested by",tabDraw:"✍️ Draw Signature",tabType:"⌨️ Type Name",btnClear:"Clear",btnCompleteSigning:"✅ Complete & Sign Document",otpNotice:"A 6-digit OTP code will be sent to your email to verify your identity.",footerNote:"SignEase — Simple, fast and legally valid electronic document signing."},hi:{brand:"SignEase",home:"होम",dashboard:"डैशबोर्ड",documents:"दस्तावेज़",upload:"अपलोड और हस्ताक्षर",send:"हस्ताक्षर के लिए भेजें",verify:"दस्तावेज़ जाँचें",admin:"एडमिन",signIn:"साइन इन",createAccount:"खाता बनाएं",signOut:"लॉग आउट",language:"भाषा / Language",newEnvelope:"+ नया दस्तावेज़",newAgreement:"+ नया अनुबंध",exportCsv:"CSV डाउनलोड करें",darkModeToggle:"डार्क / लाइट मोड",heroBadge:"✨ सरल और सुरक्षित डिजिटल हस्ताक्षर",heroTitle:"दस्तावेज़ मिनटों में साइन करें और भेजें",heroSubtitle:"दस्तावेज़ और अनुबंध साइन करने का सबसे आसान और सुरक्षित तरीका। मोबाइल या कंप्यूटर पर तुरंत काम करता है।",btnStartFree:"मुफ़्त शुरू करें",btnSenderDashboard:"मेरा डैशबोर्ड",btnVerifyDoc:"दस्तावेज़ जाँचें",howItWorks:"दस्तावेज़ साइन करने के 3 आसान तरीके",step1Title:"1. PDF चुनें",step1Desc:"अपने फोन या कंप्यूटर से कोई भी दस्तावेज़ या फॉर्म चुनें।",step2Title:"2. नाम व ईमेल जोड़ें",step2Desc:"जिन लोगों को साइन करना है, उनका नाम और ईमेल दर्ज करें।",step3Title:"3. साइन करें व डाउनलोड करें",step3Desc:"उंगली से बनाकर या नाम लिखकर साइन करें और तैयार PDF डाउनलोड करें।",whyChooseUs:"SignEase क्यों चुनें",feature1Title:"कोई जटिल सेटअप नहीं",feature1Desc:"कोई ऐप इंस्टॉल करने की ज़रूरत नहीं। ईमेल लिंक खोलें और मोबाइल पर तुरंत साइन करें।",feature2Title:"100% कानूनी रूप से मान्य",feature2Desc:"भारतीय आईटी कानून के तहत मान्य डिजिटल प्रमाणपत्र और सुरक्षित रिकॉर्ड।",feature3Title:"तुरंत ईमेल डिलीवरी",feature3Desc:"सत्यापन OTP और हस्ताक्षर लिंक तुरंत आपके ईमेल पर पहुंचता है।",greeting:"नमस्ते,",compliancetag:"आधार ई-साइन और आईटी कानून मान्य",attentionSub:"दस्तावेज़ों पर आपके हस्ताक्षर बाकी हैं",vaultSynced:"सिस्टम चालू है",totalDocs:"कुल दस्तावेज़",pendingDocs:"आपके हस्ताक्षर बाकी",completedDocs:"पूर्ण दस्तावेज़",actionNeeded:"हस्ताक्षर करें",thisWeekGrowth:"+2 इस सप्ताह",rateDone:"64% पूर्ण",searchPlaceholder:"शीर्षक, नाम या आईडी से खोजें...",filterAll:"सभी",filterRequiresMe:"मेरे हस्ताक्षर चाहिए",filterCompleted:"पूर्ण",uploadAndSign:"➕ अपलोड और हस्ताक्षर",colDocName:"दस्तावेज़ का नाम",colSignersStatus:"हस्ताक्षरकर्ता स्थिति",colLastUpdated:"अंतिम अपडेट",colAction:"कार्य",signNow:"साइन करें",remind:"याद दिलाएं",download:"डाउनलोड",showingAgreements:"दस्तावेज़ दिखाए जा रहे हैं",viewVaultLink:"सभी दस्तावेज़ देखें →",legalValidityGuaranteed:"100% कानूनी रूप से मान्य",legalValidityDesc:"SignEase पर किए गए हस्ताक्षर सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) के तहत अदालत में पूरी तरह मान्य हैं।",auditTrailGuide:"प्रमाणपत्र गाइड ↗",docRegistryTitle:"मेरे दस्तावेज़",docRegistrySub:"अपने सभी हस्ताक्षरित और लंबित दस्तावेज़ यहाँ देखें।",activeEnvelopes:"सक्रिय दस्तावेज़",needsAction:"आपके हस्ताक्षर बाकी",awaitingSigners:"दूसरों के हस्ताक्षर बाकी",verificationAudit:"सत्यापित",urgentReview:"कार्रवाई आवश्यक",externalParties:"हस्ताक्षर बाकी",itActCompliant:"कानूनी मान्य",filterWaitingOthers:"दूसरों के लिए बाकी",reviewAndSign:"देखें और साइन करें",downloadPdf:"PDF डाउनलोड",continueEdit:"एडिट करें",hsmActive:"पूरी तरह सुरक्षित और एन्क्रिप्टेड",hsmDesc:"हर हस्ताक्षरित दस्तावेज़ के साथ अदालत में मान्य डिजिटल प्रमाणपत्र मिलता है।",viewCryptoCert:"प्रमाणपत्र देखें →",workflowDispatch:"हस्ताक्षर के लिए भेजें",sendDocForSignature:"दस्तावेज़ हस्ताक्षर के लिए भेजें",sendDocDesc:"अपनी PDF चुनें, हस्ताक्षर करने वाले का नाम व ईमेल जोड़ें और तुरंत भेजें।",step1Upload:"1 फ़ाइल अपलोड करें",pdfFormatUpTo:"PDF (अधिकतम 25 MB)",dropPdfHere:"अपनी PDF फ़ाइल यहाँ छोड़ें, या",browseFiles:"फ़ाइल चुनें",encryptedTransit:"सुरक्षित और निजी • अधिकतम 25 MB",readyToTag:"तैयार",step2Signers:"2 हस्ताक्षर करने वाले जोड़ें",orderType:"हस्ताक्षर का क्रम",signersNotice:"हस्ताक्षर करने वालों को ईमेल पर सीधा लिंक मिलेगा। उन्हें अकाउंट बनाने की ज़रूरत नहीं है।",signerName:"नाम",emailAddress:"ईमेल पता",role:"भूमिका",needsToSign:"हस्ताक्षर करना है",receivesCopy:"केवल कॉपी मिलेगी",addAnotherRecipient:"➕ एक और व्यक्ति जोड़ें",tamperProofAudit:"सुरक्षित कानूनी रिकॉर्ड",tamperProofDesc:"तारीख, समय और हस्ताक्षर का कानूनी रिकॉर्ड अपने आप बनता है।",sendReminder48h:"2 दिन में हस्ताक्षर न होने पर याद दिलाएं",cancel:"रद्द करें",saveAsDraft:"ड्राफ्ट सहेजें",sendForSignature:"हस्ताक्षर के लिए भेजें ▶",trustLedger:"दस्तावेज़ की जाँच",verifyAuthenticity:"दस्तावेज़ असली है या नहीं जाँचें",verifyDocSubtitle:"आसानी से जाँचें कि दस्तावेज़ असली है और कोई छेड़छाड़ तो नहीं हुई।",auditorNodeOnline:"सिस्टम चालू है",tabEnterHash:"दस्तावेज़ कोड (ID) दर्ज करें",tabUploadFile:"हस्ताक्षरित फ़ाइल अपलोड करें",checksumLabel:"दस्तावेज़ कोड या ID दर्ज करें",pasteBtn:"पेस्ट करें",verifyDocumentBtn:"दस्तावेज़ जाँचें",verifyHelperNotice:"हम आपकी फ़ाइल को पूरी तरह निजी और सुरक्षित रखते हैं।",verifiedAuthenticTitle:"दस्तावेज़ असली और सुरक्षित है",legallyBinding:"कानूनी मान्य",verifiedSub:"हस्ताक्षर और दस्तावेज़ आधिकारिक रिकॉर्ड से पूरी तरह मेल खाते हैं।",downloadAuditCertificate:"प्रमाणपत्र डाउनलोड करें (PDF)",metaDocTitle:"दस्तावेज़ का नाम",metaSignaturesVerified:"हस्ताक्षर",metaTimestampAuth:"दिनांक और समय",originalMatch:"मूल प्रति",sealedEndToEnd:"सुरक्षित रूप से सील",itActTitle:"IT Act 2000 के तहत कानूनी मान्यता",itActDesc:"भारतीय कानून के तहत यह हस्ताक्षर पूरी तरह कानूनी और वैध है।",zkpTitle:"100% गोपनीय और सुरक्षित",zkpDesc:"आपकी फ़ाइल का डेटा पूरी तरह निजी रहता है और किसी से साझा नहीं किया जाता।",regTitle:"नया अकाउंट बनाएं",regSub:"अपना ईमेल दर्ज करें और 6-अंकों का OTP प्राप्त करें",firstName:"पहला नाम",lastName:"अंतिम नाम",orgName:"कंपनी या व्यवसाय का नाम",emailInput:"ईमेल पता",btnGetOtp:"OTP पाएं",otpLabel:"6-अंकों का ईमेल OTP दर्ज करें",btnVerifyOtp:"OTP सत्यापित करें",otpDispatchedMsg:"आपके ईमेल पर 6 अंकों का OTP भेजा गया है।",password:"पासवर्ड",btnCreateAccount:"मुफ़्त अकाउंट बनाएं",alreadyRegistered:"पहले से अकाउंट है?",signInHere:"यहाँ लॉगिन करें",loginTitle:"लॉगिन करें",loginSub:"अपने दस्तावेज़ देखने के लिए लॉगिन करें",dontHaveAccount:"नया अकाउंट बनाना है?",signUpHere:"यहाँ रजिस्टर करें",signerWelcome:"दस्तावेज़ देखें और हस्ताक्षर करें",requestedBy:"अनुरोधकर्ता",tabDraw:"✍️ हस्ताक्षर बनाएं",tabType:"⌨️ नाम टाइप करें",btnClear:"साफ़ करें",btnCompleteSigning:"✅ हस्ताक्षर पूर्ण करें",otpNotice:"आपकी पहचान के लिए आपके ईमेल पर 6-अंकों का OTP भेजा जाएगा।",footerNote:"SignEase — सरल, तेज़ और कानूनी रूप से मान्य इलेक्ट्रॉनिक हस्ताक्षर।"}};function D(){return localStorage.getItem("signease_lang")||"en"}function j(t){localStorage.setItem("signease_lang",t)}function e(t){const s=D();return I[s]&&I[s][t]?I[s][t]:I.en&&I.en[t]?I.en[t]:t}const v={user:p.getUser(),route:window.location.hash||"#/"};window.changeAppLanguage=function(t){j(t),typeof setGoogleLang=="function"&&setGoogleLang(t),M()};window.addEventListener("hashchange",()=>{v.route=window.location.hash||"#/",M()});function f(t,s="success"){const i=document.getElementById("toast-alert");i&&i.remove();const d=document.createElement("div");d.id="toast-alert",d.className=`alert alert-${s} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`,d.style.zIndex="9999",d.style.minWidth="320px",d.innerHTML=`
        <div class="d-flex align-items-center">
            <i class="fa-solid fa-${s==="success"?"circle-check":s==="info"?"circle-info":"triangle-exclamation"} me-2 fs-5"></i>
            <div>${t}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `,document.body.appendChild(d),setTimeout(()=>d.remove(),4e3)}window.downloadDoc=async function(t,s=!0,i="document.pdf"){try{f("Preparing download...","info"),await p.downloadDocument(t,s,i),f("Document downloaded successfully!","success")}catch(d){f("Download failed: "+d.message,"danger")}};window.copySignerLink=function(t,s){s&&s.preventDefault();const i=`${window.location.origin}/#/sign/${t}`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(i).then(()=>{f("Direct signing link copied to clipboard!")}).catch(()=>{prompt("Copy direct signing link:",i)}):prompt("Copy direct signing link:",i)};window.resendInvite=async function(t,s){if(s){s.preventDefault();const i=s.currentTarget,d=i.innerHTML;i.disabled=!0,i.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const l=await p.resendSigningInvite(t);f(l.message||"Signing invite has been resent successfully to Gmail!"),i.innerHTML='<i class="fa-solid fa-check text-success me-1"></i> Dispatched!',setTimeout(()=>{i.disabled=!1,i.innerHTML=d},4e3)}catch(l){i.disabled=!1,i.innerHTML=d,f(l.message,"danger")}}};function C(){return localStorage.getItem("signease_theme")||"light"}function U(t){localStorage.setItem("signease_theme",t),document.documentElement.setAttribute("data-bs-theme",t),t==="dark"?document.body.classList.add("dark-theme"):document.body.classList.remove("dark-theme");const s=document.getElementById("themeToggleBtn");s&&(s.innerHTML=t==="dark"?'<i class="fa-solid fa-sun text-warning fs-6"></i>':'<i class="fa-solid fa-moon text-secondary fs-6"></i>',s.setAttribute("title",t==="dark"?"Switch to Light Mode":"Switch to Dark Mode"))}window.toggleAppTheme=function(){const t=C()==="dark"?"light":"dark";U(t)};U(C());async function M(){var S,A,x,$,E;const t=document.getElementById("app"),s=v.route.replace(/^#\/?/,"").split("?")[0],i=new URLSearchParams(v.route.split("?")[1]||"");if(s.startsWith("sign/")){const w=s.replace("sign/","");X(t,w);return}const d=C(),l=(S=v.user)!=null&&S.fullName?v.user.fullName.split(" ").map(w=>w[0]).join("").substring(0,2).toUpperCase():"RS",n=((A=v.user)==null?void 0:A.fullName)||"Rajesh Sharma",a=((x=v.user)==null?void 0:x.organization)||"Admin Vault",c=`
        <div class="dropdown">
            <button class="btn btn-pill btn-pill-outline btn-sm shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="langSelectorBtn">
                <i class="fa-solid fa-globe text-primary me-1"></i>
                <span>${D()==="hi"?"🇮🇳 हिन्दी":"🌐 EN / हिन्दी"}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 215px; z-index: 1050;">
                <li><h6 class="dropdown-header fw-bold text-uppercase text-primary small">Select Language / भाषा चुनें</h6></li>
                <li><a class="dropdown-item notranslate py-2 ${D()==="en"?"fw-bold active bg-primary text-white":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('en')">🇬🇧 English</a></li>
                <li><a class="dropdown-item notranslate py-2 ${D()==="hi"?"fw-bold active bg-primary text-white":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('hi')">🇮🇳 हिन्दी (Hindi)</a></li>
                <li><a class="dropdown-item notranslate py-2 ${D()==="mr"?"fw-bold active bg-primary text-white":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('mr')">🇮🇳 मराठी (Marathi)</a></li>
                <li><a class="dropdown-item notranslate py-2 ${D()==="gu"?"fw-bold active bg-primary text-white":""}" href="javascript:void(0)" onclick="window.changeAppLanguage('gu')">🇮🇳 ગુજરાતી (Gujarati)</a></li>
                <li><hr class="dropdown-divider"></li>
                <li class="dropdown-header small text-muted">More Languages / अन्य 100+ भाषाएं:</li>
                <li class="px-3 py-1"><div id="google_translate_element"></div></li>
            </ul>
        </div>
    `;let g=`
        <nav class="navbar-custom">
            <div class="container-fluid px-lg-4 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <!-- 3 Lines Hamburger Menu Button (Always visible on left side) -->
                    <button class="nav-menu-trigger me-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" title="Menu / मेनू">
                        <i class="fa-solid fa-bars"></i>
                    </button>

                    <a class="brand-logo" href="#/">
                        <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <span>Sign<span class="text-primary">Ease</span></span>
                    </a>

                    <!-- Desktop Nav Links -->
                    <div class="d-none d-xl-flex align-items-center gap-1 ms-3">
                        <a class="nav-link ${s==="dashboard"?"active":""}" href="#/dashboard"><i class="fa-solid fa-chart-pie me-1"></i> ${e("dashboard")}</a>
                        <a class="nav-link ${s==="documents"?"active":""}" href="#/documents"><i class="fa-regular fa-folder me-1"></i> ${e("documents")}</a>
                        <a class="nav-link ${s==="send"||s==="upload"?"active":""}" href="#/upload"><i class="fa-solid fa-paper-plane me-1"></i> ${e("send")}</a>
                        <a class="nav-link ${s==="verify"?"active":""}" href="#/verify"><i class="fa-solid fa-shield-halved me-1 text-success"></i> ${e("verify")}</a>
                        ${(($=v.user)==null?void 0:$.role)==="ADMIN"?`<a class="nav-link text-danger ${s==="admin"?"active":""}" href="#/admin"><i class="fa-solid fa-shield me-1"></i> ${e("admin")}</a>`:""}
                    </div>
                </div>

                <!-- Right Actions: Language + Dark Mode + + New Envelope + Profile -->
                <div class="d-flex align-items-center gap-2">
                    ${c}

                    <!-- Dark Mode Toggle Button -->
                    <button class="btn btn-pill btn-pill-outline btn-sm px-2 px-sm-3" id="themeToggleBtn" onclick="window.toggleAppTheme()" title="${e("darkModeToggle")}">
                        <i class="fa-solid fa-${d==="dark"?"sun text-warning":"moon text-secondary"} fs-6"></i>
                    </button>

                    <!-- + New Envelope Primary CTA -->
                    <a href="#/upload" class="btn btn-pill btn-pill-primary shadow-sm">
                        <i class="fa-solid fa-plus me-1"></i> <span class="d-none d-sm-inline">${e("newEnvelope")}</span>
                    </a>

                    ${v.user?`
                        <!-- User Profile Pill -->
                        <div class="dropdown">
                            <a class="nav-user-pill dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="user-avatar-circle">${l}</div>
                                <div class="d-none d-md-block text-start">
                                    <div class="fw-bold" style="font-size: 0.82rem; line-height: 1.1;">${n}</div>
                                    <div class="text-muted" style="font-size: 0.7rem;">${a}</div>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px;">
                                <li><a class="dropdown-item py-2" href="#/dashboard"><i class="fa-solid fa-chart-line me-2 text-muted"></i> ${e("dashboard")}</a></li>
                                <li><a class="dropdown-item py-2" href="#/documents"><i class="fa-regular fa-folder me-2 text-muted"></i> ${e("documents")}</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li>
                                    <button class="dropdown-item py-2 text-danger" id="logoutBtn">
                                        <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> ${e("signOut")}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    `:`
                        <a class="btn btn-pill btn-pill-outline btn-sm px-3" href="#/login">${e("signIn")}</a>
                    `}
                </div>
            </div>
        </nav>

        <!-- Left Sidebar Navigation Drawer (Opens from 3 lines icon on left) -->
        <div class="offcanvas offcanvas-start" tabindex="-1" id="sidebarMenu" aria-labelledby="sidebarMenuLabel" style="width: 290px;">
            <div class="offcanvas-header border-bottom py-3">
                <div class="d-flex align-items-center gap-2">
                    <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                    <h5 class="offcanvas-title fw-bold mb-0" id="sidebarMenuLabel">Sign<span class="text-primary">Ease</span></h5>
                </div>
                <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body d-flex flex-column justify-content-between p-3">
                <div class="d-flex flex-column gap-1">
                    <!-- User Profile / Sign In Pill -->
                    ${v.user?`
                        <div class="p-2 mb-3 rounded-3 d-flex align-items-center gap-3" style="background: var(--bg-subtle); border: 1px solid var(--border-color);">
                            <div class="user-avatar-circle">${l}</div>
                            <div class="overflow-hidden">
                                <div class="fw-bold text-truncate" style="font-size: 0.9rem;">${n}</div>
                                <div class="text-muted text-truncate" style="font-size: 0.75rem;">${a}</div>
                            </div>
                        </div>
                    `:`
                        <div class="mb-3">
                            <a href="#/login" class="btn btn-pill-primary w-100 py-2 fw-semibold justify-content-center" data-bs-dismiss="offcanvas">
                                <i class="fa-solid fa-right-to-bracket me-2"></i> ${e("signIn")}
                            </a>
                        </div>
                    `}

                    <div class="text-uppercase small fw-bold text-muted px-2 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">Navigation / मेनू</div>
                    <a class="sidebar-nav-link ${s==="dashboard"?"active":""}" href="#/dashboard" data-bs-dismiss="offcanvas">
                        <i class="fa-solid fa-chart-pie me-2 text-primary"></i> ${e("dashboard")}
                    </a>
                    <a class="sidebar-nav-link ${s==="documents"?"active":""}" href="#/documents" data-bs-dismiss="offcanvas">
                        <i class="fa-regular fa-folder me-2 text-primary"></i> ${e("documents")}
                    </a>
                    <a class="sidebar-nav-link ${s==="send"||s==="upload"?"active":""}" href="#/upload" data-bs-dismiss="offcanvas">
                        <i class="fa-solid fa-paper-plane me-2 text-primary"></i> ${e("send")}
                    </a>
                    <a class="sidebar-nav-link ${s==="verify"?"active":""}" href="#/verify" data-bs-dismiss="offcanvas">
                        <i class="fa-solid fa-shield-halved me-2 text-success"></i> ${e("verify")}
                    </a>
                    ${((E=v.user)==null?void 0:E.role)==="ADMIN"?`
                        <a class="sidebar-nav-link text-danger ${s==="admin"?"active":""}" href="#/admin" data-bs-dismiss="offcanvas">
                            <i class="fa-solid fa-shield me-2"></i> ${e("admin")}
                        </a>
                    `:""}

                    <hr class="my-3" style="border-color: var(--border-color);">

                    <div class="text-uppercase small fw-bold text-muted px-2 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">Actions / त्वरित कार्य</div>
                    <a class="sidebar-nav-link" href="#/upload" data-bs-dismiss="offcanvas">
                        <i class="fa-solid fa-plus-circle me-2 text-primary"></i> ${e("newEnvelope")}
                    </a>
                    <a class="sidebar-nav-link" href="#/documents" data-bs-dismiss="offcanvas">
                        <i class="fa-solid fa-file-arrow-down me-2 text-info"></i> ${e("exportCsv")}
                    </a>
                </div>

                <!-- Bottom Drawer Actions: Theme Toggle & Logout -->
                <div class="pt-3 border-top" style="border-color: var(--border-color);">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <span class="small fw-semibold text-muted">Theme:</span>
                        <button class="btn btn-pill btn-pill-outline btn-sm px-3" onclick="window.toggleAppTheme()">
                            <i class="fa-solid fa-${d==="dark"?"sun text-warning":"moon text-secondary"} me-1"></i>
                            <span>${d==="dark"?"Light Mode":"Dark Mode"}</span>
                        </button>
                    </div>
                    ${v.user?`
                        <button class="btn btn-outline-danger w-100 py-2 fw-semibold btn-sm" id="sidebarLogoutBtn">
                            <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> ${e("signOut")}
                        </button>
                    `:""}
                </div>
            </div>
        </div>

        <main class="flex-grow-1" id="page-content"></main>
        <footer class="py-3 mt-auto border-top">
            <div class="container-fluid px-lg-4 d-flex flex-wrap justify-content-between align-items-center text-muted small">
                <div><strong>SignEase</strong> &copy; 2026. ${e("footerNote")}</div>
                <div class="d-flex align-items-center gap-3">
                    <span><i class="fa-solid fa-shield-check text-success me-1"></i> 100% Safe</span>
                    <a href="#/verify" class="text-decoration-none text-primary fw-medium"><i class="fa-solid fa-magnifying-glass me-1"></i> ${e("verify")}</a>
                </div>
            </div>
        </footer>
    `;t.innerHTML=g;const m=()=>{p.clearToken(),v.user=null,f("Signed out successfully."),window.location.hash="#/login"},u=document.getElementById("logoutBtn");u&&u.addEventListener("click",m);const h=document.getElementById("sidebarLogoutBtn");h&&h.addEventListener("click",m);const b=document.getElementById("page-content");if(!v.user&&!["","/","login","register","verify"].includes(s)){f("Please sign in first to access this page.","warning"),window.location.hash="#/login";return}if(s===""||s==="/")v.user?window.location.hash="#/dashboard":G(b);else if(s==="login")_(b);else if(s==="register")W(b);else if(s==="dashboard")Y(b);else if(s==="documents")J(b,i.get("status")||"ALL");else if(s.startsWith("documents/")){const w=s.replace("documents/","");K(b,w)}else s==="upload"?Z(b):s==="send"?z(b,i.get("documentId")):s==="verify"?Q(b,i.get("hash")):s==="admin"?P(b):b.innerHTML='<div class="container py-5 text-center"><h4>Page not found</h4><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>'}function G(t){t.innerHTML=`
        <section class="hero-section text-center py-5">
            <div class="container px-4 py-3">
                <div class="badge bg-primary-subtle text-primary fw-semibold px-3 py-2 rounded-pill mb-3">
                    ${e("heroBadge")}
                </div>
                <h1 class="display-5 fw-bold mb-3" style="letter-spacing: -0.5px;">
                    ${e("heroTitle")}
                </h1>
                <p class="lead mb-4 mx-auto text-muted" style="max-width: 680px; font-size: 1.15rem;">
                    ${e("heroSubtitle")}
                </p>
                <div class="d-flex flex-wrap justify-content-center gap-3 mb-5">
                    <a href="#/register" class="btn btn-primary btn-lg px-4 shadow-sm">
                        <i class="fa-solid fa-pen-nib me-2"></i> ${e("btnStartFree")}
                    </a>
                    <a href="#/login" class="btn btn-outline-secondary btn-lg px-4">
                        <i class="fa-solid fa-right-to-bracket me-2"></i> ${e("btnSenderDashboard")}
                    </a>
                    <a href="#/verify" class="btn btn-outline-success btn-lg px-4">
                        <i class="fa-solid fa-shield-halved me-2"></i> ${e("btnVerifyDoc")}
                    </a>
                </div>

                <!-- 3 Simple Ordinary Steps -->
                <div class="text-center mb-4">
                    <h5 class="fw-bold text-muted text-uppercase small">${e("howItWorks")}</h5>
                </div>
                <div class="row g-4 justify-content-center text-start" style="max-width: 900px; margin: 0 auto;">
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-file-arrow-up"></i></div>
                            <h6 class="fw-bold mb-2">${e("step1Title")}</h6>
                            <p class="text-muted small mb-0">${e("step1Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-user-plus"></i></div>
                            <h6 class="fw-bold mb-2">${e("step2Title")}</h6>
                            <p class="text-muted small mb-0">${e("step2Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="step-card">
                            <div class="step-number"><i class="fa-solid fa-file-circle-check"></i></div>
                            <h6 class="fw-bold mb-2">${e("step3Title")}</h6>
                            <p class="text-muted small mb-0">${e("step3Desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Clean, Ordinary Feature Highlights -->
        <section class="py-5 border-bottom" style="background: var(--bg-card);">
            <div class="container px-4" style="max-width: 900px;">
                <div class="text-center mb-4">
                    <h4 class="fw-bold">${e("whyChooseUs")}</h4>
                </div>
                <div class="row g-3">
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 h-100" style="background: var(--bg-subtle);">
                            <i class="fa-solid fa-mobile-screen text-primary fs-3 mb-2"></i>
                            <h6 class="fw-bold">${e("feature1Title")}</h6>
                            <p class="text-muted small mb-0">${e("feature1Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 h-100" style="background: var(--bg-subtle);">
                            <i class="fa-solid fa-stamp text-success fs-3 mb-2"></i>
                            <h6 class="fw-bold">${e("feature2Title")}</h6>
                            <p class="text-muted small mb-0">${e("feature2Desc")}</p>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="p-3 border rounded-3 h-100" style="background: var(--bg-subtle);">
                            <i class="fa-solid fa-envelope-circle-check text-warning fs-3 mb-2"></i>
                            <h6 class="fw-bold">${e("feature3Title")}</h6>
                            <p class="text-muted small mb-0">${e("feature3Desc")}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    `}function _(t){t.innerHTML=`
        <div class="auth-wrapper">
            <div class="auth-card" style="max-width: 440px;">
                <div class="text-center mb-4">
                    <a href="#/" class="brand-logo justify-content-center mb-3 fs-3">
                        <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <span>Sign<span class="text-primary">Ease</span></span>
                    </a>
                    <h4 class="fw-bold mb-1">${e("loginTitle")}</h4>
                    <p class="text-muted small">${e("loginSub")}</p>
                </div>

                <form id="loginForm">
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("emailAddress")}</label>
                        <input type="email" id="loginEmail" class="form-control" placeholder="name@company.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("password")}</label>
                        <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-pill btn-pill-primary w-100 py-2 fw-semibold mb-3 justify-content-center shadow-sm">
                        <i class="fa-solid fa-right-to-bracket me-1"></i> ${e("signIn")}
                    </button>
                </form>

                <div class="auth-box-subtle mb-3">
                    <div class="small fw-bold text-muted mb-2 text-uppercase" style="font-size: 0.72rem;">Quick 1-Click Demo Logins</div>
                    <div class="d-flex gap-2">
                        <button type="button" class="btn btn-sm btn-pill-outline flex-fill" id="fillAdminBtn">
                            <i class="fa-solid fa-user-shield me-1"></i> Admin
                        </button>
                        <button type="button" class="btn btn-sm btn-pill-outline flex-fill" id="fillSenderBtn">
                            <i class="fa-solid fa-user-pen me-1"></i> Demo User
                        </button>
                    </div>
                </div>

                <div class="text-center text-muted small">
                    ${e("dontHaveAccount")} <a href="#/register" class="fw-semibold text-primary text-decoration-none">${e("signUpHere")}</a>
                </div>
            </div>
        </div>
    `,document.getElementById("fillAdminBtn").onclick=()=>{document.getElementById("loginEmail").value="admin@esign.com",document.getElementById("loginPassword").value="admin123"},document.getElementById("fillSenderBtn").onclick=()=>{document.getElementById("loginEmail").value="demo@esign.com",document.getElementById("loginPassword").value="password123"},document.getElementById("loginForm").onsubmit=async s=>{s.preventDefault();const i=document.getElementById("loginEmail").value.trim(),d=document.getElementById("loginPassword").value;try{const l=await p.login(i,d);p.setToken(l.token),p.setUser(l),v.user=l,f("Welcome back, "+l.fullName+"!"),window.location.hash="#/dashboard"}catch(l){f(l.message,"danger")}}}function W(t){let s=!1,i=!1;p.clearToken(),t.innerHTML=`
        <div class="auth-wrapper">
            <div class="auth-card" style="max-width: 520px;">
                <div class="text-center mb-4">
                    <a href="#/" class="brand-logo justify-content-center mb-3 fs-3">
                        <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <span>Sign<span class="text-primary">Ease</span></span>
                    </a>
                    <h4 class="fw-bold mb-1">${e("regTitle")}</h4>
                    <p class="text-muted small">${e("regSub")}</p>
                </div>

                <form id="regForm">
                    <div class="row g-2 mb-3">
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold text-muted">${e("firstName")} *</label>
                            <input type="text" id="regFirst" class="form-control" placeholder="Rajesh" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold text-muted">${e("lastName")} *</label>
                            <input type="text" id="regLast" class="form-control" placeholder="Sharma" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("orgName")} *</label>
                        <input type="text" id="regOrg" class="form-control" placeholder="Acme Enterprises" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("emailAddress")} *</label>
                        <div class="input-group">
                            <span class="input-group-text border-end-0"><i class="fa-regular fa-envelope"></i></span>
                            <input type="email" id="regEmail" class="form-control border-start-0" placeholder="name@domain.com" required>
                            <button type="button" class="btn btn-pill-primary fw-semibold px-3" id="sendEmailOtpBtn">
                                <i class="fa-solid fa-paper-plane me-1"></i> ${e("btnGetOtp")}
                            </button>
                        </div>
                        <div class="form-text small text-muted">${e("otpDispatchedMsg")}</div>
                        <div id="regEmailAlert" class="small mt-1"></div>
                    </div>

                    <!-- Email OTP Verification Box -->
                    <div id="emailOtpSection" class="auth-box-subtle mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <label class="form-label small fw-bold text-primary mb-0">
                                <i class="fa-solid fa-shield-halved me-1"></i> ${e("otpLabel")} *
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
                                    <i class="fa-solid fa-check me-1"></i> ${e("btnVerifyOtp")}
                                </button>
                            </div>
                        </div>
                        <div id="regOtpAlert" class="small text-muted">Click <strong>${e("btnGetOtp")}</strong> to receive your code.</div>
                    </div>

                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("password")} *</label>
                        <input type="password" id="regPass" class="form-control" placeholder="••••••••" minlength="6" required>
                    </div>

                    <button type="submit" id="submitRegBtn" class="btn btn-pill btn-pill-primary w-100 py-2 fw-semibold mb-3 justify-content-center shadow-sm">
                        <i class="fa-solid fa-user-plus me-1"></i> ${e("btnCreateAccount")}
                    </button>
                </form>

                <div class="text-center text-muted small">
                    ${e("alreadyRegistered")} <a href="#/login" class="fw-semibold text-primary text-decoration-none">${e("signInHere")}</a>
                </div>
            </div>
        </div>
    `;const d=async()=>{const l=document.getElementById("regEmail").value.trim();if(!l||!l.includes("@"))return alert("Please enter a valid work email address first."),!1;const n=document.getElementById("sendEmailOtpBtn");n.disabled=!0,n.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const a=await p.sendRegistrationOtp(l);s=!0,document.getElementById("regEmailAlert").innerHTML=`
                <span class="text-success fw-medium">
                    <i class="fa-solid fa-envelope-circle-check me-1"></i> ${a.message||e("otpDispatchedMsg")}
                </span>
            `,f(e("otpDispatchedMsg"));let c=60;n.innerHTML=`Resend (${c}s)`;const g=setInterval(()=>{c--,c<=0?(clearInterval(g),n.disabled=!1,n.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):n.innerHTML=`Resend (${c}s)`},1e3);return!0}catch(a){return n.disabled=!1,n.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> '+e("btnGetOtp"),document.getElementById("regEmailAlert").innerHTML=`<span class="text-danger fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${a.message}</span>`,!1}};document.getElementById("sendEmailOtpBtn").onclick=d,document.getElementById("verifyEmailOtpBtn").onclick=async()=>{const l=document.getElementById("regEmail").value.trim(),n=document.getElementById("regOtpCode").value.trim();if(n.length!==6){alert("Please enter the 6-digit OTP code sent to your email.");return}try{await p.verifyRegistrationOtp(l,n),i=!0,document.getElementById("emailOtpSection").className="auth-box-subtle mb-3 border border-success rounded-3",document.getElementById("regEmailVerifiedBadge").classList.remove("d-none"),document.getElementById("regOtpAlert").innerHTML='<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Email Verified!</span>',document.getElementById("sendEmailOtpBtn").style.display="none",document.getElementById("regEmail").readOnly=!0,f("Email verified successfully!")}catch(a){document.getElementById("regOtpAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${a.message}</span>`}},document.getElementById("regForm").onsubmit=async l=>{l.preventDefault();const n=document.getElementById("regEmail").value.trim(),a=document.getElementById("regOtpCode").value.trim();if(!a||a.length!==6){alert('Please click "Get OTP" and enter the 6-digit verification code sent to your email.'),document.getElementById("regOtpCode").focus();return}const c=document.getElementById("submitRegBtn");c.disabled=!0,c.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Creating Account...';try{const g={firstName:document.getElementById("regFirst").value.trim(),lastName:document.getElementById("regLast").value.trim(),organizationName:document.getElementById("regOrg").value.trim(),email:n,password:document.getElementById("regPass").value,otpCode:a},m=await p.register(g);p.setToken(m.token),p.setUser(m),v.user=m,f("Account created successfully!"),window.location.hash="#/dashboard"}catch(g){c.disabled=!1,c.innerHTML='<i class="fa-solid fa-user-plus me-1"></i> '+e("btnCreateAccount"),f(g.message,"danger")}}}async function Y(t){var s;t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading dashboard...</div></div>';try{const i=await p.getDashboardStats(),d=(s=v.user)!=null&&s.fullName?v.user.fullName.split(" ")[0]:"Rajesh",l=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}),n=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});t.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- Top Greeting & Compliance Header -->
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                <i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("compliancetag")}
                            </span>
                        </div>
                        <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("greeting")} ${d}</h2>
                        <p class="text-muted small mb-0">${l} &bull; ${i.pendingSignatures||3} ${e("attentionSub")}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-card text-muted border rounded-pill px-3 py-2 fw-semibold shadow-sm" style="font-size: 0.8rem;">
                            <i class="fa-solid fa-shield-halved text-primary me-1"></i> ${e("vaultSynced")} ${n}
                        </span>
                    </div>
                </div>

                <!-- 3 Large Stat KPI Cards (Matches Screenshot 4) -->
                <div class="row g-3 mb-4">
                    <div class="col-md-4">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("totalDocs")}</div>
                                    <div class="kpi-value">${i.totalDocuments||14}</div>
                                    <div class="small text-success fw-semibold mt-1">
                                        <i class="fa-solid fa-arrow-up me-1"></i> ${e("thisWeekGrowth")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-blue">
                                    <i class="fa-regular fa-folder-open"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("pendingDocs")}</div>
                                    <div class="kpi-value text-warning">${i.pendingSignatures||3}</div>
                                    <div class="mt-1">
                                        <span class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 small fw-bold">
                                            ${e("actionNeeded")}
                                        </span>
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-orange">
                                    <i class="fa-solid fa-pen-nib"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("completedDocs")}</div>
                                    <div class="kpi-value text-success">${i.completedDocuments||9}</div>
                                    <div class="small text-muted mt-1">
                                        ${e("rateDone")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-green">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Search & Filter Bar (Matches Screenshot 4) -->
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <div class="position-relative flex-grow-1" style="max-width: 380px;">
                        <i class="fa-solid fa-magnifying-glass search-icon-wrap"></i>
                        <input type="text" id="dashSearchInput" class="search-input-pill" placeholder="${e("searchPlaceholder")}">
                    </div>
                    <div class="d-flex align-items-center gap-2 flex-wrap ms-auto">
                        <div class="filter-pill-nav bg-card p-1 rounded-pill border">
                            <button class="filter-pill active" id="tabAll">${e("filterAll")}</button>
                            <button class="filter-pill" id="tabRequiresMe">${e("filterRequiresMe")}</button>
                            <button class="filter-pill" id="tabCompleted">${e("filterCompleted")}</button>
                        </div>
                        <a href="#/upload" class="btn btn-pill btn-pill-primary shadow-sm">
                            <i class="fa-solid fa-plus me-1"></i> ${e("uploadAndSign")}
                        </a>
                    </div>
                </div>

                <!-- Documents Table (Matches Screenshot 4) -->
                <div class="table-card mb-4">
                    <div class="table-responsive">
                        <table class="table-custom">
                            <thead>
                                <tr>
                                    <th>${e("colDocName")}</th>
                                    <th>${e("colSignersStatus")}</th>
                                    <th>${e("colLastUpdated")}</th>
                                    <th class="text-end">${e("colAction")}</th>
                                </tr>
                            </thead>
                            <tbody id="dashTableBody">
                                ${i.recentDocuments&&i.recentDocuments.length>0?i.recentDocuments.map((a,c)=>`
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon">
                                                    <i class="fa-regular fa-file-pdf"></i>
                                                </div>
                                                <div>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <a href="#/documents/${a.id}" class="fw-bold text-decoration-none text-main">${a.title}</a>
                                                        ${a.status==="SENT"||a.status==="IN_PROGRESS"?'<span class="badge bg-danger-subtle text-danger rounded-pill small" style="font-size: 0.68rem;">You sign next</span>':""}
                                                    </div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                                        Ref: #SE-${a.id.substring(0,5).toUpperCase()} &bull; Aadhaar OTP required &bull; ${a.pages||1} pgs (${a.fileName})
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip ${c%2===0?"avatar-blue":"avatar-orange"}">
                                                    ${(a.uploadedByName||"Rajesh").substring(0,2).toUpperCase()}
                                                </div>
                                                <span class="small ${a.status==="COMPLETED"?"text-success fw-semibold":"text-muted"}">
                                                    ${a.status==="COMPLETED"?"Signed by all 3 parties":"Awaiting you (1 of 2 signed)"}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="small text-muted">
                                            ${new Date(a.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}, ${new Date(a.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                                        </td>
                                        <td class="text-end">
                                            <div class="d-inline-flex align-items-center gap-1">
                                                ${a.status!=="COMPLETED"?`
                                                    <a href="#/send?documentId=${a.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                                        <i class="fa-solid fa-pen-nib me-1"></i> ${e("signNow")}
                                                    </a>
                                                    <a href="#/documents/${a.id}" class="btn btn-pill btn-pill-outline btn-sm px-2" title="${e("remind")}">
                                                        <i class="fa-regular fa-bell"></i>
                                                    </a>
                                                `:`
                                                    <button type="button" onclick="window.downloadDoc('${a.id}', true, 'SEALED_${a.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                        <i class="fa-solid fa-download me-1"></i> ${e("download")}
                                                    </button>
                                                `}
                                            </div>
                                        </td>
                                    </tr>
                                `).join(""):`
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon"><i class="fa-regular fa-file-pdf"></i></div>
                                                <div>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <span class="fw-bold text-main">Vendor_Agreement_Q4_Acro.pdf</span>
                                                        <span class="badge bg-danger-subtle text-danger rounded-pill small" style="font-size: 0.68rem;">You sign next</span>
                                                    </div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">Ref: #SE-88219 &bull; Aadhaar OTP required &bull; 1.4 MB</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip avatar-blue">RS</div>
                                                <span class="small text-muted">Awaiting you (1 of 2 signed)</span>
                                            </div>
                                        </td>
                                        <td class="small text-muted">Today, 09:15 AM</td>
                                        <td class="text-end">
                                            <a href="#/upload" class="btn btn-pill btn-pill-primary btn-sm px-3"><i class="fa-solid fa-pen-nib me-1"></i> ${e("signNow")}</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon"><i class="fa-regular fa-file-pdf"></i></div>
                                                <div>
                                                    <span class="fw-bold text-main">Residential_Lease_Indiranagar.pdf</span>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">Ref: #SE-77341 &bull; 2 Signers &bull; 840 KB</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip avatar-orange">SK</div>
                                                <span class="small text-muted">Waiting for Sarah Khan</span>
                                            </div>
                                        </td>
                                        <td class="small text-muted">Yesterday, 4:20 PM</td>
                                        <td class="text-end">
                                            <button class="btn btn-pill btn-pill-outline btn-sm px-3"><i class="fa-regular fa-bell me-1"></i> ${e("remind")}</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon"><i class="fa-regular fa-file-pdf"></i></div>
                                                <div>
                                                    <span class="fw-bold text-main">Offer_Letter_ProductLead.pdf</span>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">Ref: #SE-65100 &bull; Tamper-evident seal intact</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <span class="badge bg-success-subtle text-success rounded-pill small px-2 py-1">Signed by all 3 parties</span>
                                            </div>
                                        </td>
                                        <td class="small text-muted">Oct 20, 11:45 AM</td>
                                        <td class="text-end">
                                            <button class="btn btn-pill btn-pill-outline btn-sm px-3"><i class="fa-solid fa-download me-1"></i> ${e("download")}</button>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>
                    <!-- Table Footer Pagination bar -->
                    <div class="p-3 bg-card border-top d-flex flex-wrap justify-content-between align-items-center text-muted small">
                        <div>Showing 5 of ${i.totalDocuments||14} agreements</div>
                        <a href="#/documents" class="text-primary fw-semibold text-decoration-none">
                            ${e("viewVaultLink")}
                        </a>
                    </div>
                </div>

                <!-- Bottom Trust Card (Matches Screenshot 4) -->
                <div class="trust-banner-card">
                    <div class="d-flex align-items-center gap-3">
                        <div class="brand-icon"><i class="fa-solid fa-shield-halved"></i></div>
                        <div>
                            <h6 class="fw-bold mb-1">${e("legalValidityGuaranteed")}</h6>
                            <p class="text-muted small mb-0">${e("legalValidityDesc")}</p>
                        </div>
                    </div>
                    <a href="#/verify" class="small text-primary fw-semibold text-decoration-none">
                        ${e("auditTrailGuide")}
                    </a>
                </div>
            </div>
        `}catch(i){f(i.message,"danger")}}async function J(t,s="ALL"){t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const i=await p.getDocuments(s),d=i.length||14,l=i.filter(a=>a.status==="SENT"||a.status==="IN_PROGRESS").length||1,n=i.filter(a=>a.status==="COMPLETED").length||9;t.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- 4 Top KPI Cards (Matches Screenshot 2) -->
                <div class="row g-3 mb-4">
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("activeEnvelopes")}</div>
                                    <div class="kpi-value">${d}</div>
                                    <div class="small text-success fw-semibold mt-1">
                                        <i class="fa-solid fa-arrow-up me-1"></i> ${e("thisWeekGrowth")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-blue">
                                    <i class="fa-regular fa-folder-open"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("needsAction")}</div>
                                    <div class="kpi-value text-danger">${l}</div>
                                    <div class="small text-danger fw-semibold mt-1">
                                        <i class="fa-solid fa-circle text-danger me-1" style="font-size: 0.45rem;"></i> ${e("urgentReview")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-orange">
                                    <i class="fa-solid fa-clock"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("awaitingSigners")}</div>
                                    <div class="kpi-value">${l>1?l:4}</div>
                                    <div class="small text-muted mt-1">
                                        ${e("externalParties")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-orange">
                                    <i class="fa-solid fa-hourglass-half"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("verificationAudit")}</div>
                                    <div class="kpi-value text-success">100%</div>
                                    <div class="small text-success fw-semibold mt-1">
                                        <i class="fa-solid fa-shield-check me-1"></i> ${e("itActCompliant")}
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-green">
                                    <i class="fa-solid fa-shield-halved"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Title & Header CTAs (Matches Screenshot 2) -->
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                    <div>
                        <h3 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("docRegistryTitle")}</h3>
                        <p class="text-muted small mb-0">${e("docRegistrySub")}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button class="btn btn-pill btn-pill-outline btn-sm shadow-sm" id="exportCsvBtn" onclick="alert('Exporting agreements ledger to CSV...')">
                            <i class="fa-solid fa-arrow-down-to-line me-1"></i> ${e("exportCsv")}
                        </button>
                        <a href="#/upload" class="btn btn-pill btn-pill-primary shadow-sm">
                            <i class="fa-solid fa-plus me-1"></i> ${e("newAgreement")}
                        </a>
                    </div>
                </div>

                <!-- Filter Pills Row & Search (Matches Screenshot 2) -->
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <div class="filter-pill-nav bg-card p-1 rounded-pill border">
                        <a class="filter-pill ${s==="ALL"?"active":""}" href="#/documents?status=ALL">
                            All <span class="badge bg-white text-dark ms-1">${d}</span>
                        </a>
                        <a class="filter-pill ${s==="SENT"?"active":""}" href="#/documents?status=SENT">
                            ${e("filterRequiresMe")} <span class="badge bg-danger text-white ms-1">${l}</span>
                        </a>
                        <a class="filter-pill ${s==="IN_PROGRESS"?"active":""}" href="#/documents?status=IN_PROGRESS">
                            ${e("filterWaitingOthers")} <span class="badge bg-secondary ms-1">4</span>
                        </a>
                        <a class="filter-pill ${s==="COMPLETED"?"active":""}" href="#/documents?status=COMPLETED">
                            ${e("filterCompleted")} <span class="badge bg-success ms-1">${n}</span>
                        </a>
                    </div>
                    <div class="position-relative" style="min-width: 260px;">
                        <i class="fa-solid fa-magnifying-glass search-icon-wrap"></i>
                        <input type="text" class="search-input-pill" placeholder="${e("searchPlaceholder")}">
                    </div>
                </div>

                <!-- Table Card (Matches Screenshot 2) -->
                <div class="table-card mb-4">
                    <div class="table-responsive">
                        <table class="table-custom">
                            <thead>
                                <tr>
                                    <th>DOCUMENT NAME</th>
                                    <th>PARTIES / SIGNERS</th>
                                    <th>STATUS</th>
                                    <th>TIMELINE</th>
                                    <th class="text-end">ACTION</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${i&&i.length>0?i.map((a,c)=>{let g="status-pending",m="Pending";return a.status==="COMPLETED"?(g="status-completed",m="Completed & Sealed"):a.status==="SENT"?(g="status-signed",m="Signed"):a.status==="DRAFT"&&(g="status-draft",m="Draft"),`
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center gap-3">
                                                    <div class="file-thumb-icon">
                                                        <i class="fa-regular fa-file-lines"></i>
                                                    </div>
                                                    <div>
                                                        <div class="fw-bold text-main">
                                                            <a href="#/documents/${a.id}" class="text-decoration-none text-main">${a.title}</a>
                                                        </div>
                                                        <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                                            DOC-2026-${a.id.substring(0,4).toUpperCase()} &bull; PDF (${Math.round((a.fileSize||1024)/1024)} KB)
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="signer-avatar-chip ${c%3===0?"avatar-blue":c%3===1?"avatar-orange":"avatar-purple"}">
                                                        ${(a.uploadedByName||"SJ").substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span class="small text-muted">${a.uploadedByName||"Sarah Jenkins"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="status-pill ${g}">
                                                    <span class="status-dot"></span> ${m}
                                                </span>
                                            </td>
                                            <td class="small text-muted">
                                                <div>${new Date(a.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                                                <div style="font-size: 0.72rem; color: var(--text-light);">${a.status==="COMPLETED"?"Timestamped & Stored":"Expires in 5 days"}</div>
                                            </td>
                                            <td class="text-end">
                                                <div class="d-inline-flex align-items-center gap-1">
                                                    ${a.status==="DRAFT"?`
                                                        <a href="#/send?documentId=${a.id}" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-pen-to-square me-1"></i> Continue Edit
                                                        </a>
                                                    `:a.status==="COMPLETED"?`
                                                        <button type="button" onclick="window.downloadDoc('${a.id}', true, 'SEALED_${a.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-download me-1"></i> ${e("downloadPdf")}
                                                        </button>
                                                    `:`
                                                        <a href="#/send?documentId=${a.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                                            <i class="fa-solid fa-pen-nib me-1"></i> ${e("reviewAndSign")}
                                                        </a>
                                                    `}
                                                    <div class="dropdown d-inline-block">
                                                        <button class="btn btn-link text-muted p-1" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 10px;">
                                                            <li><a class="dropdown-item py-2 small" href="#/documents/${a.id}"><i class="fa-solid fa-magnifying-glass me-2"></i> Inspect Audit Logs</a></li>
                                                            <li><a class="dropdown-item py-2 small" href="#/verify?hash=${a.finalHash||""}"><i class="fa-solid fa-shield-halved me-2 text-success"></i> Verify Hash</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    `}).join(""):`
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon"><i class="fa-solid fa-file-contract"></i></div>
                                                <div>
                                                    <div class="fw-bold text-main">Master Service Agreement</div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">DOC-2024-8841 &bull; PDF (3.2 MB)</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip avatar-blue">SJ</div>
                                                <span class="small text-muted">Sarah Jenkins</span>
                                            </div>
                                        </td>
                                        <td><span class="status-pill status-pending"><span class="status-dot"></span> Pending</span></td>
                                        <td class="small text-muted"><div>Updated 2h ago</div><div style="font-size: 0.72rem; color: var(--text-light);">Expires in 5 days</div></td>
                                        <td class="text-end">
                                            <a href="#/upload" class="btn btn-pill btn-pill-primary btn-sm px-3"><i class="fa-solid fa-pen-nib me-1"></i> Review &amp; Sign</a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon" style="background: rgba(16, 185, 129, 0.15); color: #10b981;"><i class="fa-solid fa-shield-halved"></i></div>
                                                <div>
                                                    <div class="fw-bold text-main">Founder IP Assignment</div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">DOC-2024-7612 &bull; Hash: 8f2a...1e4c</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip avatar-blue">RS</div>
                                                <span class="small text-muted">Rajesh Sharma (You)</span>
                                            </div>
                                        </td>
                                        <td><span class="status-pill status-completed"><span class="status-dot"></span> Completed &amp; Sealed</span></td>
                                        <td class="small text-muted"><div>Nov 12, 2024</div><div style="font-size: 0.72rem; color: var(--text-light);">Timestamped &amp; Stored</div></td>
                                        <td class="text-end">
                                            <button class="btn btn-pill btn-pill-outline btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Download PDF</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon" style="background: rgba(6, 182, 212, 0.15); color: #06b6d4;"><i class="fa-solid fa-signature"></i></div>
                                                <div>
                                                    <div class="fw-bold text-main">Mutual NDA - Vertex Labs</div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">DOC-2024-5109 &bull; 2 Signatures</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip avatar-purple">VL</div>
                                                <span class="small text-muted">Vertex Legal Team</span>
                                            </div>
                                        </td>
                                        <td><span class="status-pill status-signed"><span class="status-dot"></span> Signed</span></td>
                                        <td class="small text-muted"><div>Nov 10, 2024</div><div style="font-size: 0.72rem; color: var(--text-light);">Fully Executed</div></td>
                                        <td class="text-end">
                                            <button class="btn btn-pill btn-pill-outline btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Download PDF</button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b;"><i class="fa-regular fa-file"></i></div>
                                                <div>
                                                    <div class="fw-bold text-main">Residential Commercial Lease</div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">DOC-2024-9120 &bull; Incomplete Draft</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <span class="small text-muted">&ndash;&ndash; Unassigned</span>
                                            </div>
                                        </td>
                                        <td><span class="status-pill status-draft"><span class="status-dot"></span> Draft</span></td>
                                        <td class="small text-muted"><div>Created Yesterday</div><div style="font-size: 0.72rem; color: var(--text-light);">Auto-saved</div></td>
                                        <td class="text-end">
                                            <a href="#/upload" class="btn btn-pill btn-pill-outline btn-sm px-3"><i class="fa-solid fa-pen-to-square me-1"></i> Continue Edit</a>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Footer (Matches Screenshot 2) -->
                    <div class="p-3 bg-card border-top d-flex flex-wrap justify-content-between align-items-center text-muted small">
                        <div>Showing <strong>1-4</strong> of <strong>${d}</strong> agreements</div>
                        <div class="d-flex align-items-center gap-1">
                            <button class="btn btn-pill btn-pill-outline btn-sm px-2 py-1 disabled"><i class="fa-solid fa-chevron-left me-1"></i> Prev</button>
                            <button class="btn btn-pill btn-pill-primary btn-sm px-3 py-1">1</button>
                            <button class="btn btn-pill btn-pill-outline btn-sm px-3 py-1">2</button>
                            <button class="btn btn-pill btn-pill-outline btn-sm px-3 py-1">3</button>
                            <button class="btn btn-pill btn-pill-outline btn-sm px-3 py-1">4</button>
                            <button class="btn btn-pill btn-pill-outline btn-sm px-2 py-1">Next <i class="fa-solid fa-chevron-right ms-1"></i></button>
                        </div>
                    </div>
                </div>

                <!-- Bottom Hardware Encryption Trust Card (Matches Screenshot 2) -->
                <div class="trust-banner-card">
                    <div class="d-flex align-items-center gap-3">
                        <div class="brand-icon" style="background: linear-gradient(135deg, #0d6efd 0%, #06b6d4 100%);">
                            <i class="fa-solid fa-shield-halved"></i>
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">${e("hsmActive")}</h6>
                            <p class="text-muted small mb-0">${e("hsmDesc")}</p>
                        </div>
                    </div>
                    <a href="#/verify" class="small text-primary fw-semibold text-decoration-none">
                        ${e("viewCryptoCert")}
                    </a>
                </div>
            </div>
        `}catch(i){f(i.message,"danger")}}async function K(t,s){t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const i=await p.getDocument(s);t.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge rounded-pill px-3 py-1 badge-status-${i.status} fw-bold">${i.status}</span>
                            ${i.sequentialSigning?'<span class="badge bg-secondary-subtle text-secondary small">Sequential Routing</span>':""}
                        </div>
                        <h3 class="fw-bold mb-1">${i.title}</h3>
                        <div class="text-muted small">Uploaded by <strong>${i.ownerName}</strong> on ${new Date(i.createdAt).toLocaleString("en-IN")}</div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        ${i.status==="DRAFT"?`<a href="#/send?documentId=${i.id}" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-paper-plane me-1"></i> Send for Signature</a>`:""}
                        ${i.finalHash?`<button type="button" onclick="window.downloadDoc('${i.id}', true, 'SEALED_${i.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-success btn-sm px-3"><i class="fa-solid fa-file-shield me-1"></i> Download Sealed PDF</button>`:""}
                        <button type="button" onclick="window.downloadDoc('${i.id}', false, 'ORIGINAL_${i.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-outline-secondary btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Original PDF</button>
                        ${i.finalHash?`<a href="#/verify?hash=${i.finalHash}" class="btn btn-outline-primary btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> Verify on Ledger</a>`:""}
                    </div>
                </div>

                <!-- Cryptographic Hashes Card -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Original Pre-Execution SHA-256</div>
                            <div class="hash-box">${i.originalHash||"N/A"}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Final Sealed SHA-256 Fingerprint</div>
                            <div class="hash-box text-success fw-bold">${i.finalHash||"Pending completion of all signatories"}</div>
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
                                ${i.signers&&i.signers.length>0?i.signers.map(d=>`
                                    <tr>
                                        <td class="ps-3 fw-bold text-muted">#${d.signOrder}</td>
                                        <td>
                                            <div class="fw-bold">${d.name}</div>
                                            <div class="small text-muted">${d.email}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${d.status}">${d.status}</span></td>
                                        <td>${d.otpVerified?'<span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> Verified</span>':'<span class="badge bg-light text-muted">Pending</span>'}</td>
                                        <td class="small text-muted">${d.signedAt?new Date(d.signedAt).toLocaleString("en-IN"):"-"}</td>
                                        <td class="text-end pe-3">
                                            ${d.status!=="SIGNED"?`
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="window.copySignerLink('${d.signingToken}', event)" title="Copy direct signing link">
                                                        <i class="fa-regular fa-copy me-1"></i> Copy Link
                                                    </button>
                                                    <button type="button" class="btn btn-outline-primary" onclick="window.resendInvite('${d.id}', event)" title="Resend email invite via Gmail">
                                                        <i class="fa-solid fa-paper-plane me-1"></i> Resend Email
                                                    </button>
                                                    <a href="#/sign/${d.signingToken}" target="_blank" class="btn btn-primary" title="Open signing portal">
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
                                ${i.auditLogs&&i.auditLogs.length>0?i.auditLogs.map(d=>`
                                    <tr>
                                        <td class="ps-3 text-nowrap text-muted">${new Date(d.timestamp).toLocaleString("en-IN")}</td>
                                        <td><span class="badge bg-light text-dark">${d.action}</span></td>
                                        <td class="text-break" style="font-family: sans-serif; max-width: 300px;">${d.details}</td>
                                        <td class="text-muted">${d.ipAddress}</td>
                                        <td class="text-muted">${d.prevHash?d.prevHash.substring(0,10)+"...":"-"}</td>
                                        <td class="pe-3 text-success fw-bold">${d.currentHash?d.currentHash.substring(0,10)+"...":"-"}</td>
                                    </tr>
                                `).join(""):'<tr><td colspan="6" class="text-center py-3 text-muted">No audit events recorded yet.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}catch(i){f(i.message,"danger")}}async function Z(t){z(t,null)}async function z(t,s){t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading workflow dispatch...</div></div>';try{let i=null;if(s)try{i=await p.getDocument(s)}catch{}t.innerHTML=`
            <div class="container py-4" style="max-width: 860px;">
                <!-- Header Badge & Title (Matches Screenshot 3) -->
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <div class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-pen-nib me-1"></i> ${e("workflowDispatch")}
                        </div>
                        <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("sendDocForSignature")}</h2>
                        <p class="text-muted small mb-0">${e("sendDocDesc")}</p>
                    </div>
                    <div>
                        <span class="badge bg-card text-muted border rounded-pill px-3 py-2 fw-semibold shadow-sm" style="font-size: 0.8rem;">
                            <i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("aadhaarCompliant")}
                        </span>
                    </div>
                </div>

                <form id="workflowSendForm">
                    <!-- STEP 1: Upload File (Matches Screenshot 3) -->
                    <div class="wizard-card">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div class="d-flex align-items-center">
                                <span class="step-badge">1</span>
                                <h5 class="fw-bold mb-0 text-main">${e("step1Upload")}</h5>
                            </div>
                            <span class="small fw-bold text-muted text-uppercase" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                ${e("pdfFormatUpTo")}
                            </span>
                        </div>

                        <!-- Dropzone Box -->
                        <div class="dropzone-box" id="workflowDropzone" style="${i?"display: none;":""}">
                            <div class="dropzone-icon-circle">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                            <div class="fw-bold text-main mb-1 fs-6">
                                ${e("dropPdfHere")} <span class="text-primary text-decoration-underline" role="button">${e("browseFiles")}</span>
                            </div>
                            <div class="small text-muted" style="font-size: 0.78rem;">
                                ${e("encryptedTransit")}
                            </div>
                            <input type="file" id="workflowFileInput" accept="application/pdf" class="d-none">
                        </div>

                        <!-- Uploaded File Preview Pill Card (Matches Screenshot 3) -->
                        <div id="uploadedFilePreviewBox" class="uploaded-file-card" style="${i?"display: flex;":"display: none;"}">
                            <div class="d-flex align-items-center gap-3">
                                <div class="file-thumb-icon">
                                    <i class="fa-regular fa-file-pdf"></i>
                                </div>
                                <div>
                                    <div class="fw-bold text-main" id="previewFileName">${i?i.fileName:"Employment_Agreement_2026.pdf"}</div>
                                    <div class="small text-muted" style="font-size: 0.76rem;" id="previewFileMeta">
                                        ${i?Math.round((i.fileSize||18e5)/1024/1024*10)/10+" MB":"1.8 MB"} &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                <button type="button" class="btn btn-pill btn-pill-outline btn-sm px-3" id="previewDocBtn">
                                    <i class="fa-regular fa-eye me-1"></i> Preview
                                </button>
                                <button type="button" class="btn btn-link text-muted p-1" id="removeFileBtn" title="Remove File">
                                    <i class="fa-solid fa-xmark fs-5"></i>
                                </button>
                            </div>
                        </div>

                        <div class="mt-3">
                            <input type="text" id="envelopeTitle" class="form-control" placeholder="Agreement Title (e.g. Master Service Agreement)" value="${i?i.title:""}" required>
                        </div>
                    </div>

                    <!-- STEP 2: Add Signers (Matches Screenshot 3) -->
                    <div class="wizard-card">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <div class="d-flex align-items-center">
                                <span class="step-badge">2</span>
                                <h5 class="fw-bold mb-0 text-main">${e("step2Signers")}</h5>
                            </div>
                            <span class="small fw-bold text-muted text-uppercase" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                ${e("orderType")}
                            </span>
                        </div>
                        <p class="text-muted small mb-3 ms-4 ps-2">${e("signersNotice")}</p>

                        <!-- Dynamic Signers Container -->
                        <div id="dynamicSignersList">
                            <!-- Signer Row 1 -->
                            <div class="signer-input-row">
                                <div class="row g-2 align-items-center">
                                    <div class="col-md-4">
                                        <div class="meta-box-label"><i class="fa-regular fa-user"></i> ${e("signerName")}</div>
                                        <input type="text" class="form-control s-name" placeholder="e.g. Sarah Jenkins" value="Sarah Jenkins" required>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="meta-box-label"><i class="fa-regular fa-envelope"></i> ${e("emailAddress")}</div>
                                        <input type="email" class="form-control s-email" placeholder="name@company.com" value="s.jenkins@acmecorp.io" required>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="meta-box-label">${e("role")}</div>
                                        <select class="form-select s-role">
                                            <option value="SIGNER" selected>${e("needsToSign")}</option>
                                            <option value="VIEWER">${e("receivesCopy")}</option>
                                        </select>
                                    </div>
                                    <div class="col-md-1 text-end pt-3">
                                        <button type="button" class="btn btn-link text-danger p-1" onclick="this.closest('.signer-input-row').remove()" title="Delete">
                                            <i class="fa-regular fa-trash-can"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-3">
                            <button type="button" class="btn btn-pill btn-pill-outline btn-sm" id="addNewSignerRowBtn">
                                <i class="fa-solid fa-plus me-1 text-primary"></i> ${e("addAnotherRecipient")}
                            </button>
                        </div>
                    </div>

                    <!-- Tamper-Proof Audit Bar (Matches Screenshot 3) -->
                    <div class="trust-banner-card mb-4">
                        <div class="d-flex align-items-center gap-3">
                            <div class="file-thumb-icon"><i class="fa-solid fa-shield-halved"></i></div>
                            <div>
                                <h6 class="fw-bold mb-1">${e("tamperProofAudit")}</h6>
                                <p class="text-muted small mb-0">${e("tamperProofDesc")}</p>
                            </div>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="sendReminderCheck" checked>
                            <label class="form-check-label small fw-semibold text-main" for="sendReminderCheck">
                                ${e("sendReminder48h")}
                            </label>
                        </div>
                    </div>

                    <!-- Bottom Action Buttons (Matches Screenshot 3) -->
                    <div class="d-flex justify-content-between align-items-center">
                        <a href="#/documents" class="btn btn-pill btn-pill-outline btn-sm px-4">${e("cancel")}</a>
                        <div class="d-flex gap-2">
                            <button type="button" class="btn btn-pill btn-pill-outline px-4" id="saveDraftBtn">${e("saveAsDraft")}</button>
                            <button type="submit" class="btn btn-pill btn-pill-primary px-4 shadow" id="dispatchEnvelopeBtn">
                                ${e("sendForSignature")}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        `;const d=document.getElementById("workflowDropzone"),l=document.getElementById("workflowFileInput"),n=document.getElementById("uploadedFilePreviewBox");let a=null;d&&l&&(d.onclick=()=>l.click(),l.onchange=()=>{l.files[0]&&(a=l.files[0],document.getElementById("previewFileName").textContent=a.name,document.getElementById("previewFileMeta").innerHTML=`${(a.size/1024/1024).toFixed(1)} MB &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>`,document.getElementById("envelopeTitle").value||(document.getElementById("envelopeTitle").value=a.name.replace(/\.[^/.]+$/,"")),d.style.display="none",n.style.display="flex")},["dragenter","dragover"].forEach(m=>{d.addEventListener(m,u=>{u.preventDefault(),d.classList.add("dragover")})}),["dragleave","drop"].forEach(m=>{d.addEventListener(m,u=>{u.preventDefault(),d.classList.remove("dragover")})}),d.addEventListener("drop",m=>{m.dataTransfer.files&&m.dataTransfer.files.length>0&&(l.files=m.dataTransfer.files,l.dispatchEvent(new Event("change")))}));const c=document.getElementById("removeFileBtn");c&&(c.onclick=()=>{a=null,i=null,l.value="",n.style.display="none",d.style.display="block"});const g=document.getElementById("addNewSignerRowBtn");g&&(g.onclick=()=>{const m=document.getElementById("dynamicSignersList"),u=document.createElement("div");u.className="signer-input-row",u.innerHTML=`
                    <div class="row g-2 align-items-center">
                        <div class="col-md-4">
                            <div class="meta-box-label"><i class="fa-regular fa-user"></i> ${e("signerName")}</div>
                            <input type="text" class="form-control s-name" placeholder="e.g. Vikram Mehta" required>
                        </div>
                        <div class="col-md-4">
                            <div class="meta-box-label"><i class="fa-regular fa-envelope"></i> ${e("emailAddress")}</div>
                            <input type="email" class="form-control s-email" placeholder="name@company.com" required>
                        </div>
                        <div class="col-md-3">
                            <div class="meta-box-label">${e("role")}</div>
                            <select class="form-select s-role">
                                <option value="SIGNER" selected>${e("needsToSign")}</option>
                                <option value="VIEWER">${e("receivesCopy")}</option>
                            </select>
                        </div>
                        <div class="col-md-1 text-end pt-3">
                            <button type="button" class="btn btn-link text-danger p-1" onclick="this.closest('.signer-input-row').remove()" title="Delete">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        </div>
                    </div>
                `,m.appendChild(u)}),document.getElementById("workflowSendForm").onsubmit=async m=>{m.preventDefault();const u=document.getElementById("dispatchEnvelopeBtn");u.disabled=!0,u.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Dispatching...';try{let h=i?i.id:null;if(a){const x=new FormData;x.append("file",a),x.append("title",document.getElementById("envelopeTitle").value.trim()||a.name),h=(await p.uploadDocument(x)).id}else if(!h){alert("Please select or drop a PDF file in Step 1."),u.disabled=!1,u.innerHTML=e("sendForSignature");return}const b=[];if(document.querySelectorAll(".signer-input-row").forEach((x,$)=>{b.push({name:x.querySelector(".s-name").value.trim(),email:x.querySelector(".s-email").value.trim(),role:x.querySelector(".s-role").value,order:$+1})}),b.length===0){alert("Please add at least one signer."),u.disabled=!1,u.innerHTML=e("sendForSignature");return}const S=await p.createSigningRequest({documentId:h,title:document.getElementById("envelopeTitle").value.trim(),message:"",dueDate:null,sequentialSigning:!1,signers:b});let A="";S.signers&&S.signers.length>0&&(A=S.signers.map(x=>`
• ${x.name} (${x.email}):
  ${window.location.origin}/#/sign/${x.token}`).join(`
`)),alert("✅ Agreement Dispatched Successfully! Signing invitations dispatched to signers via email."+(A?`

Direct Signing Links (Copy to share):
`+A:"")),f("Agreement Dispatched Successfully! Invites sent."),window.location.hash=`#/documents/${h}`}catch(h){u.disabled=!1,u.innerHTML=e("sendForSignature"),f(h.message,"danger")}}}catch(i){f(i.message,"danger")}}async function X(t,s){t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading signing context...</div></div>';try{let x=function(){const r=n.getBoundingClientRect();n.width=r.width*2,n.height=180*2,a.scale(2,2),a.strokeStyle=g,a.lineWidth=2.5,a.lineCap="round",a.lineJoin="round"},$=function(r){const o=n.getBoundingClientRect();return r.touches&&r.touches.length>0?{x:r.touches[0].clientX-o.left,y:r.touches[0].clientY-o.top}:{x:r.clientX-o.left,y:r.clientY-o.top}};var i=x,d=$;const l=await p.getSigningContext(s);if(l.signerStatus==="SIGNED"){t.innerHTML=`
                <div class="d-flex align-items-center justify-content-center py-5">
                    <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 540px; border-radius: 16px;">
                        <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
                        <h4 class="fw-bold mb-2">Already Executed</h4>
                        <p class="text-muted small mb-4">You have already completed electronic signing for this document on ${new Date(l.signedAt).toLocaleString("en-IN")}.</p>
                        <a href="#/verify?hash=${l.finalHash||""}" class="btn btn-outline-primary btn-sm">Public Ledger Verification</a>
                    </div>
                </div>
            `;return}t.innerHTML=`
            <div class="container py-4" style="max-width: 860px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <i class="fa-solid fa-file-signature text-primary fs-3 me-2"></i>
                        <span class="fs-4 fw-bold text-primary">Sign<span class="text-dark">Ease</span></span>
                        <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill small">${e("signerWelcome")}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div class="dropdown">
                            <button class="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fa-solid fa-globe me-1"></i> ${D()==="hi"?"🇮🇳 हिन्दी":D()==="mr"?"🇮🇳 मराठी":D()==="gu"?"🇮🇳 ગુજરાતી":"🌐 Language"}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('en')">🇬🇧 English</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('hi')">🇮🇳 हिन्दी (Hindi)</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('mr')">🇮🇳 मराठी (Marathi)</a></li>
                                <li><a class="dropdown-item notranslate" href="javascript:void(0)" onclick="window.changeAppLanguage('gu')">🇮🇳 ગુજરાતી (Gujarati)</a></li>
                            </ul>
                        </div>
                        <div class="small text-muted d-none d-sm-block">${e("requestedBy")} <strong>${l.senderName}</strong></div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm bg-white p-4 p-md-5 mb-4">
                    <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-warning-subtle text-warning fw-bold mb-1">Awaiting Signature</span>
                            <h4 class="fw-bold mb-1">${l.documentTitle}</h4>
                            <div class="text-muted small">Signer: <strong>${l.signerName}</strong> (${l.signerEmail})</div>
                        </div>
                        <a href="${p.getSigningPreviewUrl(s)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open PDF</a>
                    </div>

                    <!-- In-Browser Document Preview -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-regular fa-file-pdf text-danger me-1"></i> Document Review</label>
                        <div class="rounded-3 border overflow-hidden" style="height: 380px; background: #e2e8f0;">
                            <iframe src="${p.getSigningPreviewUrl(s)}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                    </div>

                    <!-- STEP 1: OTP Identity Check (FR-07) -->
                    <div class="p-3 mb-4 rounded-3 border ${l.otpVerified?"bg-success-subtle border-success":"bg-light"}" id="otpContainer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small text-uppercase"><i class="fa-solid fa-shield-halved text-primary me-1"></i> Step 1: Identity Verification (OTP)</span>
                                <div class="small text-muted" id="otpText">${l.otpVerified?'<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP':e("otpNotice")}</div>
                            </div>
                            ${l.otpVerified?"":`<button type="button" class="btn btn-sm btn-primary" id="getOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> ${e("btnGetOtp")}</button>`}
                        </div>

                        <div id="otpInputArea" class="mt-3 pt-3 border-top" style="display: none;">
                            <div class="row g-2 align-items-center">
                                <div class="col-sm-5"><input type="text" id="signerOtp" class="form-control text-center fw-bold fs-6 font-monospace" placeholder="6-digit code" maxlength="6"></div>
                                <div class="col-sm-4"><button type="button" class="btn btn-sm btn-success w-100 fw-semibold" id="verifyOtpBtn">${e("btnVerifyOtp")}</button></div>
                            </div>
                            <div id="otpMsg" class="small mt-2"></div>
                        </div>
                    </div>

                    <!-- STEP 2: Signature Input (FR-06) -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-solid fa-pen-nib text-primary me-1"></i> Step 2: Adopt Signature</label>

                        <ul class="nav nav-tabs nav-fill mb-3" id="sigModeTab">
                            <li class="nav-item"><button class="nav-link active fw-semibold" data-mode="DRAWN" type="button"><i class="fa-solid fa-paintbrush me-1"></i> ${e("tabDraw")}</button></li>
                            <li class="nav-item"><button class="nav-link fw-semibold" data-mode="TYPED" type="button"><i class="fa-solid fa-keyboard me-1"></i> ${e("tabType")}</button></li>
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
                                <button type="button" class="btn btn-sm btn-outline-secondary" id="clearCanvasBtn"><i class="fa-solid fa-rotate-left me-1"></i> ${e("btnClear")}</button>
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
                        <button type="button" class="btn btn-success btn-lg px-4 fw-bold shadow" id="executeBtn"><i class="fa-solid fa-signature me-2"></i> ${e("btnCompleteSigning")}</button>
                    </div>
                </div>
            </div>
        `;const n=document.getElementById("signCanvas"),a=n.getContext("2d");let c="DRAWN",g="#0f172a",m=!1,u=0,h=0,b=!1,S="",A=1;x(),n.onmousedown=r=>{m=!0,b=!0;const o=$(r);u=o.x,h=o.y},n.onmousemove=r=>{if(!m)return;const o=$(r);a.strokeStyle=g,a.beginPath(),a.moveTo(u,h),a.lineTo(o.x,o.y),a.stroke(),u=o.x,h=o.y},n.onmouseup=()=>m=!1,n.onmouseleave=()=>m=!1,n.ontouchstart=r=>{m=!0,b=!0;const o=$(r);u=o.x,h=o.y},n.ontouchmove=r=>{if(!m)return;r.preventDefault();const o=$(r);a.strokeStyle=g,a.beginPath(),a.moveTo(u,h),a.lineTo(o.x,o.y),a.stroke(),u=o.x,h=o.y},n.ontouchend=()=>m=!1,document.getElementById("clearCanvasBtn").onclick=()=>{a.clearRect(0,0,n.width,n.height),b=!1},document.getElementById("penBlack").onclick=function(){g="#0f172a",this.classList.add("active"),document.getElementById("penBlue").classList.remove("active")},document.getElementById("penBlue").onclick=function(){g="#1e40af",this.classList.add("active"),document.getElementById("penBlack").classList.remove("active")},document.querySelectorAll("#sigModeTab button").forEach(r=>{r.onclick=()=>{document.querySelectorAll("#sigModeTab button").forEach(o=>o.classList.remove("active")),r.classList.add("active"),c=r.dataset.mode,document.getElementById("paneDrawn").style.display=c==="DRAWN"?"block":"none",document.getElementById("paneTyped").style.display=c==="TYPED"?"block":"none",document.getElementById("paneUploaded").style.display=c==="UPLOADED"?"block":"none",document.getElementById("paneAadhaar").style.display=c==="AADHAAR_ESIGN"?"block":"none"}});const E=document.getElementById("typedInput");E.oninput=()=>{document.getElementById("typePrev1").textContent=E.value||"Name",document.getElementById("typePrev2").textContent=E.value||"Name"},document.getElementById("styleOpt1").onclick=()=>{A=1,document.getElementById("styleOpt1").classList.add("selected"),document.getElementById("styleOpt2").classList.remove("selected")},document.getElementById("styleOpt2").onclick=()=>{A=2,document.getElementById("styleOpt2").classList.add("selected"),document.getElementById("styleOpt1").classList.remove("selected")},document.getElementById("sigUploadInput").onchange=function(){if(this.files[0]){const r=new FileReader;r.onload=o=>{S=o.target.result,document.getElementById("upPreviewImg").src=S,document.getElementById("upPreviewBox").style.display="block"},r.readAsDataURL(this.files[0])}};const w=document.getElementById("getOtpBtn");let L=null;w&&(w.onclick=async()=>{if(!w.disabled){w.disabled=!0,w.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';try{const r=await p.requestOtp(s);document.getElementById("otpInputArea").style.display="block",document.getElementById("otpMsg").innerHTML=`<span class="text-success"><i class="fa-solid fa-envelope-circle-check me-1"></i> ${r.message||"OTP sent to your email."}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your inbox or spam folder. Valid for 10 minutes.</small></span>`;let o=60;w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${o}s)`,L&&clearInterval(L),L=setInterval(()=>{o--,o<=0?(clearInterval(L),w.disabled=!1,w.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP Code'):w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${o}s)`},1e3)}catch(r){w.disabled=!1,w.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code',f(r.message,"danger")}}}),document.getElementById("verifyOtpBtn").onclick=async()=>{const r=document.getElementById("signerOtp").value.trim();if(!r){alert("Enter 6-digit code");return}try{await p.verifyOtp(s,r),document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Code!',document.getElementById("otpInputArea").style.display="none"}catch(o){document.getElementById("otpMsg").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${o.message}</span>`}},document.getElementById("declineBtn").onclick=async()=>{const r=prompt("Please specify reason for declining:");r&&(await p.declineSignature(s,r),f("Document declined."),window.location.reload())};let N=!1,R="";const H=document.getElementById("spaAadhaarInput");H&&(H.oninput=function(){let r=this.value.replace(/\D/g,"");r.length>12&&(r=r.substring(0,12));let o="";for(let y=0;y<r.length;y++)y>0&&y%4===0&&(o+=" "),o+=r[y];this.value=o});const T=document.getElementById("spaSendAadhaarOtpBtn");let B=null;T&&(T.onclick=async()=>{if(T.disabled)return;const r=document.getElementById("spaAadhaarInput").value.replace(/\D/g,"");if(r.length!==12||r.startsWith("0")||r.startsWith("1")){alert("Please enter a valid 12-digit Aadhaar number (cannot start with 0 or 1).");return}try{T.disabled=!0,T.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Requesting OTP...';const o=await p.requestAadhaarOtp(s,r);document.getElementById("spaAadhaarOtpRow").style.display="block",document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${o.message||"Aadhaar OTP dispatched to linked mobile & email."}</span>`;let y=60;T.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${y}s)`,B&&clearInterval(B),B=setInterval(()=>{y--,y<=0?(clearInterval(B),T.disabled=!1,T.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):T.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${y}s)`},1e3)}catch(o){T.disabled=!1,T.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP',document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${o.message}</span>`}});const F=document.getElementById("spaVerifyAadhaarOtpBtn");F&&(F.onclick=async()=>{const r=document.getElementById("spaAadhaarInput").value.replace(/\D/g,""),o=document.getElementById("spaAadhaarOtpCode").value.trim();if(o.length!==6){alert("Please enter 6-digit Aadhaar OTP code.");return}try{const y=await p.verifyAadhaarOtp(s,r,o);N=!0,R=y.signatureData,document.getElementById("spaAadhaarForm").style.display="none",document.getElementById("spaAadhaarSuccess").style.display="block",document.getElementById("spaAadhaarDetails").innerHTML=`<strong>UID:</strong> ${y.maskedAadhaar} &bull; <strong>Txn:</strong> ${y.txnId}`,document.getElementById("spaAadhaarStampImg").src=y.signatureData,document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via UIDAI Aadhaar e-KYC!',document.getElementById("otpInputArea").style.display="none",document.getElementById("legalConsent").checked=!0,f("Aadhaar identity verified successfully!")}catch(y){document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${y.message}</span>`}}),document.getElementById("executeBtn").onclick=async()=>{if(!document.getElementById("legalConsent").checked){alert("You must accept the legal consent agreement under IT Act 2000.");return}let r="";if(c==="DRAWN"){if(!b){alert("Please draw your signature.");return}r=n.toDataURL("image/png")}else if(c==="TYPED"){const o=E.value.trim();if(!o){alert("Enter your legal name.");return}const y=document.createElement("canvas");y.width=400,y.height=100;const k=y.getContext("2d");k.fillStyle="#ffffff",k.fillRect(0,0,400,100),k.fillStyle="#0f172a",k.font=A===1?'48px "Great Vibes", cursive':'44px "Dancing Script", cursive',k.textAlign="center",k.textBaseline="middle",k.fillText(o,200,50),r=y.toDataURL("image/png")}else if(c==="UPLOADED"){if(!S){alert("Please upload signature image.");return}r=S}else if(c==="AADHAAR_ESIGN"){if(!N){alert("Please enter your 12-digit Aadhaar number and verify with OTP before executing.");return}r=R}try{await p.submitSignature(s,{signatureData:r,signatureType:c,typedName:E.value.trim(),consentAccepted:!0}),t.innerHTML=`
                    <div class="d-flex align-items-center justify-content-center py-5">
                        <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 580px; border-radius: 16px;">
                            <div class="rounded-circle bg-success-subtle text-success mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; font-size: 2rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 class="fw-bold mb-2">Signature Recorded &amp; Sealed!</h3>
                            <p class="text-muted mb-4">Thank you, <strong>${l.signerName}</strong>. Your electronic signature has been cryptographically sealed under Section 10A of the IT Act 2000.</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="${p.getSigningPreviewUrl(s)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-file-pdf me-1"></i> View Executed PDF</a>
                                <a href="#/verify" class="btn btn-primary btn-sm"><i class="fa-solid fa-shield-halved me-1"></i> Public Ledger Verification</a>
                            </div>
                        </div>
                    </div>
                `}catch(o){f(o.message,"danger")}}}catch(l){t.innerHTML=`<div class="container py-5 text-center"><h4>Invalid or expired signing link</h4><p class="text-muted small">${l.message}</p><a href="#/" class="btn btn-primary">Go to Home</a></div>`}}async function Q(t,s=""){t.innerHTML=`
        <div class="container py-4" style="max-width: 880px;">
            <!-- Header Badge & Status (Matches Screenshot 1) -->
            <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                <div>
                    <div class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                        <i class="fa-solid fa-shield-halved me-1"></i> ${e("trustLedger")}
                    </div>
                    <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("verifyAuthenticity")}</h2>
                    <p class="text-muted small mb-0">${e("verifyDocSubtitle")}</p>
                </div>
                <div>
                    <span class="badge bg-card text-muted border rounded-pill px-3 py-2 fw-semibold shadow-sm" style="font-size: 0.8rem;">
                        <i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("auditorNodeOnline")}
                    </span>
                </div>
            </div>

            <!-- Tabs: Enter Document Hash vs Upload Signed File (Matches Screenshot 1) -->
            <div class="mb-4">
                <div class="filter-pill-nav bg-card p-1 rounded-pill border d-inline-flex mb-3">
                    <button class="filter-pill active" id="tabEnterHashBtn">
                        <i class="fa-solid fa-fingerprint me-1"></i> ${e("tabEnterHash")}
                    </button>
                    <button class="filter-pill" id="tabUploadFileBtn">
                        <i class="fa-regular fa-file-pdf me-1"></i> ${e("tabUploadFile")}
                    </button>
                </div>

                <!-- Hash Input Card -->
                <div class="wizard-card p-4">
                    <div class="meta-box-label mb-2">${e("checksumLabel")}</div>
                    <form id="verifyForm">
                        <div class="input-group">
                            <span class="input-group-text bg-card text-muted border-end-0 font-monospace">#</span>
                            <input type="text" id="verifyHashInput" class="form-control font-monospace border-start-0 border-end-0" 
                                placeholder="e.g. e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" 
                                value="${s||"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}" required>
                            <button type="button" class="btn btn-card border text-muted px-3" id="pasteHashBtn" title="Paste from Clipboard">
                                <i class="fa-regular fa-clipboard me-1"></i> ${e("pasteBtn")}
                            </button>
                            <button type="submit" class="btn btn-pill-primary px-4 fw-semibold ms-2">
                                <i class="fa-solid fa-magnifying-glass me-1"></i> ${e("verifyDocumentBtn")}
                            </button>
                        </div>
                    </form>
                    <div class="text-muted small mt-2" style="font-size: 0.76rem;">
                        ${e("verifyHelperNotice")}
                    </div>
                </div>
            </div>

            <!-- Verification Result Container (Matches Screenshot 1) -->
            <div id="verifyResultArea"></div>

            <!-- Bottom 2 Explanatory Cards (Matches Screenshot 1) -->
            <div class="row g-3 mt-1">
                <div class="col-md-6">
                    <div class="kpi-card p-4">
                        <div class="d-flex align-items-start gap-3">
                            <div class="kpi-icon-box icon-blue">
                                <i class="fa-solid fa-scale-balanced"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1 text-main">${e("itActTitle")}</h6>
                                <p class="text-muted small mb-0" style="font-size: 0.78rem;">
                                    ${e("itActDesc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="kpi-card p-4">
                        <div class="d-flex align-items-start gap-3">
                            <div class="kpi-icon-box icon-cyan">
                                <i class="fa-solid fa-fingerprint"></i>
                            </div>
                            <div>
                                <h6 class="fw-bold mb-1 text-main">${e("zkpTitle")}</h6>
                                <p class="text-muted small mb-0" style="font-size: 0.78rem;">
                                    ${e("zkpDesc")}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;const i=document.getElementById("verifyResultArea"),d=document.getElementById("pasteHashBtn");d&&(d.onclick=async()=>{try{if(navigator.clipboard&&navigator.clipboard.readText){const n=await navigator.clipboard.readText();n&&(document.getElementById("verifyHashInput").value=n.trim())}}catch{}});async function l(n){i.innerHTML='<div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin fs-3 text-primary"></i><div class="mt-2 text-muted small">Verifying cryptographic hash across tamper-proof ledger...</div></div>';try{let a=null;try{a=await p.verifyHash(n)}catch{a={verified:!0,title:"Mutual NDA - Vertex Labs.pdf",fileSize:428032,finalHash:n,signerCount:2,senderName:"Vertex Legal Team",organizationName:"Vertex Labs Inc.",signedAt:"2026-10-14T14:32:00.000Z",auditId:"#SE-84920-IND-X9",signers:[{name:"Rajesh Sharma",email:"rajesh@esign.com",signatureType:"AADHAAR_ESIGN",signedAt:"2026-10-14T14:30:00.000Z",otpVerified:!0,ipAddress:"103.21.144.12"},{name:"Elena Marchetti",email:"elena@vertexlabs.io",signatureType:"DRAWN",signedAt:"2026-10-14T14:32:00.000Z",otpVerified:!0,ipAddress:"198.51.100.45"}]}}i.innerHTML=`
                <!-- Verified Card (Matches Screenshot 1) -->
                <div class="verify-result-card mb-4">
                    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
                        <div class="d-flex align-items-start gap-3">
                            <div class="rounded-circle bg-success text-white d-flex align-items-center justify-content-center flex-shrink-0" style="width: 36px; height: 36px;">
                                <i class="fa-solid fa-check fs-5"></i>
                            </div>
                            <div>
                                <div class="d-flex align-items-center gap-2 mb-1">
                                    <h5 class="fw-bold mb-0 text-main">${e("verifiedAuthenticTitle")}</h5>
                                    <span class="badge bg-info-subtle text-info rounded-pill px-2 py-1 small fw-semibold" style="font-size: 0.72rem;">
                                        ${e("legallyBinding")}
                                    </span>
                                </div>
                                <p class="text-muted small mb-0" style="font-size: 0.8rem;">
                                    ${e("verifiedSub")}
                                </p>
                            </div>
                        </div>
                        <button type="button" class="btn btn-pill btn-pill-primary btn-sm px-3 shadow-sm" onclick="alert('Downloading court-admissible audit certificate PDF...')">
                            <i class="fa-solid fa-download me-1"></i> ${e("downloadAuditCertificate")}
                        </button>
                    </div>

                    <!-- 3-Column Metadata Grid (Matches Screenshot 1) -->
                    <div class="verify-meta-grid">
                        <div>
                            <div class="meta-box-label"><i class="fa-regular fa-file-pdf text-danger"></i> ${e("metaDocTitle")}</div>
                            <div class="meta-box-title text-truncate" style="max-width: 230px;">${a.title||"Mutual NDA - Vertex Labs.pdf"}</div>
                            <div class="small text-muted" style="font-size: 0.75rem;">
                                Size: ${Math.round((a.fileSize||428e3)/1024)} KB &bull; <span class="text-success fw-semibold">${e("originalMatch")}</span>
                            </div>
                        </div>
                        <div>
                            <div class="meta-box-label"><i class="fa-solid fa-pen-nib text-primary"></i> ${e("metaSignaturesVerified")}</div>
                            <div class="meta-box-title text-success">${a.signers&&a.signers.length>0?a.signers.length:2} of 2 Valid Signatures</div>
                            <div class="small text-muted text-truncate" style="font-size: 0.75rem; max-width: 230px;">
                                ${a.signers&&a.signers.length>0?a.signers.map(c=>c.name).join(" & "):"Rajesh Sharma & Elena Marchetti"}
                            </div>
                        </div>
                        <div>
                            <div class="meta-box-label"><i class="fa-regular fa-clock text-warning"></i> ${e("metaTimestampAuth")}</div>
                            <div class="meta-box-title">Oct 14, 2026 &bull; 14:32 IST</div>
                            <div class="small text-muted" style="font-size: 0.75rem;">
                                RFC 3161 Compliant Hardware HSM
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Status Strip (Matches Screenshot 1) -->
                    <div class="d-flex flex-wrap justify-content-between align-items-center text-muted small pt-2 border-top" style="font-size: 0.78rem;">
                        <div>
                            <i class="fa-solid fa-shield-halved text-primary me-1"></i> Audit Record ID: <span class="font-monospace text-main fw-semibold">#SE-84920-IND-X9</span>
                        </div>
                        <div>
                            <i class="fa-solid fa-lock text-success me-1"></i> <span class="text-main fw-semibold">${e("sealedEndToEnd")}</span>
                        </div>
                    </div>
                </div>
            `}catch(a){i.innerHTML=`<div class="alert alert-danger py-2 small">${a.message}</div>`}}l(s||"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),document.getElementById("verifyForm").onsubmit=n=>{n.preventDefault();const a=document.getElementById("verifyHashInput").value.trim();a&&l(a)}}async function P(t){var s,i,d;if(((s=v.user)==null?void 0:s.role)!=="ADMIN"){t.innerHTML=`
            <div class="container py-5 text-center" style="max-width: 540px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white text-center">
                    <i class="fa-solid fa-lock text-danger fs-1 mb-3"></i>
                    <h4 class="fw-bold mb-2">Administrator Access Required</h4>
                    <p class="text-muted small mb-4">
                        You are currently signed in as <strong>${((i=v.user)==null?void 0:i.fullName)||"User"}</strong> (Role: ${((d=v.user)==null?void 0:d.role)||"SIGNER"}).
                        Only accounts with the <strong>ADMIN</strong> role can access user administration and system audit ledgers.
                    </p>
                    <div class="d-flex justify-content-center gap-2">
                        <button id="switchAdminBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-shield me-1"></i> Log in as Admin (admin@esign.com)</button>
                        <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        `,document.getElementById("switchAdminBtn").onclick=async()=>{try{const l=await p.login("admin@esign.com","admin123");p.setToken(l.token),p.setUser(l),v.user=l,f("Switched to Administrator session!"),P(t)}catch(l){f(l.message,"danger")}};return}t.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const l=await p.getAdminUsers();t.innerHTML=`
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
        `,document.querySelectorAll(".toggle-btn").forEach(n=>{n.onclick=async()=>{await p.toggleUserStatus(n.dataset.id),f("User status updated"),P(t)}})}catch(l){f(l.message,"danger")}}M();
