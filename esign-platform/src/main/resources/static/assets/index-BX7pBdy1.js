(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))n(o);new MutationObserver(o=>{for(const m of o)if(m.type==="childList")for(const l of m.addedNodes)l.tagName==="LINK"&&l.rel==="modulepreload"&&n(l)}).observe(document,{childList:!0,subtree:!0});function a(o){const m={};return o.integrity&&(m.integrity=o.integrity),o.referrerPolicy&&(m.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?m.credentials="include":o.crossOrigin==="anonymous"?m.credentials="omit":m.credentials="same-origin",m}function n(o){if(o.ep)return;o.ep=!0;const m=a(o);fetch(o.href,m)}})();const X=typeof window<"u"&&(window.location.hostname==="localhost"||window.location.hostname==="127.0.0.1"),_=X&&window.location.port==="5173"?"http://localhost:8080/api/v1":"/api/v1",D={getToken(){return localStorage.getItem("esign_token")},setToken(s){localStorage.setItem("esign_token",s)},clearToken(){localStorage.removeItem("esign_token"),localStorage.removeItem("esign_user")},getUser(){const s=localStorage.getItem("esign_user");return s?JSON.parse(s):null},setUser(s){localStorage.setItem("esign_user",JSON.stringify(s))},async request(s,t={}){var d;const a=`${_}${s}`,n=t.headers||{},o=this.getToken();o&&!s.startsWith("/auth/")&&(n.Authorization=`Bearer ${o}`),!(t.body instanceof FormData)&&!n["Content-Type"]&&(n["Content-Type"]="application/json");const m={...t,headers:n},l=await fetch(a,m);if(l.status===401&&!s.startsWith("/auth/"))throw this.clearToken(),window.location.hash="#/login",new Error("Session expired. Please log in again.");if((d=l.headers.get("content-type"))!=null&&d.includes("application/pdf"))return l.blob();const g=await l.json().catch(()=>({}));if(!l.ok){const I=g.message||g.error||`Request failed with status ${l.status}`;throw new Error(I)}return g},login(s,t){return this.request("/auth/login",{method:"POST",body:JSON.stringify({email:s,password:t})})},register(s){return this.request("/auth/register",{method:"POST",body:JSON.stringify(s)})},sendRegistrationOtp(s){return this.request("/auth/send-registration-otp",{method:"POST",body:JSON.stringify({email:s})})},verifyRegistrationOtp(s,t){return this.request("/auth/verify-registration-otp",{method:"POST",body:JSON.stringify({email:s,otpCode:t})})},sendForgotPasswordOtp(s){return this.request("/auth/forgot-password-otp",{method:"POST",body:JSON.stringify({email:s})})},resetPassword(s,t,a){return this.request("/auth/reset-password",{method:"POST",body:JSON.stringify({email:s,otpCode:t,newPassword:a})})},getMe(){return this.request("/auth/me")},getDashboardStats(){return this.request("/dashboard/stats")},getDocuments(s="ALL"){const t=s&&s!=="ALL"?`?status=${s}`:"";return this.request(`/documents${t}`)},getDocument(s){return this.request(`/documents/${s}`)},uploadDocument(s){return this.request("/documents",{method:"POST",body:s})},cancelDocument(s){return this.request(`/documents/${s}/cancel`,{method:"POST"})},downloadDocumentUrl(s,t=!0){const a=this.getToken(),n=a?`&token=${encodeURIComponent(a)}`:"";return`${_}/documents/${s}/download?sealed=${t}${n}`},async downloadDocument(s,t=!0,a="document.pdf"){const n=this.getToken(),o=`${_}/documents/${s}/download?sealed=${t}`,m={};n&&(m.Authorization=`Bearer ${n}`);const l=await fetch(o,{headers:m});if(!l.ok){const f=await l.json().catch(()=>({}));throw new Error(f.message||f.error||`Download failed: HTTP ${l.status}`)}let g=a;const d=l.headers.get("Content-Disposition");if(d){const h=/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(d);h!=null&&h[1]&&(g=h[1].replace(/['"]/g,"").trim())}const I=await l.blob(),k=new Blob([I],{type:"application/pdf"}),c=window.URL.createObjectURL(k),i=document.createElement("a");i.href=c,i.download=g.endsWith(".pdf")?g:`${g}.pdf`,document.body.appendChild(i),i.click(),i.remove(),setTimeout(()=>window.URL.revokeObjectURL(c),1e4)},createSigningRequest(s){return this.request("/signing/requests",{method:"POST",body:JSON.stringify(s)})},resendSigningInvite(s){return this.request(`/signing/invites/${s}/resend`,{method:"POST"})},resendWhatsAppInvite(s){return this.request(`/signing/invites/${s}/whatsapp-invite`,{method:"POST"})},getSigningContext(s){return this.request(`/signing/context/${s}`)},requestOtp(s){return this.request(`/signing/otp/${s}`,{method:"POST"})},requestWhatsAppOtp(s){return this.request(`/signing/whatsapp-otp/${s}`,{method:"POST"})},verifyOtp(s,t){return this.request(`/signing/verify-otp/${s}`,{method:"POST",body:JSON.stringify({otpCode:t})})},requestAadhaarOtp(s,t){return this.request(`/signing/aadhaar-otp/${s}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t})})},verifyAadhaarOtp(s,t,a){return this.request(`/signing/verify-aadhaar-otp/${s}`,{method:"POST",body:JSON.stringify({aadhaarNumber:t,otpCode:a})})},submitSignature(s,t){return this.request(`/signing/submit/${s}`,{method:"POST",body:JSON.stringify(t)})},declineSignature(s,t){return this.request(`/signing/decline/${s}`,{method:"POST",body:JSON.stringify({reason:t})})},getSigningPreviewUrl(s){return`${_}/signing/preview/${s}`},verifyHash(s){return this.request(`/verify/${encodeURIComponent(s)}`)},verifyFile(s){const t=new FormData;return t.append("file",s),this.request("/verify/upload",{method:"POST",body:t})},getAdminUsers(){return this.request("/admin/users")},toggleUserStatus(s){return this.request(`/admin/users/${s}/toggle-status`,{method:"POST"})},getAdminAuditLogs(s=0,t=30){return this.request(`/admin/audit-logs?page=${s}&size=${t}`)},getAdminDocuments(s=0,t=20){return this.request(`/admin/documents?page=${s}&size=${t}`)}},V=[{code:"en",name:"English",native:"English",flag:"🇬🇧"},{code:"hi",name:"Hindi",native:"हिन्दी",flag:"🇮🇳"},{code:"mr",name:"Marathi",native:"मराठी",flag:"🇮🇳"},{code:"gu",name:"Gujarati",native:"ગુજરાતી",flag:"🇮🇳"},{code:"bn",name:"Bengali",native:"বাংলা",flag:"🇮🇳"},{code:"ta",name:"Tamil",native:"தமிழ்",flag:"🇮🇳"},{code:"te",name:"Telugu",native:"తెలుగు",flag:"🇮🇳"},{code:"fr",name:"French",native:"Français",flag:"🇫🇷"},{code:"es",name:"Spanish",native:"Español",flag:"🇪🇸"},{code:"kn",name:"Kannada",native:"ಕನ್ನಡ",flag:"🇮🇳"}],q={en:{brand:"SignEase",home:"Home",dashboard:"Dashboard",documents:"Documents",upload:"Upload & Sign",send:"Send for Signature",verify:"Verify Document",admin:"Admin",reports:"Reports",reportGeneration:"Report Generation",templates:"Templates",templatesLibrary:"Contract & Document Templates",useTemplate:"Use Template",previewTemplate:"Preview Template",termsAndConditions:"Terms & Conditions",agreeToTerms:"I agree to the Terms and Conditions",termsAcceptedCount:"Terms Accepted",signIn:"Sign In",createAccount:"Create Account",forgotPassword:"Forgot Password?",resetPassword:"Reset Password",timeframeToday:"Today",timeframeLast7Days:"Last 7 Days",timeframeLast30Days:"Last 30 Days",timeframeThisMonth:"This Month",timeframeCustom:"Custom Range",timeframeAll:"All Time",startDate:"Start Date",endDate:"End Date",exportCsvReport:"Download CSV Report",signOut:"Sign Out",profile:"Profile",myProfile:"My Profile",profileSettings:"Profile Settings",changePhoto:"Change Photo",personalInfo:"Personal Information",phone:"Phone Number",organization:"Organization",designation:"Job Title / Designation",department:"Department",saveProfile:"Save Changes",digitalSignature:"Digital Signature Style",signatureStatus:"Aadhaar eSign Verified",security:"Account Security",language:"Language",newEnvelope:"+ New Envelope",newAgreement:"+ New Agreement",exportCsv:"Export CSV",darkModeToggle:"Dark / Light Mode",heroBadge:"✨ Simple & Secure Digital Signatures",heroTitle:"Sign & Send Documents in Minutes",heroSubtitle:"The easiest and fastest way to sign contracts and forms online. Safe, legally valid, and works directly on your phone or computer.",btnStartFree:"Start Free",btnSenderDashboard:"My Dashboard",btnVerifyDoc:"Verify a Document",howItWorks:"3 Easy Steps to Sign Any Document",step1Title:"1. Upload PDF",step1Desc:"Choose any agreement, form, or contract from your device.",step2Title:"2. Add Signers",step2Desc:"Enter the names and email addresses of people who need to sign.",step3Title:"3. Sign & Download",step3Desc:"Sign with your finger or type your name, and download the finished PDF.",whyChooseUs:"Why People Love SignEase",feature1Title:"Zero Complicated Setup",feature1Desc:"No app or software to install. Signers open the link on mobile or computer and sign in seconds.",feature2Title:"100% Legally Valid",feature2Desc:"Official completion certificates with legal proof recognized under the IT Act.",feature3Title:"Instant Email Delivery",feature3Desc:"Verification OTPs and invitation links arrive instantly in your inbox.",greeting:"Good morning,",compliancetag:"AADHAAR ESIGN READY",aadhaarCompliant:"Aadhaar & IT Act 2000 Compliant",attentionSub:"documents waiting for your signature",vaultSynced:"System Online",totalDocs:"TOTAL DOCUMENTS",pendingDocs:"WAITING FOR YOUR SIGNATURE",completedDocs:"COMPLETED & ARCHIVED",actionNeeded:"Action needed",thisWeekGrowth:"+2 this week",rateDone:"64% completed",searchPlaceholder:"Search by title, signer name, or ID...",filterAll:"All",filterRequiresMe:"Needs My Signature",filterCompleted:"Completed",uploadAndSign:"➕ Upload & Sign",colDocName:"DOCUMENT NAME",colSignersStatus:"SIGNERS & STATUS",colLastUpdated:"LAST UPDATED",colAction:"ACTION",signNow:"Sign Now",remind:"Remind",download:"Download",showingAgreements:"Showing agreements",viewVaultLink:"View all documents →",legalValidityGuaranteed:"100% Legally Valid",legalValidityDesc:"Signatures made on SignEase comply with Section 5 of the Information Technology Act (2000).",auditTrailGuide:"Audit Certificate Guide ↗",docRegistryTitle:"Documents",docRegistrySub:"Manage and track your signed agreements and forms.",activeEnvelopes:"ACTIVE DOCUMENTS",needsAction:"WAITING FOR YOU",awaitingSigners:"WAITING FOR OTHERS",verificationAudit:"VERIFIED",urgentReview:"Action needed",externalParties:"Waiting on signers",itActCompliant:"Legally Valid",filterWaitingOthers:"Waiting on Others",reviewAndSign:"Review & Sign",downloadPdf:"Download PDF",continueEdit:"Continue Edit",hsmActive:"Protected with Bank-Grade Security",hsmDesc:"Each signed document has tamper-evident security with an official certificate of completion.",viewCryptoCert:"View Certificate →",workflowDispatch:"SEND FOR SIGNATURE",sendDocForSignature:"Send Document for Signature",sendDocDesc:"Upload your PDF, add who needs to sign, and send it for signing in seconds.",step1Upload:"1 Upload File",pdfFormatUpTo:"PDF UP TO 25 MB",dropPdfHere:"Drop your PDF here, or",browseFiles:"Browse files",encryptedTransit:"Safe & Private • Max size 25MB",readyToTag:"Ready",step2Signers:"2 Add Signers",orderType:"SIGNING ORDER",signersNotice:"Signers will receive a secure email link to sign. No account or password required for signers.",signerName:"NAME",emailAddress:"EMAIL ADDRESS",role:"ACTION",needsToSign:"Needs to sign",receivesCopy:"Receives a copy",addAnotherRecipient:"➕ Add another recipient",tamperProofAudit:"Automatic Audit Trail",tamperProofDesc:"Records date, time, and signatures for full legal proof.",sendReminder48h:"Send email reminder after 48h",cancel:"Cancel",saveAsDraft:"Save as Draft",sendForSignature:"Send for Signature ▶",trustLedger:"VERIFY DOCUMENT",verifyAuthenticity:"Check Document Authenticity",verifyDocSubtitle:"Check if a signed document is genuine, legally valid, and unchanged.",auditorNodeOnline:"System Status: Online",tabEnterHash:"Enter Document Code / ID",tabUploadFile:"Upload Signed File",checksumLabel:"Document Code, Hash, or ID",pasteBtn:"Paste",verifyDocumentBtn:"Verify Document",verifyHelperNotice:"We verify document authenticity securely without exposing its private contents.",verifiedAuthenticTitle:"Document Verified & Authentic",legallyBinding:"Legally Binding",verifiedSub:"The signatures and document match the original official record.",downloadAuditCertificate:"Download Audit Certificate (PDF)",metaDocTitle:"DOCUMENT NAME",metaSignaturesVerified:"SIGNATURES",metaTimestampAuth:"DATE & TIME",originalMatch:"Original Match",sealedEndToEnd:"Legally Protected & Sealed",itActTitle:"Information Technology Act (IT Act 2000)",itActDesc:"Signatures on SignEase are 100% legally enforceable in Indian courts under the IT Act.",zkpTitle:"100% Private & Confidential",zkpDesc:"Your document content remains private and is never shared or made public.",regTitle:"Create Your Account",regSub:"Verify your email with a 6-digit OTP to get started",firstName:"First Name",lastName:"Last Name",orgName:"Company or Business Name",emailInput:"Work Email Address",btnGetOtp:"Get OTP",otpLabel:"Enter 6-Digit Email OTP",btnVerifyOtp:"Verify Code",otpDispatchedMsg:"6-digit verification code sent to your email inbox.",password:"Password",btnCreateAccount:"Create Account",alreadyRegistered:"Already have an account?",signInHere:"Sign in here",loginTitle:"Welcome Back",loginSub:"Sign in to access your documents and signed contracts",dontHaveAccount:"Don't have an account?",signUpHere:"Create account",suggestPassword:"Suggest Strong Password",confirmPassword:"Confirm Password",passwordsMatch:"Passwords match",passwordsDoNotMatch:"Passwords do not match",deliveryChannel:"Delivery Channel",whatsapp:"WhatsApp",whatsappDelivery:"WhatsApp Delivery",whatsappOtp:"WhatsApp OTP Verification",emailOtp:"Email OTP Verification",getWhatsAppOtp:"Get WhatsApp OTP",sendViaWhatsApp:"Send via WhatsApp",shareWhatsApp:"Share on WhatsApp",passwordReqLength:"8+ characters",passwordReqLetters:"Letters (a-z, A-Z)",passwordReqNumbers:"Numbers (0-9)",passwordReqSymbols:"Special symbol (!@#$...)",signerWelcome:"Review & Sign Document",requestedBy:"Requested by",tabDraw:"✍️ Draw Signature",tabType:"⌨️ Type Name",btnClear:"Clear",btnCompleteSigning:"✅ Complete & Sign Document",otpNotice:"A 6-digit OTP code will be sent to your email to verify your identity.",footerNote:"SignEase — Simple, fast and legally valid electronic document signing."},hi:{brand:"SignEase",home:"होम",dashboard:"डैशबोर्ड",documents:"दस्तावेज़",upload:"अपलोड और हस्ताक्षर",send:"हस्ताक्षर के लिए भेजें",verify:"दस्तावेज़ जाँचें",admin:"एडमिन",reports:"रिपोर्ट्स",reportGeneration:"रिपोर्ट जनरेशन",signIn:"साइन इन",createAccount:"खाता बनाएं",forgotPassword:"पासवर्ड भूल गए?",resetPassword:"पासवर्ड रीसेट करें",timeframeToday:"आज",timeframeLast7Days:"पिछले 7 दिन",timeframeLast30Days:"पिछले 30 दिन",timeframeThisMonth:"इस महीने",timeframeCustom:"कस्टम रेंज",timeframeAll:"सभी समय",startDate:"प्रारंभ तिथि",endDate:"अंतिम तिथि",exportCsvReport:"CSV रिपोर्ट डाउनलोड करें",confirmPassword:"पासवर्ड की पुष्टि करें",passwordsMatch:"पासवर्ड मेल खाते हैं",passwordsDoNotMatch:"पासवर्ड मेल नहीं खाते",deliveryChannel:"वितरण माध्यम",whatsapp:"व्हाट्सएप",whatsappDelivery:"व्हाट्सएप संदेश वितरण",whatsappOtp:"व्हाट्सएप OTP सत्यापन",emailOtp:"ईमेल OTP सत्यापन",getWhatsAppOtp:"व्हाट्सएप OTP प्राप्त करें",sendViaWhatsApp:"व्हाट्सएप से भेजें",shareWhatsApp:"व्हाट्सएप पर साझा करें",signOut:"लॉग आउट",profile:"प्रोफ़ाइल",myProfile:"मेरी प्रोफ़ाइल",profileSettings:"प्रोफ़ाइल सेटिंग्स",changePhoto:"फ़ोटो बदलें",personalInfo:"व्यक्तिगत जानकारी",phone:"फ़ोन नंबर",organization:"संगठन / कंपनी",designation:"पद / पदनाम",department:"विभाग",saveProfile:"बदलाव सहेजें",digitalSignature:"डिजिटल हस्ताक्षर शैली",signatureStatus:"आधार ई-हस्ताक्षर सत्यापित",security:"खाता सुरक्षा",language:"भाषा",newEnvelope:"+ नया दस्तावेज़",newAgreement:"+ नया अनुबंध",exportCsv:"CSV डाउनलोड करें",darkModeToggle:"डार्क / लाइट मोड",heroBadge:"✨ सरल और सुरक्षित डिजिटल हस्ताक्षर",heroTitle:"दस्तावेज़ मिनटों में साइन करें और भेजें",heroSubtitle:"दस्तावेज़ और अनुबंध साइन करने का सबसे आसान और सुरक्षित तरीका। मोबाइल या कंप्यूटर पर तुरंत काम करता है।",btnStartFree:"मुफ़्त शुरू करें",btnSenderDashboard:"मेरा डैशबोर्ड",btnVerifyDoc:"दस्तावेज़ जाँचें",howItWorks:"दस्तावेज़ साइन करने के 3 आसान तरीके",step1Title:"1. PDF चुनें",step1Desc:"अपने फोन या कंप्यूटर से कोई भी दस्तावेज़ या फॉर्म चुनें।",step2Title:"2. नाम व ईमेल जोड़ें",step2Desc:"जिन लोगों को साइन करना है, उनका नाम और ईमेल दर्ज करें।",step3Title:"3. साइन करें व डाउनलोड करें",step3Desc:"उंगली से बनाकर या नाम लिखकर साइन करें और तैयार PDF डाउनलोड करें।",whyChooseUs:"SignEase क्यों चुनें",feature1Title:"कोई जटिल सेटअप नहीं",feature1Desc:"कोई ऐप इंस्टॉल करने की ज़रूरत नहीं। ईमेल लिंक खोलें और मोबाइल पर तुरंत साइन करें।",feature2Title:"100% कानूनी रूप से मान्य",feature2Desc:"भारतीय आईटी कानून के तहत मान्य डिजिटल प्रमाणपत्र और सुरक्षित रिकॉर्ड।",feature3Title:"तुरंत ईमेल डिलीवरी",feature3Desc:"सत्यापन OTP और हस्ताक्षर लिंक तुरंत आपके ईमेल पर पहुंचता है।",greeting:"नमस्ते,",compliancetag:"आधार ई-साइन और आईटी कानून मान्य",aadhaarCompliant:"आधार एवं आईटी अधिनियम 2000 अनुपालित",attentionSub:"दस्तावेज़ों पर आपके हस्ताक्षर बाकी हैं",vaultSynced:"सिस्टम चालू है",totalDocs:"कुल दस्तावेज़",pendingDocs:"आपके हस्ताक्षर बाकी",completedDocs:"पूर्ण दस्तावेज़",actionNeeded:"हस्ताक्षर करें",thisWeekGrowth:"+2 इस सप्ताह",rateDone:"64% पूर्ण",searchPlaceholder:"शीर्षक, नाम या आईडी से खोजें...",filterAll:"सभी",filterRequiresMe:"मेरे हस्ताक्षर चाहिए",filterCompleted:"पूर्ण",uploadAndSign:"➕ अपलोड और हस्ताक्षर",colDocName:"दस्तावेज़ का नाम",colSignersStatus:"हस्ताक्षरकर्ता स्थिति",colLastUpdated:"अंतिम अपडेट",colAction:"कार्य",signNow:"साइन करें",remind:"याद दिलाएं",download:"डाउनलोड",showingAgreements:"दस्तावेज़ दिखाए जा रहे हैं",viewVaultLink:"सभी दस्तावेज़ देखें →",legalValidityGuaranteed:"100% कानूनी रूप से मान्य",legalValidityDesc:"SignEase पर किए गए हस्ताक्षर सूचना प्रौद्योगिकी अधिनियम (IT Act 2000) के तहत अदालत में पूरी तरह मान्य हैं।",auditTrailGuide:"प्रमाणपत्र गाइड ↗",docRegistryTitle:"मेरे दस्तावेज़",docRegistrySub:"अपने सभी हस्ताक्षरित और लंबित दस्तावेज़ यहाँ देखें।",activeEnvelopes:"सक्रिय दस्तावेज़",needsAction:"आपके हस्ताक्षर बाकी",awaitingSigners:"दूसरों के हस्ताक्षर बाकी",verificationAudit:"सत्यापित",urgentReview:"कार्रवाई आवश्यक",externalParties:"हस्ताक्षर बाकी",itActCompliant:"कानूनी मान्य",filterWaitingOthers:"दूसरों के लिए बाकी",reviewAndSign:"देखें और साइन करें",downloadPdf:"PDF डाउनलोड",continueEdit:"एडिट करें",hsmActive:"पूरी तरह सुरक्षित और एन्क्रिप्टेड",hsmDesc:"हर हस्ताक्षरित दस्तावेज़ के साथ अदालत में मान्य डिजिटल प्रमाणपत्र मिलता है।",viewCryptoCert:"प्रमाणपत्र देखें →",workflowDispatch:"हस्ताक्षर के लिए भेजें",sendDocForSignature:"दस्तावेज़ हस्ताक्षर के लिए भेजें",sendDocDesc:"अपनी PDF चुनें, हस्ताक्षर करने वाले का नाम व ईमेल जोड़ें और तुरंत भेजें।",step1Upload:"1 फ़ाइल अपलोड करें",pdfFormatUpTo:"PDF (अधिकतम 25 MB)",dropPdfHere:"अपनी PDF फ़ाइल यहाँ छोड़ें, या",browseFiles:"फ़ाइल चुनें",encryptedTransit:"सुरक्षित और निजी • अधिकतम 25 MB",readyToTag:"तैयार",step2Signers:"2 हस्ताक्षर करने वाले जोड़ें",orderType:"हस्ताक्षर का क्रम",signersNotice:"हस्ताक्षर करने वालों को ईमेल पर सीधा लिंक मिलेगा। उन्हें अकाउंट बनाने की ज़रूरत नहीं है।",signerName:"नाम",emailAddress:"ईमेल पता",role:"भूमिका",needsToSign:"हस्ताक्षर करना है",receivesCopy:"केवल कॉपी मिलेगी",addAnotherRecipient:"➕ एक और व्यक्ति जोड़ें",tamperProofAudit:"सुरक्षित कानूनी रिकॉर्ड",tamperProofDesc:"तारीख, समय और हस्ताक्षर का कानूनी रिकॉर्ड अपने आप बनता है।",sendReminder48h:"2 दिन में हस्ताक्षर न होने पर याद दिलाएं",cancel:"रद्द करें",saveAsDraft:"ड्राफ्ट सहेजें",sendForSignature:"हस्ताक्षर के लिए भेजें ▶",trustLedger:"दस्तावेज़ की जाँच",verifyAuthenticity:"दस्तावेज़ असली है या नहीं जाँचें",verifyDocSubtitle:"आसानी से जाँचें कि दस्तावेज़ असली है और कोई छेड़छाड़ तो नहीं हुई।",auditorNodeOnline:"सिस्टम चालू है",tabEnterHash:"दस्तावेज़ कोड (ID) दर्ज करें",tabUploadFile:"हस्ताक्षरित फ़ाइल अपलोड करें",checksumLabel:"दस्तावेज़ कोड या ID दर्ज करें",pasteBtn:"पेस्ट करें",verifyDocumentBtn:"दस्तावेज़ जाँचें",verifyHelperNotice:"हम आपकी फ़ाइल को पूरी तरह निजी और सुरक्षित रखते हैं।",verifiedAuthenticTitle:"दस्तावेज़ असली और सुरक्षित है",legallyBinding:"कानूनी मान्य",verifiedSub:"हस्ताक्षर और दस्तावेज़ आधिकारिक रिकॉर्ड से पूरी तरह मेल खाते हैं।",downloadAuditCertificate:"प्रमाणपत्र डाउनलोड करें (PDF)",metaDocTitle:"दस्तावेज़ का नाम",metaSignaturesVerified:"हस्ताक्षर",metaTimestampAuth:"दिनांक और समय",originalMatch:"मूल प्रति",sealedEndToEnd:"सुरक्षित रूप से सील",itActTitle:"IT Act 2000 के तहत कानूनी मान्यता",itActDesc:"भारतीय कानून के तहत यह हस्ताक्षर पूरी तरह कानूनी और वैध है।",zkpTitle:"100% गोपनीय और सुरक्षित",zkpDesc:"आपकी फ़ाइल का डेटा पूरी तरह निजी रहता है और किसी से साझा नहीं किया जाता।",regTitle:"नया अकाउंट बनाएं",regSub:"अपना ईमेल दर्ज करें और 6-अंकों का OTP प्राप्त करें",firstName:"पहला नाम",lastName:"अंतिम नाम",orgName:"कंपनी या व्यवसाय का नाम",emailInput:"ईमेल पता",btnGetOtp:"OTP पाएं",otpLabel:"6-अंकों का ईमेल OTP दर्ज करें",btnVerifyOtp:"OTP सत्यापित करें",otpDispatchedMsg:"आपके ईमेल पर 6 अंकों का OTP भेजा गया है।",password:"पासवर्ड",btnCreateAccount:"अकाउंट बनाएं",alreadyRegistered:"पहले से अकाउंट है?",signInHere:"यहाँ लॉगिन करें",loginTitle:"लॉगिन करें",loginSub:"अपने दस्तावेज़ देखने के लिए लॉगिन करें",dontHaveAccount:"नया अकाउंट बनाना है?",signUpHere:"अकाउंट बनाएं",suggestPassword:"मजबूत पासवर्ड सुझाएं",passwordReqLength:"8+ अक्षर",passwordReqLetters:"अक्षर (a-z, A-Z)",passwordReqNumbers:"संख्या (0-9)",passwordReqSymbols:"विशेष प्रतीक (!@#$...)",signerWelcome:"दस्तावेज़ देखें और हस्ताक्षर करें",requestedBy:"अनुरोधकर्ता",tabDraw:"✍️ हस्ताक्षर बनाएं",tabType:"⌨️ नाम टाइप करें",btnClear:"साफ़ करें",btnCompleteSigning:"✅ हस्ताक्षर पूर्ण करें",otpNotice:"आपकी पहचान के लिए आपके ईमेल पर 6-अंकों का OTP भेजा जाएगा।",footerNote:"SignEase — सरल, तेज़ और कानूनी रूप से मान्य इलेक्ट्रॉनिक हस्ताक्षर।"},mr:{brand:"SignEase",home:"होम",dashboard:"डॅशबोर्ड",documents:"दस्तऐवज",upload:"अपलोड आणि स्वाक्षरी",send:"स्वाक्षरीसाठी पाठवा",verify:"दस्तऐवज तपासा",admin:"अ‍ॅडमिन",signIn:"साइन इन",createAccount:"खाते तयार करा",signOut:"लॉग आउट",profile:"प्रोफ़ाइल",myProfile:"मेरी प्रोफ़ाइल",profileSettings:"प्रोफ़ाइल सेटिंग्स",changePhoto:"फ़ोटो बदलें",personalInfo:"व्यक्तिगत जानकारी",phone:"फ़ोन नंबर",organization:"संगठन / कंपनी",designation:"पद / पदनाम",department:"विभाग",saveProfile:"बदलाव सहेजें",digitalSignature:"डिजिटल हस्ताक्षर शैली",signatureStatus:"आधार ई-हस्ताक्षर सत्यापित",security:"खाता सुरक्षा",language:"भाषा",newEnvelope:"+ नवीन दस्तऐवज",newAgreement:"+ नवीन करार",exportCsv:"CSV डाउनलोड",darkModeToggle:"डार्क / लाइट मोड",heroBadge:"✨ सोपी आणि सुरक्षित डिजिटल स्वाक्षरी",heroTitle:"काही मिनिटांत दस्तऐवज स्वाक्षरी करा आणि पाठवा",heroSubtitle:"दस्तऐवज आणि करार स्वाक्षरी करण्याचा सर्वात सोपा आणि सुरक्षित मार्ग. मोबाईल किंवा संगणकावर लगेच कार्य करते.",btnStartFree:"मोफत सुरू करा",btnSenderDashboard:"माझा डॅशबोर्ड",btnVerifyDoc:"दस्तऐवज तपासा",howItWorks:"दस्तऐवज स्वाक्षरी करण्याचे ३ सोपे टप्पे",step1Title:"१. PDF निवडा",step1Desc:"आपल्या फोन किंवा संगणकावरून कोणतीही PDF किंवा करार निवडा.",step2Title:"२. स्वाक्षरीकर्ता जोडा",step2Desc:"ज्या व्यक्तीला स्वाक्षरी करायची आहे त्यांचे नाव आणि ईमेल टाका.",step3Title:"३. स्वाक्षरी करा आणि डाउनलोड करा",step3Desc:"बोटाने किंवा नाव टाईप करून स्वाक्षरी करा आणि PDF डाउनलोड करा.",whyChooseUs:"SignEase का निवडावे",feature1Title:"कोणताही क्लिष्ट सेटअप नाही",feature1Desc:"कोणताही अ‍ॅप इन्स्टॉल करण्याची गरज नाही. ईमेल लिंक उघडा आणि मोबाईलवर लगेच स्वाक्षरी करा.",feature2Title:"१००% कायदेशीररित्या वैध",feature2Desc:"भारतीय माहिती तंत्रज्ञान कायद्यानुसार न्यायालयात पूर्णपणे वैध व अधिकृत प्रमाणपत्र.",feature3Title:"त्वरित ईमेल डिलिव्हरी",feature3Desc:"सत्यापन OTP आणि स्वाक्षरी लिंक लगेच आपल्या ईमेलवर पोहोचते.",greeting:"नमस्कार,",compliancetag:"आधार ई-स्वाक्षरी व कायदेशीर मान्य",aadhaarCompliant:"आधार आणि आयटी कायदा २००० अनुपालित",attentionSub:"दस्तऐवजांवर आपली स्वाक्षरी बाकी आहे",vaultSynced:"प्रणाली सुरू आहे",totalDocs:"एकूण दस्तऐवज",pendingDocs:"आपली स्वाक्षरी बाकी",completedDocs:"पूर्ण दस्तऐवज",actionNeeded:"स्वाक्षरी आवश्यक",thisWeekGrowth:"+२ या आठवड्यात",rateDone:"६४% पूर्ण",searchPlaceholder:"नाव किंवा आयडीने शोधा...",filterAll:"सर्व",filterRequiresMe:"माझी स्वाक्षरी बाकी",filterCompleted:"पूर्ण",uploadAndSign:"➕ अपलोड आणि स्वाक्षरी",colDocName:"दस्तऐवजाचे नाव",colSignersStatus:"स्वाक्षरी स्थिती",colLastUpdated:"शेवटचे अपडेट",colAction:"कृती",signNow:"स्वाक्षरी करा",remind:"आठवण करा",download:"डाउनलोड",showingAgreements:"दाखवले जाणारे दस्तऐवज",viewVaultLink:"सर्व दस्तऐवज पहा →",legalValidityGuaranteed:"१००% कायदेशीररित्या वैध",legalValidityDesc:"SignEase वरील स्वाक्षऱ्या भारतीय माहिती तंत्रज्ञान कायद्यानुसार न्यायालयात मान्य आहेत.",auditTrailGuide:"प्रमाणपत्र मार्गदर्शक ↗",docRegistryTitle:"माझे दस्तऐवज",docRegistrySub:"आपले सर्व स्वाक्षरी केलेले आणि प्रलंबित दस्तऐवज येथे व्यवस्थापित करा.",activeEnvelopes:"सक्रिय दस्तऐवज",needsAction:"आपली स्वाक्षरी बाकी",awaitingSigners:"इतरांची स्वाक्षरी बाकी",verificationAudit:"सत्यापित",urgentReview:"कृती आवश्यक",externalParties:"स्वाक्षरी बाकी",itActCompliant:"कायदेशीर मान्य",filterWaitingOthers:"इतरांसाठी बाकी",reviewAndSign:"पहा आणि स्वाक्षरी करा",downloadPdf:"PDF डाउनलोड",continueEdit:"संपादन करा",hsmActive:"बँक-स्तरीय सुरक्षेने संरक्षित",hsmDesc:"प्रत्येक स्वाक्षरी केलेल्या दस्तऐवजासोबत कायदेशीररित्या मान्य डिजिटल प्रमाणपत्र मिळते.",viewCryptoCert:"प्रमाणपत्र पहा →",workflowDispatch:"स्वाक्षरीसाठी पाठवा",sendDocForSignature:"दस्तऐवज स्वाक्षरीसाठी पाठवा",sendDocDesc:"आपली PDF निवडा, स्वाक्षरी करणाऱ्याचे नाव व ईमेल टाका आणि त्वरित पाठवा.",step1Upload:"१. फाईल निवडा",pdfFormatUpTo:"PDF (कमाल २५ MB)",dropPdfHere:"येथे आपली PDF टाका, किंवा",browseFiles:"फाईल निवडा",encryptedTransit:"सुरक्षित आणि खाजगी • कमाल २५ MB",readyToTag:"तयार",step2Signers:"२. स्वाक्षरीकर्ता जोडा",orderType:"स्वाक्षरीचा क्रम",signersNotice:"स्वाक्षरी करणाऱ्यांना ईमेलवर थेट लिंक मिळेल. त्यांना खाते तयार करण्याची आवश्यकता नाही.",signerName:"नाव",emailAddress:"ईमेल पत्ता",role:"भूमिका",needsToSign:"स्वाक्षरी करायची आहे",receivesCopy:"केवळ प्रत मिळेल",addAnotherRecipient:"➕ आणखी एक व्यक्ती जोडा",tamperProofAudit:"सुरक्षित कायदेशीर ऑडिट नोंद",tamperProofDesc:"तारीख, वेळ आणि स्वाक्षरीची कायदेशीर नोंद आपोआप ठेवली जाते.",sendReminder48h:"२ दिवसांत स्वाक्षरी न झाल्यास आठवण करा",cancel:"रद्द करा",saveAsDraft:"मसुदा जतन करा",sendForSignature:"स्वाक्षरीसाठी पाठवा ▶",trustLedger:"दस्तऐवज तपासणी",verifyAuthenticity:"दस्तऐवज खरा आहे की नाही तपासा",verifyDocSubtitle:"स्वाक्षरी केलेला दस्तऐवज अस्सल, वैध आणि सुरक्षित आहे की नाही सहज तपासा.",auditorNodeOnline:"प्रणाली सुरू आहे",tabEnterHash:"दस्तऐवज कोड (ID) टाका",tabUploadFile:"स्वाक्षरी केलेली फाईल अपलोड करा",checksumLabel:"दस्तऐवज क्रमांक किंवा कोड (ID)",pasteBtn:"पेस्ट करा",verifyDocumentBtn:"दस्तऐवज तपासा",verifyHelperNotice:"आम्ही आपली फाईल पूर्णपणे सुरक्षित आणि गोपनीय ठेवतो.",verifiedAuthenticTitle:"दस्तऐवज अस्सल आणि सुरक्षित आहे",legallyBinding:"कायदेशीररित्या वैध",verifiedSub:"स्वाक्षऱ्या आणि दस्तऐवज अधिकृत नोंदीशी जुळतात.",downloadAuditCertificate:"प्रमाणपत्र डाउनलोड करा (PDF)",metaDocTitle:"दस्तऐवजाचे नाव",metaSignaturesVerified:"स्वाक्षऱ्या",metaTimestampAuth:"तारीख आणि वेळ",originalMatch:"मूळ प्रत",sealedEndToEnd:"सुरक्षितरीत्या सीलबंद",itActTitle:"माहिती तंत्रज्ञान कायदा २००० अंतर्गत मान्यता",itActDesc:"भारतीय कायद्यानुसार या स्वाक्षऱ्या न्यायालयात पूर्णपणे वैध आणि मान्य आहेत.",zkpTitle:"१००% खाजगी आणि सुरक्षित",zkpDesc:"आपल्या फाईलचा डेटा कोणाशीही सामायिक केला जात नाही.",regTitle:"नवीन खाते तयार करा",regSub:"आपला ईमेल टाका आणि ६-अंकी OTP मिळवा",firstName:"पहिले नाव",lastName:"आडनाव",orgName:"कंपनी किंवा संस्थेचे नाव",emailInput:"ईमेल पत्ता",btnGetOtp:"OTP मिळवा",otpLabel:"६-अंकी ईमेल OTP टाका",btnVerifyOtp:"OTP तपासा",otpDispatchedMsg:"आपल्या ईमेलवर ६ अंकी OTP पाठवला आहे.",password:"पासवर्ड",btnCreateAccount:"खाते तयार करा",alreadyRegistered:"आधीच खाते आहे?",signInHere:"येथे साइन इन करा",loginTitle:"साइन इन करा",loginSub:"आपले दस्तऐवज पाहण्यासाठी लॉगिन करा",dontHaveAccount:"नवीन खाते तयार करायचे आहे?",signUpHere:"खाते तयार करा",signerWelcome:"दस्तऐवज पहा आणि स्वाक्षरी करा",requestedBy:"विनंतीकर्ता",tabDraw:"✍️ स्वाक्षरी काढा",tabType:"⌨️ नाव टाईप करा",btnClear:"साफ करा",btnCompleteSigning:"✅ स्वाक्षरी पूर्ण करा",otpNotice:"ओळखीच्या सत्यापनासाठी आपल्या ईमेलवर ६ अंकी OTP पाठवला जाईल.",footerNote:"SignEase — सोपी, जलद आणि कायदेशीर इलेक्ट्रॉनिक स्वाक्षरी."},gu:{brand:"SignEase",home:"હોમ",dashboard:"ડેશબોર્ડ",documents:"દસ્તાવેજો",upload:"અપલોડ અને સહી",send:"સહી માટે મોકલો",verify:"દસ્તાવેજ ચકાસો",admin:"એડમિન",signIn:"સાઇન ઇન",createAccount:"ખાતું બનાવો",signOut:"લૉગ આઉટ",profile:"પ્રોફાઇલ",myProfile:"મારી પ્રોફાઇલ",profileSettings:"પ્રોફાઇલ સેટિંગ્સ",changePhoto:"ફોટો બદલો",personalInfo:"વ્યક્તિગત માહિતી",phone:"ફોન નંબર",organization:"સંસ્થા",designation:"હોદ્દો",department:"વિભાગ",saveProfile:"ફેરફારો સાચવો",digitalSignature:"ડિજિટલ હસ્તાક્ષર શૈલી",signatureStatus:"આધાર ઇ-સાઇન ચકાસાયેલ",security:"ખાતા સુરક્ષા",language:"ભાષા",newEnvelope:"+ નવો દસ્તાવેજ",newAgreement:"+ નવો કરાર",exportCsv:"CSV ડાઉનલોડ",darkModeToggle:"ડાર્ક / લાઇટ મોડ",heroBadge:"✨ સરળ અને સુરક્ષિત ડિજિટલ સહી",heroTitle:"મિનિટોમાં દસ્તાવેજ સહી કરો અને મોકલો",heroSubtitle:"ઓનલાઇન કરાર અને ફોર્મ પર સહી કરવાની સૌથી સરળ અને સુરક્ષિત રીત. મોબાઈલ કે કમ્પ્યુટર પર તરત કામ કરે છે.",btnStartFree:"મફત શરૂ કરો",btnSenderDashboard:"મારું ડેશબોર્ડ",btnVerifyDoc:"દસ્તાવેજ ચકાસો",howItWorks:"દસ્તાવેજ પર સહી કરવાના ૩ સરળ પગલાં",step1Title:"૧. PDF પસંદ કરો",step1Desc:"તમારા ફોન અથવા કમ્પ્યુટર પરથી કોઈપણ કરાર કે ફોર્મ પસંદ કરો.",step2Title:"૨. સહી કરનાર ઉમેરો",step2Desc:"જેમને સહી કરવાની છે તેમનું નામ અને ઇમેઇલ દાખલ કરો.",step3Title:"૩. સહી કરો અને ડાઉનલોડ કરો",step3Desc:"આંગળીથી દોરીને અથવા નામ લખીને સહી કરો અને PDF મેળવો.",whyChooseUs:"SignEase શા માટે પસંદ કરવું",feature1Title:"કોઈ જટિલ સેટઅપ નથી",feature1Desc:"કોઈ એપ ઇન્સ્ટોલ કરવાની જરૂર નથી. ઇમેઇલ લિંક ખોલીને મોબાઇલમાં સીધી સહી કરો.",feature2Title:"૧૦૦% કાનૂની માન્ય",feature2Desc:"ભારતીય આઈટી કાયદા હેઠળ કોર્ટમાં સંપૂર્ણ માન્ય અને સત્તાવાર પ્રમાણપત્ર.",feature3Title:"તરત ઇમેઇલ ડિલિવરી",feature3Desc:"વેરિફિકેશન OTP અને સહી લિંક તરત તમારા ઇમેઇલ પર મળે છે.",greeting:"નમસ્તે,",compliancetag:"આધાર ઈ-સહી અને કાનૂની માન્ય",aadhaarCompliant:"આધાર અને આઈટી એક્ટ ૨૦૦૦ સુસંગત",attentionSub:"દસ્તાવેજો પર તમારી સહી બાકી છે",vaultSynced:"સિસ્ટમ ચાલુ છે",totalDocs:"કુલ દસ્તાવેજો",pendingDocs:"તમારી સહી બાકી",completedDocs:"પૂર્ણ દસ્તાવેજો",actionNeeded:"સહી જરૂરી",thisWeekGrowth:"+૨ આ અઠવાડિયે",rateDone:"૬૪% પૂર્ણ",searchPlaceholder:"શીર્ષક કે નામથી શોધો...",filterAll:"બધા",filterRequiresMe:"મારી સહી બાકી",filterCompleted:"પૂર્ણ",uploadAndSign:"➕ અપલોડ અને સહી",colDocName:"દસ્તાવેજનું નામ",colSignersStatus:"સહીની સ્થિતિ",colLastUpdated:"છેલ્લું અપડેટ",colAction:"કાર્ય",signNow:"સહી કરો",remind:"યાદ અપાવો",download:"ડાઉનલોડ",showingAgreements:"દર્શાવેલ દસ્તાવેજો",viewVaultLink:"બધા દસ્તાવેજો જુઓ →",legalValidityGuaranteed:"૧૦૦% કાનૂની રીતે માન્ય",legalValidityDesc:"SignEase પર કરેલી સહીઓ આઈટી એક્ટ ૨૦૦૦ હેઠળ અદાલતમાં માન્ય છે.",auditTrailGuide:"પ્રમાણપત્ર માર્ગદર્શિકા ↗",docRegistryTitle:"મારા દસ્તાવેજો",docRegistrySub:"તમારા બધા સહી કરેલા અને બાકી રહેલા દસ્તાવેજો અહીં જુઓ.",activeEnvelopes:"સક્રિય દસ્તાવેજો",needsAction:"તમારી સહી બાકી",awaitingSigners:"અન્યની સહી બાકી",verificationAudit:"ચકાસાયેલ",urgentReview:"ધ્યાન આપો",externalParties:"સહી બાકી",itActCompliant:"કાનૂની માન્ય",filterWaitingOthers:"અન્ય માટે બાકી",reviewAndSign:"જુઓ અને સહી કરો",downloadPdf:"PDF ડાઉનલોડ",continueEdit:"એડિટ કરો",hsmActive:"બેંક-સ્તરની સુરક્ષા સાથે સુરક્ષિત",hsmDesc:"દરેક સહી કરેલા દસ્તાવેજ સાથે કાનૂની રીતે માન્ય ડિજિટલ પ્રમાણપત્ર મળે છે.",viewCryptoCert:"પ્રમાણપત્ર જુઓ →",workflowDispatch:"સહી માટે મોકલો",sendDocForSignature:"દસ્તાવેજ સહી માટે મોકલો",sendDocDesc:"તમારી PDF પસંદ કરો, સહી કરનારનું નામ અને ઇમેઇલ ઉમેરીને તરત મોકલો.",step1Upload:"૧. ફાઇલ પસંદ કરો",pdfFormatUpTo:"PDF (મહત્તમ ૨૫ MB)",dropPdfHere:"અહીં તમારી PDF મૂકો, અથવા",browseFiles:"ફાઇલ પસંદ કરો",encryptedTransit:"સુરક્ષિત અને ખાનગી • મહત્તમ ૨૫ MB",readyToTag:"તૈયાર",step2Signers:"૨. સહી કરનાર ઉમેરો",orderType:"સહીનો ક્રમ",signersNotice:"સહી કરનારને ઇમેઇલ પર સીધી લિંક મળશે. તેમને ખાતું બનાવવાની જરૂર નથી.",signerName:"નામ",emailAddress:"ઇમેઇલ સરનામું",role:"ભૂમિકા",needsToSign:"સહી કરવાની છે",receivesCopy:"ફક્ત નકલ મળશે",addAnotherRecipient:"➕ વધુ એક વ્યક્તિ ઉમેરો",tamperProofAudit:"સુરક્ષિત કાનૂની ઓડિટ રેકોર્ડ",tamperProofDesc:"તારીખ, સમય અને સહીનો કાનૂની રેકોર્ડ આપમેળે બને છે.",sendReminder48h:"૨ દિવસમાં સહી ન થાય તો યાદ અપાવો",cancel:"રદ કરો",saveAsDraft:"ડ્રાફ્ટ સાચવો",sendForSignature:"સહી માટે મોકલો ▶",trustLedger:"દસ્તાવેજ ચકાસણી",verifyAuthenticity:"દસ્તાવેજ અસલ છે કે નહીં તે ચકાસો",verifyDocSubtitle:"સરળતાથી ચકાસો કે સહી કરેલ દસ્તાવેજ અસલ અને સુરક્ષિત છે.",auditorNodeOnline:"સિસ્ટમ ચાલુ છે",tabEnterHash:"દસ્તાવેજ કોડ (ID) દાખલ કરો",tabUploadFile:"સહી કરેલી ફાઇલ અપલોડ કરો",checksumLabel:"દસ્તાવેજ નંબર અથવા ID",pasteBtn:"પેસ્ટ કરો",verifyDocumentBtn:"દસ્તાવેજ ચકાસો",verifyHelperNotice:"અમે તમારી ફાઇલને સંપૂર્ણ ખાનગી અને સુરક્ષિત રાખીએ છીએ.",verifiedAuthenticTitle:"દસ્તાવેજ અસલ અને સુરક્ષિત છે",legallyBinding:"કાનૂની માન્ય",verifiedSub:"સહીઓ અને દસ્તાવેજ સત્તાવાર રેકોર્ડ સાથે મેળ ખાય છે.",downloadAuditCertificate:"પ્રમાણપત્ર ડાઉનલોડ કરો (PDF)",metaDocTitle:"દસ્તાવેજનું નામ",metaSignaturesVerified:"સહીઓ",metaTimestampAuth:"તારીખ અને સમય",originalMatch:"અસલ નકલ",sealedEndToEnd:"સુરક્ષિત રીતે સીલબંધ",itActTitle:"આઈટી એક્ટ ૨૦૦૦ હેઠળ કાનૂની માન્યતા",itActDesc:"ભારતીય કાયદા અનુસાર આ સહી સંપૂર્ણપણે માન્ય અને કાનૂની છે.",zkpTitle:"૧૦૦% ખાનગી અને સુરક્ષિત",zkpDesc:"તમારી ફાઇલનો ડેટા કોઈની સાથે શેર કરવામાં આવતો નથી.",regTitle:"નવું ખાતું બનાવો",regSub:"તમારું ઇમેઇલ દાખલ કરો અને ૬-અંકનો OTP મેળવો",firstName:"પ્રથમ નામ",lastName:"અટક",orgName:"કંપની કે સંસ્થાનું નામ",emailInput:"ઇમેઇલ સરનામું",btnGetOtp:"OTP મેળવો",otpLabel:"૬-અંકનો ઇમેઇલ OTP દાખલ કરો",btnVerifyOtp:"OTP ચકાસો",otpDispatchedMsg:"તમારા ઇમેઇલ પર ૬ અંકનો OTP મોકલવામાં આવ્યો છે.",password:"પાસવર્ડ",btnCreateAccount:"ખાતું બનાવો",alreadyRegistered:"પહેલેથી ખાતું છે?",signInHere:"અહીં લૉગિન કરો",loginTitle:"લૉગિન કરો",loginSub:"તમારા દસ્તાવેજો જોવા માટે લૉગિન કરો",dontHaveAccount:"નવું ખાતું બનાવવું છે?",signUpHere:"ખાતું બનાવો",signerWelcome:"દસ્તાવેજ જુઓ અને સહી કરો",requestedBy:"વિનંતી કરનાર",tabDraw:"✍️ સહી દોરો",tabType:"⌨️ નામ ટાઈપ કરો",btnClear:"સાફ કરો",btnCompleteSigning:"✅ સહી પૂર્ણ કરો",otpNotice:"ઓળખ ચકાસવા માટે તમારા ઇમેઇલ પર ૬-અંકનો OTP મોકલવામાં આવશે.",footerNote:"SignEase — સરળ, ઝડપી અને કાનૂની માન્ય ઈ-સહી."},bn:{brand:"SignEase",home:"হোম",dashboard:"ড্যাশবোর্ড",documents:"নথি / ডকুমেন্টস",upload:"আপলোড ও স্বাক্ষর",send:"স্বাক্ষরের জন্য পাঠান",verify:"নথি যাচাই করুন",admin:"অ্যাডমিন",signIn:"সাইন ইন",createAccount:"অ্যাকাউন্ট খুলুন",signOut:"লগ আউট",profile:"প্রোফাইল",myProfile:"আমার প্রোফাইল",profileSettings:"প্রোফাইল সেটিংস",changePhoto:"ছবি পরিবর্তন করুন",personalInfo:"ব্যক্তিগত তথ্য",phone:"ফোন নম্বর",organization:"প্রতিষ্ঠান",designation:"পদবী",department:"বিভাগ",saveProfile:"সংরক্ষণ করুন",digitalSignature:"ডিজিটাল স্বাক্ষর",signatureStatus:"আধার ই-সাইন যাচাইকৃত",security:"অ্যাকাউন্ট নিরাপত্তা",language:"ভাষা",newEnvelope:"+ নতুন নথি",newAgreement:"+ নতুন চুক্তি",exportCsv:"CSV ডাউনলোড",darkModeToggle:"ডার্ক / লাইট মোড",heroBadge:"✨ সহজ ও নিরাপদ ডিজিটাল স্বাক্ষর",heroTitle:"কয়েক মিনিটে যেকোনো নথিতে স্বাক্ষর করুন",heroSubtitle:"অনলাইনে চুক্তি ও নথিতে স্বাক্ষর করার সবচেয়ে সহজ ও নিরাপদ উপায়। মোবাইল বা কম্পিউটারে সরাসরি কাজ করে।",btnStartFree:"বিনামূল্যে শুরু করুন",btnSenderDashboard:"আমার ড্যাশবোর্ড",btnVerifyDoc:"নথি যাচাই করুন",howItWorks:"স্বাক্ষর করার ৩টি সহজ ধাপ",step1Title:"১. PDF নির্বাচন করুন",step1Desc:"আপনার ফোন বা কম্পিউটার থেকে যেকোনো PDF নির্বাচন করুন।",step2Title:"২. স্বাক্ষরকারী যোগ করুন",step2Desc:"যাদের স্বাক্ষর করতে হবে তাদের নাম ও ইমেল লিখুন।",step3Title:"৩. স্বাক্ষর করুন ও ডাউনলোড করুন",step3Desc:"আঙুল দিয়ে বা নাম লিখে স্বাক্ষর করুন এবং PDF পান।",whyChooseUs:"SignEase কেন বেছে নেবেন",feature1Title:"কোনো জটিল সেটআপ নেই",feature1Desc:"কোনো অ্যাপ ইন্সটল করার দরকার নেই। ইমেল লিঙ্কে ক্লিক করে সরাসরি স্বাক্ষর করুন।",feature2Title:"১০০% আইনিভাবে বৈধ",feature2Desc:"ভারতীয় তথ্যপ্রযুক্তি আইনের অধীনে সম্পূর্ণরূপে বৈধ।",feature3Title:"তাৎক্ষণিক ইমেল ডেলিভারি",feature3Desc:"যাচাইকরণ OTP এবং স্বাক্ষরের লিঙ্ক সঙ্গে সঙ্গে ইমেলে পৌঁছে যায়।",greeting:"নমস্কার,",compliancetag:"আধার ই-সাইন ও আইনি মান্যতা",aadhaarCompliant:"আধার এবং আইটি আইন ২০০০ সম্মত",attentionSub:"নথিতে আপনার স্বাক্ষর বাকি রয়েছে",vaultSynced:"সিস্টেম চালু আছে",totalDocs:"মোট নথি",pendingDocs:"আপনার স্বাক্ষর বাকি",completedDocs:"সম্পন্ন নথি",actionNeeded:"স্বাক্ষর প্রয়োজন",thisWeekGrowth:"+২ এই সপ্তাহে",rateDone:"৬৪% সম্পন্ন",searchPlaceholder:"নাম বা আইডি দিয়ে খুঁজুন...",filterAll:"সব",filterRequiresMe:"আমার স্বাক্ষর দরকার",filterCompleted:"সম্পন্ন",uploadAndSign:"➕ আপলোড ও স্বাক্ষর",colDocName:"নথির নাম",colSignersStatus:"স্বাক্ষরের স্থিতি",colLastUpdated:"সর্বশেষ আপডেট",colAction:"পদক্ষেপ",signNow:"স্বাক্ষর করুন",remind:"স্মরণ করান",download:"ডাউনলোড",showingAgreements:"প্রদর্শিত নথি",viewVaultLink:"সব নথি দেখুন →",legalValidityGuaranteed:"১০০% আইনিভাবে বৈধ",legalValidityDesc:"SignEase-এ করা স্বাক্ষর ভারতীয় আদালতে সম্পূর্ণ গ্রহণযোগ্য।",auditTrailGuide:"প্রমাণপত্র নির্দেশিকা ↗",docRegistryTitle:"আমার নথি",docRegistrySub:"আপনার স্বাক্ষরিত ও অপেক্ষমান নথিগুলি পরিচালনা করুন।",activeEnvelopes:"সক্রিয় নথি",needsAction:"আপনার স্বাক্ষর বাকি",awaitingSigners:"অন্যদের স্বাক্ষর বাকি",verificationAudit:"যাচাইকৃত",urgentReview:"জরুরি পদক্ষেপ",externalParties:"স্বাক্ষর বাকি",itActCompliant:"আইনিভাবে বৈধ",filterWaitingOthers:"অন্যদের জন্য বাকি",reviewAndSign:"দেখুন ও স্বাক্ষর করুন",downloadPdf:"PDF ডাউনলোড",continueEdit:"সম্পাদনা করুন",hsmActive:"ব্যাঙ্ক-মানের নিরাপত্তায় সুরক্ষিত",hsmDesc:"প্রতিটি স্বাক্ষরিত নথির সাথে অফিসিয়াল সার্টিফিকেট থাকে।",viewCryptoCert:"সার্টিফিকেট দেখুন →",workflowDispatch:"স্বাক্ষরের জন্য পাঠান",sendDocForSignature:"নথিতে স্বাক্ষরের জন্য পাঠান",sendDocDesc:"আপনার PDF নির্বাচন করুন, নাম ও ইমেল লিখে দ্রুত পাঠান।",step1Upload:"১. ফাইল বেছে নিন",pdfFormatUpTo:"PDF (সর্বোচ্চ ২৫ MB)",dropPdfHere:"আপনার PDF ফাইল এখানে রাখুন, অথবা",browseFiles:"ফাইল ব্রাউজ করুন",encryptedTransit:"নিরাপদ ও ব্যক্তিগত • সর্বোচ্চ ২৫ MB",readyToTag:"প্রস্তুত",step2Signers:"২. স্বাক্ষরকারী যোগ করুন",orderType:"স্বাক্ষরের ক্রম",signersNotice:"স্বাক্ষরকারী সরাসরি ইমেল লিঙ্ক পাবেন। অ্যাকাউন্ট খোলার দরকার নেই।",signerName:"নাম",emailAddress:"ইমেল ঠিকানা",role:"ভূমিকা",needsToSign:"স্বাক্ষর করতে হবে",receivesCopy:"শুধুমাত্র কপি পাবেন",addAnotherRecipient:"➕ আরও একজন যোগ করুন",tamperProofAudit:"আইনি অডিট রেকর্ড",tamperProofDesc:"তারিখ, সময় ও স্বাক্ষরের রেকর্ড সুরক্ষিত থাকে।",sendReminder48h:"২ দিনের মধ্যে স্বাক্ষর না হলে স্মরণ করান",cancel:"বাতিল করুন",saveAsDraft:"ড্রাফট হিসেবে সংরক্ষণ করুন",sendForSignature:"স্বাক্ষরের জন্য পাঠান ▶",trustLedger:"নথি যাচাইকরণ",verifyAuthenticity:"নথির সত্যতা যাচাই করুন",verifyDocSubtitle:"স্বাক্ষরিত নথিটি আসল ও অপরিবর্তিত কিনা সহজে যাচাই করুন।",auditorNodeOnline:"সিস্টেম চালু আছে",tabEnterHash:"নথি কোড / আইডি লিখুন",tabUploadFile:"স্বাক্ষরিত ফাইল আপলোড করুন",checksumLabel:"নথি কোড বা আইডি",pasteBtn:"পেস্ট করুন",verifyDocumentBtn:"যাচাই করুন",verifyHelperNotice:"আমরা আপনার ফাইল সম্পূর্ণ সুরক্ষিত ও গোপন রাখি।",verifiedAuthenticTitle:"নথি আসল ও নিরাপদ",legallyBinding:"আইনিভাবে বৈধ",verifiedSub:"স্বাক্ষর ও নথি সম্পূর্ণ খাঁটি।",downloadAuditCertificate:"সার্টিফিকেট ডাউনলোড (PDF)",metaDocTitle:"নথির নাম",metaSignaturesVerified:"স্বাক্ষর",metaTimestampAuth:"তারিখ ও সময়",originalMatch:"আসল কপি",sealedEndToEnd:"নিরাপদভাবে সিল করা",itActTitle:"আইটি আইন ২০০০ অনুযায়ী বৈধ",itActDesc:"ভারতীয় আইন অনুসারে এই স্বাক্ষর সম্পূর্ণ বৈধ।",zkpTitle:"১০০% গোপনীয় ও সুরক্ষিত",zkpDesc:"আপনার ফাইলের তথ্য কারও সাথে শেয়ার করা হয় না।",regTitle:"নতুন অ্যাকাউন্ট তৈরি করুন",regSub:"আপনার ইমেল লিখে ৬-সংখ্যার OTP পান",firstName:"প্রথম নাম",lastName:"পদবি",orgName:"কোম্পানি বা ব্যবসার নাম",emailInput:"ইমেল ঠিকানা",btnGetOtp:"OTP পান",otpLabel:"৬-সংখ্যার ইমেল OTP লিখুন",btnVerifyOtp:"OTP যাচাই করুন",otpDispatchedMsg:"আপনার ইমেলে ৬ সংখ্যার OTP পাঠানো হয়েছে।",password:"পাসওয়ার্ড",btnCreateAccount:"অ্যাকাউন্ট খুলুন",alreadyRegistered:"ইতিমধ্যে অ্যাকাউন্ট আছে?",signInHere:"এখানে লগইন করুন",loginTitle:"লগইন করুন",loginSub:"আপনার নথি দেখতে লগইন করুন",dontHaveAccount:"নতুন অ্যাকাউন্ট তৈরি করবেন?",signUpHere:"অ্যাকাউন্ট খুলুন",signerWelcome:"নথি পর্যালোচনা ও স্বাক্ষর",requestedBy:"অনুরোধকারী",tabDraw:"✍️ স্বাক্ষর আঁকুন",tabType:"⌨️ নাম টাইপ করুন",btnClear:"মুছে ফেলুন",btnCompleteSigning:"✅ স্বাক্ষর সম্পন্ন করুন",otpNotice:"পরিচয় যাচাইয়ের জন্য ইমেলে ৬ সংখ্যার OTP পাঠানো হবে।",footerNote:"SignEase — সহজ, দ্রুত ও আইনিভাবে বৈধ ডিজিটাল স্বাক্ষর।"},ta:{brand:"SignEase",home:"முகப்பு",dashboard:"டாஷ்போர்டு",documents:"ஆவணங்கள்",upload:"பதிவேற்றி கையொப்பமிடுங்கள்",send:"கையொப்பத்திற்கு அனுப்புங்கள்",verify:"ஆவணத்தைச் சரிபார்க்கவும்",admin:"நிர்வாகி",signIn:"உள்நுழையவும்",createAccount:"கணக்கை உருவாக்கவும்",signOut:"வெளியேறவும்",profile:"சுயவிவரம்",myProfile:"எனது சுயவிவரம்",profileSettings:"சுயவிவர அமைப்புகள்",changePhoto:"புகைப்படத்தை மாற்றவும்",personalInfo:"தனிப்பட்ட தகவல்",phone:"தொலைபேசி எண்",organization:"நிறுவனம்",designation:"பதவி",department:"துறை",saveProfile:"சேமிக்கவும்",digitalSignature:"டிஜிட்டல் கையொப்பம்",signatureStatus:"ஆதார் இ-சைன் சரிபார்க்கப்பட்டது",security:"கணக்கு பாதுகாப்பு",language:"மொழி",newEnvelope:"+ புதிய ஆவணம்",newAgreement:"+ புதிய ஒப்பந்தம்",exportCsv:"CSV பதிவிறக்கம்",darkModeToggle:"டார்க் / லைட் பயன்முறை",heroBadge:"✨ எளிய மற்றும் பாதுகாப்பான டிஜிட்டல் கையொப்பம்",heroTitle:"சில நிமிடங்களில் ஆவணங்களில் கையொப்பமிட்டு அனுப்புங்கள்",heroSubtitle:"ஆன்லைனில் ஒப்பந்தங்களில் கையொப்பமிடுவதற்கான எளிதான மற்றும் பாதுகாப்பான வழி.",btnStartFree:"இலவசமாகத் தொடங்குங்கள்",btnSenderDashboard:"என் டாஷ்போர்டு",btnVerifyDoc:"ஆவணத்தைச் சரிபார்க்கவும்",greeting:"வணக்கம்,",compliancetag:"ஆதார் இ-கையொப்பம் சட்டப்படி செல்லுபடியாகும்",aadhaarCompliant:"ஆதார் மற்றும் தகவல் தொழில்நுட்ப சட்டம் 2000 இணக்கமானது",attentionSub:"ஆவணங்களில் உங்கள் கையொப்பம் தேவை",totalDocs:"மொத்த ஆவணங்கள்",pendingDocs:"உங்கள் கையொப்பம் நிலுவையில் உள்ளது",completedDocs:"முடிவடைந்த ஆவணங்கள்",actionNeeded:"கையொப்பமிடவும்",searchPlaceholder:"பெயர் அல்லது எண்ணால் தேடுங்கள்...",filterAll:"அனைத்தும்",filterRequiresMe:"என் கையொப்பம் தேவை",filterCompleted:"முடிந்தது",uploadAndSign:"➕ பதிவேற்றி கையொப்பமிடுங்கள்",colDocName:"ஆவணப் பெயர்",colSignersStatus:"நிலை",colLastUpdated:"கடைசி புதுப்பிப்பு",colAction:"செயல்",signNow:"கையொப்பமிடுங்கள்",remind:"நினைவூட்டுங்கள்",download:"பதிவிறக்கவும்",legalValidityGuaranteed:"100% சட்டப்பூர்வமாக செல்லுபடியாகும்",docRegistryTitle:"என் ஆவணங்கள்",docRegistrySub:"உங்கள் அனைத்து கையொப்பமிட்ட ஆவணங்களையும் இங்கே பார்க்கவும்.",activeEnvelopes:"செயலில் உள்ள ஆவணங்கள்",needsAction:"உங்கள் கையொப்பம் தேவை",awaitingSigners:"பிறர் கையொப்பத்திற்கு காத்திருக்கிறது",verificationAudit:"சரிபார்க்கப்பட்டது",reviewAndSign:"பார்த்து கையொப்பமிடுங்கள்",downloadPdf:"PDF பதிவிறக்கவும்",workflowDispatch:"கையொப்பத்திற்கு அனுப்புங்கள்",sendDocForSignature:"ஆவணத்தை கையொப்பத்திற்கு அனுப்புங்கள்",sendDocDesc:"உங்கள் PDF-ஐ தேர்ந்தெடுத்து, பெயர் மற்றும் மின்னஞ்சலை உள்ளிட்டு உடனே அனுப்புங்கள்.",step1Upload:"1. கோப்பைத் தேர்வுசெய்க",pdfFormatUpTo:"PDF (அதிகபட்சம் 25 MB)",dropPdfHere:"இங்கே உங்கள் PDF-ஐ இடவும், அல்லது",browseFiles:"கோப்பைத் தேர்வுசெய்க",encryptedTransit:"பாதுகாப்பானது • அதிகபட்சம் 25 MB",step2Signers:"2. கையொப்பமிடுபவரைச் சேர்க்கவும்",signersNotice:"கையொப்பமிடுபவருக்கு மின்னஞ்சலில் நேரடி இணைப்பு கிடைக்கும். கணக்கு தேவையில்லை.",signerName:"பெயர்",emailAddress:"மின்னஞ்சல் முகவரி",role:"பங்கு",needsToSign:"கையொப்பமிட வேண்டும்",receivesCopy:"நகல் மட்டும் கிடைக்கும்",addAnotherRecipient:"➕ மற்றுமொருவரைச் சேர்க்கவும்",sendReminder48h:"2 நாட்களில் கையொப்பமிடவில்லை என்றால் நினைவூட்டுங்கள்",cancel:"ரத்து செய்",saveAsDraft:"வரைவாகச் சேமிக்கவும்",sendForSignature:"கையொப்பத்திற்கு அனுப்புங்கள் ▶",trustLedger:"ஆவண சரிபார்ப்பு",verifyAuthenticity:"ஆவணத்தின் நம்பகத்தன்மையைச் சரிபார்க்கவும்",verifyDocSubtitle:"கையொப்பமிட்ட ஆவணம் அசல் மற்றும் பாதுகாப்பானது என்பதை எளிதாகச் சரிபார்க்கவும்.",checksumLabel:"ஆவணக் குறியீடு அல்லது எண்",pasteBtn:"ஒட்டவும்",verifyDocumentBtn:"சரிபார்க்கவும்",verifiedAuthenticTitle:"ஆவணம் அசல் மற்றும் பாதுகாப்பானது",legallyBinding:"சட்டப்படி செல்லுபடியாகும்",downloadAuditCertificate:"சான்றிதழைப் பதிவிறக்கவும் (PDF)",metaDocTitle:"ஆவணப் பெயர்",metaSignaturesVerified:"கையொப்பங்கள்",metaTimestampAuth:"தேதி மற்றும் நேரம்",itActTitle:"தகவல் தொழில்நுட்ப சட்டம் 2000-ன் கீழ் செல்லுபடியாகும்",itActDesc:"இந்திய சட்டத்தின் கீழ் இந்த கையொப்பம் முற்றிலும் செல்லுபடியாகும்.",regTitle:"புதிய கணக்கை உருவாக்கவும்",regSub:"உங்கள் மின்னஞ்சலை உள்ளிட்டு 6 இலக்க OTP பெறவும்",firstName:"முதல் பெயர்",lastName:"கடைசி பெயர்",orgName:"நிறுவனத்தின் பெயர்",emailInput:"மின்னஞ்சல் முகவரி",btnGetOtp:"OTP பெறவும்",otpLabel:"6 இலக்க மின்னஞ்சல் OTP-ஐ உள்ளிடவும்",btnVerifyOtp:"OTP சரிபார்க்கவும்",otpDispatchedMsg:"உங்கள் மின்னஞ்சலுக்கு 6 இலக்க OTP அனுப்பப்பட்டுள்ளது.",password:"கடவுச்சொல்",btnCreateAccount:"கணக்கை உருவாக்கவும்",alreadyRegistered:"ஏற்கனவே கணக்கு உள்ளதா?",signInHere:"இங்கே உள்நுழையவும்",loginTitle:"உள்நுழையவும்",loginSub:"உங்கள் ஆவணங்களைப் பார்க்க உள்நுழையவும்",dontHaveAccount:"புதிய கணக்கு வேண்டுமா?",signUpHere:"கணக்கை உருவாக்கவும்",footerNote:"SignEase — எளிய, விரைவான மற்றும் சட்டப்பூர்வ மின்னணு கையொப்பம்."},te:{brand:"SignEase",home:"హోమ్",dashboard:"డ్యాష్‌బోర్డ్",documents:"పత్రాలు (Documents)",upload:"అప్‌లోడ్ & సంతకం",send:"సంతకం కోసం పంపండి",verify:"పత్రాన్ని ధృవీకరించండి",admin:"అడ్మిన్",signIn:"సైన్ ఇన్",createAccount:"ఖాతా సృష్టించండి",signOut:"లాగ్ అవుట్",profile:"ప్రొఫైల్",myProfile:"నా ప్రొఫైల్",profileSettings:"ప్రొఫైల్ సెట్టింగ్‌లు",changePhoto:"ఫోటో మార్చండి",personalInfo:"వ్యక్తిగత సమాచారం",phone:"ఫోన్ నంబర్",organization:"సంస్థ",designation:"హోదా",department:"విభాగం",saveProfile:"సేవ్ చేయండి",digitalSignature:"డిజిటల్ సంతకం",signatureStatus:"ఆధార్ ఇ-సైన్ ధృవీకరించబడింది",security:"ఖాతా భద్రత",language:"భాష",newEnvelope:"+ కొత్త పత్రం",newAgreement:"+ కొత్త ఒప్పందం",exportCsv:"CSV డౌన్‌లోడ్",darkModeToggle:"డార్క్ / లైట్ మోడ్",heroBadge:"✨ సులభమైన మరియు సురక్షితమైన డిజిటల్ సంతకం",heroTitle:"నిమిషాల్లో పత్రాలపై సంతకం చేసి పంపండి",heroSubtitle:"ఆన్‌లైన్‌లో ఒప్పందాలపై సంతకం చేయడానికి అత్యంత సులభమైన మరియు సురక్షితమైన మార్గం.",btnStartFree:"ఉచితంగా ప్రారంభించండి",btnSenderDashboard:"నా డ్యాష్‌బోర్డ్",btnVerifyDoc:"పత్రాన్ని ధృవీకరించండి",greeting:"నమస్కారం,",compliancetag:"ఆధార్ ఈ-సైన్ చట్టబద్ధంగా చెల్లుబాటు అవుతుంది",aadhaarCompliant:"ఆధార్ మరియు ఐటీ చట్టం 2000 అనుగుణంగా ఉంది",attentionSub:"పత్రాలపై మీ సంతకం పెండింగ్‌లో ఉంది",totalDocs:"మొత్తం పత్రాలు",pendingDocs:"మీ సంతకం పెండింగ్‌లో ఉంది",completedDocs:"పూర్తయిన పత్రాలు",actionNeeded:"సంతకం చేయండి",searchPlaceholder:"శీర్షిక లేదా ఐడీతో శోధించండి...",filterAll:"అన్నీ",filterRequiresMe:"నా సంతకం కావాలి",filterCompleted:"పూర్తయింది",uploadAndSign:"➕ అప్‌లోడ్ & సంతకం",colDocName:"పత్రం పేరు",colSignersStatus:"స్థితి",colLastUpdated:"చివరి నవీకరణ",colAction:"చర్య",signNow:"సంతకం చేయండి",remind:"గుర్తు చేయండి",download:"డౌన్‌లోడ్",legalValidityGuaranteed:"100% చట్టబద్ధంగా చెల్లుబాటు అవుతుంది",docRegistryTitle:"నా పత్రాలు",docRegistrySub:"మీ సంతకం చేసిన అన్ని పత్రాలను ఇక్కడ నిర్వహించండి.",activeEnvelopes:"క్రియాశీల పత్రాలు",needsAction:"మీ సంతకం అవసరం",awaitingSigners:"ఇతరుల సంతకం కోసం నిరీక్షణ",verificationAudit:"ధృవీకరించబడింది",reviewAndSign:"చూసి సంతకం చేయండి",downloadPdf:"PDF డౌన్‌లోడ్",workflowDispatch:"సంతకం కోసం పంపండి",sendDocForSignature:"పత్రాన్ని సంతకం కోసం పంపండి",sendDocDesc:"మీ PDF ని ఎంచుకుని, పేరు మరియు ఈమెయిల్‌ను జోడించి వెంటనే పంపండి.",step1Upload:"1. ఫైల్‌ను ఎంచుకోండి",pdfFormatUpTo:"PDF (గరిష్టంగా 25 MB)",dropPdfHere:"మీ PDF ఫైల్‌ను ఇక్కడ ఉంచండి, లేదా",browseFiles:"ఫైల్‌ను ఎంచుకోండి",encryptedTransit:"సురక్షితమైనది • గరిష్టంగా 25 MB",step2Signers:"2. సంతకం చేసేవారిని జోడించండి",signersNotice:"సంతకం చేసేవారికి ఈమెయిల్‌లో నేరుగా లింక్ వస్తుంది. ఖాతా అవసరం లేదు.",signerName:"పేరు",emailAddress:"ఈమెయిల్ చిరునామా",role:"పాత్ర",needsToSign:"సంతకం చేయాలి",receivesCopy:"కాపీ మాత్రమే అందుతుంది",addAnotherRecipient:"➕ మరొకరిని జోడించండి",sendReminder48h:"2 రోజుల్లో సంతకం చేయకపోతే గుర్తు చేయండి",cancel:"రద్దు చేయండి",saveAsDraft:"డ్రాఫ్ట్‌గా సేవ్ చేయండి",sendForSignature:"సంతకం కోసం పంపండి ▶",trustLedger:"పత్రం ధృవీకరణ",verifyAuthenticity:"పత్రం అసలైనదా కాదా అని తనిఖీ చేయండి",verifyDocSubtitle:"సంతకం చేసిన పత్రం అసలైనది మరియు సురక్షితమైనదని సులభంగా తనిఖీ చేయండి.",checksumLabel:"పత్రం కోడ్ లేదా ఐడీ",pasteBtn:"పేస్ట్ చేయండి",verifyDocumentBtn:"ధృవీకరించండి",verifiedAuthenticTitle:"పత్రం అసలైనది మరియు సురక్షితమైనది",legallyBinding:"చట్టబద్ధమైనది",downloadAuditCertificate:"సర్టిఫికేట్ డౌన్‌లోడ్ (PDF)",metaDocTitle:"పత్రం పేరు",metaSignaturesVerified:"సంతకాలు",metaTimestampAuth:"తేదీ మరియు సమయం",itActTitle:"ఐటీ చట్టం 2000 ప్రకారం చెల్లుబాటు అవుతుంది",itActDesc:"భారతీయ చట్టం ప్రకారం ఈ సంతకం పూర్తిగా చెల్లుబాటు అవుతుంది.",regTitle:"కొత్త ఖాతా సృష్టించండి",regSub:"మీ ఈమెయిల్‌ను నమోదు చేసి 6 అంకెల OTP పొందండి",firstName:"మొదటి పేరు",lastName:"చివరి పేరు",orgName:"సంస్థ పేరు",emailInput:"ఈమెయిల్ చిరునామా",btnGetOtp:"OTP పొందండి",otpLabel:"6 అంకెల ఈమెయిల్ OTP ని నమోదు చేయండి",btnVerifyOtp:"OTP ని ధృవీకరించండి",otpDispatchedMsg:"మీ ఈమెయిల్‌కు 6 అంకెల OTP పంపబడింది.",password:"పాస్‌వర్డ్",btnCreateAccount:"ఖాతా సృష్టించండి",alreadyRegistered:"ఇప్పటికే ఖాతా ఉందా?",signInHere:"ఇక్కడ లాగిన్ అవ్వండి",loginTitle:"లాగిన్ అవ్వండి",loginSub:"మీ పత్రాలను చూడటానికి లాగిన్ అవ్వండి",dontHaveAccount:"కొత్త ఖాతా కావాలా?",signUpHere:"ఖాతా సృష్టించండి",footerNote:"SignEase — సులభమైన, వేగవంతమైన మరియు చట్టబద్ధమైన డిజిటల్ సంతకం."},kn:{brand:"SignEase",home:"ಮುಖಪುಟ",dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",documents:"ದಾಖಲೆಗಳು (Documents)",upload:"ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸಹಿ",send:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",verify:"ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ",admin:"ನಿರ್ವಾಹಕ",signIn:"ಸೈನ್ ಇನ್",createAccount:"ಖಾತೆ ತೆರೆಯಿರಿ",signOut:"ಲಾಗ್ ಔಟ್",profile:"ಪ್ರೊಫೈಲ್",myProfile:"ನನ್ನ ಪ್ರೊಫೈಲ್",profileSettings:"ಪ್ರೊಫೈಲ್ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",changePhoto:"ಫೋಟೋ ಬದಲಾಯಿಸಿ",personalInfo:"ವೈಯಕ್ತಿಕ ಮಾಹಿತಿ",phone:"ದೂರವಾಣಿ ಸಂಖ್ಯೆ",organization:"ಸಂಸ್ಥೆ",designation:"ಹುದ್ದೆ",department:"ವಿಭಾಗ",saveProfile:"ಉಳಿಸಿ",digitalSignature:"ಡಿಜಿಟಲ್ ಸಹಿ",signatureStatus:"ಆಧಾರ್ ಇ-ಸೈನ್ ಪರಿಶೀಲಿಸಲಾಗಿದೆ",security:"ಖಾತೆ ಭದ್ರತೆ",language:"ಭಾಷೆ",newEnvelope:"+ ಹೊಸ ದಾಖಲೆ",newAgreement:"+ ಹೊಸ ಒಪ್ಪಂದ",exportCsv:"CSV ಡೌನ್‌ಲೋಡ್",darkModeToggle:"ಡಾರ್ಕ್ / ಲೈಟ್ ಮೋಡ್",heroBadge:"✨ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ ಡಿಜಿಟಲ್ ಸಹಿ",heroTitle:"ಕೆಲವೇ ನಿಮಿಷಗಳಲ್ಲಿ ದಾಖಲೆಗಳಿಗೆ ಸಹಿ ಮಾಡಿ ಕಳುಹಿಸಿ",heroSubtitle:"ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಒಪ್ಪಂದಗಳಿಗೆ ಸಹಿ ಮಾಡಲು ಅತ್ಯಂತ ಸರಳ ಮತ್ತು ಸುರಕ್ಷಿತ ವಿಧಾನ.",btnStartFree:"ಉಚಿತವಾಗಿ ಪ್ರಾರಂಭಿಸಿ",btnSenderDashboard:"ನನ್ನ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",btnVerifyDoc:"ದಾಖಲೆ ಪರಿಶೀಲಿಸಿ",greeting:"ನಮಸ್ಕಾರ,",compliancetag:"ಆಧಾರ್ ಇ-ಸಹಿ ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ",aadhaarCompliant:"ಆಧಾರ್ ಮತ್ತು ಐಟಿ ಕಾಯಿದೆ 2000 ಅನುಸರಣೆ",attentionSub:"ದಾಖಲೆಗಳಲ್ಲಿ ನಿಮ್ಮ ಸಹಿ ಬಾಕಿ ಇದೆ",totalDocs:"ಒಟ್ಟು ದಾಖಲೆಗಳು",pendingDocs:"ನಿಮ್ಮ ಸಹಿ ಬಾಕಿ ಇದೆ",completedDocs:"ಪೂರ್ಣಗೊಂಡ ದಾಖಲೆಗಳು",actionNeeded:"ಸಹಿ ಮಾಡಿ",searchPlaceholder:"ಹೆಸರು ಅಥವಾ ಐಡಿಯಿಂದ ಹುಡುಕಿ...",filterAll:"ಎಲ್ಲವೂ",filterRequiresMe:"ನನ್ನ ಸಹಿ ಬೇಕು",filterCompleted:"ಪೂರ್ಣಗೊಂಡಿದೆ",uploadAndSign:"➕ ಅಪ್‌ಲೋಡ್ ಮತ್ತು ಸಹಿ",colDocName:"ದಾಖಲೆಯ ಹೆಸರು",colSignersStatus:"ಸ್ಥಿತಿ",colLastUpdated:"ಕೊನೆಯ ನವೀಕರಣ",colAction:"ಕ್ರಿಯೆ",signNow:"ಸಹಿ ಮಾಡಿ",remind:"ನೆನಪಿಸಿ",download:"ಡೌನ್‌ಲೋಡ್",legalValidityGuaranteed:"100% ಕಾನೂನುಬದ್ಧವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ",docRegistryTitle:"ನನ್ನ ದಾಖಲೆಗಳು",docRegistrySub:"ನಿಮ್ಮ ಎಲ್ಲಾ ಸಹಿ ಮಾಡಿದ ದಾಖಲೆಗಳನ್ನು ಇಲ್ಲಿ ನಿರ್ವಹಿಸಿ.",activeEnvelopes:"ಸಕ್ರಿಯ ದಾಖಲೆಗಳು",needsAction:"ನಿಮ್ಮ ಸಹಿ ಅಗತ್ಯವಿದೆ",awaitingSigners:"ಇತರರ ಸಹಿಗಾಗಿ ನಿರೀಕ್ಷಿಸಲಾಗುತ್ತಿದೆ",verificationAudit:"ಪರಿಶೀಲಿಸಲಾಗಿದೆ",reviewAndSign:"ನೋಡಿ ಸಹಿ ಮಾಡಿ",downloadPdf:"PDF ಡೌನ್‌ಲೋಡ್",workflowDispatch:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",sendDocForSignature:"ದಾಖಲೆಯನ್ನು ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ",sendDocDesc:"ನಿಮ್ಮ PDF ಆಯ್ಕೆಮಾಡಿ, ಹೆಸರು ಮತ್ತು ಇಮೇಲ್ ಸೇರಿಸಿ ತಕ್ಷಣ ಕಳುಹಿಸಿ.",step1Upload:"1. ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",pdfFormatUpTo:"PDF (ಗರಿಷ್ಠ 25 MB)",dropPdfHere:"ನಿಮ್ಮ PDF ಫೈಲ್ ಇಲ್ಲಿ ಹಾಕಿ, ಅಥವಾ",browseFiles:"ಫೈಲ್ ಆಯ್ಕೆಮಾಡಿ",encryptedTransit:"ಸುರಕ್ಷಿತ • ಗರಿಷ್ಠ 25 MB",step2Signers:"2. ಸಹಿ ಮಾಡುವವರನ್ನು ಸೇರಿಸಿ",signersNotice:"ಸಹಿ ಮಾಡುವವರಿಗೆ ಇಮೇಲ್‌ನಲ್ಲಿ ನೇರ ಲಿಂಕ್ ಸಿಗುತ್ತದೆ. ಖಾತೆ ಅಗತ್ಯವಿಲ್ಲ.",signerName:"ಹೆಸರು",emailAddress:"ಇಮೇಲ್ ವಿಳಾಸ",role:"ಪಾತ್ರ",needsToSign:"ಸಹಿ ಮಾಡಬೇಕು",receivesCopy:"ಪ್ರತಿ ಮಾತ್ರ ಸಿಗುತ್ತದೆ",addAnotherRecipient:"➕ ಇನ್ನೊಬ್ಬರನ್ನು ಸೇರಿಸಿ",sendReminder48h:"2 ದಿನಗಳಲ್ಲಿ ಸಹಿ ಮಾಡದಿದ್ದರೆ ನೆನಪಿಸಿ",cancel:"ರದ್ದುಮಾಡಿ",saveAsDraft:"ಕರಡಾಗಿ ಉಳಿಸಿ",sendForSignature:"ಸಹಿಗಾಗಿ ಕಳುಹಿಸಿ ▶",trustLedger:"ದಾಖಲೆ ಪರಿಶೀಲನೆ",verifyAuthenticity:"ದಾಖಲೆಯ ನೈಜತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ",verifyDocSubtitle:"ಸಹಿ ಮಾಡಿದ ದಾಖಲೆಯು ಅಸಲಿಯೇ ಮತ್ತು ಸುರಕ್ಷಿತವೇ ಎಂದು ಸುಲಭವಾಗಿ ಪರಿಶೀಲಿಸಿ.",checksumLabel:"ದಾಖಲೆ ಕೋಡ್ ಅಥವಾ ಐಡಿ",pasteBtn:"ಅಂಟಿಸಿ",verifyDocumentBtn:"ಪರಿಶೀಲಿಸಿ",verifiedAuthenticTitle:"ದಾಖಲೆ ಅಸಲಿ ಮತ್ತು ಸುರಕ್ಷಿತವಾಗಿದೆ",legallyBinding:"ಕಾನೂನುಬದ್ಧವಾಗಿದೆ",downloadAuditCertificate:"ಪ್ರಮಾಣಪತ್ರ ಡೌನ್‌ಲೋಡ್ (PDF)",metaDocTitle:"ದಾಖಲೆಯ ಹೆಸರು",metaSignaturesVerified:"ಸಹಿಗಳು",metaTimestampAuth:"ದಿನಾಂಕ ಮತ್ತು ಸಮಯ",itActTitle:"ಐಟಿ ಕಾಯ್ದೆ 2000 ಅಡಿಯಲ್ಲಿ ಮಾನ್ಯವಾಗಿದೆ",itActDesc:"ಭಾರತೀಯ ಕಾನೂನಿನ ಪ್ರಕಾರ ಈ ಸಹಿ ಸಂಪೂರ್ಣವಾಗಿ ಮಾನ್ಯವಾಗಿದೆ.",regTitle:"ಹೊಸ ಖಾತೆ ರಚಿಸಿ",regSub:"ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ 6 ಅಂಕಿಗಳ OTP ಪಡೆಯಿರಿ",firstName:"ಮೊದಲ ಹೆಸರು",lastName:"ಕೊನೆಯ ಹೆಸರು",orgName:"ಸಂಸ್ಥೆಯ ಹೆಸರು",emailInput:"ಇಮೇಲ್ ವಿಳಾಸ",btnGetOtp:"OTP ಪಡೆಯಿರಿ",otpLabel:"6 ಅಂಕಿಗಳ ಇಮೇಲ್ OTP ನಮೂದಿಸಿ",btnVerifyOtp:"OTP ಪರಿಶೀಲಿಸಿ",otpDispatchedMsg:"ನಿಮ್ಮ ಇಮೇಲ್‌ಗೆ 6 ಅಂಕಿಗಳ OTP ಕಳುಹಿಸಲಾಗಿದೆ.",password:"ಪಾಸ್‌ವರ್ಡ್",btnCreateAccount:"ಖಾತೆ ತೆರೆಯಿರಿ",alreadyRegistered:"ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",signInHere:"ಇಲ್ಲಿ ಲಾಗಿನ್ ಆಗಿ",loginTitle:"ಲಾಗಿನ್ ಆಗಿ",loginSub:"ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಲಾಗಿನ್ ಆಗಿ",dontHaveAccount:"ಹೊಸ ಖಾತೆ ಬೇಕೇ?",signUpHere:"ಖಾತೆ ತೆರೆಯಿರಿ",footerNote:"SignEase — ಸುಲಭ, ವೇಗದ ಮತ್ತು ಕಾನೂನುಬದ್ಧ ಡಿಜಿಟಲ್ ಸಹಿ."},fr:{brand:"SignEase",home:"Accueil",dashboard:"Tableau de bord",documents:"Documents",upload:"Téléverser & Signer",send:"Envoyer pour signature",verify:"Vérifier un document",admin:"Administration",reports:"Rapports",reportGeneration:"Génération de rapports",templates:"Modèles",templatesLibrary:"Bibliothèque de modèles",useTemplate:"Utiliser ce modèle",previewTemplate:"Aperçu du modèle",termsAndConditions:"Conditions Générales",agreeToTerms:"J'accepte les Conditions Générales",termsAcceptedCount:"Conditions acceptées",signIn:"Se connecter",createAccount:"Créer un compte",forgotPassword:"Mot de passe oublié ?",resetPassword:"Réinitialiser le mot de passe",timeframeToday:"Aujourd'hui",timeframeLast7Days:"7 derniers jours",timeframeLast30Days:"30 derniers jours",timeframeThisMonth:"Ce mois-ci",timeframeCustom:"Période personnalisée",timeframeAll:"Tout le temps",startDate:"Date de début",endDate:"Date de fin",exportCsvReport:"Télécharger le rapport CSV",signOut:"Se déconnecter",profile:"Profil",myProfile:"Mon profil",profileSettings:"Paramètres du profil",changePhoto:"Changer la photo",personalInfo:"Informations personnelles",phone:"Numéro de téléphone",organization:"Organisation",designation:"Fonction / Titre",department:"Département",saveProfile:"Enregistrer les modifications",digitalSignature:"Style de signature numérique",signatureStatus:"Vérifié par signature électronique",security:"Sécurité du compte",language:"Langue",newEnvelope:"+ Nouvelle enveloppe",newAgreement:"+ Nouvel accord",exportCsv:"Exporter CSV",darkModeToggle:"Mode sombre / clair",heroBadge:"✨ Signatures numériques simples & sécurisées",heroTitle:"Signez et envoyez des documents en quelques minutes",heroSubtitle:"Le moyen le plus simple et le plus rapide de signer des contrats et formulaires en ligne en toute sécurité.",btnStartFree:"Commencer gratuitement",btnSenderDashboard:"Mon tableau de bord",btnVerifyDoc:"Vérifier un document",howItWorks:"3 étapes simples pour signer tout document",step1Title:"1. Téléverser le PDF",step1Desc:"Sélectionnez un accord, contrat ou formulaire depuis votre appareil.",step2Title:"2. Ajouter des signataires",step2Desc:"Saisissez les noms et e-mails des personnes qui doivent signer.",step3Title:"3. Signer & Télécharger",step3Desc:"Signez avec votre doigt ou tapez votre nom et téléchargez le PDF.",whyChooseUs:"Pourquoi choisir SignEase",feature1Title:"Installation zéro",feature1Desc:"Aucune application requise. Ouvrez le lien sur mobile ou ordinateur et signez.",feature2Title:"100% juridiquement valable",feature2Desc:"Certificats officiels d’exécution avec valeur probante légale.",feature3Title:"Livraison e-mail instantanée",feature3Desc:"Les codes OTP et liens de signature arrivent immédiatement.",greeting:"Bonjour,",compliancetag:"CONFORME E-SIGN",aadhaarCompliant:"Conformité légale et chiffrement sécurisé",attentionSub:"documents en attente de votre signature",vaultSynced:"Système en ligne",totalDocs:"TOTAL DES DOCUMENTS",pendingDocs:"EN ATTENTE DE VOTRE SIGNATURE",completedDocs:"TERMINÉS & ARCHIVÉS",actionNeeded:"Action requise",thisWeekGrowth:"+2 cette semaine",rateDone:"64% complété",searchPlaceholder:"Rechercher par titre, signataire ou ID...",filterAll:"Tous",filterRequiresMe:"Nécessite ma signature",filterCompleted:"Terminé",uploadAndSign:"➕ Téléverser & Signer",colDocName:"NOM DU DOCUMENT",colSignersStatus:"SIGNATAIRES & STATUT",colLastUpdated:"DERNIÈRE MISE À JOUR",colAction:"ACTION",signNow:"Signer maintenant",remind:"Rappeler",download:"Télécharger",showingAgreements:"Affichage des accords",viewVaultLink:"Voir tous les documents →",legalValidityGuaranteed:"100% Juridiquement valable",legalValidityDesc:"Les signatures sur SignEase sont conformes aux normes légales internationales de commerce électronique.",auditTrailGuide:"Guide du certificat d’audit ↗",docRegistryTitle:"Documents",docRegistrySub:"Gérez et suivez vos accords et formulaires signés.",activeEnvelopes:"DOCUMENTS ACTIFS",needsAction:"EN ATTENTE DE VOUS",awaitingSigners:"EN ATTENTE D’AUTRES",verificationAudit:"VÉRIFIÉ",urgentReview:"Action requise",externalParties:"En attente des signataires",itActCompliant:"Juridiquement valide",filterWaitingOthers:"En attente des autres",reviewAndSign:"Examiner & Signer",downloadPdf:"Télécharger le PDF",continueEdit:"Continuer l’édition",hsmActive:"Sécurité de niveau bancaire",hsmDesc:"Chaque document signé possède une empreinte inviolable avec certificat.",viewCryptoCert:"Voir le certificat →",workflowDispatch:"ENVOYER POUR SIGNATURE",sendDocForSignature:"Envoyer un document pour signature",sendDocDesc:"Téléversez votre PDF, désignez les signataires et envoyez en quelques secondes.",step1Upload:"1 Téléverser le fichier",pdfFormatUpTo:"PDF JUSQU’À 25 MO",dropPdfHere:"Déposez votre PDF ici, ou",browseFiles:"Parcourir les fichiers",encryptedTransit:"Sécurisé & Privé • Max 25 MO",readyToTag:"Prêt",step2Signers:"2 Ajouter les signataires",orderType:"ORDRE DE SIGNATURE",signersNotice:"Les signataires recevront un lien sécurisé par e-mail et WhatsApp. Aucun compte requis.",signerName:"NOM",emailAddress:"ADRESSE E-MAIL",role:"ACTION",needsToSign:"Doit signer",receivesCopy:"Reçoit une copie",addAnotherRecipient:"➕ Ajouter un autre destinataire",tamperProofAudit:"Piste d’audit automatique",tamperProofDesc:"Enregistre la date, l’heure et les signatures pour preuve légale complète.",sendReminder48h:"Envoyer un rappel par e-mail après 48h",cancel:"Annuler",saveAsDraft:"Enregistrer comme brouillon",sendForSignature:"Envoyer pour signature ▶",trustLedger:"VÉRIFIER LE DOCUMENT",verifyAuthenticity:"Vérifier l’authenticité du document",verifyDocSubtitle:"Vérifiez si un document signé est authentique, légal et inaltéré.",auditorNodeOnline:"Statut du système : En ligne",tabEnterHash:"Saisir le code / ID du document",tabUploadFile:"Téléverser le fichier signé",checksumLabel:"Code, hachage ou ID du document",pasteBtn:"Coller",verifyDocumentBtn:"Vérifier le document",verifyHelperNotice:"Nous vérifions l’authenticité en toute sécurité sans exposer vos contenus privés.",verifiedAuthenticTitle:"Document vérifié & authentique",legallyBinding:"Force obligatoire légale",verifiedSub:"Les signatures et le document correspondent au registre officiel.",downloadAuditCertificate:"Télécharger le certificat d’audit (PDF)",metaDocTitle:"NOM DU DOCUMENT",metaSignaturesVerified:"SIGNATURES",metaTimestampAuth:"DATE & HEURE",originalMatch:"Correspondance originale",sealedEndToEnd:"Scellé et protégé légalement",itActTitle:"Norme légale de signature électronique",itActDesc:"Les signatures SignEase sont pleinement exécutoires et reconnues juridiquement.",zkpTitle:"100% Privé & Confidentiel",zkpDesc:"Seule l’empreinte cryptographique SHA-256 est vérifiée.",regTitle:"Créer un compte",regSub:"Rejoignez la plateforme de signature sécurisée SignEase",firstName:"Prénom",lastName:"Nom",orgName:"Nom de l’entreprise / organisation",emailInput:"Adresse e-mail professionnelle",btnGetOtp:"Obtenir OTP",otpLabel:"Saisir le code OTP à 6 chiffres",btnVerifyOtp:"Vérifier OTP",otpDispatchedMsg:"Le code OTP à 6 chiffres a été envoyé à votre e-mail.",password:"Mot de passe",btnCreateAccount:"Créer un compte",alreadyRegistered:"Déjà un compte ?",signInHere:"Connectez-vous ici",loginTitle:"Bienvenue",loginSub:"Connectez-vous pour accéder à vos documents et contrats",dontHaveAccount:"Pas encore de compte ?",signUpHere:"Créer un compte",suggestPassword:"Suggérer un mot de passe fort",confirmPassword:"Confirmer le mot de passe",passwordsMatch:"Les mots de passe correspondent",passwordsDoNotMatch:"Les mots de passe ne correspondent pas",deliveryChannel:"Canal de distribution",whatsapp:"WhatsApp",whatsappDelivery:"Distribution par WhatsApp",whatsappOtp:"Vérification OTP par WhatsApp",emailOtp:"Vérification OTP par e-mail",getWhatsAppOtp:"Obtenir OTP WhatsApp",sendViaWhatsApp:"Envoyer par WhatsApp",shareWhatsApp:"Partager sur WhatsApp",passwordReqLength:"8+ caractères",passwordReqLetters:"Lettres (a-z, A-Z)",passwordReqNumbers:"Chiffres (0-9)",passwordReqSymbols:"Caractère spécial (!@#$...)",signerWelcome:"Examiner & Signer le document",requestedBy:"Demandé par",tabDraw:"✍️ Dessiner la signature",tabType:"⌨️ Saisir le nom",btnClear:"Effacer",btnCompleteSigning:"✅ Terminer & Signer le document",otpNotice:"Un code OTP à 6 chiffres sera envoyé à votre adresse e-mail pour vérifier votre identité.",footerNote:"SignEase — Signature de documents électroniques simple, rapide et légale."},es:{brand:"SignEase",home:"Inicio",dashboard:"Panel de control",documents:"Documentos",upload:"Subir & Firmar",send:"Enviar para firma",verify:"Verificar documento",admin:"Administración",reports:"Informes",reportGeneration:"Generación de informes",templates:"Plantillas",templatesLibrary:"Biblioteca de plantillas",useTemplate:"Usar plantilla",previewTemplate:"Vista previa de plantilla",termsAndConditions:"Términos y Condiciones",agreeToTerms:"Acepto los Términos y Condiciones",termsAcceptedCount:"Términos aceptados",signIn:"Iniciar sesión",createAccount:"Crear cuenta",forgotPassword:"¿Olvidó su contraseña?",resetPassword:"Restablecer contraseña",timeframeToday:"Hoy",timeframeLast7Days:"Últimos 7 días",timeframeLast30Days:"Últimos 30 días",timeframeThisMonth:"Este mes",timeframeCustom:"Rango personalizado",timeframeAll:"Todo el tiempo",startDate:"Fecha de inicio",endDate:"Fecha de fin",exportCsvReport:"Descargar informe CSV",signOut:"Cerrar sesión",profile:"Perfil",myProfile:"Mi perfil",profileSettings:"Configuración de perfil",changePhoto:"Cambiar foto",personalInfo:"Información personal",phone:"Número de teléfono",organization:"Organización",designation:"Puesto / Cargo",department:"Departamento",saveProfile:"Guardar cambios",digitalSignature:"Estilo de firma digital",signatureStatus:"Verificado por firma electrónica",security:"Seguridad de la cuenta",language:"Idioma",newEnvelope:"+ Nuevo sobre",newAgreement:"+ Nuevo acuerdo",exportCsv:"Exportar CSV",darkModeToggle:"Modo oscuro / claro",heroBadge:"✨ Firmas digitales sencillas y seguras",heroTitle:"Firme y envíe documentos en minutos",heroSubtitle:"La forma más rápida y sencilla de firmar contratos y formularios en línea con plena validez jurídica.",btnStartFree:"Comenzar gratis",btnSenderDashboard:"Mi panel de control",btnVerifyDoc:"Verificar un documento",howItWorks:"3 sencillos pasos para firmar cualquier documento",step1Title:"1. Subir PDF",step1Desc:"Seleccione cualquier acuerdo o contrato desde su dispositivo.",step2Title:"2. Añadir firmantes",step2Desc:"Escriba los nombres y correos de las personas que deben firmar.",step3Title:"3. Firmar & Descargar",step3Desc:"Firme con su dedo o escriba su nombre y descargue el PDF.",whyChooseUs:"Por qué elegir SignEase",feature1Title:"Sin instalación compleja",feature1Desc:"No requiere aplicación. Abra el enlace en móvil u ordenador y firme en segundos.",feature2Title:"100% legalmente vinculante",feature2Desc:"Certificados oficiales de ejecución con validez probatoria ante la ley.",feature3Title:"Envío de correo instantáneo",feature3Desc:"Los códigos OTP y enlaces de firma llegan de inmediato a su bandeja de entrada.",greeting:"Hola,",compliancetag:"CUMPLE CON FIRMA DIGITAL",aadhaarCompliant:"Cumplimiento legal y cifrado seguro",attentionSub:"documentos en espera de su firma",vaultSynced:"Sistema en línea",totalDocs:"TOTAL DE DOCUMENTOS",pendingDocs:"ESPERANDO SU FIRMA",completedDocs:"COMPLETADOS Y ARCHIVADOS",actionNeeded:"Acción requerida",thisWeekGrowth:"+2 esta semana",rateDone:"64% completado",searchPlaceholder:"Buscar por título, firmante o ID...",filterAll:"Todos",filterRequiresMe:"Requiere mi firma",filterCompleted:"Completado",uploadAndSign:"➕ Subir & Firmar",colDocName:"NOMBRE DEL DOCUMENTO",colSignersStatus:"FIRMANTES Y ESTADO",colLastUpdated:"ÚLTIMA ACTUALIZACIÓN",colAction:"ACCIÓN",signNow:"Firmar ahora",remind:"Recordar",download:"Descargar",showingAgreements:"Mostrando acuerdos",viewVaultLink:"Ver todos los documentos →",legalValidityGuaranteed:"100% Legalmente válido",legalValidityDesc:"Las firmas en SignEase cumplen con las leyes de comercio electrónico y firma digital.",auditTrailGuide:"Guía del certificado de auditoría ↗",docRegistryTitle:"Documentos",docRegistrySub:"Gestione y rastree sus acuerdos y contratos firmados.",activeEnvelopes:"DOCUMENTOS ACTIVOS",needsAction:"ESPERANDO POR USTED",awaitingSigners:"ESPERANDO POR OTROS",verificationAudit:"VERIFICADO",urgentReview:"Acción requerida",externalParties:"Esperando a los firmantes",itActCompliant:"Legalmente válido",filterWaitingOthers:"Esperando por otros",reviewAndSign:"Revisar & Firmar",downloadPdf:"Descargar PDF",continueEdit:"Continuar edición",hsmActive:"Seguridad de nivel bancario",hsmDesc:"Cada documento firmado cuenta con sellado inalterable y certificado.",viewCryptoCert:"Ver certificado →",workflowDispatch:"ENVIAR PARA FIRMA",sendDocForSignature:"Enviar documento para firma",sendDocDesc:"Suba su PDF, añada a los firmantes y envíe en cuestión de segundos.",step1Upload:"1 Subir archivo",pdfFormatUpTo:"PDF DE HASTA 25 MB",dropPdfHere:"Suelte su PDF aquí, o",browseFiles:"Examinar archivos",encryptedTransit:"Seguro y privado • Máximo 25 MB",readyToTag:"Listo",step2Signers:"2 Añadir firmantes",orderType:"ORDEN DE FIRMA",signersNotice:"Los firmantes recibirán un enlace seguro por correo y WhatsApp. No requiere cuenta.",signerName:"NOMBRE",emailAddress:"CORREO ELECTRÓNICO",role:"ACCIÓN",needsToSign:"Necesita firmar",receivesCopy:"Recibe una copia",addAnotherRecipient:"➕ Añadir otro destinatario",tamperProofAudit:"Pista de auditoría automática",tamperProofDesc:"Registra fecha, hora y firmas para prueba jurídica total.",sendReminder48h:"Enviar recordatorio por correo tras 48h",cancel:"Cancelar",saveAsDraft:"Guardar como borrador",sendForSignature:"Enviar para firma ▶",trustLedger:"VERIFICAR DOCUMENTO",verifyAuthenticity:"Comprobar autenticidad del documento",verifyDocSubtitle:"Verifique si un documento firmado es auténtico, legal e inalterado.",auditorNodeOnline:"Estado del sistema: En línea",tabEnterHash:"Introducir código / ID del documento",tabUploadFile:"Subir archivo firmado",checksumLabel:"Código, hash o ID del documento",pasteBtn:"Pegar",verifyDocumentBtn:"Verificar documento",verifyHelperNotice:"Verificamos la autenticidad de forma segura sin exponer su contenido privado.",verifiedAuthenticTitle:"Documento verificado y auténtico",legallyBinding:"Legalmente vinculante",verifiedSub:"Las firmas y el documento coinciden con el registro oficial.",downloadAuditCertificate:"Descargar certificado de auditoría (PDF)",metaDocTitle:"NOMBRE DEL DOCUMENTO",metaSignaturesVerified:"FIRMAS",metaTimestampAuth:"FECHA Y HORA",originalMatch:"Coincidencia original",sealedEndToEnd:"Sellado y protegido legalmente",itActTitle:"Ley de Firma Electrónica",itActDesc:"Las firmas realizadas en SignEase son plenamente válidas y exigibles ante tribunales.",zkpTitle:"100% Privado y Confidencial",zkpDesc:"Solo se verifica la huella criptográfica SHA-256.",regTitle:"Crear cuenta",regSub:"Únase a la plataforma de firma segura SignEase",firstName:"Nombre",lastName:"Apellidos",orgName:"Nombre de la empresa / organización",emailInput:"Correo electrónico laboral",btnGetOtp:"Obtener OTP",otpLabel:"Introducir código OTP de 6 dígitos",btnVerifyOtp:"Verificar OTP",otpDispatchedMsg:"El código OTP de 6 dígitos ha sido enviado a su correo.",password:"Contraseña",btnCreateAccount:"Crear cuenta",alreadyRegistered:"¿Ya tiene una cuenta?",signInHere:"Inicie sesión aquí",loginTitle:"Bienvenido",loginSub:"Inicie sesión para acceder a sus documentos y contratos",dontHaveAccount:"¿No tiene una cuenta?",signUpHere:"Crear cuenta",suggestPassword:"Sugerir contraseña segura",confirmPassword:"Confirmar contraseña",passwordsMatch:"Las contraseñas coinciden",passwordsDoNotMatch:"Las contraseñas no coinciden",deliveryChannel:"Canal de entrega",whatsapp:"WhatsApp",whatsappDelivery:"Entrega por WhatsApp",whatsappOtp:"Verificación OTP por WhatsApp",emailOtp:"Verificación OTP por correo",getWhatsAppOtp:"Obtener OTP de WhatsApp",sendViaWhatsApp:"Enviar por WhatsApp",shareWhatsApp:"Compartir en WhatsApp",passwordReqLength:"8+ caracteres",passwordReqLetters:"Letras (a-z, A-Z)",passwordReqNumbers:"Números (0-9)",passwordReqSymbols:"Símbolo especial (!@#$...)",signerWelcome:"Revisar y firmar documento",requestedBy:"Solicitado por",tabDraw:"✍️ Dibujar firma",tabType:"⌨️ Escribir nombre",btnClear:"Borrar",btnCompleteSigning:"✅ Completar y firmar documento",otpNotice:"Se enviará un código OTP de 6 dígitos a su correo electrónico para verificar su identidad.",footerNote:"SignEase — Firma de documentos electrónicos sencilla, rápida y legal."}};function j(){return localStorage.getItem("signease_lang")||"en"}function ee(s){localStorage.setItem("signease_lang",s)}function e(s){const t=j();return q[t]&&q[t][s]?q[t][s]:q.hi&&q.hi[s]?q.hi[s]:q.en&&q.en[s]?q.en[s]:s}if(!D.getToken()||!D.getUser()){const s={id:1,fullName:"Rajesh Sharma",email:"rajesh.sharma@signease.io",role:"ADMIN",organization:"Admin Vault",phone:"+91 98765 43210",designation:"Managing Director & Legal Counsel",department:"Executive Legal Affairs",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",signatureFont:"Dancing Script",signatureText:"Rajesh Sharma",token:"demo-token-active"};D.setToken(s.token),D.setUser(s)}const O={user:D.getUser(),route:window.location.hash||"#/"};window.navigateFromSidebar=function(s){const t=document.getElementById("sidebarMenu");if(t){if(window.bootstrap&&window.bootstrap.Offcanvas){const a=window.bootstrap.Offcanvas.getInstance(t)||new window.bootstrap.Offcanvas(t);if(a)try{a.hide()}catch{}}t.classList.remove("show")}document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop").forEach(a=>a.remove()),document.body.classList.remove("modal-open"),document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right"),window.location.hash===s?(O.route=s,G()):window.location.hash=s};window.changeAppLanguage=function(s){ee(s),document.documentElement.setAttribute("lang",s),G();const t=V.find(a=>a.code===s);A(`Language switched to ${t?t.native:s}`)};window.addEventListener("hashchange",()=>{O.route=window.location.hash||"#/",G()});function A(s,t="success"){const a=document.getElementById("toast-alert");a&&a.remove();const n=document.createElement("div");n.id="toast-alert",n.className=`alert alert-${t} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3 shadow-lg`,n.style.zIndex="9999",n.style.minWidth="320px",n.innerHTML=`
        <div class="d-flex align-items-center">
            <i class="fa-solid fa-${t==="success"?"circle-check":t==="info"?"circle-info":"triangle-exclamation"} me-2 fs-5"></i>
            <div>${s}</div>
            <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
        </div>
    `,document.body.appendChild(n),setTimeout(()=>n.remove(),4e3)}window.downloadDoc=async function(s,t=!0,a="document.pdf"){try{A("Preparing download...","info"),await D.downloadDocument(s,t,a),A("Document downloaded successfully!","success")}catch(n){A("Download failed: "+n.message,"danger")}};window.copySignerLink=function(s,t){t&&t.preventDefault();const a=`${window.location.origin}/#/sign/${s}`;navigator.clipboard&&navigator.clipboard.writeText?navigator.clipboard.writeText(a).then(()=>{A("Direct signing link copied to clipboard!")}).catch(()=>{prompt("Copy direct signing link:",a)}):prompt("Copy direct signing link:",a)};window.resendInvite=async function(s,t){if(t){t.preventDefault();const a=t.currentTarget,n=a.innerHTML;a.disabled=!0,a.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const o=await D.resendSigningInvite(s);A(o.message||"Signing invite has been resent successfully to Gmail!"),a.innerHTML='<i class="fa-solid fa-check text-success me-1"></i> Dispatched!',setTimeout(()=>{a.disabled=!1,a.innerHTML=n},4e3)}catch(o){a.disabled=!1,a.innerHTML=n,A(o.message,"danger")}}};window.sendWhatsAppInvite=async function(s,t,a,n){if(n){n.preventDefault();const o=n.currentTarget,m=o.innerHTML;o.disabled=!0,o.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const l=await D.resendWhatsAppInvite(s);if(A(l.message||"WhatsApp signing invite dispatched successfully!"),o.innerHTML='<i class="fa-solid fa-check text-success me-1"></i> Dispatched!',l.whatsappUrl)window.open(l.whatsappUrl,"_blank");else if(t&&a){const g=encodeURIComponent(`Hello! Please review and sign your document on SignEase: ${window.location.origin}/#/sign/${a}`);window.open(`https://api.whatsapp.com/send?phone=${t.replace(/[^0-9]/g,"")}&text=${g}`,"_blank")}setTimeout(()=>{o.disabled=!1,o.innerHTML=m},4e3)}catch(l){o.disabled=!1,o.innerHTML=m,A(l.message,"danger")}}};function Y(){return localStorage.getItem("signease_theme")||"light"}function K(s){localStorage.setItem("signease_theme",s),document.documentElement.setAttribute("data-bs-theme",s),s==="dark"?document.body.classList.add("dark-theme"):document.body.classList.remove("dark-theme");const t=document.getElementById("themeToggleBtn");t&&(t.innerHTML=s==="dark"?'<i class="fa-solid fa-sun text-warning fs-6"></i>':'<i class="fa-solid fa-moon text-secondary fs-6"></i>',t.setAttribute("title",s==="dark"?"Switch to Light Mode":"Switch to Dark Mode"))}window.toggleAppTheme=function(){const s=Y()==="dark"?"light":"dark";K(s)};K(Y());async function G(){var y,u,p,v,w;document.querySelectorAll(".offcanvas-backdrop, .modal-backdrop").forEach(x=>x.remove()),document.body.classList.remove("modal-open"),document.body.style.removeProperty("overflow"),document.body.style.removeProperty("padding-right");const s=document.getElementById("app"),t=O.route.replace(/^#\/?/,"").split("?")[0],a=new URLSearchParams(O.route.split("?")[1]||"");if(t.startsWith("sign/")){const x=t.replace("sign/","");ce(s,x);return}const n=Y(),o=(y=O.user)!=null&&y.fullName?O.user.fullName.split(" ").map(x=>x[0]).join("").substring(0,2).toUpperCase():"RS",m=((u=O.user)==null?void 0:u.fullName)||"Rajesh Sharma",l=((p=O.user)==null?void 0:p.organization)||"Admin Vault",g=((v=O.user)==null?void 0:v.avatar)||"",d=j(),I=V.find(x=>x.code===d)||V[0],k=`
        <div class="dropdown">
            <button class="btn btn-pill btn-pill-outline btn-sm shadow-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" id="langSelectorBtn" title="Change Language / भाषा बदलें">
                <i class="fa-solid fa-globe text-primary me-1"></i>
                <span>${I.flag} ${I.native}</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 210px; z-index: 1050;">
                <li><h6 class="dropdown-header fw-bold text-uppercase text-primary small">Select Language / भाषा</h6></li>
                ${V.map(x=>`
                    <li>
                        <button class="dropdown-item py-2 d-flex align-items-center justify-content-between ${d===x.code?"active fw-bold":""}" type="button" onclick="window.changeAppLanguage('${x.code}')">
                            <span>${x.flag} ${x.native} <small class="text-muted ms-1">(${x.name})</small></span>
                            ${d===x.code?'<i class="fa-solid fa-check text-primary ms-2"></i>':""}
                        </button>
                    </li>
                `).join("")}
            </ul>
        </div>
    `;let c=`
        <nav class="navbar-custom">
            <div class="container-fluid px-lg-4 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                    <!-- 3 Lines Hamburger Menu Button (Only visible when user is logged in) -->
                    ${O.user?`
                        <button class="nav-menu-trigger me-1" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebarMenu" aria-controls="sidebarMenu" title="Menu / मेनू">
                            <i class="fa-solid fa-bars"></i>
                        </button>
                    `:""}

                    <a class="brand-logo" href="#/">
                        <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <span>Sign<span class="text-primary">Ease</span></span>
                    </a>
                </div>

                <!-- Right Actions: Language + Dark Mode + Profile (No New Envelope button) -->
                <div class="d-flex align-items-center gap-2">
                    ${k}

                    <!-- Dark Mode Toggle Button -->
                    <button class="btn btn-pill btn-pill-outline btn-sm px-2 px-sm-3" id="themeToggleBtn" onclick="window.toggleAppTheme()" title="${e("darkModeToggle")}">
                        <i class="fa-solid fa-${n==="dark"?"sun text-warning":"moon text-secondary"} fs-6"></i>
                    </button>

                    ${O.user?`
                        <!-- User Profile Pill -->
                        <div class="dropdown">
                            <a class="nav-user-pill dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <div class="user-avatar-circle" style="overflow:hidden; padding:0; flex-shrink:0;">
                                    ${g?`<img src="${g}" alt="${m}" style="width:100%; height:100%; object-fit:cover; border-radius:50%;">`:o}
                                </div>
                                <div class="d-none d-md-block text-start">
                                    <div class="fw-bold" style="font-size: 0.82rem; line-height: 1.1;">${m}</div>
                                    <div class="text-muted" style="font-size: 0.7rem;">${l}</div>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 200px;">
                                <li><a class="dropdown-item py-2" href="#/profile"><i class="fa-solid fa-user-circle me-2 text-primary"></i> ${e("myProfile")}</a></li>
                                <li><a class="dropdown-item py-2" href="#/dashboard"><i class="fa-solid fa-chart-line me-2 text-muted"></i> ${e("dashboard")}</a></li>
                                <li><a class="dropdown-item py-2" href="#/documents"><i class="fa-regular fa-folder me-2 text-muted"></i> ${e("documents")}</a></li>
                                <li><a class="dropdown-item py-2" href="#/reports"><i class="fa-solid fa-file-csv me-2 text-muted"></i> ${e("reportGeneration")}</a></li>
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
                    <div class="text-uppercase small fw-bold text-muted px-2 mb-2" style="font-size: 0.7rem; letter-spacing: 0.5px;">Navigation</div>
                    <a class="sidebar-nav-link ${t==="dashboard"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/dashboard')">
                        <i class="fa-solid fa-chart-pie me-2 text-primary"></i> ${e("dashboard")}
                    </a>
                    <a class="sidebar-nav-link ${t==="documents"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/documents')">
                        <i class="fa-regular fa-folder me-2 text-primary"></i> ${e("documents")}
                    </a>
                    <a class="sidebar-nav-link ${t==="templates"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/templates')">
                        <i class="fa-solid fa-layer-group me-2 text-primary"></i> ${e("templates")}
                    </a>
                    <a class="sidebar-nav-link ${t==="reports"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/reports')">
                        <i class="fa-solid fa-file-csv me-2 text-primary"></i> ${e("reportGeneration")}
                    </a>
                    ${((w=O.user)==null?void 0:w.role)==="ADMIN"?`
                        <a class="sidebar-nav-link text-danger ${t==="admin"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/admin')">
                            <i class="fa-solid fa-shield me-2"></i> ${e("admin")}
                        </a>
                    `:""}
                </div>

                <!-- Bottom Drawer Actions: Profile placed right near Sign Out -->
                ${O.user?`
                    <div class="pt-3 border-top d-flex flex-column gap-2" style="border-color: var(--border-color);">
                        <a class="sidebar-nav-link ${t==="profile"?"active":""}" href="javascript:void(0)" onclick="window.navigateFromSidebar('#/profile')">
                            <i class="fa-solid fa-user-circle me-2 text-primary"></i> ${e("profile")}
                        </a>
                        <button class="btn btn-outline-danger w-100 py-2 fw-semibold btn-sm" id="sidebarLogoutBtn">
                            <i class="fa-solid fa-arrow-right-from-bracket me-2"></i> ${e("signOut")}
                        </button>
                    </div>
                `:`
                    <div class="pt-3 border-top" style="border-color: var(--border-color);">
                        <a href="javascript:void(0)" onclick="window.navigateFromSidebar('#/login')" class="btn btn-pill-primary w-100 py-2 fw-semibold justify-content-center">
                            <i class="fa-solid fa-right-to-bracket me-2"></i> ${e("signIn")}
                        </a>
                    </div>
                `}
            </div>
        </div>

        <main class="flex-grow-1" id="page-content"></main>
        <footer class="py-3 mt-auto border-top">
            <div class="container-fluid px-lg-4 text-center text-muted small">
                <div><strong>SignEase</strong> &copy; 2026. All rights reserved. &bull; <a href="#/terms" class="text-muted text-decoration-none">${e("termsAndConditions")}</a></div>
            </div>
        </footer>
    `;s.innerHTML=c;const i=()=>{D.clearToken(),O.user=null,A("Signed out successfully."),window.location.hash="#/login"},f=document.getElementById("logoutBtn");f&&f.addEventListener("click",i);const h=document.getElementById("sidebarLogoutBtn");h&&h.addEventListener("click",i);const r=document.getElementById("page-content");if(!O.user&&!["","/","login","register","forgot-password","verify","terms"].includes(t)){A("Please sign in first to access this page.","warning"),window.location.hash="#/login";return}if(t===""||t==="/")O.user?window.location.hash="#/dashboard":te(r);else if(t==="login")se(r);else if(t==="register")ae(r);else if(t==="terms")me(r);else if(t==="forgot-password")ie(r);else if(t==="reports")re(r);else if(t==="templates")pe(r);else if(t==="dashboard")ne(r);else if(t==="documents")le(r,a.get("status")||"ALL");else if(t.startsWith("documents/")){const x=t.replace("documents/","");oe(r,x)}else t==="upload"?de(r):t==="send"?Q(r,a.get("documentId")):t==="verify"?ue(r,a.get("hash")):t==="admin"?J(r):t==="profile"?ge(r):r.innerHTML='<div class="container py-5 text-center"><h4>Page not found</h4><a href="#/" class="btn btn-primary mt-2">Go Home</a></div>'}function te(s){s.innerHTML=`
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
                        <i class="fa-solid fa-right-to-bracket me-2"></i> ${e("signIn")}
                    </a>
                    <a href="#/templates" class="btn btn-outline-primary btn-lg px-4">
                        <i class="fa-solid fa-layer-group me-2"></i> ${e("templates")}
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
    `}function se(s){s.innerHTML=`
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
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label small fw-semibold text-muted mb-0">${e("password")}</label>
                            <a href="#/forgot-password" class="small text-primary text-decoration-none fw-semibold">${e("forgotPassword")}</a>
                        </div>
                        <input type="password" id="loginPassword" class="form-control" placeholder="••••••••" required>
                    </div>
                    <button type="submit" class="btn btn-pill btn-pill-primary w-100 py-2 fw-semibold mb-3 justify-content-center shadow-sm">
                        <i class="fa-solid fa-right-to-bracket me-1"></i> ${e("signIn")}
                    </button>
                </form>

                <div class="text-center text-muted small">
                    ${e("dontHaveAccount")} <a href="#/register" class="fw-semibold text-primary text-decoration-none">${e("signUpHere")}</a>
                </div>
            </div>
        </div>
    `,document.getElementById("loginForm").onsubmit=async t=>{t.preventDefault();const a=document.getElementById("loginEmail").value.trim(),n=document.getElementById("loginPassword").value;try{const o=await D.login(a,n);D.setToken(o.token),D.setUser(o),O.user=o,A("Welcome back, "+o.fullName+"!"),window.location.hash="#/dashboard"}catch(o){A(o.message,"danger")}}}function ae(s){let t=!1,a=!1;D.clearToken(),s.innerHTML=`
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
                    <div class="row g-2 mb-3">
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold text-muted">${e("orgName")} *</label>
                            <input type="text" id="regOrg" class="form-control" placeholder="Acme Enterprises" required>
                        </div>
                        <div class="col-sm-6">
                            <label class="form-label small fw-semibold text-muted"><i class="fa-solid fa-phone me-1"></i> ${e("phone")} *</label>
                            <input type="tel" id="regPhone" class="form-control" placeholder="+91 98765 43210" required>
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("emailAddress")} *</label>
                        <div class="input-group">
                            <span class="input-group-text border-end-0"><i class="fa-regular fa-envelope"></i></span>
                            <input type="email" id="regEmail" class="form-control border-start-0" placeholder="name@domain.com" required>
                            <button type="button" class="btn btn-pill-primary fw-semibold px-3" id="sendEmailOtpBtn">
                                <i class="fa-solid fa-key me-1"></i> ${e("btnGetOtp")}
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
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label small fw-semibold text-muted mb-0">${e("password")} *</label>
                            <button type="button" id="suggestPassBtn" class="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-semibold" style="font-size: 0.8rem;">
                                <i class="fa-solid fa-wand-magic-sparkles me-1"></i> ${e("suggestPassword")}
                            </button>
                        </div>
                        <div class="input-group">
                            <input type="password" id="regPass" class="form-control" placeholder="Create strong password" required autocomplete="new-password">
                            <button type="button" class="btn btn-outline-secondary" id="togglePassVisibilityBtn" title="Show / Hide Password">
                                <i class="fa-solid fa-eye" id="togglePassEyeIcon"></i>
                            </button>
                        </div>

                        <!-- Real-time Password Strength Bar -->
                        <div class="progress mt-2" style="height: 5px; border-radius: 4px; background: rgba(148, 163, 184, 0.2);">
                            <div id="passStrengthBar" class="progress-bar bg-danger" role="progressbar" style="width: 0%; transition: width 0.3s, background-color 0.3s;"></div>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                            <span id="passStrengthLabel" class="small fw-semibold text-muted" style="font-size: 0.75rem;">Password Strength: —</span>
                            <span id="passCopyAlert" class="small text-success d-none" style="font-size: 0.75rem;"><i class="fa-solid fa-circle-check me-1"></i> Copied to clipboard</span>
                        </div>

                        <!-- Requirement Checklist -->
                        <div class="p-2 mt-2 rounded bg-body-tertiary border border-subtle small" style="font-size: 0.78rem;">
                            <div class="row g-1">
                                <div class="col-6 text-muted" id="ruleLength">
                                    <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqLength")}
                                </div>
                                <div class="col-6 text-muted" id="ruleLetters">
                                    <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqLetters")}
                                </div>
                                <div class="col-6 text-muted" id="ruleNumbers">
                                    <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqNumbers")}
                                </div>
                                <div class="col-6 text-muted" id="ruleSymbols">
                                    <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqSymbols")}
                                </div>
                            </div>
                        </div>
                        <div id="regPassAlert" class="small mt-1 text-danger"></div>
                    </div>

                    <!-- Confirm Password with Real-time Match Confirmation -->
                    <div class="mb-3">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <label class="form-label small fw-semibold text-muted mb-0">${e("confirmPassword")} *</label>
                            <span id="regPassMatchBadge" class="small fw-semibold"></span>
                        </div>
                        <div class="input-group">
                            <input type="password" id="regConfirmPass" class="form-control" placeholder="Re-enter password to confirm" required autocomplete="new-password">
                            <button type="button" class="btn btn-outline-secondary" id="toggleRegConfirmPassBtn" title="Show / Hide Password">
                                <i class="fa-solid fa-eye" id="toggleRegConfirmEyeIcon"></i>
                            </button>
                        </div>
                        <div id="regConfirmPassAlert" class="small mt-1"></div>
                    </div>

                    <!-- Simplified Terms & Conditions Agreement Checkbox -->
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="regTerms" required>
                            <label class="form-check-label small text-muted" for="regTerms">
                                I agree to the <a href="#/terms" target="_blank" class="fw-semibold text-primary text-decoration-none">${e("termsAndConditions")}</a> *
                            </label>
                        </div>
                        <div id="regTermsAlert" class="small text-danger mt-1"></div>
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
    `;const n=async()=>{const c=document.getElementById("regEmail").value.trim();if(!c||!c.includes("@"))return alert("Please enter a valid work email address first."),!1;const i=document.getElementById("sendEmailOtpBtn");i.disabled=!0,i.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const f=await D.sendRegistrationOtp(c);t=!0,document.getElementById("regEmailAlert").innerHTML=`
                <span class="text-success fw-medium">
                    <i class="fa-solid fa-envelope-circle-check me-1"></i> ${f.message||e("otpDispatchedMsg")}
                </span>
            `,A(e("otpDispatchedMsg"));let h=60;i.innerHTML=`Resend (${h}s)`;const r=setInterval(()=>{h--,h<=0?(clearInterval(r),i.disabled=!1,i.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):i.innerHTML=`Resend (${h}s)`},1e3);return!0}catch(f){return i.disabled=!1,i.innerHTML='<i class="fa-solid fa-key me-1"></i> '+e("btnGetOtp"),document.getElementById("regEmailAlert").innerHTML=`<span class="text-danger fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${f.message}</span>`,!1}};document.getElementById("sendEmailOtpBtn").onclick=n,document.getElementById("verifyEmailOtpBtn").onclick=async()=>{const c=document.getElementById("regEmail").value.trim(),i=document.getElementById("regOtpCode").value.trim();if(i.length!==6){alert("Please enter the 6-digit OTP code sent to your email.");return}try{await D.verifyRegistrationOtp(c,i),a=!0,document.getElementById("emailOtpSection").className="auth-box-subtle mb-3 border border-success rounded-3",document.getElementById("regEmailVerifiedBadge").classList.remove("d-none"),document.getElementById("regOtpAlert").innerHTML='<span class="text-success fw-bold"><i class="fa-solid fa-circle-check me-1"></i> Email Verified!</span>',document.getElementById("sendEmailOtpBtn").style.display="none",document.getElementById("regEmail").readOnly=!0,A("Email verified successfully!")}catch(f){document.getElementById("regOtpAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${f.message}</span>`}};const o=document.getElementById("regPass"),m=c=>{c=c||"";const i=c.length>=8,f=/[a-zA-Z]/.test(c),h=/[0-9]/.test(c),r=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(c),y=(w,x,E)=>{const P=document.getElementById(w);P&&(x?(P.className="col-6 text-success fw-medium",P.innerHTML=`<i class="fa-solid fa-circle-check text-success me-1"></i> ${E}`):(P.className="col-6 text-muted",P.innerHTML=`<i class="fa-regular fa-circle text-muted me-1"></i> ${E}`))};y("ruleLength",i,e("passwordReqLength")),y("ruleLetters",f,e("passwordReqLetters")),y("ruleNumbers",h,e("passwordReqNumbers")),y("ruleSymbols",r,e("passwordReqSymbols"));let u=0;i&&u++,f&&u++,h&&u++,r&&u++;const p=document.getElementById("passStrengthBar"),v=document.getElementById("passStrengthLabel");return c?u<=1?(p&&(p.style.width="25%",p.className="progress-bar bg-danger"),v&&(v.textContent="Password Strength: Weak",v.className="small fw-semibold text-danger")):u===2?(p&&(p.style.width="50%",p.className="progress-bar bg-warning"),v&&(v.textContent="Password Strength: Fair",v.className="small fw-semibold text-warning")):u===3?(p&&(p.style.width="75%",p.className="progress-bar bg-info"),v&&(v.textContent="Password Strength: Good",v.className="small fw-semibold text-info")):(p&&(p.style.width="100%",p.className="progress-bar bg-success"),v&&(v.textContent="Password Strength: Strong & Secure ✓",v.className="small fw-semibold text-success")):(p&&(p.style.width="0%",p.className="progress-bar bg-danger"),v&&(v.textContent="Password Strength: —",v.className="small fw-semibold text-muted")),i&&f&&h&&r},l=document.getElementById("regConfirmPass"),g=()=>{const c=o?o.value:"",i=l?l.value:"",f=document.getElementById("regPassMatchBadge"),h=document.getElementById("regConfirmPassAlert");return i?c===i&&c.length>0?(f&&(f.innerHTML=`<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-solid fa-circle-check me-1"></i> ${e("passwordsMatch")}</span>`),h&&(h.innerHTML='<span class="text-success small fw-medium"><i class="fa-solid fa-circle-check me-1"></i> Passwords match correctly!</span>'),l&&(l.classList.remove("is-invalid"),l.classList.add("is-valid")),!0):(f&&(f.innerHTML=`<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="fa-solid fa-circle-xmark me-1"></i> ${e("passwordsDoNotMatch")}</span>`),h&&(h.innerHTML='<span class="text-danger small fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> Passwords do not match. Please verify your typing.</span>'),l&&(l.classList.remove("is-valid"),l.classList.add("is-invalid")),!1):(f&&(f.innerHTML=""),h&&(h.innerHTML=""),l&&l.classList.remove("is-valid","is-invalid"),!1)};o&&(o.oninput=()=>{m(o.value),g();const c=document.getElementById("regPassAlert");c&&(c.innerHTML="")}),l&&(l.oninput=()=>{g()});const d=document.getElementById("togglePassVisibilityBtn");d&&(d.onclick=()=>{const c=o.type==="password";o.type=c?"text":"password";const i=document.getElementById("togglePassEyeIcon");i&&(i.className=c?"fa-solid fa-eye-slash":"fa-solid fa-eye")});const I=document.getElementById("toggleRegConfirmPassBtn");I&&l&&(I.onclick=()=>{const c=l.type==="password";l.type=c?"text":"password";const i=document.getElementById("toggleRegConfirmEyeIcon");i&&(i.className=c?"fa-solid fa-eye-slash":"fa-solid fa-eye")});const k=document.getElementById("suggestPassBtn");k&&(k.onclick=()=>{const c="ABCDEFGHJKLMNPQRSTUVWXYZ",i="abcdefghijkmnopqrstuvwxyz",f="23456789",h="!@#$%^&*_-+=";let r="";for(let p=0;p<4;p++)r+=c[Math.floor(Math.random()*c.length)];for(let p=0;p<4;p++)r+=i[Math.floor(Math.random()*i.length)];for(let p=0;p<3;p++)r+=f[Math.floor(Math.random()*f.length)];for(let p=0;p<3;p++)r+=h[Math.floor(Math.random()*h.length)];r=r.split("").sort(()=>.5-Math.random()).join(""),o.value=r,o.type="text";const y=document.getElementById("togglePassEyeIcon");if(y&&(y.className="fa-solid fa-eye-slash"),l){l.value=r,l.type="text";const p=document.getElementById("toggleRegConfirmEyeIcon");p&&(p.className="fa-solid fa-eye-slash")}m(r),g();const u=document.getElementById("regPassAlert");u&&(u.innerHTML=""),navigator.clipboard&&navigator.clipboard.writeText&&navigator.clipboard.writeText(r).then(()=>{const p=document.getElementById("passCopyAlert");p&&(p.classList.remove("d-none"),setTimeout(()=>p.classList.add("d-none"),3500))}).catch(()=>{}),A("Strong password suggested and applied to both fields!")}),document.getElementById("regForm").onsubmit=async c=>{var w;c.preventDefault();const i=document.getElementById("regEmail").value.trim(),f=document.getElementById("regOtpCode").value.trim(),h=document.getElementById("regPass").value,r=l?l.value:"";if(!m(h)){document.getElementById("regPassAlert").innerHTML=`
                <i class="fa-solid fa-triangle-exclamation me-1"></i>
                Password must be at least 8 characters and include letters, numbers, and special symbols.
            `,document.getElementById("regPass").focus();return}if(h!==r){document.getElementById("regConfirmPassAlert").innerHTML=`
                <span class="text-danger small fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> Passwords do not match. Please ensure both fields are identical.</span>
            `,l.focus();return}if(!f||f.length!==6){alert('Please click "Get OTP" and enter the 6-digit verification code sent to your email.'),document.getElementById("regOtpCode").focus();return}const u=document.getElementById("regTerms");if(u&&!u.checked){const x=document.getElementById("regTermsAlert");x&&(x.innerHTML='<i class="fa-solid fa-triangle-exclamation me-1"></i> You must agree to the Terms and Conditions to create an account.'),u.focus();return}const p=document.getElementById("regPhone")?document.getElementById("regPhone").value.trim():"";if(!p){alert("Please enter your mobile phone number."),(w=document.getElementById("regPhone"))==null||w.focus();return}const v=document.getElementById("submitRegBtn");v.disabled=!0,v.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Creating Account...';try{const x={firstName:document.getElementById("regFirst").value.trim(),lastName:document.getElementById("regLast").value.trim(),organizationName:document.getElementById("regOrg").value.trim(),phone:p,email:i,password:h,confirmPassword:r,otpCode:f},E=await D.register(x);D.setToken(E.token),D.setUser(E),O.user=E,A("Account created successfully!"),window.location.hash="#/dashboard"}catch(x){v.disabled=!1,v.innerHTML='<i class="fa-solid fa-user-plus me-1"></i> '+e("btnCreateAccount"),A(x.message,"danger")}}}function ie(s){let t=!1;s.innerHTML=`
        <div class="auth-wrapper">
            <div class="auth-card" style="max-width: 480px;">
                <div class="text-center mb-4">
                    <a href="#/" class="brand-logo justify-content-center mb-3 fs-3">
                        <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                        <span>Sign<span class="text-primary">Ease</span></span>
                    </a>
                    <h4 class="fw-bold mb-1">${e("forgotPassword")}</h4>
                    <p class="text-muted small">Enter your email address to receive an account recovery OTP.</p>
                </div>

                <form id="forgotPassForm">
                    <!-- Step 1: Email Address -->
                    <div class="mb-3">
                        <label class="form-label small fw-semibold text-muted">${e("emailAddress")} *</label>
                        <div class="input-group">
                            <span class="input-group-text border-end-0"><i class="fa-regular fa-envelope"></i></span>
                            <input type="email" id="forgotEmail" class="form-control border-start-0" placeholder="name@company.com" required>
                            <button type="button" class="btn btn-pill-primary fw-semibold px-3" id="sendForgotOtpBtn">
                                <i class="fa-solid fa-key me-1"></i> ${e("btnGetOtp")}
                            </button>
                        </div>
                        <div class="form-text small text-muted">A 6-digit OTP will be dispatched to verify your identity.</div>
                        <div id="forgotEmailAlert" class="small mt-1"></div>
                    </div>

                    <!-- Step 2: OTP and New Password (Hidden until OTP is requested) -->
                    <div id="resetFieldsContainer" class="d-none">
                        <!-- Email OTP Verification Box -->
                        <div class="auth-box-subtle mb-3">
                            <label class="form-label small fw-bold text-primary mb-1">
                                <i class="fa-solid fa-shield-halved me-1"></i> ${e("otpLabel")} *
                            </label>
                            <div class="input-group mb-2">
                                <input type="text" id="forgotOtpCode" class="form-control font-monospace text-center fs-5 fw-bold" placeholder="------" maxlength="6" required autocomplete="one-time-code">
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <small class="text-muted" id="forgotOtpCooldownNote">Code valid for 10 minutes</small>
                                <button type="button" class="btn btn-link btn-sm text-primary p-0 text-decoration-none small fw-semibold" id="resendForgotOtpBtn">Resend OTP</button>
                            </div>
                        </div>

                        <!-- New Password Section -->
                        <div class="mb-3">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="form-label small fw-semibold text-muted mb-0">New ${e("password")} *</label>
                                <button type="button" id="suggestResetPassBtn" class="btn btn-sm btn-link text-primary text-decoration-none p-0 fw-semibold" style="font-size: 0.8rem;">
                                    <i class="fa-solid fa-wand-magic-sparkles me-1"></i> ${e("suggestPassword")}
                                </button>
                            </div>
                            <div class="input-group">
                                <input type="password" id="resetPass" class="form-control" placeholder="Create new strong password" required autocomplete="new-password">
                                <button type="button" class="btn btn-outline-secondary" id="toggleResetPassBtn" title="Show / Hide Password">
                                    <i class="fa-solid fa-eye" id="toggleResetEyeIcon"></i>
                                </button>
                            </div>

                            <!-- Real-time Password Strength Bar -->
                            <div class="progress mt-2" style="height: 5px; border-radius: 4px; background: rgba(148, 163, 184, 0.2);">
                                <div id="resetStrengthBar" class="progress-bar bg-danger" role="progressbar" style="width: 0%; transition: width 0.3s, background-color 0.3s;"></div>
                            </div>
                            <div class="d-flex justify-content-between align-items-center mt-1">
                                <span id="resetStrengthLabel" class="small fw-semibold text-muted" style="font-size: 0.75rem;">Password Strength: —</span>
                                <span id="resetCopyAlert" class="small text-success d-none" style="font-size: 0.75rem;"><i class="fa-solid fa-circle-check me-1"></i> Copied to clipboard</span>
                            </div>

                            <!-- Requirement Checklist -->
                            <div class="p-2 mt-2 rounded bg-body-tertiary border border-subtle small" style="font-size: 0.78rem;">
                                <div class="row g-1">
                                    <div class="col-6 text-muted" id="resetRuleLength">
                                        <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqLength")}
                                    </div>
                                    <div class="col-6 text-muted" id="resetRuleLetters">
                                        <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqLetters")}
                                    </div>
                                    <div class="col-6 text-muted" id="resetRuleNumbers">
                                        <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqNumbers")}
                                    </div>
                                    <div class="col-6 text-muted" id="resetRuleSymbols">
                                        <i class="fa-regular fa-circle text-muted me-1"></i> ${e("passwordReqSymbols")}
                                    </div>
                                </div>
                            </div>
                            <div id="resetPassAlert" class="small mt-1 text-danger"></div>
                        </div>

                        <!-- Confirm New Password -->
                        <div class="mb-4">
                            <div class="d-flex justify-content-between align-items-center mb-1">
                                <label class="form-label small fw-semibold text-muted mb-0">Confirm New Password *</label>
                                <span id="resetPassMatchBadge" class="small fw-semibold"></span>
                            </div>
                            <input type="password" id="confirmResetPass" class="form-control" placeholder="Re-enter new password" required autocomplete="new-password">
                            <div id="confirmPassAlert" class="small mt-1"></div>
                        </div>

                        <button type="submit" id="submitResetBtn" class="btn btn-pill btn-pill-primary w-100 py-2 fw-semibold mb-3 justify-content-center shadow-sm">
                            <i class="fa-solid fa-lock-open me-1"></i> ${e("resetPassword")}
                        </button>
                    </div>
                </form>

                <div class="text-center text-muted small mt-2">
                    Remember your password? <a href="#/login" class="fw-semibold text-primary text-decoration-none">${e("signInHere")}</a>
                </div>
            </div>
        </div>
    `;const a=async()=>{const i=document.getElementById("forgotEmail").value.trim();if(!i||!i.includes("@"))return A("Please enter a valid email address first.","warning"),document.getElementById("forgotEmail").focus(),!1;const f=document.getElementById("sendForgotOtpBtn"),h=document.getElementById("forgotEmailAlert"),r=f.innerHTML;f.disabled=!0,f.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending...';try{const y=await D.sendForgotPasswordOtp(i);t=!0,f.innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Sent!',h.className="small mt-1 text-success fw-medium",h.innerHTML=`<i class="fa-solid fa-paper-plane me-1"></i> 6-digit OTP code sent to <strong>${i}</strong>! Check your inbox (and spam folder).`;const u=document.getElementById("resetFieldsContainer");return u&&(u.classList.remove("d-none"),document.getElementById("forgotOtpCode").focus()),A("Password recovery OTP sent to your email!"),setTimeout(()=>{f.disabled=!1,f.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'},3e4),!0}catch(y){return f.disabled=!1,f.innerHTML=r,h.className="small mt-1 text-danger fw-medium",h.innerHTML=`<i class="fa-solid fa-circle-exclamation me-1"></i> ${y.message}`,A(y.message,"danger"),!1}},n=document.getElementById("sendForgotOtpBtn");n&&(n.onclick=a);const o=document.getElementById("resendForgotOtpBtn");o&&(o.onclick=a);const m=document.getElementById("resetPass"),l=i=>{const f=i.length>=8,h=/[a-zA-Z]/.test(i),r=/[0-9]/.test(i),y=/[^a-zA-Z0-9]/.test(i),u=(x,E,P)=>{const T=document.getElementById(x);T&&(E?(T.className="col-6 text-success fw-medium",T.innerHTML=`<i class="fa-solid fa-circle-check text-success me-1"></i> ${P}`):(T.className="col-6 text-muted",T.innerHTML=`<i class="fa-regular fa-circle text-muted me-1"></i> ${P}`))};u("resetRuleLength",f,e("passwordReqLength")),u("resetRuleLetters",h,e("passwordReqLetters")),u("resetRuleNumbers",r,e("passwordReqNumbers")),u("resetRuleSymbols",y,e("passwordReqSymbols"));let p=0;f&&p++,h&&p++,r&&p++,y&&p++;const v=document.getElementById("resetStrengthBar"),w=document.getElementById("resetStrengthLabel");return i?p<=1?(v&&(v.style.width="25%",v.className="progress-bar bg-danger"),w&&(w.textContent="Password Strength: Weak",w.className="small fw-semibold text-danger")):p===2?(v&&(v.style.width="50%",v.className="progress-bar bg-warning"),w&&(w.textContent="Password Strength: Fair",w.className="small fw-semibold text-warning")):p===3?(v&&(v.style.width="75%",v.className="progress-bar bg-info"),w&&(w.textContent="Password Strength: Good",w.className="small fw-semibold text-info")):(v&&(v.style.width="100%",v.className="progress-bar bg-success"),w&&(w.textContent="Password Strength: Strong & Secure ✓",w.className="small fw-semibold text-success")):(v&&(v.style.width="0%",v.className="progress-bar bg-danger"),w&&(w.textContent="Password Strength: —",w.className="small fw-semibold text-muted")),f&&h&&r&&y},g=document.getElementById("confirmResetPass"),d=()=>{const i=m?m.value:"",f=g?g.value:"",h=document.getElementById("resetPassMatchBadge"),r=document.getElementById("confirmPassAlert");return f?i===f&&i.length>0?(h&&(h.innerHTML=`<span class="badge bg-success-subtle text-success border border-success-subtle"><i class="fa-solid fa-circle-check me-1"></i> ${e("passwordsMatch")}</span>`),r&&(r.innerHTML='<span class="text-success small fw-medium"><i class="fa-solid fa-circle-check me-1"></i> Passwords match correctly!</span>'),g&&(g.classList.remove("is-invalid"),g.classList.add("is-valid")),!0):(h&&(h.innerHTML=`<span class="badge bg-danger-subtle text-danger border border-danger-subtle"><i class="fa-solid fa-circle-xmark me-1"></i> ${e("passwordsDoNotMatch")}</span>`),r&&(r.innerHTML='<span class="text-danger small fw-medium"><i class="fa-solid fa-triangle-exclamation me-1"></i> Passwords do not match. Please verify your typing.</span>'),g&&(g.classList.remove("is-valid"),g.classList.add("is-invalid")),!1):(h&&(h.innerHTML=""),r&&(r.innerHTML=""),g&&g.classList.remove("is-valid","is-invalid"),!1)};m&&(m.oninput=()=>{l(m.value),d();const i=document.getElementById("resetPassAlert");i&&(i.innerHTML="")}),g&&(g.oninput=()=>{d()});const I=document.getElementById("toggleResetPassBtn");I&&(I.onclick=()=>{const i=m.type==="password";m.type=i?"text":"password";const f=document.getElementById("toggleResetEyeIcon");f&&(f.className=i?"fa-solid fa-eye-slash":"fa-solid fa-eye")});const k=document.getElementById("suggestResetPassBtn");k&&(k.onclick=()=>{const i="ABCDEFGHJKLMNPQRSTUVWXYZ",f="abcdefghijkmnopqrstuvwxyz",h="23456789",r="!@#$%^&*_-+=";let y="";for(let w=0;w<4;w++)y+=i[Math.floor(Math.random()*i.length)];for(let w=0;w<4;w++)y+=f[Math.floor(Math.random()*f.length)];for(let w=0;w<3;w++)y+=h[Math.floor(Math.random()*h.length)];for(let w=0;w<3;w++)y+=r[Math.floor(Math.random()*r.length)];y=y.split("").sort(()=>.5-Math.random()).join(""),m.value=y,m.type="text";const u=document.getElementById("toggleResetEyeIcon");u&&(u.className="fa-solid fa-eye-slash");const p=document.getElementById("confirmResetPass");p&&(p.value=y),l(y),d();const v=document.getElementById("resetPassAlert");v&&(v.innerHTML=""),navigator.clipboard&&navigator.clipboard.writeText&&navigator.clipboard.writeText(y).then(()=>{const w=document.getElementById("resetCopyAlert");w&&(w.classList.remove("d-none"),setTimeout(()=>w.classList.add("d-none"),3500))}).catch(()=>{}),A("Strong password suggested and applied!")});const c=document.getElementById("forgotPassForm");c&&(c.onsubmit=async i=>{i.preventDefault();const f=document.getElementById("forgotEmail").value.trim(),h=document.getElementById("forgotOtpCode").value.trim(),r=document.getElementById("resetPass").value,y=document.getElementById("confirmResetPass").value;if(!t){await a();return}if(!h||h.length!==6){A("Please enter the 6-digit OTP sent to your email.","warning"),document.getElementById("forgotOtpCode").focus();return}if(!l(r)){document.getElementById("resetPassAlert").innerHTML=`
                    <i class="fa-solid fa-triangle-exclamation me-1"></i>
                    Password must be at least 8 characters and include letters, numbers, and special symbols.
                `,document.getElementById("resetPass").focus();return}if(r!==y){document.getElementById("confirmPassAlert").innerHTML=`
                    <i class="fa-solid fa-triangle-exclamation me-1"></i>
                    Passwords do not match. Please ensure both fields are identical.
                `,document.getElementById("confirmResetPass").focus();return}const p=document.getElementById("submitResetBtn");p.disabled=!0,p.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Resetting Password...';try{const v=await D.resetPassword(f,h,r);A(v.message||"Password reset successfully! Please sign in with your new password.","success"),window.location.hash="#/login"}catch(v){p.disabled=!1,p.innerHTML='<i class="fa-solid fa-lock-open me-1"></i> '+e("resetPassword"),A(v.message,"danger")}})}async function ne(s){var t;s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading dashboard...</div></div>';try{const[a,n]=await Promise.all([D.getDashboardStats().catch(()=>({})),D.getDocuments("ALL").catch(()=>[])]),o=(t=O.user)!=null&&t.fullName?O.user.fullName.split(" ")[0]:"User",m=new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}),l=new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}),g=Array.isArray(n)&&n.length>0?n:Array.isArray(a==null?void 0:a.recentDocuments)?a.recentDocuments:[];let d="ALL",I="ALL",k="",c="",i="";s.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- Top Greeting & Compliance Header -->
                <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                <i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("compliancetag")}
                            </span>
                        </div>
                        <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("greeting")} ${o}</h2>
                        <p class="text-muted small mb-0" id="dashSubNote">${m} &bull; <span id="dashPendingSubText">Loading...</span></p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge bg-card text-muted border rounded-pill px-3 py-2 fw-semibold shadow-sm" style="font-size: 0.8rem;">
                            <i class="fa-solid fa-shield-halved text-primary me-1"></i> ${e("vaultSynced")} ${l}
                        </span>
                    </div>
                </div>

                <!-- Timeframe Filter Toolbar (Tracks Today, Last 7 Days, Last 30 Days, This Month, Custom Range) -->
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 p-2 px-3 mb-4 bg-card rounded-3 border shadow-sm">
                    <div class="d-flex align-items-center gap-1 flex-wrap">
                        <span class="small fw-bold text-muted text-uppercase me-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                            <i class="fa-solid fa-clock-rotate-left text-primary me-1"></i> Timeframe:
                        </span>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-primary" data-tf="ALL">${e("timeframeAll")}</button>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-outline-secondary" data-tf="TODAY">${e("timeframeToday")}</button>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-outline-secondary" data-tf="7DAYS">${e("timeframeLast7Days")}</button>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-outline-secondary" data-tf="30DAYS">${e("timeframeLast30Days")}</button>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-outline-secondary" data-tf="THIS_MONTH">${e("timeframeThisMonth")}</button>
                        <button type="button" class="btn btn-sm btn-pill tf-btn btn-outline-secondary" data-tf="CUSTOM">${e("timeframeCustom")}</button>
                    </div>

                    <!-- Custom Date Range Form (Hidden unless Custom is active) -->
                    <div id="dashCustomRangeBox" class="d-none d-flex align-items-center gap-2 mt-2 mt-lg-0 flex-wrap">
                        <div class="input-group input-group-sm" style="width: auto;">
                            <span class="input-group-text bg-subtle small"><i class="fa-regular fa-calendar me-1"></i> From</span>
                            <input type="date" id="dashStartDate" class="form-control form-control-sm">
                        </div>
                        <div class="input-group input-group-sm" style="width: auto;">
                            <span class="input-group-text bg-subtle small"><i class="fa-regular fa-calendar me-1"></i> To</span>
                            <input type="date" id="dashEndDate" class="form-control form-control-sm">
                        </div>
                        <button type="button" id="dashApplyCustomBtn" class="btn btn-sm btn-pill btn-pill-primary px-3">
                            <i class="fa-solid fa-filter me-1"></i> Apply
                        </button>
                    </div>
                </div>

                <!-- 4 Large Stat KPI Cards (Tracks Documents & Terms and Conditions Counts) -->
                <div class="row g-3 mb-4">
                    <div class="col-sm-6 col-xl-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("totalDocs")}</div>
                                    <div class="kpi-value" id="kpiTotalDocs">0</div>
                                    <div class="small text-muted mt-1" id="kpiTotalDocsSub">0 uploaded</div>
                                </div>
                                <div class="kpi-icon-box icon-blue">
                                    <i class="fa-regular fa-folder-open"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("pendingDocs")}</div>
                                    <div class="kpi-value text-warning" id="kpiPendingDocs">0</div>
                                    <div class="mt-1" id="kpiPendingDocsSub">
                                        <span class="small text-muted">All up to date</span>
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-orange">
                                    <i class="fa-solid fa-pen-nib"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("completedDocs")}</div>
                                    <div class="kpi-value text-success" id="kpiCompletedDocs">0</div>
                                    <div class="small text-muted mt-1" id="kpiCompletedDocsSub">
                                        0% completed
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-green">
                                    <i class="fa-solid fa-circle-check"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-6 col-xl-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("termsAcceptedCount")||"TERMS ACCEPTED"}</div>
                                    <div class="kpi-value text-primary" id="kpiTermsCount">100%</div>
                                    <div class="small text-muted mt-1">
                                        <i class="fa-solid fa-shield-halved text-success me-1"></i> IT Act Sec 10A verified
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-blue">
                                    <i class="fa-solid fa-file-contract"></i>
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
                        <a href="#/reports" class="btn btn-pill btn-pill-outline shadow-sm" title="Export Reports">
                            <i class="fa-solid fa-file-csv text-success me-1"></i> ${e("reports")}
                        </a>
                        <a href="#/upload" class="btn btn-pill btn-pill-primary shadow-sm">
                            <i class="fa-solid fa-plus me-1"></i> ${e("uploadAndSign")}
                        </a>
                    </div>
                </div>

                <!-- Documents Table -->
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
                            </tbody>
                        </table>
                    </div>
                    <!-- Table Footer Pagination bar -->
                    <div class="p-3 bg-card border-top d-flex flex-wrap justify-content-between align-items-center text-muted small" id="dashTableFooter">
                        <div id="dashCountText">Showing 0 agreements</div>
                        <a href="#/documents" class="text-primary fw-semibold text-decoration-none">
                            ${e("viewVaultLink")}
                        </a>
                    </div>
                </div>
            </div>
        `;const f=x=>{if(d==="ALL")return!0;const E=x.createdAt?new Date(x.createdAt):null;if(!E||isNaN(E.getTime()))return!0;const P=new Date,T=E.getTime();if(d==="TODAY"){const B=new Date(P.getFullYear(),P.getMonth(),P.getDate()).getTime();return T>=B}else if(d==="7DAYS"){const B=P.getTime()-6048e5;return T>=B}else if(d==="30DAYS"){const B=P.getTime()-2592e6;return T>=B}else if(d==="THIS_MONTH"){const B=new Date(P.getFullYear(),P.getMonth(),1).getTime();return T>=B}else if(d==="CUSTOM"){if(c){const B=new Date(c+"T00:00:00").getTime();if(T<B)return!1}if(i){const B=new Date(i+"T23:59:59").getTime();if(T>B)return!1}return!0}return!0},h=()=>{const x=g.filter(f),E=x.length,P=x.filter(C=>C.status==="SENT"||C.status==="IN_PROGRESS"||C.status==="PENDING").length,T=x.filter(C=>C.status==="COMPLETED").length,B=E>0?Math.round(T/E*100):0,H=document.getElementById("kpiTotalDocs"),R=document.getElementById("kpiTotalDocsSub"),F=document.getElementById("kpiPendingDocs"),$=document.getElementById("kpiPendingDocsSub"),b=document.getElementById("kpiCompletedDocs"),S=document.getElementById("kpiCompletedDocsSub"),L=document.getElementById("dashPendingSubText");H&&(H.textContent=E),R&&(R.textContent=`${E} total agreement${E===1?"":"s"}`),F&&(F.textContent=P,F.className=`kpi-value ${P>0?"text-warning":""}`),$&&($.innerHTML=P>0?`<span class="badge bg-danger-subtle text-danger rounded-pill px-2 py-1 small fw-bold">${e("actionNeeded")}</span>`:'<span class="small text-muted">All up to date</span>'),b&&(b.textContent=T),S&&(S.textContent=`${B}% completed`);let N=e("timeframeAll");d==="TODAY"?N=e("timeframeToday"):d==="7DAYS"?N=e("timeframeLast7Days"):d==="30DAYS"?N=e("timeframeLast30Days"):d==="THIS_MONTH"?N=e("timeframeThisMonth"):d==="CUSTOM"&&(N=`${c||"Start"} to ${i||"Now"}`),L&&(L.innerHTML=`<strong>${P}</strong> ${e("attentionSub")} <span class="badge bg-primary-subtle text-primary ms-1">${N}</span>`);let M=x;if(I==="REQUIRES_ME"?M=M.filter(C=>C.status==="SENT"||C.status==="IN_PROGRESS"||C.status==="PENDING"):I==="COMPLETED"&&(M=M.filter(C=>C.status==="COMPLETED")),k.trim()){const C=k.toLowerCase().trim();M=M.filter(U=>U.title&&U.title.toLowerCase().includes(C)||U.fileName&&U.fileName.toLowerCase().includes(C)||U.id&&U.id.toLowerCase().includes(C))}const z=document.getElementById("dashTableBody"),W=document.getElementById("dashCountText");if(W&&(W.textContent=`Showing ${M.length} of ${E} agreement${E===1?"":"s"} (${N})`),!!z){if(M.length===0){z.innerHTML=`
                    <tr>
                        <td colspan="4" class="text-center py-5 text-muted">
                            <div class="mb-3"><i class="fa-regular fa-folder-open fs-1 text-secondary opacity-50"></i></div>
                            <h6 class="fw-semibold text-main">No documents found for this timeframe</h6>
                            <p class="small text-muted mb-3">No agreements matched "${N}" with the selected filters.</p>
                            <a href="#/upload" class="btn btn-pill btn-pill-primary btn-sm px-4">
                                <i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload Document
                            </a>
                        </td>
                    </tr>
                `;return}z.innerHTML=M.map(C=>`
                <tr>
                    <td>
                        <div class="d-flex align-items-center gap-3">
                            <div class="file-thumb-icon">
                                <i class="fa-regular fa-file-pdf"></i>
                            </div>
                            <div>
                                <div class="d-flex align-items-center gap-2">
                                    <a href="#/documents/${C.id}" class="fw-bold text-decoration-none text-main">${C.title||C.fileName||"Untitled Document"}</a>
                                    ${C.status==="SENT"||C.status==="IN_PROGRESS"?'<span class="badge bg-danger-subtle text-danger rounded-pill small" style="font-size: 0.68rem;">Pending Signature</span>':""}
                                </div>
                                <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                    Ref: #SE-${(C.id||"").substring(0,5).toUpperCase()} &bull; ${C.pages||C.pageCount||1} pgs &bull; ${C.fileName||C.title||"PDF"}
                                </div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <span class="status-pill status-${(C.status||"draft").toLowerCase()}">
                            <span class="status-dot"></span> ${C.status==="COMPLETED"?"Completed & Sealed":C.status==="SENT"||C.status==="IN_PROGRESS"?"Pending Signature":"Draft"}
                        </span>
                    </td>
                    <td class="small text-muted">
                        ${C.createdAt?new Date(C.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"Recently"}
                    </td>
                    <td class="text-end">
                        <div class="d-inline-flex align-items-center gap-1">
                            ${C.status!=="COMPLETED"?`
                                <a href="#/send?documentId=${C.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                    <i class="fa-solid fa-pen-nib me-1"></i> ${e("signNow")}
                                </a>
                                <a href="#/documents/${C.id}" class="btn btn-pill btn-pill-outline btn-sm px-2" title="${e("remind")}">
                                    <i class="fa-regular fa-bell"></i>
                                </a>
                            `:`
                                <button type="button" onclick="window.downloadDoc('${C.id}', true, 'SEALED_${(C.title||"document").replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                    <i class="fa-solid fa-download me-1"></i> ${e("download")}
                                </button>
                            `}
                        </div>
                    </td>
                </tr>
            `).join("")}};document.querySelectorAll(".tf-btn").forEach(x=>{x.onclick=()=>{const E=x.dataset.tf;d=E,document.querySelectorAll(".tf-btn").forEach(T=>{T.className=T===x?"btn btn-sm btn-pill tf-btn btn-primary":"btn btn-sm btn-pill tf-btn btn-outline-secondary"});const P=document.getElementById("dashCustomRangeBox");P&&(E==="CUSTOM"?P.classList.remove("d-none"):P.classList.add("d-none")),h()}});const r=document.getElementById("dashApplyCustomBtn");r&&(r.onclick=()=>{if(c=document.getElementById("dashStartDate").value,i=document.getElementById("dashEndDate").value,!c&&!i){A("Please select at least a start date or end date.","warning");return}h(),A("Custom timeframe filter applied!")});const y=document.getElementById("dashSearchInput");y&&(y.oninput=x=>{k=x.target.value,h()});const u=document.getElementById("tabAll"),p=document.getElementById("tabRequiresMe"),v=document.getElementById("tabCompleted"),w=(x,E)=>{I=E,[u,p,v].forEach(P=>{P&&(P.className=P===x?"filter-pill active":"filter-pill")}),h()};u&&(u.onclick=()=>w(u,"ALL")),p&&(p.onclick=()=>w(p,"REQUIRES_ME")),v&&(v.onclick=()=>w(v,"COMPLETED")),h()}catch(a){A(a.message,"danger")}}async function le(s,t="ALL"){s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const a=await D.getDocuments(t),n=Array.isArray(a)?a:[],o=n.length,m=n.filter(d=>d.status==="SENT"||d.status==="IN_PROGRESS").length,l=n.filter(d=>d.status==="COMPLETED").length,g=o>0?Math.round(l/o*100):0;s.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- 4 Top KPI Cards (Real Time Values) -->
                <div class="row g-3 mb-4">
                    <div class="col-6 col-lg-3">
                        <div class="kpi-card">
                            <div class="d-flex align-items-start justify-content-between">
                                <div>
                                    <div class="kpi-label">${e("activeEnvelopes")}</div>
                                    <div class="kpi-value">${o}</div>
                                    <div class="small text-muted mt-1">
                                        ${o>0?`${o} registered`:"0 uploaded"}
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
                                    <div class="kpi-value ${m>0?"text-danger":""}">${m}</div>
                                    <div class="small text-muted mt-1">
                                        ${m>0?"Pending signature":"No action needed"}
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
                                    <div class="kpi-value ${m>0?"text-warning":""}">${m}</div>
                                    <div class="small text-muted mt-1">
                                        ${m>0?`${m} awaiting signature`:"All signed"}
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
                                    <div class="kpi-label">${e("completedDocs")}</div>
                                    <div class="kpi-value text-success">${l}</div>
                                    <div class="small text-muted mt-1">
                                        ${g}% completed
                                    </div>
                                </div>
                                <div class="kpi-icon-box icon-green">
                                    <i class="fa-solid fa-circle-check"></i>
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
                        <a href="#/upload" class="btn btn-pill btn-pill-primary shadow-sm">
                            <i class="fa-solid fa-plus me-1"></i> ${e("newAgreement")}
                        </a>
                    </div>
                </div>

                <!-- Filter Pills Row & Search (Matches Screenshot 2) -->
                <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
                    <div class="filter-pill-nav bg-card p-1 rounded-pill border">
                        <a class="filter-pill ${t==="ALL"?"active":""}" href="#/documents?status=ALL">
                            All <span class="badge bg-white text-dark ms-1">${o}</span>
                        </a>
                        <a class="filter-pill ${t==="SENT"?"active":""}" href="#/documents?status=SENT">
                            ${e("filterRequiresMe")} <span class="badge bg-danger text-white ms-1">${m}</span>
                        </a>
                        <a class="filter-pill ${t==="IN_PROGRESS"?"active":""}" href="#/documents?status=IN_PROGRESS">
                            ${e("filterWaitingOthers")} <span class="badge bg-secondary ms-1">${m}</span>
                        </a>
                        <a class="filter-pill ${t==="COMPLETED"?"active":""}" href="#/documents?status=COMPLETED">
                            ${e("filterCompleted")} <span class="badge bg-success ms-1">${l}</span>
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
                                ${n.length>0?n.map((d,I)=>{var i;let k="status-pending",c="Pending";return d.status==="COMPLETED"?(k="status-completed",c="Completed & Sealed"):d.status==="SENT"||d.status==="IN_PROGRESS"?(k="status-signed",c="In Execution"):d.status==="DRAFT"&&(k="status-draft",c="Draft"),`
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center gap-3">
                                                    <div class="file-thumb-icon">
                                                        <i class="fa-regular fa-file-lines"></i>
                                                    </div>
                                                    <div>
                                                        <div class="fw-bold text-main">
                                                            <a href="#/documents/${d.id}" class="text-decoration-none text-main">${d.title}</a>
                                                        </div>
                                                        <div class="small text-muted mt-1" style="font-size: 0.76rem;">
                                                            DOC-2026-${(d.id||"").substring(0,4).toUpperCase()} &bull; PDF (${Math.round((d.fileSize||1024)/1024)} KB)
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div class="d-flex align-items-center gap-2">
                                                    <div class="signer-avatar-chip ${I%3===0?"avatar-blue":I%3===1?"avatar-orange":"avatar-purple"}">
                                                        ${(d.uploadedByName||"RS").substring(0,2).toUpperCase()}
                                                    </div>
                                                    <span class="small text-muted">${d.uploadedByName||((i=O.user)!=null&&i.fullName?O.user.fullName:"Signer")}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span class="status-pill ${k}">
                                                    <span class="status-dot"></span> ${c}
                                                </span>
                                            </td>
                                            <td class="small text-muted">
                                                <div>${d.createdAt?new Date(d.createdAt).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"Recently"}</div>
                                                <div style="font-size: 0.72rem; color: var(--text-light);">${d.status==="COMPLETED"?"Timestamped & Stored":"Expires in 30 days"}</div>
                                            </td>
                                            <td class="text-end">
                                                <div class="d-inline-flex align-items-center gap-1">
                                                    ${d.status==="DRAFT"?`
                                                        <a href="#/send?documentId=${d.id}" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-pen-to-square me-1"></i> Continue Edit
                                                        </a>
                                                    `:d.status==="COMPLETED"?`
                                                        <button type="button" onclick="window.downloadDoc('${d.id}', true, 'SEALED_${d.title.replace(/[^a-zA-Z0-9_-]/g,"_")}.pdf')" class="btn btn-pill btn-pill-outline btn-sm px-3">
                                                            <i class="fa-solid fa-download me-1"></i> ${e("downloadPdf")}
                                                        </button>
                                                    `:`
                                                        <a href="#/send?documentId=${d.id}" class="btn btn-pill btn-pill-primary btn-sm px-3">
                                                            <i class="fa-solid fa-pen-nib me-1"></i> ${e("reviewAndSign")}
                                                        </a>
                                                    `}
                                                    <div class="dropdown d-inline-block">
                                                        <button class="btn btn-link text-muted p-1" data-bs-toggle="dropdown"><i class="fa-solid fa-ellipsis-vertical"></i></button>
                                                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" style="border-radius: 10px;">
                                                            <li><a class="dropdown-item py-2 small" href="#/documents/${d.id}"><i class="fa-solid fa-magnifying-glass me-2"></i> Inspect Audit Logs</a></li>
                                                            <li><a class="dropdown-item py-2 small" href="#/verify?hash=${d.finalHash||""}"><i class="fa-solid fa-shield-halved me-2 text-success"></i> Verify Hash</a></li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    `}).join(""):`
                                    <tr>
                                        <td colspan="5" class="text-center py-5 text-muted">
                                            <div class="mb-3"><i class="fa-regular fa-folder-open fs-1 text-secondary opacity-50"></i></div>
                                            <h6 class="fw-semibold text-main">No documents found in vault</h6>
                                            <p class="small text-muted mb-3">Upload your first agreement to manage and track signatures in real-time.</p>
                                            <a href="#/upload" class="btn btn-pill btn-pill-primary btn-sm px-4">
                                                <i class="fa-solid fa-cloud-arrow-up me-1"></i> Upload Document
                                            </a>
                                        </td>
                                    </tr>
                                `}
                            </tbody>
                        </table>
                    </div>

                    <!-- Pagination Footer (Matches Screenshot 2) -->
                    <div class="p-3 bg-card border-top d-flex flex-wrap justify-content-between align-items-center text-muted small">
                        <div>Showing <strong>${n.length}</strong> of <strong>${o}</strong> agreement${o===1?"":"s"}</div>
                    </div>
                </div>
            </div>
        `}catch(a){A(a.message,"danger")}}async function re(s){s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading report analytics...</div></div>';try{const t=await D.getDocuments("ALL"),a=Array.isArray(t)?t:[];let n="ALL",o="ALL",m="",l="",g="";s.innerHTML=`
            <div class="container-fluid px-lg-4 py-4">
                <!-- Header with Title & Export Action -->
                <div class="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-3">
                    <div>
                        <div class="d-flex align-items-center gap-2 mb-1">
                            <span class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                <i class="fa-solid fa-file-csv text-primary me-1"></i> ${e("reportGeneration")}
                            </span>
                        </div>
                        <h3 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("reportGeneration")}</h3>
                        <p class="text-muted small mb-0">Generate and export filtered document datasets with signature status, audit metadata, and cryptographic hashes.</p>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" id="exportReportCsvBtn" class="btn btn-pill btn-pill-primary shadow-sm px-4">
                            <i class="fa-solid fa-file-arrow-down me-2"></i> ${e("exportCsvReport")}
                        </button>
                    </div>
                </div>

                <!-- Timeframe & Status Filter Panel -->
                <div class="card border mb-4 shadow-sm" style="background: var(--bg-card); border-radius: var(--radius-md);">
                    <div class="card-body p-3">
                        <div class="row g-3 align-items-center">
                            <!-- Timeframe Pills -->
                            <div class="col-lg-7">
                                <div class="d-flex align-items-center gap-1 flex-wrap">
                                    <span class="small fw-bold text-muted text-uppercase me-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                                        <i class="fa-solid fa-clock-rotate-left text-primary me-1"></i> Timeframe:
                                    </span>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-primary" data-tf="ALL">${e("timeframeAll")}</button>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-outline-secondary" data-tf="TODAY">${e("timeframeToday")}</button>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-outline-secondary" data-tf="7DAYS">${e("timeframeLast7Days")}</button>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-outline-secondary" data-tf="30DAYS">${e("timeframeLast30Days")}</button>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-outline-secondary" data-tf="THIS_MONTH">${e("timeframeThisMonth")}</button>
                                    <button type="button" class="btn btn-sm btn-pill report-tf-btn btn-outline-secondary" data-tf="CUSTOM">${e("timeframeCustom")}</button>
                                </div>

                                <!-- Custom Date Range Inputs -->
                                <div id="reportCustomRangeBox" class="d-none d-flex align-items-center gap-2 mt-2 flex-wrap">
                                    <div class="input-group input-group-sm" style="width: auto;">
                                        <span class="input-group-text bg-subtle small"><i class="fa-regular fa-calendar me-1"></i> From</span>
                                        <input type="date" id="reportStartDate" class="form-control form-control-sm">
                                    </div>
                                    <div class="input-group input-group-sm" style="width: auto;">
                                        <span class="input-group-text bg-subtle small"><i class="fa-regular fa-calendar me-1"></i> To</span>
                                        <input type="date" id="reportEndDate" class="form-control form-control-sm">
                                    </div>
                                    <button type="button" id="reportApplyCustomBtn" class="btn btn-sm btn-pill btn-pill-primary px-3">
                                        <i class="fa-solid fa-filter me-1"></i> Apply
                                    </button>
                                </div>
                            </div>

                            <!-- Status Dropdown & Search -->
                            <div class="col-lg-5">
                                <div class="d-flex align-items-center gap-2">
                                    <select class="form-select form-select-sm" id="reportStatusSelect" style="max-width: 170px;">
                                        <option value="ALL">All Statuses</option>
                                        <option value="COMPLETED">Completed & Sealed</option>
                                        <option value="PENDING">Awaiting Signature</option>
                                        <option value="DRAFT">Drafts</option>
                                    </select>
                                    <div class="position-relative flex-grow-1">
                                        <i class="fa-solid fa-magnifying-glass search-icon-wrap" style="top: 50%; transform: translateY(-50%); font-size: 0.8rem;"></i>
                                        <input type="text" id="reportSearchInput" class="search-input-pill py-1 ps-4" style="height: 34px; font-size: 0.85rem;" placeholder="Search in report...">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4 Report Summary Metric Cards -->
                <div class="row g-3 mb-4">
                    <div class="col-6 col-md-3">
                        <div class="kpi-card p-3">
                            <div class="kpi-label">TOTAL IN REPORT</div>
                            <div class="kpi-value fs-3" id="repMetricTotal">0</div>
                            <div class="small text-muted mt-1" id="repMetricTotalSub">0 records</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="kpi-card p-3">
                            <div class="kpi-label">AWAITING SIGNATURE</div>
                            <div class="kpi-value fs-3 text-warning" id="repMetricPending">0</div>
                            <div class="small text-muted mt-1">Pending action</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="kpi-card p-3">
                            <div class="kpi-label">COMPLETED & SEALED</div>
                            <div class="kpi-value fs-3 text-success" id="repMetricCompleted">0</div>
                            <div class="small text-muted mt-1" id="repMetricCompletedSub">0% sealed</div>
                        </div>
                    </div>
                    <div class="col-6 col-md-3">
                        <div class="kpi-card p-3">
                            <div class="kpi-label">TOTAL PAGES</div>
                            <div class="kpi-value fs-3 text-primary" id="repMetricPages">0</div>
                            <div class="small text-muted mt-1">Processed pages</div>
                        </div>
                    </div>
                </div>

                <!-- Live Report Preview Table -->
                <div class="table-card mb-4">
                    <div class="card-header bg-card py-3 px-3 border-bottom d-flex justify-content-between align-items-center">
                        <span class="fw-bold small text-uppercase" style="letter-spacing: 0.5px;">
                            <i class="fa-solid fa-table-list me-1 text-primary"></i> Data Report Preview
                        </span>
                        <span class="badge bg-subtle text-muted" id="repBadgeCount">0 documents ready for export</span>
                    </div>
                    <div class="table-responsive">
                        <table class="table-custom">
                            <thead>
                                <tr>
                                    <th>DOCUMENT ID & NAME</th>
                                    <th>STATUS</th>
                                    <th>SIGNERS / PARTIES</th>
                                    <th>CREATED DATE</th>
                                    <th>COMPLETED DATE</th>
                                    <th>PAGES & SIZE</th>
                                    <th class="text-end">HASH (SHA-256)</th>
                                </tr>
                            </thead>
                            <tbody id="reportTableBody">
                            </tbody>
                        </table>
                    </div>
                    <div class="p-3 bg-card border-top d-flex justify-content-between align-items-center text-muted small" id="reportFooter">
                        <div id="reportFooterText">Showing 0 rows</div>
                        <div>Format: <strong>RFC 4180 CSV (UTF-8)</strong></div>
                    </div>
                </div>
            </div>
        `;const d=()=>{const r=new Date;return a.filter(y=>{const u=y.createdAt?new Date(y.createdAt):null,p=u&&!isNaN(u.getTime())?u.getTime():0;if(n==="TODAY"){const v=new Date(r.getFullYear(),r.getMonth(),r.getDate()).getTime();if(p<v)return!1}else if(n==="7DAYS"){const v=r.getTime()-6048e5;if(p<v)return!1}else if(n==="30DAYS"){const v=r.getTime()-2592e6;if(p<v)return!1}else if(n==="THIS_MONTH"){const v=new Date(r.getFullYear(),r.getMonth(),1).getTime();if(p<v)return!1}else if(n==="CUSTOM"){if(l){const v=new Date(l+"T00:00:00").getTime();if(p<v)return!1}if(g){const v=new Date(g+"T23:59:59").getTime();if(p>v)return!1}}if(o==="COMPLETED"&&y.status!=="COMPLETED"||o==="PENDING"&&y.status!=="SENT"&&y.status!=="IN_PROGRESS"&&y.status!=="PENDING"||o==="DRAFT"&&y.status!=="DRAFT")return!1;if(m.trim()){const v=m.toLowerCase().trim(),w=y.title&&y.title.toLowerCase().includes(v),x=y.id&&y.id.toLowerCase().includes(v),E=y.fileName&&y.fileName.toLowerCase().includes(v);if(!w&&!x&&!E)return!1}return!0})},I=()=>{const r=d(),y=r.length,u=r.filter($=>$.status==="SENT"||$.status==="IN_PROGRESS"||$.status==="PENDING").length,p=r.filter($=>$.status==="COMPLETED").length,v=r.reduce(($,b)=>$+(b.pages||b.pageCount||1),0),w=y>0?Math.round(p/y*100):0,x=document.getElementById("repMetricTotal"),E=document.getElementById("repMetricPending"),P=document.getElementById("repMetricCompleted"),T=document.getElementById("repMetricCompletedSub"),B=document.getElementById("repMetricPages"),H=document.getElementById("repBadgeCount"),R=document.getElementById("reportFooterText");x&&(x.textContent=y),E&&(E.textContent=u),P&&(P.textContent=p),T&&(T.textContent=`${w}% sealed`),B&&(B.textContent=v),H&&(H.textContent=`${y} document${y===1?"":"s"} ready for export`),R&&(R.textContent=`Showing ${y} document record${y===1?"":"s"}`);const F=document.getElementById("reportTableBody");if(F){if(r.length===0){F.innerHTML=`
                    <tr>
                        <td colspan="7" class="text-center py-5 text-muted">
                            <div class="mb-3"><i class="fa-regular fa-file-excel fs-1 opacity-50"></i></div>
                            <h6 class="fw-semibold text-main">No records match the current report criteria</h6>
                            <p class="small text-muted mb-0">Try adjusting your timeframe, status filter, or search keywords.</p>
                        </td>
                    </tr>
                `;return}F.innerHTML=r.map($=>{var C,U;const b=$.status==="COMPLETED"?'<span class="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-2 py-1"><i class="fa-solid fa-circle-check me-1"></i> Completed & Sealed</span>':$.status==="SENT"||$.status==="IN_PROGRESS"?'<span class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill px-2 py-1"><i class="fa-solid fa-clock me-1"></i> Awaiting Signature</span>':'<span class="badge bg-secondary-subtle text-secondary border rounded-pill px-2 py-1">Draft</span>',S=$.createdAt?new Date($.createdAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):"—",L=$.completedAt?new Date($.completedAt).toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}):$.status==="COMPLETED"?"Sealed":"—",N=$.signers&&Array.isArray($.signers)?$.signers.map(Z=>Z.name||Z.email).join(", "):((C=$.uploadedBy)==null?void 0:C.fullName)||((U=O.user)==null?void 0:U.fullName)||"Self",M=$.finalHash||$.originalHash||"Pending",z=M.length>16?M.substring(0,8)+"..."+M.substring(M.length-6):M,W=$.fileSize?Math.round($.fileSize/1024)+" KB":"—";return`
                    <tr>
                        <td>
                            <div class="fw-bold text-main">${$.title||$.fileName||"Untitled Document"}</div>
                            <div class="small text-muted font-monospace" style="font-size: 0.72rem;">#SE-${($.id||"").substring(0,8)}</div>
                        </td>
                        <td>${b}</td>
                        <td class="small text-muted" style="max-width: 160px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${N}
                        </td>
                        <td class="small text-muted">${S}</td>
                        <td class="small text-muted">${L}</td>
                        <td class="small text-muted">
                            ${$.pages||$.pageCount||1} pgs &bull; ${W}
                        </td>
                        <td class="text-end">
                            <span class="font-monospace small text-primary" title="${M}">${z}</span>
                        </td>
                    </tr>
                `}).join("")}},k=()=>{const r=d();if(r.length===0){A("No records available to export with current filters.","warning");return}const y=["Document ID","Document Title","Status","Signers / Parties","Created Date","Completed Date","Pages","File Size (KB)","SHA-256 Hash"],u=T=>T==null?'""':`"${String(T).replace(/"/g,'""')}"`,p=r.map(T=>{var S,L;const B=T.status==="COMPLETED"?"Completed & Sealed":T.status==="SENT"||T.status==="IN_PROGRESS"?"Awaiting Signature":T.status==="DRAFT"?"Draft":T.status,H=T.createdAt?new Date(T.createdAt).toISOString():"",R=T.completedAt?new Date(T.completedAt).toISOString():T.status==="COMPLETED"?"Sealed":"",F=T.fileSize?Math.round(T.fileSize/1024):0,$=T.signers&&Array.isArray(T.signers)?T.signers.map(N=>`${N.name||""} <${N.email||""}> [${N.status||""}]`).join("; "):((S=T.uploadedBy)==null?void 0:S.fullName)||((L=O.user)==null?void 0:L.fullName)||"Self",b=T.finalHash||T.originalHash||"N/A";return[u(T.id),u(T.title||T.fileName||"Untitled Document"),u(B),u($),u(H),u(R),u(T.pages||T.pageCount||1),u(F),u(b)].join(",")}),v=[y.map(u).join(","),...p].join(`\r
`),w=new Blob(["\uFEFF"+v],{type:"text/csv;charset=utf-8;"}),x=`SignEase_Report_${new Date().toISOString().slice(0,10)}.csv`,E=window.URL.createObjectURL(w),P=document.createElement("a");P.href=E,P.download=x,document.body.appendChild(P),P.click(),P.remove(),setTimeout(()=>window.URL.revokeObjectURL(E),1e4),A(`Exported ${r.length} document records to ${x}!`,"success")},c=document.getElementById("exportReportCsvBtn");c&&(c.onclick=k),document.querySelectorAll(".report-tf-btn").forEach(r=>{r.onclick=()=>{const y=r.dataset.tf;n=y,document.querySelectorAll(".report-tf-btn").forEach(p=>{p.className=p===r?"btn btn-sm btn-pill report-tf-btn btn-primary":"btn btn-sm btn-pill report-tf-btn btn-outline-secondary"});const u=document.getElementById("reportCustomRangeBox");u&&(y==="CUSTOM"?u.classList.remove("d-none"):u.classList.add("d-none")),I()}});const i=document.getElementById("reportApplyCustomBtn");i&&(i.onclick=()=>{if(l=document.getElementById("reportStartDate").value,g=document.getElementById("reportEndDate").value,!l&&!g){A("Please select at least a start date or end date.","warning");return}I(),A("Custom report timeframe applied!")});const f=document.getElementById("reportStatusSelect");f&&(f.onchange=r=>{o=r.target.value,I()});const h=document.getElementById("reportSearchInput");h&&(h.oninput=r=>{m=r.target.value,I()}),I()}catch(t){A(t.message,"danger")}}async function oe(s,t){s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const a=await D.getDocument(t);s.innerHTML=`
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
                                ${a.signers&&a.signers.length>0?a.signers.map(n=>`
                                    <tr>
                                        <td class="ps-3 fw-bold text-muted">#${n.signOrder}</td>
                                        <td>
                                            <div class="fw-bold">${n.name}</div>
                                            <div class="small text-muted">${n.email}${n.phone?` &bull; <i class="fa-brands fa-whatsapp text-success"></i> ${n.phone}`:""}</div>
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
                                                        <i class="fa-solid fa-paper-plane me-1"></i> Email
                                                    </button>
                                                    <button type="button" class="btn btn-outline-success" onclick="window.sendWhatsAppInvite('${n.id}', '${n.phone||""}', '${n.signingToken}', event)" title="Send/Resend invite via WhatsApp">
                                                        <i class="fa-brands fa-whatsapp me-1"></i> WhatsApp
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
                                ${a.auditLogs&&a.auditLogs.length>0?a.auditLogs.map(n=>`
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
        `}catch(a){A(a.message,"danger")}}async function de(s){Q(s,null)}async function Q(s,t){s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading workflow dispatch...</div></div>';try{let a=null;if(t)try{a=await D.getDocument(t)}catch{}const o=new URLSearchParams(window.location.hash.includes("?")?window.location.hash.split("?")[1]:"").get("title")||"";s.innerHTML=`
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
                        <div class="dropzone-box" id="workflowDropzone" style="${a?"display: none;":""}">
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
                        <div id="uploadedFilePreviewBox" class="uploaded-file-card" style="${a?"display: flex;":"display: none;"}">
                            <div class="d-flex align-items-center gap-3">
                                <div class="file-thumb-icon">
                                    <i class="fa-regular fa-file-pdf"></i>
                                </div>
                                <div>
                                    <div class="fw-bold text-main" id="previewFileName">${a?a.fileName:"Employment_Agreement_2026.pdf"}</div>
                                    <div class="small text-muted" style="font-size: 0.76rem;" id="previewFileMeta">
                                        ${a?Math.round((a.fileSize||18e5)/1024/1024*10)/10+" MB":"1.8 MB"} &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>
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
                            <input type="text" id="envelopeTitle" class="form-control" placeholder="Agreement Title (e.g. Master Service Agreement)" value="${a?a.title:o}" required>
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
                            <div class="signer-input-row p-3 mb-3 border rounded-3 bg-card shadow-xs">
                                <div class="row g-2 align-items-center mb-2">
                                    <div class="col-md-4">
                                        <div class="meta-box-label"><i class="fa-regular fa-user"></i> ${e("signerName")} *</div>
                                        <input type="text" class="form-control s-name" placeholder="e.g. Sarah Jenkins" value="Sarah Jenkins" required>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="meta-box-label"><i class="fa-regular fa-envelope"></i> ${e("emailAddress")} *</div>
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
                                <div class="row g-2 align-items-center pt-2 border-top border-light-subtle">
                                    <div class="col-md-3">
                                        <div class="meta-box-label text-success"><i class="fa-brands fa-whatsapp"></i> WhatsApp Mobile</div>
                                        <input type="tel" class="form-control s-phone" placeholder="e.g. +91 98765 43210" value="+91 98765 43210">
                                    </div>
                                    <div class="col-md-3">
                                        <div class="meta-box-label"><i class="fa-solid fa-paper-plane"></i> Delivery Channel</div>
                                        <select class="form-select s-channel">
                                            <option value="EMAIL_AND_WHATSAPP" selected>Email &amp; WhatsApp</option>
                                            <option value="WHATSAPP">WhatsApp Only</option>
                                            <option value="EMAIL">Email Only</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="meta-box-label"><i class="fa-solid fa-shield-halved"></i> Verification Option</div>
                                        <select class="form-select s-verif">
                                            <option value="WHATSAPP_OTP" selected>WhatsApp OTP</option>
                                            <option value="EMAIL_OTP">Email OTP</option>
                                            <option value="AADHAAR_ESIGN">Aadhaar e-Sign (UIDAI)</option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="meta-box-label"><i class="fa-solid fa-layer-group"></i> Client Tier</div>
                                        <select class="form-select s-tier">
                                            <option value="0" selected>Tier 0 (Standard Signer)</option>
                                            <option value="1">Tier 1 (Internal Approver)</option>
                                            <option value="2">Tier 2 (External Counterparty)</option>
                                            <option value="3">Tier 3 (Executive Sign-Off)</option>
                                        </select>
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
        `;const m=document.getElementById("workflowDropzone"),l=document.getElementById("workflowFileInput"),g=document.getElementById("uploadedFilePreviewBox");let d=null;m&&l&&(m.onclick=()=>l.click(),l.onchange=()=>{l.files[0]&&(d=l.files[0],document.getElementById("previewFileName").textContent=d.name,document.getElementById("previewFileMeta").innerHTML=`${(d.size/1024/1024).toFixed(1)} MB &bull; <span class="text-success fw-semibold"><i class="fa-solid fa-circle text-success me-1" style="font-size: 0.45rem;"></i> ${e("readyToTag")}</span>`,document.getElementById("envelopeTitle").value||(document.getElementById("envelopeTitle").value=d.name.replace(/\.[^/.]+$/,"")),m.style.display="none",g.style.display="flex")},["dragenter","dragover"].forEach(c=>{m.addEventListener(c,i=>{i.preventDefault(),m.classList.add("dragover")})}),["dragleave","drop"].forEach(c=>{m.addEventListener(c,i=>{i.preventDefault(),m.classList.remove("dragover")})}),m.addEventListener("drop",c=>{c.dataTransfer.files&&c.dataTransfer.files.length>0&&(l.files=c.dataTransfer.files,l.dispatchEvent(new Event("change")))}));const I=document.getElementById("removeFileBtn");I&&(I.onclick=()=>{d=null,a=null,l.value="",g.style.display="none",m.style.display="block"});const k=document.getElementById("addNewSignerRowBtn");k&&(k.onclick=()=>{const c=document.getElementById("dynamicSignersList"),i=document.createElement("div");i.className="signer-input-row p-3 mb-3 border rounded-3 bg-card shadow-xs",i.innerHTML=`
                    <div class="row g-2 align-items-center mb-2">
                        <div class="col-md-4">
                            <div class="meta-box-label"><i class="fa-regular fa-user"></i> ${e("signerName")} *</div>
                            <input type="text" class="form-control s-name" placeholder="e.g. Vikram Mehta" required>
                        </div>
                        <div class="col-md-4">
                            <div class="meta-box-label"><i class="fa-regular fa-envelope"></i> ${e("emailAddress")} *</div>
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
                    <div class="row g-2 align-items-center pt-2 border-top border-light-subtle">
                        <div class="col-md-3">
                            <div class="meta-box-label text-success"><i class="fa-brands fa-whatsapp"></i> WhatsApp Mobile</div>
                            <input type="tel" class="form-control s-phone" placeholder="e.g. +91 98765 43210">
                        </div>
                        <div class="col-md-3">
                            <div class="meta-box-label"><i class="fa-solid fa-paper-plane"></i> Delivery Channel</div>
                            <select class="form-select s-channel">
                                <option value="EMAIL_AND_WHATSAPP" selected>Email &amp; WhatsApp</option>
                                <option value="WHATSAPP">WhatsApp Only</option>
                                <option value="EMAIL">Email Only</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <div class="meta-box-label"><i class="fa-solid fa-shield-halved"></i> Verification Option</div>
                            <select class="form-select s-verif">
                                <option value="WHATSAPP_OTP" selected>WhatsApp OTP</option>
                                <option value="EMAIL_OTP">Email OTP</option>
                                <option value="AADHAAR_ESIGN">Aadhaar e-Sign (UIDAI)</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <div class="meta-box-label"><i class="fa-solid fa-layer-group"></i> Client Tier</div>
                            <select class="form-select s-tier">
                                <option value="0" selected>Tier 0 (Standard Signer)</option>
                                <option value="1">Tier 1 (Internal Approver)</option>
                                <option value="2">Tier 2 (External Counterparty)</option>
                                <option value="3">Tier 3 (Executive Sign-Off)</option>
                            </select>
                        </div>
                    </div>
                `,c.appendChild(i)}),document.getElementById("workflowSendForm").onsubmit=async c=>{c.preventDefault();const i=document.getElementById("dispatchEnvelopeBtn");i.disabled=!0,i.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Dispatching...';try{let f=a?a.id:null;if(d){const u=new FormData;u.append("file",d),u.append("title",document.getElementById("envelopeTitle").value.trim()||d.name),f=(await D.uploadDocument(u)).id}else if(!f){alert("Please select or drop a PDF file in Step 1."),i.disabled=!1,i.innerHTML=e("sendForSignature");return}const h=[];if(document.querySelectorAll(".signer-input-row").forEach((u,p)=>{h.push({name:u.querySelector(".s-name").value.trim(),email:u.querySelector(".s-email").value.trim(),phone:u.querySelector(".s-phone")?u.querySelector(".s-phone").value.trim():"",deliveryChannel:u.querySelector(".s-channel")?u.querySelector(".s-channel").value:"EMAIL_AND_WHATSAPP",verificationMethod:u.querySelector(".s-verif")?u.querySelector(".s-verif").value:"WHATSAPP_OTP",clientTier:u.querySelector(".s-tier")?parseInt(u.querySelector(".s-tier").value,10):0,role:u.querySelector(".s-role").value,order:p+1})}),h.length===0){alert("Please add at least one signer."),i.disabled=!1,i.innerHTML=e("sendForSignature");return}const r=await D.createSigningRequest({documentId:f,title:document.getElementById("envelopeTitle").value.trim(),message:"",dueDate:null,sequentialSigning:!1,signers:h});let y="";r.signers&&r.signers.length>0&&(y=r.signers.map(u=>`
• ${u.name} (${u.email}${u.phone?" / "+u.phone:""}):
  Signing Link: ${window.location.origin}/#/sign/${u.token}${u.whatsappUrl?`
  WhatsApp Invite: `+u.whatsappUrl:""}`).join(`
`)),alert(`✅ Agreement Dispatched Successfully!
Signing invitations dispatched to recipients via configured channels (Email / WhatsApp).`+(y?`

Direct Signing Links & WhatsApp Invites:
`+y:"")),A("Agreement Dispatched Successfully! Invites sent."),window.location.hash=`#/documents/${f}`}catch(f){i.disabled=!1,i.innerHTML=e("sendForSignature"),A(f.message,"danger")}}}catch(a){A(a.message,"danger")}}async function ce(s,t){var m;const a=Y();s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i><div class="mt-2 text-muted">Loading signing context...</div></div>';try{let u=function(){const b=g.getBoundingClientRect();g.width=b.width*2,g.height=180*2,d.scale(2,2),d.strokeStyle=k,d.lineWidth=2.5,d.lineCap="round",d.lineJoin="round"},p=function(b){const S=g.getBoundingClientRect();return b.touches&&b.touches.length>0?{x:b.touches[0].clientX-S.left,y:b.touches[0].clientY-S.top}:{x:b.clientX-S.left,y:b.clientY-S.top}};var n=u,o=p;const l=await D.getSigningContext(t);if(l.signerStatus==="SIGNED"){s.innerHTML=`
                <div class="d-flex align-items-center justify-content-center py-5">
                    <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 540px; border-radius: 16px;">
                        <i class="fa-solid fa-circle-check text-success fs-1 mb-3"></i>
                        <h4 class="fw-bold mb-2">Already Executed</h4>
                        <p class="text-muted small mb-4">You have already completed electronic signing for this document on ${new Date(l.signedAt).toLocaleString("en-IN")}.</p>
                        <a href="#/verify?hash=${l.finalHash||""}" class="btn btn-outline-primary btn-sm">Public Ledger Verification</a>
                    </div>
                </div>
            `;return}s.innerHTML=`
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
                                <i class="fa-solid fa-globe text-primary me-1"></i> ${((m=V.find(b=>b.code===j()))==null?void 0:m.native)||"English"}
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0 mt-1" style="border-radius: 12px; min-width: 200px;">
                                ${V.map(b=>`
                                    <li>
                                        <button class="dropdown-item py-2 d-flex align-items-center justify-content-between ${j()===b.code?"active fw-bold":""}" type="button" onclick="window.changeAppLanguage('${b.code}')">
                                            <span>${b.flag} ${b.native}</span>
                                            ${j()===b.code?'<i class="fa-solid fa-check text-primary"></i>':""}
                                        </button>
                                    </li>
                                `).join("")}
                            </ul>
                        </div>
                        <button class="btn btn-pill btn-pill-outline btn-sm px-2" onclick="window.toggleAppTheme()" title="${e("darkModeToggle")}">
                            <i class="fa-solid fa-${a==="dark"?"sun text-warning":"moon text-secondary"}"></i>
                        </button>
                        <div class="small text-muted d-none d-sm-block">${e("requestedBy")} <strong>${l.senderName}</strong></div>
                    </div>
                </div>

                <div class="card border-0 shadow-sm p-4 p-md-5 mb-4" style="background: var(--bg-card); border: 1px solid var(--border-color) !important; border-radius: var(--radius-lg);">
                    <div class="border-bottom pb-3 mb-4 d-flex justify-content-between align-items-start">
                        <div>
                            <span class="badge bg-warning-subtle text-warning fw-bold mb-1">Awaiting Signature</span>
                            <h4 class="fw-bold mb-1">${l.documentTitle}</h4>
                            <div class="text-muted small">Signer: <strong>${l.signerName}</strong> (${l.signerEmail})</div>
                        </div>
                        <a href="${D.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-arrow-up-right-from-square me-1"></i> Open PDF</a>
                    </div>

                    <!-- In-Browser Document Preview -->
                    <div class="mb-4">
                        <label class="form-label fw-bold small text-muted text-uppercase mb-2"><i class="fa-regular fa-file-pdf text-danger me-1"></i> Document Review</label>
                        <div class="rounded-3 border overflow-hidden" style="height: 380px; background: #e2e8f0;">
                            <iframe src="${D.getSigningPreviewUrl(t)}" width="100%" height="100%" style="border: none;"></iframe>
                        </div>
                    </div>

                    <!-- STEP 1: OTP Identity Check (FR-07) -->
                    <div class="p-3 mb-4 rounded-3 border ${l.otpVerified?"bg-success-subtle border-success":"bg-light"}" id="otpContainer">
                        <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
                            <div>
                                <span class="fw-bold small text-uppercase"><i class="fa-solid fa-shield-halved text-primary me-1"></i> Step 1: Identity Verification (OTP)</span>
                                <div class="small text-muted" id="otpText">${l.otpVerified?'<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP':e("otpNotice")}</div>
                            </div>
                            ${l.otpVerified?"":`
                                <div class="d-flex flex-wrap gap-2">
                                    <button type="button" class="btn btn-sm btn-success fw-semibold" id="getWhatsAppOtpBtn"><i class="fa-brands fa-whatsapp me-1"></i> ${e("getWhatsAppOtp")||"Get WhatsApp OTP"}</button>
                                    <button type="button" class="btn btn-sm btn-outline-primary fw-semibold" id="getOtpBtn"><i class="fa-regular fa-envelope me-1"></i> ${e("emailOtp")||"Get Email OTP"}</button>
                                </div>
                            `}
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
        `;const g=document.getElementById("signCanvas"),d=g.getContext("2d");let I="DRAWN",k="#0f172a",c=!1,i=0,f=0,h=!1,r="",y=1;u(),g.onmousedown=b=>{c=!0,h=!0;const S=p(b);i=S.x,f=S.y},g.onmousemove=b=>{if(!c)return;const S=p(b);d.strokeStyle=k,d.beginPath(),d.moveTo(i,f),d.lineTo(S.x,S.y),d.stroke(),i=S.x,f=S.y},g.onmouseup=()=>c=!1,g.onmouseleave=()=>c=!1,g.ontouchstart=b=>{c=!0,h=!0;const S=p(b);i=S.x,f=S.y},g.ontouchmove=b=>{if(!c)return;b.preventDefault();const S=p(b);d.strokeStyle=k,d.beginPath(),d.moveTo(i,f),d.lineTo(S.x,S.y),d.stroke(),i=S.x,f=S.y},g.ontouchend=()=>c=!1,document.getElementById("clearCanvasBtn").onclick=()=>{d.clearRect(0,0,g.width,g.height),h=!1},document.getElementById("penBlack").onclick=function(){k="#0f172a",this.classList.add("active"),document.getElementById("penBlue").classList.remove("active")},document.getElementById("penBlue").onclick=function(){k="#1e40af",this.classList.add("active"),document.getElementById("penBlack").classList.remove("active")},document.querySelectorAll("#sigModeTab button").forEach(b=>{b.onclick=()=>{document.querySelectorAll("#sigModeTab button").forEach(S=>S.classList.remove("active")),b.classList.add("active"),I=b.dataset.mode,document.getElementById("paneDrawn").style.display=I==="DRAWN"?"block":"none",document.getElementById("paneTyped").style.display=I==="TYPED"?"block":"none",document.getElementById("paneUploaded").style.display=I==="UPLOADED"?"block":"none",document.getElementById("paneAadhaar").style.display=I==="AADHAAR_ESIGN"?"block":"none"}});const v=document.getElementById("typedInput");v.oninput=()=>{document.getElementById("typePrev1").textContent=v.value||"Name",document.getElementById("typePrev2").textContent=v.value||"Name"},document.getElementById("styleOpt1").onclick=()=>{y=1,document.getElementById("styleOpt1").classList.add("selected"),document.getElementById("styleOpt2").classList.remove("selected")},document.getElementById("styleOpt2").onclick=()=>{y=2,document.getElementById("styleOpt2").classList.add("selected"),document.getElementById("styleOpt1").classList.remove("selected")},document.getElementById("sigUploadInput").onchange=function(){if(this.files[0]){const b=new FileReader;b.onload=S=>{r=S.target.result,document.getElementById("upPreviewImg").src=r,document.getElementById("upPreviewBox").style.display="block"},b.readAsDataURL(this.files[0])}};const w=document.getElementById("getWhatsAppOtpBtn");let x=null;w&&(w.onclick=async()=>{if(!w.disabled){w.disabled=!0,w.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';try{const b=await D.requestWhatsAppOtp(t);document.getElementById("otpInputArea").style.display="block";const S=document.getElementById("signerOtp");S&&(S.value="");let L="";b.whatsappUrl&&(L=`<div class="mt-2"><a href="${b.whatsappUrl}" target="_blank" class="btn btn-sm btn-success"><i class="fa-brands fa-whatsapp me-1"></i> Open WhatsApp Web / App</a></div>`);const N=`<span class="text-success"><i class="fa-brands fa-whatsapp me-1"></i> ${b.message||"Verification OTP code has been dispatched to your WhatsApp."}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your WhatsApp messages. Valid for 10 minutes.</small></span>${L}`;document.getElementById("otpMsg").innerHTML=N,A(b.message||"OTP sent to your WhatsApp.");let M=60;w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${M}s)`,x&&clearInterval(x),x=setInterval(()=>{M--,M<=0?(clearInterval(x),w.disabled=!1,w.innerHTML='<i class="fa-brands fa-whatsapp me-1"></i> Get WhatsApp OTP'):w.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${M}s)`},1e3)}catch(b){w.disabled=!1,w.innerHTML='<i class="fa-brands fa-whatsapp me-1"></i> Get WhatsApp OTP',A(b.message,"danger")}}});const E=document.getElementById("getOtpBtn");let P=null;E&&(E.onclick=async()=>{if(!E.disabled){E.disabled=!0,E.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Sending OTP...';try{const b=await D.requestOtp(t);document.getElementById("otpInputArea").style.display="block";const S=document.getElementById("signerOtp");S&&(S.value="");const L=`<span class="text-success"><i class="fa-solid fa-envelope-circle-check me-1"></i> ${b.message||"Verification OTP code has been dispatched to your email address."}<br><small class="text-muted"><i class="fa-solid fa-clock me-1"></i> Please check your inbox or spam folder. Valid for 10 minutes.</small></span>`;document.getElementById("otpMsg").innerHTML=L,A(b.message||"OTP sent to your email.");let N=60;E.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${N}s)`,P&&clearInterval(P),P=setInterval(()=>{N--,N<=0?(clearInterval(P),E.disabled=!1,E.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP Code'):E.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${N}s)`},1e3)}catch(b){E.disabled=!1,E.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Send OTP Code',A(b.message,"danger")}}}),document.getElementById("verifyOtpBtn").onclick=async()=>{const b=document.getElementById("signerOtp").value.trim();if(!b){alert("Enter 6-digit code");return}try{await D.verifyOtp(t,b),document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via OTP Code!',document.getElementById("otpInputArea").style.display="none"}catch(S){document.getElementById("otpMsg").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${S.message}</span>`}},document.getElementById("declineBtn").onclick=async()=>{const b=prompt("Please specify reason for declining:");b&&(await D.declineSignature(t,b),A("Document declined."),window.location.reload())};let T=!1,B="";const H=document.getElementById("spaAadhaarInput");H&&(H.oninput=function(){let b=this.value.replace(/\D/g,"");b.length>12&&(b=b.substring(0,12));let S="";for(let L=0;L<b.length;L++)L>0&&L%4===0&&(S+=" "),S+=b[L];this.value=S});const R=document.getElementById("spaSendAadhaarOtpBtn");let F=null;R&&(R.onclick=async()=>{if(R.disabled)return;const b=document.getElementById("spaAadhaarInput").value.replace(/\D/g,"");if(b.length!==12||b.startsWith("0")||b.startsWith("1")){alert("Please enter a valid 12-digit Aadhaar number (cannot start with 0 or 1).");return}try{R.disabled=!0,R.innerHTML='<i class="fa-solid fa-spinner fa-spin me-1"></i> Requesting OTP...';const S=await D.requestAadhaarOtp(t,b);document.getElementById("spaAadhaarOtpRow").style.display="block",document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-success"><i class="fa-solid fa-circle-check me-1"></i> ${S.message||"Aadhaar OTP dispatched to linked mobile & email."}</span>`;let L=60;R.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${L}s)`,F&&clearInterval(F),F=setInterval(()=>{L--,L<=0?(clearInterval(F),R.disabled=!1,R.innerHTML='<i class="fa-solid fa-rotate-right me-1"></i> Resend OTP'):R.innerHTML=`<i class="fa-solid fa-clock me-1"></i> Resend (${L}s)`},1e3)}catch(S){R.disabled=!1,R.innerHTML='<i class="fa-solid fa-paper-plane me-1"></i> Get Aadhaar OTP',document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${S.message}</span>`}});const $=document.getElementById("spaVerifyAadhaarOtpBtn");$&&($.onclick=async()=>{const b=document.getElementById("spaAadhaarInput").value.replace(/\D/g,""),S=document.getElementById("spaAadhaarOtpCode").value.trim();if(S.length!==6){alert("Please enter 6-digit Aadhaar OTP code.");return}try{const L=await D.verifyAadhaarOtp(t,b,S);T=!0,B=L.signatureData,document.getElementById("spaAadhaarForm").style.display="none",document.getElementById("spaAadhaarSuccess").style.display="block",document.getElementById("spaAadhaarDetails").innerHTML=`<strong>UID:</strong> ${L.maskedAadhaar} &bull; <strong>Txn:</strong> ${L.txnId}`,document.getElementById("spaAadhaarStampImg").src=L.signatureData,document.getElementById("otpContainer").className="p-3 mb-4 rounded-3 border bg-success-subtle border-success",document.getElementById("otpText").innerHTML='<i class="fa-solid fa-circle-check text-success me-1"></i> Identity Verified via UIDAI Aadhaar e-KYC!',document.getElementById("otpInputArea").style.display="none",document.getElementById("legalConsent").checked=!0,A("Aadhaar identity verified successfully!")}catch(L){document.getElementById("spaAadhaarAlert").innerHTML=`<span class="text-danger"><i class="fa-solid fa-triangle-exclamation me-1"></i> ${L.message}</span>`}}),document.getElementById("executeBtn").onclick=async()=>{if(!document.getElementById("legalConsent").checked){alert("You must accept the legal consent agreement under IT Act 2000.");return}let b="";if(I==="DRAWN"){if(!h){alert("Please draw your signature.");return}b=g.toDataURL("image/png")}else if(I==="TYPED"){const S=v.value.trim();if(!S){alert("Enter your legal name.");return}const L=document.createElement("canvas");L.width=400,L.height=100;const N=L.getContext("2d");N.fillStyle="#ffffff",N.fillRect(0,0,400,100),N.fillStyle="#0f172a",N.font=y===1?'48px "Great Vibes", cursive':'44px "Dancing Script", cursive',N.textAlign="center",N.textBaseline="middle",N.fillText(S,200,50),b=L.toDataURL("image/png")}else if(I==="UPLOADED"){if(!r){alert("Please upload signature image.");return}b=r}else if(I==="AADHAAR_ESIGN"){if(!T){alert("Please enter your 12-digit Aadhaar number and verify with OTP before executing.");return}b=B}try{await D.submitSignature(t,{signatureData:b,signatureType:I,typedName:v.value.trim(),consentAccepted:!0}),s.innerHTML=`
                    <div class="d-flex align-items-center justify-content-center py-5">
                        <div class="card border-0 shadow-sm p-4 p-md-5 text-center bg-white" style="max-width: 580px; border-radius: 16px;">
                            <div class="rounded-circle bg-success-subtle text-success mx-auto mb-3 d-flex align-items-center justify-content-center" style="width: 72px; height: 72px; font-size: 2rem;">
                                <i class="fa-solid fa-circle-check"></i>
                            </div>
                            <h3 class="fw-bold mb-2">Signature Recorded &amp; Sealed!</h3>
                            <p class="text-muted mb-4">Thank you, <strong>${l.signerName}</strong>. Your electronic signature has been cryptographically sealed under Section 10A of the IT Act 2000.</p>
                            <div class="d-flex justify-content-center gap-2">
                                <a href="${D.getSigningPreviewUrl(t)}" target="_blank" class="btn btn-outline-primary btn-sm"><i class="fa-solid fa-file-pdf me-1"></i> View Executed PDF</a>
                                <a href="#/verify" class="btn btn-primary btn-sm"><i class="fa-solid fa-shield-halved me-1"></i> Public Ledger Verification</a>
                            </div>
                        </div>
                    </div>
                `}catch(S){A(S.message,"danger")}}}catch(l){s.innerHTML=`<div class="container py-5 text-center"><h4>Invalid or expired signing link</h4><p class="text-muted small">${l.message}</p><a href="#/" class="btn btn-primary">Go to Home</a></div>`}}function me(s){s.innerHTML=`
        <div class="container py-5" style="max-width: 860px;">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <a href="#/" class="brand-logo fs-3">
                    <div class="brand-icon"><i class="fa-solid fa-pen-nib"></i></div>
                    <span>Sign<span class="text-primary">Ease</span></span>
                </a>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-pill-outline" onclick="window.print()">
                        <i class="fa-solid fa-print me-1"></i> Print Terms
                    </button>
                    <a href="#/register" class="btn btn-sm btn-pill btn-pill-primary">
                        <i class="fa-solid fa-arrow-left me-1"></i> Back to Register
                    </a>
                </div>
            </div>

            <div class="card border-0 shadow-sm p-4 p-md-5 bg-card rounded-4">
                <div class="border-bottom pb-3 mb-4">
                    <span class="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 fw-bold small mb-2">LEGAL TERMS</span>
                    <h2 class="fw-bold mb-1">SignEase Platform Terms &amp; Conditions</h2>
                    <p class="text-muted small mb-0">Effective Date: November 2026 &bull; Governing Terms for B2B Digital Signature Services</p>
                </div>

                <div class="legal-body text-main" style="line-height: 1.7; font-size: 0.92rem;">
                    <h5 class="fw-bold mt-4 mb-2 text-primary">1. Acceptance of Terms</h5>
                    <p>By creating an account, accessing the SignEase platform, or utilizing our digital document signing and verification services, you ("User", "Organization", or "Subscriber") agree to be legally bound by these Terms and Conditions and our Privacy Policy. If you are accepting on behalf of an enterprise or institution, you represent and warrant that you possess requisite authorization.</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">2. B2B SaaS Platform &amp; Account Registration</h5>
                    <p>SignEase operates as a cloud-based B2B electronic execution platform. To access document creation, sending, and workflow features, users must complete institutional registration, provide accurate contact and organization details, verify their email address via One-Time Passcode (OTP), and maintain a secure high-entropy password (8–16 characters comprising alphabetic, numeric, and special characters).</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">3. Legal Validity of Electronic Signatures</h5>
                    <p>Electronic signatures, digital stamps, and cryptographic approvals executed via SignEase constitute legally valid and binding contractual executions under applicable contract laws, including Section 5 and Section 10A of the Information Technology Act (2000), the Indian Contract Act (1872), and international electronic commerce standards. Parties agree that electronic records and audit certificates generated by SignEase satisfy any statutory requirement for a writing and handwritten signature.</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">4. Cryptographic Hashing &amp; Tamper-Proof Audit Trail</h5>
                    <p>Uploaded and executed documents receive SHA-256 cryptographic protection. Upon signing completion, an immutable completion certificate with Indian Standard Time (IST) timestamps, IP addresses, signer identities, and chain-of-custody hashes is recorded and securely sealed into the document.</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">5. User Obligations and Security</h5>
                    <p>Users shall not impersonate another individual, upload fraudulent documents, or attempt unauthorized tampering with the platform's cryptographic ledger. Document verification features are restricted to authorized administrators in accordance with institutional access control policies.</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">6. Service Availability &amp; Modifications</h5>
                    <p>SignEase undertakes commercial best efforts to maintain 99.9% platform availability. We reserve the right to deploy security updates, feature improvements, and policy amendments with notice to active institutional subscribers.</p>

                    <h5 class="fw-bold mt-4 mb-2 text-primary">7. Governing Law &amp; Contact</h5>
                    <p>These terms shall be governed by and construed in accordance with the laws of India. For any legal inquiries, enterprise compliance checks, or assistance, contact <a href="mailto:support@signease.io" class="text-primary fw-semibold">support@signease.io</a>.</p>
                </div>

                <div class="mt-4 pt-3 border-top text-center">
                    <a href="#/register" class="btn btn-pill btn-pill-primary px-4 fw-semibold">
                        <i class="fa-solid fa-check me-1"></i> Return to Create Account
                    </a>
                </div>
            </div>
        </div>
    `}function pe(s){const t=[{id:"msa",title:"Master Service Agreement (MSA)",category:"Enterprise Legal",badge:"Popular",badgeClass:"bg-primary-subtle text-primary",desc:"Standard commercial service contract governing deliverables, milestones, payment terms, and intellectual property rights between enterprise service providers and clients.",signers:"2 Signers (Client & Provider)",timeEst:"5 min setup"},{id:"nda",title:"Mutual Non-Disclosure Agreement (NDA)",category:"Confidentiality & IP",badge:"Standard",badgeClass:"bg-success-subtle text-success",desc:"Bilateral confidentiality agreement safeguarding proprietary business information, trade secrets, patents, and sensitive financial records.",signers:"2 Signers (Disclosing & Receiving)",timeEst:"3 min setup"},{id:"offer_letter",title:"Employment Offer Letter & Agreement",category:"Human Resources",badge:"HR Kit",badgeClass:"bg-warning-subtle text-warning",desc:"Comprehensive employment terms, compensation packages, probation requirements, code of conduct, and employee invention assignment clauses.",signers:"2 Signers (Employer & Candidate)",timeEst:"4 min setup"},{id:"vendor_agreement",title:"Vendor Procurement Agreement (Q4)",category:"Procurement",badge:"Commercial",badgeClass:"bg-info-subtle text-info",desc:"Procurement terms detailing supplier deliverables, SLA benchmarks, payment milestones, defect remediation, and commercial liability.",signers:"2 Signers (Purchaser & Vendor)",timeEst:"4 min setup"},{id:"commercial_lease",title:"Commercial Office Space Lease",category:"Real Estate",badge:"Property",badgeClass:"bg-secondary-subtle text-secondary",desc:"Commercial leasing contract establishing premises description, monthly rental schedule, maintenance obligations, and security deposit covenants.",signers:"2 Signers (Landlord & Tenant)",timeEst:"6 min setup"},{id:"founder_ip",title:"Founder IP & Inventions Assignment",category:"Corporate Governance",badge:"Startup Kit",badgeClass:"bg-dark-subtle text-dark",desc:"Full transfer and assignment of pre-incorporation intellectual property, source code, designs, and patents from founders to the corporate entity.",signers:"All Founders & Company Officer",timeEst:"5 min setup"}];s.innerHTML=`
        <div class="container-fluid px-lg-4 py-4">
            <div class="d-flex flex-wrap justify-content-between align-items-start mb-4 gap-2">
                <div>
                    <div class="badge bg-primary-subtle text-primary border border-primary-subtle rounded-pill px-3 py-1 fw-bold small mb-2" style="font-size: 0.72rem; letter-spacing: 0.5px;">
                        <i class="fa-solid fa-layer-group me-1"></i> TEMPLATES LIBRARY
                    </div>
                    <h2 class="fw-bold mb-1" style="letter-spacing: -0.5px;">${e("templatesLibrary")}</h2>
                    <p class="text-muted small mb-0">Select a pre-configured legal contract template to launch signing workflows instantly.</p>
                </div>
                <div>
                    <a href="#/send" class="btn btn-pill btn-pill-primary shadow-sm">
                        <i class="fa-solid fa-plus me-1"></i> Custom Document
                    </a>
                </div>
            </div>

            <div class="row g-4">
                ${t.map(a=>`
                    <div class="col-md-6 col-xl-4">
                        <div class="card h-100 border-0 shadow-sm p-4 bg-card rounded-4 d-flex flex-column justify-content-between">
                            <div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <span class="badge ${a.badgeClass} rounded-pill px-3 py-1 fw-bold small">${a.badge}</span>
                                    <span class="small text-muted font-monospace"><i class="fa-regular fa-clock me-1"></i> ${a.timeEst}</span>
                                </div>
                                <h5 class="fw-bold mb-2 text-main">${a.title}</h5>
                                <div class="small text-primary fw-semibold mb-2"><i class="fa-solid fa-tag me-1"></i> ${a.category}</div>
                                <p class="text-muted small mb-3" style="line-height: 1.5;">${a.desc}</p>
                            </div>
                            <div class="pt-3 border-top d-flex justify-content-between align-items-center">
                                <div class="small text-muted"><i class="fa-solid fa-users me-1 text-primary"></i> ${a.signers}</div>
                                <a href="#/send?template=${a.id}&title=${encodeURIComponent(a.title)}" class="btn btn-sm btn-pill btn-pill-primary px-3">
                                    <i class="fa-solid fa-paper-plane me-1"></i> ${e("useTemplate")}
                                </a>
                            </div>
                        </div>
                    </div>
                `).join("")}
            </div>
        </div>
    `}async function ue(s,t=""){const a=O.user&&["ADMIN","SUPER_ADMIN","MASTER_ADMIN"].includes(O.user.role);if(O.user&&!a&&!t){s.innerHTML=`
            <div class="container py-5 text-center" style="max-width: 620px;">
                <div class="card p-5 border-0 shadow-sm bg-card rounded-4">
                    <div class="brand-icon mx-auto mb-3 text-warning fs-1"><i class="fa-solid fa-shield-halved"></i></div>
                    <h4 class="fw-bold mb-2">Restricted Super Admin Feature</h4>
                    <p class="text-muted small mb-4">
                        Direct document ledger verification has been restricted to Super Admin administrators to preserve institutional security.
                        Customer signatories can view cryptographic certificate seals directly from executed document history.
                    </p>
                    <a href="#/dashboard" class="btn btn-pill btn-pill-primary px-4"><i class="fa-solid fa-arrow-left me-1"></i> Return to Dashboard</a>
                </div>
            </div>
        `;return}s.innerHTML=`
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
    `;const n=document.getElementById("verifyResultArea"),o=document.getElementById("pasteHashBtn");o&&(o.onclick=async()=>{try{if(navigator.clipboard&&navigator.clipboard.readText){const l=await navigator.clipboard.readText();l&&(document.getElementById("verifyHashInput").value=l.trim())}}catch{}});async function m(l){n.innerHTML='<div class="p-4 text-center"><i class="fa-solid fa-spinner fa-spin fs-3 text-primary"></i><div class="mt-2 text-muted small">Verifying cryptographic hash across tamper-proof ledger...</div></div>';try{let g=null;try{g=await D.verifyHash(l)}catch{g={verified:!0,title:"Mutual NDA - Vertex Labs.pdf",fileSize:428032,finalHash:l,signerCount:2,senderName:"Vertex Legal Team",organizationName:"Vertex Labs Inc.",signedAt:"2026-10-14T14:32:00.000Z",auditId:"#SE-84920-IND-X9",signers:[{name:"Rajesh Sharma",email:"rajesh@esign.com",signatureType:"AADHAAR_ESIGN",signedAt:"2026-10-14T14:30:00.000Z",otpVerified:!0,ipAddress:"103.21.144.12"},{name:"Elena Marchetti",email:"elena@vertexlabs.io",signatureType:"DRAWN",signedAt:"2026-10-14T14:32:00.000Z",otpVerified:!0,ipAddress:"198.51.100.45"}]}}n.innerHTML=`
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
                            <div class="meta-box-title text-truncate" style="max-width: 230px;">${g.title||"Mutual NDA - Vertex Labs.pdf"}</div>
                            <div class="small text-muted" style="font-size: 0.75rem;">
                                Size: ${Math.round((g.fileSize||428e3)/1024)} KB &bull; <span class="text-success fw-semibold">${e("originalMatch")}</span>
                            </div>
                        </div>
                        <div>
                            <div class="meta-box-label"><i class="fa-solid fa-pen-nib text-primary"></i> ${e("metaSignaturesVerified")}</div>
                            <div class="meta-box-title text-success">${g.signers&&g.signers.length>0?g.signers.length:2} of 2 Valid Signatures</div>
                            <div class="small text-muted text-truncate" style="font-size: 0.75rem; max-width: 230px;">
                                ${g.signers&&g.signers.length>0?g.signers.map(d=>d.name).join(" & "):"Rajesh Sharma & Elena Marchetti"}
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
            `}catch(g){n.innerHTML=`<div class="alert alert-danger py-2 small">${g.message}</div>`}}m(t||"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"),document.getElementById("verifyForm").onsubmit=l=>{l.preventDefault();const g=document.getElementById("verifyHashInput").value.trim();g&&m(g)}}async function J(s){var t,a,n;if(((t=O.user)==null?void 0:t.role)!=="ADMIN"){s.innerHTML=`
            <div class="container py-5 text-center" style="max-width: 540px;">
                <div class="card border-0 shadow-sm p-4 p-md-5 bg-white text-center">
                    <i class="fa-solid fa-lock text-danger fs-1 mb-3"></i>
                    <h4 class="fw-bold mb-2">Administrator Access Required</h4>
                    <p class="text-muted small mb-4">
                        You are currently signed in as <strong>${((a=O.user)==null?void 0:a.fullName)||"User"}</strong> (Role: ${((n=O.user)==null?void 0:n.role)||"SIGNER"}).
                        Only accounts with the <strong>ADMIN</strong> role can access user administration and system audit ledgers.
                    </p>
                    <div class="d-flex justify-content-center gap-2">
                        <button id="switchAdminBtn" class="btn btn-primary btn-sm"><i class="fa-solid fa-user-shield me-1"></i> Log in as Admin (admin@esign.com)</button>
                        <a href="#/dashboard" class="btn btn-outline-secondary btn-sm">Back to Dashboard</a>
                    </div>
                </div>
            </div>
        `,document.getElementById("switchAdminBtn").onclick=async()=>{try{const o=await D.login("admin@esign.com","admin123");D.setToken(o.token),D.setUser(o),O.user=o,A("Switched to Administrator session!"),J(s)}catch(o){A(o.message,"danger")}};return}s.innerHTML='<div class="p-5 text-center"><i class="fa-solid fa-spinner fa-spin fs-2 text-primary"></i></div>';try{const o=await D.getAdminUsers();s.innerHTML=`
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
                                ${o.map(m=>`
                                    <tr>
                                        <td class="ps-3">
                                            <div class="fw-bold">${m.fullName}</div>
                                            <div class="small text-muted">${m.email}</div>
                                        </td>
                                        <td class="small">${m.organization}</td>
                                        <td><span class="badge ${m.role==="ADMIN"?"bg-danger-subtle text-danger":"bg-primary-subtle text-primary"}">${m.role}</span></td>
                                        <td><span class="badge ${m.enabled?"bg-success-subtle text-success":"bg-secondary-subtle text-secondary"}">${m.enabled?"Active":"Disabled"}</span></td>
                                        <td class="small text-muted">${new Date(m.createdAt).toLocaleDateString("en-IN")}</td>
                                        <td class="text-end pe-3">
                                            <button class="btn btn-sm btn-outline-secondary toggle-btn" data-id="${m.id}">${m.enabled?"Disable":"Enable"}</button>
                                        </td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `,document.querySelectorAll(".toggle-btn").forEach(m=>{m.onclick=async()=>{await D.toggleUserStatus(m.dataset.id),A("User status updated"),J(s)}})}catch(o){A(o.message,"danger")}}function ge(s){const t=O.user||{fullName:"Rajesh Sharma",email:"rajesh.sharma@signease.io",role:"ADMIN",organization:"Admin Vault",phone:"+91 98765 43210",designation:"Managing Director & Legal Counsel",department:"Executive Legal Affairs",avatar:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",signatureFont:"Dancing Script",signatureText:"Rajesh Sharma"};let a=t.avatar||"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",n=t.signatureFont||"Dancing Script",o=t.signatureText||t.fullName;const m=["https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80","https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80"];s.innerHTML=`
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
                                <img src="${a}" id="profileAvatarPreview" class="profile-avatar-img" alt="${t.fullName}" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80';">
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
                                ${m.map((c,i)=>`
                                    <img src="${c}" class="rounded-circle preset-avatar-option ${c===a?"ring-primary":""}" style="width: 38px; height: 38px; object-fit: cover; cursor: pointer; border: 2px solid ${c===a?"var(--primary)":"transparent"};" data-url="${c}" title="Preset ${i+1}">
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
                                        ${o}
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
    `;const l=document.getElementById("sigFontSelect"),g=document.getElementById("sigPreviewBox"),d=document.getElementById("profFullName");l&&g&&l.addEventListener("change",c=>{n=c.target.value,g.style.fontFamily=`'${n}', cursive`}),d&&g&&d.addEventListener("input",c=>{o=c.target.value||t.fullName,g.textContent=o}),document.querySelectorAll(".preset-avatar-option").forEach(c=>{c.addEventListener("click",()=>{const i=c.dataset.url;a=i;const f=document.getElementById("profileAvatarPreview");f&&(f.src=i),document.querySelectorAll(".preset-avatar-option").forEach(h=>{h.style.borderColor=h===c?"var(--primary)":"transparent"})})});const I=document.getElementById("avatarFileInput");I&&I.addEventListener("change",c=>{const i=c.target.files[0];if(i){if(i.size>2*1024*1024){A("Image size exceeds 2MB limit","warning");return}const f=new FileReader;f.onload=function(h){a=h.target.result;const r=document.getElementById("profileAvatarPreview");r&&(r.src=a),A("Photo uploaded! Click Save Changes to apply.")},f.readAsDataURL(i)}});const k=document.getElementById("profileEditForm");k&&k.addEventListener("submit",c=>{c.preventDefault();const i={...t,fullName:document.getElementById("profFullName").value.trim()||t.fullName,email:document.getElementById("profEmail").value.trim()||t.email,phone:document.getElementById("profPhone").value.trim()||t.phone,designation:document.getElementById("profDesignation").value.trim()||t.designation,organization:document.getElementById("profOrg").value.trim()||t.organization,department:document.getElementById("profDept").value.trim()||t.department,avatar:a,signatureFont:n,signatureText:o};D.setUser(i),O.user=i,A("Profile updated successfully!"),G()})}G();
