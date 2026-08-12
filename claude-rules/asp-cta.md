SkillReach ASPアフィリエイトCTA詳細ルール

この文書は buzzskill/CLAUDE.md 本体から「その作業時だけ必要」なASP個別スペックを一字一句そのまま移設したもの（トークン節約のため。要約・省略・改変なし）。
本体には CTA配置の原則・適合判定の要点・このファイルへのポインタだけを残している。
**CTAを差すとき／新ASPを追加するとき／適合ジャンルを判定するときは必ずこのファイルを読むこと。**
このファイルは公開ミラー（skill-reach）への同期対象外（.github/workflows/sync-public.yml で claude-rules/ を除外済み）。

■ 索引（どのASP詳細がどこにあるか）
・アフィリエイトリンクの機械的展開手順（コメント解除→リンク差し替え→計測ピクセル→rel付与）
・大原学園専門学校（AccessTrade）
・LEC東京リーガルマインド（AccessTrade）
・.aff-btn 系CSSクラスの色指定ルール
・クレアール（AccessTrade）
・資格の学校TAC（AccessTrade）
・SAT株式会社（A8.net）
・資格対策ドットコム（A8.net）
・LF/CRLF混在の一括挿入注意／LEC一括展開時の全記事基準
・アフィリエイトリンクの適合性チェック（カテゴリ判定）

---

・新しいアフィリエイトリンク（ASP提携先の講座）が決まったら、既存の
  公開済み記事・今後作成する新規記事の両方に同じ処理を機械的に適用する。
  1. 該当講座の <!-- AFFILIATE_START --> 〜 AFFILIATE_END --> コメントを
     解除する（コメントマーカー自体は削除し、中の div.affiliate-box のみ
     残す）。
  2. <a href="#"> を実際のASPリンクに置き換える。
  3. <a>タグの閉じタグ直前に計測用の1x1ピクセル画像を追加する。
     例：<img src="{ASPのrrパラメータ画像URL}" width="1" height="1"
     border="0" alt="" style="position:absolute">
     style="position:absolute" はピクセルがレイアウトに影響しないための
     ものなので必ず付ける。
  4. <a>タグに rel="nofollow noopener" と
     referrerpolicy="no-referrer-when-downgrade" を付与する。
  5. 上記1〜4を「早期CTA」「比較表後CTA」の両方に対して行う（同じリンク・
     同じ講座名ラベルを両方に使う。文言を変える必要はない）。
  6. LEC以外のASPリンクが決まった場合も同じ手順を横展開する。

・大原学園専門学校の現行アフィリエイトリンク（AccessTrade、2026-07-10提携）：
  href: https://h.accesstrade.net/sp/cc?rk=0100pqwx00ov8p
  計測ピクセル: https://h.accesstrade.net/sp/rr?rk=0100pqwx00ov8p
  ボタンclass: 必ず "aff-btn ohara"（背景 #3D5A80＝Accent Warm。LECのprimaryと
  区別するための専用クラス。css/article.css に定義済み）。
  ボックスHTML（全記事共通、このまま使う）：
    <div class="affiliate-box">
      <p class="affiliate-label">🏫 資格の大原で学ぶなら</p>
      <div class="affiliate-btns">
        <a href="https://h.accesstrade.net/sp/cc?rk=0100pqwx00ov8p" class="aff-btn ohara" target="_blank" rel="nofollow noopener" referrerpolicy="no-referrer-when-downgrade">大原学園専門学校　資料請求申込<img src="https://h.accesstrade.net/sp/rr?rk=0100pqwx00ov8p" width="1" height="1" border="0" alt="" style="position:absolute"></a>
      </div>
    </div>
  配置：LEC枠と同じ2箇所（早期CTA＋通信講座比較表後CTA）で、それぞれ
  活性LECボックスの閉じ</div>の直後に別ボックスとして置く（LECが無い記事は
  LEC枠が入るべき位置と同じ2箇所に単独で置く）。CTA位置は2箇所のまま増やさない。
  ※このプログラムは「専門学校の資料請求」であり、社会人講座の「資格の大原」とは
  別物。比較表の「資格の大原」行やコメントアウト中の「資格の大原 〇〇講座」
  ボックスをこのリンクで活性化してはならない（ラベルと遷移先が食い違うため）。
  適合ジャンル（新規記事作成時はここで自動判定して組み込む）：
  会計・簿記系／FP等の金融系／法律系（社労士・行政書士・宅建等）／公務員／
  IT・情報処理系／事務系（MOS等）。→ これらの記事には大原CTAを2箇所追加する。
  不適合（追加しない）：電気系（電験・電気工事士）／語学（TOEIC等）／
  デザイン・Web制作系（色彩検定・Webクリエイター等）。
  判定に迷う場合はユーザーに確認（LECと同じ適合性チェックプロセスを踏襲）。

