import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import arrayShuffle from 'shuffle-array'
import randomColor from 'randomcolor'
import seedrandom from 'seedrandom'

import { defaultRenderer } from './defaultRenderer'
import { fontSizeConverter, keys, omit, pick } from './helpers'

const handlersPropNames = [
  'onClick',
  'onDoubleClick',
  'onMouseMove',
  'onMouseOver',
  'onMouseOut',
  // rn handlers
  'onPress',
  'onPressIn',
  'onPressOut'
]
const cloudPropNames = [
  'tags',
  'shuffle',
  'renderer',
  'maxSize',
  'minSize',
  'colorOptions',
  'disableRandomColor',
  'randomSeed',
  'randomNumberGenerator',
  'containerComponent'
]

function getTagHashCode(tag) {
  return tag.key + tag.value + tag.count
}

function generateColor(tag, { disableRandomColor, colorOptions, randomSeed }) {
  if (tag.color) {
    return tag.color
  }
  if (disableRandomColor) {
    return undefined
  }
  return randomColor({
    seed: randomSeed && `${randomSeed}:${getTagHashCode(tag)}`,
    ...colorOptions
  })
}

function withTagCloudHandlers(elem, tag, cloudHandlers) {
  const origHandlers = pick(elem.props, handlersPropNames)
  const props = keys(cloudHandlers).reduce((acc, handlerName) => {
    if (cloudHandlers[handlerName] || origHandlers[handlerName]) {
      acc[handlerName] = (e) => {
        cloudHandlers[handlerName] && cloudHandlers[handlerName](tag, e)
        origHandlers[handlerName] && origHandlers(e)
      }
    }
    return acc
  }, {})
  return React.cloneElement(elem, props)
}

function renderTags(props, data) {
  const { minSize, maxSize } = props
  const counts = data.map(({ tag }) => tag.count)
  const min = Math.min(...counts)
  const max = Math.max(...counts)
  const cloudHandlers = pick(props, handlersPropNames)
  return data.map(({ tag, color }) => {
    const fontSize = fontSizeConverter(tag.count, min, max, minSize, maxSize)
    const elem = props.renderer(tag, fontSize, color)
    return withTagCloudHandlers(elem, tag, cloudHandlers)
  })
}

function randomize(props) {
  const { tags, shuffle, randomSeed, randomNumberGenerator } = props
  const rng = randomSeed ? seedrandom(randomSeed) : randomNumberGenerator
  const copy = tags.slice()
  const data = shuffle ? arrayShuffle(copy, { rng }) : copy
  return data.map((tag) => ({
    tag,
    color: generateColor(tag, props)
  }))
}

export function TagCloud({
  tags,
  maxSize,
  minSize,
  shuffle = true,
  colorOptions = {},
  renderer = defaultRenderer,
  className = 'tag-cloud',
  randomSeed,
  randomNumberGenerator,
  containerComponent: Container = 'div',
  ...otherProps
}) {
  const [data, setData] = useState([])
  const tagsComparison = tags.map(getTagHashCode).join(':')
  // randomize (color, shuffle) when tags or certain props change
  useEffect(() => {
    setData(randomize({ ...otherProps, tags }))
  }, [otherProps.colorOptions, otherProps.randomSeed, otherProps.shuffle, otherProps.disableRandomColor, tagsComparison])
  
  return <Container {...otherProps}>{renderTags({ ...otherProps, tags }, data)}</Container>
}

TagCloud.propTypes = {
  tags: PropTypes.array.isRequired,
  maxSize: PropTypes.number.isRequired,
  minSize: PropTypes.number.isRequired,
  shuffle: PropTypes.bool,
  colorOptions: PropTypes.object,
  disableRandomColor: PropTypes.bool,
  renderer: PropTypes.func,
  className: PropTypes.string,
  randomSeed: PropTypes.any,
  randomNumberGenerator: PropTypes.func,
  containerComponent: PropTypes.elementType
}
