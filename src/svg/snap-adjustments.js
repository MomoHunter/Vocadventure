Snap.closestPoint = function (path, x, y) {
  function distance2 (point) {
      return (point.x - x) ** 2 + (point.y - y) ** 2
  }
  const pathNode = path.node
  const pathLength = pathNode.getTotalLength()
  let precision = pathLength / 20 
  let bestPoint = { x: 0, y: 0 }
  let bestLength = 0
  let bestDistance = Infinity
  
  // linear scan for coarse approximation
  const sectionLength = precision * 0.9
  for (let len = 0; len <= pathLength; len += sectionLength) {
    const newPoint = pathNode.getPointAtLength(len)
    const newDistance = distance2(newPoint)
    if (newDistance < bestDistance) {
      bestPoint = newPoint
      bestLength = len
      bestDistance = newDistance
    }
  }
  
  // binary search for precise estimate
  while (precision > .25) {
    let beforeLength = Math.max(bestLength - precision, 0)
    let beforePoint = pathNode.getPointAtLength(beforeLength)
    let beforeDistance = distance2(beforePoint)
    let afterLength = Math.min(bestLength + precision, pathLength)
    let afterPoint = pathNode.getPointAtLength(afterLength)
    let afterDistance = distance2(afterPoint)

    if (beforeLength >= 0 && beforeDistance < bestDistance) {
      bestPoint = beforePoint
      bestLength = beforeLength
      bestDistance = beforeDistance
    } else if (afterLength <= pathLength && afterDistance < bestDistance) {
      bestPoint = afterPoint
      bestLength = afterLength
      bestDistance = afterDistance
    } else {
      precision *= 0.65
    }
  }

  return {
    x: bestPoint.x,
    y: bestPoint.y,
    length: bestLength,
    distance: Math.sqrt(bestDistance)
  }
} // https://bl.ocks.org/mbostock/8027637