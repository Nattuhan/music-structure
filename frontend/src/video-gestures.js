export const videoClickAction = ({ pendingSingleClick = false, coarsePointer = false } = {}) => {
  if (!pendingSingleClick) return "wait";
  return coarsePointer ? "seek" : "fullscreen";
};
