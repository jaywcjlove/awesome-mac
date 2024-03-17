/**
 * Markdown Style
 * @version 1.1.0
 * @author 小弟调调
 * https://github.com/jaywcjlove/markdown-style
 * 
 * Integrate markdown styles into web components, Markdown CSS styles will not be conflicted.
 * The minimal amount of CSS to replicate the GitHub Markdown style. Support dark-mode/night mode.
 */
const octiconLinkStyle = `
markdown-style h1:hover a.anchor .icon-link:before,
markdown-style h2:hover a.anchor .icon-link:before,
markdown-style h3:hover a.anchor .icon-link:before,
markdown-style h4:hover a.anchor .icon-link:before,
markdown-style h5:hover a.anchor .icon-link:before,
markdown-style h6:hover a.anchor .icon-link:before {
  width: 16px;
  height: 16px;
  content: ' ';
  display: inline-block;
  background-color: currentColor;
  -webkit-mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
  mask-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' version='1.1' aria-hidden='true'><path fill-rule='evenodd' d='M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z'></path></svg>");
}`;

const __TEMPLATE__ = document.createElement('template');
__TEMPLATE__.innerHTML = `
<style>
${octiconLinkStyle}
[data-color-mode*='light'], [data-color-mode*='light'] body, markdown-style[theme*='light'] {
  --color-prettylights-syntax-comment: #6e7781;
  --color-prettylights-syntax-constant: #0550ae;
  --color-prettylights-syntax-entity: #8250df;
  --color-prettylights-syntax-storage-modifier-import: #24292f;
  --color-prettylights-syntax-entity-tag: #116329;
  --color-prettylights-syntax-keyword: #cf222e;
  --color-prettylights-syntax-string: #0a3069;
  --color-prettylights-syntax-variable: #953800;
  --color-prettylights-syntax-brackethighlighter-unmatched: #82071e;
  --color-prettylights-syntax-invalid-illegal-text: #f6f8fa;
  --color-prettylights-syntax-invalid-illegal-bg: #82071e;
  --color-prettylights-syntax-carriage-return-text: #f6f8fa;
  --color-prettylights-syntax-carriage-return-bg: #cf222e;
  --color-prettylights-syntax-string-regexp: #116329;
  --color-prettylights-syntax-markup-list: #3b2300;
  --color-prettylights-syntax-markup-heading: #0550ae;
  --color-prettylights-syntax-markup-italic: #24292f;
  --color-prettylights-syntax-markup-bold: #24292f;
  --color-prettylights-syntax-markup-deleted-text: #82071e;
  --color-prettylights-syntax-markup-deleted-bg: #FFEBE9;
  --color-prettylights-syntax-markup-inserted-text: #116329;
  --color-prettylights-syntax-markup-inserted-bg: #dafbe1;
  --color-prettylights-syntax-markup-changed-text: #953800;
  --color-prettylights-syntax-markup-changed-bg: #ffd8b5;
  --color-prettylights-syntax-markup-ignored-text: #eaeef2;
  --color-prettylights-syntax-markup-ignored-bg: #0550ae;
  --color-prettylights-syntax-meta-diff-range: #8250df;
  --color-prettylights-syntax-brackethighlighter-angle: #57606a;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #8c959f;
  --color-prettylights-syntax-constant-other-reference-link: #0a3069;
  --color-fg-default: #24292f;
  --color-fg-muted: #57606a;
  --color-fg-subtle: #6e7781;
  --color-canvas-default: #ffffff;
  --color-canvas-subtle: #f6f8fa;
  --color-border-default: #d0d7de;
  --color-border-muted: hsla(210,18%,87%,1);
  --color-neutral-muted: rgba(175,184,193,0.2);
  --color-accent-fg: #0969da;
  --color-accent-emphasis: #0969da;
  --color-attention-subtle: #fff8c5;
  --color-danger-fg: #cf222e;
}
[data-color-mode*='dark'], [data-color-mode*='dark'] body, markdown-style[theme*='dark'] {
  --color-prettylights-syntax-comment: #8b949e;
  --color-prettylights-syntax-constant: #79c0ff;
  --color-prettylights-syntax-entity: #d2a8ff;
  --color-prettylights-syntax-storage-modifier-import: #c9d1d9;
  --color-prettylights-syntax-entity-tag: #7ee787;
  --color-prettylights-syntax-keyword: #ff7b72;
  --color-prettylights-syntax-string: #a5d6ff;
  --color-prettylights-syntax-variable: #ffa657;
  --color-prettylights-syntax-brackethighlighter-unmatched: #f85149;
  --color-prettylights-syntax-invalid-illegal-text: #f0f6fc;
  --color-prettylights-syntax-invalid-illegal-bg: #8e1519;
  --color-prettylights-syntax-carriage-return-text: #f0f6fc;
  --color-prettylights-syntax-carriage-return-bg: #b62324;
  --color-prettylights-syntax-string-regexp: #7ee787;
  --color-prettylights-syntax-markup-list: #f2cc60;
  --color-prettylights-syntax-markup-heading: #1f6feb;
  --color-prettylights-syntax-markup-italic: #c9d1d9;
  --color-prettylights-syntax-markup-bold: #c9d1d9;
  --color-prettylights-syntax-markup-deleted-text: #ffdcd7;
  --color-prettylights-syntax-markup-deleted-bg: #67060c;
  --color-prettylights-syntax-markup-inserted-text: #aff5b4;
  --color-prettylights-syntax-markup-inserted-bg: #033a16;
  --color-prettylights-syntax-markup-changed-text: #ffdfb6;
  --color-prettylights-syntax-markup-changed-bg: #5a1e02;
  --color-prettylights-syntax-markup-ignored-text: #c9d1d9;
  --color-prettylights-syntax-markup-ignored-bg: #1158c7;
  --color-prettylights-syntax-meta-diff-range: #d2a8ff;
  --color-prettylights-syntax-brackethighlighter-angle: #8b949e;
  --color-prettylights-syntax-sublimelinter-gutter-mark: #484f58;
  --color-prettylights-syntax-constant-other-reference-link: #a5d6ff;
  --color-fg-default: #c9d1d9;
  --color-fg-muted: #8b949e;
  --color-fg-subtle: #484f58;
  --color-canvas-default: #0d1117;
  --color-canvas-subtle: #161b22;
  --color-border-default: #30363d;
  --color-border-muted: #21262d;
  --color-neutral-muted: rgba(110,118,129,0.4);
  --color-accent-fg: #58a6ff;
  --color-accent-emphasis: #1f6feb;
  --color-attention-subtle: rgba(187,128,9,0.15);
  --color-danger-fg: #f85149;
}

markdown-style {
  display: block;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  color: var(--color-fg-default);
  background-color: var(--color-canvas-default);
}

markdown-style details,
markdown-style figcaption,
markdown-style figure {
  display: block;
}

markdown-style summary {
  display: list-item;
}

markdown-style [hidden] {
  display: none !important;
}

markdown-style a {
  background-color: transparent;
  color: var(--color-accent-fg);
  text-decoration: none;
}

markdown-style a:active,
markdown-style a:hover {
  outline-width: 0;
}

markdown-style abbr[title] {
  border-bottom: none;
  text-decoration: underline dotted;
}

markdown-style b,
markdown-style strong {
  font-weight: 600;
}

markdown-style dfn {
  font-style: italic;
}

markdown-style h1 {
  margin: .67em 0;
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 2em;
  border-bottom: 1px solid var(--color-border-muted);
}

markdown-style mark {
  background-color: var(--color-attention-subtle);
  color: var(--color-text-primary);
}

markdown-style small {
  font-size: 90%;
}

markdown-style sub,
markdown-style sup {
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

markdown-style sub {
  bottom: -0.25em;
}

markdown-style sup {
  top: -0.5em;
}

markdown-style img {
  border-style: none;
  max-width: 100%;
  box-sizing: content-box;
  background-color: var(--color-canvas-default);
}

markdown-style code,
markdown-style kbd,
markdown-style pre,
markdown-style samp {
  font-family: monospace,monospace;
  font-size: 1em;
}

markdown-style figure {
  margin: 1em 40px;
}

markdown-style hr {
  box-sizing: content-box;
  overflow: hidden;
  background: transparent;
  border-bottom: 1px solid var(--color-border-muted);
  height: .25em;
  padding: 0;
  margin: 24px 0;
  background-color: var(--color-border-default);
  border: 0;
}

markdown-style input {
  font: inherit;
  margin: 0;
  overflow: visible;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

markdown-style [type=button],
markdown-style [type=reset],
markdown-style [type=submit] {
  -webkit-appearance: button;
}

markdown-style [type=button]::-moz-focus-inner,
markdown-style [type=reset]::-moz-focus-inner,
markdown-style [type=submit]::-moz-focus-inner {
  border-style: none;
  padding: 0;
}

markdown-style [type=button]:-moz-focusring,
markdown-style [type=reset]:-moz-focusring,
markdown-style [type=submit]:-moz-focusring {
  outline: 1px dotted ButtonText;
}

markdown-style [type=checkbox],
markdown-style [type=radio] {
  box-sizing: border-box;
  padding: 0;
}

markdown-style [type=number]::-webkit-inner-spin-button,
markdown-style [type=number]::-webkit-outer-spin-button {
  height: auto;
}

markdown-style [type=search] {
  -webkit-appearance: textfield;
  outline-offset: -2px;
}

markdown-style [type=search]::-webkit-search-cancel-button,
markdown-style [type=search]::-webkit-search-decoration {
  -webkit-appearance: none;
}

markdown-style ::-webkit-input-placeholder {
  color: inherit;
  opacity: .54;
}

markdown-style ::-webkit-file-upload-button {
  -webkit-appearance: button;
  font: inherit;
}

markdown-style a:hover {
  text-decoration: underline;
}

markdown-style hr::before {
  display: table;
  content: "";
}

markdown-style hr::after {
  display: table;
  clear: both;
  content: "";
}

markdown-style table {
  border-spacing: 0;
  border-collapse: collapse;
  display: block;
  width: max-content;
  max-width: 100%;
  overflow: auto;
}

markdown-style td,
markdown-style th {
  padding: 0;
}

markdown-style details summary {
  cursor: pointer;
}

markdown-style details:not([open])>*:not(summary) {
  display: none !important;
}

markdown-style kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  line-height: 10px;
  color: var(--color-fg-default);
  vertical-align: middle;
  background-color: var(--color-canvas-subtle);
  border: solid 1px var(--color-neutral-muted);
  border-bottom-color: var(--color-neutral-muted);
  border-radius: 6px;
  box-shadow: inset 0 -1px 0 var(--color-neutral-muted);
}

markdown-style h1,
markdown-style h2,
markdown-style h3,
markdown-style h4,
markdown-style h5,
markdown-style h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

markdown-style h2 {
  font-weight: 600;
  padding-bottom: .3em;
  font-size: 1.5em;
  border-bottom: 1px solid var(--color-border-muted);
}

markdown-style h3 {
  font-weight: 600;
  font-size: 1.25em;
}

markdown-style h4 {
  font-weight: 600;
  font-size: 1em;
}

markdown-style h5 {
  font-weight: 600;
  font-size: .875em;
}

markdown-style h6 {
  font-weight: 600;
  font-size: .85em;
  color: var(--color-fg-muted);
}

markdown-style p {
  margin-top: 0;
  margin-bottom: 10px;
}

markdown-style blockquote {
  margin: 0;
  padding: 0 1em;
  color: var(--color-fg-muted);
  border-left: .25em solid var(--color-border-default);
}

markdown-style ul,
markdown-style ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 2em;
}

markdown-style ol ol,
markdown-style ul ol {
  list-style-type: lower-roman;
}

markdown-style ul ul ol,
markdown-style ul ol ol,
markdown-style ol ul ol,
markdown-style ol ol ol {
  list-style-type: lower-alpha;
}

markdown-style dd {
  margin-left: 0;
}

markdown-style tt,
markdown-style code {
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
}

markdown-style pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
  font-size: 12px;
  word-wrap: normal;
}

markdown-style .octicon {
  display: inline-block;
  overflow: visible !important;
  vertical-align: text-bottom;
  fill: currentColor;
}

markdown-style ::placeholder {
  color: var(--color-fg-subtle);
  opacity: 1;
}

markdown-style input::-webkit-outer-spin-button,
markdown-style input::-webkit-inner-spin-button {
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
}

markdown-style .token.comment, markdown-style .token.prolog, markdown-style .token.doctype, markdown-style .token.cdata {
  color: var(--color-prettylights-syntax-comment);
}
markdown-style .token.namespace { opacity: 0.7; }
markdown-style .token.tag, markdown-style .token.selector, markdown-style .token.constant, markdown-style .token.symbol, markdown-style .token.deleted {
  color: var(--color-prettylights-syntax-entity-tag);
}
markdown-style .token.maybe-class-name {
  color: var(--color-prettylights-syntax-variable);
}
markdown-style .token.property-access, markdown-style .token.operator, markdown-style .token.boolean, markdown-style .token.number, markdown-style .token.selector markdown-style .token.class, markdown-style .token.attr-name, markdown-style .token.string, markdown-style .token.char, markdown-style .token.builtin {
  color: var(--color-prettylights-syntax-constant);
}

markdown-style .token.deleted {
  color: var(--color-prettylights-syntax-markup-deleted-text);
}
markdown-style .token.property {
  color: var(--color-prettylights-syntax-constant);
}
markdown-style .token.punctuation {
  color: var(--color-prettylights-syntax-markup-bold);
}
markdown-style .token.function {
  color: var(--color-prettylights-syntax-entity);
}
markdown-style .code-line .token.deleted {
  background-color: var(--color-prettylights-syntax-markup-deleted-bg);
}
markdown-style .token.inserted {
  color: var(--color-prettylights-syntax-markup-inserted-text);
}
markdown-style .code-line .token.inserted {
  background-color: var(--color-prettylights-syntax-markup-inserted-bg);
}

markdown-style .token.variable {
  color: var(--color-prettylights-syntax-constant);
}
markdown-style .token.entity, markdown-style .token.url, .language-css markdown-style .token.string, .style markdown-style .token.string {
  color: var(--color-prettylights-syntax-string);
}
markdown-style .token.color, markdown-style .token.atrule, markdown-style .token.attr-value, markdown-style .token.function, markdown-style .token.class-name {
  color: var(--color-prettylights-syntax-string);
}
markdown-style .token.rule, markdown-style .token.regex, markdown-style .token.important, markdown-style .token.keyword {
  color: var(--color-prettylights-syntax-keyword);
}
markdown-style .token.coord {
  color: var(--color-prettylights-syntax-meta-diff-range);
}
markdown-style .token.important, markdown-style .token.bold { font-weight: bold; }
markdown-style .token.italic { font-style: italic; }
markdown-style .token.entity { cursor: help; }

markdown-style [data-catalyst] {
  display: block;
}

markdown-style g-emoji {
  font-family: "Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol";
  font-size: 1em;
  font-style: normal !important;
  font-weight: 400;
  line-height: 1;
  vertical-align: -0.075em;
}

markdown-style g-emoji img {
  width: 1em;
  height: 1em;
}

markdown-style::before {
  display: table;
  content: "";
}

markdown-style::after {
  display: table;
  clear: both;
  content: "";
}

markdown-style>*:first-child {
  margin-top: 0 !important;
}

markdown-style>*:last-child {
  margin-bottom: 0 !important;
}

markdown-style a:not([href]) {
  color: inherit;
  text-decoration: none;
}

markdown-style .absent {
  color: var(--color-danger-fg);
}

markdown-style a.anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}

markdown-style a.anchor:focus {
  outline: none;
}

markdown-style p,
markdown-style blockquote,
markdown-style ul,
markdown-style ol,
markdown-style dl,
markdown-style table,
markdown-style pre,
markdown-style details {
  margin-top: 0;
  margin-bottom: 16px;
}

markdown-style blockquote>:first-child {
  margin-top: 0;
}

markdown-style blockquote>:last-child {
  margin-bottom: 0;
}

markdown-style sup>a::before {
  content: "[";
}

markdown-style sup>a::after {
  content: "]";
}

.markdown-body .octicon-video {
  border: 1px solid #d0d7de !important;
  border-radius: 6px !important;
  display: block;
}

markdown-style .octicon-video summary {
    border-bottom: 1px solid #d0d7de !important;
    padding: 8px 16px !important;
    cursor: pointer;
}

markdown-style .octicon-video > video {
    display: block !important;
    max-width: 100% !important;
    padding: 2px;
    box-sizing: border-box;
    border-bottom-right-radius: 6px !important;
    border-bottom-left-radius: 6px !important;
}

markdown-style details.octicon-video:not([open])>*:not(summary) {
    display: none !important;
}

markdown-style details.octicon-video:not([open]) > summary {
    border-bottom: 0 !important;
}

markdown-style h1 .octicon-link,
markdown-style h2 .octicon-link,
markdown-style h3 .octicon-link,
markdown-style h4 .octicon-link,
markdown-style h5 .octicon-link,
markdown-style h6 .octicon-link {
  color: var(--color-fg-default);
  vertical-align: middle;
  visibility: hidden;
}

markdown-style h1:hover .anchor,
markdown-style h2:hover .anchor,
markdown-style h3:hover .anchor,
markdown-style h4:hover .anchor,
markdown-style h5:hover .anchor,
markdown-style h6:hover .anchor {
  text-decoration: none;
}

markdown-style h1:hover .anchor .octicon-link,
markdown-style h2:hover .anchor .octicon-link,
markdown-style h3:hover .anchor .octicon-link,
markdown-style h4:hover .anchor .octicon-link,
markdown-style h5:hover .anchor .octicon-link,
markdown-style h6:hover .anchor .octicon-link {
  visibility: visible;
}

markdown-style h1 tt,
markdown-style h1 code,
markdown-style h2 tt,
markdown-style h2 code,
markdown-style h3 tt,
markdown-style h3 code,
markdown-style h4 tt,
markdown-style h4 code,
markdown-style h5 tt,
markdown-style h5 code,
markdown-style h6 tt,
markdown-style h6 code {
  padding: 0 .2em;
  font-size: inherit;
}

markdown-style ul.no-list,
markdown-style ol.no-list {
  padding: 0;
  list-style-type: none;
}

markdown-style ol[type="1"] {
  list-style-type: decimal;
}

markdown-style ol[type=a] {
  list-style-type: lower-alpha;
}

markdown-style ol[type=i] {
  list-style-type: lower-roman;
}

markdown-style div>ol:not([type]) {
  list-style-type: decimal;
}

markdown-style ul ul,
markdown-style ul ol,
markdown-style ol ol,
markdown-style ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

markdown-style li>p {
  margin-top: 16px;
}

markdown-style li+li {
  margin-top: .25em;
}

markdown-style dl {
  padding: 0;
}

markdown-style dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

markdown-style dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

markdown-style table th {
  font-weight: 600;
}

markdown-style table th,
markdown-style table td {
  padding: 6px 13px;
  border: 1px solid var(--color-border-default);
}

markdown-style table tr {
  background-color: var(--color-canvas-default);
  border-top: 1px solid var(--color-border-muted);
}

markdown-style table tr:nth-child(2n) {
  background-color: var(--color-canvas-subtle);
}

markdown-style table img {
  background-color: transparent;
  vertical-align: middle;
}

markdown-style img[align=right] {
  padding-left: 20px;
}

markdown-style img[align=left] {
  padding-right: 20px;
}

markdown-style .emoji {
  max-width: none;
  vertical-align: text-top;
  background-color: transparent;
}

markdown-style span.frame {
  display: block;
  overflow: hidden;
}

markdown-style span.frame>span {
  display: block;
  float: left;
  width: auto;
  padding: 7px;
  margin: 13px 0 0;
  overflow: hidden;
  border: 1px solid var(--color-border-default);
}

markdown-style span.frame span img {
  display: block;
  float: left;
}

markdown-style span.frame span span {
  display: block;
  padding: 5px 0 0;
  clear: both;
  color: var(--color-fg-default);
}

markdown-style span.align-center {
  display: block;
  overflow: hidden;
  clear: both;
}

markdown-style span.align-center>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: center;
}

markdown-style span.align-center span img {
  margin: 0 auto;
  text-align: center;
}

markdown-style span.align-right {
  display: block;
  overflow: hidden;
  clear: both;
}

markdown-style span.align-right>span {
  display: block;
  margin: 13px 0 0;
  overflow: hidden;
  text-align: right;
}

markdown-style span.align-right span img {
  margin: 0;
  text-align: right;
}

markdown-style span.float-left {
  display: block;
  float: left;
  margin-right: 13px;
  overflow: hidden;
}

markdown-style span.float-left span {
  margin: 13px 0 0;
}

markdown-style span.float-right {
  display: block;
  float: right;
  margin-left: 13px;
  overflow: hidden;
}

markdown-style span.float-right>span {
  display: block;
  margin: 13px auto 0;
  overflow: hidden;
  text-align: right;
}

markdown-style code,
markdown-style tt {
  padding: .2em .4em;
  margin: 0;
  font-size: 85%;
  background-color: var(--color-neutral-muted);
  border-radius: 6px;
}

markdown-style code br,
markdown-style tt br {
  display: none;
}

markdown-style del code {
  text-decoration: inherit;
}

markdown-style pre code {
  font-size: 100%;
}

markdown-style pre>code {
  padding: 0;
  margin: 0;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

markdown-style pre {
  position: relative;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--color-canvas-subtle);
  border-radius: 6px;
}

markdown-style pre code,
markdown-style pre tt {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

markdown-style pre > code {
  padding: 16px;
  overflow: auto;
  display: block;
}

markdown-style .csv-data td,
markdown-style .csv-data th {
  padding: 5px;
  overflow: hidden;
  font-size: 12px;
  line-height: 1;
  text-align: left;
  white-space: nowrap;
}

markdown-style .csv-data .blob-num {
  padding: 10px 8px 9px;
  text-align: right;
  background: var(--color-canvas-default);
  border: 0;
}

markdown-style .csv-data tr {
  border-top: 0;
}

markdown-style .csv-data th {
  font-weight: 600;
  background: var(--color-canvas-subtle);
  border-top: 0;
}

markdown-style .footnotes {
  font-size: 12px;
  color: var(--color-fg-muted);
  border-top: 1px solid var(--color-border-default);
}

markdown-style .footnotes ol {
  padding-left: 16px;
}

markdown-style .footnotes li {
  position: relative;
}

markdown-style .footnotes li:target::before {
  position: absolute;
  top: -8px;
  right: -8px;
  bottom: -8px;
  left: -24px;
  pointer-events: none;
  content: "";
  border: 2px solid var(--color-accent-emphasis);
  border-radius: 6px;
}

markdown-style .footnotes li:target {
  color: var(--color-fg-default);
}

markdown-style .footnotes .data-footnote-backref g-emoji {
  font-family: monospace;
}

markdown-style .task-list-item {
  list-style-type: none;
}

markdown-style .task-list-item label {
  font-weight: 400;
}

markdown-style .task-list-item.enabled label {
  cursor: pointer;
}

markdown-style .task-list-item+.task-list-item {
  margin-top: 3px;
}

markdown-style .task-list-item .handle {
  display: none;
}

markdown-style .task-list-item-checkbox,
markdown-style input[type="checkbox"] {
  margin: 0 .2em .25em -1.6em;
  vertical-align: middle;
}

markdown-style .contains-task-list:dir(rtl) .task-list-item-checkbox,
markdown-style .contains-task-list:dir(rtl) input[type="checkbox"] {
  margin: 0 -1.6em .25em .2em;
}

markdown-style ::-webkit-calendar-picker-indicator {
  filter: invert(50%);
}
</style>
<slot></slot>
`;
class MarkdownStyle extends HTMLElement {
    get theme() {
        const value = this.getAttribute('theme');
        return value === null ? '' : value;
    }
    set theme(name) {
        this.setAttribute('theme', name);
    }
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'open' });
        this.shadow.appendChild(__TEMPLATE__.content.cloneNode(true));
        const style = Array.prototype.slice
            .call(this.shadow.children)
            .find((item) => item.tagName === 'STYLE');
        if (style) {
            const id = '__MARKDOWN_STYLE__';
            const findStyle = document.getElementById(id);
            if (!findStyle) {
                style.id = id;
                document.head.append(style);
            }
        }
    }
    connectedCallback() {
        const disableThemeAutoSwitch = this.getAttribute('theme-auto-switch-disabled');
        if (disableThemeAutoSwitch == "" || disableThemeAutoSwitch && disableThemeAutoSwitch.toLowerCase() === 'true') {
            return;
        }
        if (!this.theme) {
            const { colorMode } = document.documentElement.dataset;
            this.theme = colorMode;
            const observer = new MutationObserver((mutationsList, observer) => {
                this.theme = document.documentElement.dataset.colorMode;
            });
            observer.observe(document.documentElement, { attributes: true });
            window.matchMedia('(prefers-color-scheme: light)').onchange = (event) => {
                this.theme = event.matches ? 'light' : 'dark';
            };
            window.matchMedia('(prefers-color-scheme: dark)').onchange = (event) => {
                this.theme = event.matches ? 'dark' : 'light';
            };
        }
    }
}
customElements.define('markdown-style', MarkdownStyle);