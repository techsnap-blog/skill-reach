/* ============================================================
   career-services.demo.js  —  開発・テスト専用のダミーデータ
   ------------------------------------------------------------
   「もっと見る／閉じる」の動作確認のためだけに使う。
   index.html からは絶対に読み込まないこと（本番に仮データを出さないため）。
   scripts/validate-site.mjs が index.html への混入をエラー検知する。

   使い方（ローカル確認時のみ）:
     index.html の career-services.js の直前に一時的に
     <script src="js/career-services.demo.js"></script> を追加し、
     確認後に必ず削除する。
   ============================================================ */
window.__CAREER_DEMO__ = [1, 2, 3, 4, 5, 6].map((n) => ({
  name: 'テスト用ダミーサービス0' + n,
  category: 'テスト用カテゴリ',
  description:
    'これは表示検証用のダミーデータです。実在するサービスではありません。説明文の長さが異なっても崩れないことを確認するため、カードごとに文量を変えています。' +
    (n % 2 === 0 ? 'ここは長い説明文のパターンです。段落が2文以上になっても高さが固定されず、ボタンの位置が崩れないことを確認します。' : ''),
  recommendedFor: 'これは表示検証用のダミーテキストです（対象読者' + n + '）',
  affiliateUrl: 'https://example.com/dummy-' + n,
  trackingPixel: '',
  logo: '',
  logoAlt: '',
  buttonLabel: '公式サイトを見る',
  pr: true,
  published: true,
}));
