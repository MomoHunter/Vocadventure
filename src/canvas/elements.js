export function AnimationObject (type, ...params) {
  this.type = type
  switch (type) {
    case 'teleportHomeMap':
      this.start = {
        x: params[0].x,
        y: params[0].y
      }
      this.goal = {
        x: params[1].x,
        y: params[1].y
      }
      this.counter = {
        number: 0,
        reverse: false
      }
      break
    case 'navigateOnMap':
      this.start = {
        x: params[0].x,
        y: params[0].y
      }
      this.current = {
        x: params[0].x,
        y: params[0].y
      }
      this.goal = {
        x: params[1].x,
        y: params[1].y
      }
      break
    default:
  }
}
