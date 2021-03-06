const rtlcss = require('rtlcss')

const getProcessedKeyframeValue = (decl, keyframes = [], dir) => {
  let value = decl.value
  keyframes.forEach(keyframe => {
    let nameRegex = new RegExp(`(^|\\s)${ keyframe }($|\\s)`)
    if (!value.match(nameRegex)) return
    value = value.replace(nameRegex, ` ${ keyframe }-${ dir } `)
  })
  return value
}

const rtlifyDecl = (decl, keyframes) => {
  let {prop, value} = decl

  if (decl.prop.match(/animation/)) {
    value = getProcessedKeyframeValue(decl, keyframes, 'rtl')
  } else {
    const rtlResult = rtlcss.process(decl, null, null)

    if (rtlResult === decl.toString()) {
      return null
    }

    [, prop, value] = rtlResult.match(/([^:]*):\s*(.*)/) || []

    value = value.replace(/\s*!important/, '')
  }
  return {prop, value}
}

const ltrifyDecl = (decl, keyframes) => {
  if (decl.prop.match(/animation/)) {
    decl.value = getProcessedKeyframeValue(decl, keyframes, 'ltr')
  }
  return decl
}

module.exports = {
  ltrifyDecl,
  rtlifyDecl
}
