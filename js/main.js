/* ============================================================
   SkillReach — main.js  v1.0
   Pinned Hero + Scroll Overlay via GSAP ScrollTrigger + Lenis
   ============================================================ */
(function () {
  'use strict';

  /* ------ Mobile menu ------ */
  const toggle    = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  function setMenu(open) {
    if (!toggle || !mobileNav) return;
    mobileNav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      setMenu(!mobileNav.classList.contains('open'));
    });
    /* メニュー内のリンクを選んだら閉じる（ページ内リンク・別ページ遷移とも） */
    mobileNav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    /* キーボード操作: Escapeで閉じ、フォーカスをボタンへ戻す */
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    /* 画面回転・リサイズでPC幅に戻ったら開いた状態を解除する */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) setMenu(false);
    });
  }

  /* ------ 「カテゴリ」リンク: ボタンが画面中央に来るよう滑らかにスクロール ------
     html{scroll-behavior:auto}（Lenisとの競合回避のため）なので、
     通常のアンカージャンプは一瞬で上端に飛んでしまう。ここだけは
     window.scrollTo({behavior:'smooth'})で明示的に滑らかに動かし、
     かつtopではなくセクションの中央が画面中央に来る位置を計算する。 */
  /* Lenis使用時はネイティブのsmooth scroll（window.scrollTo/scrollIntoView）が
     Lenisの内部スクロール制御と競合して途中で止まることがあるため、
     プログラムからのスクロールは必ずこのヘルパーを通す。
     （lenisはinitScrollAnimations内で初期化時に代入される） */
  let lenis = null;
  function smoothScrollTo(top) {
    const dest = Math.max(0, top);
    if (lenis) {
      lenis.scrollTo(dest, { duration: 1.1 });
    } else {
      window.scrollTo({ top: dest, behavior: 'smooth' });
    }
  }
  function smoothScrollToCenter(target) {
    const rect = target.getBoundingClientRect();
    const destination = window.scrollY + rect.top + rect.height / 2 - window.innerHeight / 2;
    smoothScrollTo(destination);
  }
  /* 記事一覧(#reviews)の先頭へスクロールする。CSSのscroll-margin-top
     （固定ヘッダー＋stickyカテゴリバー分の余白）を尊重して着地させる。 */
  function scrollToListTop() {
    const reviews = document.getElementById('reviews');
    if (!reviews) return;
    const margin = parseFloat(getComputedStyle(reviews).scrollMarginTop) || 0;
    smoothScrollTo(window.scrollY + reviews.getBoundingClientRect().top - margin);
  }
  /* 「資格カテゴリ」リンクはスクロールに加えて、押すたびに選択カテゴリを
     1つ右へ進める（すべて→…→民間資格→すべて とループ）。
     advanceCategory は後方のCategory filterセクションで定義（巻き上げで参照可）。 */
  document.querySelectorAll('a[href="#categories"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setMenu(false);
      advanceCategory();
      const target = document.getElementById('categories');
      if (!target) return;
      /* ボタン列がすでに画面内に見えているときはスクロールしない。
         （「記事一覧」→「資格カテゴリ」と連続で押すと、中央寄せスクロールで
         画面が上へ戻り表示が下にずれて見える問題の対策。見えていない
         位置から押したときだけ従来どおり中央へスクロールする。） */
      /* 絞り込みでページの高さが変わった直後はレイアウトとスクロール位置が
         安定していないため、1フレーム待ってから位置を測ってスクロールする。 */
      requestAnimationFrame(() => {
        /* .categoriesはposition:sticky(top:60px)。
           - 張り付き状態（rect.top<=61 ＝ 一覧の途中〜ランキング・フッター付近）
             で押された場合は、絞り込みでページの高さが大きく変わって表示が
             ずれるため、「記事一覧」リンクと同じ一覧先頭へ滑らかに戻して
             絞り込み結果を見せる。
           - 自然位置で見えている場合（一覧先頭にいるとき）はスクロールしない。
           - 見えていない場合（ヒーロー上部など）は従来どおり中央へスクロール。 */
        const rect = target.getBoundingClientRect();
        if (rect.top <= 61) {
          scrollToListTop();
        } else {
          const inView = rect.top >= 55 && rect.bottom <= window.innerHeight;
          if (!inView) smoothScrollToCenter(target);
        }
      });
    });
  });

  /* 「記事一覧」リンク: 記事一覧へ滑らかにスクロールしつつ、
     カード全体をstaggerフェードで出し直す（カテゴリ切替と同じ演出）。 */
  document.querySelectorAll('a[href="#reviews"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setMenu(false);
      updateArticleVisibility({ forceReveal: true, animate: true, animateAll: true });
      scrollToListTop();
    });
  });
  document.querySelectorAll('a[href="#ranking"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      setMenu(false);
      const target = document.getElementById('ranking');
      if (target) smoothScrollToCenter(target);
    });
  });

  /* ------ Header frosted on scroll ------ */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ------ Heroタイトルを確実に隠す ------
     GSAPのscrubフェードだけでは「opacityが0になりきらず薄く残る」
     ケースがあったため、一定スクロール後はvisibility:hiddenで
     完全に非表示にする（CSS側のtransitionで滑らかさは維持）。 */
  const heroTextEl = document.querySelector('.hero-text-overlay');
  if (heroTextEl) {
    const onHeroScroll = () => heroTextEl.classList.toggle('is-hidden', window.scrollY > 260);
    window.addEventListener('scroll', onHeroScroll, { passive: true });
    onHeroScroll();
  }

  /* ------ 記事の表示件数制限（カテゴリごとに最大15件 + もっと見る） ------ */
  const MAX_VISIBLE_ARTICLES = 15;
  const allCards = Array.from(document.querySelectorAll('.article-card'));
  const showMoreBtn = document.getElementById('show-more-btn');
  let currentCat = 'all';
  let articlesExpanded = false;
  let searchQuery = '';

  function cardMatchesSearch(card) {
    if (!searchQuery) return true;
    if (!card.dataset.searchText) {
      card.dataset.searchText = card.textContent.toLowerCase();
    }
    return card.dataset.searchText.includes(searchQuery);
  }

  function updateArticleVisibility(opts) {
    const forceReveal = !!(opts && opts.forceReveal);
    /* animate: 表示カードを opacity+translateY のstaggerフェードで
       入場させる（Blueprint許可Motionの範囲内）。
       animateAll: カテゴリ切替・「記事一覧」リンクなど一覧全体を出し直す
       場合true。falseなら今回の更新で新たに現れたカードだけフェードさせる
       （「もっと見る」・検索で既表示カードが再フェードして
       チラつくのを避けるため）。 */
    const animate = !!(opts && opts.animate);
    const animateAll = !!(opts && opts.animateAll);
    const prevVisible = animate
      ? new Set(allCards.filter(c => c.style.display !== 'none' && !c.classList.contains('more-hidden')))
      : null;
    let animIdx = 0;
    /* カテゴリと検索キーワードの両方を満たす記事だけを表示する。
       検索中は15件制限のみ無視して該当記事を全件表示する。 */
    const matches = allCards.filter(card =>
      (currentCat === 'all' || card.dataset.cat === currentCat) && cardMatchesSearch(card)
    );
    const limitActive = !searchQuery;

    allCards.forEach(card => {
      const isMatch = matches.includes(card);
      card.style.display = isMatch ? '' : 'none';
    });

    matches.forEach((card, i) => {
      const hidden = limitActive && !articlesExpanded && i >= MAX_VISIBLE_ARTICLES;
      card.classList.toggle('more-hidden', hidden);
      if (hidden) return;
      if (forceReveal) {
        /* ユーザー操作（カテゴリ切替・もっと見る）で表示されたカードは、
           GSAPのScrollTrigger（画面内に入ったらフェードイン）が
           display:noneだった間のズレで反応しないことがあるため、
           （既にvisibleクラスが付いていてもGSAPが後からopacity:0を
           inline上書きしている場合があるので）毎回強制的に表示する。
           GSAPのトゥイーンが同時に進行中だと毎フレームinline styleを
           上書きして競合するため、先に該当カードのトゥイーンを止める。 */
        if (window.gsap) gsap.killTweensOf(card);
        card.classList.add('visible');
        if (animate && (animateAll || !prevVisible.has(card))) {
          /* いったん透明＋14px下に置いてから、カード順に少しずつ遅らせて
             フェードイン。reflow（offsetWidth参照）で初期状態を確定させ、
             transition終了後はinlineのtransitionを消して他の演出と干渉
             しないようにする。 */
          card.style.transition = 'none';
          card.style.opacity = '0';
          card.style.transform = 'translateY(14px)';
          void card.offsetWidth;
          const delay = (animIdx * 0.06) + 's';
          animIdx += 1;
          card.style.transition = 'opacity 0.5s ease ' + delay + ', transform 0.5s ease ' + delay;
          card.style.opacity = '1';
          card.style.transform = 'translateY(0px)';
          card.addEventListener('transitionend', function clearTransition() {
            card.style.transition = '';
            card.removeEventListener('transitionend', clearTransition);
          });
        } else {
          card.style.transition = '';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0px)';
        }
      } else if (!card.classList.contains('visible')) {
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });

    if (showMoreBtn) {
      showMoreBtn.style.display = (limitActive && !articlesExpanded && matches.length > MAX_VISIBLE_ARTICLES) ? '' : 'none';
    }

    if (forceReveal && window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
  }
  updateArticleVisibility();

  if (showMoreBtn) {
    showMoreBtn.addEventListener('click', () => {
      articlesExpanded = true;
      updateArticleVisibility({ forceReveal: true, animate: true });
    });
  }

  /* ------ Category filter ------ */
  const catBtns = document.querySelectorAll('.cat-btn');
  catBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      catBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCat = btn.dataset.cat;
      articlesExpanded = false;  /* カテゴリ切替時は毎回15件制限から再スタート */
      /* 検索キーワードが残ったままだと「カテゴリ×検索」のAND条件で
         該当0件になり、ボタンが反応していないように見えるため、
         カテゴリ切替時は検索をクリアしてそのカテゴリ全体を表示する */
      searchQuery = '';
      const searchInputEl = document.getElementById('site-search');
      if (searchInputEl) searchInputEl.value = '';
      updateArticleVisibility({ forceReveal: true, animate: true, animateAll: true });
    });
  });

  /* ヘッダー「資格カテゴリ」用: 現在activeなボタンの右隣を選択する。
     一番右の次は先頭（すべて）に戻る。ボタンのclick()を呼ぶことで
     絞り込み・active切替・検索クリアの既存処理をそのまま再利用する。 */
  function advanceCategory() {
    const btns = Array.from(catBtns);
    if (!btns.length) return;
    const current = btns.findIndex(b => b.classList.contains('active'));
    btns[(current + 1) % btns.length].click();
  }

  /* ------ サイト内キーワード検索 ------ */
  const searchInput = document.getElementById('site-search');
  if (searchInput) {
    let searchDebounce;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        searchQuery = searchInput.value.trim().toLowerCase();
        articlesExpanded = false;
        updateArticleVisibility({ forceReveal: true, animate: true });
      }, 120);
    });
    searchInput.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      scrollToListTop();
    });
  }

  /* ------ 記事カード全体をクリック可能にする（画像タップでも遷移） ------ */
  allCards.forEach(card => {
    const link = card.querySelector('h3 a');
    if (!link) return;
    card.addEventListener('click', (e) => {
      if (e.target.closest('a')) return; /* タイトルリンク自身のクリックはそのまま任せる */
      window.location.href = link.href;
    });
  });

  /* ------ IntersectionObserver fallback for cards ------ */
  function initCardFadeIn() {
    const cards = document.querySelectorAll('.article-card');
    if (!cards.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(cards).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), (idx % 3) * 90);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    cards.forEach(c => io.observe(c));
  }

  /* ------ Main GSAP init ------ */
  function initScrollAnimations() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      initCardFadeIn();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    /* === Lenis ===（インスタンスは外側スコープのlenisに保持） */
    if (typeof Lenis !== 'undefined') {
      lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(time => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    /* ===================================================
       HERO BACKGROUND — image fades/scales as content rises
       .heroはCSSでposition:fixedの常時背景。GSAPのpin/pin-spacer
       方式は「pin解除後に一緒にスクロールし始める」不具合が
       再発したため廃止。スクロール量に応じた数値演出のみ行う。
       =================================================== */
    const heroImg   = document.querySelector('.hero-image-wrap');
    const heroText  = document.querySelector('.hero-text-overlay');
    const heroHint  = document.querySelector('.hero-scroll-hint');
    const contentSec = document.querySelector('.content-section');

    /* Hero画像: スクロール0〜900pxでごく静かに変化
       scale: 1→0.985 / opacity: 1→0.92 / blur: 0→2px */
    if (heroImg) {
      gsap.to(heroImg, {
        scale: 0.985,
        opacity: 0.92,
        filter: 'blur(2px)',
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=900',
          scrub: 2.0,          /* 非常に滑らかに */
        }
      });
    }

    /* Hero タイトルのopacityフェードはCSS(.hero-text-overlay.is-hidden)＋
       スクロールリスナー側で確実に処理するため、GSAPでの重複制御は行わない。 */

    /* Scrollヒント: スクロール開始直後に消える */
    if (heroHint) {
      gsap.to(heroHint, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: '+=200',
          scrub: 0.5,
        }
      });
    }

    /* -------------------------------------------------------
       Story Transition: Article SurfaceがHeroの上に重なる
       - content-section: position:relative, margin-top:100vh
       - Heroはfixedで常時背景に残るため、Surfaceを通常フローの
         位置からずらすアニメーションは付けない。
         （Y方向にずらすとHero(100vh固定)とSurfaceの間に隙間が
          できてbody地の背景色が露出するため、JSでの位置移動は禁止。
          静かな没入感はopacityのみで表現する。）
       ------------------------------------------------------- */
    if (contentSec) {
      gsap.fromTo(contentSec,
        { opacity: 0.92 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: '+=200',
            end: '+=900',
            scrub: 2.2,
          }
        }
      );
    }

    /* === Article cards stagger === */
    const cards = gsap.utils.toArray('.article-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0,
          duration: 0.65, ease: 'power2.out',
          delay: (i % 3) * 0.08,
          scrollTrigger: {
            trigger: card,
            start: 'top 91%',
            toggleActions: 'play none none none',
            once: true,
          },
          onStart: () => card.classList.add('visible'),
        }
      );
    });

    /* === Section titles === */
    gsap.utils.toArray('.section-title').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    /* === Ranking items === */
    gsap.utils.toArray('.rank-item').forEach((item, i) => {
      gsap.fromTo(item,
        { opacity: 0, x: -18 },
        {
          opacity: 1, x: 0, duration: 0.5, ease: 'power2.out',
          delay: i * 0.07,
          scrollTrigger: { trigger: item, start: 'top 90%', once: true }
        }
      );
    });
  }

  /* ------ Init ------ */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.addEventListener('load', initScrollAnimations);
    });
  } else {
    window.addEventListener('load', initScrollAnimations);
  }

})();
