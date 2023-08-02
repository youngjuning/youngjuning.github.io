---
title: 实现 sequelize 分页和条件查询
date: 2023-08-02 12:30:00
categories:
  - [全栈开发]
  - [数据库] 
tags:
  - 分页
  - sequelize
description: '最近在开发一个全栈应用，起手就是一套增删改查，写到列表查询时，分页接口如何实现费了一番功夫，遂记录一下，以便后续使用。'
---

<ins class="adsbygoogle" style="display:block; text-align:center;"  data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="ca-pub-7962287588031867" data-ad-slot="2542544532"></ins><script> (adsbygoogle = window.adsbygoogle || []).push({});</script>

## findAndCountAll 方法

`findAndCountAll` 会在查出列表记录的同时, 还会返回符合你查询列表数据的条数。

## 分页

```ts
async queryProjectList(params: { currentPage: number, pageSize: number }) {
  const { currentPage, pageSize } = params;
  const result = await UserModel.findAndCountAll({
    limit: params.pageSize, // 确保是 number 类型
    offset: (currentPage - 1) * pageSize, // 计算偏移量算法
  });
  return {
    data: result.rows,
    total: result.count
  };
}
```

## 条件查询

```ts
async queryProjectList(params: { pid: string, type: ProjectType }) {
  const { pid, type } = params;
  const condition: any = {
    deletedAt: null, // deletedAt 为 null 表示未删除，需要配合 paranoid 模型配置
  }
  // 模糊查询
  if (pid) {
    condition.pid = { [Op.like]: `%${pid}%` }
  }
  // 精确查询
  if(type) {
    condition.type = { [Op.eq]: type }
  }
  // ...
}
```

## distinct

如果使用了 `include` 参数，需要额外传入 `distinct: true` 配置来去除 `include` 的数量。

```ts
const result = await Model.findAndCountAll({
  limit: params.pageSize, // 确保是 number 类型
  offset: (currentPage - 1) * pageSize, // 计算偏移量算法
  include: [
    { model: HobbyModel},
    { model: FriendModel},
  ],
  distinct: true,
});
```

- [result.count for findAndCountAll is incorrect with include](https://github.com/sequelize/sequelize/issues/6418)

## 参考

- [sequelize模糊查询及分页](https://blog.csdn.net/qq_23521659/article/details/124871838)