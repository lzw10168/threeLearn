// node 读取pages下的目录, 并删除子目录的index.html

const fs = require('fs');
const path = require('path');

const pagesPath = path.resolve(__dirname, './src/pages');

const pages = fs.readdirSync(pagesPath);

// 删除index.html
// pages.forEach(page => {
//   const pagePath = path.resolve(pagesPath, page);
//   const indexPath = path.resolve(pagePath, 'index.html');
//   if (fs.existsSync(indexPath)) {
//     fs.unlinkSync(indexPath);
//   }
// });

// 把index.ts改成index.tsx

pages.forEach(page => {
  // const pagePath = path.resolve(pagesPath, page, 'index.tsx');
  // let content = fs.readFileSync(pagePath, 'utf8')
  // content = content.replace('function Index() {', `
  // function Index() {
  //   useEffect(() => {
  // `)
  // content = content.replace('return <></>', `

  //   }, [])

  //   return <canvas id="mainCanvas" className="webgl"></canvas>
  // `)
  // content = `import { useEffect } from 'react'
  // `+ content
  // fs.writeFileSync(pagePath, content)
  // console.log(content)
  const pagePath = path.resolve(pagesPath, page, 'style.css');

  fs.unlink(pagePath, (err) => {
    // if (err) throw err;
    console.log('文件已删除');
  });

});


