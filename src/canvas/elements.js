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
      this.path = params[0]
      this.currentPoint = null
      this.playerPos = {
        x: params[1].x,
        y: params[1].y
      }
      this.vectors = {
        player: params[2],
        toGoal: { x: 0, y: 0 }
      }
      break
    case 'moveFirstSteps':
    case 'moveForward':
      this.counter = 0
      break
    case 'homeEnter':
      this.playerPos = {
        x: params[0].x,
        y: params[0].y + 150
      }
      break
    case 'homeLeave':
      this.playerPos = {
        x: params[0].x,
        y: params[0].y
      }
      break
    default:
  }
}
