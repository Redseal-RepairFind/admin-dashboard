// VerticalMenuState.ts
export class VerticalMenuState {
  static currentMenuId: string | null = null;

  static setMenu(id: string | null) {
    this.currentMenuId = id;
  }

  static getMenu() {
    return this.currentMenuId;
  }
}
