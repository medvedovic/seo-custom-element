export function* validateTitle(title: string) {
  if (title.length > 60) {
    yield "Title is too long and might be truncated. Consider shortening your title to 50–60 characters.";
  }
}

export function* validateDescription(description: string) {
  if (description.length < 120 || description.length > 150) {
    yield "Consider keeping your description length between 120–150 characters.";
  }
}

export function* validateUrl(url: string) {
  if (url.includes("_")) {
    yield "Urls should not contain underscores as separators. Consider replacing underscores “_” with hyphens “-”.";
  }
}
