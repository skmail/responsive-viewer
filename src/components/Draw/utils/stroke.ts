export const applyStrokeDashArray = (dashArray?: number[], strokeWidth = 0) =>
  dashArray
    ? dashArray.map((dash, index) => {
        if ((index + 1) % 2 === 0) {
          return dash + strokeWidth
        }
        return dash
      })
    : []
