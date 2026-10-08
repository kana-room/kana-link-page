// URLはここだけ差し替えれば、各画像リンクに反映されます。
const links = [
  {
    title: "かなのプロフィールを見る",
    eyebrow: "PROFILE",
    url: "https://mfco.link/r/Yi56wEEzbCgwXtpTesKP9Cso",
    icon: "heart",
    external: true,
  },
  {
    title: "もっと近くで話してみる",
    eyebrow: "SPECIAL LINK",
    url: "https://mfco.link/r/Yi56wEEzbCgwXtpTesKP9Cso",
    icon: "heart",
    external: true,
  },
];

// 2枚の画像の間に表示する文章です。改行もそのまま表示されます。
const middleText = `ここに、あなたの想いやお知らせなどの長い文章を入れられます。

たとえば、初めて来てくれた方へのメッセージや、プロフィールだけでは伝えきれないことを自由に書いてください。ゆっくり読んで、気になったら上下の画像をタップしてね。`;

const ua = navigator.userAgent || "";
const isInstagram = /Instagram/i.test(ua);
const isIOS = /iPhone|iPad|iPod/i.test(ua);
const isAndroid = /Android/i.test(ua);

function getExternalBrowserUrl(finalUrl) {
  // 通常ブラウザでは最終URLへそのまま遷移する。
  if (!isInstagram) return finalUrl;

  // Instagram内ブラウザでは、タップ先のhrefだけを専用スキームにする。
  // locationの書き換えは行わないため、読み込み時に自動遷移しない。
  if (isIOS) {
    return `instagram://extbrowser/?url=${encodeURIComponent(finalUrl)}`;
  }

  if (isAndroid) {
    const target = new URL(finalUrl);
    const pathWithQuery = `${target.host}${target.pathname}${target.search}`;
    return `intent://${pathWithQuery}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(finalUrl)};end`;
  }

  return finalUrl;
}

function renderLinks() {
  const template = document.querySelector("#media-link-template");

  links.forEach((item, index) => {
    const fragment = template.content.cloneNode(true);
    const link = fragment.querySelector(".media-link");
    const eyebrow = fragment.querySelector(".media-link__caption-eyebrow");
    const title = fragment.querySelector(".media-link__title");
    const fallbackLink = fragment.querySelector(".plain-fallback-link");

    link.href = item.external ? getExternalBrowserUrl(item.url) : item.url;
    link.setAttribute("aria-label", `${item.title}を外部ブラウザで開く`);
    eyebrow.textContent = item.eyebrow;
    title.textContent = item.title;
    // 画像リンクは外部ブラウザ用。下側だけ予備テキストで最終URLを直接開く。
    if (index === 0) {
      fallbackLink.remove();
    } else {
      fallbackLink.href = item.url;
      fallbackLink.setAttribute("aria-label", `${item.title}を直接開く`);
    }

    const container = document.querySelector(index === 0 ? "#top-media-link" : "#bottom-media-link");
    container.append(fragment);
  });
}

function setupAgeGate() {
  const gate = document.querySelector("#age-gate");
  const main = document.querySelector("#main-content");
  const confirmButton = document.querySelector("#confirm-age");
  const declineButton = document.querySelector("#decline-age");
  const message = document.querySelector("#age-message");

  confirmButton.addEventListener("click", () => {
    main.hidden = false;
    main.setAttribute("aria-hidden", "false");
    requestAnimationFrame(() => main.classList.add("is-visible"));
    gate.classList.add("is-leaving");
    window.setTimeout(() => { gate.hidden = true; }, 270);
  });

  declineButton.addEventListener("click", () => {
    message.textContent = "18歳以上の方のみご利用いただけます。";
  });
}

renderLinks();
document.querySelector("#middle-text").textContent = middleText;
setupAgeGate();
