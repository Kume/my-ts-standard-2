# 方針

- 以下のパッケージを含む
  - 共通のコアロジック
  - react-nativeアプリ (iOS/Windows/Web版対応)
    - androidが対象に含まれてないのは業務でも個人でもandroid対象のプロジェクトの予定がないため
  - react-nativeライブラリ : 未対応
  - eslintカスタムルール : 未対応
  - vite利用のSPA : 未対応
  - remix利用のMPA : 未対応
  - nextjs利用のMPA : 未対応
  - cli : 未対応
  - Web API : 未対応
- nodejsを使う
  - bun, deno はまだ業務で本格導入するのがちょっと怖いため
- パッケージマネージャーにはyarnを使う
  - 現状、react-nativeでsymbolic link を使うとトラブルが起こることがあるので、hoistingLimitsを使いたい (要調査)
  - pnpmの厳格なパッケージ管理(dependenciesにないパッケージはimportできない)も捨てがたい
- linterはeslintを使う
  - TypeScriptの型情報を利用したlintを使いたいため
- monorepo管理はturboとlernaを使う
  - lernaはコマンド管理、バージョン管理のため
  - turboはビルド管理のため (とはいえ、下記の通りできるだけビルドしない方針なので、無くても大丈夫だったり？)
- WebAPIを純粋なnodejsで実行するためにTypeScriptのビルドは行う
- ただし、開発の利便性のため、基本的にTypeScriptのビルドをしなくてもコードは書けるようにする
  - customConditionを使ってビルド前のTypeScriptの方を参照する
    - それやると型推論が遅くなるかも...?

# 初回作成時にやったこと

```sh
yarn set version berry
```

.yarnrc.yml に下記を追記

```yaml
nodeLinker: node-modules
```

package.json のプロパティを手動で追加 (仕事で使うときはlicenseフィールドの設定に気をつけてね)

```json
  "name": "my-ts-standard",
  "version": "2.0.0",
  "private": true,
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
```

ルートレベルで必要なパッケージをインストール

```sh
yarn add --dev typescript turbo prettier @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-eslint-comments
```

以下のファイルを追加

- .gitignore
- .prettierrc
- configs
  - tsconfig.json
  - tsconfig.lib.json
- .eslintrc.json

## eslint設定メモ

- prettierとの統合は[公式ドキュメント](https://prettier.io/docs/en/integrating-with-linters.html)の推奨の通りeslint-config-prettierで競合ルールをoffにする設定のみ

# 残課題

- eslintrcのプラグイン以外のとこの見直し
- eslintするとreactのバージョン設定についてwarningがでる
- ルートにeslintのルールを置いて、個別のeslintルールは適用されるのか？
  - ルートで個別設定はoverridesするのが良いかも https://qiita.com/isoken26/items/9af0b122beb826f38d46
- tsconfigの設定内容見直し
- turboの設定
- react-nativeのtsconfig、eslint設定を見てみる
  - 特別なことをしてなければプロジェクト共通設定を使うようにする

## 要調査

- react-native と hoistingLimits
- 明示的な依存関係を強制する

# 運用方法

## yarnのバージョンのアップグレード

```sh
yarn set version stable
```

## 依存パッケージのアップグレード

```sh
yarn upgrade-interactive
```
