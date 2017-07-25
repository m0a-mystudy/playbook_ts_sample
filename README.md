This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# typescriptでReact Storybookを試す。

react storybookをtypescriptで動かしました。


以下のコマンドで開発開始します。

tsの環境含めて作ってくれます。
```
$ create-react-app --scripts-version=react-scripts-ts  playbook_ts_sample
```

playbookを導入します

```
$ npm i -g @storybook/cli
$ cd playbook_ts_sample
$ getstorybook
```

上記コマンドで必要なパッケージが導入されます。
でもtypescriptで動かすには足りないものが幾つかあります
型定義ファイルです
型定義ファイルの命名規則がいつもと違うので悩みました

```
$ yarn add @types/storybook__react
$ yarn add @types/storybook__addon-actions
```

.storybook内に設定ファイルがあるので書き換えます

```diff:.storybook/config.js
unresolved, import/extensions */

import { configure } from '@storybook/react';

function loadStories() {
-  require('../stories');
+  require('../src/stories');
}

configure(loadStories, module);

```

``create-react-app``で作ったらソースは`src`に置いているのでそれに合わせて書き換えました。

.storybook内にwebpackのコンフィグファイルを追加します

```js:.storybook/webpack.config.js
const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config.js');

module.exports = (baseConfig, env) => {
  const config = genDefaultConfig(baseConfig, env);

  config.module.rules.push({
    test: /\.tsx?$/,
    exclude: /node_modules/,
    include: [/stories/, /components/],
    loader: "ts-loader"
  });
  config.resolve.extensions.push('.ts', '.tsx');

  return config;
};

```
これでtsxファイルを認識するようになります。

今回material-uiを使うためにaddonを導入したいんですが、
型定義ファイルがないので新規に作ることにしました。
型定義ファイルを自作するためにtsconfigを書き換えます。

```diff:tsconfig.json
{
  "compilerOptions": {
    "outDir": "build/dist",
    "module": "commonjs",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "moduleResolution": "node",
+   "baseUrl": ".",
+   "paths": {
+     "*": ["src/mytypes/*"]
+    },
    "rootDir": "src",
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  },
  "exclude": [
    "node_modules",
    "build",
    "scripts",
    "acceptance-tests",
    "webpack",
    "jest",
    "src/setupTests.ts"
  ],
  "types": [
    "typePatches"
  ]
}

```
上記変更で ``src/mytypes``に定義ファイルが置けるようになります。

``storybook-addon-material-ui`` を導入します

```
$ yarn add storybook-addon-material-ui
```

上記の型定義ファイルがないので自作します

```ts:src/mytypes/storybook-addon-material-ui/index.d.ts
import * as React from 'react';
import { StoryDecorator } from 'storybook__react'
export declare const ADDON_ID: string;
export declare const PANEL_ID: string;
export declare const EVENT_ID_INIT: string;
export declare const EVENT_ID_DATA: string;
export declare const CSS_CLASS: string;

export declare function muiTheme(): StoryDecorator;
export declare function muiTheme(theme: {}): StoryDecorator;

```

実際に上記アドオンを読み込みます。

```diff:.storybook/addons.js
  import '@storybook/addon-actions/register';
  import '@storybook/addon-links/register';
+ import 'storybook-addon-material-ui';
```

後はメインのファイルをいじります

componentsを作成します

```ts:src/components/CardExampleControlled.tsx
import * as React from 'react';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui';
import { FlatButton } from 'material-ui';
import { Toggle } from 'material-ui';

export interface CardExampleControlledProps {
}
export interface CardExampleControlledState {
  expanded: boolean;
}
export default class CardExampleControlled extends
  React.Component<CardExampleControlledProps, CardExampleControlledState> {

  constructor(props: CardExampleControlledProps) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  handleExpandChange = (expanded: boolean) => {
    this.setState({ expanded: expanded });
  }

  handleToggle = (event: {}, toggle: boolean) => {
    this.setState({ expanded: toggle });
  }

  handleExpand = () => {
    this.setState({ expanded: true });
  }

  handleReduce = () => {
    this.setState({ expanded: false });
  }

  render() {
    return (
      <Card expanded={this.state.expanded} onExpandChange={this.handleExpandChange}>
        <CardHeader
          title="URL Avatar"
          subtitle="Subtitle"
          avatar="http://www.material-ui.com/images/ok-128.jpg"
          actAsExpander={true}
          showExpandableButton={true}
        />
        <CardText>
          <Toggle
            toggled={this.state.expanded}
            onToggle={this.handleToggle}
            labelPosition="right"
            label="This toggle controls the expanded state of the component."
          />
        </CardText>
        <CardMedia
          expandable={true}
          overlay={<CardTitle title="Overlay title" subtitle="Overlay subtitle" />}
        >
          <img src="http://www.material-ui.com/images/nature-600-337.jpg" />
        </CardMedia>
        <CardTitle title="Card title" subtitle="Card subtitle" expandable={true} />
        <CardText expandable={true}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Donec mattis pretium massa. Aliquam erat volutpat. Nulla facilisi.
          Donec vulputate interdum sollicitudin. Nunc lacinia auctor quam sed pellentesque.
          Aliquam dui mauris, mattis quis lacus id, pellentesque lobortis odio.
        </CardText>
        <CardActions>
          <FlatButton label="Expand" onTouchTap={this.handleExpand} />
          <FlatButton label="Reduce" onTouchTap={this.handleReduce} />
        </CardActions>
      </Card>
    );
  }
}

```

上記のコンポーネントを使うStoryを作ります。

```ts:src/stories/index.tsx
import * as React from 'react';
import { storiesOf } from '@storybook/react';
import { muiTheme } from 'storybook-addon-material-ui';
import CardExampleControlled from 
storiesOf('Material-UI', module)
  // Add the `muiTheme` decorator to provide material-ui support to your stories.
  // If you do not specify any arguments it starts with two default themes
  // You can also configure `muiTheme` as a global decorator.
  .addDecorator(muiTheme())
  .add('Card Example Controlled', () => (
    <CardExampleControlled />
  ));
  // .add('Raised Button Example Simple', () => (
  //   <RaisedButtonExampleSimple />
  // ))
  // .add('Date Picker Example Simple', () => (
  //   <DatePickerExampleSimple />
  // ));
```
動かしてみます

```
$ yarn run storybook
```

http://localhost:6006 にアクセスします

![Storybook.png](https://qiita-image-store.s3.amazonaws.com/0/3844/28b50e11-9fd5-68be-819a-f0c73a4b9e21.png)

動きました。
