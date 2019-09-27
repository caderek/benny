export type Suite = {
  on: (...args: any[]) => any
  add: (...args: any[]) => any
  run: (...args: any[]) => any
}
