import { DrawElements, DrawElementType } from "./draw-elements/DrawElements";
import { GlobalId } from "./global-id";

export interface DrawElement<
  Type extends keyof DrawElements = DrawElementType
> {
  type: Type;
  id: GlobalId;
  props: DrawElements[Type];
}
