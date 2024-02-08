import { tryParseJson } from './tryParseJson'

/**
 * Browser storage class
 *
 * @remarks Should be replaced with the `useBrowserStorage`
 * hook in the future.
 */
export class BrowserStorage<T = unknown> {
  private _key: string

  constructor(
    key: string,
    private _store = localStorage,
    private _fallback: T = null
  ) {
    this._key = `did_${key}`
  }

  /**
   * Get value
   *
   * @param fallback - Fallback value (defaults to `this._fallback`)
   */
  public get(fallback: T = this._fallback): T {
    return tryParseJson(this._store.getItem(this._key), fallback)
  }

  /**
   * Set value
   *
   * @param value - New value
   */
  public set(value: T): void {
    this._store.setItem(this._key, JSON.stringify(value))
  }

  /**
   * Merge value
   *
   * @param value - New value
   */
  public merge(value: T): void {
    const currentValue = this.get()
    const newValue = { ...currentValue, ...value }
    this._store.set(newValue)
  }
}
