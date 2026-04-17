/** @jsxImportSource @cutout/jsx */

const MANY_ROW_COUNT = 10000;
const rows = Array.from({ length: MANY_ROW_COUNT }, (_, i) => ({
  id: `row-${i}`,
  className: i % 2 === 0 ? "even" : "odd",
  content: `Row #${i}`,
}));

export const manyRows = () => (
  <div>
    {rows.map((row) => (
      <div key={row.id} id={row.id} className={row.className}>
        {row.content}
      </div>
    ))}
  </div>
);

export const wikipediaHomePage = () => (
  <>
    <head>
      <meta charSet="utf-8" />
      <title>Wikipedia</title>
      <meta
        name="description"
        content="Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation."
      />
      <meta name="viewport" content="initial-scale=1,user-scalable=yes" />
      <link rel="apple-touch-icon" href="/static/apple-touch/wikipedia.png" />
      <link rel="shortcut icon" href="/static/favicon/wikipedia.ico" />
      <link rel="license" href="//creativecommons.org/licenses/by-sa/4.0/" />
      <link rel="preconnect" href="//upload.wikimedia.org" />
      <link rel="me" href="https://wikis.world/@wikipedia" />
      <meta property="og:url" content="" />
      <meta property="og:title" content="Wikipedia, the free encyclopedia" />
      <meta property="og:type" content="website" />
      <meta
        property="og:description"
        content="Wikipedia is a free online encyclopedia, created and edited by volunteers around the world and hosted by the Wikimedia Foundation."
      />
      <meta
        property="og:image"
        content="https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Wikipedia-logo-v2.svg/2244px-Wikipedia-logo-v2.svg.png"
      />
    </head>
    <body id="www-wikipedia-org">
      <main>
        <div className="central-textlogo">
          <img
            className="central-featured-logo"
            src="portal/wikipedia.org/assets/img/Wikipedia-logo-v2.png"
            srcSet="portal/wikipedia.org/assets/img/Wikipedia-logo-v2@1.5x.png 1.5x, portal/wikipedia.org/assets/img/Wikipedia-logo-v2@2x.png 2x"
            width="200"
            height="183"
            alt=""
          />
          <h1 className="central-textlogo-wrapper">
            <span className="central-textlogo__image sprite svg-Wikipedia_wordmark">
              Wikipedia
            </span>
            <strong
              className="jsl10n localized-slogan"
              data-jsl10n="portal.slogan"
            >
              The Free Encyclopedia
            </strong>
          </h1>
        </div>
        <div className="central-textlogo wikipedia25-videologo">
          <video
            id="wikipedia25-video"
            className="wikipedia25-video"
            data-idle-light="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-idle-light.webm"
            data-idle-dark="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-idle-dark.webm"
            data-click-light="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-click-light.webm"
            data-click-dark="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-click-dark.webm"
            data-poster-light="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-poster-light.webp"
            data-poster-dark="portal/wikipedia.org/assets/img/wikipedia25-synthesizer-poster-dark.webp"
            width="200"
            height="200"
            autoPlay
            loop
            muted
            playsInline
          >
          </video>
          <button
            id="wikipedia25-play-button"
            className="cdx-button cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-medium cdx-button--icon-only cdx-button--framed jsl10n wikipedia25-play-button"
            type="button"
            data-jsl10n="portal.wikipedia25.play-button-text"
            aria-label="Play"
          >
            <span className="cdx-icon cdx-icon--small">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <g>
                  <path d="M4.55 19A1 1 0 013 18.13V1.87A1 1 0 014.55 1l12.2 8.13a1 1 0 010 1.7z" />
                </g>
              </svg>
            </span>
          </button>
          <h1 className="central-textlogo-wrapper">
            <span className="central-textlogo__image sprite svg-Wikipedia_wordmark">
              Wikipedia
            </span>
            <strong
              className="jsl10n wikipedia25-slogan"
              data-jsl10n="portal.wikipedia25.slogan"
            >
              25 years of the free encyclopedia
            </strong>
          </h1>
        </div>
        <nav
          data-jsl10n="top-ten-nav-label"
          aria-label="Top languages"
          className="central-featured"
          data-el-section="primary links"
        >
          <div className="central-featured-lang lang1" lang="en" dir="ltr">
            <a
              id="js-link-box-en"
              href="//en.wikipedia.org/"
              title="English — Wikipedia — The Free Encyclopedia"
              className="link-box"
              data-slogan="The Free Encyclopedia"
            >
              <strong>English</strong>
              <small>
                7,141,000+
                <span>articles</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang2" lang="ja" dir="ltr">
            <a
              id="js-link-box-ja"
              href="//ja.wikipedia.org/"
              title="Nihongo — ウィキペディア — フリー百科事典"
              className="link-box"
              data-slogan="フリー百科事典"
            >
              <strong>日本語</strong>
              <small>
                1,491,000+
                <span>記事</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang3" lang="de" dir="ltr">
            <a
              id="js-link-box-de"
              href="//de.wikipedia.org/"
              title="Deutsch — Wikipedia — Die freie Enzyklopädie"
              className="link-box"
              data-slogan="Die freie Enzyklopädie"
            >
              <strong>Deutsch</strong>
              <small>
                3.099.000+
                <span>Artikel</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang4" lang="ru" dir="ltr">
            <a
              id="js-link-box-ru"
              href="//ru.wikipedia.org/"
              title="Russkiy — Википедия — Свободная энциклопедия"
              className="link-box"
              data-slogan="Свободная энциклопедия"
            >
              <strong>Русский</strong>
              <small>
                2 087 000+
                <span>статей</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang5" lang="fr" dir="ltr">
            <a
              id="js-link-box-fr"
              href="//fr.wikipedia.org/"
              title="Français — Wikipédia — L’encyclopédie libre"
              className="link-box"
              data-slogan="L’encyclopédie libre"
            >
              <strong>Français</strong>
              <small>
                2 740 000+
                <span>articles</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang6" lang="es" dir="ltr">
            <a
              id="js-link-box-es"
              href="//es.wikipedia.org/"
              title="Español — Wikipedia — La enciclopedia libre"
              className="link-box"
              data-slogan="La enciclopedia libre"
            >
              <strong>Español</strong>
              <small>
                2.095.000+
                <span>artículos</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang7" lang="it" dir="ltr">
            <a
              id="js-link-box-it"
              href="//it.wikipedia.org/"
              title="Italiano — Wikipedia — L&#x27;enciclopedia libera"
              className="link-box"
              data-slogan="L&#x27;enciclopedia libera"
            >
              <strong>Italiano</strong>
              <small>
                1.957.000+
                <span>voci</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang8" lang="zh" dir="ltr">
            <a
              id="js-link-box-zh"
              href="//zh.wikipedia.org/"
              title="Zhōngwén — 维基百科 / 維基百科 — 自由的百科全书 / 自由的百科全書"
              className="link-box localize-variant"
              data-slogan="自由的百科全书 / 自由的百科全書"
            >
              <strong>中文</strong>
              <small>
                1,524,000+
                <span>条目 / 條目</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang9" lang="pt" dir="ltr">
            <a
              id="js-link-box-pt"
              href="//pt.wikipedia.org/"
              title="Português — Wikipédia — A Enciclopédia Livre"
              className="link-box"
              data-slogan="A Enciclopédia Livre"
            >
              <strong>Português</strong>
              <small>
                1.165.000+
                <span>artigos</span>
              </small>
            </a>
          </div>
          <div className="central-featured-lang lang10" lang="pl" dir="ltr">
            <a
              id="js-link-box-pl"
              href="//pl.wikipedia.org/"
              title="Polski — Wikipedia — Wolna encyklopedia"
              className="link-box"
              data-slogan="Wolna encyklopedia"
            >
              <strong>Polski</strong>
              <small>
                1 685 000+
                <span>haseł</span>
              </small>
            </a>
          </div>
        </nav>
        <div className="wikipedia25-cta-container">
          <button
            type="button"
            id="wikipedia25-cta-button"
            className="cdx-button cdx-button--action-default cdx-button--weight-primary cdx-button--size-large cdx-button--framed cdx-dialog__footer__primary-action jsl10n"
            data-jsl10n="portal.wikipedia25.launch-cta-text"
          >
            Unlock birthday surprises on Wikipedia
          </button>
          <div
            className="wikipedia25-cta-description jsl10n"
            data-jsl10n="portal.wikipedia25.launch-cta-description"
          >
            Learn how to turn on Birthday mode so you and Baby Globe can explore
            Wikipedia together!
          </div>
        </div>
        <div className="wikipedia25-modal-container">
          <div
            id="wikipedia25-dialog-backdrop"
            className="cdx-dialog-backdrop hidden"
          >
            <div tabIndex={0} className="wikipedia25-dialog-focus-trap-start">
            </div>
            <div
              id="wikipedia25-dialog"
              className="cdx-dialog cdx-dialog--vertical-actions"
              role="dialog"
              aria-labelledby="wikipedia25-modal-title"
              aria-modal="true"
            >
              <header className="cdx-dialog__header cdx-dialog__header--default">
                <div className="cdx-dialog__header__title-group">
                  <h2
                    id="wikipedia25-modal-title"
                    className="cdx-dialog__header__title jsl10n"
                    data-jsl10n="portal.wikipedia25.launch-modal.title"
                  >
                    Unlock birthday surprises on Wikipedia
                  </h2>
                </div>
                <button
                  id="wikipedia25-dialog-close-button"
                  className="cdx-button cdx-button--action-default cdx-button--weight-quiet cdx-button--size-medium cdx-button--icon-only cdx-dialog__header__close-button jsl10n"
                  type="button"
                  data-jsl10n="portal.wikipedia25.launch-modal.close-button-text"
                  aria-label="Close"
                >
                  <span className="cdx-icon cdx-icon--medium">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <g>
                        <path d="m4.34 2.93 12.73 12.73-1.41 1.41L2.93 4.35z" />
                        <path d="M17.07 4.34 4.34 17.07l-1.41-1.41L15.66 2.93z" />
                      </g>
                    </svg>
                  </span>
                </button>
              </header>
              <div className="cdx-dialog-focus-trap" tabIndex={-1}></div>
              <div
                className="cdx-dialog__body cdx-scrollable-container jsl10n"
                data-jsl10n="portal.wikipedia25.launch-modal.text"
              >
                Learn how to turn on Birthday mode so you and Baby Globe can
                explore Wikipedia together!
              </div>
              <footer className="cdx-dialog__footer cdx-dialog__footer--default">
                <div className="cdx-dialog__footer__actions">
                  <button
                    type="button"
                    id="wikipedia25-dialog-primary-button"
                    className="cdx-button cdx-button--action-progressive cdx-button--weight-primary cdx-button--size-medium cdx-button--framed cdx-dialog__footer__primary-action jsl10n"
                    data-jsl10n="portal.wikipedia25.launch-modal.primary-button-text"
                  >
                    Learn more
                  </button>
                </div>
              </footer>
            </div>
            <div tabIndex={0} className="wikipedia25-dialog-focus-trap-end">
            </div>
          </div>
        </div>
        <div role="search" className="search-container">
          <form
            className="pure-form"
            id="search-form"
            action="//www.wikipedia.org/search-redirect.php"
            data-el-section="search"
          >
            <fieldset>
              <input type="hidden" name="family" value="wikipedia" />
              <div className="search-input" id="search-input">
                <label
                  htmlFor="searchInput"
                  className="screen-reader-text"
                  data-jsl10n="portal.search-input-label"
                >
                  Search Wikipedia
                </label>
                <input
                  id="searchInput"
                  name="search"
                  type="search"
                  size={20}
                  autoFocus
                  accessKey="F"
                  dir="auto"
                  autoComplete="off"
                />
                <div className="styled-select no-js">
                  <div className="hide-arrow">
                    <select
                      id="searchLanguage"
                      name="language"
                      defaultValue="en"
                    >
                      <option value="af" lang="af">Afrikaans</option>
                      <option value="sq" lang="sq">Shqip</option>
                      <option value="ar" lang="ar">العربية</option>
                      <option value="ast" lang="ast">Asturianu</option>
                      <option value="az" lang="az">Azərbaycanca</option>
                      <option value="bg" lang="bg">Български</option>
                      <option value="nan" lang="nan">
                        閩南語 / Bân-lâm-gú
                      </option>
                      <option value="bn" lang="bn">বাংলা</option>
                      <option value="be" lang="be">Беларуская</option>
                      <option value="ca" lang="ca">Català</option>
                      <option value="cs" lang="cs">Čeština</option>
                      <option value="cy" lang="cy">Cymraeg</option>
                      <option value="da" lang="da">Dansk</option>
                      <option value="de" lang="de">Deutsch</option>
                      <option value="et" lang="et">Eesti</option>
                      <option value="el" lang="el">Ελληνικά</option>
                      <option value="en" lang="en">
                        English
                      </option>
                      <option value="es" lang="es">Español</option>
                      <option value="eo" lang="eo">Esperanto</option>
                      <option value="eu" lang="eu">Euskara</option>
                      <option value="fa" lang="fa">فارسی</option>
                      <option value="fr" lang="fr">Français</option>
                      <option value="gl" lang="gl">Galego</option>
                      <option value="ko" lang="ko">한국어</option>
                      <option value="hy" lang="hy">Հայերեն</option>
                      <option value="hi" lang="hi">हिन्दी</option>
                      <option value="hr" lang="hr">Hrvatski</option>
                      <option value="id" lang="id">Bahasa Indonesia</option>
                      <option value="it" lang="it">Italiano</option>
                      <option value="he" lang="he">עברית</option>
                      <option value="ka" lang="ka">ქართული</option>
                      <option value="lld" lang="lld">Ladin</option>
                      <option value="la" lang="la">Latina</option>
                      <option value="lv" lang="lv">Latviešu</option>
                      <option value="lt" lang="lt">Lietuvių</option>
                      <option value="hu" lang="hu">Magyar</option>
                      <option value="mk" lang="mk">Македонски</option>
                      <option value="mg" lang="mg">Malagasy</option>
                      <option value="mr" lang="mr">मराठी</option>
                      <option value="arz" lang="arz">مصرى</option>
                      <option value="ms" lang="ms">Bahasa Melayu</option>
                      <option value="min" lang="min">Bahaso Minangkabau</option>
                      <option value="my" lang="my">မြန်မာဘာသာ</option>
                      <option value="nl" lang="nl">Nederlands</option>
                      <option value="ja" lang="ja">日本語</option>
                      <option value="no" lang="nb">Norsk (bokmål)</option>
                      <option value="nn" lang="nn">Norsk (nynorsk)</option>
                      <option value="ce" lang="ce">Нохчийн</option>
                      <option value="uz" lang="uz">Oʻzbekcha / Ўзбекча</option>
                      <option value="pl" lang="pl">Polski</option>
                      <option value="pt" lang="pt">Português</option>
                      <option value="kk" lang="kk">
                        Қазақша / Qazaqşa / قازاقشا
                      </option>
                      <option value="ro" lang="ro">Română</option>
                      <option value="simple" lang="en">Simple English</option>
                      <option value="ceb" lang="ceb">
                        Sinugboanong Binisaya
                      </option>
                      <option value="sk" lang="sk">Slovenčina</option>
                      <option value="sl" lang="sl">Slovenščina</option>
                      <option value="sr" lang="sr">Српски / Srpski</option>
                      <option value="sh" lang="sh">
                        Srpskohrvatski / Српскохрватски
                      </option>
                      <option value="fi" lang="fi">Suomi</option>
                      <option value="sv" lang="sv">Svenska</option>
                      <option value="sw" lang="sw">Kiswahili</option>
                      <option value="ta" lang="ta">தமிழ்</option>
                      <option value="tt" lang="tt">Татарча / Tatarça</option>
                      <option value="te" lang="te">తెలుగు</option>
                      <option value="th" lang="th">ภาษาไทย</option>
                      <option value="tg" lang="tg">Тоҷикӣ</option>
                      <option value="azb" lang="azb">تۆرکجه</option>
                      <option value="tr" lang="tr">Türkçe</option>
                      <option value="uk" lang="uk">Українська</option>
                      <option value="ur" lang="ur">اردو</option>
                      <option value="vi" lang="vi">Tiếng Việt</option>
                      <option value="war" lang="war">Winaray</option>
                      <option value="zh" lang="zh">中文</option>
                      <option value="ru" lang="ru">Русский</option>
                      <option value="yue" lang="yue">粵語</option>
                    </select>
                    <div className="styled-select-active-helper"></div>
                  </div>
                  <i className="sprite svg-arrow-down"></i>
                </div>
              </div>
              <button
                className="pure-button pure-button-primary-progressive"
                type="submit"
              >
                <i
                  className="sprite svg-search-icon"
                  data-jsl10n="search-input-button"
                >
                  Search
                </i>
              </button>
              <input type="hidden" value="Go" name="go" />
            </fieldset>
          </form>
        </div>
        <nav data-jsl10n="all-languages-nav-label" aria-label="All languages">
          <div className="lang-list-button-wrapper">
            <button
              type="button"
              id="js-lang-list-button"
              aria-expanded="false"
              aria-controls="js-lang-lists"
              className="lang-list-button"
            >
              <i className="sprite svg-language-icon"></i>
              <span
                className="lang-list-button-text jsl10n"
                data-jsl10n="portal.language-button-text"
              >
                Read Wikipedia in your language
              </span>
              <i className="sprite svg-arrow-down-blue"></i>
            </button>
          </div>
          <div className="lang-list-border"></div>
          <div className="lang-list-container">
            <div id="js-lang-lists" className="lang-list-content">
              <h2 className="bookshelf-container">
                <span className="bookshelf">
                  <span className="text">
                    <bdi dir="ltr">
                      1,000,000+
                    </bdi>
                    <span className="jsl10n" data-jsl10n="entries">
                      articles
                    </span>
                  </span>
                </span>
              </h2>
              <div
                className="langlist langlist-large hlist"
                data-el-section="secondary links"
              >
                <ul>
                  <li>
                    <a
                      href="//ar.wikipedia.org/"
                      lang="ar"
                      title="Al-ʿArabīyah"
                    >
                      <bdi dir="rtl">العربية</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//de.wikipedia.org/" lang="de">Deutsch</a>
                  </li>
                  <li>
                    <a href="//en.wikipedia.org/" lang="en" title="English">
                      English
                    </a>
                  </li>
                  <li>
                    <a href="//es.wikipedia.org/" lang="es" title="Español">
                      Español
                    </a>
                  </li>
                  <li>
                    <a href="//fa.wikipedia.org/" lang="fa" title="Fārsi">
                      <bdi dir="rtl">فارسی</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//fr.wikipedia.org/" lang="fr">Français</a>
                  </li>
                  <li>
                    <a href="//it.wikipedia.org/" lang="it">Italiano</a>
                  </li>
                  <li>
                    <a href="//arz.wikipedia.org/" lang="arz" title="Maṣrī">
                      <bdi dir="rtl">مصرى</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//nl.wikipedia.org/" lang="nl">Nederlands</a>
                  </li>
                  <li>
                    <a href="//ja.wikipedia.org/" lang="ja" title="Nihongo">
                      日本語
                    </a>
                  </li>
                  <li>
                    <a href="//pl.wikipedia.org/" lang="pl">Polski</a>
                  </li>
                  <li>
                    <a href="//pt.wikipedia.org/" lang="pt">Português</a>
                  </li>
                  <li>
                    <a href="//ceb.wikipedia.org/" lang="ceb">
                      Sinugboanong Binisaya
                    </a>
                  </li>
                  <li>
                    <a href="//sv.wikipedia.org/" lang="sv">Svenska</a>
                  </li>
                  <li>
                    <a href="//uk.wikipedia.org/" lang="uk" title="Ukrayins’ka">
                      Українська
                    </a>
                  </li>
                  <li>
                    <a href="//vi.wikipedia.org/" lang="vi">Tiếng Việt</a>
                  </li>
                  <li>
                    <a href="//war.wikipedia.org/" lang="war">Winaray</a>
                  </li>
                  <li>
                    <a href="//zh.wikipedia.org/" lang="zh" title="Zhōngwén">
                      中文
                    </a>
                  </li>
                  <li>
                    <a href="//ru.wikipedia.org/" lang="ru" title="Russkiy">
                      Русский
                    </a>
                  </li>
                </ul>
              </div>
              <h2 className="bookshelf-container">
                <span className="bookshelf">
                  <span className="text">
                    <bdi dir="ltr">
                      100,000+
                    </bdi>
                    <span className="jsl10n" data-jsl10n="portal.entries">
                      articles
                    </span>
                  </span>
                </span>
              </h2>
              <div
                className="langlist langlist-large hlist"
                data-el-section="secondary links"
              >
                <ul>
                  <li>
                    <a href="//af.wikipedia.org/" lang="af">Afrikaans</a>
                  </li>
                  <li>
                    <a href="//sq.wikipedia.org/" lang="sq" title="Anglisht">
                      Shqip
                    </a>
                  </li>
                  <li>
                    <a href="//ast.wikipedia.org/" lang="ast">Asturianu</a>
                  </li>
                  <li>
                    <a href="//az.wikipedia.org/" lang="az">Azərbaycanca</a>
                  </li>
                  <li>
                    <a href="//bg.wikipedia.org/" lang="bg" title="Bǎlgarski">
                      Български
                    </a>
                  </li>
                  <li>
                    <a
                      href="//zh-min-nan.wikipedia.org/"
                      lang="nan"
                      title="Bân-lâm-gú"
                    >
                      閩南語 / Bân-lâm-gú
                    </a>
                  </li>
                  <li>
                    <a href="//bn.wikipedia.org/" lang="bn" title="Bangla">
                      বাংলা
                    </a>
                  </li>
                  <li>
                    <a href="//be.wikipedia.org/" lang="be" title="Belaruskaya">
                      Беларуская
                    </a>
                  </li>
                  <li>
                    <a href="//ca.wikipedia.org/" lang="ca">Català</a>
                  </li>
                  <li>
                    <a href="//cs.wikipedia.org/" lang="cs">Čeština</a>
                  </li>
                  <li>
                    <a href="//cy.wikipedia.org/" lang="cy">Cymraeg</a>
                  </li>
                  <li>
                    <a href="//da.wikipedia.org/" lang="da">Dansk</a>
                  </li>
                  <li>
                    <a href="//et.wikipedia.org/" lang="et">Eesti</a>
                  </li>
                  <li>
                    <a href="//el.wikipedia.org/" lang="el" title="Ellīniká">
                      Ελληνικά
                    </a>
                  </li>
                  <li>
                    <a href="//eo.wikipedia.org/" lang="eo">Esperanto</a>
                  </li>
                  <li>
                    <a href="//eu.wikipedia.org/" lang="eu">Euskara</a>
                  </li>
                  <li>
                    <a href="//gl.wikipedia.org/" lang="gl" title="Galego">
                      Galego
                    </a>
                  </li>
                  <li>
                    <a href="//ko.wikipedia.org/" lang="ko" title="Hangugeo">
                      한국어
                    </a>
                  </li>
                  <li>
                    <a href="//hy.wikipedia.org/" lang="hy" title="Hayeren">
                      Հայերեն
                    </a>
                  </li>
                  <li>
                    <a href="//hi.wikipedia.org/" lang="hi" title="Hindī">
                      हिन्दी
                    </a>
                  </li>
                  <li>
                    <a href="//hr.wikipedia.org/" lang="hr">Hrvatski</a>
                  </li>
                  <li>
                    <a
                      href="//id.wikipedia.org/"
                      lang="id"
                      title="Bahasa Inggris"
                    >
                      Bahasa Indonesia
                    </a>
                  </li>
                  <li>
                    <a href="//he.wikipedia.org/" lang="he" title="Ivrit">
                      <bdi dir="rtl">עברית</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//ka.wikipedia.org/" lang="ka" title="Kartuli">
                      ქართული
                    </a>
                  </li>
                  <li>
                    <a href="//lld.wikipedia.org/" lang="lld">Ladin</a>
                  </li>
                  <li>
                    <a href="//la.wikipedia.org/" lang="la">Latina</a>
                  </li>
                  <li>
                    <a href="//lv.wikipedia.org/" lang="lv">Latviešu</a>
                  </li>
                  <li>
                    <a href="//lt.wikipedia.org/" lang="lt">Lietuvių</a>
                  </li>
                  <li>
                    <a href="//hu.wikipedia.org/" lang="hu">Magyar</a>
                  </li>
                  <li>
                    <a href="//mk.wikipedia.org/" lang="mk" title="Makedonski">
                      Македонски
                    </a>
                  </li>
                  <li>
                    <a href="//mg.wikipedia.org/" lang="mg">Malagasy</a>
                  </li>
                  <li>
                    <a href="//mr.wikipedia.org/" lang="mr" title="Marathi">
                      मराठी
                    </a>
                  </li>
                  <li>
                    <a
                      href="//ms.wikipedia.org/"
                      lang="ms"
                      title="Bahasa Melayu"
                    >
                      Bahasa Melayu
                    </a>
                  </li>
                  <li>
                    <a href="//min.wikipedia.org/" lang="min">
                      Bahaso Minangkabau
                    </a>
                  </li>
                  <li>
                    <a href="//my.wikipedia.org/" lang="my" title="Myanmarsar">
                      မြန်မာဘာသာ
                    </a>
                  </li>
                  <li lang="no">
                    Norsk
                    <ul>
                      <li>
                        <a href="//no.wikipedia.org/" lang="nb">bokmål</a>
                      </li>
                      <li>
                        <a href="//nn.wikipedia.org/" lang="nn">nynorsk</a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <a href="//ce.wikipedia.org/" lang="ce" title="Noxçiyn">
                      Нохчийн
                    </a>
                  </li>
                  <li>
                    <a href="//uz.wikipedia.org/" lang="uz">
                      Oʻzbekcha / Ўзбекча
                    </a>
                  </li>
                  <li>
                    <a href="//kk.wikipedia.org/" lang="kk">
                      <span lang="kk-Cyrl">Қазақша</span>
                      /
                      <span lang="kk-Latn">Qazaqşa</span>
                      /
                      <bdi lang="kk-Arab" dir="rtl">قازاقشا</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//ro.wikipedia.org/" lang="ro">Română</a>
                  </li>
                  <li>
                    <a href="//simple.wikipedia.org/" lang="en">
                      Simple English
                    </a>
                  </li>
                  <li>
                    <a href="//sk.wikipedia.org/" lang="sk">Slovenčina</a>
                  </li>
                  <li>
                    <a href="//sl.wikipedia.org/" lang="sl" title="Slovenščina">
                      Slovenščina
                    </a>
                  </li>
                  <li>
                    <a href="//sr.wikipedia.org/" lang="sr">Српски / Srpski</a>
                  </li>
                  <li>
                    <a href="//sh.wikipedia.org/" lang="sh">
                      Srpskohrvatski / Српскохрватски
                    </a>
                  </li>
                  <li>
                    <a href="//fi.wikipedia.org/" lang="fi">Suomi</a>
                  </li>
                  <li>
                    <a href="//sw.wikipedia.org/" lang="sw">Kiswahili</a>
                  </li>
                  <li>
                    <a href="//ta.wikipedia.org/" lang="ta" title="Tamiḻ">
                      தமிழ்
                    </a>
                  </li>
                  <li>
                    <a href="//tt.wikipedia.org/" lang="tt">
                      Татарча / Tatarça
                    </a>
                  </li>
                  <li>
                    <a href="//te.wikipedia.org/" lang="te" title="Telugu">
                      తెలుగు
                    </a>
                  </li>
                  <li>
                    <a href="//th.wikipedia.org/" lang="th" title="Phasa Thai">
                      ภาษาไทย
                    </a>
                  </li>
                  <li>
                    <a href="//tg.wikipedia.org/" lang="tg" title="Tojikī">
                      Тоҷикӣ
                    </a>
                  </li>
                  <li>
                    <a href="//azb.wikipedia.org/" lang="azb" title="Türkce">
                      <bdi dir="rtl">تۆرکجه</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//tr.wikipedia.org/" lang="tr" title="Türkçe">
                      Türkçe
                    </a>
                  </li>
                  <li>
                    <a href="//ur.wikipedia.org/" lang="ur" title="Urdu">
                      <bdi dir="rtl">اردو</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//zh-yue.wikipedia.org/" lang="yue">粵語</a>
                  </li>
                </ul>
              </div>
              <h2 className="bookshelf-container">
                <span className="bookshelf">
                  <span className="text">
                    <bdi dir="ltr">
                      10,000+
                    </bdi>
                    <span className="jsl10n" data-jsl10n="portal.entries">
                      articles
                    </span>
                  </span>
                </span>
              </h2>
              <div className="langlist hlist" data-el-section="secondary links">
                <ul>
                  <li>
                    <a href="//ace.wikipedia.org/" lang="ace">Bahsa Acèh</a>
                  </li>
                  <li>
                    <a href="//als.wikipedia.org/" lang="gsw">Alemannisch</a>
                  </li>
                  <li>
                    <a href="//am.wikipedia.org/" lang="am" title="Āmariññā">
                      አማርኛ
                    </a>
                  </li>
                  <li>
                    <a href="//an.wikipedia.org/" lang="an">Aragonés</a>
                  </li>
                  <li>
                    <a
                      href="//hyw.wikipedia.org/"
                      lang="hyw"
                      title="Arevmdahayeren"
                    >
                      Արեւմտահայերէն
                    </a>
                  </li>
                  <li>
                    <a href="//gor.wikipedia.org/" lang="gor">
                      Bahasa Hulontalo
                    </a>
                  </li>
                  <li>
                    <a href="//ban.wikipedia.org/" lang="ban" title="Basa Bali">
                      Basa Bali
                    </a>
                  </li>
                  <li>
                    <a href="//bjn.wikipedia.org/" lang="bjn">Bahasa Banjar</a>
                  </li>
                  <li>
                    <a href="//map-bms.wikipedia.org/" lang="map-x-bms">
                      Basa Banyumasan
                    </a>
                  </li>
                  <li>
                    <a href="//ba.wikipedia.org/" lang="ba" title="Başqortsa">
                      Башҡортса
                    </a>
                  </li>
                  <li>
                    <a
                      href="//be-tarask.wikipedia.org/"
                      lang="be-tarask"
                      title="Bielaruskaja (taraškievica)"
                    >
                      Беларуская (тарашкевіца)
                    </a>
                  </li>
                  <li>
                    <a href="//bcl.wikipedia.org/" lang="bcl">Bikol Central</a>
                  </li>
                  <li>
                    <a
                      href="//bpy.wikipedia.org/"
                      lang="bpy"
                      title="Bishnupriya Manipuri"
                    >
                      বিষ্ণুপ্রিয়া মণিপুরী
                    </a>
                  </li>
                  <li>
                    <a href="//bar.wikipedia.org/" lang="bar">Boarisch</a>
                  </li>
                  <li>
                    <a href="//bs.wikipedia.org/" lang="bs">Bosanski</a>
                  </li>
                  <li>
                    <a href="//br.wikipedia.org/" lang="br">Brezhoneg</a>
                  </li>
                  <li>
                    <a href="//cv.wikipedia.org/" lang="cv" title="Čăvašla">
                      Чӑвашла
                    </a>
                  </li>
                  <li>
                    <a href="//dag.wikipedia.org/" lang="dag">Dagbanli</a>
                  </li>
                  <li>
                    <a href="//ary.wikipedia.org/" lang="ary" title="Darija">
                      <bdi dir="rtl">الدارجة</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//nv.wikipedia.org/" lang="nv">Diné Bizaad</a>
                  </li>
                  <li>
                    <a href="//eml.wikipedia.org/" lang="roa-x-eml">
                      Emigliàn–Rumagnòl
                    </a>
                  </li>
                  <li>
                    <a href="//hif.wikipedia.org/" lang="hif">Fiji Hindi</a>
                  </li>
                  <li>
                    <a href="//fo.wikipedia.org/" lang="fo">Føroyskt</a>
                  </li>
                  <li>
                    <a href="//fy.wikipedia.org/" lang="fy">Frysk</a>
                  </li>
                  <li>
                    <a href="//ff.wikipedia.org/" lang="ff">Fulfulde</a>
                  </li>
                  <li>
                    <a href="//ga.wikipedia.org/" lang="ga">Gaeilge</a>
                  </li>
                  <li>
                    <a href="//gd.wikipedia.org/" lang="gd">Gàidhlig</a>
                  </li>
                  <li>
                    <a href="//glk.wikipedia.org/" lang="glk" title="Giləki">
                      <bdi dir="rtl">گیلکی</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//gu.wikipedia.org/" lang="gu" title="Gujarati">
                      ગુજરાતી
                    </a>
                  </li>
                  <li>
                    <a href="//hak.wikipedia.org/" lang="hak">
                      Hak-kâ-ngî / 客家語
                    </a>
                  </li>
                  <li>
                    <a href="//ha.wikipedia.org/" lang="ha">Hausa</a>
                  </li>
                  <li>
                    <a href="//hsb.wikipedia.org/" lang="hsb">Hornjoserbsce</a>
                  </li>
                  <li>
                    <a href="//io.wikipedia.org/" lang="io">Ido</a>
                  </li>
                  <li>
                    <a href="//ig.wikipedia.org/" lang="ig">Igbo</a>
                  </li>
                  <li>
                    <a href="//ilo.wikipedia.org/" lang="ilo">Ilokano</a>
                  </li>
                  <li>
                    <a href="//ia.wikipedia.org/" lang="ia">Interlingua</a>
                  </li>
                  <li>
                    <a href="//ie.wikipedia.org/" lang="ie">Interlingue</a>
                  </li>
                  <li>
                    <a href="//os.wikipedia.org/" lang="os" title="Iron">
                      Ирон
                    </a>
                  </li>
                  <li>
                    <a href="//is.wikipedia.org/" lang="is">Íslenska</a>
                  </li>
                  <li>
                    <a href="//jv.wikipedia.org/" lang="jv">Jawa</a>
                  </li>
                  <li>
                    <a href="//kn.wikipedia.org/" lang="kn" title="Kannada">
                      ಕನ್ನಡ
                    </a>
                  </li>
                  <li>
                    <a href="//pam.wikipedia.org/" lang="pam">Kapampangan</a>
                  </li>
                  <li>
                    <a
                      href="//km.wikipedia.org/"
                      lang="km"
                      title="Phéasa Khmér"
                    >
                      ភាសាខ្មែរ
                    </a>
                  </li>
                  <li>
                    <a href="//avk.wikipedia.org/" lang="avk">Kotava</a>
                  </li>
                  <li>
                    <a href="//ht.wikipedia.org/" lang="ht">Kreyòl Ayisyen</a>
                  </li>
                  <li>
                    <a href="//ku.wikipedia.org/" lang="ku">
                      <span lang="ku-Latn">Kurdî</span>
                      /
                      <bdi lang="ku-Arab" dir="rtl">كوردی</bdi>
                    </a>
                  </li>
                  <li>
                    <a
                      href="//ckb.wikipedia.org/"
                      lang="ckb"
                      title="Kurdîy Nawendî"
                    >
                      <bdi dir="rtl">کوردیی ناوەندی</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//ky.wikipedia.org/" lang="ky" title="Kyrgyzča">
                      Кыргызча
                    </a>
                  </li>
                  <li>
                    <a
                      href="//mrj.wikipedia.org/"
                      lang="mjr"
                      title="Kyryk Mary"
                    >
                      Кырык мары
                    </a>
                  </li>
                  <li>
                    <a href="//lb.wikipedia.org/" lang="lb">Lëtzebuergesch</a>
                  </li>
                  <li>
                    <a href="//lij.wikipedia.org/" lang="lij">Lìgure</a>
                  </li>
                  <li>
                    <a href="//li.wikipedia.org/" lang="li">Limburgs</a>
                  </li>
                  <li>
                    <a href="//lmo.wikipedia.org/" lang="lmo">Lombard</a>
                  </li>
                  <li>
                    <a href="//mai.wikipedia.org/" lang="mai" title="Maithilī">
                      मैथिली
                    </a>
                  </li>
                  <li>
                    <a href="//ml.wikipedia.org/" lang="ml" title="Malayalam">
                      മലയാളം
                    </a>
                  </li>
                  <li>
                    <a href="//xmf.wikipedia.org/" lang="xmf" title="Margaluri">
                      მარგალური
                    </a>
                  </li>
                  <li>
                    <a href="//mzn.wikipedia.org/" lang="mzn" title="Mäzeruni">
                      <bdi dir="rtl">مازِرونی</bdi>
                    </a>
                  </li>
                  <li>
                    <a
                      href="//cdo.wikipedia.org/"
                      lang="cdo"
                      title="Ming-deng-ngu"
                    >
                      Mìng-dĕ̤ng-ngṳ̄ / 閩東語
                    </a>
                  </li>
                  <li>
                    <a href="//mn.wikipedia.org/" lang="mn" title="Mongol">
                      Монгол
                    </a>
                  </li>
                  <li>
                    <a href="//nap.wikipedia.org/" lang="nap">Napulitano</a>
                  </li>
                  <li>
                    <a
                      href="//new.wikipedia.org/"
                      lang="new"
                      title="Nepal Bhasa"
                    >
                      नेपाल भाषा
                    </a>
                  </li>
                  <li>
                    <a href="//frr.wikipedia.org/" lang="frr">Nordfriisk</a>
                  </li>
                  <li>
                    <a href="//oc.wikipedia.org/" lang="oc">Occitan</a>
                  </li>
                  <li>
                    <a
                      href="//mhr.wikipedia.org/"
                      lang="mhr"
                      title="Olyk Marij"
                    >
                      Олык марий
                    </a>
                  </li>
                  <li>
                    <a href="//or.wikipedia.org/" lang="or" title="Oṛiā">ଓଡି଼ଆ</a>
                  </li>
                  <li>
                    <a href="//as.wikipedia.org/" lang="as" title="Ôxômiya">
                      অসমীযা়
                    </a>
                  </li>
                  <li>
                    <a
                      href="//pa.wikipedia.org/"
                      lang="pa"
                      title="Pañjābī (Gurmukhī)"
                    >
                      ਪੰਜਾਬੀ
                    </a>
                  </li>
                  <li>
                    <a
                      href="//pnb.wikipedia.org/"
                      lang="pnb"
                      title="Pañjābī (Shāhmukhī)"
                    >
                      <bdi dir="rtl">پنجابی (شاہ مکھی)</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//ps.wikipedia.org/" lang="ps" title="Paʂto">
                      <bdi dir="rtl">پښتو</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//pms.wikipedia.org/" lang="pms">Piemontèis</a>
                  </li>
                  <li>
                    <a href="//nds.wikipedia.org/" lang="nds">Plattdüütsch</a>
                  </li>
                  <li>
                    <a href="//kaa.wikipedia.org/" lang="kaa">Qaraqalpaqsha</a>
                  </li>
                  <li>
                    <a href="//crh.wikipedia.org/" lang="crh">Qırımtatarca</a>
                  </li>
                  <li>
                    <a href="//qu.wikipedia.org/" lang="qu">Runa Simi</a>
                  </li>
                  <li>
                    <a
                      href="//rue.wikipedia.org/"
                      lang="rue"
                      title="Rusin’skyj"
                    >
                      Русиньскый
                    </a>
                  </li>
                  <li>
                    <a href="//sa.wikipedia.org/" lang="sa" title="Saṃskṛtam">
                      संस्कृतम्
                    </a>
                  </li>
                  <li>
                    <a href="//sat.wikipedia.org/" lang="sat" title="Santali">
                      ᱥᱟᱱᱛᱟᱲᱤ
                    </a>
                  </li>
                  <li>
                    <a href="//skr.wikipedia.org/" lang="skr" title="Saraiki">
                      سرائیکی
                    </a>
                  </li>
                  <li>
                    <a href="//sah.wikipedia.org/" lang="sah" title="Saxa Tyla">
                      Саха Тыла
                    </a>
                  </li>
                  <li>
                    <a href="//sco.wikipedia.org/" lang="sco">Scots</a>
                  </li>
                  <li>
                    <a href="//sn.wikipedia.org/" lang="sn">ChiShona</a>
                  </li>
                  <li>
                    <a href="//scn.wikipedia.org/" lang="scn">Sicilianu</a>
                  </li>
                  <li>
                    <a href="//si.wikipedia.org/" lang="si" title="Siṃhala">
                      සිංහල
                    </a>
                  </li>
                  <li>
                    <a href="//sd.wikipedia.org/" lang="sd" title="Sindhī">
                      <bdi dir="rtl">سنڌي</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//szl.wikipedia.org/" lang="szl">Ślůnski</a>
                  </li>
                  <li>
                    <a href="//so.wikipedia.org/" lang="so">Soomaaliga</a>
                  </li>
                  <li>
                    <a href="//su.wikipedia.org/" lang="su">Basa Sunda</a>
                  </li>
                  <li>
                    <a href="//shi.wikipedia.org/" lang="shi">Taclḥit</a>
                  </li>
                  <li>
                    <a href="//tl.wikipedia.org/" lang="tl">Tagalog</a>
                  </li>
                  <li>
                    <a href="//shn.wikipedia.org/" lang="shn">ၽႃႇသႃႇတႆး</a>
                  </li>
                  <li>
                    <a
                      href="//zgh.wikipedia.org/"
                      lang="zgh"
                      title="Tamazight tanawayt"
                    >
                      ⵜⴰⵎⴰⵣⵉⵖⵜ ⵜⴰⵏⴰⵡⴰⵢⵜ
                    </a>
                  </li>
                  <li>
                    <a href="//tly.wikipedia.org/" lang="tly">tolışi</a>
                  </li>
                  <li>
                    <a href="//tum.wikipedia.org/" lang="tum">chiTumbuka</a>
                  </li>
                  <li>
                    <a href="//bug.wikipedia.org/" lang="bug">Basa Ugi</a>
                  </li>
                  <li>
                    <a href="//vec.wikipedia.org/" lang="vec">Vèneto</a>
                  </li>
                  <li>
                    <a href="//vo.wikipedia.org/" lang="vo">Volapük</a>
                  </li>
                  <li>
                    <a href="//wa.wikipedia.org/" lang="wa">Walon</a>
                  </li>
                  <li>
                    <a
                      href="//zh-classical.wikipedia.org/"
                      lang="lzh"
                      title="Wényán"
                    >
                      文言
                    </a>
                  </li>
                  <li>
                    <a href="//wuu.wikipedia.org/" lang="wuu" title="Wúyǔ">
                      吴语
                    </a>
                  </li>
                  <li>
                    <a href="//yi.wikipedia.org/" lang="yi" title="Yidiš">
                      <bdi dir="rtl">ייִדיש</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//yo.wikipedia.org/" lang="yo">Yorùbá</a>
                  </li>
                  <li>
                    <a href="//diq.wikipedia.org/" lang="diq">Zazaki</a>
                  </li>
                  <li>
                    <a href="//bat-smg.wikipedia.org/" lang="sgs">Žemaitėška</a>
                  </li>
                  <li>
                    <a href="//zu.wikipedia.org/" lang="zu">isiZulu</a>
                  </li>
                  <li>
                    <a href="//ne.wikipedia.org/" lang="ne" title="Nepālī">
                      नेपाली
                    </a>
                  </li>
                  <li>
                    <a href="//mni.wikipedia.org/" lang="mni">ꯃꯤꯇꯩ ꯂꯣꯟ</a>
                  </li>
                </ul>
              </div>
              <h2 className="bookshelf-container">
                <span className="bookshelf">
                  <span className="text">
                    <bdi dir="ltr">
                      1,000+
                    </bdi>
                    <span className="jsl10n" data-jsl10n="portal.entries">
                      articles
                    </span>
                  </span>
                </span>
              </h2>
              <div className="langlist hlist" data-el-section="secondary links">
                <ul>
                  <li>
                    <a href="//lad.wikipedia.org/" lang="lad">
                      <span lang="lad-Latn">Dzhudezmo</span>
                      /
                      <bdi lang="lad-Hebr" dir="rtl">לאדינו</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//kbd.wikipedia.org/" lang="kbd" title="Adighabze">
                      Адыгэбзэ
                    </a>
                  </li>
                  <li>
                    <a href="//ang.wikipedia.org/" lang="ang">Ænglisc</a>
                  </li>
                  <li>
                    <a
                      href="//smn.wikipedia.org/"
                      lang="smn"
                      title="Anarâškielâ"
                    >
                      Anarâškielâ
                    </a>
                  </li>
                  <li>
                    <a href="//anp.wikipedia.org/" lang="anp" title="Angika">
                      अंगिका
                    </a>
                  </li>
                  <li>
                    <a href="//ab.wikipedia.org/" lang="ab" title="Aṗsshwa">
                      Аԥсшәа
                    </a>
                  </li>
                  <li>
                    <a href="//roa-rup.wikipedia.org/" lang="rup">
                      armãneashti
                    </a>
                  </li>
                  <li>
                    <a href="//frp.wikipedia.org/" lang="frp">Arpitan</a>
                  </li>
                  <li>
                    <a href="//atj.wikipedia.org/" lang="atj">atikamekw</a>
                  </li>
                  <li>
                    <a href="//arc.wikipedia.org/" lang="arc" title="Ātûrāyâ">
                      <bdi dir="rtl">ܐܬܘܪܝܐ</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//gn.wikipedia.org/" lang="gn">Avañe’ẽ</a>
                  </li>
                  <li>
                    <a href="//av.wikipedia.org/" lang="av" title="Avar">
                      Авар
                    </a>
                  </li>
                  <li>
                    <a href="//ay.wikipedia.org/" lang="ay">Aymar</a>
                  </li>
                  <li>
                    <a href="//bbc.wikipedia.org/" lang="bbc">Batak Toba</a>
                  </li>
                  <li>
                    <a href="//bew.wikipedia.org/" lang="bew">Betawi</a>
                  </li>
                  <li>
                    <a href="//bh.wikipedia.org/" lang="bh" title="Bhōjapurī">
                      भोजपुरी
                    </a>
                  </li>
                  <li>
                    <a href="//bi.wikipedia.org/" lang="bi">Bislama</a>
                  </li>
                  <li>
                    <a href="//bo.wikipedia.org/" lang="bo" title="Bod Skad">
                      བོད་ཡིག
                    </a>
                  </li>
                  <li>
                    <a href="//bxr.wikipedia.org/" lang="bxr" title="Buryad">
                      Буряад
                    </a>
                  </li>
                  <li>
                    <a href="//cbk-zam.wikipedia.org/" lang="cbk-x-zam">
                      Chavacano de Zamboanga
                    </a>
                  </li>
                  <li>
                    <a href="//ny.wikipedia.org/" lang="ny">Chichewa</a>
                  </li>
                  <li>
                    <a href="//co.wikipedia.org/" lang="co">Corsu</a>
                  </li>
                  <li>
                    <a href="//za.wikipedia.org/" lang="za">Vahcuengh / 話僮</a>
                  </li>
                  <li>
                    <a href="//dga.wikipedia.org/" lang="dga">Dagaare</a>
                  </li>
                  <li>
                    <a
                      href="//se.wikipedia.org/"
                      lang="se"
                      title="Davvisámegiella"
                    >
                      Davvisámegiella
                    </a>
                  </li>
                  <li>
                    <a href="//pdc.wikipedia.org/" lang="pdc">Deitsch</a>
                  </li>
                  <li>
                    <a href="//dv.wikipedia.org/" lang="dv" title="Divehi">
                      <bdi dir="rtl">ދިވެހިބަސް</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//dsb.wikipedia.org/" lang="dsb">Dolnoserbski</a>
                  </li>
                  <li>
                    <a href="//myv.wikipedia.org/" lang="myv" title="Erzjanj">
                      Эрзянь
                    </a>
                  </li>
                  <li>
                    <a href="//ext.wikipedia.org/" lang="ext">Estremeñu</a>
                  </li>
                  <li>
                    <a href="//ee.wikipedia.org/" lang="ee">Eʋegbe</a>
                  </li>
                  <li>
                    <a href="//gur.wikipedia.org/" lang="gur">Farefare</a>
                  </li>
                  <li>
                    <a href="//fon.wikipedia.org/" lang="fon">Fɔ̀ngbè</a>
                  </li>
                  <li>
                    <a href="//fur.wikipedia.org/" lang="fur">Furlan</a>
                  </li>
                  <li>
                    <a href="//gv.wikipedia.org/" lang="gv">Gaelg</a>
                  </li>
                  <li>
                    <a href="//gag.wikipedia.org/" lang="gag">Gagauz</a>
                  </li>
                  <li>
                    <a href="//inh.wikipedia.org/" lang="inh" title="Ghalghai">
                      ГӀалгӀай
                    </a>
                  </li>
                  <li>
                    <a href="//gpe.wikipedia.org/" lang="gpe">
                      Ghanaian Pidgin
                    </a>
                  </li>
                  <li>
                    <a href="//ki.wikipedia.org/" lang="ki">Gĩkũyũ</a>
                  </li>
                  <li>
                    <a
                      href="//gan.wikipedia.org/"
                      lang="gan"
                      title="Gon ua"
                      data-hans="赣语"
                      data-hant="贛語"
                      className="jscnconv"
                    >
                      赣语 / 贛語
                    </a>
                  </li>
                  <li>
                    <a href="//guw.wikipedia.org/" lang="guw">Gungbe</a>
                  </li>
                  <li>
                    <a href="//got.wikipedia.org/" lang="got" title="Gutisk">
                      𐌲𐌿𐍄𐌹𐍃𐌺
                    </a>
                  </li>
                  <li>
                    <a href="//xal.wikipedia.org/" lang="xal" title="Halʹmg">
                      Хальмг
                    </a>
                  </li>
                  <li>
                    <a href="//haw.wikipedia.org/" lang="haw">ʻŌlelo Hawaiʻi</a>
                  </li>
                  <li>
                    <a href="//rw.wikipedia.org/" lang="rw">Ikinyarwanda</a>
                  </li>
                  <li>
                    <a href="//iba.wikipedia.org/" lang="iba">Jaku Iban</a>
                  </li>
                  <li>
                    <a href="//kbp.wikipedia.org/" lang="kbp">Kabɩyɛ</a>
                  </li>
                  <li>
                    <a href="//dtp.wikipedia.org/" lang="dtp">Kadazandusun</a>
                  </li>
                  <li>
                    <a href="//knc.wikipedia.org/" lang="knc">Yerwa Kanuri</a>
                  </li>
                  <li>
                    <a href="//csb.wikipedia.org/" lang="csb">Kaszëbsczi</a>
                  </li>
                  <li>
                    <a href="//kw.wikipedia.org/" lang="kw">Kernewek</a>
                  </li>
                  <li>
                    <a href="//kv.wikipedia.org/" lang="kv" title="Komi">
                      Коми
                    </a>
                  </li>
                  <li>
                    <a
                      href="//koi.wikipedia.org/"
                      lang="koi"
                      title="Perem Komi"
                    >
                      Перем коми
                    </a>
                  </li>
                  <li>
                    <a href="//kg.wikipedia.org/" lang="kg">Kongo</a>
                  </li>
                  <li>
                    <a href="//gom.wikipedia.org/" lang="gom">
                      कोंकणी / Konknni
                    </a>
                  </li>
                  <li>
                    <a href="//ks.wikipedia.org/" lang="ks" title="Koshur">
                      <bdi dir="rtl">كٲشُر</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//gcr.wikipedia.org/" lang="gcr">
                      Kriyòl Gwiyannen
                    </a>
                  </li>
                  <li>
                    <a href="//kge.wikipedia.org/" lang="kge">Kumoring</a>
                  </li>
                  <li>
                    <a href="//kus.wikipedia.org/" lang="kus">Kʋsaal</a>
                  </li>
                  <li>
                    <a
                      href="//lo.wikipedia.org/"
                      lang="lo"
                      title="Phaasaa Laao"
                    >
                      ພາສາລາວ
                    </a>
                  </li>
                  <li>
                    <a href="//lbe.wikipedia.org/" lang="lbe" title="Lakku">
                      Лакку
                    </a>
                  </li>
                  <li>
                    <a href="//ltg.wikipedia.org/" lang="ltg">Latgaļu</a>
                  </li>
                  <li>
                    <a href="//lez.wikipedia.org/" lang="lez" title="Lezgi">
                      Лезги
                    </a>
                  </li>
                  <li>
                    <a href="//nia.wikipedia.org/" lang="nia">Li Niha</a>
                  </li>
                  <li>
                    <a href="//ln.wikipedia.org/" lang="ln">Lingála</a>
                  </li>
                  <li>
                    <a href="//lfn.wikipedia.org/" lang="lfn">
                      Lingua Franca Nova
                    </a>
                  </li>
                  <li>
                    <a href="//olo.wikipedia.org/" lang="olo">livvinkarjala</a>
                  </li>
                  <li>
                    <a href="//jbo.wikipedia.org/" lang="jbo">lojban</a>
                  </li>
                  <li>
                    <a href="//lg.wikipedia.org/" lang="lg">Luganda</a>
                  </li>
                  <li>
                    <a href="//mad.wikipedia.org/" lang="mad">Madhurâ</a>
                  </li>
                  <li>
                    <a href="//mt.wikipedia.org/" lang="mt">Malti</a>
                  </li>
                  <li>
                    <a href="//btm.wikipedia.org/" lang="btm">Mandailing</a>
                  </li>
                  <li>
                    <a href="//mi.wikipedia.org/" lang="mi">Māori</a>
                  </li>
                  <li>
                    <a href="//fat.wikipedia.org/" lang="fat">Mfantse</a>
                  </li>
                  <li>
                    <a href="//mwl.wikipedia.org/" lang="mwl">Mirandés</a>
                  </li>
                  <li>
                    <a href="//mdf.wikipedia.org/" lang="mdf" title="Mokšenj">
                      Мокшень
                    </a>
                  </li>
                  <li>
                    <a href="//mnw.wikipedia.org/" lang="mnw">ဘာသာ မန်</a>
                  </li>
                  <li>
                    <a href="//mos.wikipedia.org/" lang="mos">Moore</a>
                  </li>
                  <li>
                    <a href="//nqo.wikipedia.org/" lang="nqo" title="N&#x27;Ko">
                      ߒߞߏ
                    </a>
                  </li>
                  <li>
                    <a href="//fj.wikipedia.org/" lang="fj">
                      Na Vosa Vaka-Viti
                    </a>
                  </li>
                  <li>
                    <a href="//nah.wikipedia.org/" lang="nah">Nāhuatlahtōlli</a>
                  </li>
                  <li>
                    <a href="//pcm.wikipedia.org/" lang="pcm">Naijá</a>
                  </li>
                  <li>
                    <a href="//nds-nl.wikipedia.org/" lang="nds-nl">
                      Nedersaksisch
                    </a>
                  </li>
                  <li>
                    <a href="//nrm.wikipedia.org/" lang="roa-x-nrm">
                      Nouormand / Normaund
                    </a>
                  </li>
                  <li>
                    <a href="//nov.wikipedia.org/" lang="nov">Novial</a>
                  </li>
                  <li>
                    <a href="//om.wikipedia.org/" lang="om">Afaan Oromoo</a>
                  </li>
                  <li>
                    <a href="//blk.wikipedia.org/" lang="blk">ပအိုဝ်ႏဘာႏသာႏ</a>
                  </li>
                  <li>
                    <a href="//pag.wikipedia.org/" lang="pag">Pangasinán</a>
                  </li>
                  <li>
                    <a href="//ami.wikipedia.org/" lang="ami">Pangcah</a>
                  </li>
                  <li>
                    <a href="//pap.wikipedia.org/" lang="pap">Papiamentu</a>
                  </li>
                  <li>
                    <a href="//jam.wikipedia.org/" lang="jam">Patois</a>
                  </li>
                  <li>
                    <a href="//pfl.wikipedia.org/" lang="pfl">Pfälzisch</a>
                  </li>
                  <li>
                    <a href="//pcd.wikipedia.org/" lang="pcd">Picard</a>
                  </li>
                  <li>
                    <a
                      href="//krc.wikipedia.org/"
                      lang="krc"
                      title="Qaraçay–Malqar"
                    >
                      Къарачай–малкъар
                    </a>
                  </li>
                  <li>
                    <a href="//ksh.wikipedia.org/" lang="ksh">Ripoarisch</a>
                  </li>
                  <li>
                    <a href="//rm.wikipedia.org/" lang="rm">Rumantsch</a>
                  </li>
                  <li>
                    <a href="//rsk.wikipedia.org/" lang="rsk" title="Ruski">
                      Руски
                    </a>
                  </li>
                  <li>
                    <a href="//szy.wikipedia.org/" lang="szy">Sakizaya</a>
                  </li>
                  <li>
                    <a href="//sm.wikipedia.org/" lang="sm">Gagana Sāmoa</a>
                  </li>
                  <li>
                    <a href="//sc.wikipedia.org/" lang="sc">Sardu</a>
                  </li>
                  <li>
                    <a href="//trv.wikipedia.org/" lang="trv">Seediq</a>
                  </li>
                  <li>
                    <a href="//stq.wikipedia.org/" lang="stq">Seeltersk</a>
                  </li>
                  <li>
                    <a href="//st.wikipedia.org/" lang="st">Sesotho</a>
                  </li>
                  <li>
                    <a href="//nso.wikipedia.org/" lang="nso">
                      Sesotho sa Leboa
                    </a>
                  </li>
                  <li>
                    <a href="//tn.wikipedia.org/" lang="tn">Setswana</a>
                  </li>
                  <li>
                    <a href="//syl.wikipedia.org/" lang="syl" title="Silôṭi">
                      ꠍꠤꠟꠐꠤ
                    </a>
                  </li>
                  <li>
                    <a href="//cu.wikipedia.org/" lang="cu" title="Slověnĭskŭ">
                      Словѣ́ньскъ / ⰔⰎⰑⰂⰡⰐⰠⰔⰍⰟ
                    </a>
                  </li>
                  <li>
                    <a href="//srn.wikipedia.org/" lang="srn">Sranantongo</a>
                  </li>
                  <li>
                    <a href="//ss.wikipedia.org/" lang="ss">SiSwati</a>
                  </li>
                  <li>
                    <a href="//ty.wikipedia.org/" lang="ty">Reo tahiti</a>
                  </li>
                  <li>
                    <a href="//kab.wikipedia.org/" lang="kab" title="Taqbaylit">
                      Taqbaylit
                    </a>
                  </li>
                  <li>
                    <a href="//roa-tara.wikipedia.org/" lang="roa">Tarandíne</a>
                  </li>
                  <li>
                    <a href="//tay.wikipedia.org/" lang="tay">Tayal</a>
                  </li>
                  <li>
                    <a href="//tet.wikipedia.org/" lang="tet">Tetun</a>
                  </li>
                  <li>
                    <a href="//tpi.wikipedia.org/" lang="tpi">Tok Pisin</a>
                  </li>
                  <li>
                    <a href="//tok.wikipedia.org/" lang="tok" title="toki pona">
                      toki pona
                    </a>
                  </li>
                  <li>
                    <a href="//to.wikipedia.org/" lang="to">faka Tonga</a>
                  </li>
                  <li>
                    <a href="//tk.wikipedia.org/" lang="tk">Türkmençe</a>
                  </li>
                  <li>
                    <a href="//tw.wikipedia.org/" lang="tw">Twi</a>
                  </li>
                  <li>
                    <a href="//kcg.wikipedia.org/" lang="kcg">Tyap</a>
                  </li>
                  <li>
                    <a href="//tyv.wikipedia.org/" lang="tyv" title="Tyva dyl">
                      Тыва дыл
                    </a>
                  </li>
                  <li>
                    <a href="//udm.wikipedia.org/" lang="udm" title="Udmurt">
                      Удмурт
                    </a>
                  </li>
                  <li>
                    <a href="//ug.wikipedia.org/" lang="ug">
                      <bdi dir="rtl">ئۇيغۇرچه</bdi>
                    </a>
                  </li>
                  <li>
                    <a href="//vep.wikipedia.org/" lang="vep">Vepsän</a>
                  </li>
                  <li>
                    <a href="//fiu-vro.wikipedia.org/" lang="vro">võro</a>
                  </li>
                  <li>
                    <a href="//vls.wikipedia.org/" lang="vls">West-Vlams</a>
                  </li>
                  <li>
                    <a href="//wo.wikipedia.org/" lang="wo">Wolof</a>
                  </li>
                  <li>
                    <a href="//xh.wikipedia.org/" lang="xh">isiXhosa</a>
                  </li>
                  <li>
                    <a href="//zea.wikipedia.org/" lang="zea">Zeêuws</a>
                  </li>
                  <li>
                    <a href="//alt.wikipedia.org/" lang="alt">алтай тил</a>
                  </li>
                  <li>
                    <a href="//awa.wikipedia.org/" lang="awa">अवधी</a>
                  </li>
                  <li>
                    <a href="//dty.wikipedia.org/" lang="dty">डोटेली</a>
                  </li>
                  <li>
                    <a href="//tcy.wikipedia.org/" lang="tcy">ತುಳು</a>
                  </li>
                  <li>
                    <a href="//rki.wikipedia.org/" lang="rki">ရခိုင်</a>
                  </li>
                </ul>
              </div>
              <h2 className="bookshelf-container">
                <span className="bookshelf">
                  <span className="text">
                    <bdi dir="ltr">
                      100+
                    </bdi>
                    <span className="jsl10n" data-jsl10n="portal.entries">
                      articles
                    </span>
                  </span>
                </span>
              </h2>
              <div
                className="langlist langlist-tiny hlist"
                data-el-section="secondary links"
              >
                <ul>
                  <li>
                    <a href="//bdr.wikipedia.org/" lang="bdr">Bajau Sama</a>
                  </li>
                  <li>
                    <a href="//bm.wikipedia.org/" lang="bm">Bamanankan</a>
                  </li>
                  <li>
                    <a href="//ch.wikipedia.org/" lang="ch">Chamoru</a>
                  </li>
                  <li>
                    <a href="//dz.wikipedia.org/" lang="dz" title="Rdzong-Kha">
                      རྫོང་ཁ
                    </a>
                  </li>
                  <li>
                    <a href="//igl.wikipedia.org/" lang="igl">Igala</a>
                  </li>
                  <li>
                    <a href="//iu.wikipedia.org/" lang="iu">
                      ᐃᓄᒃᑎᑐᑦ / Inuktitut
                    </a>
                  </li>
                  <li>
                    <a href="//ik.wikipedia.org/" lang="ik">Iñupiak</a>
                  </li>
                  <li>
                    <a
                      href="//nr.wikipedia.org/"
                      lang="nr"
                      title="isiNdebele seSewula"
                    >
                      isiNdebele seSewula
                    </a>
                  </li>
                  <li>
                    <a href="//kaj.wikipedia.org/" lang="kaj">Jju</a>
                  </li>
                  <li>
                    <a href="//ppl.wikipedia.org/" lang="ppl">Nawat</a>
                  </li>
                  <li>
                    <a href="//nup.wikipedia.org/" lang="nup">Nupe</a>
                  </li>
                  <li>
                    <a href="//ann.wikipedia.org/" lang="ann">Obolo</a>
                  </li>
                  <li>
                    <a href="//pi.wikipedia.org/" lang="pi" title="Pāḷi">
                      पालि
                    </a>
                  </li>
                  <li>
                    <a href="//pwn.wikipedia.org/" lang="pwn">pinayuanan</a>
                  </li>
                  <li>
                    <a href="//pnt.wikipedia.org/" lang="pnt" title="Pontiaká">
                      Ποντιακά
                    </a>
                  </li>
                  <li>
                    <a href="//rmy.wikipedia.org/" lang="rmy">Romani čhib</a>
                  </li>
                  <li>
                    <a href="//rn.wikipedia.org/" lang="rn">Ikirundi</a>
                  </li>
                  <li>
                    <a href="//sg.wikipedia.org/" lang="sg">Sängö</a>
                  </li>
                  <li>
                    <a
                      href="//tdd.wikipedia.org/"
                      lang="tdd"
                      title="Tai taɯ xoŋ"
                    >
                      ᥖᥭᥰᥖᥬᥳᥑᥨᥒᥰ
                    </a>
                  </li>
                  <li>
                    <a href="//ti.wikipedia.org/" lang="ti" title="Təgərəña">
                      ትግርኛ
                    </a>
                  </li>
                  <li>
                    <a href="//din.wikipedia.org/" lang="din">Thuɔŋjäŋ</a>
                  </li>
                  <li>
                    <a href="//chr.wikipedia.org/" lang="chr" title="Tsalagi">
                      ᏣᎳᎩ
                    </a>
                  </li>
                  <li>
                    <a href="//chy.wikipedia.org/" lang="chy">
                      Tsėhesenėstsestotse
                    </a>
                  </li>
                  <li>
                    <a href="//ts.wikipedia.org/" lang="ts">Xitsonga</a>
                  </li>
                  <li>
                    <a href="//ve.wikipedia.org/" lang="ve">Tshivenḓa</a>
                  </li>
                  <li>
                    <a href="//guc.wikipedia.org/" lang="guc">Wayuunaiki</a>
                  </li>
                  <li>
                    <a href="//ady.wikipedia.org/" lang="ady">адыгабзэ</a>
                  </li>
                </ul>
              </div>
              <div
                className="langlist langlist-others hlist"
                data-el-section="other languages"
              >
                <a
                  className="jsl10n"
                  href="https://meta.wikimedia.org/wiki/Special:MyLanguage/List_of_Wikipedias"
                  data-jsl10n="other-languages-label"
                >
                  Other languages
                </a>
              </div>
            </div>
          </div>
        </nav>
        <hr />
      </main>
      <footer className="footer" data-el-section="other projects">
        <div className="footer-sidebar">
          <div className="footer-sidebar-content">
            <div className="footer-sidebar-icon sprite svg-Wikimedia-logo_black">
            </div>
            <div
              className="footer-sidebar-text jsl10n"
              data-jsl10n="portal.footer-description"
            >
              Wikipedia is hosted by the Wikimedia Foundation, a non-profit
              organization that also hosts a range of other projects.
            </div>
            <div className="footer-sidebar-text">
              <a
                href="https://donate.wikimedia.org/?wmf_medium=portal&wmf_campaign=portalFooter&wmf_source=portalFooter"
                target="_blank"
              >
                <span className="jsl10n" data-jsl10n="footer-donate">
                  You can support our work with a donation.
                </span>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-sidebar app-badges">
          <div className="footer-sidebar-content">
            <div className="footer-sidebar-text">
              <div className="footer-sidebar-icon sprite svg-wikipedia_app_tile">
              </div>
              <strong className="jsl10n" data-jsl10n="portal.app-links.title">
                <a
                  className="jsl10n"
                  data-jsl10n="portal.app-links.url"
                  href="https://en.wikipedia.org/wiki/List_of_Wikipedia_mobile_applications"
                >
                  Download Wikipedia for Android or iOS
                </a>
              </strong>
              <p className="jsl10n" data-jsl10n="portal.app-links.description">
                Save your favorite articles to read offline, sync your reading
                lists across devices and customize your reading experience with
                the official Wikipedia app.
              </p>
              <ul>
                <li className="app-badge app-badge-android">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://play.google.com/store/apps/details?id=org.wikipedia&referrer=utm_source%3Dportal%26utm_medium%3Dbutton%26anid%3Dadmob"
                  >
                    <span
                      className="jsl10n sprite svg-badge_google_play_store"
                      data-jsl10n="portal.app-links.google-store"
                    >
                      Google Play Store
                    </span>
                  </a>
                </li>
                <li className="app-badge app-badge-ios">
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://itunes.apple.com/app/apple-store/id324715238?pt=208305&ct=portal&mt=8"
                  >
                    <span
                      className="jsl10n sprite svg-badge_ios_app_store"
                      data-jsl10n="portal.app-links.apple-store"
                    >
                      Apple App Store
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-sidebar wikipedia25-footer-sidebar">
          <div className="footer-sidebar-content">
            <div className="footer-sidebar-text">
              <span className="cdx-toggle-switch cdx-toggle-switch--align-switch">
                <input
                  id="wikipedia25-birthday-mode-toggle-switch"
                  className="cdx-toggle-switch__input"
                  type="checkbox"
                />
                <span className="cdx-toggle-switch__switch">
                  <span className="cdx-toggle-switch__switch__grip"></span>
                </span>
                <div className="cdx-toggle-switch__label cdx-label">
                  <label
                    className="cdx-label__label jsl10n"
                    htmlFor="wikipedia25-birthday-mode-toggle-switch"
                    data-jsl10n="portal.wikipedia25.birthday-mode-toggle-text"
                  >
                    Birthday mode
                  </label>
                </div>
              </span>
            </div>
          </div>
        </div>
        <nav
          data-jsl10n="other-projects-nav-label"
          aria-label="Other projects"
          className="other-projects"
        >
          <div className="other-project">
            <a className="other-project-link" href="//commons.wikimedia.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Commons-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="commons.name"
                >
                  Commons
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="commons.slogan"
                >
                  Free media collection
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikivoyage.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikivoyage-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikivoyage.name"
                >
                  Wikivoyage
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikivoyage.slogan"
                >
                  Free travel guide
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wiktionary.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wiktionary-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wiktionary.name"
                >
                  Wiktionary
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wiktionary.slogan"
                >
                  Free dictionary
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikibooks.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikibooks-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikibooks.name"
                >
                  Wikibooks
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikibooks.slogan"
                >
                  Free textbooks
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikinews.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikinews-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikinews.name"
                >
                  Wikinews
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikinews.slogan"
                >
                  Free news source
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikidata.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikidata-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikidata.name"
                >
                  Wikidata
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikidata.slogan"
                >
                  Free knowledge base
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikiversity.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikiversity-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikiversity.name"
                >
                  Wikiversity
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikiversity.slogan"
                >
                  Free learning resources
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikiquote.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikiquote-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikiquote.name"
                >
                  Wikiquote
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikiquote.slogan"
                >
                  Free quote compendium
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.mediawiki.org/">
              <div className="other-project-icon">
                <div className="sprite svg-MediaWiki-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="mediawiki.name"
                >
                  MediaWiki
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="mediawiki.slogan"
                >
                  Free &amp; open wiki software
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikisource.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikisource-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikisource.name"
                >
                  Wikisource
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikisource.slogan"
                >
                  Free content library
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//species.wikimedia.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikispecies-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikispecies.name"
                >
                  Wikispecies
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikispecies.slogan"
                >
                  Free species directory
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//www.wikifunctions.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Wikifunctions-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="wikifunctions.name"
                >
                  Wikifunctions
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="wikifunctions.slogan"
                >
                  Free function library
                </span>
              </div>
            </a>
          </div>
          <div className="other-project">
            <a className="other-project-link" href="//meta.wikimedia.org/">
              <div className="other-project-icon">
                <div className="sprite svg-Meta-Wiki-logo_sister"></div>
              </div>
              <div className="other-project-text">
                <span
                  className="other-project-title jsl10n"
                  data-jsl10n="metawiki.name"
                >
                  Meta-Wiki
                </span>
                <span
                  className="other-project-tagline jsl10n"
                  data-jsl10n="metawiki.slogan"
                >
                  Community coordination &amp; documentation
                </span>
              </div>
            </a>
          </div>
        </nav>
        <hr />
        <p className="site-license">
          <small className="jsl10n" data-jsl10n="license">
            This page is available under the
            <a href="https://creativecommons.org/licenses/by-sa/4.0/">
              Creative Commons Attribution-ShareAlike License
            </a>
          </small>
          <small className="jsl10n" data-jsl10n="terms">
            <a href="https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Terms_of_Use">
              Terms of Use
            </a>
          </small>
          <small className="jsl10n" data-jsl10n="privacy-policy">
            <a href="https://foundation.wikimedia.org/wiki/Special:MyLanguage/Policy:Privacy_policy">
              Privacy Policy
            </a>
          </small>
        </p>
      </footer>
    </body>
  </>
);
