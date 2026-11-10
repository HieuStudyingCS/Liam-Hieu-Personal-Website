const { createMarkdownProcessor } = await import(process.cwd() + '/node_modules/@astrojs/markdown-remark/dist/index.js');
const p = await createMarkdownProcessor({ syntaxHighlight: false });
const r = await p.render('Đoạn trước.\n\n<div data-widget="convex-conjugate" data-fn="abs"></div>\n\nĐoạn sau với $x$.\n');
console.log(r.code);
