"use client";

import React, { useState } from "react";
import { Sparkles, X, Send, ShieldAlert, ArrowRight, Bot, ExternalLink, HelpCircle } from "lucide-react";
import { Language } from "@/lib/i18n";

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

const KNOWLEDGE_BASE: { [key: string]: { qEn: string; qHi: string; aEn: string; aHi: string } } = {
  reverse_qr: {
    qEn: "How does the 'Scan to receive money' reverse QR scam operate?",
    qHi: "रिवर्स क्यूआर 'पैसे प्राप्त करने के लिए स्कैन करें' घोटाला कैसे काम करता है?",
    aEn: "UPI is architected so that entering your UPI PIN always debits funds from your account. It is technologically impossible to receive money by scanning a QR code or entering your PIN. Scammers send a Collect Request or a static QR with amount parameter (am=5000), claiming it is a 'refund' or 'cashback'. Once the victim approves, funds are instantly transferred to the attacker's mule VPA.",
    aHi: "यूपीआई की तकनीक में यूपीआई पिन दर्ज करने पर हमेशा आपके खाते से पैसे कटते हैं। क्यूआर कोड स्कैन करके या पिन डालकर कभी भी पैसे प्राप्त नहीं किए जा सकते। धोखेबाज 'कैशबैक' या 'रिफंड' का झांसा देकर कलेक्ट रिक्वेस्ट भेजते हैं। जैसे ही पीड़ित पिन डालता है, पैसा सीधे धोखेबाज के खाते में चला जाता है।"
  },
  homograph: {
    qEn: "How does ScamShield detect homograph typosquatting (e.g. sbl vs sbi)?",
    qHi: "स्कैमशील्ड अक्षरों के छल (जैसे sbl बनाम sbi) को कैसे पहचानता है?",
    aEn: "ScamShield extracts the canonical hostname and analyzes character distances (Levenshtein Distance & visual homoglyphs like 'l' for 'i', '0' for 'o', Cyrillic/Greek lookalikes). It checks WHOIS registry age (<7 days indicates throwaway phishing infrastructure) and compares against official brand registries (e.g., onlinesbi.sbi vs sbl-kyc-update.xyz).",
    aHi: "स्कैमशील्ड होस्टनेम का विश्लेषण कर अक्षरों की समानता (जैसे 'i' की जगह 'l', 'o' की जगह '0') की जांच करता है। साथ ही डोमेन की आयु (7 दिन से नया डोमेन आमतौर पर नकली होता है) और आधिकारिक बैंक सूची से मिलान करके तुरंत अलर्ट जारी करता है।"
  },
  golden_hour: {
    qEn: "What is the 'Golden Hour' protocol for cyber financial fraud in India?",
    qHi: "भारत में वित्तीय धोखाधड़ी की स्थिति में 'गोल्डन ऑवर' प्रोटोकॉल क्या है?",
    aEn: "The first 2 hours after fraudulent fund deduction are the 'Golden Hour'. Call 1930 immediately or visit cybercrime.gov.in. The 1930 National Cybercrime Reporting Portal coordinates with bank nodal officers and NPCI to freeze the transacted money in the beneficiary's intermediate mule account before it is withdrawn from an ATM.",
    aHi: "धोखाधड़ी के तुरंत बाद के पहले 2 घंटे 'गोल्डन ऑवर' कहलाते हैं। तुरंत 1930 पर कॉल करें या cybercrime.gov.in पर शिकायत दर्ज करें। 1930 पोर्टल बैंक नोडल अधिकारियों और एनपीसीआई के साथ मिलकर पैसे को धोखेबाज द्वारा एटीएम से निकाले जाने से पहले ही फ्रीज करवा देता है।"
  },
  it_act: {
    qEn: "What are the legal penal provisions under IT Act Section 66D?",
    qHi: "आईटी एक्ट की धारा 66D के तहत कानूनी दंड क्या है?",
    aEn: "Section 66D of the Information Technology Act penalizes cheating by personation by using computer resources or communication devices. It carries rigorous imprisonment for a term which may extend to 3 years and a fine up to ₹1,00,000. Additionally, IPC/BNS sections for criminal conspiracy and fraud apply.",
    aHi: "सूचना प्रौद्योगिकी कानून (IT Act) की धारा 66D के तहत कंप्यूटर या फोन के माध्यम से किसी की पहचान चुराकर धोखाधड़ी करने पर 3 साल तक का कठोर कारावास और ₹1,00,000 तक का जुर्माना हो सकता है। साथ ही बीएनएस/आईपीसी की धोखाधड़ी की धाराएं भी लगती हैं।"
  },
  discom: {
    qEn: "Why do Electricity/Discom scams prey heavily on Hindi SMS?",
    qHi: "बिजली बिल के नाम पर होने वाले घोटाले हिंदी में संदेश क्यों भेजते हैं?",
    aEn: "Discom scams rely on high emotional arousal ('Power will be disconnected tonight at 9:30 PM'). Attackers craft messages in regional languages (Hindi देवनागरी) to establish trust and exploit domestic anxiety. The artificial deadline suppresses the victim's critical scrutiny, coercing them into paying via an unverified personal UPI handle.",
    aHi: "बिजली बिल घोटाले अत्यधिक घबराहट ('आज रात 9:30 बजे बिजली काट दी जाएगी') पर आधारित होते हैं। क्षेत्रीय भाषा (हिंदी) में संदेश भेजने से लोगों को संदेश सरकारी लगता है। समय सीमा का डर सोचने का मौका नहीं देता और लोग तुरंत निजी यूपीआई नंबर पर पैसे भेज देते हैं।"
  }
};

