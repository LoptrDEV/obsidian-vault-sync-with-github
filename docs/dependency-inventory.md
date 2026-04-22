# Dependency Inventory

Generated from `package.json`, `package-lock.json`, and `.github/workflows/` on 2026-04-20.

## Summary

- declared npm packages: 12
- resolved lockfile package entries: 431
- unique resolved `name@version` packages: 418
- runtime network targets are GitHub endpoints only

## Declared NPM Packages

| Package | Declared range | Resolved top-level version | Kind |
| --- | --- | --- | --- |
| `@eslint/js` | `^9.39.4` | `9.39.4` | devDependency |
| `@eslint/json` | `^1.2.0` | `1.2.0` | devDependency |
| `@types/node` | `^24.12.2` | `24.12.2` | devDependency |
| `@typescript-eslint/utils` | `^8.58.2` | `8.58.2` | devDependency |
| `esbuild` | `^0.28.0` | `0.28.0` | devDependency |
| `eslint` | `^9.39.4` | `9.39.4` | devDependency |
| `eslint-plugin-obsidianmd` | `^0.2.4` | `0.2.4` | devDependency |
| `globals` | `^17.5.0` | `17.5.0` | devDependency |
| `obsidian` | `^1.12.3` | `1.12.3` | devDependency |
| `typescript` | `^6.0.3` | `6.0.3` | devDependency |
| `typescript-eslint` | `^8.58.2` | `8.58.2` | devDependency |
| `vitest` | `^4.1.4` | `4.1.4` | devDependency |

## GitHub Actions Dependencies

- `actions/checkout@v6`
- `actions/download-artifact@v8`
- `actions/setup-node@v6`
- `actions/attest@v4`
- `actions/upload-artifact@v7`
- `github/codeql-action/analyze@v4`
- `github/codeql-action/autobuild@v4`
- `github/codeql-action/init@v4`

## External Service Dependencies

- GitHub REST API: `https://api.github.com`
- GitHub login / device flow: `https://github.com/login/device` and `https://github.com/login/oauth/*`
- GitHub App metadata / installation pages: `https://github.com/apps/obsidian-vault-sync-with-github`
- GitHub-hosted CI environment with Node.js 24 for workflow runs

## Full Resolved NPM Package List

