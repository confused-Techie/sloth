/**
 * Largly based on the fantastic work of the Mister Hope Vuewpress Theme Hope tabs package
 * MIT License
 * https://github.com/vuepress-theme-hope/vuepress-theme-hope/
 */

const { tab } = require("@mdit/plugin-tab");

const stringifyProp = (data) => {
  return JSON.stringify(data).replace(/'/g, "&#39");
};

module.exports = function tabs_plugin(md) {
  tab(md, {
    name: "tabs",

    tabsOpenRenderer: ({ active, data }, tokens, index) => {

      const { meta } = tokens[index];
      const titles = data.map(({ title }) => md.renderInline(title));
      const tabsData = data.map((item, index) => {
        const { id = titles[index] } = item;

        return { id };
      });

      return `\
<Tabs id="${index}" :data='${stringifyProp(tabsData)}'${
        active !== -1 ? ` :active="${active}"` : ""
      }${
        meta.id ? ` tab-id="${meta.id as string}"` : ""
      }>
${titles
  .map(
    (title, index) => `\
<template #title${index}="{ value, isActive }">${title}</template>
`,
  )
  .join("")}\
`;
    },

    tabsCloseRenderer: () => `\
</Tabs>
`,

    tabOpenRenderer: ({ index }) =>
      `\
<template #tab${index}="{ value, isActive }">
`,

    tabCloseRenderer: () => `\
</template>
`,
  });
};
