const fs = require('fs');

if (!fs.existsSync('./images')) {
  return;
}
const notPicture = ['LICENSE', 'README.md', '.git', '.gitignore'];
const files = fs
  .readdirSync('./images')
  .filter((filename) => !notPicture.includes(filename))
  .map(
    (filename) =>
      `![洛竹的图床](https://cdn.jsdelivr.net/gh/youngjuning/images@main/${filename})`
  );

let result = ''
result += `---
title: 图床
date: 2023-02-21 18:40:00
description: 洛竹的图床，用于存放一些图片，方便在其他地方使用。
type: galleryGroup
---

> [洛竹的图床](https://github.com/youngjuning/images)，用于存放一些图片，方便在其他地方使用。
`;
result += '\n{% gallery true %}\n';
for (file of files) {
  result += file + '\n';
}
result += '{% endgallery %}';
fs.writeFileSync('./source/gallery/index.md', result);
