export interface DrawElements {}

export type DrawElementType = keyof DrawElements;

export type DrawElementByType<Type extends DrawElementType> =
  DrawElements[Type];
