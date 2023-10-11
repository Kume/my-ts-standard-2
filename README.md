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