const fs = require('fs');

const notPicture = ['LICENSE', '_config.yml', 'README.md', '.git', '.gitignore'];
const files = fs
  .readdirSync('./images')
  .filter((filename) => !notPicture.includes(filename))
  .map(
    (filename) =>
      `![](https://cdn.jsdelivr.net/gh/youngjuning/images@main/${filename})`
  );

let result = ''
result += `---
title: 图床
date: 2023-02-21 18:40:00
comments: false
description:
type: galleryGroup
---\n
`;
result += '{% gallery true %}\n';
for (file of files) {
  result += file + '\n';
}
result += '{% endgallery %}';
fs.writeFileSync('./source/images/index.md', result);
