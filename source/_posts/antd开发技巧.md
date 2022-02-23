---
title: antd开发技巧
date: 2020-06-05 16:59:43
categories:
  - [前端开发,React]
tags:
  - antd
---

<!--more-->

## Form 表单

### 让Input 组件自动获取焦点

添加 `autoFocus` 属性：

```jsx
<Input autoFocus />
```

- https://github.com/ant-design/ant-design/issues/2952
- https://stackoverflow.com/questions/28889826/how-to-set-focus-on-an-input-field-after-rendering

## Table 表格

### table组件多选时，会选中下一页的表格同行数据的解决办法

> 解决办法来自：https://blog.csdn.net/weixin_41606276/article/details/99312155

类似选中某页的几行数据，在删除等操作后其他页面的表格或者删除后本表格的同行页为选中状态。这是因为没有区分每页表格的`id`。解决办法是给 Table 加上 `rowKey`

### defaultExpandAllRows={true} 刷新后不展开问题

> 解决办法来自：https://github.com/ant-design/ant-design/issues/4145#issuecomment-271230317

借助了key改变自动变成新的component，虽然可以解决默认问题。。但总觉得不是key正确的用法

```jsx
const [data,setData] = useState([])
const [expandedRowKeys, setExpandedRowKeys] = useState([]);

useEffect(() => {
  setExpandedRowKeys(listTableData.list.map(item => item.id));
}, [listTableData]);

const onExpand = (expanded, record) => {
  if (expanded) {
    setExpandedRowKeys([...expandedRowKeys, record.tableCode]);
  } else {
    setExpandedRowKeys(expandedRowKeys.filter(item => item !== record.tableCode));
  }
};

useEffect(() => {
  setData([{id:1},{id:2},{id:3}])
},[])
...
<Table
  dataSource={data}
  rowKey="id"
  expandedRowKeys={expandedRowKeys}
  onExpand={onExpand}
>
```

### 表格的column筛选排序状态重置问题

> 解决办法来自：https://github.com/ant-design/ant-design-pro/issues/3695#issuecomment-642460173

表格设置了排序以及筛选之后, 当我们从外部点击按钮刷新data时,数据列表实际并没有经过筛选排序。解决办法如下：

```jsx
const [sortedInfo, setSortedInfo] = useState({});
// 	分页、排序、筛选变化时触发
const handleTableChange = async (pagination, filters, sorter) => {
  setSortedInfo(sorter);
};
...
<Table onChange={handleTableChange}>
  ...
  <Column
    title="查看次数"
    dataIndex="queryCount"
    key="queryCount"
    sorter
    sortOrder={sortedInfo.columnKey === 'queryCount' && sortedInfo.order}
  />
  ...
</Table>
```

### Table Row Hover 时不改变背景

```css
.ant-table-thead>tr.ant-table-row-hover:not(.ant-table-expanded-row)>td,
.ant-table-tbody>tr.ant-table-row-hover:not(.ant-table-expanded-row)>td,
.ant-table-thead>tr:hover:not(.ant-table-expanded-row)>td,
.ant-table-tbody>tr:hover:not(.ant-table-expanded-row)>td {
  background: unset; //Change the existing color to `unset`
}
```

## Tooltip

### 如何更改ant-tooltip组件的文本颜色和背景颜色

> 解决办法来自: https://www.coder.work/article/3437880

```css
:global {
  .ant-tooltip-inner {
    color: #ffffff;
    background-color: rgba(0,0,0,0.6);
  }
  .ant-tooltip-arrow::before {
    background-color: rgba(0,0,0,0.6);
  }
  .ant-tooltip-placement-bottom .ant-tooltip-arrow, .ant-tooltip-placement-bottomLeft .ant-tooltip-arrow, .ant-tooltip-placement-bottomRight .ant-tooltip-arrow {
    border-bottom-color: #000000;
  }
}
```

## Icon

### 自定义svg图标

> 解决办法参考自: https://blog.csdn.net/c5211314963/article/details/103371845

如果你们的 UED 同学就是传给你一个 svg 图片，你可以按照下面的方式进行。

```jsx
import React from 'react';
import { Icon } from 'antd';

const PointIconSvg = ({ size = 1, color = '#1a37ea' }) => {
  return (
    <svg
      width={`${10 * size}px`}
      height={`${13 * size}px`}
      viewBox="0 0 10 13"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <g id="污染源档案" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g id="6企业详情-详细信息-环境管理-2" transform="translate(-698.000000, -746.000000)" fill={color} fillRule="nonzero">
          <g id="基本信息" transform="translate(24.000000, 335.000000)">
            <g id="编组-7" transform="translate(30.000000, 120.000000)">
              <g id="地图" transform="translate(0.000000, 273.000000)">
                <g id="编组" transform="translate(644.000000, 16.000000)">
                  <g id="编组-4">
                    <path
                      d="M4.99877841,2 C2.24285365,2 0,4.29103476 0,7.10616241 C0,9.82395853 4.48082093,14.6506047 4.67139018,14.8552505 C4.75690203,14.9475907 4.87661862,15 5.0012216,15 C5.0036648,15 5.00855119,15 5.01099438,15 C5.13804056,15 5.26020034,14.9401037 5.343269,14.8402764 L6.89469827,13.0259167 C8.95675544,10.4478787 10,8.4563256 10,7.10865809 C10,4.29103476 7.75714636,2 4.99877841,2 Z M4.99877841,9.42714533 C3.74297582,9.42714533 2.7266064,8.38894222 2.7266064,7.10616241 C2.7266064,5.82338261 3.74297582,4.78517949 4.99877841,4.78517949 C6.254581,4.78517949 7.27095042,5.82338261 7.27095042,7.10616241 C7.27095042,8.38894222 6.254581,9.42714533 4.99877841,9.42714533 Z"
                      id="形状"
                    />
                  </g>
                </g>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export default props => <Icon component={() => <PointIconSvg {...props} />} />;
```

## Button

### 点击动画边框css清除

```css
:global{
  .ant-click-animating-without-extra-node:after {
    border: 0 none;
    opacity: 0;
    animation:none 0 ease 0 1 normal;
  }
}
```
