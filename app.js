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
    middleText: `渋谷の某ジムのトレーナー篠原さん。

中身もめちゃくちゃ明るくて、一緒に筋トレするには最高のお姉さんです。

筋トレしてる女性って本当に〇欲強くて、おっおっというオホ声がたまらないです...

【本編完全顔出し】
※公開から限定72時間のみ割引！`,
    afterText: `1本57円で過去の素人作品が
70作品以上見放題！

さらに新規登録者限定で20%OFF
クーポン配布中！

👇`,
    links: [
      {
        title: "渋谷のトレーナー篠原さんとデート！",
        eyebrow: "【本編完全顔出し】",
        url: "https://mfco.link/r/WVep1qSfmB6YzFsFAvRmZDko",
        image: "images/shinohara-feature.webp",
        imageLabel: "",
        external: true,
      },
      {
        title: "渋谷のトレーナー篠原さんとデート！",
        eyebrow: "【本編完全顔出し】",
        url: "https://mfco.link/r/WVep1qSfmB6YzFsFAvRmZDko",
        image: "images/shinohara-bottom.jpg",
        imageLabel: "",
        external: true,
      },
    ],
    extraLink: {
      title: "70作品以上見放題！",
      eyebrow: "",
      url: "https://mfco.link/r/WVep1qSfmB6YzFsFAvRmZDko",
      image: "images/shinohara-gallery.webp",
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

  if (item.image) {
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
    document.querySelector("#after-text").textContent = page.afterText;
    textSection.hidden = false;
  }

  if (page.extraLink) {
    const container = document.querySelector("#extra-media-link");
    container.append(createMediaLink(page.extraLink));
    container.hidden = false;
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
