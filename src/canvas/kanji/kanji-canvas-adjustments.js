KanjiCanvas.fineClassification = function (inputPattern, inputCandidates, amount) {
  let inputLength = inputPattern.length
  let candidates = []

  for (let i = 0; i < Math.min(inputCandidates.length, 100); i++) {
    let j = inputCandidates[i][0]
    let iLength = KanjiCanvas.refPatterns[j][1]
    let iPattern = KanjiCanvas.refPatterns[j][2]

    if (inputLength < iLength + 2 && inputLength > iLength - 3) {
      let iMap = KanjiCanvas.getMap(iPattern, inputPattern, KanjiCanvas.initialDistance)
      iMap =  KanjiCanvas.completeMap(iPattern, inputPattern, KanjiCanvas.wholeWholeDistance, iMap)

      let dist = KanjiCanvas.computeWholeDistanceWeighted(iPattern, inputPattern, iMap)
      let n = inputLength
      let m = iPattern.length

      if (m > n) {
        m = n
      }

      dist = dist / m
      candidates.push([j, dist])
    }
  }
  candidates.sort((a, b) => a[1] - b[1])

  return candidates.slice(0, amount)
}

KanjiCanvas.recognize = function (id, amount = 10) {
  let mn = KanjiCanvas.momentNormalize(id)
  let extractedFeatures = KanjiCanvas.extractFeatures(mn, 20)
  let map = KanjiCanvas.getMap(extractedFeatures, KanjiCanvas.refPatterns[0][2], KanjiCanvas.endPointDistance)
  map = KanjiCanvas.completeMap(extractedFeatures, KanjiCanvas.refPatterns[0][2], KanjiCanvas.endPointDistance, map)
  let candidates = KanjiCanvas.coarseClassification(extractedFeatures)
  candidates = KanjiCanvas.fineClassification(extractedFeatures, candidates, amount)

  KanjiCanvas.redraw(id)

  // display candidates in the specified element
  if (KanjiCanvas["canvas_" + id].dataset.candidateList) {
    document.getElementById(KanjiCanvas["canvas_" + id].dataset.candidateList).innerHTML = candidates.join('  ')
  } else {
    return candidates
  }
}

KanjiCanvas.aran = function (width, height) {
  let r1 = 0
  if (height > width) {
    r1 = width / height
  } else {
    r1 = height / width
  }
  
  return Math.sqrt(Math.sin((Math.PI / 2) * r1))
}

KanjiCanvas.pythagoras = function (point1, point2) {
  // index 0 is x, index 1 is y
  let a = point1[0] - point2[0]
  let b = point1[1] - point2[1]
  return Math.sqrt((a * a) + (b * b))
}

KanjiCanvas.m00 = function (lines) {
  return lines.reduce((sum, line) => {
    return sum + line.length
  }, 0)
}

KanjiCanvas.m01 = function (lines) {
  return lines.reduce((sum, line) => {
    return sum + line.reduce((sum2, point) => {
      return sum2 + point[1]
    }, 0)
  }, 0)
}

KanjiCanvas.m10 = function (lines) {
  return lines.reduce((sum, line) => {
    return sum + line.reduce((sum2, point) => {
      return sum2 + point[0]
    }, 0)
  }, 0)
}

KanjiCanvas.mu20 = function (lines, xc) {
  return lines.reduce((sum, line) => {
    return sum + line.reduce((sum2, point) => {
      return sum2 + (point[0] - xc) ** 2
    }, 0)
  }, 0)
}

KanjiCanvas.mu02 = function (lines, yc) {
  return lines.reduce((sum, line) => {
    return sum + line.reduce((sum2, point) => {
      return sum2 + (point[1] - yc) ** 2
    }, 0)
  }, 0)
}

KanjiCanvas.transform = function (lines, xOffset, yOffset) {
  let correctedLines = []
  for (const line of lines) {
    let correctedLine = []
    for (const point of line) {
      correctedLine.push([
        point[0] + xOffset,
        point[1] + yOffset
      ])
    }
    correctedLines.push(correctedLine)
  }
  return correctedLines
}

KanjiCanvas.initialDistance = function (line1, line2) {
  const minLength = Math.min(line1.length, line2.length)
  const maxLength = Math.max(line1.length, line2.length)
  let dist = 0
  for (let i = 0; i < minLength; i++) {
    const point1 = line1[i]
    const point2 = line2[i]
    dist += Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1])
  }
  return dist * (maxLength / minLength)
}

KanjiCanvas.endPointDistance = function (line1, line2) {
  const length1 = line1.length
  const length2 = line2.length
  if (length1 === 0 || length2 === 0) {
    return 0
  }
  let point1 = line1[0]
  let point2 = line2[0]
  let dist = Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1])
  point1 = line1[length1 - 1]
  point2 = line2[length2 - 1]
  dist += Math.abs(point1[0] - point2[0]) + Math.abs(point1[1] - point2[1])
  return dist
}

KanjiCanvas.checkStrokes = function (character, lines) {
  const interval = 20
  const mnLines = KanjiCanvas.strokeMomentNormalize(lines)
  const streamlinedLines = KanjiCanvas.streamlineLines(mnLines, interval)

  let map = KanjiCanvas.getStrokeMap(character, streamlinedLines)
  if (!map) {
    return
  }
}