export default function AiAdvisorModal({ isOpen, onClose, language }: AiAdvisorModalProps) {
  const [selectedKey, setSelectedKey] = useState<string>("reverse_qr");
  const [customQuery, setCustomQuery] = useState("");
  const [customResponse, setCustomResponse] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuery.trim()) return;

    const lower = customQuery.toLowerCase();
    if (lower.includes("qr") || lower.includes("receive") || lower.includes("reverse") || lower.includes("कलेक्ट") || lower.includes("पिन")) {
      setSelectedKey("reverse_qr");
      setCustomResponse(null);
    } else if (lower.includes("sbi") || lower.includes("url") || lower.includes("link") || lower.includes("डोमेन") || lower.includes("लिंक")) {
      setSelectedKey("homograph");
      setCustomResponse(null);
    } else if (lower.includes("1930") || lower.includes("golden") || lower.includes("police") || lower.includes("हेल्पलाइन") || lower.includes("शिकायत")) {
      setSelectedKey("golden_hour");
      setCustomResponse(null);
    } else if (lower.includes("law") || lower.includes("legal") || lower.includes("66d") || lower.includes("सजा") || lower.includes("कानून")) {
      setSelectedKey("it_act");
      setCustomResponse(null);
    } else if (lower.includes("bijli") || lower.includes("bill") || lower.includes("discom") || lower.includes("बिजली") || lower.includes("बिल")) {
      setSelectedKey("discom");
      setCustomResponse(null);
    } else {
      setCustomResponse(
        language === "hi"
          ? `स्कैमशील्ड एआई विश्लेषण: '${customQuery}' के संदर्भ में, कृपया Zero-Trust सिद्धांत का पालन करें। कभी भी अज्ञात संदेशों में दिए गए लिंक पर क्लिक न करें या किसी को यूपीआई पिन न बताएं। किसी भी वित्तीय विसंगति पर तत्काल हेल्पलाइन 1930 पर संपर्क करें।`
          : `ScamShield AI Guidance: Regarding '${customQuery}', always apply Zero-Trust principles. Never click links in unsolicited communications, and remember that entering your UPI PIN always debits money. For financial incidents, contact National Helpline 1930 immediately.`
      );
    }
  };

  const activeItem = KNOWLEDGE_BASE[selectedKey];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-app-surface border border-app-border rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-app-border flex items-center justify-between bg-app-surface-subtle/50">
          <div className="flex items-center space-x-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-400 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-app-text text-sm">
                {language === "hi" ? "स्कैमशील्ड एआई साइबर सलाहकार" : "ScamShield AI Cyber Advisor"}
              </h3>
              <p className="text-[11px] text-app-muted">
                {language === "hi" ? "ज़ीरो-ट्रस्ट विश्लेषण व भारतीय साइबर सुरक्षा मार्गदर्शन" : "Zero-Trust Forensics & Indian Cyber Crime Legal Intel"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-app-muted hover:text-app-text hover:bg-app-surface transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Preset Questions Chips */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-app-muted block mb-2 font-medium">
              {language === "hi" ? "सुझाए गए विषय व प्रश्न" : "Curated Forensic Topics"}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(KNOWLEDGE_BASE).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedKey(key);
                    setCustomResponse(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-left transition ${
                    selectedKey === key && !customResponse
                      ? "bg-app-accent text-white font-medium border-app-accent shadow-sm"
                      : "bg-app-surface-subtle border-app-border text-app-secondary hover:text-app-text hover:border-app-muted"
                  }`}
                >
                  {language === "hi" ? item.qHi : item.qEn}
                </button>
              ))}
            </div>
          </div>

          {/* Active Answer Card */}
          <div className="p-5 rounded-xl border border-app-border bg-app-surface-subtle/80 space-y-3">
            <div className="flex items-center space-x-2 text-app-accent font-semibold">
              <Bot className="h-4 w-4" />
              <span>
                {customResponse
                  ? (language === "hi" ? "एआई सलाहकार का उत्तर" : "AI Advisor Response")
                  : (language === "hi" ? activeItem.qHi : activeItem.qEn)}
              </span>
            </div>
            <p className="text-app-secondary leading-relaxed text-xs">
              {customResponse || (language === "hi" ? activeItem.aHi : activeItem.aEn)}
            </p>
            <div className="pt-2 border-t border-app-border/60 flex items-center justify-between text-[11px] text-app-muted font-mono">
              <span className="flex items-center space-x-1">
                <ShieldAlert className="h-3 w-3 text-emerald-500" />
                <span>Zero-Trust Protocol Active</span>
              </span>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noreferrer"
                className="hover:text-app-text underline inline-flex items-center space-x-1"
              >
                <span>cybercrime.gov.in (1930)</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>

          {/* Ask Custom Input */}
          <form onSubmit={handleAsk} className="flex gap-2 pt-1">
            <input
              type="text"
              value={customQuery}
              onChange={(e) => setCustomQuery(e.target.value)}
              placeholder={language === "hi" ? "कोई भी सुरक्षा प्रश्न पूछें (उदा. 'रिवर्स यूपीआई घोटाला क्या है?')..." : "Ask any scam or cyber defense question (e.g., 'What is 1930 timeline?')..."}
              className="flex-1 bg-app-surface-subtle border border-app-border rounded-xl px-3.5 py-2.5 text-xs text-app-text focus:outline-none focus:border-app-accent transition"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-app-accent text-white font-medium rounded-xl hover:opacity-90 transition flex items-center space-x-1.5 shadow-sm"
            >
              <span>{language === "hi" ? "पूछें" : "Ask"}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
