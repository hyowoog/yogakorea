const DAUM_POSTCODE_SCRIPT_URL =
  "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";

export interface DaumPostcodeData {
  zonecode: string;
  address: string;
  roadAddress: string;
  jibunAddress: string;
  userSelectedType: "R" | "J";
  bname: string;
  buildingName: string;
  apartment: "Y" | "N";
}

interface DaumPostcodeOptions {
  oncomplete: (data: DaumPostcodeData) => void;
  onclose?: (state: "FORCE_CLOSE" | "COMPLETE_CLOSE") => void;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: DaumPostcodeOptions) => { open: () => void };
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadDaumPostcode() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.daum?.Postcode) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = DAUM_POSTCODE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("다음 우편번호 스크립트를 불러오지 못했습니다."));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** 도로명 주소 선택 시 법정동·건물명을 괄호로 덧붙인 주소 */
export function formatDaumAddress(data: DaumPostcodeData) {
  if (data.userSelectedType === "J") return data.jibunAddress || data.address;

  const extras: string[] = [];
  if (data.bname && /[동로가]$/.test(data.bname)) extras.push(data.bname);
  if (data.buildingName && data.apartment === "Y") extras.push(data.buildingName);

  const base = data.roadAddress || data.address;
  return extras.length ? `${base} (${extras.join(", ")})` : base;
}

export async function openDaumPostcode(options: DaumPostcodeOptions) {
  await loadDaumPostcode();
  if (!window.daum?.Postcode) return;
  new window.daum.Postcode(options).open();
}