KanjiCanvas.strokeMomentNormalize = function (lines) {
  let sizes = {
    xMin: null,
    xMax: null,
    yMin: null,
    yMax: null,
    oldWidth: 0,
    oldHeight: 0,
    newWidth: 256,
    newHeight: 256
  }

  for (const line of lines) {
    for (const point of line) {
      const x = point[0]
      const y = point[1]
      if (sizes.xMin === null || sizes.xMin > x) {
        sizes.xMin = x
      }
      if (sizes.xMax === null || sizes.xMax < x) {
        sizes.xMax = x
      }
      if (sizes.yMin === null || sizes.yMin > y) {
        sizes.yMin = y
      }
      if (sizes.yMax === null || sizes.yMax < y) {
        sizes.yMax = y
      }
    }
  }

  sizes.oldWidth = Math.abs(sizes.xMax - sizes.xMin)
  sizes.oldHeight = Math.abs(sizes.yMax - sizes.yMin)

  const r2 = KanjiCanvas.aran(sizes.oldWidth, sizes.oldHeight)
  let aranWidth = sizes.newWidth
  let aranHeight = sizes.newHeight

  if (sizes.oldHeight > sizes.oldWidth) {
    aranWidth = r2 * sizes.newWidth
  } else {
    aranHeight = r2 * sizes.newHeight
  }

  const xOffset = (sizes.newWidth - aranWidth) / 2
  const yOffset = (sizes.newHeight - aranHeight) / 2

  const m00 = KanjiCanvas.m00(lines)
  const m01 = KanjiCanvas.m01(lines)
  const m10 = KanjiCanvas.m10(lines)

  const xc = m10 / m00
  const yc = m01 / m00

  const mu20 = KanjiCanvas.mu20(lines, xc)
  const mu02 = KanjiCanvas.mu02(lines, yc)

  const alpha = aranWidth / (4 * Math.sqrt(mu20 / m00)) || 0
  const beta = aranHeight / (4 * Math.sqrt(mu02 / m00)) || 0

  let newLines = []
  for (const line of lines) {
    let newLine = []
    for (const point of line) {
      newLine.push([
        alpha * (point[0] - xc) + (aranWidth / 2),
        beta * (point[1] - yc) + (aranHeight / 2)
      ])
    }
    newLines.push(newLine)
  }

  return KanjiCanvas.transform(newLines, xOffset, yOffset)
}

KanjiCanvas.streamlineLines = function (mnLines, interval) {
  let extractedPattern = []
  for (const line of mnLines) {
    let extractedLine = [line[0]] // always add first point
    let dist = 0
    let currentPointIndex = 1
    while (currentPointIndex < line.length) {
      dist += KanjiCanvas.pythagoras(line[currentPointIndex - 1], line[currentPointIndex])

      if (dist >= interval) {
        dist -= interval
        extractedLine.push(line[currentPointIndex])
      }
      currentPointIndex += 1
    }
    // if we so far have only one point, always add last point
    if (extractedLine.length === 1 || dist > 0.75 * interval) {
      extractedLine.push(line[line.length - 1])
    }
    extractedPattern.push(extractedLine)
  }
  return extractedPattern
}

KanjiCanvas.getStrokeMap = function (character, streamlinedLines) {
  const entry = KanjiCanvas.refPatterns.find(entry => entry[0] === character)
  if (!entry) {
    console.error('Pattern for character', character, 'not found!')
    return
  }
  const pattern = entry[2].slice(0, streamlinedLines.length)

  let strokeMap = KanjiCanvas.initStrokeMap2(streamlinedLines, pattern)
  console.log(strokeMap)

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < strokeMap.length; j++) {
      if (strokeMap[j] !== -1) {
        let djj = KanjiCanvas.endPointDistance(pattern[j], streamlinedLines[strokeMap[j]])
        for (let k = 0; k < strokeMap.length; k++) {
          if (strokeMap[j] !== -1 && strokeMap[k] !== -1) {
            let dkk = KanjiCanvas.endPointDistance(pattern[k], streamlinedLines[strokeMap[k]])
            let dkj = KanjiCanvas.endPointDistance(pattern[k], streamlinedLines[strokeMap[j]])
            let djk = KanjiCanvas.endPointDistance(pattern[j], streamlinedLines[strokeMap[k]])
            if (dkj + djk < djj + dkk) {
              let temp = strokeMap[k]
              strokeMap[k] = strokeMap[j]
              strokeMap[j] = temp
              djj = djk
            }
          } else {
            let djk = KanjiCanvas.endPointDistance(pattern[j], streamlinedLines[strokeMap[k]])
            if (djk < djj) {
              strokeMap[k] = strokeMap[j]
              strokeMap[j] = -1
              djj = djk
            }
          }
        }
      }
    }
  }
  return strokeMap
}

// pattern1 is the pattern of the user, pattern2 is the full correct pattern; pattern2 is always the longest
KanjiCanvas.initStrokeMap2 = function (pattern1, pattern2) {
  let map = []
  let free = []
  for (let i = 0; i < pattern2.length; i++) {
    map[i] = -1
    free[i] = true
  }
  for (let i = 0; i < pattern1.length; i++) {
    let minDist = null
    let minJ = -1
    for (let j = 0; j < pattern2.length; j++) {
      if (free[j]) {
        const dist = KanjiCanvas.initialDistance(pattern2[j], pattern1[i])
        if (minDist === null || dist < minDist) {
          minDist = dist
          minJ = j
        }
      }
    }
    free[minJ] = false
    map[minJ] = i
  }
  return map
}