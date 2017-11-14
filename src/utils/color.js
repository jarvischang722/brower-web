export const toRGB = (color) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  // eslint-disable-next-line no-param-reassign
  color = color.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b)

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color)
  return result ? [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16)
  ] : color
}

export const alpha = (color, a) => `rgba(${toRGB(color)}, ${a})`
