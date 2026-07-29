/* ============================================================
   career-services.js
   トップページ「転職支援サイト一覧」(#career-support) のデータと描画。

   ■ サービスの追加方法
     下の SERVICES 配列に1件オブジェクトを追加するだけ。
     HTMLを複製する必要はない。

   ■ 公開条件（isPublishable が全て満たされた場合のみ本番表示）
     - published: true
     - name / category / description / recommendedFor / buttonLabel が設定済み
     - affiliateUrl が http(s) の有効なURL（'#'・空・仮文字列・javascript: は不可）
     ロゴは任意。未設定の場合はサービス名テキストを意図した代替表示として使う。

   ■ 開発用テストデータ
     js/career-services.demo.js を読み込むと window.__CAREER_DEMO__ が定義され、
     「もっと見る」の動作確認用ダミーが一覧に追加される。
     index.html からは読み込まない（本番に仮データを出さないため）。
   ============================================================ */
(function () {
  'use strict';

  /* 初期表示件数。これを超える公開カードがある場合のみ展開ボタンを出す。 */
  const INITIAL_VISIBLE = 5;

  /* ------------------------------------------------------------
     サービスデータ
     ------------------------------------------------------------ */
  const SERVICES = [
    {
      name: 'ワンキャリア転職',
      category: '総合転職',
      description:
        '企業で実際に働く「中の人」の声を参考にしながら転職活動を進められるサービスです。',
      recommendedFor:
        '入社後のギャップを減らしたい方、社内の実情を知ったうえで応募先を決めたい方',
      affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B8B4S+F4RNAQ+5O7E+BY642',
      trackingPixel: 'https://www17.a8.net/0.gif?a8mat=4B8B4S+F4RNAQ+5O7E+BY642',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: true,
    },
    {
      name: 'KOSMO転職サポート',
      category: '大阪・関西エリア',
      description: '大阪での転職を対象にした転職サポートサービスです。',
      recommendedFor: '大阪・関西エリアで働き先を探している方',
      affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B8B4S+EV8PMA+59SS+BWVTE',
      trackingPixel: 'https://www17.a8.net/0.gif?a8mat=4B8B4S+EV8PMA+59SS+BWVTE',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: true,
    },
    {
      name: '職人から施工管理エージェント',
      category: '建設・施工管理',
      description:
        '職人・現場作業員からの転職を対象にした、建設分野に特化したエージェントサービスです。',
      recommendedFor: '現場作業の経験を活かして施工管理などへキャリアチェンジしたい方',
      affiliateUrl: 'https://px.a8.net/svt/ejp?a8mat=4B8B4S+EMB7JM+4PCE+TRVYQ',
      trackingPixel: 'https://www11.a8.net/0.gif?a8mat=4B8B4S+EMB7JM+4PCE+TRVYQ',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: true,
    },

    /* --- 提携申請中の枠（本番非表示） ------------------------------
       TODO: 提携承認後、正式なサービス情報・ロゴ・アフィリエイトURLへ差し替え、
             確認後に published を true にする */
    {
      name: '転職支援サービス04',
      category: '（提携申請中）',
      description: '（提携承認後にサービス概要を記載する）',
      recommendedFor: '（提携承認後に対象読者を記載する）',
      affiliateUrl: '',
      trackingPixel: '',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: false,
    },
    {
      // TODO: 提携承認後、正式なサービス情報・ロゴ・アフィリエイトURLへ差し替え、
      //       確認後に published を true にする
      name: '転職支援サービス05',
      category: '（提携申請中）',
      description: '（提携承認後にサービス概要を記載する）',
      recommendedFor: '（提携承認後に対象読者を記載する）',
      affiliateUrl: '',
      trackingPixel: '',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: false,
    },
    {
      // TODO: 提携承認後、正式なサービス情報・ロゴ・アフィリエイトURLへ差し替え、
      //       確認後に published を true にする
      name: '転職支援サービス06',
      category: '（提携申請中）',
      description: '（提携承認後にサービス概要を記載する）',
      recommendedFor: '（提携承認後に対象読者を記載する）',
      affiliateUrl: '',
      trackingPixel: '',
      logo: '',
      logoAlt: '',
      buttonLabel: '公式サイトを見る',
      pr: true,
      published: false,
    },
  ];

  /* ------------------------------------------------------------
     公開条件の判定
     ------------------------------------------------------------ */
  const PLACEHOLDER = /^[（(]?(未定|仮|TODO|placeholder|ダミー|提携申請中)/i;

  function isValidAffiliateUrl(value) {
    if (typeof value !== 'string') return false;
    const raw = value.trim();
    if (!raw || raw === '#' || PLACEHOLDER.test(raw)) return false;
    const base = typeof window !== 'undefined' ? window.location.href : 'https://example.invalid/';
    let url;
    try {
      url = new URL(raw, base);
    } catch (e) {
      return false;
    }
    return url.protocol === 'https:' || url.protocol === 'http:';
  }

  function filled(value) {
    return typeof value === 'string' && value.trim() !== '' && !PLACEHOLDER.test(value.trim());
  }

  function isPublishable(s) {
    if (!s || s.published !== true) return false;
    if (!filled(s.name) || !filled(s.category)) return false;
    if (!filled(s.description) || !filled(s.recommendedFor)) return false;
    if (!filled(s.buttonLabel)) return false;
    return isValidAffiliateUrl(s.affiliateUrl);
  }

  /* scripts/validate-site.mjs から公開条件を機械チェックできるように公開する。
     ブラウザには module が存在しないため、この行は無視される。 */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SERVICES, INITIAL_VISIBLE, isPublishable, isValidAffiliateUrl };
  }
  if (typeof document === 'undefined') return; /* Nodeから読まれた場合は描画しない */

  /* ------------------------------------------------------------
     描画
     ------------------------------------------------------------ */
  const list = document.getElementById('career-list');
  if (!list) return;

  const moreWrap = document.getElementById('career-more-wrap');
  const moreBtn = document.getElementById('career-more-btn');
  const section = document.getElementById('career-support');

  const demo = Array.isArray(window.__CAREER_DEMO__) ? window.__CAREER_DEMO__ : [];
  const items = SERVICES.concat(demo).filter(isPublishable);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function buildCard(s) {
    const li = el('li', 'career-card');

    const head = el('div', 'career-card-head');
    if (s.pr) head.appendChild(el('span', 'career-pr', 'PR'));
    head.appendChild(el('span', 'tag sm career-cat', s.category));
    li.appendChild(head);

    const main = el('div', 'career-card-main');

    const info = el('div', 'career-card-info');
    if (filled(s.logo)) {
      const logoWrap = el('div', 'career-logo');
      const img = document.createElement('img');
      img.src = s.logo;
      img.alt = filled(s.logoAlt) ? s.logoAlt : s.name;
      img.loading = 'lazy';
      img.width = 160;
      img.height = 40;
      logoWrap.appendChild(img);
      info.appendChild(logoWrap);
      /* ロゴがある場合も、サービス名は見出しとしてテキストで保持する */
    }
    info.appendChild(el('h3', 'career-name', s.name));
    info.appendChild(el('p', 'career-desc', s.description));

    const fit = el('div', 'career-fit');
    fit.appendChild(el('p', 'career-fit-label', 'こんな方に向いています'));
    fit.appendChild(el('p', 'career-fit-text', s.recommendedFor));
    info.appendChild(fit);

    if (filled(s.note)) info.appendChild(el('p', 'career-note', s.note));
    main.appendChild(info);

    const actions = el('div', 'career-actions');
    const a = el('a', 'career-btn', s.buttonLabel);
    a.href = s.affiliateUrl;
    a.target = '_blank';
    a.rel = 'nofollow sponsored noopener noreferrer';
    if (isValidAffiliateUrl(s.trackingPixel)) {
      const px = document.createElement('img');
      px.src = s.trackingPixel;
      px.width = 1;
      px.height = 1;
      px.alt = '';
      px.setAttribute('aria-hidden', 'true');
      px.style.position = 'absolute';
      a.appendChild(px);
    }
    actions.appendChild(a);
    main.appendChild(actions);

    li.appendChild(main);
    return li;
  }

  const cards = items.map(buildCard);
  const frag = document.createDocumentFragment();
  cards.forEach((card, i) => {
    if (i >= INITIAL_VISIBLE) card.classList.add('is-collapsed');
    frag.appendChild(card);
  });
  list.appendChild(frag);

  /* ------------------------------------------------------------
     もっと見る / 閉じる
     ------------------------------------------------------------ */
  if (!moreWrap || !moreBtn || cards.length <= INITIAL_VISIBLE) {
    if (moreWrap) moreWrap.hidden = true;
    return;
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  moreWrap.hidden = false;
  let expanded = false;

  moreBtn.addEventListener('click', () => {
    expanded = !expanded;
    const extra = cards.slice(INITIAL_VISIBLE);

    if (expanded) {
      extra.forEach((card, i) => {
        card.classList.remove('is-collapsed');
        if (!reduceMotion.matches) {
          card.classList.add('is-revealing');
          card.style.transitionDelay = Math.min(i, 6) * 40 + 'ms';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.remove('is-revealing'));
          });
          card.addEventListener(
            'transitionend',
            () => { card.style.transitionDelay = ''; },
            { once: true }
          );
        }
      });
      moreBtn.textContent = '閉じる';
      moreBtn.setAttribute('aria-expanded', 'true');
    } else {
      extra.forEach((card) => {
        card.classList.add('is-collapsed');
        card.classList.remove('is-revealing');
        card.style.transitionDelay = '';
      });
      moreBtn.textContent = '転職支援サイトをもっと見る';
      moreBtn.setAttribute('aria-expanded', 'false');

      /* 収納でページが縮み、セクションが画面外へ飛ぶのを防ぐ。
         セクション先頭が画面より上に行った場合だけ戻す。 */
      if (section) {
        const top = section.getBoundingClientRect().top;
        if (top < 0) {
          const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
          const dest = Math.max(0, window.scrollY + top - margin);
          window.scrollTo({
            top: dest,
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
          });
        }
      }
    }
  });
})();