・LEC東京リーガルマインドの現行アフィリエイトリンク（AccessTrade）：
  href: https://h.accesstrade.net/sp/cc?rk=01001g8n00ov8p
  計測ピクセル: https://h.accesstrade.net/sp/rr?rk=01001g8n00ov8p
  このrkパラメータは全記事のLEC枠（既存・新規とも）に共通で使用する。
  パラメータの変更が必要な場合はユーザーから都度連絡がある。

・.aff-btn 系のCSSクラス（css/article.css）は色指定が必須。新しいASP用に
  新しいクラス名（例：.aff-btn.studying）を使う場合は、既存の
  .aff-btn.amazon／.aff-btn.rakuten／.aff-btn.primary に倣って背景色・
  文字色を必ずCSSに追加すること（未定義のクラス名のまま使うと、ボタンの
  見た目にならず文字だけの表示になる不具合が過去に発生した）。
  primaryはSkillReachのブランドカラーである var(--accent)（ディープ
  ネイビー）を背景色として使う。
・LEC枠のボタンは必ず class="aff-btn primary"（ネイビー）を使う。
  amazon（オレンジ）・rakuten（赤）クラスは実際のAmazon／楽天リンク専用の
  配色であり、LECに流用しない。過去にtakken-introduction.htmlのLEC枠だけ
  aff-btn amazonのまま活性化してしまい、他記事のLECボタンと色が食い違う
  不具合が発生した（2026-07-07修正）。新しくLEC枠を有効化・追加する際は
  必ずclassが"aff-btn primary"になっているか確認すること。

