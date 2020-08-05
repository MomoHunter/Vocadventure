export function AnimationObject (type, ...params) {
  this.type = type
  switch (type) {
    case 'teleportHomeMap':
      this.goal = {
        x: params[1].x,
        y: params[1].y
      }
      this.counter = {
        height: 0,
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
      this.goalX = params[0]
      break
    case 'moveForward':
    case 'attackObstacle':
    case 'enemyAttack':
    case 'youDied':
      this.counter = 0
      break
    case 'homeEnter':
      this.first = true
      break
    case 'homeLeave':
      this.playerPos = {
        x: params[0].x,
        y: params[0].y
      }
      break
    case 'pickUpItems':
      this.counter = 0
      this.success = params[0]
      break
    default:
  }
}
