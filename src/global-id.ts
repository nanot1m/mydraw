export type GlobalId = string & { __TYPE__: "GlobalId" };

let id = 0;
export function getId(): GlobalId {
  id++;
  return (Date.now() + id).toString(32) as GlobalId;
}
