import { toVFile } from 'to-vfile'
import { remark } from 'remark'
import gfm from 'remark-gfm'
import FS from 'fs-extra'

const getHeadingText = (arr = [], title = '') => {
  arr.forEach(child => {
    title += child.value
    if (child.children && Array.isArray(child.children)) {
      title += getHeadingText(child.children, title)
    }
  })
  return title;
}

const getSoftwareName = (obj, result = { title: '' }) => {
  if (obj.value) {
    result.title += obj.value
  }
  if (obj.url) {
    result.url = obj.url
  }
  if (obj.type === 'delete') {
    result.delete = true
  }
  if (obj.children && Array.isArray(obj.children)) {
    obj.children.forEach(child => {
      result = getSoftwareName(child, result)
    })
  }
  return result
}

const getIconDetail = (data, url = '') => {
  if (data.type === 'imageReference' && data.identifier && /^(freeware\s+icon|oss\s+icon|app-store\s+icon|awesome-list\s+icon)/.test(data.identifier.toLocaleLowerCase())) {
    let type = ''
    if (/^(freeware\s+icon)/.test(data.identifier.toLocaleLowerCase())) {
      type = 'freeware'
    }
    if (/^(oss\s+icon)/.test(data.identifier.toLocaleLowerCase())) {
      type = 'oss'
    }
    if (/^(app-store\s+icon)/.test(data.identifier.toLocaleLowerCase())) {
      type = 'app-store'
    }
    if (/^(awesome-list\s+icon)/.test(data.identifier.toLocaleLowerCase())) {
      type = 'awesome-list'
    }
    return { type, url }
  }
  return false
}

/**
 * ```markdown
 * * [Atom](https://atom.io) - xxxxxxx. [![Open-Source Software][OSS Icon]](https://xxx) ![Freeware][Freeware Icon] [![Awesome List][awesome-list Icon]](https://xxx)
 * ```
 */
const getMarkIcons = (arr = [], parent = {}) => {
  let mark = { icons: [] }
  if (arr && Array.isArray(arr) && arr[1] && arr[1].type === 'text' && /^([\s]+)?-\s/.test(arr[1].value)) {
    mark = { ...mark, ...getSoftwareName(arr[0]) }
    arr = arr.filter(child => {
      const data = getIconDetail(child)
      if (data) {
        mark.icons.push(data)
        return false
      }
      if (child.type === 'link' && child.children && Array.isArray(child.children)) {
        const childArr = child.children.filter(d => getIconDetail(d))
        if (childArr.length > 0) {
          childArr.forEach((item) => {
            mark.icons.push(getIconDetail(item, child.url))
          })
          return false
        }
      }
      if (child.type === 'text' && child.value.replace(/\s/g, '') === '') {
        return false
      }
      return true
    });
  }
  return { children: [...arr], mark: { ...mark } }
}

const getMdToAST = (data = [], parent = {}) => {
  data = data.map((child) => {
    if (child.position) {
      delete child.position
      if (child.type === 'listItem') { 
        delete child.checked
        delete child.spread;
      }
      if (child.type === 'paragraph' && parent.type === 'listItem') {
        const result = getMarkIcons(child.children, child)
        child = { ...child, ...result }
      }
      if (child.type === 'heading') {
        child.value = getHeadingText(child.children)
        delete child.children
      }
    }
    if (child.children && Array.isArray(child.children)) {
      child.children = getMdToAST(child.children, child)
    }
    return child
  })
  return data
}

remark()
  .use(gfm)
  .use(() => (tree) => {
    const startIndex = tree.children.findIndex(item => item.type === 'html' && /<!--start-->/.test(item.value))
    const endIndex = tree.children.findIndex(item => item.type === 'html' && /<!--end-->/.test(item.value))
    const data = tree.children.slice(startIndex + 1, endIndex)
    const dataAST = getMdToAST([...data])
    FS.outputJsonSync('./dist/awesome-mac.json', dataAST)
    console.log(' create file: \x1b[32;1m ./dist/awesome-mac.json \x1b[0m');
  })
  .processSync(toVFile.readSync('README.md'))


remark()
  .use(gfm)
  .use(() => (tree) => {
    const startIndex = tree.children.findIndex(item => item.type === 'html' && /<!--start-->/.test(item.value))
    const endIndex = tree.children.findIndex(item => item.type === 'html' && /<!--end-->/.test(item.value))
    const data = tree.children.slice(startIndex + 1, endIndex)
    const dataAST = getMdToAST([...data])
    FS.outputJsonSync('./dist/awesome-mac.zh.json', dataAST)
    console.log(' create file: \x1b[32;1m ./dist/awesome-mac.zh.json \x1b[0m');
  })
  .processSync(toVFile.readSync('README-zh.md'))