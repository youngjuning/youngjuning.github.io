---
title: 如何在 React Native 中声明全局类型
description: 本文讲解了如何在 React Native 中声明全局类型
date: 2023-05-08 18:10:31
categories:
  - [前端, React Native]
tags:
  - TypeScript
  - React Native
  - export
  - 全局类型
  - global
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

要在 TypeScript 中声明全局类型：

1. 创建一个 `global.d.ts` 文件并在全局命名空间中声明类型。
2. 添加需要全局访问的类型或接口。
3. 使用 `export {}` 使文件成为模块。

在项目的 src 目录中，创建一个包含以下 `global.d.ts` 文件的 `types` 目录。

```ts
export {};

declare global {
  /**
   * 现在声明进入全局命名空间的类型，或者增加全局命名空间中的现有声明。
   */
  interface Employee {
    id: number;
    name: string;
    salary: number;
  }

  type Person = {
    name: string;
    age: number;
  };
}
```

上面的例子展示了如何创建一个修改全局命名空间的模块。 我们创建了一个全局可访问的 Employee 和 Person 类型。

现在我可以访问我项目中的类型，而无需导入它们。

```ts
const emp: Employee = {
  id: 1,
  name: 'James',
  salary: 100,
};

console.log(emp);

const person: Person = {
  name: 'Tom',
  age: 30,
};

console.log(person);
```

如果我们在 IDE 中遇到错误，请尝试将类型目录的路径添加到 `tsconfig.json` 文件中。

```json
{
  "compilerOptions": {
    "typeRoots": ["./types", "./node_modules/@types"]
  }
}
```

我们在 `global.d.ts` 文件中使用 `export {}` 行将其标记为外部模块。 模块是包含至少 1 个导入或导出语句的文件。 我们必须这样做才能扩大全局范围。