・クレアールの現行アフィリエイトリンク（AccessTrade、2026-07-11提携）：
  href: https://h.accesstrade.net/sp/cc?rk=01001z0q00ov8p
  計測ピクセル: https://h.accesstrade.net/sp/rr?rk=01001z0q00ov8p
  ボタンclass: 必ず "aff-btn crail"（背景 #4472A0＝ミッドブルー。primary/ohara
  と同系統の青系だが区別がつく色。2026-07-11、当初のGold(#B08A4E)から
  ユーザー指示で変更。css/article.cssに定義済み）。
  提携ページで確認した開講講座（2026-07-11時点）：公認会計士／税理士／簿記検定／
  司法書士／公務員／社会保険労務士／行政書士／中小企業診断士／宅地建物取引士／
  ファイナンシャルプランナー／情報処理（ITパスポート・情報セキュリティマネジメント）。
  適合ジャンル（新規記事作成時はここで自動判定して組み込む）：
  会計・簿記系（簿記検定・公認会計士・税理士）／法律系（社労士・行政書士・
  司法書士・宅建士）／公務員／FP等の金融系／情報処理系（ITパスポート・
  情報セキュリティマネジメント。応用情報・支援士等の上位区分は開講講座に
  含まれないため対象外）。中小企業診断士の既存記事は本サイトにまだ無いため
  次回作成時に対象とする。
  不適合（追加しない）：電気系（電験・電気工事士）／語学（TOEIC等）／
  デザイン・Web制作系（色彩検定・Webクリエイター等）／MOS／秘書検定／医療事務
  （いずれも開講講座リストに含まれないため）。
  配置：LEC・大原と同じ2箇所（早期CTA＋通信講座比較表後CTA）で、それぞれ
  大原ボックスの閉じ</div>の直後に別ボックスとして置く（大原が無い記事は
  大原枠が入るべき位置と同じ2箇所に単独で置く）。CTA位置は2箇所のまま増やさない。
  ラベル文言は「📘 クレアール 〇〇講座をチェックする」（他ASPの命名パターンに
  倣う）。既存記事の比較表コメントアウト内に「📘 クレアール 〇〇講座を
  チェックする」のプレースホルダーがあった場合、活性化後は重複するため
  コメントブロックごと削除する（2026-07-11 boki2.html・fp3-introduction.html
  で実施）。
  2026-07-11、以下8記事に適用済み：boki2.html／fp2-introduction.html／
  fp3-introduction.html／gyoseishoshi-introduction.html／
  information-security-management.html／itpassport-introduction.html／
  sharoushi-introduction.html／takken-introduction.html。

・資格の学校TACの現行アフィリエイトリンク（AccessTrade、2026-07-22提携）：
  href: https://h.accesstrade.net/sp/cc?rk=01006bci00ov8p
  計測ピクセル: https://h.accesstrade.net/sp/rr?rk=01006bci00ov8p
  ボタンclass: 必ず "aff-btn tac"（背景 #6E7F8D＝グレイッシュブルー。既存の
  primary/ohara/crailが濃いネイビー〜ミッドブルーで見分けにくくなるため、
  彩度を落とした青灰でトーンを分けた。css/article.cssに定義済み）。
  ラベル文言は「📕 資格の学校TAC 〇〇講座をチェックする」（他ASPは📘、
  大原は🏫。絵文字でASPを見分けられるようにする）。
  ボックスHTML（〇〇には記事の資格名＋「講座」を入れる）：
    <div class="affiliate-box">
      <p class="affiliate-label">📕 資格の学校TAC 〇〇講座をチェックする</p>
      <div class="affiliate-btns">
        <a href="https://h.accesstrade.net/sp/cc?rk=01006bci00ov8p" class="aff-btn tac" target="_blank" rel="nofollow noopener" referrerpolicy="no-referrer-when-downgrade">公式サイトで詳細を見る<img src="https://h.accesstrade.net/sp/rr?rk=01006bci00ov8p" width="1" height="1" border="0" alt="" style="position:absolute"></a>
      </div>
    </div>
  配置：LEC・大原・クレアールと同じ2箇所（早期CTA＋通信講座比較表後CTA）で、
  その記事で稼働している最後のアフィリエイトボックスの閉じ</div>の直後に
  別ボックスとして置く（他社枠が無い記事は規定の2箇所に単独で置く）。
  CTA位置は2箇所のまま増やさない。
  TAC公式サイトで確認した開講講座（2026-07-22時点）：公認会計士／税理士／
  簿記検定／司法書士／行政書士／弁理士／社会保険労務士／宅地建物取引士／
  マンション管理士・管理業務主任者／賃貸不動産経営管理士／不動産鑑定士／
  中小企業診断士／公務員／FP／情報処理（ITパスポート・情報セキュリティ
  マネジメント・基本情報・応用情報・高度試験・情報処理安全確保支援士）／
  ビジネス実務法務検定／ビジネス会計検定試験®（2026-07-26に公式サイトで
  個人向け対策講座の提供を確認し追記）／知的財産管理技能検定／電験三種・電験二種／
  電気工事士（第一種・第二種）／消防設備士／TOEIC® L&R TEST／
  パソコンスクール（MOS）。
  ＝これまでのASPの中で最も対象範囲が広い（電気系・語学・MOSも対象になる点が
  LEC・大原・クレアールと異なるので、それらの不適合リストを流用しないこと）。
  不適合（開講講座に無いため追加しない）：CAD利用技術者／土地家屋調査士／
  秘書検定／医療事務／薬局事務／介護福祉士／社会福祉士／ケアマネジャー／
  福祉住環境コーディネーター／海事代理士／色彩検定／Webクリエイター・
  Webデザイン技能・Photoshop/Illustratorクリエイター能力認定等のデザイン系。
  2026-07-22、以下24記事に適用済み：benrishi／bijihou／boki2／chizai-3／cpa／
  denken3／denkikoji2／fp2／fp3／gyoseishoshi／information-security-management／
  itpassport／mansion-kanrishi／mos／ouyoujouhou／real-estate-appraiser／
  registered-information-security-specialist／sharoushi／shihoshoshi／shindanshi／
  shoubou-setsubishi／takken／toeic／zeirishi。
  この際、denken3・ouyoujouhou・registered-information-security-specialist に
  残っていたコメントアウト中の「📘 TAC 〇〇講座をチェックする」プレースホルダーは
  稼働ボックスと重複するためコメントブロックごと削除した（クレアール時と同じ扱い）。
  なお比較表（おすすめ通信講座の比較）へのTAC行の追加は、価格・給付制度等の
  検証できない数値が必要になるため今回は行っていない。行追加が必要な場合は
  公式サイトで数値を確認してから別作業として行う。

・SAT株式会社の現行アフィリエイトリンク（A8.net、2026-07-29提携）：
  href: https://px.a8.net/svt/ejp?a8mat=4B880W+53DJ3M+5TRO+5YRHE
  計測ピクセル: https://www18.a8.net/0.gif?a8mat=4B880W+53DJ3M+5TRO+5YRHE
  ボタンclass: 必ず "aff-btn sat"（背景 #3F6F63＝ディープグリーン。既存の
  primary/ohara/crail/tacが青系のため、現場・技術系ASPとして色相で分けた。
  css/article.cssに定義済み）。ラベル文言は「📗 SAT 〇〇講座をチェックする」
  （LEC・クレアールは📘、大原は🏫、TACは📕）。
  ボックスHTML（〇〇には記事の資格名＋「講座」を入れる）：
    <div class="affiliate-box">
      <p class="affiliate-label">📗 SAT 〇〇講座をチェックする</p>
      <div class="affiliate-btns">
        <a href="https://px.a8.net/svt/ejp?a8mat=4B880W+53DJ3M+5TRO+5YRHE" class="aff-btn sat" target="_blank" rel="nofollow noopener" referrerpolicy="no-referrer-when-downgrade">公式サイトで詳細を見る<img src="https://www18.a8.net/0.gif?a8mat=4B880W+53DJ3M+5TRO+5YRHE" width="1" height="1" border="0" alt="" style="position:absolute"></a>
      </div>
    </div>
  配置：他ASPと同じ2箇所（早期CTA＋通信講座比較表後CTA）で、その記事で稼働している
  最後のアフィリエイトボックスの閉じ</div>の直後に別ボックスとして置く。
  CTA位置は2箇所のまま増やさない。
  公式サイト（www.sat-co.info）で確認した開講講座（2026-07-29時点）：
  設備系（建築物環境衛生管理技術者／危険物取扱者／消防設備士／給水装置工事主任技術者／
  2級ボイラー技士／第三種冷凍機械責任者／エネルギー管理士）／施工管理系（技術士／
  建築・土木・管工事・電気工事・電気通信工事の各施工管理技士）／電気系（電験三種・
  電験二種／第一種・第二種電気工事士／第1級陸上特殊無線技士／工事担任者）／
  職場環境系（衛生管理者／公害防止管理者／QC検定／毒物劇物取扱者）／
  介護系（介護福祉士国家試験／特定技能1号介護分野）／特別教育・技能講習50種以上
  （アーク溶接等特別教育／フルハーネス／足場／粉じん／酸欠／玉掛け特別教育／
  フォークリフト運転特別教育 等）。
  ＝現場系・技術系に特化しており、法律・会計・公務員系は扱わない（LEC・大原・
  クレアール・TACの適合リストを流用しないこと）。
  不適合（追加しない）：法律系／会計・簿記系／FP等の金融系／公務員／情報処理系
  （ITパスポート等。SATの「技術者スターター講座」はIT国家資格の受験対策ではない）／
  語学／デザイン・Web制作系／秘書検定／医療事務・薬局事務／社会福祉士・
  ケアマネジャー・福祉住環境コーディネーター／土地家屋調査士／CAD／海事代理士。
  【重要】SATの安全衛生系ラインナップは特別教育・安全衛生教育であり、
  技能講習（フォークリフト運転技能講習・玉掛け技能講習等、最大荷重／つり上げ荷重
  1トン以上を対象とするもの）ではない。技能講習の記事にSAT枠を置くと、記事本文の
  制度説明と遷移先が食い違うため追加しない（2026-07-29、
  forklift-ginou-koshu.html・tamakake-ginou-koshu.html を除外と判定。特に
  tamakake は本文に「オンラインで受講できる玉掛け講習は特別教育の学科部分である
  場合がある」という注意喚起があり、CTAを置くと記事が自己矛盾する）。
  2026-07-29、以下5記事に適用済み：arc-welding-tokubetsu-kyoiku／denken3-introduction／
  denkikoji2-introduction／shoubou-setsubishi-introduction／kaigo-fukushishi-introduction。
  この際、denken3・denkikoji2 に残っていたコメントアウト中の「📘 SAT 〇〇講座を
  チェックする」プレースホルダーは稼働ボックスと重複するためコメントブロックごと
  削除した（クレアール・TAC時と同じ扱い）。
  なお比較表へのSAT行の追加は、価格・給付制度等の検証できない数値が必要になるため
  行っていない。

・資格対策ドットコムの現行アフィリエイトリンク（A8.net、2026-07-29提携）：
  href: https://px.a8.net/svt/ejp?a8mat=4B880W+4DRW36+3L4C+5YJRM
  計測ピクセル: https://www14.a8.net/0.gif?a8mat=4B880W+4DRW36+3L4C+5YJRM
  ボタンclass: 必ず "aff-btn shikakutaisaku"（背景 #5B5A80＝ミュートインディゴ。
  既存の青系4社・SATの緑と見分けるため紫寄りにした。css/article.cssに定義済み）。
  ラベル文言は「📙 資格対策ドットコム 〇〇講座をチェックする」（LEC・クレアールは📘、
  大原は🏫、TACは📕、SATは📗）。記事によって既存ラベルが「— 詳細はこちら」形式の
  場合（takken等）は、その記事の他社ボックスの言い回しに合わせる。
  ボックスHTML（〇〇には記事の資格名＋「講座」を入れる）：
    <div class="affiliate-box">
      <p class="affiliate-label">📙 資格対策ドットコム 〇〇講座をチェックする</p>
      <div class="affiliate-btns">
        <a href="https://px.a8.net/svt/ejp?a8mat=4B880W+4DRW36+3L4C+5YJRM" class="aff-btn shikakutaisaku" target="_blank" rel="nofollow noopener" referrerpolicy="no-referrer-when-downgrade">公式サイトで詳細を見る<img src="https://www14.a8.net/0.gif?a8mat=4B880W+4DRW36+3L4C+5YJRM" width="1" height="1" border="0" alt="" style="position:absolute"></a>
      </div>
    </div>
  配置：他ASPと同じ2箇所（早期CTA＋通信講座比較表後CTA）で、その記事で稼働している
  最後のアフィリエイトボックスの閉じ</div>の直後に別ボックスとして置く。
  CTA位置は2箇所のまま増やさない。
  運営：株式会社アーティスソリューションズ。金融・ビジネス系のeラーニングに特化。
  公式（artis-sol.co.jp のサービス紹介）で確認した開講講座（2026-07-29時点）：
  証券外務員（各種）／内部管理責任者／FP（1級・2級・3級・CFP®・AFP認定研修）／
  資産形成コンサルタント／プライベートバンカー／宅建／日商簿記3級／ITパスポート／
  生成AIパスポート／G検定／乙種第4類危険物取扱者／TOEIC® L&R TEST（470・650・730）／
  日本語能力試験（N1〜N5）。
  適合ジャンル：FP等の金融系／宅建／ITパスポート／TOEIC／日本語能力試験。
  不適合（開講講座に無いため追加しない）：法律系（社労士・行政書士・司法書士・弁理士等）／
  会計系（公認会計士・税理士）／公務員／情報処理系のITパスポート以外の区分（基本情報・
  応用情報・支援士・情報セキュリティマネジメント）／電気系／消防設備士／
  特別教育・技能講習等の現場系／医療事務・薬局事務／福祉介護系／
  デザイン・Web制作系／MOS／秘書検定。
  【重要】級（グレード）まで一致しているかを必ず確認する。簿記は3級のみの開講であり、
  簿記2級の記事（boki2.html）に置くと講座の級と記事の級が食い違うため追加しない
  （2026-07-29判定）。FPは1〜3級すべて開講しているため fp2・fp3 とも対象。
  2026-07-29、以下5記事に適用済み：fp2-introduction／fp3-introduction／
  takken-introduction／itpassport-introduction／toeic。
  なお比較表への行追加は、価格・給付制度等の検証できない数値が必要になるため
  行っていない。

・記事HTMLはファイルによってLF・CRLFが混在している。複数記事へ一括で
  HTMLブロックを挿入するスクリプトを書く場合は、読み込み時にLFへ正規化し、
  書き戻す前に元の改行コードへ戻すこと（2026-07-22 TAC一括追加時に、
  改行コードを考慮しない正規表現がCRLFの記事だけマッチせず0件挿入になった）。

・LECリンクを一括展開する際は「grep -rl "LEC" articles/*.html」等で
  既存記事を洗い出すだけでは不十分。比較表にそもそもLECの行が無い記事
  （通信講座比較表にLECが登場しない記事）が存在するため、対象は
  「全記事」を基準にする。LEC行・LEC枠が無い記事を見つけた場合は、
  下記「■ アフィリエイトリンクの適合性チェック（カテゴリ判定）」に従って
  LECがそのジャンルに合うかを先に判定してから追加するか判断する
  （2026-07-06〜07 sharoushi-introduction.html・boki2.htmlの抜け漏れ追加時と、
  shikisai-kentei.html・webcreator-certification.htmlの除外判断を踏まえて
  明記。「必ず全記事にLECを追加する」という運用は誤りだったため撤回する）。

■ アフィリエイトリンクの適合性チェック（カテゴリ判定）（2026-07-07 追加）
・新しいASPリンク（提携講座）が決まった際・新規記事を作成する際は、
  その講座の実際の事業ジャンルと記事の資格ジャンルが合っているかを
  必ず先に判定してから、比較表への行追加・affiliate-boxの設置を行う。
  ジャンルが合わない可能性がある場合、事実確認できない情報を記事に
  書かない（CLAUDE.md冒頭の「推測・思い込みで記載しない」原則の適用）。
・LEC東京リーガルマインドが実際にカバーするジャンルの目安：
  法律系（宅建士・行政書士・社労士等）、会計・簿記系、公務員試験、
  情報処理・IT系国家資格（ITパスポート・基本情報・応用情報・
  情報処理安全確保支援士・情報セキュリティマネジメント等）、
  FP等の金融系。→ これらのジャンルの記事にはLECを追加してよい。
・LECが提供している確証が薄いジャンルの例：色彩検定・Webクリエイター
  能力認定試験のような、デザイン・Web制作・美容系などの民間資格。
  これらの記事の比較表には、実際にその分野で講座を展開している
  他社（ユーキャン・ヒューマンアカデミー・デジハリONLINE等）のみを
  掲載し、LECは追加しない。
・クレアールが実際にカバーするジャンル（提携ページの開講講座一覧で確認済み）：
  会計・簿記系（公認会計士・税理士・簿記検定）、法律系（司法書士・行政書士・
  社会保険労務士・宅建士）、公務員試験、中小企業診断士、FP等の金融系、
  情報処理系のうちITパスポート・情報セキュリティマネジメントのみ
  （基本情報・応用情報・情報処理安全確保支援士は開講講座に含まれないため
  対象外＝LECより情報処理系の対象範囲が狭い点に注意）。
  → これらのジャンルの記事にはクレアールを追加してよい。
  電気系・語学系・デザインWeb制作系・MOS・秘書検定・医療事務には追加しない。
・資格の学校TACが実際にカバーするジャンル（公式サイトの講座一覧で確認済み・
  2026-07-22）：会計系（公認会計士・税理士・簿記）、法律系（司法書士・行政書士・
  弁理士・社労士・宅建士）、不動産系（マンション管理士・管理業務主任者・
  賃貸不動産経営管理士・不動産鑑定士）、中小企業診断士、公務員、FP、
  情報処理系（ITパスポート〜高度試験・支援士まで全区分）、ビジネス実務法務検定、
  知的財産管理技能検定、電気系（電験三種・二種／第一種・第二種電気工事士）、
  消防設備士、語学（TOEIC® L&R TEST）、パソコンスクール（MOS）。
  → これらのジャンルの記事にはTACを追加してよい。
  土地家屋調査士・CAD・秘書検定・医療事務/薬局事務・福祉介護系
  （介護福祉士／社会福祉士／ケアマネジャー／福祉住環境コーディネーター）・
  海事代理士・色彩検定・デザイン/Web制作系には追加しない。
・判定に迷う場合（ジャンルが法律・会計・IT系に近いが確証が持てない場合）
  は、追加せずユーザーに確認を取ってから進める。
・判定の結果、その記事に貼れる適切なアフィリエイトリンクが無いと
  判断した場合は、黙ってスキップせず、必ずチャット上で
  「（記事名）は現時点で適切なアフィリエイトリンクがありませんでした」
  等、対象記事名とその理由（ジャンルの不一致）を明示してユーザーに
  アナウンスする。これは既存記事へのリンク一括展開時・新規記事作成時
  （skillreach-articleスキル実行時）の両方で行う。
・今後LEC以外のASP提携が増えた場合も、同じ「事業ジャンル×記事ジャンルの
  適合判定 → 合わなければ追加せずアナウンス」というプロセスを踏襲する。