```text
@codemirror/state@6.5.0
@codemirror/view@6.38.6
@emnapi/core@1.9.2
@emnapi/runtime@1.9.2
@emnapi/wasi-threads@1.2.1
@esbuild/aix-ppc64@0.28.0
@esbuild/android-arm@0.28.0
@esbuild/android-arm64@0.28.0
@esbuild/android-x64@0.28.0
@esbuild/darwin-arm64@0.28.0
@esbuild/darwin-x64@0.28.0
@esbuild/freebsd-arm64@0.28.0
@esbuild/freebsd-x64@0.28.0
@esbuild/linux-arm@0.28.0
@esbuild/linux-arm64@0.28.0
@esbuild/linux-ia32@0.28.0
@esbuild/linux-loong64@0.28.0
@esbuild/linux-mips64el@0.28.0
@esbuild/linux-ppc64@0.28.0
@esbuild/linux-riscv64@0.28.0
@esbuild/linux-s390x@0.28.0
@esbuild/linux-x64@0.28.0
@esbuild/netbsd-arm64@0.28.0
@esbuild/netbsd-x64@0.28.0
@esbuild/openbsd-arm64@0.28.0
@esbuild/openbsd-x64@0.28.0
@esbuild/openharmony-arm64@0.28.0
@esbuild/sunos-x64@0.28.0
@esbuild/win32-arm64@0.28.0
@esbuild/win32-ia32@0.28.0
@esbuild/win32-x64@0.28.0
@eslint-community/eslint-utils@4.9.1
@eslint-community/regexpp@4.12.2
@eslint/config-array@0.21.2
@eslint/config-helpers@0.4.2
@eslint/core@0.17.0
@eslint/core@1.2.1
@eslint/eslintrc@3.3.5
@eslint/js@9.39.4
@eslint/json@0.14.0
@eslint/json@1.2.0
@eslint/object-schema@2.1.7
@eslint/plugin-kit@0.4.1
@eslint/plugin-kit@0.6.1
@humanfs/core@0.19.1
@humanfs/node@0.16.7
@humanwhocodes/module-importer@1.0.1
@humanwhocodes/momoa@3.3.10
@humanwhocodes/retry@0.4.3
@jridgewell/sourcemap-codec@1.5.5
@marijn/find-cluster-break@1.0.2
@microsoft/eslint-plugin-sdl@1.1.0
@napi-rs/wasm-runtime@1.1.4
@nodelib/fs.scandir@2.1.5
@nodelib/fs.stat@2.0.5
@nodelib/fs.walk@1.2.8
@oxc-project/types@0.126.0
@pkgr/core@0.1.2
@rolldown/binding-android-arm64@1.0.0-rc.16
@rolldown/binding-darwin-arm64@1.0.0-rc.16
@rolldown/binding-darwin-x64@1.0.0-rc.16
@rolldown/binding-freebsd-x64@1.0.0-rc.16
@rolldown/binding-linux-arm-gnueabihf@1.0.0-rc.16
@rolldown/binding-linux-arm64-gnu@1.0.0-rc.16
@rolldown/binding-linux-arm64-musl@1.0.0-rc.16
@rolldown/binding-linux-ppc64-gnu@1.0.0-rc.16
@rolldown/binding-linux-s390x-gnu@1.0.0-rc.16
@rolldown/binding-linux-x64-gnu@1.0.0-rc.16
@rolldown/binding-linux-x64-musl@1.0.0-rc.16
@rolldown/binding-openharmony-arm64@1.0.0-rc.16
@rolldown/binding-wasm32-wasi@1.0.0-rc.16
@rolldown/binding-win32-arm64-msvc@1.0.0-rc.16
@rolldown/binding-win32-x64-msvc@1.0.0-rc.16
@rolldown/pluginutils@1.0.0-rc.16
@rtsao/scc@1.1.0
@standard-schema/spec@1.1.0
@tybys/wasm-util@0.10.1
@types/chai@5.2.3
@types/codemirror@5.60.8
@types/deep-eql@4.0.2
@types/eslint@9.6.1
@types/estree@1.0.8
@types/json-schema@7.0.15
@types/json5@0.0.29
@types/node@20.12.12
@types/node@24.12.2
@types/tern@0.23.9
@typescript-eslint/eslint-plugin@8.58.2
@typescript-eslint/parser@8.58.2
@typescript-eslint/project-service@8.33.1
@typescript-eslint/project-service@8.58.2
@typescript-eslint/scope-manager@8.33.1
@typescript-eslint/scope-manager@8.58.2
@typescript-eslint/tsconfig-utils@8.33.1
@typescript-eslint/tsconfig-utils@8.58.2
@typescript-eslint/type-utils@8.58.2
@typescript-eslint/types@8.33.1
@typescript-eslint/types@8.58.2
@typescript-eslint/typescript-estree@8.33.1
@typescript-eslint/typescript-estree@8.58.2
@typescript-eslint/utils@8.33.1
@typescript-eslint/utils@8.58.2
@typescript-eslint/visitor-keys@8.33.1
@typescript-eslint/visitor-keys@8.58.2
@vitest/expect@4.1.4
@vitest/mocker@4.1.4
@vitest/pretty-format@4.1.4
@vitest/runner@4.1.4
@vitest/snapshot@4.1.4
@vitest/spy@4.1.4
@vitest/utils@4.1.4
acorn-jsx@5.3.2
acorn@8.15.0
ajv@6.14.0
ajv@8.18.0
ansi-styles@4.3.0
argparse@2.0.1
array-buffer-byte-length@1.0.2
array-includes@3.1.9
array.prototype.findlast@1.2.5
array.prototype.findlastindex@1.2.6
array.prototype.flat@1.3.3
array.prototype.flatmap@1.3.3
array.prototype.tosorted@1.1.4
arraybuffer.prototype.slice@1.0.4
assertion-error@2.0.1
async-function@1.0.0
available-typed-arrays@1.0.7
balanced-match@1.0.2
balanced-match@4.0.4
brace-expansion@1.1.14
brace-expansion@2.1.0
brace-expansion@5.0.5
braces@3.0.3
call-bind-apply-helpers@1.0.2
call-bind@1.0.8
call-bound@1.0.4
callsites@3.1.0
chai@6.2.2
chalk@4.1.2
color-convert@2.0.1
color-name@1.1.4
concat-map@0.0.1
convert-source-map@2.0.0
crelt@1.0.6
cross-spawn@7.0.6
data-view-buffer@1.0.2
data-view-byte-length@1.0.2
data-view-byte-offset@1.0.1
debug@3.2.7
debug@4.4.3
deep-is@0.1.4
define-data-property@1.1.4
define-properties@1.2.1
detect-libc@2.1.2
doctrine@2.1.0
dunder-proto@1.0.1
empathic@2.0.0
enhanced-resolve@5.18.4
es-abstract@1.24.1
es-define-property@1.0.1
es-errors@1.3.0
es-iterator-helpers@1.2.2
es-module-lexer@2.0.0
es-object-atoms@1.1.1
es-set-tostringtag@2.1.0
es-shim-unscopables@1.1.0
es-to-primitive@1.3.0
esbuild@0.28.0
escape-string-regexp@4.0.0
eslint-compat-utils@0.5.1
eslint-import-resolver-node@0.3.9
eslint-module-utils@2.12.1
eslint-plugin-depend@1.3.1
eslint-plugin-es-x@7.8.0
eslint-plugin-import@2.32.0
eslint-plugin-json-schema-validator@5.1.0
eslint-plugin-n@17.10.3
eslint-plugin-no-unsanitized@4.1.5
eslint-plugin-obsidianmd@0.2.4
eslint-plugin-react@7.37.3
eslint-plugin-security@1.4.0
eslint-plugin-security@2.1.1
eslint-scope@8.4.0
eslint-visitor-keys@3.4.3
eslint-visitor-keys@4.2.1
eslint-visitor-keys@5.0.1
eslint@9.39.4
espree@10.4.0
espree@9.6.1
esquery@1.7.0
esrecurse@4.3.0
estraverse@5.3.0
estree-walker@3.0.3
esutils@2.0.3
expect-type@1.3.0
fast-deep-equal@3.1.3
fast-glob@3.3.3
fast-json-stable-stringify@2.1.0
fast-levenshtein@2.0.6
fast-uri@3.1.0
fastq@1.20.1
fdir@6.5.0
file-entry-cache@8.0.0
fill-range@7.1.1
find-up@5.0.0
flat-cache@4.0.1
flatted@3.4.2
for-each@0.3.5
fsevents@2.3.3
function-bind@1.1.2
function.prototype.name@1.1.8
functions-have-names@1.2.3
generator-function@2.0.1
get-intrinsic@1.3.0
get-proto@1.0.1
get-symbol-description@1.1.0
get-tsconfig@4.13.0
glob-parent@5.1.2
glob-parent@6.0.2
globals@14.0.0
globals@15.15.0
globals@17.5.0
globalthis@1.0.4
gopd@1.2.0
graceful-fs@4.2.11
has-bigints@1.1.0
has-flag@4.0.0
has-property-descriptors@1.0.2
has-proto@1.2.0
has-symbols@1.1.0
has-tostringtag@1.0.2
hasown@2.0.2
ignore@5.3.2
ignore@7.0.5
import-fresh@3.3.1
imurmurhash@0.1.4
internal-slot@1.1.0
is-array-buffer@3.0.5
is-async-function@2.1.1
is-bigint@1.1.0
is-boolean-object@1.2.2
is-callable@1.2.7
is-core-module@2.16.1
is-data-view@1.0.2
is-date-object@1.1.0
is-extglob@2.1.1
is-finalizationregistry@1.1.1
is-generator-function@1.1.2
is-glob@4.0.3
is-map@2.0.3
is-negative-zero@2.0.3
is-number-object@1.1.1
is-number@7.0.0
is-regex@1.2.1
is-set@2.0.3
is-shared-array-buffer@1.0.4
is-string@1.1.1
is-symbol@1.1.1
is-typed-array@1.1.15
is-weakmap@2.0.2
is-weakref@1.1.1
is-weakset@2.0.4
isarray@2.0.5
isexe@2.0.0
iterator.prototype@1.1.5
js-tokens@4.0.0
js-yaml@4.1.1
json-buffer@3.0.1
json-schema-migrate@2.0.0
json-schema-traverse@0.4.1
json-schema-traverse@1.0.0
json-stable-stringify-without-jsonify@1.0.1
json5@1.0.2
jsonc-eslint-parser@2.4.2
jsx-ast-utils@3.3.5
keyv@4.5.4
levn@0.4.1
lightningcss-android-arm64@1.32.0
lightningcss-darwin-arm64@1.32.0
lightningcss-darwin-x64@1.32.0
lightningcss-freebsd-x64@1.32.0
lightningcss-linux-arm-gnueabihf@1.32.0
lightningcss-linux-arm64-gnu@1.32.0
lightningcss-linux-arm64-musl@1.32.0
lightningcss-linux-x64-gnu@1.32.0
lightningcss-linux-x64-musl@1.32.0
lightningcss-win32-arm64-msvc@1.32.0
lightningcss-win32-x64-msvc@1.32.0
lightningcss@1.32.0
locate-path@6.0.0
lodash.merge@4.6.2
loose-envify@1.4.0
magic-string@0.30.21
math-intrinsics@1.1.0
merge2@1.4.1
micromatch@4.0.8
minimatch@10.2.5
minimatch@3.1.5
minimatch@8.0.7
minimatch@9.0.9
minimist@1.2.8
module-replacements@2.10.1
moment@2.29.4
ms@2.1.3
nanoid@3.3.11
natural-compare@1.4.0
object-assign@4.1.1
object-inspect@1.13.4
object-keys@1.1.1
object.assign@4.1.7
object.entries@1.1.9
object.fromentries@2.0.8
object.groupby@1.0.3
object.values@1.2.1
obsidian@1.12.3
obug@2.1.1
optionator@0.9.4
own-keys@1.0.1
p-limit@3.1.0
p-locate@5.0.0
parent-module@1.0.1
path-exists@4.0.0
path-key@3.1.1
path-parse@1.0.7
pathe@2.0.3
picocolors@1.1.1
picomatch@2.3.2
picomatch@4.0.4
possible-typed-array-names@1.1.0
postcss@8.5.10
prelude-ls@1.2.1
prop-types@15.8.1
punycode@2.3.1
queue-microtask@1.2.3
react-is@16.13.1
reflect.getprototypeof@1.0.10
regexp-tree@0.1.27
regexp.prototype.flags@1.5.4
require-from-string@2.0.2
resolve-from@4.0.0
resolve-pkg-maps@1.0.0
resolve@1.22.11
resolve@2.0.0-next.5
ret@0.1.15
reusify@1.1.0
rolldown@1.0.0-rc.16
run-parallel@1.2.0
safe-array-concat@1.1.3
safe-buffer@5.2.1
safe-push-apply@1.0.0
safe-regex-test@1.1.0
safe-regex@1.1.0
safe-regex@2.1.1
semver@6.3.1
semver@7.7.4
set-function-length@1.2.2
set-function-name@2.0.2
set-proto@1.0.0
shebang-command@2.0.0
shebang-regex@3.0.0
side-channel-list@1.0.0
side-channel-map@1.0.1
side-channel-weakmap@1.0.2
side-channel@1.1.0
siginfo@2.0.0
source-map-js@1.2.1
stackback@0.0.2
std-env@4.1.0
stop-iteration-iterator@1.1.0
string.prototype.matchall@4.0.12
string.prototype.repeat@1.0.0
string.prototype.trim@1.2.10
string.prototype.trimend@1.0.9
string.prototype.trimstart@1.0.8
strip-bom@3.0.0
strip-json-comments@3.1.1
style-mod@4.1.3
supports-color@7.2.0
supports-preserve-symlinks-flag@1.0.0
synckit@0.9.3
tapable@2.3.0
tinybench@2.9.0
tinyexec@1.1.1
tinyglobby@0.2.16
tinyrainbow@3.1.0
to-regex-range@5.0.1
toml-eslint-parser@0.9.3
ts-api-utils@2.5.0
tsconfig-paths@3.15.0
tslib@2.8.1
tunnel-agent@0.6.0
type-check@0.4.0
typed-array-buffer@1.0.3
typed-array-byte-length@1.0.3
typed-array-byte-offset@1.0.4
typed-array-length@1.0.7
typescript-eslint@8.58.2
typescript@5.4.5
typescript@6.0.3
unbox-primitive@1.1.0
undici-types@5.26.5
undici-types@7.16.0
uri-js@4.4.1
vault-sync-with-github@1.1.0
vite@8.0.9
vitest@4.1.4
w3c-keyname@2.2.8
which-boxed-primitive@1.1.1
which-builtin-type@1.2.1
which-collection@1.0.2
which-typed-array@1.1.19
which@2.0.2
why-is-node-running@2.3.0
word-wrap@1.2.5
yaml-eslint-parser@1.3.2
yaml@2.8.3
yocto-queue@0.1.0
```
