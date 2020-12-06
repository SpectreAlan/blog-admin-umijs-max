export const types = ['按钮', '菜单', '目录']
export function getSvg() {
  const files = require.context('../../../icons/svg', false, /.(svg)$/)
  for (let i = 0; i < files.keys().length; i++) {
    this.svg.push(files.keys()[i].match(/\.\/(\S*)\.svg/)[1])
  }
}
