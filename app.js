// アカウントごとの内容は、この設定だけを変更します。
// Instagramには「公開URL/?account=アカウント名」を登録してください。
// imageには、同じサイトへアップロードした画像の相対パスを指定できます。
const pages = {
  kana: {
    pageTitle: "かな｜お知らせ",
    middleText: `ここに、あなたの想いやお知らせなどの長い文章を入れられます。

たとえば、初めて来てくれた方へのメッセージや、プロフィールだけでは伝えきれないことを自由に書いてください。ゆっくり読んで、気になったら上下の画像をタップしてね。`,
    links: [
      {
        title: "かなのプロフィールを見る",
        eyebrow: "PROFILE",
        url: "https://mfco.link/r/Yi56wEEzbCgwXtpTesKP9Cso",
        image: "",
        imageLabel: "IMAGE",
        external: true,
      },
      {
        title: "もっと近くで話してみる",
        eyebrow: "SPECIAL LINK",
        url: "https://mfco.link/r/Yi56wEEzbCgwXtpTesKP9Cso",
        image: "",
        imageLabel: "IMAGE",
        external: true,
      },
    ],
  },
  account2: {
    pageTitle: "篠原さん｜お知らせ",
    middleText: `まさかの、インスタでよく見てた渋谷のトレーナー篠原さんが素人物に出演してました💦

中身もめちゃくちゃ明るくて、一緒に筋トレするには最高のお姉さんで、いつか通いたいなと思ってたんですが。

ついつい1時間弱ある本編を見てしまったのですが、筋トレしてる女性って本当に〇欲強くて、おっおっというオホ声が、こんな声出すんだと、正直たまりませんでした。

【本編完全顔出し】
※本編はこちら👇`,
    afterText: `1本66円で過去の素人作品が
70作品以上見放題！
👇👇👇`,
    links: [
      {
        title: "渋谷のトレーナー篠原さんとデート！",
        eyebrow: "【本編完全顔出し】",
        url: "https://mfco.link/r/K8Bs6AfFyZB59EoA9iuFNTpv",
        image: "images/shinohara-feature.webp",
        video: "videos/shinohara-top.mp4",
        imageLabel: "",
        external: true,
      },
      {
        title: "渋谷のトレーナー篠原さんとデート！",
        eyebrow: "【本編完全顔出し】",
        url: "https://mfco.link/r/K8Bs6AfFyZB59EoA9iuFNTpv",
        image: "images/shinohara-bottom.jpg",
        imageLabel: "",
        external: true,
      },
    ],
    extraLink: {
      title: "70作品以上見放題！",
      eyebrow: "",
      url: "https://mfco.link/r/K8Bs6AfFyZB59EoA9iuFNTpv",
      image: "images/shinohara-gallery-new.webp",
      imageLabel: "",
      external: true,
      hideCaption: true,
    },
  },
};

const requestedAccount = new URLSearchParams(window.location.search).get("account") || "kana";
const page = pages[requestedAccount] || pages.kana;
const links = page.links;

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

function createMediaLink(item, showFallback = false) {
  const template = document.querySelector("#media-link-template");
  const fragment = template.content.cloneNode(true);
  const link = fragment.querySelector(".media-link");
  const art = fragment.querySelector(".media-link__art");
  const photo = fragment.querySelector(".media-link__photo");
  const video = fragment.querySelector(".media-link__video");
  const imageLabel = fragment.querySelector(".media-link__image-label");
  const eyebrow = fragment.querySelector(".media-link__caption-eyebrow");
  const title = fragment.querySelector(".media-link__title");
  const fallbackLink = fragment.querySelector(".plain-fallback-link");

  link.href = item.external ? getExternalBrowserUrl(item.url) : item.url;
  link.setAttribute("aria-label", `${item.title}を外部ブラウザで開く`);
  eyebrow.textContent = item.eyebrow;
  title.textContent = item.title;

  if (item.imageLabel) {
    imageLabel.textContent = item.imageLabel;
  } else {
    imageLabel.remove();
  }

  if (item.video) {
    video.src = item.video;
    if (item.image) video.poster = item.image;
    video.muted = true;
    video.defaultMuted = true;
    video.hidden = false;
    art.classList.add("has-image");
  } else if (item.image) {
    photo.src = item.image;
    photo.hidden = false;
    art.classList.add("has-image");
  }

  if (item.hideCaption) {
    link.classList.add("media-link--image-only");
  }

  if (showFallback) {
    fallbackLink.href = item.url;
    fallbackLink.setAttribute("aria-label", `${item.title}を直接開く`);
  } else {
    fallbackLink.remove();
  }

  return fragment;
}

function renderLinks() {

  links.forEach((item, index) => {
    const container = document.querySelector(index === 0 ? "#top-media-link" : "#bottom-media-link");
    // 画像リンクは外部ブラウザ用。下側だけ予備テキストで最終URLを直接開く。
    container.append(createMediaLink(item, index !== 0));
  });
}

function renderExtraContent() {
  if (page.afterText) {
    const textSection = document.querySelector("#after-text-card");
    const textElement = document.querySelector("#after-text");
    const textLines = page.afterText.split("\n");
    const arrowLine = textLines.pop();
    const arrow = document.createElement("span");
    arrow.className = "promo-text__arrow";
    arrow.textContent = arrowLine;
    textElement.textContent = `${textLines.join("\n")}\n`;
    textElement.append(arrow);
    textSection.hidden = false;
  }

  if (page.extraLink) {
    const container = document.querySelector("#extra-media-link");
    container.append(createMediaLink(page.extraLink));
    container.hidden = false;
  }

  if (page.coupon) {
    const couponPanel = document.querySelector("#coupon-panel");
    const copyButton = document.querySelector("#copy-coupon");
    const status = document.querySelector("#coupon-status");

    document.querySelector("#coupon-expiry").textContent = page.coupon.expires;
    document.querySelector("#coupon-label").textContent = page.coupon.label;
    document.querySelector("#coupon-code").textContent = page.coupon.code;
    couponPanel.hidden = false;

    copyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(page.coupon.code);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = page.coupon.code;
          textarea.setAttribute("readonly", "");
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.append(textarea);
          textarea.select();
          const copied = document.execCommand("copy");
          textarea.remove();
          if (!copied) throw new Error("コピーに失敗しました");
        }

        status.textContent = "コピーしました。";
        copyButton.classList.add("is-copied");
        window.setTimeout(() => {
          status.textContent = "";
          copyButton.classList.remove("is-copied");
        }, 2000);
      } catch {
        status.textContent = "コピーできませんでした。長押ししてコピーしてください。";
      }
    });
  }
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
    main.querySelectorAll("video").forEach((video) => video.play().catch(() => {}));
    requestAnimationFrame(() => main.classList.add("is-visible"));
    gate.classList.add("is-leaving");
    window.setTimeout(() => { gate.hidden = true; }, 270);
  });

  declineButton.addEventListener("click", () => {
    message.textContent = "18歳以上の方のみご利用いただけます。";
  });
}

document.title = page.pageTitle;
renderLinks();
document.querySelector("#middle-text").textContent = page.middleText;
renderExtraContent();
setupAgeGate();
