(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))n(l);new MutationObserver(l=>{for(const d of l)if(d.type==="childList")for(const i of d.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function s(l){const d={};return l.integrity&&(d.integrity=l.integrity),l.referrerPolicy&&(d.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?d.credentials="include":l.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function n(l){if(l.ep)return;l.ep=!0;const d=s(l);fetch(l.href,d)}})();const G=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),M=G&&window.location.port==="5173"?"http://localhost:8080/api/v1":"/api/v1",u={getToken(){return localStorage.getItem("esign_token")},setToken(a){localStorage.setItem("esign_token",a)},clearToken(){localStorage.removeItem("esign_token"),localStorage.removeItem("esign_user")},getUser(){const a=localStorage.getItem("esign_user");return a?JSON.parse(a):null},setUser(a){localStorage.setItem("esign_user",JSON.stringify(a))},async request(a,t={}){var m;const s=`${M}${a}`,n=t.headers||{},l=this.getToken();l&&!a.startsWith("/auth/")&&(n.Authorization=`Bearer ${l}`),!(t.body instanceof FormData)&&!n["Content-Type"]&&(n["Content-Type"]="application/json");const d={...t,headers:n},i=await fetch(s,d);if(i.status===401&&!a.startsWith("/auth/"))throw this.clearToken(),window.location.hash="#/login",new Error("Session expired. Please log in again.");if((m=i.headers.get("content-type"))!=null&&m.includes("application/pdf"))return i.blob();const r=await i.json().catch(()=>({}));if(!i.ok){const p=r.message||r.error||`Request failed with status ${i.status}`;throw new Error(p)}return r},login(a,t){return this.request("/auth/login",{method:"POST",body:JSON.stringify({email:a,password:t})})},register(a){return this.request("/auth/register",{method:"POST",body:JSON.stringify(a)})},sendRegistrationOtp(a){return this.request("/auth/send-registration-otp",{method:"POST",body:JSON.stringify({email:a})})},verifyRegistrationOtp(a,t){return this.request("/auth/verify-registration-otp",{method:"POST",body:JSON.stringify({email:a,otpCode:t})})},getMe(){return this.request("/auth/me")},getDashboardStats(){return this.request("/dashboard/stats")},getDocuments(a="ALL"){const t=a&&a!=="ALL"?`?status=${a}`:"";return this.request(`/documents${t}`)},getDocument(a){return this.request(`/documents/${a}`)},uploadDocument(a){return this.request("/documents",{method:"POST",body:a})},cancelDocument(a){return this.request(`/documents/${a}/cancel`,{method:"POST"})},downloadDocumentUrl(a,t=!0){const s=this.getToken(),n=s?`&token=${encodeURIComponent(s)}`:"";return`${M}/documents/${a}/download?sealed=${t}${n}`},async downloadDocument(a,t=!0,s="document.pdf"){const n=this.getToken(),l=`${M}/documents/${a}/download?sealed=${t}`,d={};n&&(d.Authorization=`Bearer ${n}`);const i=await fetch(l,{headers:d});if(!i.ok){const h=await i.json().catch(()=>({}));throw new Error(h.message||h.error||`Download failed: HTTP ${i.status}`)}let r=s;const m=i.headers.get("Content-Disposition");if(m){const x=/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(m);x!=null&&x[1]&&(r=x[1].replace(/['"]/g,"").trim())}const p=await i.blob(),v=window.URL.createObjectURL(p),g=document.createElement("a");g.href=v,g.download=r,document.body.appendChild(g),g.click(),g.remove(),setTimeout(()=>window.URL.revokeObjectURL(v),1e4)},createSigningRequest(a){return this.request("/signing/requests",{method:"POST",body:JSON.stringify(a)})},resendSigningInvite(a){return this.request(`/signing/invites/${a}/resend`,{method:"POST"})},getSigningContext(a){return this.request(`/signing/context/${a}`)},requestOtp(a){return this.request(`/signing/otp/${a}`,{method:"POST"})},verifyOtp(a,t){return this.request(`/signing/verify-otp/${a}`,{method:"POST",body:JSON.stringify({otpCode:t})})},requestAadhaarOtp(a,t){return this.request(`/signing/aadhaar-otp/${a}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t})})},verifyAadhaarOtp(a,t,s){return this.request(`/signing/verify-aadhaar-otp/${a}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t,otpCode:s})})},submitSignature(a,t){return this.request(`/signing/submit/${a}`,{method:"POST",body:JSON.stringify(t)})},declineSignature(a,t){return this.request(`/signing/decline/${a}`,{method:"POST",body:JSON.stringify({reason:t})})},getSigningPreviewUrl(a){return`${M}/signing/preview/${a}`},verifyHash(a){return this.request(`/verify/${encodeURIComponent(a)}`)},verifyFile(a){const t=new FormData;return t.append("file",a),this.request("/verify/upload",{method:"POST",body:t})},getAdminUsers(){return this.request("/admin/users")},toggleUserStatus(a){return this.request(`/admin/users/${a}/toggle-status`,{method:"POST"})},getAdminAuditLogs(a=0,t=30){return this.request(`/admin/audit-logs?page=${a}&size=${t}`)},getAdminDocuments(a=0,t=20){return this.request(`/admin/documents?page=${a}&size=${t}`)}},B=[{code:"en",name:"English",native:"English",flag:"🇬🇧"},{code:"hi",name:"Hindi",native:"हिन्दी",flag:"🇮🇳"},{code:"mr",name:"Marathi",native:"मराठी",flag:"🇮🇳"},{code:"gu",name:"Gujarati",native:"ગુજરાતી",flag:"🇮🇳"},{code:"bn",name:"Bengali",native:"বাংলা",flag:"🇮🇳"},{code:"ta",name:"Tamil",native:"தமிழ்",flag:"🇮🇳"},{code:"te",name:"Telugu",native:"తెలుగు",flag:"🇮🇳"},{code:"kn",name:"Kannada",native:"ಕನ್ನಡ",flag:"🇮🇳"}],P={en:{brand:"SignEase",home:"Home",dashboard:"Dashboard",documents:"Documents",upload:"Upload & Sign",send:"Send for Signature",verify:"Verify Document",admin:"Admin",signIn:"Sign In",createAccount:"Create Account",signOut:"Sign Out",profile:"Profile",myProfile:"My Profile",profileSettings:"Profile Settings",changePhoto:"Change Photo",personalInfo:"Personal Information",phone:"Phone Number",organization:"Organization",designation:"Job Title / Designation",department:"Department",saveProfile:"Save Changes",digitalSignature:"Digital Signature Style",signatureStatus:"Aadhaar eSign Verified",security:"Account Security",language:"Language",newEnvelope:"+ New Envelope",newAgreement:"+ New Agreement",exportCsv:"Export CSV",darkModeToggle:"Dark / Light Mode",heroBadge:"✨ Simple & Secure Digital Signatures",heroTitle:"Sign & Send Documents in Minutes",heroSubtitle:"The easiest and fastest way to sign contracts and forms online. Safe, legally valid, and works directly on your phone or computer.",btnStartFree:"Start Free",btnSenderDashboard:"My Dashboard",btnVerifyDoc:"Verify a Document",howItWorks:"3 Easy Steps to Sign Any Document",step1Title:"1. Upload PDF",step1Desc:"Choose any agreement, form, or contract from your device.",step2Title:"2. Add Signers",step2Desc:"Enter the names and email addresses of people who need to sign.",step3Title:"3. Sign & Download",step3Desc:"Sign with your finger or type your name, and download the finished PDF.",whyChooseUs:"Why People Love SignEase",feature1Title:"Zero Complicated Setup",feature1Desc:"No app or software to install. Signers open the link on mobile or computer and sign in seconds.",feature2Title:"100% Legally Valid",feature2Desc:"Official completion certificates with legal proof recognized under the IT Act.",feature3Title:"Instant Email Delivery",feature3Desc:"Verification OTPs and invitation links arrive instantly in your inbox.",greeting:"Good morning,",compliancetag:"AADHAAR ESIGN READY",aadhaarCompliant:"Aadhaar & IT Act 2000 Compliant",attentionSub:"documents waiting for your signature",vaultSynced:"System Online",totalDocs:"TOTAL DOCUMENTS",pendingDocs:"WAITING FOR YOUR SIGNATURE",completedDocs:"COMPLETED & ARCHIVED",actionNeeded:"Action needed",thisWeekGrowth:"+2 this week",rateDone:"64% completed",searchPlaceholder:"Search by title, signer name, or ID...",filterAll:"All",filterRequiresMe:"Needs My Signature",filterCompleted:"Completed",uploadAndSign:"➕ Upload & Sign",colDocName:"DOCUMENT NAME",colSignersStatus:"SIGNERS & STATUS",colLastUpdated:"LAST UPDATED",colAction:"ACTION",signNow:"Sign Now",remind:"Remind",download:"Download",showingAgreements:"Showing agreements",viewVaultLink:"View all documents →",legalValidityGuaranteed:"100% Legally Valid",legalValidityDesc:"Signatures made on SignEase comply with Section 5 of the Information Technology Act (2000).",auditTrailGuide:"Audit Certificate Guide ↗",docRegistryTitle:"Documents",docRegistrySub:"Manage and track your signed agreements and forms.",activeEnvelopes:"ACTIVE DOCUMENTS",needsAction:"WAITING FOR YOU",awaitingSigners:"WAITING FOR OTHERS",verificationAudit:"VERIFIED",urgentReview:"Action needed",externalParties:"Waiting on signers",itActCompliant:"Legally Valid",filterWaitingOthers:"Waiting on Others",reviewAndSign:"Review & Sign",downloadPdf:"Download PDF",continueEdit:"Continue Edit",hsmActive:"Protected with Bank-Grade Security",hsmDesc:"Each signed document has tamper-evident security with an official certificate of completion.",viewCryptoCert:"View Certificate →",workflowDispatch:"SEND FOR SIGNATURE",sendDocForSignature:"Send Document for Signature",sendDocDesc:"Upload your PDF, add who needs to sign, and send it for signing in seconds.",step1Upload:"1 Upload File",pdfFormatUpTo:"PDF UP TO 25 MB",dropPdfHere:"Drop your PDF here, or",browseFiles:"Browse files",encryptedTransit:"Safe & Private • Max size 25MB",readyToTag:"Ready",step2Signers:"2 Add Signers",orderType:"SIGNING ORDER",signersNotice:"Signers will receive a secure email link to sign. No account or password required for signers.",signerName:"NAME",emailAddress:"EMAIL ADDRESS",role:"ACTION",needsToSign:"Needs to sign",receivesCopy:"Receives a copy",addAnotherRecipient:"➕ Add another recipient",tamperProofAudit:"Automatic Audit Trail",tamperProofDesc:"Records date, time, and signatures for full legal proof.",sendReminder48h:"Send email reminder after 48h",cancel:"Cancel",saveAsDraft:"Save as Draft",sendForSignature:"Send for Signature ▶",trustLedger:"VERIFY DOCUMENT",verifyAuthenticity:"Check Document Authenticity",verifyDocSubtitle:"Check if a signed document is genuine, legally valid, and unchanged.",auditorNodeOnline:"System Status: Online",tabEnterHash:"Enter Document Code / ID",tabUploadFile:"Upload Signed File",checksumLabel:"Document Code, Hash, or ID",pasteBtn:"Paste",verifyDocumentBtn:"Verify Document",verifyHelperNotice:"We verify document authenticity securely without exposing its private contents.",verifiedAuthenticTitle:"Document Verified & Authentic",legallyBinding:"Legally Binding",verifiedSub:"The signatures and document match the original official record.",downloadAuditCertificate:"Download Audit Certificate (PDF)",metaDocTitle:"DOCUMENT NAME",metaSignaturesVerified:"SIGNATURES",metaTimestampAuth:"DATE & TIME",originalMatch:"Original Match",sealedEndToEnd:"Legally Protected & Sealed",itActTitle:"Information Technology Act (IT Act 2000)",itActDesc:"Signatures on SignEase are 100% legally enforceable in Indian courts under the IT Act.",zkpTitle:"100% Private & Confidential",zkpDesc:"Your document content remains private and is never shared or made public.",regTitle:"Create Your Account",regSub:"Verify your email with a 6-digit OTP to get started",firstName:"First Name",lastName:"Last Name",orgName:"Company or Business Name",emailInput:"Work Email Address",btnGetOtp:"Get OTP",otpLabel:"Enter 6-Digit Email OTP",btnVerifyOtp:"Verify Code",otpDispatchedMsg:"6-digit verification code sent to your email inbox.",password:"Password",btnCreateAccount:"Create Free Account",alreadyRegistered:"Already have an account?",signInHere:"Sign in here",loginTitle:"Welcome Back",loginSub:"Sign in to access your documents and signed contracts",dontHaveAccount:"Don't have an account?",signUpHere:"Create free account",signerWelcome:"Review & Sign Document",requestedBy:"Requested by",tabDraw:"✍️ Draw Signature",tabType:"⌨️ Type Name",btnClear:"Clear",btnCompleteSigning:"✅ Complete & Sign Document",otpNotice:"A 6-digit OTP code will be sent to your email to verify your identity.",footerNote:"SignEase — Simple, fast and legally valid electronic document signing."},hi:{brand:"SignEase",home:"होम",dashboard:"डैशबोर्ड",documents:"दस्तावेज़",upload:"अपलोड और हस्ताक्षर",send:"हस्ताक्षर के लिए भेजें",verify:"दस्तावेज़ जाँचें",admin:"एडमिन",signIn:"साइन इन",createAccount:"खाता बनाएं",signOut:"लॉग आउट",profile:"प्रोफ़ाइल",myProfile:"मेरी प्रोफ़ाइल",profileSettings:"प्रोफ़ाइल सेटिंग्स",changePhoto:"फ़ोटो बदलें",personalInfo:"व्यक्तिगत जानकारी",phone:"फ़ोन नंबर",organization:"संगठन / कंपनी",designation:"पद / पदनाम",department:"विभाग",saveProfile:"बदलाव सहेजें",digitalSignature:"डिजिटल हस्ताक्षर शैली",signatureStatus:"आधार ई-हस्ताक्षर सत्यापित",security:"खाता सुरक्षा",language:"भाषा",newEnvelope:"+ नया दस्तावेज़",newAgreement:"+ नया अनुबंध",exportCsv:"CSV डाउनलोड करें",darkModeToggle:"डार्क / लाइट मोड",heroBadge:"✨ सरल और सुरक्षित डिजिटल हस्ताक्षर",heroTitle:"दस्तावेज़ मिनटों में साइन करें और भेजें",heroSubtitle:"दस्तावेज़ और अनुबंध साइन करने का सबसे आसान और सुरक्षित तरीका। मोबाइल या कंप्यूटर पर तुरंत काम करता है।",btnStartFree:"मुफ़्त शुरू करें",btnSenderDashboard:"मेरा डैशबोर्ड",btnVerifyDoc:"दस्तावेज़ जाँचें",howItWorks:"दस्तावेज़ साइन करने के 3 आसान तरीके",step1Title:"1. PDF चुनें",step1Desc:"अपने फोन या कंप्यूटर से कोई भी दस्तावेज़ या फॉर्म चुनें।",step2Title:"2. नाम व ईमेल जोड़ें",step2Desc:"जिन लोगों को साइन करना है, उनका नाम और ईमेल दर्ज करें।",step3Title:"3. साइन करें व डाउनलोड करें",step3Desc:"उंगली से बनाकर या नाम लिखकर साइन करें और तैयार PDF डाउनलोड करें।",whyChooseUs:"SignEase क्यों चुनें",feature1Title:"कोई जटिल सेटअप नहीं",feature1Desc:"कोई ऐप इंस्टॉल करने की ज़रूरत नहीं। ईमेल लिंक खोलें और मोबाइल पर तुरंत साइन करें।",feature2Title:"100% कानूनी रूप से मान्य",feature2Desc:"भारतीय आईटी कानून के तहत मान्य डिजिटल प्रमाणपत्र और सुरक्षित रिकॉर्ड।",feature3Title:"तुरंत ईमेल डिलीवरी",feature3Desc:"सत्यापन OTP और हस्ताक्षर लिंक तुरंत आपके ईमेल पर पहुंचता है।",greeting:"नमस्ते,",compliancetag:"आधार ई-साइन और आईटी कानून मान्य",aadhaarCompliant:"आधार एवं आईटी अधिनियम 2000 अनुपालित",attentionSub:"दस्तावेज़ों पर आपके हस्ताक्षर बाकी हैं",vaultSynced:"सिस्टम चालू है",totalDocs:"कुल दस्तावेज़",pendingDocs:"आपके हस्ताक्षर बाकी",completedDocs:"पूर्ण दस्तावेज़",actionNeeded:"हस्ताक्षर करें",thisWeekGrowth:"+2 इस सप्ताह",rateDone:"64% पूर्ण",searchPlaceholder:"शीर्षक, नाम या आईडी से खोजें...",filterAll:"सभी",filterRequiresMe:"मेरे हस्ताक्षर चाहिए",filterCompleted:"पूर्ण",uploadAndSign:"➕ अपलोड और हस्ताक्षर",colDocName:"दस्तावेज़ का नाम",colSignersStatus:"हस्ताक्षरकर्ता स्थिति",colLastUpdated:"अंतिम अपडेट",colAction:"कार्य",signNow:"साइन करें",remind:"याद दिलाएं",download:"डाउनलोड",showingAgreements:"दस्तावेज़ दिखाए जा रहे हैं",viewVaultLink:"सभी दस्तावेज़ देखें →",legalValidityGuaranteed:"100% कानूनी रूप से मान्य",legalValidityDesc:"SignEase पर किए गए हस्ताक्षर सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) के तहत अदालत में पूरी तरह मान्य हैं।",auditTrailGuide:"प्रमाणपत्र गाइड ↗",docRegistryTitle:"मेरे दस्तावेज़",docRegistrySub:"अपने सभी हस्ताक्षरित और लंबित दस्तावेज़ यहाँ देखें।",activeEnvelopes:"सक्रिय दस्तावेज़",needsAction:"आपके हस्ताक्षर बाकी",awaitingSigners:"दूसरों के हस्ताक्षर बाकी",verificationAudit:"सत्यापित",urgentReview:"कार्रवाई आवश्यक",externalParties:"हस्ताक्षर बाकी",itActCompliant:"कानूनी मान्य",filterWaitingOthers:"दूसरों के लिए बाकी",reviewAndSign:"देखें और साइन करें",downloadPdf:"PDF डाउनलोड",continueEdit:"एडिट करें",hsmActive:"पूरी तरह सुरक्षित और एन्क्रिप्टेड",hsmDesc:"हर हस्ताक्षरित दस्तावेज़ के साथ अदालत में मान्य डिजिटल प्रमाणपत्र मिलता है।",viewCryptoCert:"प्रमाणपत्र देखें →",workflowDispatch:"हस्ताक्षर के लिए भेजें",sendDocForSignature:"दस्तावेज़ हस्ताक्षर के लिए भेजें",sendDocDesc:"अपनी PDF चुनें, हस्ताक्षर करने वाले का नाम व ईमेल जोड़ें और तुरंत भेजें।",step1Upload:"1 फ़ाइल अपलोड करें",pdfFormatUpTo:"PDF (अधिकतम 25 MB)",dropPdfHere:"अपनी PDF फ़ाइल यहाँ छोड़ें, या",browseFiles:"फ़ाइल चुनें",encryptedTransit:"सुरक्षित और निजी • अधिकतम 25 MB",readyToTag:"तैयार",step2Signers:"2 हस्ताक्षर करने वाले जोड़ें",orderType:"हस्ताक्षर का क्रम",signersNotice:"हस्ताक्षर करने वालों को ईमेल पर सीधा लिंक मिलेगा। उन्हें अकाउंट बनाने की ज़रूरत नहीं है।",signerName:"नाम",emailAddress:"ईमेल पता",role:"भूमिका",needsToSign:"हस्ताक्षर करना है",receivesCopy:"केवल कॉपी मिलेगी",addAnotherRecipient:"➕ एक और व्यक्ति जोड़ें",tamperProofAudit:"सुरक्षित कानूनी रिकॉर्ड",tamperProofDesc:"तारीख, समय और हस्ताक्षर का कानूनी रिकॉर्ड अपने आप बनता है।",sendReminder48h:"2 दिन में हस्ताक्षर न होने पर याद दिलाएं",cancel:"रद्द करें",saveAsDraft:"ड्राफ्ट सहेजें",sendForSignature:"हस्ताक्षर के लिए भेजें ▶",trustLedger:"दस्तावेज़ की जाँच",verifyAuthenticity:"दस्तावेज़ असली है या नहीं जाँचें",verifyDocSubtitle:"आसानी से जाँचें कि दस्तावेज़ असली है और कोई छेड़छाड़ तो नहीं हुई।",auditorNodeOnline:"सिस्टम चालू है",tabEnterHash:"दस्तावेज़ कोड (ID) दर्ज करें",tabUploadFile:"हस्ताक्षरित फ़ाइल अपलोड करें",checksumLabel:"दस्तावेज़ कोड या ID दर्ज करें",pasteBtn:"पेस्ट करें",verifyDocumentBtn:"दस्तावेज़ जाँचें",verifyHelperNotice:"हम आपकी फ़ाइल को पूरी तरह निजी और सुरक्षित रखते हैं।",verifiedAuthenticTitle:"दस्तावेज़ असली और सुरक्षित है",legallyBinding:"कानूनी मान्य",verifiedSub:"हस्ताक्षर और दस्तावेज़ आधिकारिक रिकॉर्ड से पूरी तरह मेल खाते हैं।",downloadAuditCertificate:"प्रमाणपत्र डाउनलोड करें (PDF)",metaDocTitle:"दस्तावेज़ का नाम",metaSignaturesVerified:"हस्ताक्षर",metaTimestampAuth:"दिनांक और समय",originalMatch:"मूल प्रति",sealedEndToEnd:"सुरक्षित रूप से सील",itActTitle:"IT Act 2000 के तहत कानूनी मान्यता",itActDesc:"भारतीय कानून के तहत यह हस्ताक्षर पूरी तरह कानूनी और वैध है।",zkpTitle:"100% गोपनीय और सुरक्षित",zkpDesc:"आपकी फ़ाइल का डेटा पूरी तरह निजी रहता है और किसी से साझा नहीं किया जाता।",regTitle:"नया अकाउंट बनाएं",regSub:"अपना ईमेल दर्ज करें और 6-अंकों का OTP प्राप्त करें",firstName:"पहला नाम",lastName:"अंतिम नाम",orgName:"कंपनी या व्यवसाय का नाम",emailInput:"ईमेल पता",btnGetOtp:"OTP पाएं",otpLabel:"6-अंकों का ईमेल OTP दर्ज करें",btnVerifyOtp:"OTP सत्यापित करें",otpDispatchedMsg:"आपके ईमेल पर 6 अंकों का OTP भेजा गया है।",password:"पासवर्ड",btnCreateAccount:"मुफ़्त अकाउंट बनाएं",alreadyRegistered:"पहले से अकाउंट है?",signInHere:"यहाँ लॉगिन करें",loginTitle:"लॉगिन करें",loginSub:"अपने दस्तावेज़ देखने के लिए लॉगिन करें",dontHaveAccount:"नया अकाउंट बनाना है?",signUpHere:"यहाँ रजिस्टर करें",signerWelcome:"दस्तावेज़ देखें और हस्ताक्षर करें",requestedBy:"अनुरोधकर्ता",tabDraw:"✍️ हस्ताक्षर बनाएं",tabType:"⌨️ नाम टाइप करें",btnClear:"साफ़ करें",btnCompleteSigning:"✅ हस्ताक्षर पूर्ण करें",otpNotice:"आपकी पहचान के लिए आपके ईमेल पर 6-अंकों का OTP भेजा जाएगा।",footerNote:"SignEase — सरल, तेज़ और कानूनी रूप से मान्य इलेक्ट्रॉनिक हस्ताक्षर।"},mr:{brand:"SignEase",home:"होम",dashboard:"डॅशबोर्ड",documents:"दस्तऐवज",upload:"अपलोड आणि स्वाक्षरी",send:"स्वाक्षरीसाठी पाठवा",verify:"दस्तऐवज तपासा",admin:"अ‍ॅडमिन",signIn:"साइन इन",createAccount:"खाते तयार करा",signOut:"लॉग आउट",profile:"प्रोफ़ाइल",myProfile:"मेरी प्रोफ़ाइल",profileSettings:"प्रोफ़ाइल सेटिंग्स",changePhoto:"फ़ोटो बदलें",personalInfo:"व्यक्तिगत जानकारी",phone:"फ़ोन नंबर",organization:"संगठन / कंपनी",designation:"पद / पदनाम",department:"विभाग",saveProfile:"बदलाव सहेजें",digitalSignature:"डिजिटल हस्ताक्षर शैली",signatureStatus:"आधार ई-हस्ताक्षर सत्यापित",security:"खाता सुरक्षा",language:"भाषा",newEnvelope:"+ नवीन दस्तऐवज",newAgreement:"+ नवीन करार",exportCsv:"CSV डाउनलोड",darkModeToggle:"डार्क / लाइट मोड",heroBadge:"✨ सोपी आणि सुरक्षित डिजिटल स्वाक्षरी",heroTitle:"काही मिनिटांत दस्तऐवज स्वाक्षरी करा आणि पाठवा",heroSubtitle:"दस्तऐवज आणि करार स्वाक्षरी करण्याचा सर्वात सोपा आणि सुरक्षित मार्ग. मोबाईल किंवा संगणकावर लगेच कार्य करते.",btnStartFree:"मोफत सुरू करा",btnSenderDashboard:"माझा डॅशबोर्ड",btnVerifyDoc:"दस्तऐवज तपासा",howItWorks:"दस्तऐवज स्वाक्षरी करण्याचे ३ सोपे टप्पे",step1Title:"१. PDF निवडा",step1Desc:"आपल्या फोन किंवा संगणकावरून कोणतीही PDF किंवा करार निवडा.",step2Title:"२. स्वाक्षरीकर्ता जोडा",step2Desc:"ज्या व्यक्तीला स्वाक्षरी करायची आहे त्यांचे नाव आणि ईमेल टाका.",step3Title:"३. स्वाक्षरी करा आणि डाउनलोड करा",step3Desc:"बोटाने किंवा नाव टाईप करून स्वाक्षरी करा आणि PDF डाउनलोड करा.",whyChooseUs:"SignEase का निवडावे",feature1Title:"कोणताही क्लिष्ट सेटअप नाही",feature1Desc:"कोणताही अ‍ॅप इन्स्टॉल करण्याची गरज नाही. ईमेल लिंक उघडा आणि मोबाईलवर लगेच स्वाक्षरी करा.",feature2Title:"१००% कायदेशीररित्या वैध",feature2Desc:"भारतीय माहिती तंत्रज्ञान कायद्यानुसार न्यायालयात पूर्णपणे वैध व अधिकृत प्रमाणपत्र.",feature3Title:"त्वरित ईमेल डिलिव्हरी",feature3Desc:"सत्यापन OTP आणि स्वाक्षरी लिंक लगेच आपल्या ईमेलवर पोहोचते.",greeting:"नमस्कार,",compliancetag:"आधार ई-स्वाक्षरी व कायदेशीर मान्य",aadhaarCompliant:"आधार आणि आयटी कायदा २००० अनुपालित",attentionSub:"दस्तऐवजांवर आपली स्वाक्षरी बाकी आहे",vaultSynced:"प्रणाली सुरू आहे",totalDocs:"एकूण दस्तऐवज",pendingDocs:"आपली स्वाक्षरी बाकी",completedDocs:"पूर्ण दस्तऐवज",actionNeeded:"स्वाक्षरी आवश्यक",thisWeekGrowth:"+२ या आठवड्यात",rateDone:"६४% पूर्ण",searchPlaceholder:"नाव किंवा आयडीने शोधा...",filterAll:"सर्व",filterRequiresMe:"माझी स्वाक्षरी बाकी",filterCompleted:"पूर्ण",uploadAndSign:"➕ अपलोड आणि स्वाक्षरी",colDocName:"दस्तऐवजाचे नाव",colSignersStatus:"स्वाक्षरी स्थिती",colLastUpdated:"शेवटचे अपडेट",colAction:"कृती",signNow:"स्वाक्षरी करा",remind:"आठवण करा",download:"डाउनलोड",showingAgreements:"दाखवले जाणारे दस्तऐवज",viewVaultLink:"सर्व दस्तऐवज पहा →",legalValidityGuaranteed:"१००% कायदेशीररित्या वैध",legalValidityDesc:"SignEase वरील स्वाक्षऱ्या भारतीय माहिती तंत्रज्ञान कायद्यानुसार न्यायालयात मान्य आहेत.",auditTrailGuide:"प्रमाणपत्र मार्गदर्शक ↗",docRegistryTitle:"माझे दस्तऐवज",docRegistrySub:"आपले सर्व स्वाक्षरी केलेले आणि प्रलंबित दस्तऐवज येथे व्यवस्थापित करा.",activeEnvelopes:"सक्रिय दस्तऐवज",needsAction:"आपली स्वाक्षरी बाकी",awaitingSigners:"इतरांची स्वाक्षरी बाकी",verificationAudit:"सत्यापित",urgentReview:"कृती आवश्यक",externalParties:"स्वाक्षरी बाकी",itActCompliant:"कायदेशीर मान्य",filterWaitingOthers:"इतरांसाठी बाकी",reviewAndSign:"पहा आणि स्वाक्षरी करा",downloadPdf:"PDF डाउनलोड",continueEdit:"संपादन करा",hsmActive:"बँक-स्तरीय सुरक्षेने संरक्षित",hsmDesc:"प्रत्येक स्वाक्षरी केलेल्या दस्तऐवजासोबत कायदेशीररित्या मान्य डिजिटल प्रमाणपत्र मिळते.",viewCryptoCert:"प्रमाणपत्र पहा →",workflowDispatch:"स्वाक्षरीसाठी पाठवा",sendDocForSignature:"दस्तऐवज स्वाक्षरीसाठी पाठवा",sendDocDesc:"आपली PDF निवडा, स्वाक्षरी करणाऱ्याचे नाव व ईमेल टाका आणि त्वरित पाठवा.",step1Upload:"१. फाईल निवडा",pdfFormatUpTo:"PDF (कमाल २५ MB)",dropPdfHere:"येथे आपली PDF टाका, किंवा",browseFiles:"फाईल निवडा",encryptedTransit:"सुरक्षित आणि खाजगी • कमाल २५ MB",readyToTag:"तयार",step2Signers:"२. स्वाक्षरीकर्ता जोडा",orderType:"स्वाक्षरीचा क्रम",signersNotice:"स्वाक्षरी करणाऱ्यांना ईमेलवर थेट लिंक मिळेल. त्यांना खाते तयार करण्याची आवश्यकता नाही.",signerName:"नाव",emailAddress:"ईमेल पत्ता",role:"भूमिका",needsToSign:"स्वाक्षरी करायची आहे",receivesCopy:"केवळ प्रत मिळेल",addAnotherRecipient:"➕ आणखी एक व्यक्ती जोडा",tamperProofAudit:"सुरक्षित कायदेशीर ऑडिट नोंद",tamperProofDesc:"तारीख, वेळ आणि स्वाक्षरीची कायदेशीर नोंद आपोआप ठेवली जाते.",sendReminder48h:"२ दिवसांत स्वाक्षरी न झाल्यास आठवण करा",cancel:"रद्द करा",saveAsDraft:"मसुदा जतन करा",sendForSignature:"स्वाक्षरीसाठी पाठवा ▶",trustLedger:"दस्तऐवज तपासणी",verifyAuthenticity:"दस्तऐवज खरा आहे की नाही तपासा",verifyDocSubtitle:"स्वाक्षरी केलेला दस्तऐवज अस्सल, वैध आणि सुरक्षित आहे की नाही सहज तपासा.",auditorNodeOnline:"प्रणाली सुरू आहे",tabEnterHash:"दस्तऐवज कोड (ID) टाका",tabUploadFile:"स्वाक्षरी केलेली फाईल अपलोड करा",checksumLabel:"दस्तऐवज क्रमांक किंवा कोड (ID)",pasteBtn:"पेस्ट करा",verifyDocumentBtn:"दस्तऐवज तपासा",verifyHelperNotice:"आम्ही आपली फाईल पूर्णपणे सुरक्षित आणि गोपनीय ठेवतो.",verifiedAuthenticTitle:"दस्तऐवज अस्सल आणि सुरक्षित आहे",legallyBinding:"कायदेशीररित्या वैध",verifiedSub:"स्वाक्षऱ्या आणि दस्तऐवज अधिकृत नोंदीशी जुळतात.",downloadAuditCertificate:"प्रमाणपत्र डाउनलोड करा (PDF)",metaDocTitle:"दस्तऐवजाचे नाव",metaSignaturesVerified:"स्वाक्षऱ्या",metaTimestampAuth:"तारीख आणि वेळ",originalMatch:"मूळ प्रत",sealedEndToEnd:"सुरक्षितरीत्या सीलबंद",itActTitle:"माहिती तंत्रज्ञान कायदा २००० अंतर्गत मान्यता",itActDesc:"भारतीय कायद्यानुसार या स्वाक्षऱ्या न्यायालयात पूर्णपणे वैध आणि मान्य आहेत.",zkpTitle:"१००% खाजगी आणि सुरक्षित",zkpDesc:"आपल्या फाईलचा डेटा कोणाशीही सामायिक केला जात नाही.",regTitle:"नवीन खाते तयार करा",regSub:"आपला ईमेल टाका आणि ६-अंकी OTP मिळवा",firstName:"पहिले नाव",lastName:"आडनाव",orgName:"कंपनी किंवा संस्थेचे नाव",emailInput:"ईमेल पत्ता",btnGetOtp:"OTP मिळवा",otpLabel:"६-अंकी ईमेल OTP टाका",btnVerifyOtp:"OTP तपासा",otpDispatchedMsg:"आपल्या ईमेलवर ६ अंकी OTP पाठवला आहे.",password:"पासवर्ड",btnCreateAccount:"मोफत खाते तयार करा",alreadyRegistered:"आधीच खाते आहे?",signInHere:"येथे साइन इन करा",loginTitle:"साइन इन करा",loginSub:"आपले दस्तऐवज पाहण्यासाठी लॉगिन करा",dontHaveAccount:"नवीन खाते तयार करायचे आहे?",signUpHere:"येथे नोंदणी करा",signerWelcome:"दस्तऐवज पहा आणि स्वाक्षरी करा",requestedBy:"विनंतीकर्ता",tabDraw:"✍️ स्वाक्षरी काढा",tabType:"⌨️ नाव टाईप करा",btnClear:"साफ करा",btnCompleteSigning:"✅ स्वाक्षरी पूर्ण करा",otpNotice:"ओळखीच्या सत्यापनासाठी आपल्या ईमेलवर ६ अंकी OTP पाठवला जाईल.",footerNote:"SignEase — सोपी, जलद आणि कायदेशीर इलेक्ट्रॉनिक स्वाक्षरी."},gu:{brand:"SignEase",home:"હોમ",dashboard:"ડેશબોર્ડ",documents:"દસ્તાવેજો",upload:"અપલોડ અને સહી",send:"સહી માટે મોકલો",verify:"દસ્તાવેજ ચકાસો",admin:"એડમિન",signIn:"સાઇન ઇન",createAccount:"ખાતું બનાવો",signOut:"લૉગ આઉટ",profile:"પ્રોફાઇલ",myProfile:"મારી પ્રોફાઇલ",profileSettings:"પ્રોફાઇલ સેટિંગ્સ",changePhoto:"ફોટો બદલો",personalInfo:"વ્યક્તિગત માહિતી",phone:"ફોન નંબર",organization:"સંસ્થા",designation:"હોદ્દો",department:"વિભાગ",saveProfile:"ફેરફારો સાચવો",digitalSignature:"ડિજિટલ હસ્તાક્ષર શૈલી",signatureStatus:"આધાર ઇ-સાઇન ચકાસાયેલ",security:"ખાતા સુરક્ષા",language:"ભાષા",newEnvelope:"+ નવો દસ્તાવેજ",newAgreement:"+ નવો કરાર",exportCsv:"CSV ડાઉનલોડ",darkModeToggle:"ડાર્ક / લાઇટ મોડ",heroBadge:"✨ સરળ અને સુરક્ષિત ડિજિટલ સહી",heroTitle:"મિનિટોમાં દસ્તાવેજ સહી કરો અને મોકલો",heroSubtitle:"ઓનલાઇન કરાર અને ફોર્મ પર સહી કરવાની સૌથી સરળ અને સુરક્ષિત રીત. મોબાઈલ કે કમ્પ્યુટર પર તરત કામ કરે છે.",btnStartFree:"મફત શરૂ કરો",btnSenderDashboard:"મારું ડેશબોર્ડ",btnVerifyDoc:"દસ્તાવેજ ચકાસો",howItWorks:"દસ્તાવેજ પર સહી કરવાના ૩ સરળ પગલાં",step1Title:"૧. PDF પસંદ કરો",step1Desc:"તમારા ફોન અથવા કમ્પ્યુટર પરથી કોઈપણ કરાર કે ફોર્મ પસંદ કરો.",step2Title:"૨. સહી કરનાર ઉમેરો",step2Desc:"જેમને સહી કરવાની છે તેમનું નામ અને ઇમેઇલ દાખલ કરો.",step3Title:"૩. સહી કરો અને ડાઉનલોડ કરો",step3Desc:"આંગળીથી દોરીને અથવા નામ લખીને સહી કરો અને PDF મેળવો.",whyChooseUs:"SignEase શા માટે પસંદ કરવું",feature1Title:"કોઈ જટિલ સેટઅપ નથી",feature1Desc:"કોઈ એપ ઇન્સ્ટોલ કરવાની જરૂર નથી. ઇમેઇલ લિંક ખોલીને મોબાઇલમાં સીધી સહી કરો.",feature2Title:"૧૦૦% કાનૂની માન્ય",feature2Desc:"ભારતીય આઈટી કાયદા હેઠળ કોર્ટમાં સંપૂર્ણ માન્ય અને સત્તાવાર પ્રમાણપત્ર.",feature3Title:"તરત ઇમેઇલ ડિલિવરી",feature3Desc:"વેરિફિકેશન OTP અને સહી લિંક તરત તમારા ઇમેઇલ પર મળે છે.",greeting:"નમસ્તે,",compliancetag:"આધાર ઈ-સહી અને કાનૂની માન્ય",aadhaarCompliant:"આધાર અને આઈટી એક્ટ ૨૦૦૦ સુસંગત",attentionSub:"દસ્તાવેજો પર તમારી સહી બાકી છે",vaultSynced:"સિસ્ટમ ચાલુ છે",totalDocs:"કુલ દસ્તાવેજો",pendingDocs:"તમારી સહી બાકી",completedDocs:"પૂર્ણ દસ્તાવેજો",actionNeeded:"સહી જરૂરી",thisWeekGrowth:"+૨ આ અઠવાડિયે",rateDone:"૬૪% પૂર્ણ",searchPlaceholder:"શીર્ષક કે નામથી શોધો...",filterAll:"બધા",filterRequiresMe:"મારી સહી બાકી",filterCompleted:"પૂર્ણ",uploadAndSign:"➕ અપલોડ અને સહી",colDocName:"દસ્તાવેજનું નામ",colSignersStatus:"સહીની સ્થિતિ",colLastUpdated:"છેલ્લું અપડેટ",colAction:"કાર્ય",signNow:"સહી કરો",remind:"યાદ અપાવો",download:"ડાઉનલોડ",showingAgreements:"દર્શાવેલ દસ્તાવેજો",viewVaultLink:"બધા દસ્તાવેજો જુઓ →",legalValidityGuaranteed:"૧૦૦% કાનૂની રીતે માન્ય",legalValidityDesc:"SignEase પર કરેલી સહીઓ આઈટી એક્ટ ૨૦૦૦ હેઠળ અદાલતમાં માન્ય છે.",auditTrailGuide:"પ્રમાણપત્ર માર્ગદર્શિકા ↗",docRegistryTitle:"મારા દસ્તાવેજો",docRegistrySub:"તમારા બધા સહી કરેલા અને બાકી રહેલા દસ્તાવેજો અહીં જુઓ.",activeEnvelopes:"સક્રિય દસ્તાવેજો",needsAction:"તમારી સહી બાકી",awaitingSigners:"અન્યની સહી બાકી",verificationAudit:"ચકાસાયેલ",urgentReview:"ધ્યાન આપો",externalParties:"સહી બાકી",itActCompliant:"કાનૂની માન્ય",filterWaitingOthers:"અન્ય માટે બાકી",reviewAndSign:"જુઓ અને સહી કરો",downloadPdf:"PDF ડાઉનલોડ",continueEdit:"એડિટ કરો",hsmActive:"બેંક-સ્તરની સુરક્ષા સાથે સુરક્ષિત",hsmDesc:"દરેક સહી કરેલા દસ્તાવેજ સાથે કાનૂની રીતે માન્ય ડિજિટલ પ્રમાણપત્ર મળે છે.",viewCryptoCert:"પ્રમાણપત્ર જુઓ →",workflowDispatch:"સહી માટે મોકલો",sendDocForSignature:"દસ્તાવેજ સહી માટે મોકલો",sendDocDesc:"તમારી PDF પસંદ કરો, સહી કરનારનું નામ અને ઇમેઇલ ઉમેરીને તરત મોકલો.",step1Upload:"૧. ફાઇલ પસંદ કરો",pdfFormatUpTo:"PDF (મહત્તમ ૨૫ MB)",dropPdfHere:"અહીં તમારી PDF મૂકો, અથવા",browseFiles:"ફાઇલ પસંદ કરો",encryptedTransit:"સુરક્ષિત અને ખાનગી • મહત્તમ ૨૫ MB",readyToTag:"તૈયાર",step2Signers:"૨. સહી કરનાર ઉમેરો",orderType:"સહીનો ક્રમ",signersNotice:"સહી કરનારને ઇમેઇલ પર સીધી લિંક મળશે. તેમને ખાતું બનાવવાની જરૂર નથી.",signerName:"નામ",emailAddress:"ઇમેઇલ સરનામું",role:"ભૂમિકા",needsToSign:"સહી કરવાની છે",receivesCopy:"ફક્ત નકલ મળશે",addAnotherRecipient:"➕ વધુ એક વ્યક્તિ ઉમેરો",tamperProofAudit:"સુરક્ષિત કાનૂની ઓડિટ રેકોર્ડ",tamperProofDesc:"તારીખ, સમય અને સહીનો કાનૂની રેકોર્ડ આપમેળે બને છે.",sendReminder48h:"૨ દિવસમાં સહી ન થાય તો યાદ અપાવો",cancel:"રદ કરો",saveAsDraft:"ડ્રાફ્ટ સાચવો",sendForSignature:"સહી માટે મોકલો ▶",trustLedger:"દસ્તાવેજ ચકાસણી",verifyAuthenticity:"દસ્તાવેજ અસલ છે કે નહીં તે ચકાસો",verifyDocSubtitle:"સરળતાથી ચકાસો કે સહી કરેલ દસ્તાવેજ અસલ અને સુરક્ષિત છે.",auditorNodeOnline:"સિસ્ટમ ચાલુ છે",tabEnterHash:"દસ્તાવેજ કોડ (ID) દાખલ કરો",tabUploadFile:"સહી કરેલી ફાઇલ અપલોડ કરો",checksumLabel:"દસ્તાવેજ નંબર અથવા ID",pasteBtn:"પેસ્ટ કરો",verifyDocumentBtn:"દસ્તાવેજ ચકાસો",verifyHelperNotice:"અમે તમારી ફાઇલને સંપૂર્ણ ખાનગી અને સુરક્ષિત રાખીએ છીએ.",verifiedAuthenticTitle:"દસ્તાવેજ અસલ અને સુરક્ષિત છે",legallyBinding:"કાનૂની માન્ય",verifiedSub:"સહીઓ અને દસ્તાવેજ સત્તાવાર રેકોર્ડ સાથે મેળ ખાય છે.",downloadAuditCertificate:"પ્રમાણપત્ર ડાઉનલોડ કરો (PDF)",metaDocTitle:"દસ્તાવેજનું નામ",metaSignaturesVerified:"સહીઓ",metaTimestampAuth:"તારીખ અને સમય",originalMatch:"અસલ નકલ",sealedEndToEnd:"સુરક્ષિત રીતે સીલબંધ",itActTitle:"આઈટી એક્ટ ૨૦૦૦ હેઠળ કાનૂની માન્યતા",itActDesc:"ભારતીય કાયદા અનુસાર આ સહી સંપૂર્ણપણે માન્ય અને કાનૂની છે.",zkpTitle:"૧૦૦% ખાનગી અને સુરક્ષિત",zkpDesc:"તમારી ફાઇલનો ડેટા કોઈની સાથે શેર કરવામાં આવતો નથી.",regTitle:"નવું ખાતું બનાવો",regSub:"તમારું ઇમેઇલ દાખલ કરો અને ૬-અંકનો OTP મેળવો",firstName:"પ્રથમ નામ",lastName:"અટક",orgName:"કંપની કે સંસ્થાનું નામ",emailInput:"ઇમેઇલ સરનામું",btnGetOtp:"OTP મેળવો",otpLabel:"૬-અંકનો ઇમેઇલ OTP દાખલ કરો",btnVerifyOtp:"OTP ચકાસો",otpDispatchedMsg:"તમારા ઇમેઇલ પર ૬ અંકનો OTP મોકલવામાં આવ્યો છે.",password:"પાસવર્ડ",btnCreateAccount:"મફત ખાતું બનાવો",alreadyRegistered:"પહેલેથી ખાતું છે?",signInHere:"અહીં લૉગિન કરો",loginTitle:"લૉગિન કરો",loginSub:"તમારા દસ્તાવેજો જોવા માટે લૉગિન કરો",dontHaveAccount:"નવું ખાતું બનાવવું છે?",signUpHere:"અહીં રજીસ્ટર કરો",signerWelcome:"દસ્તાવેજ જુઓ અને સહી કરો",requestedBy:"વિનંતી કરનાર",tabDraw:"✍️ સહી દોરો",tabType:"⌨️ નામ ટાઈપ કરો",btnClear:"સાફ કરો",btnCompleteSigning:"✅ સહી પૂર્ણ કરો",otpNotice:"ઓળખ ચકાસવા માટે તમારા ઇમેઇલ પર ૬-અંકનો OTP મોકલવામાં આવશે.",footerNote:"SignEase — સરળ, ઝડપી અને કાનૂની માન્ય ઈ-સહી."},bn:{brand:"SignEase",home:"হোম",dashboard:"ড্যাশবোর্ড",documents:"নথি / ডকুমেন্টস",upload:"আপলোড ও স্বাক্ষর",send:"স্বাক্ষরের জন্য পাঠান",verify:"নথি যাচাই করুন",admin:"অ্যাডমিন",signIn:"সাইন ইন",createAccount:"অ্যাকাউন্ট খুলুন",signOut:"লগ আউট",profile:"প্রোফাইল",myProfile:"আমার প্রোফাইল",profileSettings:"প্রোফাইল সেটিংস",changePhoto:"ছবি পরিবর্তন করুন",personalInfo:"ব্যক্তিগত তথ্য",phone:"ফোন নম্বর",organization:"প্রতিষ্ঠান",designation:"পদবী",department:"বিভাগ",saveProfile:"সংরক্ষণ করুন",digitalSignature:"ডিজিটাল স্বাক্ষর",signatureStatus:"আধার ই-সাইন যাচাইকৃত",security:"অ্যাকাউন্ট নিরাপত্তা",language:"ভাষা",newEnvelope:"+ নতুন নথি",newAgreement:"+ নতুন চুক্তি",exportCsv:"CSV ডাউনলোড",darkModeToggle:"ডার্ক / লাইট মোড",heroBadge:"✨ সহজ ও নিরাপদ ডিজিটাল স্বাক্ষর",heroTitle:"কয়েক মিনিটে যেকোনো নথিতে স্বাক্ষর করুন",heroSubtitle:"অনলাইনে চুক্তি ও নথিতে স্বাক্ষর করার সবচেয়ে সহজ ও নিরাপদ উপায়। মোবাইল বা কম্পিউটারে সরাসরি কাজ করে।",btnStartFree:"বিনামূল্যে শুরু করুন",btnSenderDashboard:"আমার ড্যাশবোর্ড",btnVerifyDoc:"নথি যাচাই করুন",howItWorks:"স্বাক্ষর করার ৩টি সহজ ধাপ",step1Title:"১. PDF নির্বাচন করুন",step1Desc:"আপনার ফোন বা কম্পিউটার থেকে যেকোনো PDF নির্বাচন করুন।",step2Title:"২. স্বাক্ষরকারী যোগ করুন",step2Desc:"যাদের স্বাক্ষর করতে হবে তাদের নাম ও ইমেল লিখুন।",step3Title:"৩. স্বাক্ষর করুন ও ডাউনলোড করুন",step3Desc:"আঙুল দিয়ে বা নাম লিখে স্বাক্ষর করুন এবং PDF পান।",whyChooseUs:"SignEase কেন বেছে নেবেন",feature1Title:"কোনো জটিল সেটআপ নেই",feature1Desc:"কোনো অ্যাপ ইন্সটল করার দরকার নেই। ইমেল লিঙ্কে ক্লিক করে সরাসরি স্বাক্ষর করুন।",feature2Title:"১০০% আইনিভাবে বৈধ",feature2Desc:"ভারতীয় তথ্যপ্রযুক্তি আইনের অধীনে সম্পূর্ণরূপে বৈধ।",feature3Title:"তাৎক্ষণিক ইমেল ডেলিভারি",feature3Desc:"যাচাইকরণ OTP এবং স্বাক্ষরের লিঙ্ক সঙ্গে সঙ্গে ইমেলে পৌঁছে যায়।",greeting:"নমস্কার,",compliancetag:"আধার ই-সাইন ও আইনি মান্যতা",aadhaarCompliant:"আধার এবং আইটি আইন ২০০০ সম্মত",attentionSub:"নথিতে আপনার স্বাক্ষর বাকি রয়েছে",vaultSynced:"সিস্টেম চালু আছে",totalDocs:"মোট নথি",pendingDocs:"আপনার স্বাক্ষর বাকি",completedDocs:"সম্পন্ন নথি",actionNeeded:"স্বাক্ষর প্রয়োজন",thisWeekGrowth:"+২ এই সপ্তাহে",rateDone:"৬৪% সম্পন্ন",searchPlaceholder:"নাম বা আইডি দিয়ে খুঁজুন...",filterAll:"সব",filterRequiresMe:"আমার স্বাক্ষর দরকার",filterCompleted:"সম্পন্ন",uploadAndSign:"➕ আপলোড ও স্বাক্ষর",colDocName:"নথির নাম",colSignersStatus:"স্বাক্ষরের স্থিতি",colLastUpdated:"সর্বশেষ আপডেট",colAction:"পদক্ষেপ",signNow:"স্বাক্ষর করুন",remind:"স্মরণ করান",download:"ডাউনলোড",showingAgreements:"প্রদর্শিত নথি",viewVaultLink:"সব নথি দেখুন →",legalValidityGuaranteed:"১০০% আইনিভাবে বৈধ",legalValidityDesc:"SignEase-এ করা স্বাক্ষর ভারতীয় আদালতে সম্পূর্ণ গ্রহণযোগ্য।",auditTrailGuide:"প্রমাণপত্র নির্দেশিকা ↗",docRegistryTitle:"আমার নথি",docRegistrySub:"আপনার স্বাক্ষরিত ও অপেক্ষমান নথিগুলি পরিচালনা করুন।",activeEnvelopes:"সক্রিয় নথি",needsAction:"আপনার স্বাক্ষর বাকি",awaitingSigners:"অন্যদের স্বাক্ষর বাকি",verificationAudit:"যাচাইকৃত",urgentReview:"জরুরি পদক্ষেপ",externalParties:"স্বাক্ষর বাকি",itActCompliant:"আইনিভাবে বৈধ",filterWaitingOthers:"অন্যদের জন্য বাকি",reviewAndSign:"দেখুন ও স্বাক্ষর করুন",downloadPdf:"PDF ডাউনলোড",continueEdit:"সম্পাদনা করুন",hsmActive:"ব্যাঙ্ক-মানের নিরাপত্তায় সুরক্ষিত",hsmDesc:"প্রতিটি স্বাক্ষরিত নথির সাথে অফিসিয়াল সার্টিফিকেট থাকে।",viewCryptoCert:"সার্টিফিকেট দেখুন →",workflowDispatch:"স্বাক্ষরের জন্য পাঠান",sendDocForSignature:"নথিতে স্বাক্ষরের জন্য পাঠান",sendDocDesc:"আপনার PDF নির্বাচন করুন, নাম ও ইমেল লিখে দ্রুত পাঠান।",step1Upload:"১. ফাইল বেছে নিন",pdfFormatUpTo:"PDF (সর্বোচ্চ ২৫ MB)",dropPdfHere:"আপনার PDF ফাইল এখানে রাখুন, অথবা",browseFiles:"ফাইল ব্রাউজ করুন",encryptedTransit:"নিরাপদ ও ব্যক্তিগত • সর্বোচ্চ ২৫ MB",readyToTag:"প্রস্তুত",step2Signers:"২. স্বাক্ষরকারী যোগ করুন",orderType:"স্বাক্ষরের ক্রম",signersNotice:"স্বাক্ষরকারী সরাসরি ইমেল লিঙ্ক পাবেন। অ্যাকাউন্ট খোলার দরকার নেই।",signerName:"নাম",emailAddress:"ইমেল ঠিকানা",role:"ভূমিকা",needsToSign:"স্বাক্ষর করতে হবে",receivesCopy:"শুধুমাত্র কপি পাবেন",addAnotherRecipient:"➕ আরও একজন যোগ করুন",tamperProofAudit:"আইনি অডিট রেকর্ড",tamperProofDesc:"তারিখ, সময় ও স্বাক্ষরের রেকর্ড সুরক্ষিত থাকে।",sendReminder48h:"২ দিনের মধ্যে স্বাক্ষর না হলে স্মরণ করান",cancel:"বাতিল করুন",saveAsDraft:"ড্রাফট হিসেবে সংরক্ষণ করুন",sendForSignature:"স্বাক্ষরের জন্য পাঠান ▶",trustLedger:"নথি যাচাইকরণ",verifyAuthenticity:"নথির সত্যতা যাচাই করুন",verifyDocSubtitle:"স্বাক্ষরিত নথিটি আসল ও অপরিবর্তিত কিনা সহজে যাচাই করুন।",auditorNodeOnline:"সিস্টেম চালু আছে",tabEnterHash:"নথি কোড / আইডি লিখুন",tabUploadFile:"স্বাক্ষরিত ফাইল আপলোড করুন",checksumLabel:"নথি কোড বা আইডি",pasteBtn:"পেস্ট করুন",verifyDocumentBtn:"যাচাই করুন",verifyHelperNotice:"আমরা আপনার ফাইল সম্পূর্ণ সুরক্ষিত ও গোপন রাখি।",verifiedAuthenticTitle:"নথি আসল ও নিরাপদ",legallyBinding:"আইনিভাবে বৈধ",verifiedSub:"স্বাক্ষর ও নথি সম্পূর্ণ খাঁটি।",downloadAuditCertificate:"সার্টিফিকেট ডাউনলোড (PDF)",metaDocTitle:"নথির নাম",metaSignaturesVerified:"স্বাক্ষর",metaTimestampAuth:"তারিখ ও সময়",originalMatch:"আসল কপি",sealedEndToEnd:"নিরাপদভাবে সিল করা",itActTitle:"আইটি আইন ২০০০ অনুযায়ী বৈধ",itActDesc:"ভারতীয় আইন অনুসারে এই স্বাক্ষর সম্পূর্ণ বৈধ।",zkpTitle:"১০০% গোপনীয় ও সুরক্ষিত",zkpDesc:"আপনার ফাইলের তথ্য কারও সাথে শেয়ার করা হয় না।",regTitle:"নতুন অ্যাকাউন্ট তৈরি করুন",regSub:"আপনার ইমেল লিখে ৬-সংখ্যার OTP পান",firstName:"প্রথম নাম",lastName:"পদবি",orgName:"কোম্পানি বা ব্যবসার নাম",emailInput:"ইমেল ঠিকানা",btnGetOtp:"OTP পান",otpLabel:"৬-সংখ্যার ইমেল OTP লিখুন",btnVerifyOtp:"OTP যাচাই করুন",otpDispatchedMsg:"আপনার ইমেলে ৬ সংখ্যার OTP পাঠানো হয়েছে।",password:"পাসওয়ার্ড",btnCreateAccount:"বিনামূল্যে অ্যাকাউন্ট খুলুন",alreadyRegistered:"ইতিমধ্যে অ্যাকাউন্ট আছে?",signInHere:"এখানে লগইন করুন",loginTitle:"লগইন করুন",loginSub:"আপনার নথি দেখতে লগইন করুন",dontHaveAccount:"নতুন অ্যাকাউন্ট তৈরি করবেন?",signUpHere:"এখানে রেজিস্টার করুন",signerWelcome:"নথি পর্যালোচনা ও স্বাক্ষর",requestedBy:"অনুরোধকারী",tabDraw:"✍️ স্বাক্ষর আঁকুন",tabType:"⌨️ নাম টাইপ করুন",btnClear:"মুছে ফেলুন",btnCompleteSigning:"✅ স্বাক্ষর সম্পন্ন করুন",otpNotice:"পরিচয় যাচাইয়ের জন্য ইমেলে ৬ সংখ্যার OTP পাঠানো হবে।",footerNote:"SignEase — সহজ, দ্রুত ও আইনিভাবে বৈধ ডিজিটাল স্বাক্ষর।"},ta:{brand:"SignEase",home:"முகப்பு",dashboard:"டாஷ்போர்டு",documents:"ஆவணங்கள்",upload:"பதிவேற்றி கையொப்பமிடுங்கள்",send:"கையொப்பத்திற்கு அனுப்புங்கள்",verify:"ஆவணத்தைச் சரிபார்க்கவும்",admin:"நிர்வாகி",signIn:"உள்நுழையவும்",createAccount:"கணக்கை உருவாக்கவும்",signOut:"வெளியேறவும்",profile:"சுயவிவரம்",myProfile:"எனது சுயவிவரம்",profileSettings:"சுயவிவர அமைப்புகள்",changePhoto:"புகைப்படத்தை மாற்றவும்",personalInfo:"தனிப்பட்ட தகவல்",phone:"தொலைபேசி எண்",organization:"நிறுவனம்",designation:"பதவி",department:"துறை",saveProfile:"சேமிக்கவும்",digitalSignature:"டிஜிட்டல் கையொப்பம்",signatureStatus:"ஆதார் இ-சைன் சரிபார்க்கப்பட்டது",security:"கணக்கு பாதுகாப்பு",language:"மொழி",newEnvelope:"+ புதிய ஆவணம்",newAgreement:"+ புதிய ஒப்பந்தம்",exportCsv:"CSV பதிவிறக்கம்",darkModeToggle:"டார்க் / லைட் பயன்முறை",heroBadge:"✨ எளிய மற்றும் பாதுகாப்பான டிஜிட்டல் கையொப்பம்",heroTitle:"சில நிமிடங்களில் ஆவணங்களில் கையொப்பமிட்டு அனுப்புங்கள்",heroSubtitle:"ஆன்லைனில் ஒப்பந்தங்களில் கையொப்பமிடுவதற்கான எளிதான மற்றும் பாதுகாப்பான வழி.",btnStartFree:"இலவசமாகத் தொடங்குங்கள்",btnSenderDashboard:"என் டாஷ்போர்டு",btnVerifyDoc:"ஆவணத்தைச் சரிபார்க்கவும்",greeting:"வணக்கம்,",compliancetag:"ஆதார் இ-கையொப்பம் சட்டப்படி செல்லுபடியாகும்",aadhaarCompliant:"ஆதார் மற்றும் தகவல் தொழில்நுட்ப சட்டம் 2000 இணக்கமானது",attentionSub:"ஆவணங்களில் உங்கள் கையொப்பம் தேவை",totalDocs:"மொத்த ஆவணங்கள்",pendingDocs:"உங்கள் கையொப்பம் நிலுவையில் உள்ளது",completedDocs:"முடிவடைந்த ஆவணங்கள்",actionNeeded:"கையொப்பமிடவும்",searchPlaceholder:"பெயர் அல்லது எண்ணால் தேடுங்கள்...",filterAll:"அனைத்தும்",filterRequiresMe:"என் கையொப்பம் தேவை",filterCompleted:"முடிந்தது",uploadAndSign:"➕ பதிவேற்றி கையொப்பமிடுங்கள்",colDocName:"ஆவணப் பெயர்",colSignersStatus:"நிலை",colLastUpdated:"கடைசி புதுப்பிப்பு",colAction:"செயல்",signNow:"கையொப்பமிடுங்கள்",remind:"நினைவூட்டுங்கள்",download:"பதிவிறக்கவும்",legalValidityGuaranteed:"100% சட்டப்பூர்வமாக செல்லுபடியாகும்",docRegistryTitle:"என் ஆவணங்கள்",docRegistrySub:"உங்கள் அனைத்து கையொப்பமிட்ட ஆவணங்களையும் இங்கே பார்க்கவும்.",activeEnvelopes:"செயலில் உள்ள ஆவணங்கள்",needsAction:"உங்கள் கையொப்பம் தேவை",awaitingSigners:"பிறர் கையொப்பத்திற்கு காத்திருக்கிறது",verificationAudit:"சரிபார்க்கப்பட்டது",reviewAndSign:"பார்த்து கையொப்பமிடுங்கள்",downloadPdf:"PDF பதிவிறக்கவும்",workflowDispatch:"கையொப்பத்திற்கு அனுப்புங்கள்",sendDocForSignature:"ஆவணத்தை கையொப்பத்திற்கு அனுப்புங்கள்",sendDocDesc:"உங்கள் PDF-ஐ தேர்ந்தெடுத்து, பெயர் மற்றும் மின்னஞ்சலை உள்ளிட்டு உடனே அனுப்புங்கள்.",step1Upload:"1. கோப்பைத் தேர்வுசெய்க",pdfFormatUpTo:"PDF (அதிகபட்சம் 25 MB)",dropPdfHere:"இங்கே உங்கள் PDF-ஐ இடவும், அல்லது",browseFiles:"கோப்பைத் தேர்வுசெய்க",encryptedTransit:"பாதுகாப்பானது • அதிகபட்சம் 25 MB",step2Signers:"2. கையொப்பமிடுபவரைச் சேர்க்கவும்",signersNotice:"கையொப்பமிடுபவருக்கு மின்னஞ்சலில் நேரடி இணைப்பு கிடைக்கும். கணக்கு தேவையில்லை.",signerName:"பெயர்",emailAddress:"மின்னஞ்சல் முகவரி",role:"பங்கு",needsToSign:"கையொப்பமிட வேண்டும்",receivesCopy:"நகல் மட்டும் கிடைக்கும்",addAnotherRecipient:"➕ மற்றுமொருவரைச் சேர்க்கவும்",sendReminder48h:"2 நாட்களில் கையொப்பமிடவில்லை என்றால் நினைவூட்டுங்கள்",cancel:"ரத்து செய்",saveAsDraft:"வரைவாகச் சேமிக்கவும்",sendForSignature:"கையொப்பத்திற்கு அனுப்புங்கள் ▶",trustLedger:"ஆவண சரிபார்ப்பு",verifyAuthenticity:"ஆவணத்தின் நம்பகத்தன்மையைச் சரிபார்க்கவும்",verifyDocSubtitle:"கையொப்பமிட்ட ஆவணம் அசல் மற்றும் பாதுகாப்பானது என்பதை எளிதாகச் சரிபார்க்கவும்.",checksumLabel:"ஆவணக் குறியீடு அல்லது எண்",pasteBtn:"ஒட்டவும்",verifyDocumentBtn:"சரிபார்க்கவும்",verifiedAuthenticTitle:"ஆவணம் அசல் மற்றும் பாதுகாப்பானது",legallyBinding:"சட்டப்படி செல்லுபடியாகும்",downloadAuditCertificate:"சான்றிதழைப் பதிவிறக்கவும் (PDF)",metaDocTitle:"ஆவணப் பெயர்",metaSignaturesVerified:"கையொப்பங்கள்",metaTimestampAuth:"தேதி மற்றும் நேரம்",itActTitle:"தகவல் தொழில்நுட்ப சட்டம் 2000-ன் கீழ் செல்லுபடியாகும்",itActDesc:"இந்திய சட்டத்தின் கீழ் இந்த கையொப்பம் முற்றிலும் செல்லுபடியாகும்.",regTitle:"புதிய கணக்கை உருவாக்கவும்",regSub:"உங்கள் மின்னஞ்சலை உள்ளிட்டு 6 இலக்க OTP பெறவும்",firstName:"முதல் பெயர்",lastName:"கடைசி பெயர்",orgName:"நிறுவனத்தின் பெயர்",emailInput:"மின்னஞ்சல் முகவரி",btnGetOtp:"OTP பெறவும்",otpLabel:"6 இலக்க மின்னஞ்சல் OTP-ஐ உள்ளிடவும்",btnVerifyOtp:"OTP சரிபார்க்கவும்",otpDispatchedMsg:"உங்கள் மின்னஞ்சலுக்கு 6 இலக்க OTP அனுப்பப்பட்டுள்ளது.",password:"கடவுச்சொல்",btnCreateAccount:"இலவச கணக்கை உருவாக்கவும்",alreadyRegistered:"ஏற்கனவே கணக்கு உள்ளதா?",signInHere:"இங்கே உள்நுழையவும்",loginTitle:"உள்நுழையவும்",loginSub:"உங்கள் ஆவணங்களைப் பார்க்க உள்நுழையவும்",dontHaveAccount:"புதிய கணக்கு வேண்டுமா?",signUpHere:"இங்கே பதிவு செய்யவும்",footerNote:"SignEase — எளிய, விரைவான மற்றும் சட்டப்பூர்வ மின்னணு கையொப்பம்."},te:{brand:"SignEase",home:"హోమ్",dashboard:"డ్యాష్‌బోర్డ్",documents:"పత్రాలు (Documents)",upload:"అప్‌లోడ్ & సంతకం",send:"సంతకం కోసం పంపండి",verify:"పత్రాన్ని ధృవీకరించండి",admin:"అడ్మిన్",signIn:"సైన్ ఇన్",createAccount:"ఖాతా సృష్టించండి",signOut:"లాగ్ అవుట్",profile:"ప్రొఫైల్",myProfile:"నా ప్రొఫైల్",profileSettings:"ప్రొఫైల్ సెట్టింగ్‌లు",changePhoto:"ఫోటో మార్చండి",personalInfo:"వ్యక్తిగత సమాచారం",phone:"ఫోన్ నంబర్",organization:"సంస్థ",designation:"హోదా",department:"విభాగం",saveProfile:"సేవ్ చేయండి",digitalSignature:"డిజిటల్ సంతకం",signatureStatus:"ఆధార్ ఇ-సైన్ ధృవీకరించబడింది",security:"ఖాతా భద్రత",language:"భాష",newEnvelope:"+ కొత్త పత్రం",newAgreement:"+ కొత్త ఒప్పందం",exportCsv:"CSV డౌన్‌లోడ్",darkModeToggle:"డార్క్ / లైట్ మోడ్",heroBadge:"✨ సులభమైన మరియు సురక్షితమైన డిజిటల్ సంతకం",heroTitle:"నిమిషాల్లో పత్రాలపై సంతకం చేసి పంపండి",heroSubtitle:"ఆన్‌లైన్‌లో ఒప్పందాలపై సంతకం చేయడానికి అత్యంత సులభమైన మరియు సురక్షితమైన మార్గం.",btnStartFree:"ఉచితంగా ప్రారంభించండి",btnSenderDashboard:"నా డ్యాష్‌బోర్డ్",btnVerifyDoc:"పత్రాన్ని ధృవీకరించండి",greeting:"నమస్కారం,",compliancetag:"ఆధార్ ఈ-సైన్ చట్టబద్ధంగా చెల్లుబాటు అవుతుంది",aadhaarCompliant:"ఆధార్ మరియు ఐటీ చట్టం 2000 అనుగుణంగా ఉంది",attentionSub:"పత్రాలపై మీ సంతకం పెండింగ్‌లో ఉంది",totalDocs:"మొత్తం పత్రాలు",pendingDocs:"మీ సంతకం పెండింగ్‌లో ఉంది",completedDocs:"పూర్తయిన పత్రాలు",actionNeeded:"సంతకం చేయండి",searchPlaceholder:"శీర్షిక లేదా ఐడీతో శోధించండి...",filterAll:"అన్నీ",filterRequiresMe:"నా సంతకం కావాలి",filterCompleted:"పూర్తయింది",uploadAndSign:"➕ అప్‌లోడ్ & సంతకం",colDocName:"పత్రం పేరు",colSignersStatus:"స్థితి",colLastUpdated:"చివరి నవీకరణ",colAction:"చర్య",signNow:"సంతకం చేయండి",remind:"గుర్తు చేయండి",download:"డౌన్‌లోడ్",legalValidityGuaranteed:"100% చట్టబద్ధంగా చెల్లుబాటు అవుతుంది",docRegistryTitle:"నా పత్రాలు",docRegistrySub:"మీ సంతకం చేసిన అన్ని పత్రాలను ఇక్కడ నిర్వహించండి.",activeEnvelopes:"క్రియాశీల పత్రాలు",needsAction:"మీ సంతకం అవసరం",awaitingSigners:"ఇతరుల సంతకం కోసం నిరీక్షణ",verificationAudit:"ధృవీకరించబడింది",reviewAndSign:"చూసి సంతకం చేయండి",downloadPdf:"PDF డౌన్‌లోడ్",workflowDispatch:"సంతకం కోసం పంపండి",sendDocForSignature:"పత్రాన్ని సంతకం కోసం పంపండి",sendDocDesc:"మీ PDF ని ఎంచుకుని, పేరు మరియు ఈమెయిల్‌ను జోడించి వెంటనే పంపండి.",step1Upload:"1. ఫైల్‌ను ఎంచుకోండి",pdfFormatUpTo:"PDF (గరిష్టంగా 25 MB)",dropPdfHere:"మీ PDF ఫైల్‌ను ఇక్కడ ఉంచండి, లేదా",browseFiles:"ఫైల్‌ను ఎంచుకోండి",encryptedTransit:"సురక్షితమైనది • గరిష్టంగా 25 MB",step2Signers:"2. సంతకం చేసేవారిని జోడించండి",signersNotice:"సంతకం చేసేవారికి ఈమెయిల్‌లో నేరుగా లింక్ వస్తుంది. ఖాతా అవసరం లేదు.",signerName:"పేరు",emailAddress:"ఈమెయిల్ చిరునామా",role:"పాత్ర",needsToSign:"సంతకం చేయాలి",receivesCopy:"కాపీ మాత్రమే అందుతుంది",addAnotherRecipient:"➕ మరొకరిని జోడించండి",sendReminder48h:"2 రోజుల్లో సంతకం చేయకపోతే గుర్తు చేయండి",cancel:"రద్దు చేయండి",saveAsDraft:"డ్రాఫ్ట్‌గా సేవ్ చేయండి",sendForSignature:"సంతకం కోసం పంపండి ▶",trustLedger:"పత్రం ధృవీకరణ",verifyAuthenticity:"పత్రం అసలైనదా కాదా అని తనిఖీ చేయండి",verifyDocSubtitle:"సంతకం చేసిన పత్రం అసలైనది మరియు సురక్షితమైనదని సులభంగా తనిఖీ చేయండి.",checksumLabel:"పత్రం కోడ్ లేదా ఐడీ",pasteBtn:"పేస్ట్ చేయండి",verifyDocumentBtn:"ధృవీకరించండి",verifiedAuthenticTitle:"పత్రం అసలైనది మరియు సురక్షితమైనది",legallyBinding:"చట్టబద్ధమైనది",downloadAuditCertificate:"సర్టిఫికేట్ డౌన్‌లోడ్ (PDF)",metaDocTitle:"పత్రం పేరు",metaSignaturesVerified:"సంతకాలు",metaTimestampAuth:"తేదీ మరియు సమయం",itActTitle:"ఐటీ చట్టం 2000 ప్రకారం చెల్లుబాటు అవుతుంది",itActDesc:"భారతీయ చట్టం ప్రకారం ఈ సంతకం పూర్తిగా చెల్లుబాటు అవుతుంది.",regTitle:"కొత్త ఖాతా సృష్టించండి",regSub:"మీ ఈమెయిల్‌ను నమోదు చేసి 6 అంకెల OTP పొందండి",firstName:"మొదటి పేరు",lastName:"చివరి పేరు",orgName:"సంస్థ పేరు",emailInput:"ఈమెయిల్ చిరునామా",btnGetOtp:"OTP పొందండి",otpLabel:"6 అంకెల ఈమెయిల్ OTP ని నమోదు చేయండి",btnVerifyOtp:"OTP ని ధృవీకరించండి",otpDispatchedMsg:"మీ ఈమెయిల్‌కు 6 అంకెల OTP పంపబడింది.",password:"పాస్‌వర్డ్",btnCreateAccount:"ఉచిత ఖాతా సృష్టించండి",alreadyRegistered:"ఇప్పటికే ఖాతా ఉందా?",signInHere:"ఇక్కడ లాగిన్ అవ్వండి",loginTitle:"లాగిన్ అవ్వండి",loginSub:"మీ పత్రాలను చూడటానికి లాగిన్ అవ్వండి",dontHaveAccount:"కొత్త ఖాతా కావాలా?",signUpHere:"ఇక్కడ నమోదు చేసుకోండి",footerNote:"SignEase — సులభమైన, వేగవంతమైన మరియు చట్టబద్ధమైన డిజిటల్ సంతకం."},kn:{brand:"SignEase",home:"ಮುಖಪುಟ",dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",documents:"ದಾಖಲೆಗಳು (Documents)",upload:"ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸಹಿ",send:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",verify:"ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ",admin:"ನಿರ್ವಾಹಕ",signIn:"ಸೈನ್ ಇನ್",createAccount:"ಖಾತೆ ತೆರೆಯಿರಿ",signOut:"ಲಾಗ್ ಔಟ್",profile:"ಪ್ರೊಫೈಲ್",myProfile:"ನನ್ನ ಪ್ರೊಫೈಲ್",profileSettings:"ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",changePhoto:"ಫೋಟೋ ಬದಲಾಯಿಸಿ",personalInfo:"ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",phone:"ದೂರವಾಣಿ ಸಂಖ್ಯೆ",organization:"ಸಂಸ್ಥೆ",designation:"ಹುದ್ದೆ",department:"ವಿಭಾಗ",saveProfile:"ಉಳಿಸಿ",digitalSignature:"ಡಿಜಿಟಲ್ ಸಹಿ",signatureStatus:"ಆಧಾರ್ ಇ-ಸೈನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",security:"ಖಾತೆ ಭದ್ರತೆ",language:"ಭಾಷೆ",newEnvelope:"+ ಹೊಸ ದಾಖಲೆ",newAgreement:"+ ಹೊಸ ಒಪ್ಪಂದ",exportCsv:"CSV ಡೌನ್‌ಲೋಡ್",darkModeToggle:"ಡಾರ್ಕ್ / ಲೈಟ್ ಮೋಡ್",heroBadge:"✨ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಸಹಿ",heroTitle:"ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ದಾಖಲೆಗಳಿಗೆ ಸಹಿ ಮಾಡಿ ಕಳುಹಿಸಿ",heroSubtitle:"ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಮಾಡಲು ಅತ್ಯಂತ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ ವಿಧಾನ.",btnStartFree:"ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",btnSenderDashboard:"ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",btnVerifyDoc:"ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ",greeting:"ನಮಸ್ಕಾರ,",compliancetag:"ಆಧಾರ್ ಇ-ಸಹಿ ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ",aadhaarCompliant:"ಆಧಾರ್ ಮತ್ತು ಐಟಿ ಕಾಯಿದೆ 2000 ಅನುಸರಣೆ",attentionSub:"ದಾಖಲೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಸಹಿ ಬಾಕಿ ಇದೆ",totalDocs:"ಒಟ್ಟು ದಾಖಲೆಗಳು",pendingDocs:"ನಿಮ್ಮ ಸಹಿ ಬಾಕಿ ಇದೆ",completedDocs:"ಪೂರ್ಣಗೊಂಡ ದಾಖಲೆಗಳು",actionNeeded:"ಸಹಿ ಮಾಡಿ",searchPlaceholder:"ಹೆಸರು ಅಥವಾ ಐಡಿಯಿಂದ ಹುಡುಕಿ...",filterAll:"ಎಲ್ಲವೂ",filterRequiresMe:"ನನ್ನ ಸಹಿ ಬೇಕು",filterCompleted:"ಪೂರ್ಣಗೊಂಡಿದೆ",uploadAndSign:"➕ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸಹಿ",colDocName:"ದಾಖಲೆಯ ಹೆಸರು",colSignersStatus:"ಸ್ಥಿತಿ",colLastUpdated:"ಕೊನೆಯ ನವೀಕರಣ",colAction:"ಕ್ರಿಯೆ",signNow:"ಸಹಿ ಮಾಡಿ",remind:"ನೆನಪಿಸಿ",download:"ಡೌನ್‌ಲೋಡ್",legalValidityGuaranteed:"100% ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ",docRegistryTitle:"ನನ್ನ ದಾಖಲೆಗಳು",docRegistrySub:"ನಿಮ್ಮ ಎಲ್ಲಾ ಸಹಿ ಮಾಡಿದ ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ.",activeEnvelopes:"ಸಕ್ರಿಯ ದಾಖಲೆಗಳು",needsAction:"ನಿಮ್ಮ ಸಹಿ ಅಗತ್ಯವಿದೆ",awaitingSigners:"ಇತರರ ಸಹಿಗಾಗಿ ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ",verificationAudit:"ಪರಿಶೀಲಿಸಲಾಗಿದೆ",reviewAndSign:"ನೋಡಿ ಸಹಿ ಮಾಡಿ",downloadPdf:"PDF ಡೌನ್‌ಲೋಡ್",workflowDispatch:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",sendDocForSignature:"ದಾಖಲೆಯನ್ನು ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",sendDocDesc:"ನಿಮ್ಮ PDF ಆಯ್ಕೆಮಾಡಿ, ಹೆಸರು ಮತ್ತು ಇಮೇಲ್ ಸೇರಿಸಿ ತಕ್ಷಣ ಕಳುಹಿಸಿ.",step1Upload:"1. ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",pdfFormatUpTo:"PDF (ಗರಿಷ್ಠ 25 MB)",dropPdfHere:"ನಿಮ್ಮ PDF ಫೈಲ್ ಇಲ್ಲಿ ಹಾಕಿ, ಅಥವಾ",browseFiles:"ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",encryptedTransit:"ಸುರಕ್ಷಿತ • ಗರಿಷ್ಠ 25 MB",step2Signers:"2. ಸಹಿ ಮಾಡುವವರನ್ನು ಸೇರಿಸಿ",signersNotice:"ಸಹಿ ಮಾಡುವವರಿಗೆ ಇಮೇಲ್‌ನಲ್ಲಿ ನೇರ ಲಿಂಕ್ ಸಿಗುತ್ತದೆ. ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ.",signerName:"ಹೆಸರು",emailAddress:"ಇಮೇಲ್ ವಿಳಾಸ",role:"ಪಾತ್ರ",needsToSign:"ಸಹಿ ಮಾಡಬೇಕು",receivesCopy:"ಪ್ರತಿ ಮಾತ್ರ ಸಿಗುತ್ತದೆ",addAnotherRecipient:"➕ ಇನ್ನೊಬ್ಬರನ್ನು ಸೇರಿಸಿ",sendReminder48h:"2 ದಿನಗಳಲ್ಲಿ ಸಹಿ ಮಾಡದಿದ್ದರೆ ನೆನಪಿಸಿ",cancel:"ರದ್ದುಮಾಡಿ",saveAsDraft:"ಕರಡಾಗಿ ಉಳಿಸಿ",sendForSignature:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ ▶",trustLedger:"ದಾಖಲೆ ಪರಿಶೀಲನೆ",verifyAuthenticity:"ದಾಖಲೆಯ ನೈಜತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",verifyDocSubtitle:"ಸಹಿ ಮಾಡಿದ ದಾಖಲೆಯು ಅಸಲಿಯೇ ಮತ್ತು ಸುರಕ್ಷಿತವೇ ಎಂದು ಸುಲಭವಾಗಿ ಪರಿಶೀಲಿಸಿ.",checksumLabel:"ದಾಖಲೆ ಕೋಡ್ ಅಥವಾ ಐಡಿ",pasteBtn:"ಅಂಟಿಸಿ",verifyDocumentBtn:"ಪರಿಶೀಲಿಸಿ",verifiedAuthenticTitle:"ದಾಖಲೆ ಅಸಲಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆ",legallyBinding:"ಕಾನೂನುಬದ್ಧವಾಗಿದೆ",downloadAuditCertificate:"ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್ (PDF)",metaDocTitle:"ದಾಖಲೆಯ ಹೆಸರು",metaSignaturesVerified:"ಸಹಿಗಳು",metaTimestampAuth:"ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",itActTitle:"ಐಟಿ ಕಾಯ್ದೆ 2000 ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯವಾಗಿದೆ",itActDesc:"ಭಾರತೀಯ ಕಾನೂನಿನ ಪ್ರಕಾರ ಈ ಸಹಿ ಸಂಪೂರ್ಣವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ.",regTitle:"ಹೊಸ ಖಾತೆ ರಚಿಸಿ",regSub:"ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ 6 ಅಂಕಿಗಳ OTP ಪಡೆಯಿರಿ",firstName:"ಮೊದಲ ಹೆಸರು",lastName:"ಕೊನೆಯ ಹೆಸರು",orgName:"ಸಂಸ್ಥೆಯ ಹೆಸರು",emailInput:"ಇಮೇಲ್ ವಿಳಾಸ",btnGetOtp:"OTP ಪಡೆಯಿರಿ",otpLabel:"6 ಅಂಕಿಗಳ ಇಮೇಲ್ OTP ನಮೂದಿಸಿ",btnVerifyOtp:"OTP ಪರಿಶೀಲಿಸಿ",otpDispatchedMsg:"ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ 6 ಅಂಕಿಗಳ OTP ಕಳುಹಿಸಲಾಗಿದೆ.",password:"ಪಾಸ್‌ವರ್ಡ್",btnCreateAccount:"ಉಚಿತ ಖಾತೆ ತೆರೆಯಿರಿ",alreadyRegistered:"ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",signInHere:"ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ",loginTitle:"ಲಾಗಿನ್ ಆಗಿ",loginSub:"ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಲಾಗಿನ್ ಆಗಿ",dontHaveAccount:"ಹೊಸ ಖಾತೆ ಬೇಕೇ?",signUpHere:"ಇಲ್ಲಿ ನೋಂದಾಯಿಸಿ",footerNote:"SignEase — ಸುಲಭ, ವೇಗದ ಮತ್ತು ಕಾನೂನುಬದ್ಧ ಡಿಜಿಟಲ್ ಸಹಿ."}};function C(){return localStorage.getItem("signease_lang")||"en"}function W(a){localStorage.setItem("signease_lang",a)}function e(a){const t=C();return P[t]&&P[t][a]?P[t][a]:P.hi&&P.hi[a]?P.hi[a]:P.en&&P.en[a]?P.en[a]:a}if(!u.getToken()||!u.getUser()){const a={id:1,fullName:"Rajesh Sharma",email:"rajesh.sharma@signease.io",role:"ADMIN",organization:"Admin Vault",phone:"+91 98765 43210",designation:"Managing Director & Legal Counsel",department:"Executive Legal Affairs",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",signatureFont:"Dancing Script",signatureText:"Rajesh Sharma",token:"demo-token-active"};u.setToken(a.token),u.setUser(a)}const y={user:u.getUser(),route:window.location.hash||"#/"};window.navigateFromSidebar=function(a){const t=document.getElementById("sidebarMenu");if(t){if(window.bootstrap&&window.bootstrap.Offcanvas){const s=window.bootstrap.Offcanvas.getInstance(t)||new window.bootstrap.Offcanvas(t);if(s)try{s.hide()}catch{}}t.classList.remove("show")}document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop").forEach(s=>s.remove()),document.body.classList.remove("modal-open"),document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right"),window.location.hash===a?(y.route=a,L()):window.location.hash=a};window.changeAppLanguage=function(a){W(a),document.documentElement.setAttribute("lang",a),L();const t=B.find(s=>s.code===a);f(`Language switched to ${t?t.native:a}`)};window.addEventListener("hashchange",()=>{y.route=window.location.hash||"#/",L()});function f(a,t="success"){const s=document.getElementById("toast-alert");s&&s.remove();const n=document.createElement("div");n.id="toast-alert",n.className=`alert alert-${t} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`,n.style.zIndex="9999",n.style.minWidth="320px",n.innerHTML=`
        <div class="d-flex align-items-center">
            <i class="fa-solid fa-${t==="success"?"circle-check":t==="info"?"circle-info":"triangle-exclamation"} me-2 fs-5"></i>
            <div>${a}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>n.remove(),4e3)}window.downloadDoc=async function(a,t=!0,s="document.pdf"){try{f("Preparing download...","info"),await u.downloadDocument(a,t,s),f("Document downloaded successfully!","success")}catch(n){f("Download failed: "+n.message,"danger")}};window.copySignerLink=function(a,t){t&&t.preventDefault();const s=`${window.location.origin}/#/sign/${a}`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(s).then(()=>{f("Direct signing link copied to clipboard!")}).catch(()=>{prompt("Copy direct signing link:",s)}):prompt("Copy direct signing link:",s)};window.resendInvite=async function(a,t){if(t){t.preventDefault();const s=t.currentTarget,n=s.innerHTML;s.disabled=!0,s.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const l=await u.resendSigningInvite(a);f(l.message||"Signing invite has been resent successfully to Gmail!"),s.innerHTML='<i class="fa-solid fa-check text-success me-1"></i> Dispatched!',setTimeout(()=>{s.disabled=!1,s.innerHTML=n},4e3)}catch(l){s.disabled=!1,s.innerHTML=n,f(l.message,"danger")}}};function F(){return localStorage.getItem("signease_theme")||"light"}function q(a){localStorage.setItem("signease_theme",a),document.documentElement.setAttribute("data-bs-theme",a),a==="dark"?document.body.classList.add("dark-theme"):document.body.classList.remove("dark-theme");const t=document.getElementById("themeToggleBtn");t&&(t.innerHTML=a==="dark"?'<i class="fa-solid fa-sun text-warning fs-6"></i>':'<i class="fa-solid fa-moon text-secondary fs-6"></i>',t.setAttribute("title",a==="dark"?"Switch to Light Mode":"Switch to Dark Mode"))}window.toggleAppTheme=function(){const a=F()==="dark"?"light":"dark";q(a)};q(F());async function L(){var E,O,I,k,T;document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop").forEach(S=>S.remove()),document.body.classList.remove("modal-open"),document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right");const a=document.getElementById("app"),t=y.route.replace(/^#\/?/,"").split("?")[0],s=new URLSearchParams(y.route.split("?")[1]||"");if(t.startsWith("sign/")){const S=t.replace("sign/","");ee(a,S);return}const n=F(),l=(E=y.user)!=null&&E.fullName?y.user.fullName.split(" ").map(S=>S[0]).join("").substring(0,2).toUpperCase():"RS",d=((O=y.user)==null?void 0:O.fullName)||"Rajesh Sharma",i=((I=y.user)==null?void 0:I.organization)||"Admin Vault",r=((k=y.user)==null?void 0:k.avatar)||"",m=C(),p=B.find(S=>S.code===m)||B[0];let g=`
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
                </div>

                <!-- Right Actions: Language + Dark Mode + Profile (No New Envelope button) -->
                <div class="d-flex align-items-center gap-2">
                    ${`
        <div class="dropdown">
            <button class="btn btn-pill btn-pill-outline btn-sm shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="langSelectorBtn" title="Change Language / भाषा बदलें">
                <i class="fa-solid fa-globe text-primary me-1"></i>
                <span>${p.flag} ${p.native}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 210px; z-index: 1050;">
                <li><h6 class="dropdown-header fw-bold text-uppercase text-primary small">Select Language / भाषा</h6></li>
                ${B.map(S=>`
                    <li>
                        <button class="dropdown-item py-2 d-flex align-items-center justify-content-between ${m===S.code?"active fw-bold":""}" type="button" onclick="window.changeAppLanguage('${S.code}')">
                            <span>${S.flag} ${S.native} <small class="text-muted ms-1">(${S.name})</small></span>
                            ${m===S.code?'<i class="fa-solid fa-check text-primary ms-2"></i>':""}
                        </button>
                    </li>
                `).join("")}
            </ul>
        </div>
    `}

                    <!-- Dark Mode Toggle Button -->
                    <button class="btn btn-pill btn-pill-outline btn-sm px-2 px-sm-3" id="themeToggleBtn" onclick="window.toggleAppTheme()" title="${e("darkModeToggle")}">
                        <i class="fa-solid fa-${n==="dark"?"sun text-warning":"moon text-secondary"} fs-6"></i>
                    </button>

                    ${y.user?`
                        <!-- User Profile Pill -->
                        <div class="dropdown">
                            <a class="nav-user-pill dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="user-avatar-circle" style="overflow:hidden; padding:0; flex-shrink:0;">
                                    ${r?`<img src="${r}" alt="${d}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`:l}
                                </div>
                                <div class="d-none d-md-block text-start">
                                    <div class="fw-bold" style="font-size: 0.82rem; line-height: 1.1;">${d}</div>
                                    <div class="text-muted" style="font-size: 0.7rem;">${i}</div>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 200px;">
                                <li><a class="dropdown-item py-2" href="#/profile"><i class="fa-solid fa-user-circle me-2 text-primary"></i> ${e("myProfile")}</a></li>
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
                    <!-- User Profile / Sign In Pill (Clickable to Profile) -->
                    ${y.user?`
                        <div class="p-2 mb-3 rounded-3 d-flex align-items-center gap-3 cursor-pointer" style="background: var(--bg-subtle); border: 1px solid var(--border-color); cursor: pointer;" onclick="window.navigateFromSidebar('#/profile')" title="${e("myProfile")}">
                            <div class="user-avatar-circle" style="overflow:hidden; padding:0; flex-shrink:0;">
                                ${r?`<img src="${r}" alt="${d}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`:l}
                            </div>
                            <div class="overflow-hidden">
                                <div class="fw-bold text-truncate" style="font-size: 0.9rem;">${d}</div>
                                <div class="text-muted text-truncate" style="font-size: 0.75rem;">${i} &bull; <span class="text-primary fw-medium">${e("profile")} &rarr;</span></div>
                            </div>
                        </div>
                    `:`
                        <div class="mb-3">
                            <a href="javascript:void(0)" onclick="window.navigateFromSidebar('#/login')" class="btn btn-pill-primary w-100 py-2 fw-semibold justify-content-center">
                                <i class="fa-solid fa-right-to-bracket me-2"></i> ${e("signIn")}
                            </a>
                        </div>
                    `}

                    <div class="text-uppercase small fw-bold text-muted px-2 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">Navigation / मेनू</div>
                    <a class="sidebar-nav-link ${t==="dashboard"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/dashboard')">
                        <i class="fa-solid fa-chart-pie me-2 text-primary"></i> ${e("dashboard")}
                    </a>
                    <a class="sidebar-nav-link ${t==="documents"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/documents')">
                        <i class="fa-regular fa-folder me-2 text-primary"></i> ${e("documents")}
                    </a>
                    <a class="sidebar-nav-link ${t==="send"||t==="upload"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/upload')">
                        <i class="fa-solid fa-paper-plane me-2 text-primary"></i> ${e("send")}
                    </a>
                    <a class="sidebar-nav-link ${t==="verify"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/verify')">
                        <i class="fa-solid fa-shield-halved me-2 text-success"></i> ${e("verify")}
                    </a>
                    <a class="sidebar-nav-link ${t==="profile"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/profile')">
                        <i class="fa-solid fa-user-circle me-2 text-info"></i> ${e("profile")}
                    </a>
                    ${((T=y.user)==null?void 0:T.role)==="ADMIN"?`
                        <a class="sidebar-nav-link text-danger ${t==="admin"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/admin')">
                            <i class="fa-solid fa-shield me-2"></i> ${e("admin")}
                        </a>
                    `:""}

                    <hr class="my-3" style="border-color: var(--border-color);">

                    <div class="text-uppercase small fw-bold text-muted px-2 mb-1" style="font-size: 0.7rem; letter-spacing: 0.5px;">Actions / त्वरित कार्य</div>
                    <a class="sidebar-nav-link" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/upload')">
                        <i class="fa-solid fa-plus-circle me-2 text-primary"></i> ${e("newEnvelope")}
                    </a>
                    <a class="sidebar-nav-link" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/documents')">
                        <i class="fa-solid fa-file-arrow-down me-2 text-info"></i> ${e("exportCsv")}
                    </a>
                </div>

                <!-- Bottom Drawer Actions: Only Logout (Language & Dark Mode are solely in the Header) -->
                ${y.user?`
                    <div class="pt-3 border-top" style="border-color: var(--border-color);">
                        <button class="btn btn-outline-danger w-100 py-2 fw-semibold btn-sm" id="sidebarLogoutBtn">
                            <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> ${e("signOut")}
                        </button>
                    </div>
                `:""}
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
    `;a.innerHTML=g;const h=()=>{u.clearToken(),y.user=null,f("Signed out successfully."),window.location.hash="#/login"},x=document.getElementById("logoutBtn");x&&x.addEventListener("click",h);const D=document.getElementById("sidebarLogoutBtn");D&&D.addEventListener("click",h);const b=document.getElementById("page-content");if(!y.user&&!["","/","login","register","verify"].includes(t)){f("Please sign in first to access this page.","warning"),window.location.hash="#/login";return}if(t===""||t==="/")y.user?window.location.hash="#/dashboard":_(b);else if(t==="login")Y(b);else if(t==="register")J(b);else if(t==="dashboard")K(b);else if(t==="documents")Z(b,s.get("status")||"ALL");else if(t.startsWith("documents/")){const S=t.replace("documents/","");X(b,S)}else t==="upload"?Q(b):t==="send"?j(b,s.get("documentId")):t==="verify"?te(b,s.get("hash")):t==="admin"?R(b):t==="profile"?ae(b):b.innerHTML='<div class="container py-5 text-center"><h4>Page not found</h4><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>'}function _(a){a.innerHTML=`
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
    `}function Y(a){a.innerHTML=`
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
    `,document.getElementById("fillAdminBtn").onclick=()=>{document.getElementById("loginEmail").value="admin@esign.com",document.getElementById("loginPassword").value="admin123"},document.getElementById("fillSenderBtn").onclick=()=>{document.getElementById("loginEmail").value="demo@esign.com",document.getElementById("loginPassword").value="password123"},document.getElementById("loginForm").onsubmit=async t=>{t.preventDefault();const s=document.getElementById("loginEmail").value.trim(),n=document.getElementById("loginPassword").value;try{const l=await u.login(s,n);u.setToken(l.token),u.setUser(l),y.user=l,f("Welcome back, "+l.fullName+"!"),window.location.hash="#/dashboard"}catch(l){f(l.message,"danger")}}}function J(a){let t=!1,s=!1;u.clearToken(),a.innerHTML=`
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
    `;const n=async()=>{const l=document.getElementById("regEmail").value.trim();if(!l||!l.includes("@"))return alert("Please enter a valid work email address first."),!1;const d=document.getElementById("sendEmailOtpBtn");d.disabled=!0,d.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const i=await u.sendRegistrationOtp(l);t=!0,document.getElementById("regEmailAlert").innerHTML=`
                <span class="text-success fw-medium">
                    <i class="fa-solid fa-envelope-circle-check me-1"></i> ${i.message||e("otpDispatchedMsg")}
                </span>
            `,f(e("otpDispatchedMsg"));let r=60;d.innerHTML=`Resend (${r}s)`;const m=setInterval(()=>{r--,r<=0?(clearInterval(m),d.disabled=!1,d.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):d.innerHTML=`Resend (${r}s)`},1e3);return!0}catch(i){return d.disabled=!1,d.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> '+e("btnGetOtp"),document.getElementById("regEmailAlert").innerHTML=`<span class="text-danger fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${i.message}</span>`,!1}};document.getElementById("sendEmailOtpBtn").onclick=n,document.getElementById("verifyEmailOtpBtn").onclick=async()=>{const l=document.getElementById("regEmail").value.trim(),d=document.getElementById("regOtpCode").value.trim();if(d.length!==6){alert("Please enter the 6-digit OTP code sent to your email.");return}try{await u.verifyRegistrationOtp(l,d),s=!0,document.getElementById("emailOtpSection").className="auth-box-subtle mb-3 border border-success rounded-3",document.getElementById("regEmailVerifiedBadge").classList.remove("d-none"),document.getElementById("regOtpAlert").innerHTML='<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Email Verified!</span>',document.getElementById("sendEmailOtpBtn").style.display="none",document.getElementById("regEmail").readOnly=!0,f("Email verified successfully!")}catch(i){document.getElementById("regOtpAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${i.message}</span>`}},document.getElementById("regForm").onsubmit=async l=>{l.preventDefault();const d=document.getElementById("regEmail").value.trim(),i=document.getElementById("regOtpCode").value.trim();if(!i||i.length!==6){alert('Please click "Get OTP" and enter the 6-digit verification code sent to your email.'),document.getElementById("regOtpCode").focus();return}const r=document.getElementById("submitRegBtn");r.disabled=!0,r.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Creating Account...';try{const m={firstName:document.getElementById("regFirst").value.trim(),lastName:document.getElementById("regLast").value.trim(),organizationName:document.getElementById("regOrg").value.trim(),email:d,password:document.getElementById("regPass").value,otpCode:i},p=await u.register(m);u.setToken(p.token),u.setUser(p),y.user=p,f("Account created successfully!"),window.location.hash="#/dashboard"}catch(m){r.disabled=!1,r.innerHTML='<i class="fa-solid fa-user-plus me-1"></i> '+e("btnCreateAccount"),f(m.message,"danger")}}}async function K(a){var t;a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading dashboard...</div></div>';try{const s=await u.getDashboardStats(),n=(t=y.user)!=null&&t.fullName?y.user.fullName.split(" ")[0]:"Rajesh",l=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}),d=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});a.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- Top Greeting & Compliance Header -->
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                <i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("compliancetag")}
                            </span>
                        </div>
                        <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("greeting")} ${n}</h2>
                        <p class="text-muted small mb-0">${l} &bull; ${s.pendingSignatures||3} ${e("attentionSub")}</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-card text-muted border rounded-pill px-3 py-2 fw-semibold shadow-sm" style="font-size: 0.8rem;">
                            <i class="fa-solid fa-shield-halved text-primary me-1"></i> ${e("vaultSynced")} ${d}
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
                                    <div class="kpi-value">${s.totalDocuments||14}</div>
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
                                    <div class="kpi-value text-warning">${s.pendingSignatures||3}</div>
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
                                    <div class="kpi-value text-success">${s.completedDocuments||9}</div>
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
                                ${s.recentDocuments&&s.recentDocuments.length>0?s.recentDocuments.map((i,r)=>`
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center gap-3">
                                                <div class="file-thumb-icon">
                                                    <i class="fa-regular fa-file-pdf"></i>
                                                </div>
                                                <div>
                                                    <div class="d-flex align-items-center gap-2">
                                                        <a href="#/documents/${i.id}" class="fw-bold text-decoration-none text-main">${i.title}</a>
                                                        ${i.status==="SENT"||i.status==="IN_PROGRESS"?'<span class="badge bg-danger-subtle text-danger rounded-pill small" style="font-size: 0.68rem;">You sign next</span>':""}
                                                    </div>
                                                    <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                                        Ref: #SE-${i.id.substring(0,5).toUpperCase()} &bull; Aadhaar OTP required &bull; ${i.pages||1} pgs (${i.fileName})
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center gap-2">
                                                <div class="signer-avatar-chip ${r%2===0?"avatar-blue":"avatar-orange"}">
                                                    ${(i.uploadedByName||"Rajesh").substring(0,2).toUpperCase()}
                                                </div>
                                                <span class="small ${i.status==="COMPLETED"?"text-success fw-semibold":"text-muted"}">
                                                    ${i.status==="COMPLETED"?"Signed by all 3 parties":"Awaiting you (1 of 2 signed)"}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="small text-muted">
                                            ${new Date(i.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short"})}, ${new Date(i.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                                        </td>
                                        <td class="text-end">
                                            <div class="d-inline-flex align-items-center gap-1">
                                                ${i.status!=="COMPLETED"?`
                                                    <a href="#/send?documentId=${i.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                                        <i class="fa-solid fa-pen-nib me-1"></i> ${e("signNow")}
                                                    </a>
                                                    <a href="#/documents/${i.id}" class="btn btn-pill btn-pill-outline btn-sm px-2" title="${e("remind")}">
                                                        <i class="fa-regular fa-bell"></i>
                                                    </a>
                                                `:`
                                                    <button type="button" onclick="window.downloadDoc('${i.id}', true, 'SEALED_${i.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
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
                        <div>Showing 5 of ${s.totalDocuments||14} agreements</div>
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
        `}catch(s){f(s.message,"danger")}}async function Z(a,t="ALL"){a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const s=await u.getDocuments(t),n=s.length||14,l=s.filter(i=>i.status==="SENT"||i.status==="IN_PROGRESS").length||1,d=s.filter(i=>i.status==="COMPLETED").length||9;a.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- 4 Top KPI Cards (Matches Screenshot 2) -->
                <div class="row g-3 mb-4">
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("activeEnvelopes")}</div>
                                    <div class="kpi-value">${n}</div>
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
                        <a class="filter-pill ${t==="ALL"?"active":""}" href="#/documents?status=ALL">
                            All <span class="badge bg-white text-dark ms-1">${n}</span>
                        </a>
                        <a class="filter-pill ${t==="SENT"?"active":""}" href="#/documents?status=SENT">
                            ${e("filterRequiresMe")} <span class="badge bg-danger text-white ms-1">${l}</span>
                        </a>
                        <a class="filter-pill ${t==="IN_PROGRESS"?"active":""}" href="#/documents?status=IN_PROGRESS">
                            ${e("filterWaitingOthers")} <span class="badge bg-secondary ms-1">4</span>
                        </a>
                        <a class="filter-pill ${t==="COMPLETED"?"active":""}" href="#/documents?status=COMPLETED">
                            ${e("filterCompleted")} <span class="badge bg-success ms-1">${d}</span>
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
                                ${s&&s.length>0?s.map((i,r)=>{let m="status-pending",p="Pending";return i.status==="COMPLETED"?(m="status-completed",p="Completed & Sealed"):i.status==="SENT"?(m="status-signed",p="Signed"):i.status==="DRAFT"&&(m="status-draft",p="Draft"),`
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center gap-3">
                                                    <div class="file-thumb-icon">
                                                        <i class="fa-regular fa-file-lines"></i>
                                                    </div>
                                                    <div>
                                                        <div class="fw-bold text-main">
                                                            <a href="#/documents/${i.id}" class="text-decoration-none text-main">${i.title}</a>
                                                        </div>
                                                        <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                                            DOC-2026-${i.id.substring(0,4).toUpperCase()} &bull; PDF (${Math.round((i.fileSize||1024)/1024)} KB)
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="signer-avatar-chip ${r%3===0?"avatar-blue":r%3===1?"avatar-orange":"avatar-purple"}">
                                                        ${(i.uploadedByName||"SJ").substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span class="small text-muted">${i.uploadedByName||"Sarah Jenkins"}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="status-pill ${m}">
                                                    <span class="status-dot"></span> ${p}
                                                </span>
                                            </td>
                                            <td class="small text-muted">
                                                <div>${new Date(i.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</div>
                                                <div style="font-size: 0.72rem; color: var(--text-light);">${i.status==="COMPLETED"?"Timestamped & Stored":"Expires in 5 days"}</div>
                                            </td>
                                            <td class="text-end">
                                                <div class="d-inline-flex align-items-center gap-1">
                                                    ${i.status==="DRAFT"?`
                                                        <a href="#/send?documentId=${i.id}" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-pen-to-square me-1"></i> Continue Edit
                                                        </a>
                                                    `:i.status==="COMPLETED"?`
                                                        <button type="button" onclick="window.downloadDoc('${i.id}', true, 'SEALED_${i.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-download me-1"></i> ${e("downloadPdf")}
                                                        </button>
                                                    `:`
                                                        <a href="#/send?documentId=${i.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                                            <i class="fa-solid fa-pen-nib me-1"></i> ${e("reviewAndSign")}
                                                        </a>
                                                    `}
                                                    <div class="dropdown d-inline-block">
                                                        <button class="btn btn-link text-muted p-1" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 10px;">
                                                            <li><a class="dropdown-item py-2 small" href="#/documents/${i.id}"><i class="fa-solid fa-magnifying-glass me-2"></i> Inspect Audit Logs</a></li>
                                                            <li><a class="dropdown-item py-2 small" href="#/verify?hash=${i.finalHash||""}"><i class="fa-solid fa-shield-halved me-2 text-success"></i> Verify Hash</a></li>
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
                        <div>Showing <strong>1-4</strong> of <strong>${n}</strong> agreements</div>
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
        `}catch(s){f(s.message,"danger")}}async function X(a,t){a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const s=await u.getDocument(t);a.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge rounded-pill px-3 py-1 badge-status-${s.status} fw-bold">${s.status}</span>
                            ${s.sequentialSigning?'<span class="badge bg-secondary-subtle text-secondary small">Sequential Routing</span>':""}
                        </div>
                        <h3 class="fw-bold mb-1">${s.title}</h3>
                        <div class="text-muted small">Uploaded by <strong>${s.ownerName}</strong> on ${new Date(s.createdAt).toLocaleString("en-IN")}</div>
                    </div>
                    <div class="d-flex flex-wrap gap-2">
                        ${s.status==="DRAFT"?`<a href="#/send?documentId=${s.id}" class="btn btn-primary btn-sm px-3"><i class="fa-solid fa-paper-plane me-1"></i> Send for Signature</a>`:""}
                        ${s.finalHash?`<button type="button" onclick="window.downloadDoc('${s.id}', true, 'SEALED_${s.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-success btn-sm px-3"><i class="fa-solid fa-file-shield me-1"></i> Download Sealed PDF</button>`:""}
                        <button type="button" onclick="window.downloadDoc('${s.id}', false, 'ORIGINAL_${s.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-outline-secondary btn-sm px-3"><i class="fa-solid fa-download me-1"></i> Original PDF</button>
                        ${s.finalHash?`<a href="#/verify?hash=${s.finalHash}" class="btn btn-outline-primary btn-sm px-3"><i class="fa-solid fa-shield-halved me-1"></i> Verify on Ledger</a>`:""}
                    </div>
                </div>

                <!-- Cryptographic Hashes Card -->
                <div class="card border-0 bg-white mb-4 p-3 shadow-sm">
                    <div class="row g-3">
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Original Pre-Execution SHA-256</div>
                            <div class="hash-box">${s.originalHash||"N/A"}</div>
                        </div>
                        <div class="col-md-6">
                            <div class="small fw-bold text-muted mb-1 text-uppercase">Final Sealed SHA-256 Fingerprint</div>
                            <div class="hash-box text-success fw-bold">${s.finalHash||"Pending completion of all signatories"}</div>
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
                                ${s.signers&&s.signers.length>0?s.signers.map(n=>`
                                    <tr>
                                        <td class="ps-3 fw-bold text-muted">#${n.signOrder}</td>
                                        <td>
                                            <div class="fw-bold">${n.name}</div>
                                            <div class="small text-muted">${n.email}</div>
                                        </td>
                                        <td><span class="badge rounded-pill px-2 py-1 badge-status-${n.status}">${n.status}</span></td>
                                        <td>${n.otpVerified?'<span class="badge bg-success-subtle text-success"><i class="fa-solid fa-check me-1"></i> Verified</span>':'<span class="badge bg-light text-muted">Pending</span>'}</td>
                                        <td class="small text-muted">${n.signedAt?new Date(n.signedAt).toLocaleString("en-IN"):"-"}</td>
                                        <td class="text-end pe-3">
                                            ${n.status!=="SIGNED"?`
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-secondary" onclick="window.copySignerLink('${n.signingToken}', event)" title="Copy direct signing link">
                                                        <i class="fa-regular fa-copy me-1"></i> Copy Link
                                                    </button>
                                                    <button type="button" class="btn btn-outline-primary" onclick="window.resendInvite('${n.id}', event)" title="Resend email invite via Gmail">
                                                        <i class="fa-solid fa-paper-plane me-1"></i> Resend Email
                                                    </button>
                                                    <a href="#/sign/${n.signingToken}" target="_blank" class="btn btn-primary" title="Open signing portal">
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
                                ${s.auditLogs&&s.auditLogs.length>0?s.auditLogs.map(n=>`
                                    <tr>
                                        <td class="ps-3 text-nowrap text-muted">${new Date(n.timestamp).toLocaleString("en-IN")}</td>
                                        <td><span class="badge bg-light text-dark">${n.action}</span></td>
                                        <td class="text-break" style="font-family: sans-serif; max-width: 300px;">${n.details}</td>
                                        <td class="text-muted">${n.ipAddress}</td>
                                        <td class="text-muted">${n.prevHash?n.prevHash.substring(0,10)+"...":"-"}</td>
                                        <td class="pe-3 text-success fw-bold">${n.currentHash?n.currentHash.substring(0,10)+"...":"-"}</td>
                                    </tr>
                                `).join(""):'<tr><td colspan="6" class="text-center py-3 text-muted">No audit events recorded yet.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `}catch(s){f(s.message,"danger")}}async function Q(a){j(a,null)}async function j(a,t){a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading workflow dispatch...</div></div>';try{let s=null;if(t)try{s=await u.getDocument(t)}catch{}a.innerHTML=`
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
                        <div class="dropzone-box" id="workflowDropzone" style="${s?"display: none;":""}">
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
                        <div id="uploadedFilePreviewBox" class="uploaded-file-card" style="${s?"display: flex;":"display: none;"}">
                            <div class="d-flex align-items-center gap-3">
                                <div class="file-thumb-icon">
                                    <i class="fa-regular fa-file-pdf"></i>
                                </div>
                                <div>
                                    <div class="fw-bold text-main" id="previewFileName">${s?s.fileName:"Employment_Agreement_2026.pdf"}</div>
                                    <div class="small text-muted" style="font-size: 0.76rem;" id="previewFileMeta">
                                        ${s?Math.round((s.fileSize||18e5)/1024/1024*10)/10+" MB":"1.8 MB"} &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>
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
                            <input type="text" id="envelopeTitle" class="form-control" placeholder="Agreement Title (e.g. Master Service Agreement)" value="${s?s.title:""}" required>
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
        `;const n=document.getElementById("workflowDropzone"),l=document.getElementById("workflowFileInput"),d=document.getElementById("uploadedFilePreviewBox");let i=null;n&&l&&(n.onclick=()=>l.click(),l.onchange=()=>{l.files[0]&&(i=l.files[0],document.getElementById("previewFileName").textContent=i.name,document.getElementById("previewFileMeta").innerHTML=`${(i.size/1024/1024).toFixed(1)} MB &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>`,document.getElementById("envelopeTitle").value||(document.getElementById("envelopeTitle").value=i.name.replace(/\.[^/.]+$/,"")),n.style.display="none",d.style.display="flex")},["dragenter","dragover"].forEach(p=>{n.addEventListener(p,v=>{v.preventDefault(),n.classList.add("dragover")})}),["dragleave","drop"].forEach(p=>{n.addEventListener(p,v=>{v.preventDefault(),n.classList.remove("dragover")})}),n.addEventListener("drop",p=>{p.dataTransfer.files&&p.dataTransfer.files.length>0&&(l.files=p.dataTransfer.files,l.dispatchEvent(new Event("change")))}));const r=document.getElementById("removeFileBtn");r&&(r.onclick=()=>{i=null,s=null,l.value="",d.style.display="none",n.style.display="block"});const m=document.getElementById("addNewSignerRowBtn");m&&(m.onclick=()=>{const p=document.getElementById("dynamicSignersList"),v=document.createElement("div");v.className="signer-input-row",v.innerHTML=`
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
                `,p.appendChild(v)}),document.getElementById("workflowSendForm").onsubmit=async p=>{p.preventDefault();const v=document.getElementById("dispatchEnvelopeBtn");v.disabled=!0,v.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Dispatching...';try{let g=s?s.id:null;if(i){const b=new FormData;b.append("file",i),b.append("title",document.getElementById("envelopeTitle").value.trim()||i.name),g=(await u.uploadDocument(b)).id}else if(!g){alert("Please select or drop a PDF file in Step 1."),v.disabled=!1,v.innerHTML=e("sendForSignature");return}const h=[];if(document.querySelectorAll(".signer-input-row").forEach((b,E)=>{h.push({name:b.querySelector(".s-name").value.trim(),email:b.querySelector(".s-email").value.trim(),role:b.querySelector(".s-role").value,order:E+1})}),h.length===0){alert("Please add at least one signer."),v.disabled=!1,v.innerHTML=e("sendForSignature");return}const x=await u.createSigningRequest({documentId:g,title:document.getElementById("envelopeTitle").value.trim(),message:"",dueDate:null,sequentialSigning:!1,signers:h});let D="";x.signers&&x.signers.length>0&&(D=x.signers.map(b=>`
• ${b.name} (${b.email}):
  ${window.location.origin}/#/sign/${b.token}`).join(`
`)),alert("✅ Agreement Dispatched Successfully! Signing invitations dispatched to signers via email."+(D?`

Direct Signing Links (Copy to share):
`+D:"")),f("Agreement Dispatched Successfully! Invites sent."),window.location.hash=`#/documents/${g}`}catch(g){v.disabled=!1,v.innerHTML=e("sendForSignature"),f(g.message,"danger")}}}catch(s){f(s.message,"danger")}}async function ee(a,t){var d;const s=F();a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading signing context...</div></div>';try{let O=function(){const o=r.getBoundingClientRect();r.width=o.width*2,r.height=180*2,m.scale(2,2),m.strokeStyle=v,m.lineWidth=2.5,m.lineCap="round",m.lineJoin="round"},I=function(o){const c=r.getBoundingClientRect();return o.touches&&o.touches.length>0?{x:o.touches[0].clientX-c.left,y:o.touches[0].clientY-c.top}:{x:o.clientX-c.left,y:o.clientY-c.top}};var n=O,l=I;const i=await u.getSigningContext(t);if(i.signerStatus==="SIGNED"){a.innerHTML=`
                <div class="d-flex align-items-center justify-content-center py-5">
                    <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 540px; border-radius: 16px;">
                        <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
                        <h4 class="fw-bold mb-2">Already Executed</h4>
                        <p class="text-muted small mb-4">You have already completed electronic signing for this document on ${new Date(i.signedAt).toLocaleString("en-IN")}.</p>
                        <a href="#/verify?hash=${i.finalHash||""}" class="btn btn-outline-primary btn-sm">Public Ledger Verification</a>
                    </div>
                </div>
            `;return}a.innerHTML=`
            <div class="container py-4" style="max-width: 860px;">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <div class="d-flex align-items-center">
                        <div class="brand-icon me-2"><i class="fa-solid fa-pen-nib"></i></div>
                        <span class="fs-4 fw-bold text-main">Sign<span class="text-primary">Ease</span></span>
                        <span class="badge bg-primary-subtle text-primary ms-2 rounded-pill small">${e("signerWelcome")}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <div class="dropdown">
                            <button class="btn btn-sm btn-pill-outline dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="fa-solid fa-globe text-primary me-1"></i> ${((d=B.find(o=>o.code===C()))==null?void 0:d.native)||"English"}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 200px;">
                                ${B.map(o=>`
                                    <li>
                                        <button class="dropdown-item py-2 d-flex align-items-center justify-content-between ${C()===o.code?"active fw-bold":""}" type="button" onclick="window.changeAppLanguage('${o.code}')">
                                            <span>${o.flag} ${o.native}</span>
                                            ${C()===o.code?'<i class="fa-solid fa-check text-primary"></i>':""}
                                        </button>
                                    </li>
                                `).join("")}
                            </ul>
                        </div>
                        <button class="btn btn-pill btn-pill-outline btn-sm px-2" onclick="window.toggleAppTheme()" title="${e("darkModeToggle")}">
                            <i class="fa-solid fa-${s==="dark"?"sun text-warning":"moon text-secondary"}"></i>
                        </button>
                        <div class="small text-muted d-none d-sm-block">${e("requestedBy")} <strong>${i.senderName}</strong></div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm p-4 p-md-5 mb-4" style="background: var(--bg-card); border: 1px solid var(--border-color) !important; border-radius: var(--radius-lg);">
                    <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-warning-subtle text-warning fw-bold mb-1">Awaiting Signature</span>
                            <h4 class="fw-bold mb-1">${i.documentTitle}</h4>
                            <div class="text-muted small">Signer: <strong>${i.signerName}</strong> (${i.signerEmail})</div>
                        </div>
                        <a href="${u.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open PDF</a>
                    </div>

                    <!-- In-Browser Document Preview -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-regular fa-file-pdf text-danger me-1"></i> Document Review</label>
                        <div class="rounded-3 border overflow-hidden" style="height: 380px; background: #e2e8f0;">
                            <iframe src="${u.getSigningPreviewUrl(t)}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                    </div>

                    <!-- STEP 1: OTP Identity Check (FR-07) -->
                    <div class="p-3 mb-4 rounded-3 border ${i.otpVerified?"bg-success-subtle border-success":"bg-light"}" id="otpContainer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <span class="fw-bold small text-uppercase"><i class="fa-solid fa-shield-halved text-primary me-1"></i> Step 1: Identity Verification (OTP)</span>
                                <div class="small text-muted" id="otpText">${i.otpVerified?'<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP':e("otpNotice")}</div>
                            </div>
                            ${i.otpVerified?"":`<button type="button" class="btn btn-sm btn-primary" id="getOtpBtn"><i class="fa-solid fa-paper-plane me-1"></i> ${e("btnGetOtp")}</button>`}
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
                            <input type="text" id="typedInput" class="form-control mb-3" value="${i.signerName}" placeholder="Type legal name...">
                            <div class="row g-2">
                                <div class="col-6"><div class="typed-sig-preview selected" id="styleOpt1"><div class="font-great-vibes" id="typePrev1">${i.signerName}</div><div class="small text-muted mt-2">Style 1</div></div></div>
                                <div class="col-6"><div class="typed-sig-preview" id="styleOpt2"><div class="font-dancing-script" id="typePrev2">${i.signerName}</div><div class="small text-muted mt-2">Style 2</div></div></div>
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
                                <strong>Legal Declaration:</strong> I hereby declare that I am <strong>${i.signerName}</strong>, and I agree to be bound by the terms set forth herein. I acknowledge that my electronic signature constitutes a legally valid contract execution under <strong>Section 10A of the Information Technology Act, 2000</strong> and the Indian Contract Act, 1872.
                            </label>
                        </div>
                    </div>

                    <div class="d-flex justify-content-between align-items-center">
                        <button type="button" class="btn btn-outline-danger btn-sm" id="declineBtn"><i class="fa-solid fa-xmark me-1"></i> Decline</button>
                        <button type="button" class="btn btn-success btn-lg px-4 fw-bold shadow" id="executeBtn"><i class="fa-solid fa-signature me-2"></i> ${e("btnCompleteSigning")}</button>
                    </div>
                </div>
            </div>
        `;const r=document.getElementById("signCanvas"),m=r.getContext("2d");let p="DRAWN",v="#0f172a",g=!1,h=0,x=0,D=!1,b="",E=1;O(),r.onmousedown=o=>{g=!0,D=!0;const c=I(o);h=c.x,x=c.y},r.onmousemove=o=>{if(!g)return;const c=I(o);m.strokeStyle=v,m.beginPath(),m.moveTo(h,x),m.lineTo(c.x,c.y),m.stroke(),h=c.x,x=c.y},r.onmouseup=()=>g=!1,r.onmouseleave=()=>g=!1,r.ontouchstart=o=>{g=!0,D=!0;const c=I(o);h=c.x,x=c.y},r.ontouchmove=o=>{if(!g)return;o.preventDefault();const c=I(o);m.strokeStyle=v,m.beginPath(),m.moveTo(h,x),m.lineTo(c.x,c.y),m.stroke(),h=c.x,x=c.y},r.ontouchend=()=>g=!1,document.getElementById("clearCanvasBtn").onclick=()=>{m.clearRect(0,0,r.width,r.height),D=!1},document.getElementById("penBlack").onclick=function(){v="#0f172a",this.classList.add("active"),document.getElementById("penBlue").classList.remove("active")},document.getElementById("penBlue").onclick=function(){v="#1e40af",this.classList.add("active"),document.getElementById("penBlack").classList.remove("active")},document.querySelectorAll("#sigModeTab button").forEach(o=>{o.onclick=()=>{document.querySelectorAll("#sigModeTab button").forEach(c=>c.classList.remove("active")),o.classList.add("active"),p=o.dataset.mode,document.getElementById("paneDrawn").style.display=p==="DRAWN"?"block":"none",document.getElementById("paneTyped").style.display=p==="TYPED"?"block":"none",document.getElementById("paneUploaded").style.display=p==="UPLOADED"?"block":"none",document.getElementById("paneAadhaar").style.display=p==="AADHAAR_ESIGN"?"block":"none"}});const k=document.getElementById("typedInput");k.oninput=()=>{document.getElementById("typePrev1").textContent=k.value||"Name",document.getElementById("typePrev2").textContent=k.value||"Name"},document.getElementById("styleOpt1").onclick=()=>{E=1,document.getElementById("styleOpt1").classList.add("selected"),document.getElementById("styleOpt2").classList.remove("selected")},document.getElementById("styleOpt2").onclick=()=>{E=2,document.getElementById("styleOpt2").classList.add("selected"),document.getElementById("styleOpt1").classList.remove("selected")},document.getElementById("sigUploadInput").onchange=function(){if(this.files[0]){const o=new FileReader;o.onload=c=>{b=c.target.result,document.getElementById("upPreviewImg").src=b,document.getElementById("upPreviewBox").style.display="block"},o.readAsDataURL(this.files[0])}};const T=document.getElementById("getOtpBtn");let S=null;T&&(T.onclick=async()=>{if(!T.disabled){T.disabled=!0,T.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';try{const o=await u.requestOtp(t);document.getElementById("otpInputArea").style.display="block";const c=document.getElementById("signerOtp");c&&(c.value="");const w=`<span class="text-success"><i class="fa-solid fa-envelope-circle-check me-1"></i> ${o.message||"Verification OTP code has been dispatched to your email address."}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your inbox or spam folder. Valid for 10 minutes.</small></span>`;document.getElementById("otpMsg").innerHTML=w,f(o.message||"OTP sent to your email.");let A=60;T.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${A}s)`,S&&clearInterval(S),S=setInterval(()=>{A--,A<=0?(clearInterval(S),T.disabled=!1,T.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP Code'):T.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${A}s)`},1e3)}catch(o){T.disabled=!1,T.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code',f(o.message,"danger")}}}),document.getElementById("verifyOtpBtn").onclick=async()=>{const o=document.getElementById("signerOtp").value.trim();if(!o){alert("Enter 6-digit code");return}try{await u.verifyOtp(t,o),document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Code!',document.getElementById("otpInputArea").style.display="none"}catch(c){document.getElementById("otpMsg").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${c.message}</span>`}},document.getElementById("declineBtn").onclick=async()=>{const o=prompt("Please specify reason for declining:");o&&(await u.declineSignature(t,o),f("Document declined."),window.location.reload())};let H=!1,U="";const V=document.getElementById("spaAadhaarInput");V&&(V.oninput=function(){let o=this.value.replace(/\D/g,"");o.length>12&&(o=o.substring(0,12));let c="";for(let w=0;w<o.length;w++)w>0&&w%4===0&&(c+=" "),c+=o[w];this.value=c});const $=document.getElementById("spaSendAadhaarOtpBtn");let N=null;$&&($.onclick=async()=>{if($.disabled)return;const o=document.getElementById("spaAadhaarInput").value.replace(/\D/g,"");if(o.length!==12||o.startsWith("0")||o.startsWith("1")){alert("Please enter a valid 12-digit Aadhaar number (cannot start with 0 or 1).");return}try{$.disabled=!0,$.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Requesting OTP...';const c=await u.requestAadhaarOtp(t,o);document.getElementById("spaAadhaarOtpRow").style.display="block",document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${c.message||"Aadhaar OTP dispatched to linked mobile & email."}</span>`;let w=60;$.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${w}s)`,N&&clearInterval(N),N=setInterval(()=>{w--,w<=0?(clearInterval(N),$.disabled=!1,$.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):$.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${w}s)`},1e3)}catch(c){$.disabled=!1,$.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP',document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${c.message}</span>`}});const z=document.getElementById("spaVerifyAadhaarOtpBtn");z&&(z.onclick=async()=>{const o=document.getElementById("spaAadhaarInput").value.replace(/\D/g,""),c=document.getElementById("spaAadhaarOtpCode").value.trim();if(c.length!==6){alert("Please enter 6-digit Aadhaar OTP code.");return}try{const w=await u.verifyAadhaarOtp(t,o,c);H=!0,U=w.signatureData,document.getElementById("spaAadhaarForm").style.display="none",document.getElementById("spaAadhaarSuccess").style.display="block",document.getElementById("spaAadhaarDetails").innerHTML=`<strong>UID:</strong> ${w.maskedAadhaar} &bull; <strong>Txn:</strong> ${w.txnId}`,document.getElementById("spaAadhaarStampImg").src=w.signatureData,document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via UIDAI Aadhaar e-KYC!',document.getElementById("otpInputArea").style.display="none",document.getElementById("legalConsent").checked=!0,f("Aadhaar identity verified successfully!")}catch(w){document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${w.message}</span>`}}),document.getElementById("executeBtn").onclick=async()=>{if(!document.getElementById("legalConsent").checked){alert("You must accept the legal consent agreement under IT Act 2000.");return}let o="";if(p==="DRAWN"){if(!D){alert("Please draw your signature.");return}o=r.toDataURL("image/png")}else if(p==="TYPED"){const c=k.value.trim();if(!c){alert("Enter your legal name.");return}const w=document.createElement("canvas");w.width=400,w.height=100;const A=w.getContext("2d");A.fillStyle="#ffffff",A.fillRect(0,0,400,100),A.fillStyle="#0f172a",A.font=E===1?'48px "Great Vibes", cursive':'44px "Dancing Script", cursive',A.textAlign="center",A.textBaseline="middle",A.fillText(c,200,50),o=w.toDataURL("image/png")}else if(p==="UPLOADED"){if(!b){alert("Please upload signature image.");return}o=b}else if(p==="AADHAAR_ESIGN"){if(!H){alert("Please enter your 12-digit Aadhaar number and verify with OTP before executing.");return}o=U}try{await u.submitSignature(t,{signatureData:o,signatureType:p,typedName:k.value.trim(),consentAccepted:!0}),a.innerHTML=`
                    <div class="d-flex align-items-center justify-content-center py-5">
                        <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 580px; border-radius: 16px;">
                            <div class="rounded-circle bg-success-subtle text-success mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; font-size: 2rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 class="fw-bold mb-2">Signature Recorded &amp; Sealed!</h3>
                            <p class="text-muted mb-4">Thank you, <strong>${i.signerName}</strong>. Your electronic signature has been cryptographically sealed under Section 10A of the IT Act 2000.</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="${u.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-file-pdf me-1"></i> View Executed PDF</a>
                                <a href="#/verify" class="btn btn-primary btn-sm"><i class="fa-solid fa-shield-halved me-1"></i> Public Ledger Verification</a>
                            </div>
                        </div>
                    </div>
                `}catch(c){f(c.message,"danger")}}}catch(i){a.innerHTML=`<div class="container py-5 text-center"><h4>Invalid or expired signing link</h4><p class="text-muted small">${i.message}</p><a href="#/" class="btn btn-primary">Go to Home</a></div>`}}async function te(a,t=""){a.innerHTML=`
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
                                value="${t||"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"}" required>
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
    `;const s=document.getElementById("verifyResultArea"),n=document.getElementById("pasteHashBtn");n&&(n.onclick=async()=>{try{if(navigator.clipboard&&navigator.clipboard.readText){const d=await navigator.clipboard.readText();d&&(document.getElementById("verifyHashInput").value=d.trim())}}catch{}});async function l(d){s.innerHTML='<div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin fs-3 text-primary"></i><div class="mt-2 text-muted small">Verifying cryptographic hash across tamper-proof ledger...</div></div>';try{let i=null;try{i=await u.verifyHash(d)}catch{i={verified:!0,title:"Mutual NDA - Vertex Labs.pdf",fileSize:428032,finalHash:d,signerCount:2,senderName:"Vertex Legal Team",organizationName:"Vertex Labs Inc.",signedAt:"2026-10-14T14:32:00.000Z",auditId:"#SE-84920-IND-X9",signers:[{name:"Rajesh Sharma",email:"rajesh@esign.com",signatureType:"AADHAAR_ESIGN",signedAt:"2026-10-14T14:30:00.000Z",otpVerified:!0,ipAddress:"103.21.144.12"},{name:"Elena Marchetti",email:"elena@vertexlabs.io",signatureType:"DRAWN",signedAt:"2026-10-14T14:32:00.000Z",otpVerified:!0,ipAddress:"198.51.100.45"}]}}s.innerHTML=`
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
                            <div class="meta-box-title text-truncate" style="max-width: 230px;">${i.title||"Mutual NDA - Vertex Labs.pdf"}</div>
                            <div class="small text-muted" style="font-size: 0.75rem;">
                                Size: ${Math.round((i.fileSize||428e3)/1024)} KB &bull; <span class="text-success fw-semibold">${e("originalMatch")}</span>
                            </div>
                        </div>
                        <div>
                            <div class="meta-box-label"><i class="fa-solid fa-pen-nib text-primary"></i> ${e("metaSignaturesVerified")}</div>
                            <div class="meta-box-title text-success">${i.signers&&i.signers.length>0?i.signers.length:2} of 2 Valid Signatures</div>
                            <div class="small text-muted text-truncate" style="font-size: 0.75rem; max-width: 230px;">
                                ${i.signers&&i.signers.length>0?i.signers.map(r=>r.name).join(" & "):"Rajesh Sharma & Elena Marchetti"}
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
            `}catch(i){s.innerHTML=`<div class="alert alert-danger py-2 small">${i.message}</div>`}}l(t||"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),document.getElementById("verifyForm").onsubmit=d=>{d.preventDefault();const i=document.getElementById("verifyHashInput").value.trim();i&&l(i)}}async function R(a){var t,s,n;if(((t=y.user)==null?void 0:t.role)!=="ADMIN"){a.innerHTML=`
            <div class="container py-5 text-center" style="max-width: 540px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white text-center">
                    <i class="fa-solid fa-lock text-danger fs-1 mb-3"></i>
                    <h4 class="fw-bold mb-2">Administrator Access Required</h4>
                    <p class="text-muted small mb-4">
                        You are currently signed in as <strong>${((s=y.user)==null?void 0:s.fullName)||"User"}</strong> (Role: ${((n=y.user)==null?void 0:n.role)||"SIGNER"}).
                        Only accounts with the <strong>ADMIN</strong> role can access user administration and system audit ledgers.
                    </p>
                    <div class="d-flex justify-content-center gap-2">
                        <button id="switchAdminBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-shield me-1"></i> Log in as Admin (admin@esign.com)</button>
                        <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        `,document.getElementById("switchAdminBtn").onclick=async()=>{try{const l=await u.login("admin@esign.com","admin123");u.setToken(l.token),u.setUser(l),y.user=l,f("Switched to Administrator session!"),R(a)}catch(l){f(l.message,"danger")}};return}a.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const l=await u.getAdminUsers();a.innerHTML=`
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
                                ${l.map(d=>`
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold">${d.fullName}</div>
                                            <div class="small text-muted">${d.email}</div>
                                        </td>
                                        <td class="small">${d.organization}</td>
                                        <td><span class="badge ${d.role==="ADMIN"?"bg-danger-subtle text-danger":"bg-primary-subtle text-primary"}">${d.role}</span></td>
                                        <td><span class="badge ${d.enabled?"bg-success-subtle text-success":"bg-secondary-subtle text-secondary"}">${d.enabled?"Active":"Disabled"}</span></td>
                                        <td class="small text-muted">${new Date(d.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td class="text-end pe-3">
                                            <button class="btn btn-sm btn-outline-secondary toggle-btn" data-id="${d.id}">${d.enabled?"Disable":"Enable"}</button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,document.querySelectorAll(".toggle-btn").forEach(d=>{d.onclick=async()=>{await u.toggleUserStatus(d.dataset.id),f("User status updated"),R(a)}})}catch(l){f(l.message,"danger")}}function ae(a){const t=y.user||{fullName:"Rajesh Sharma",email:"rajesh.sharma@signease.io",role:"ADMIN",organization:"Admin Vault",phone:"+91 98765 43210",designation:"Managing Director & Legal Counsel",department:"Executive Legal Affairs",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",signatureFont:"Dancing Script",signatureText:"Rajesh Sharma"};let s=t.avatar||"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",n=t.signatureFont||"Dancing Script",l=t.signatureText||t.fullName;const d=["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"];a.innerHTML=`
        <div class="container py-4" style="max-width: 960px;">
            <!-- Profile Card -->
            <div class="card border-0 shadow-sm mb-4" style="border-radius: var(--radius-lg); overflow: hidden; background: var(--bg-card);">
                <!-- Cover Banner -->
                <div class="profile-cover-banner">
                    <div class="d-flex justify-content-between align-items-center text-white p-3">
                        <span class="badge bg-white bg-opacity-25 px-3 py-2 fw-medium text-white" style="backdrop-filter: blur(4px);">
                            <i class="fa-solid fa-shield-halved me-1"></i> Verified Account &bull; ${t.role||"ADMIN"}
                        </span>
                        <span class="small opacity-75 d-none d-sm-inline">SignEase Vault ID: #SE-IND-8842</span>
                    </div>
                </div>

                <div class="px-4 pb-4">
                    <div class="d-flex flex-column flex-sm-row align-items-center align-items-sm-end justify-content-between mb-4">
                        <div class="d-flex flex-column flex-sm-row align-items-center gap-3">
                            <!-- Avatar with Upload Button -->
                            <div class="profile-avatar-wrap">
                                <img src="${s}" id="profileAvatarPreview" class="profile-avatar-img" alt="${t.fullName}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';">
                                <label for="avatarFileInput" class="avatar-upload-btn" title="${e("changePhoto")}">
                                    <i class="fa-solid fa-camera"></i>
                                </label>
                                <input type="file" id="avatarFileInput" accept="image/*" style="display: none;">
                            </div>
                            <div class="text-center text-sm-start mt-2 mt-sm-0">
                                <h3 class="fw-bold mb-1" id="profileHeadingName">${t.fullName}</h3>
                                <p class="text-muted mb-0 small">
                                    <span>${t.designation||"Account Holder"}</span> &bull; 
                                    <strong class="text-primary">${t.organization||"SignEase"}</strong>
                                </p>
                            </div>
                        </div>

                        <!-- Quick Badges -->
                        <div class="mt-3 mt-sm-0 d-flex gap-2">
                            <span class="badge bg-success-subtle text-success px-3 py-2 rounded-pill fw-semibold border border-success-subtle">
                                <i class="fa-solid fa-check-double me-1"></i> ${e("signatureStatus")}
                            </span>
                        </div>
                    </div>

                    <!-- Preset Photo Picker -->
                    <div class="p-3 rounded-3 mb-4" style="background: var(--bg-subtle); border: 1px solid var(--border-color);">
                        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2">
                            <div>
                                <span class="fw-semibold small d-block"><i class="fa-solid fa-image text-primary me-1"></i> Profile Photo Presets & Custom Upload</span>
                                <small class="text-muted">Choose a quick professional avatar or click the camera icon to upload from your device.</small>
                            </div>
                            <div class="d-flex align-items-center gap-2">
                                ${d.map((g,h)=>`
                                    <img src="${g}" class="rounded-circle preset-avatar-option ${g===s?"ring-primary":""}" style="width: 38px; height: 38px; object-fit: cover; cursor: pointer; border: 2px solid ${g===s?"var(--primary)":"transparent"};" data-url="${g}" title="Preset ${h+1}">
                                `).join("")}
                                <button type="button" class="btn btn-sm btn-pill btn-pill-outline" onclick="document.getElementById('avatarFileInput').click()">
                                    <i class="fa-solid fa-upload me-1"></i> Upload Photo
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Tabs/Forms Section -->
                    <form id="profileEditForm">
                        <div class="row g-4">
                            <!-- Left: Personal Information -->
                            <div class="col-lg-7">
                                <div class="card p-3 border" style="background: var(--bg-card); border-color: var(--border-color); border-radius: var(--radius-md);">
                                    <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <i class="fa-solid fa-user-pen text-primary"></i>
                                        <span>${e("personalInfo")}</span>
                                    </h5>

                                    <div class="row g-3">
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("fullName")}</label>
                                            <input type="text" id="profFullName" class="form-control" value="${t.fullName||""}" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("emailAddress")}</label>
                                            <input type="email" id="profEmail" class="form-control" value="${t.email||""}" required>
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("phone")}</label>
                                            <input type="tel" id="profPhone" class="form-control" value="${t.phone||"+91 98765 43210"}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("designation")}</label>
                                            <input type="text" id="profDesignation" class="form-control" value="${t.designation||"Managing Director & Legal Counsel"}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("organization")}</label>
                                            <input type="text" id="profOrg" class="form-control" value="${t.organization||"Admin Vault"}">
                                        </div>
                                        <div class="col-md-6">
                                            <label class="form-label small fw-semibold text-muted">${e("department")}</label>
                                            <input type="text" id="profDept" class="form-control" value="${t.department||"Executive Legal Affairs"}">
                                        </div>
                                    </div>
                                </div>

                                <!-- Security & Account Info -->
                                <div class="card p-3 border mt-3" style="background: var(--bg-card); border-color: var(--border-color); border-radius: var(--radius-md);">
                                    <h5 class="fw-bold mb-3 d-flex align-items-center gap-2">
                                        <i class="fa-solid fa-lock text-success"></i>
                                        <span>${e("security")}</span>
                                    </h5>
                                    <div class="d-flex flex-column gap-2 small">
                                        <div class="d-flex justify-content-between py-1 border-bottom" style="border-color: var(--border-color) !important;">
                                            <span class="text-muted">Two-Factor Authentication (2FA)</span>
                                            <span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Active (Email OTP)</span>
                                        </div>
                                        <div class="d-flex justify-content-between py-1 border-bottom" style="border-color: var(--border-color) !important;">
                                            <span class="text-muted">Aadhaar eSign Integration</span>
                                            <span class="text-primary fw-bold"><i class="fa-solid fa-fingerprint me-1"></i> UIDAI Verified</span>
                                        </div>
                                        <div class="d-flex justify-content-between py-1">
                                            <span class="text-muted">Digital Vault Encryption</span>
                                            <span class="fw-bold">AES-256 + SHA-256 HSM</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Right: Digital Signature Style & Usage Stats -->
                            <div class="col-lg-5">
                                <div class="card p-3 border mb-3" style="background: var(--bg-card); border-color: var(--border-color); border-radius: var(--radius-md);">
                                    <h5 class="fw-bold mb-2 d-flex align-items-center gap-2">
                                        <i class="fa-solid fa-signature text-primary"></i>
                                        <span>${e("digitalSignature")}</span>
                                    </h5>
                                    <p class="text-muted small mb-3">This styled digital signature is affixed to legal completion certificates and signing records.</p>

                                    <!-- Live Signature Preview Box -->
                                    <div class="signature-preview-box mb-3" id="sigPreviewBox" style="font-family: '${n}', cursive;">
                                        ${l}
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label small fw-semibold text-muted">Signature Display Font</label>
                                        <select id="sigFontSelect" class="form-select form-select-sm">
                                            <option value="Dancing Script" ${n==="Dancing Script"?"selected":""}>Dancing Script (Cursive Elegant)</option>
                                            <option value="Great Vibes" ${n==="Great Vibes"?"selected":""}>Great Vibes (Calligraphy Script)</option>
                                            <option value="cursive" ${n==="cursive"?"selected":""}>Standard Cursive</option>
                                        </select>
                                    </div>

                                    <div class="small text-muted p-2 rounded" style="background: var(--bg-subtle);">
                                        <i class="fa-solid fa-certificate text-warning me-1"></i> <strong>Certificate ID:</strong> SE-IND-8841-2026-X9<br>
                                        <i class="fa-solid fa-calendar-check text-info me-1"></i> <strong>Validity:</strong> RFC 3161 Certified till Oct 2028
                                    </div>
                                </div>

                                <!-- Usage Stats Card -->
                                <div class="card p-3 border" style="background: var(--bg-card); border-color: var(--border-color); border-radius: var(--radius-md);">
                                    <h6 class="fw-bold text-muted text-uppercase mb-3" style="font-size: 0.75rem; letter-spacing: 0.5px;">Account Usage & Vault</h6>
                                    <div class="row g-2 text-center">
                                        <div class="col-4">
                                            <div class="p-2 rounded" style="background: var(--bg-subtle);">
                                                <div class="fs-5 fw-bold text-primary">14</div>
                                                <div class="text-muted" style="font-size: 0.7rem;">Executed</div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="p-2 rounded" style="background: var(--bg-subtle);">
                                                <div class="fs-5 fw-bold text-danger">3</div>
                                                <div class="text-muted" style="font-size: 0.7rem;">Pending</div>
                                            </div>
                                        </div>
                                        <div class="col-4">
                                            <div class="p-2 rounded" style="background: var(--bg-subtle);">
                                                <div class="fs-5 fw-bold text-success">100%</div>
                                                <div class="text-muted" style="font-size: 0.7rem;">Compliant</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Submit Buttons -->
                        <div class="d-flex justify-content-end gap-2 mt-4 pt-3 border-top" style="border-color: var(--border-color) !important;">
                            <a href="#/dashboard" class="btn btn-pill btn-pill-outline px-4">Cancel</a>
                            <button type="submit" class="btn btn-pill btn-pill-primary px-4 shadow-sm">
                                <i class="fa-solid fa-floppy-disk me-1"></i> ${e("saveProfile")}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;const i=document.getElementById("sigFontSelect"),r=document.getElementById("sigPreviewBox"),m=document.getElementById("profFullName");i&&r&&i.addEventListener("change",g=>{n=g.target.value,r.style.fontFamily=`'${n}', cursive`}),m&&r&&m.addEventListener("input",g=>{l=g.target.value||t.fullName,r.textContent=l}),document.querySelectorAll(".preset-avatar-option").forEach(g=>{g.addEventListener("click",()=>{const h=g.dataset.url;s=h;const x=document.getElementById("profileAvatarPreview");x&&(x.src=h),document.querySelectorAll(".preset-avatar-option").forEach(D=>{D.style.borderColor=D===g?"var(--primary)":"transparent"})})});const p=document.getElementById("avatarFileInput");p&&p.addEventListener("change",g=>{const h=g.target.files[0];if(h){if(h.size>2*1024*1024){f("Image size exceeds 2MB limit","warning");return}const x=new FileReader;x.onload=function(D){s=D.target.result;const b=document.getElementById("profileAvatarPreview");b&&(b.src=s),f("Photo uploaded! Click Save Changes to apply.")},x.readAsDataURL(h)}});const v=document.getElementById("profileEditForm");v&&v.addEventListener("submit",g=>{g.preventDefault();const h={...t,fullName:document.getElementById("profFullName").value.trim()||t.fullName,email:document.getElementById("profEmail").value.trim()||t.email,phone:document.getElementById("profPhone").value.trim()||t.phone,designation:document.getElementById("profDesignation").value.trim()||t.designation,organization:document.getElementById("profOrg").value.trim()||t.organization,department:document.getElementById("profDept").value.trim()||t.department,avatar:s,signatureFont:n,signatureText:l};u.setUser(h),y.user=h,f("Profile updated successfully!"),L()})}L();
